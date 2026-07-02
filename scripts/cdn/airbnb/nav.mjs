#!/usr/bin/env node
/**
 * scripts/cdn/airbnb/nav.mjs
 *
 * Airbnb's signature 3D navigation icons — Homes (house + tree), Experiences
 * (hot-air balloon), Services (concierge bell). On airbnb.com these are the
 * animated 3D marks in the top tab bar; the site serves them as high-res PNGs
 * from a0.muscache.com (the interaction animation itself is Lottie embedded in
 * a JS bundle, not a fetchable file). We take one clean, transparent pose of
 * each, downscale to a CDN-friendly 512px, and stage under public/cdn/airbnb/.
 *
 * Source collection: airbnb-platform-assets / AirbnbPlatformAssets-search-bar-icons.
 * Each tab exposes two animation keyframes (…-1 / …-2 below); we keep the -1 pose.
 *
 * Usage:  node scripts/cdn/airbnb/nav.mjs        (needs macOS `sips` for resize)
 *         node scripts/cdn/airbnb/nav.mjs --keep-frames   (also stage the -2 poses)
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../public/cdn/airbnb");
const BASE =
  "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original";
const KEEP_FRAMES = process.argv.includes("--keep-frames");

// slug → [primary pose uuid, alternate keyframe uuid]
const ICONS = {
  homes: ["a32adab1-f9df-47e1-a411-bdff91b579c3", "4aae4ed7-5939-4e76-b100-e69440ebeae4"],
  experiences: ["e47ab655-027b-4679-b2e6-df1c99a5c33d", "1e24b1c9-b070-48d9-8a70-91aae3151830"],
  services: ["3d67e9a9-520a-49ee-b439-7b3a75ea814d", "2bf5d36d-e731-4465-a8ef-91abbf2ae8ce"],
};

// The SAME three marks also ship as transparent WebM "twirl" animations (idle +
// selected state) — Airbnb's real motion assets, served straight from muscache.
const ANIM_BASE = "https://a0.muscache.com/videos/search-bar-icons/webm";
// Each mark ships three motion states: the idle "twirl", the "selected" loop,
// and the "twirl-selected" transition. All transparent WebM, original quality.
const ANIMATIONS = {
  "homes": "house-twirl", "homes-selected": "house-selected", "homes-twirl-selected": "house-twirl-selected",
  "experiences": "balloon-twirl", "experiences-selected": "balloon-selected", "experiences-twirl-selected": "balloon-twirl-selected",
  "services": "consierge-twirl", "services-selected": "consierge-selected", "services-twirl-selected": "consierge-twirl-selected",
};

async function fetchBuf(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
  const written = [];
  for (const [slug, [primary, alt]] of Object.entries(ICONS)) {
    const jobs = KEEP_FRAMES ? [[slug, primary], [`${slug}-2`, alt]] : [[slug, primary]];
    for (const [name, uuid] of jobs) {
      const dest = join(OUT, `${name}.png`);
      writeFileSync(dest, await fetchBuf(`${BASE}/${uuid}.png`));
      execFileSync("sips", ["-Z", "512", dest], { stdio: "ignore" }); // downscale in place, keep alpha
      written.push(`${name}.png`);
    }
  }
  for (const [name, src] of Object.entries(ANIMATIONS)) {
    writeFileSync(join(OUT, `${name}.webm`), await fetchBuf(`${ANIM_BASE}/${src}.webm`));
    written.push(`${name}.webm`);
  }
  console.log(`Staged ${written.length} Airbnb nav asset(s) → ${OUT}\n  ${written.join("  ")}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
