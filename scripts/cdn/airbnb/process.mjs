#!/usr/bin/env node
/**
 * scripts/cdn/airbnb/process.mjs
 *
 * Turn the raw Airbnb crawl (scripts/cdn/airbnb/raw/*.json — captured from the
 * live site via the browser MCP: homepage, search, a room page, the "What this
 * place offers" amenities modal, and the Filters modal) into clean, deduped,
 * currentColor SVG icons under public/cdn/airbnb/.
 *
 * Honours the same spirit as scripts/cdn/harvest-rules.ts: KEEP functional
 * amenity/UI glyphs, DROP site chrome, profile bio marks, social, and composite
 * search-bar widgets. Names come from crawl CONTEXT (the amenity label), never a
 * CMS hash — kebab-cased, deduped by path geometry.
 *
 * Usage:  node scripts/cdn/airbnb/process.mjs [--dry-run]
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = join(__dirname, "raw");
const OUT_DIR = resolve(__dirname, "../../../public/cdn/airbnb");
const DRY_RUN = process.argv.includes("--dry-run");

// ---- Naming: raw crawl label → clean slug. Prefix-matched (startsWith). -----
// Cleans up doubled/awkward aria strings and shortens verbose amenity labels.
const NAME_MAP = [
  ["Rated 4.97 out of 5 stars", "star"],
  ["Luggage dropoff allowed", "luggage-dropoff"],
  ["Essentials", "essentials"],
  ["Bed linens", "bed-linens"],
  ["Clothing storage", "clothing-storage"],
  ["Pack ’n play/Travel crib", "travel-crib"],
  ["Dishes and silverware", "dishes-and-silverware"],
  ["Paid street parking off premises", "paid-street-parking"],
  ["Long term stays allowed", "long-term-stays"],
  ["Unavailable: TV", "tv"],
  ["Unavailable: Paid washer", "washer"],
  ["Unavailable: Dryer", "dryer"],
  ["Unavailable: Air conditioning", "air-conditioning"],
  ["Guest favorite", "guest-favorite"],
  ["Luxe", "luxe"],
  ["Instant Book", "instant-book"],
  ["Translation on", "translation"],
  ["Show map", "show-map"],
  ["Filters", "filters"],
  ["Share", "share"],
  ["Save", "save"],
];

// Exact/prefix labels that are NOT reusable icons — chrome, profile bio, badges,
// composite search widgets. Dropped before naming.
const DROP_PREFIXES = [
  "Skip to content", "Start your search", "Exceptional check-in", "Room in a rental unit",
  "Clear dates", "Guests", "MarineSuperhost", "Born in", "Where I went to school",
  "My work", "Speaks ", "I’m obsessed", "I'm obsessed", "Cancellation policy",
  "Safety & property", "Centered on", "New place to stay", "Share your location",
  // site chrome + social glyphs (harvest-rules.ts drops these org-wide)
  "Main navigation menu", "Navigate to", "Choose a language",
];

const kebab = (s) =>
  s.normalize("NFKD").replace(/[’']/g, "").replace(/[^a-zA-Z0-9]+/g, "-")
   .replace(/^-+|-+$/g, "").toLowerCase();

/** Decide a slug for a raw label, or null to drop. */
function slugFor(label) {
  const l = (label || "").trim();
  if (!l) return null;
  for (const [pre, slug] of NAME_MAP) if (l.startsWith(pre)) return slug;
  for (const pre of DROP_PREFIXES) if (l.startsWith(pre)) return null;
  // Auto-kebab only clean, short, single-concept labels; drop sentences/bios.
  const words = l.split(/\s+/);
  if (words.length > 4 || l.length > 30 || l.includes(":") || /\d/.test(l)) return null;
  return kebab(l);
}

/** Normalize an Airbnb inline <svg> to a clean, self-contained currentColor icon. */
function sanitize(html) {
  const vb = (html.match(/viewBox="([^"]*)"/) || [])[1] || "0 0 32 32";
  let inner = html.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  inner = inner
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/\sclass="[^"]*"/g, "")
    .replace(/\saria-hidden="[^"]*"/g, "")
    .replace(/\sfocusable="[^"]*"/g, "")
    .replace(/\srole="[^"]*"/g, "")
    .replace(/\sstyle="[^"]*"/g, "")
    .trim();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" width="32" height="32" fill="currentColor">${inner}</svg>\n`;
}

// ---- Load raw crawl, keep best label per geometry ---------------------------
const byGeom = new Map(); // ds -> { label, html }
for (const f of readdirSync(RAW_DIR).filter((f) => f.endsWith(".json"))) {
  let data;
  try { data = JSON.parse(readFileSync(join(RAW_DIR, f), "utf8")); } catch { continue; }
  for (const s of data.svgs || []) {
    const html = s.html || "";
    if (!/viewBox="0 0 32 32"/.test(html)) continue; // DLS interactive-icon grid
    const ds = (html.match(/ d="[^"]*"/g) || []).join("|");
    if (!ds || ds.length < 8) continue;
    const label = (s.label || "").trim();
    const cur = byGeom.get(ds);
    // prefer a non-empty, shorter label (cleaner amenity name)
    if (!cur || (label && (!cur.label || label.length < cur.label.length))) {
      byGeom.set(ds, { label: label || cur?.label || "", html });
    }
  }
}

// ---- Name, drop, dedupe by slug --------------------------------------------
const bySlug = new Map(); // slug -> html
const dropped = [];
for (const { label, html } of byGeom.values()) {
  const slug = slugFor(label);
  if (!slug) { dropped.push(label || "(blank)"); continue; }
  if (bySlug.has(slug)) continue; // first geometry wins the name
  bySlug.set(slug, sanitize(html));
}

const kept = [...bySlug.keys()].sort();
console.log(`${DRY_RUN ? "[DRY RUN] " : ""}Airbnb crawl → public/cdn/airbnb/`);
console.log(`  unique geometries : ${byGeom.size}`);
console.log(`  kept icons        : ${kept.length}`);
console.log(`  dropped           : ${dropped.length} (chrome/profile/composite)`);
console.log("\n  " + kept.join("  "));

if (!DRY_RUN) {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  for (const [slug, svg] of bySlug) writeFileSync(join(OUT_DIR, `${slug}.svg`), svg);
  console.log(`\nWrote ${kept.length} SVG(s) → ${OUT_DIR}`);
}
