/**
 * scripts/cdn/build-local-manifest.ts
 *
 * Build src/registry/cdn-manifest.json by walking the LOCAL public/cdn/ tree
 * instead of listing S3. This is the bridge used BEFORE the live databayt-cdn
 * bucket is reachable: stage assets into public/cdn/ (namespaced) and the
 * /icons showroom renders them via urlBase "/cdn".
 *
 * Once S3 is live, switch to `pnpm cdn:manifest` (lists the bucket, urlBase →
 * https://cdn.databayt.org). The asset keys are identical either way, so the
 * showroom and every consuming repo are unaffected by the switch.
 *
 * Usage:
 *   tsx scripts/cdn/build-local-manifest.ts
 *   CDN_URL_BASE=/cdn tsx scripts/cdn/build-local-manifest.ts   # explicit
 */
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import type { CdnManifest, CdnAsset } from "@/lib/cdn";
import { classifyExcluded, provenanceSlug } from "./harvest-rules";

/** Assets skipped by the harvest rules, with the rule id that dropped them. */
const dropped: { key: string; reason: string }[] = [];

const ROOT = process.cwd();
const PUBLIC_CDN = resolve(ROOT, "public/cdn");
// Writes the committed manifest path so the showroom's static import just works
// (any cwd). Guard the local full-set version from being committed with:
//   git update-index --skip-worktree src/registry/cdn-manifest.json
// (the deploy-safe seed version stays in the index until the live S3 sweep).
const OUT = resolve(ROOT, "src/registry/cdn-manifest.json");
const URL_BASE = process.env.CDN_URL_BASE || "/cdn";
const DOMAIN = (process.env.NEXT_PUBLIC_CDN_DOMAIN || "cdn.databayt.org").trim();
const BUCKET = process.env.CDN_BUCKET || "databayt-cdn";

/** Skip OS/junk + non-asset cruft so the showroom stays clean. */
const SKIP_DIRS = new Set([".git", ".claude", ".backup", "node_modules"]);
const SKIP_FILES = new Set([".DS_Store", "Thumbs.db"]);
const ASSET_RE = /\.(svg|png|jpe?g|webp|avif|gif|ico|json|woff2?|ttf|otf|mp4|webm)$/i;

function guessContentType(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
    webp: "image/webp", avif: "image/avif", gif: "image/gif", ico: "image/x-icon",
    json: "application/json", woff2: "font/woff2", woff: "font/woff",
    ttf: "font/ttf", otf: "font/otf", mp4: "video/mp4", webm: "video/webm",
  };
  return map[ext] ?? "application/octet-stream";
}

function walk(dir: string, acc: CdnAsset[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(join(dir, entry.name), acc);
    } else if (entry.isFile()) {
      if (SKIP_FILES.has(entry.name) || !ASSET_RE.test(entry.name)) continue;
      const full = join(dir, entry.name);
      const key = relative(PUBLIC_CDN, full).split("\\").join("/");
      // Harvest rules: drop site chrome, partner/third-party logos, social icons,
      // letter/logomarks, and sub-brand marks (the crawler honours the same rules).
      const excluded = classifyExcluded(key);
      if (excluded) {
        dropped.push({ key, reason: excluded.id });
        continue;
      }
      const slug = provenanceSlug(key);
      acc.push({
        key,
        size: statSync(full).size,
        contentType: guessContentType(key),
        ...(slug ? { slug } : {}),
      });
    }
  }
}

function main() {
  let assets: CdnAsset[] = [];
  try {
    walk(PUBLIC_CDN, assets);
  } catch (err) {
    console.error(`Cannot read ${PUBLIC_CDN}. Stage assets there first.`, err);
    process.exit(1);
  }
  assets.sort((a, b) => a.key.localeCompare(b.key));

  const manifest: CdnManifest = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "local (public/cdn preview — pre-S3)",
    bucket: BUCKET,
    domain: DOMAIN,
    urlBase: URL_BASE,
    assets,
  };

  writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
  const byTop = assets.reduce<Record<string, number>>((m, a) => {
    const top = a.key.split("/")[0];
    m[top] = (m[top] ?? 0) + 1;
    return m;
  }, {});
  console.log(`Wrote ${assets.length} asset(s) → ${OUT}\n  urlBase: ${URL_BASE}`);
  console.log("  by namespace:", JSON.stringify(byTop));
  if (dropped.length) {
    const byReason = dropped.reduce<Record<string, number>>((m, d) => {
      m[d.reason] = (m[d.reason] ?? 0) + 1;
      return m;
    }, {});
    console.log(`  dropped ${dropped.length} by harvest rules:`, JSON.stringify(byReason));
  }
}

main();
