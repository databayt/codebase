#!/usr/bin/env tsx
/**
 * scripts/cdn/sync.ts
 *
 * Walks /public/cdn/** and uploads every file to the S3 bucket that backs
 * cdn.databayt.org (databayt-cdn), then optionally invalidates CloudFront.
 *
 * Modern infra notes:
 *   - The bucket has Block Public Access fully ON. Objects are NEVER public.
 *     Reads are served exclusively through CloudFront via Origin Access
 *     Control (OAC) — see the bucket policy in the runbook. This script only
 *     needs s3:PutObject (+ s3:ListBucket) and cloudfront:CreateInvalidation.
 *   - Assets are uploaded with an immutable, 1-year Cache-Control. Because the
 *     bucket holds fingerprint-stable keys, overwriting on re-run is harmless;
 *     the trailing CloudFront invalidation refreshes any edge copies.
 *
 * Usage:
 *   CDN_BUCKET=databayt-cdn AWS_REGION=us-east-1 \
 *     AWS_ACCESS_KEY_ID=… AWS_SECRET_ACCESS_KEY=… \
 *     [DISTRIBUTION_ID=EXXXXXXXXXX] \
 *     tsx scripts/cdn/sync.ts [--dry-run] [--concurrency=10]
 *
 * Flags:
 *   --dry-run        Print what would be uploaded. Makes NO AWS calls and needs
 *                    NO credentials. Safe to run anywhere.
 *   --concurrency=N  Parallel S3 PutObject calls (default: 8). Non-numeric or
 *                    non-positive values fall back to the default.
 *
 * The script is idempotent: re-running overwrites with identical bytes.
 */

import { createReadStream, readdirSync, statSync } from "node:fs";
import { classifyExcluded } from "./harvest-rules";
import { extname, join, relative } from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";

// ---------------------------------------------------------------------------
// Config (all from env / argv — no secrets hardcoded)
// ---------------------------------------------------------------------------
const BUCKET = process.env.CDN_BUCKET || "databayt-cdn";
const REGION = process.env.AWS_REGION || "us-east-1";
const DISTRIBUTION_ID = process.env.DISTRIBUTION_ID || "";
const DRY_RUN = process.argv.includes("--dry-run");

/**
 * Optional namespace filter: `--prefix=airbnb` uploads only `airbnb/**` and
 * scopes the CloudFront invalidation to `/airbnb/*`. Omit to sweep all of
 * public/cdn/ and invalidate `/*` (the original behaviour).
 */
const PREFIX = (() => {
  const flag = process.argv.find((a) => a.startsWith("--prefix="));
  return flag ? (flag.split("=")[1] ?? "").replace(/^\/+|\/+$/g, "") : "";
})();

