#!/usr/bin/env node
/**
 * scripts/cdn/airbnb/host-videos.mjs
 *
 * Airbnb's host-onboarding hero videos — the looping intro clips on the "about
 * your place", "stand out", and "finish setup" wizard screens. Airbnb streams
 * them from stream.media.muscache.com; mkan reuses the same three, so we mirror
 * them onto the CDN as plain MP4 files (fetched at v_q=high, original quality).
 *
 * Usage:  node scripts/cdn/airbnb/host-videos.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../public/cdn/airbnb");
const BASE = "https://stream.media.muscache.com";

// slug → muscache stream id
const VIDEOS = {
  "host-about-place":  "zFaydEaihX6LP01x8TSCl76WHblb01Z01RrFELxyCXoNek",
  "host-stand-out":    "H0101WTUG2qWbyFhy02jlOggSkpsM9H02VOWN52g02oxhDVM",
  "host-finish-setup": "KeNKUpa01dRaT5g00SSBV95FqXYkqf01DJdzn01F1aT00vCI",
};

async function fetchBuf(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
  const written = [];
  for (const [slug, id] of Object.entries(VIDEOS)) {
    writeFileSync(join(OUT, `${slug}.mp4`), await fetchBuf(`${BASE}/${id}.mp4?v_q=high`));
    written.push(`${slug}.mp4`);
  }
  console.log(`Staged ${written.length} Airbnb host video(s) → ${OUT}\n  ${written.join("  ")}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
