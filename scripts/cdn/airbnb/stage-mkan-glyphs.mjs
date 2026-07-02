#!/usr/bin/env node
/**
 * scripts/cdn/airbnb/stage-mkan-glyphs.mjs
 *
 * A few Airbnb amenity/highlight glyphs mkan needs are NOT in the crawled airbnb
 * namespace: three amenities Airbnb's amenity modal never surfaced to the crawler
 * (outdoor-dining, pool-table, piano) and the six listing-"highlight" glyphs the
 * crawler deliberately drops as chrome (peaceful, unique, family-friendly,
 * stylish, central, spacious). They live in mkan/public as Airbnb-derived SVGs
 * (45×45, #3C3C3C). We copy those into the airbnb namespace, normalized to
 * currentColor so they match the rest of the crawled set. This is the approved
 * local-copy fallback for glyphs with no fresh-crawl origin — still served
 * exclusively from cdn.databayt.org/airbnb.
 *
 * Idempotent; only writes the listed keys. Amenities that DO have a crawled
 * canonical glyph (wifi, pool, bbq-grill, …) are referenced directly and are not
 * re-staged here.
 *
 * Usage:  MKAN_PUBLIC=~/mkan/public node scripts/cdn/airbnb/stage-mkan-glyphs.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const SRC = process.env.MKAN_PUBLIC || join(homedir(), "mkan", "public");
const OUT = join(ROOT, "public/cdn/airbnb");

// [source file under mkan/public, destination key under airbnb/]
const JOBS = [
  // amenities with no crawled canonical equivalent
  ["amenities/Outdoor dining.svg", "outdoor-dining.svg"],
  ["amenities/Pool table.svg",     "pool-table.svg"],
  ["amenities/Piano.svg",          "piano.svg"],
  // listing highlights (crawler drops these as chrome)
  ["highlights/Peaceful.svg",        "highlights/peaceful.svg"],
  ["highlights/Unique.svg",          "highlights/unique.svg"],
  ["highlights/Family-friendly.svg", "highlights/family-friendly.svg"],
  ["highlights/Stylish.svg",         "highlights/stylish.svg"],
  ["highlights/Central.svg",         "highlights/central.svg"],
  ["highlights/Spacious.svg",        "highlights/spacious.svg"],
];

/** Normalize Airbnb's fixed #3C3C3C glyph color to currentColor (fill AND stroke). */
function toCurrentColor(svg) {
  return svg.replace(/#3C3C3C/gi, "currentColor");
}

let n = 0;
for (const [rel, key] of JOBS) {
  const src = join(SRC, rel);
  if (!existsSync(src)) {
    console.error(`  ! missing ${src}`);
    continue;
  }
  const dest = join(OUT, key);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, toCurrentColor(readFileSync(src, "utf8")));
  console.log(`  ✓ ${rel} → airbnb/${key}`);
  n++;
}
console.log(`\nStaged ${n} mkan-origin airbnb glyph(s) → ${OUT}`);