/** Parse --concurrency=N defensively: NaN / <=0 must NOT silently disable uploads. */
const CONCURRENCY = (() => {
  const flag = process.argv.find((a) => a.startsWith("--concurrency="));
  if (!flag) return 8;
  const n = parseInt(flag.split("=")[1] ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : 8;
})();

/** Public dir that mirrors the CDN key namespace. */
const PUBLIC_CDN_DIR = join(process.cwd(), "public", "cdn");

// ---------------------------------------------------------------------------
// Content-Type map
// ---------------------------------------------------------------------------
const MIME: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

function contentType(file: string): string {
  return MIME[extname(file).toLowerCase()] ?? "application/octet-stream";
}

/** Immutable cache header — correct for versioned/fingerprinted CDN assets. */
const CACHE_CONTROL = "public, max-age=31536000, immutable";

// ---------------------------------------------------------------------------
// File walker
// ---------------------------------------------------------------------------
function walk(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...walk(full));
    } else if (e.isFile()) {
      files.push(full);
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// Concurrency limiter
// ---------------------------------------------------------------------------
async function pool<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  if (items.length === 0) return;
  const queue = [...items];
  // Clamp to [1, items.length]; never 0 (would run no workers and upload nothing).
  const workerCount = Math.max(1, Math.min(limit, items.length));
  const workers = Array.from({ length: workerCount }, async () => {
    while (queue.length > 0) {
      const item = queue.shift()!;
      await fn(item);
    }
  });
  await Promise.all(workers);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const walked = walk(PUBLIC_CDN_DIR);

  // Harvest rules: never upload site chrome, partner/third-party logos, social
  // icons, letter/logomarks, or vendor sub-brand marks (same rules the manifest
  // builder and crawlers honour — junk never reaches S3).
  const allFiles: string[] = [];
  let skipped = 0;
  for (const absPath of walked) {
    const key = relative(PUBLIC_CDN_DIR, absPath).replace(/\\/g, "/");
    if (PREFIX && !key.startsWith(`${PREFIX}/`)) continue;
    if (classifyExcluded(key)) {
      skipped++;
      continue;
    }
    allFiles.push(absPath);
  }
  if (skipped) console.log(`Harvest rules skipped ${skipped} junk file(s).`);
  if (PREFIX) console.log(`Prefix filter: only uploading ${PREFIX}/** .`);

  if (allFiles.length === 0) {
    console.log(`No files found under ${PUBLIC_CDN_DIR}. Nothing to do.`);
    return;
  }

  console.log(
    `\n${DRY_RUN ? "[DRY RUN] " : ""}Uploading ${allFiles.length} file(s) to s3://${BUCKET}/ (region: ${REGION}, concurrency: ${CONCURRENCY})\n`,
  );

  // Defer client construction so --dry-run never needs credentials.
  const s3 = DRY_RUN ? null : new S3Client({ region: REGION });

  let uploaded = 0;
  let failed = 0;
  const errors: string[] = [];

  await pool(allFiles, CONCURRENCY, async (absPath) => {
    // Derive the S3 key relative to public/cdn/
    // e.g. /…/public/cdn/anthropic/wordmark.svg → anthropic/wordmark.svg
    const key = relative(PUBLIC_CDN_DIR, absPath).replace(/\\/g, "/");
    const ct = contentType(absPath);
    const size = statSync(absPath).size;

    const label = `  ${key} (${ct}, ${(size / 1024).toFixed(1)} KB)`;

    if (DRY_RUN || !s3) {
      console.log(`[dry-run] would upload ${label}`);
      uploaded++;
      return;
    }

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: createReadStream(absPath),
          ContentLength: size, // explicit length avoids chunked-encoding edge cases
          ContentType: ct,
          CacheControl: CACHE_CONTROL,
        }),
      );
      console.log(`✓ uploaded ${label}`);
      uploaded++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`✗ failed  ${key}: ${msg}`);
      errors.push(`${key}: ${msg}`);
      failed++;
    }
  });

  console.log(`\nDone: ${uploaded} uploaded, ${failed} failed.`);

  if (errors.length > 0) {
    console.error("\nFailed keys:");
    errors.forEach((e) => console.error(" ", e));
  }

  // -------------------------------------------------------------------------
  // CloudFront invalidation (CF API region is always us-east-1)
  // -------------------------------------------------------------------------
  const invalidationPath = PREFIX ? `/${PREFIX}/*` : "/*";
  if (!DRY_RUN && DISTRIBUTION_ID && uploaded > 0) {
    console.log(
      `\nCreating CloudFront invalidation ${invalidationPath} on distribution ${DISTRIBUTION_ID} …`,
    );
    const cf = new CloudFrontClient({ region: "us-east-1" });
    try {
      const res = await cf.send(
        new CreateInvalidationCommand({
          DistributionId: DISTRIBUTION_ID,
          InvalidationBatch: {
            Paths: { Quantity: 1, Items: [invalidationPath] },
            CallerReference: `cdn-sync-${Date.now()}`,
          },
        }),
      );
      console.log(
        `Invalidation created: ${res.Invalidation?.Id ?? "(unknown id)"}`,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`CloudFront invalidation failed: ${msg}`);
      // Non-fatal — assets are uploaded; warn and continue.
    }
  } else if (DRY_RUN && DISTRIBUTION_ID) {
    console.log(
      `[dry-run] would create CloudFront invalidation ${invalidationPath} on ${DISTRIBUTION_ID}`,
    );
  }

  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
