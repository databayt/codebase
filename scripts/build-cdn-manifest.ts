/**
 * scripts/build-cdn-manifest.ts
 *
 * Generate src/registry/cdn-manifest.json from the live databayt-cdn S3 bucket.
 * Feeds the /[lang]/icons showroom in the codebase repo and every consuming repo.
 *
 * Usage:
 *   CDN_BUCKET=databayt-cdn AWS_REGION=us-east-1 \
 *     NEXT_PUBLIC_CDN_DOMAIN=cdn.databayt.org \
 *     AWS_ACCESS_KEY_ID=… AWS_SECRET_ACCESS_KEY=… \
 *     tsx scripts/build-cdn-manifest.ts [--flatten-vendor]
 *
 * Optional env:
 *   AWS_ENDPOINT_URL_S3  — point at a local MinIO / custom S3 endpoint for local
 *                          testing. Leave unset for real AWS S3 (default).
 *   CDN_URL_BASE         — override where the showroom loads assets from.
 *                          Defaults to https://<NEXT_PUBLIC_CDN_DOMAIN>
 *                          (i.e. https://cdn.databayt.org via CloudFront).
 *                          Set to "/cdn" to use the bundled seed files in
 *                          public/cdn/ (decoupled local preview before S3 fills).
 *
 * --flatten-vendor  Collapses brand sub-folders into <brand>/<file> so that
 *                   anthropic/icons/anthropic-wordmark.svg → anthropic/wordmark.svg.
 *                   Useful to preview the target key shape before re-keying the bucket.
 *
 * Output type: CdnManifest (src/lib/cdn.ts). generatedAt is today's ISO date
 * (YYYY-MM-DD), written at run time via new Date().
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import type { CdnManifest, CdnAsset } from "@/lib/cdn";
import { provenanceSlug } from "./cdn/harvest-rules";

// ---------------------------------------------------------------------------
// Config (all from env / argv — no secrets hardcoded)
// ---------------------------------------------------------------------------
const BUCKET = process.env.CDN_BUCKET || "databayt-cdn";
const REGION = process.env.AWS_REGION || "us-east-1";
/** Optional: custom S3-compatible endpoint (MinIO, localstack). Unset for AWS. */
const ENDPOINT = process.env.AWS_ENDPOINT_URL_S3;
const DOMAIN = (process.env.NEXT_PUBLIC_CDN_DOMAIN || "cdn.databayt.org").trim();
/**
 * Where the showroom renders assets from.
 *  - Default (AWS live): https://cdn.databayt.org  (CloudFront in front of OAC bucket)
 *  - Local seed preview: override CDN_URL_BASE=/cdn → public/cdn/ is used.
 *  - Custom endpoint:    auto-derives the bucket sub-domain of the endpoint.
 */
const URL_BASE: string = (() => {
  if (process.env.CDN_URL_BASE) return process.env.CDN_URL_BASE;
  if (ENDPOINT) {
    // e.g. https://t3.storage.dev → https://databayt-cdn.t3.storage.dev
    // Strip scheme AND any trailing slash so the host is well-formed.
    const host = ENDPOINT.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    return `https://${BUCKET}.${host}`;
  }
  return `https://${DOMAIN}`;
})();

const FLATTEN_VENDOR = process.argv.includes("--flatten-vendor");
const OUT = resolve(process.cwd(), "src/registry/cdn-manifest.json");

/** Known vendor brand prefixes eligible for sub-folder flattening. */
const VENDORS = new Set(["anthropic", "airbnb", "apple", "google", "openai"]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function flatten(key: string): string {
  if (!FLATTEN_VENDOR) return key;
  const parts = key.split("/");
  if (parts.length < 3) return key; // already flat or top-level — nothing to collapse
  const brand = parts[0];
  if (!VENDORS.has(brand)) return key;
  // Collapse <brand>/<category>/…/<file> → <brand>/<file>, and strip a
  // redundant leading "<brand>-" from the filename:
  //   anthropic/brand/anthropic-wordmark.svg → anthropic/wordmark.svg
  let file = parts[parts.length - 1];
  if (file.toLowerCase().startsWith(`${brand}-`)) {
    file = file.slice(brand.length + 1);
  }
  return `${brand}/${file}`;
}

/** Infer a Content-Type from a key's extension for the manifest. */
function guessContentType(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    avif: "image/avif",
    gif: "image/gif",
    ico: "image/x-icon",
    json: "application/json",
    woff2: "font/woff2",
    woff: "font/woff",
    ttf: "font/ttf",
    mp4: "video/mp4",
    webm: "video/webm",
  };
  return map[ext] ?? "application/octet-stream";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(
    `Listing s3://${BUCKET}/ (region: ${REGION}${ENDPOINT ? `, endpoint: ${ENDPOINT}` : ""}) …`,
  );

  const s3 = new S3Client({
    region: REGION,
    ...(ENDPOINT ? { endpoint: ENDPOINT } : {}),
  });

  const assets: CdnAsset[] = [];
  let token: string | undefined;
  let pageCount = 0;

  do {
    const res = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }),
    );
    pageCount++;
    for (const obj of res.Contents ?? []) {
      if (!obj.Key || obj.Key.endsWith("/")) continue; // skip folder placeholders
      const resolvedKey = flatten(obj.Key);
      const slug = provenanceSlug(resolvedKey);
      assets.push({
        key: resolvedKey,
        size: obj.Size,
        contentType: guessContentType(resolvedKey),
        ...(slug ? { slug } : {}),
      });
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);

  console.log(`Scanned ${pageCount} page(s), found ${assets.length} object(s).`);

  assets.sort((a, b) => a.key.localeCompare(b.key));

  const manifest: CdnManifest = {
    generatedAt: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    source: FLATTEN_VENDOR ? "s3 (vendor-flattened preview)" : "s3",
    bucket: BUCKET,
    domain: DOMAIN,
    urlBase: URL_BASE,
    assets,
  };

  writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `Wrote ${assets.length} asset(s)\n  bucket : s3://${BUCKET}\n  urlBase: ${URL_BASE}\n  output : ${OUT}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
