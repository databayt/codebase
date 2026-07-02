#!/usr/bin/env node
/**
 * scripts/cdn/airbnb/destinations.mjs
 *
 * Airbnb's "Where to?" autosuggest destination icons — the small rounded
 * map/landmark glyphs shown in the search-location dropdown. Airbnb serves them
 * as PNGs from a0.muscache.com under two AirbnbPlatformAssets-hawaii-autosuggest-
 * destination-icons collections (…-1 / …-2). mkan reuses seven of them for its
 * Port Sudan "Where" suggestions; we mirror those seven onto the CDN so the app
 * never hot-links muscache. Downscaled to 128px (they render at ~56px).
 *
 * Usage:  node scripts/cdn/airbnb/destinations.mjs   (needs macOS `sips` for resize)
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../public/cdn/airbnb/destinations");
const BASE = "https://a0.muscache.com/im/pictures/airbnb-platform-assets";

// slug → [collection number (1|2), uuid]. The two AirbnbPlatformAssets-hawaii-
// autosuggest-destination-icons-{1,2} sets on muscache.
const ICONS = {
  "nearby":             [2, "ea5e5ee3-e9d8-48a1-b7e9-1003bf6fe850"],
  "port-sudan":         [1, "c98f58bf-8512-43e3-af54-6c1f0b2c8a23"],
  "coral-coast":        [2, "e6abaebf-f910-42e2-b891-d8f262b6ee1d"],
  "marina":             [1, "5d2ff9e9-9e15-45b9-bfb2-d3f192198eca"],
  "suakin":             [1, "ed75c050-042b-44ba-a991-54044d93a91b"],
  "airport":            [1, "2cab2315-eab8-4e3b-8ffa-1411745515f3"],
  "red-sea-university": [2, "5c0fde14-6f8e-43c4-b78f-6baae5df0c7c"],
};

async function fetchBuf(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
  const written = [];
  for (const [slug, [set, uuid]] of Object.entries(ICONS)) {
    const url = `${BASE}/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-${set}/original/${uuid}.png`;
    const dest = join(OUT, `${slug}.png`);
    writeFileSync(dest, await fetchBuf(url));
    execFileSync("sips", ["-Z", "128", dest], { stdio: "ignore" }); // downscale in place, keep alpha
    written.push(`${slug}.png`);
  }
  console.log(`Staged ${written.length} Airbnb destination icon(s) → ${OUT}\n  ${written.join("  ")}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
