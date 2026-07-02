#!/usr/bin/env node
/**
 * scripts/cdn/airbnb/process.mjs
 *
 * Turn the raw Airbnb crawl into clean, deduped, currentColor SVG icons under
 * public/cdn/airbnb/. Sources:
 *   raw/*.json        — first pass (home, search, room, amenities, filters)
 *   raw/deep/*.json   — deep walk across diverse listing types (villa, ski condo,
 *                       tropical villa, luxe estate, lakefront), the "things to
 *                       know" section, and the fully-expanded filters modal.
 *
 * Honours the org harvest spirit (scripts/cdn/harvest-rules.ts): KEEP functional
 * amenity / UI glyphs, DROP site chrome, listing highlights, host/profile cards,
 * social, and composite widgets. Names come from crawl CONTEXT (the amenity
 * label), never a CMS hash — kebab-cased, deduped by path geometry (first wins).
 *
 * Idempotent + additive: only writes .svg files; never deletes. logo.svg and the
 * 3D nav PNGs are left untouched.
 *
 * Usage:  node scripts/cdn/airbnb/process.mjs [--dry-run]
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = join(__dirname, "raw");
const DEEP_DIR = join(RAW_DIR, "deep");
const OUT_DIR = resolve(__dirname, "../../../public/cdn/airbnb");
const DRY_RUN = process.argv.includes("--dry-run");

// ---- Naming: raw crawl label → clean slug. Prefix-matched (startsWith). -----
// Only labels that need cleanup (appended descriptions, awkward casing, or a
// preferred short name); clean single-concept labels fall through to auto-kebab.
const NAME_MAP = [
  ["Rated 4", "star"], ["Rated 5", "star"], ["Rated 3", "star"],
  ["Luggage dropoff allowed", "luggage-dropoff"],
  ["Essentials", "essentials"], ["Bed linens", "bed-linens"],
  ["Clothing storage", "clothing-storage"], ["Pack ’n play/Travel crib", "travel-crib"],
  ["Dishes and silverware", "dishes-and-silverware"],
  ["Paid street parking off premises", "paid-street-parking"],
  ["Long term stays allowed", "long-term-stays"],
  ["Unavailable: TV", "tv"], ["Unavailable: Paid washer", "washer"],
  ["Unavailable: Dryer", "dryer"], ["Unavailable: Air conditioning", "air-conditioning"],
  ["Unavailable: Heating", "heating"], ["Unavailable: Exterior security", "security-cameras"],
  ["Unavailable: Essentials", "essentials"],
  ["Guest favorite", "guest-favorite"], ["Luxe", "luxe"], ["Instant Book", "instant-book"],
  ["Translation on", "translation"], ["Show map", "show-map"], ["Filters", "filters"],
  ["Share", "share"], ["Save", "save"],
  // deep-crawl amenities with appended descriptions / preferred slugs
  ["Self check-in", "self-check-in"], ["Private entrance", "private-entrance"],
  ["Beach essentials", "beach-essentials"], ["Keypad", "keypad"],
  ["Sound system", "sound-system"], ["Exterior security cameras", "security-cameras"],
  ["Private sauna", "sauna"], ["Ski-in/ski-out", "ski-in-ski-out"],
  ["Bedroom", null], // "Bedroom 1 1 king bed…" bed-config composite → drop
];

// Non-icon labels: chrome, listing highlights, host/profile cards, composites.
const DROP_PREFIXES = [
  "Skip to content", "Start your search", "Exceptional check-in", "Room in a rental unit",
  "Clear dates", "Guests", "MarineSuperhost", "Born in", "Where I went to school",
  "My work", "Speaks ", "I’m obsessed", "I'm obsessed", "Cancellation policy",
  "Safety & property", "Centered on", "New place to stay", "Share your location",
  "Main navigation menu", "Navigate to", "Choose a language",
  // deep-crawl noise: listing highlights, pagination, profile, host cards
  "Peace and quiet", "Extra spacious", "Beautiful", "Dive right in", "Great ",
  "Lives in", "1 of", "Next", "Show less", "Show more", "I spend", "Recent guests",
];
// Host/profile cards render as "<Name>Host" / "<Name>Superhost".
const DROP_REGEX = [/host$/i, /superhost/i];

const kebab = (s) =>
  s.normalize("NFKD").replace(/[’']/g, "").replace(/[^a-zA-Z0-9]+/g, "-")
   .replace(/^-+|-+$/g, "").toLowerCase();

/** Decide a slug for a raw label, or null to drop. */
function slugFor(label) {
  const l = (label || "").trim();
  if (!l) return null;
  for (const [pre, slug] of NAME_MAP) if (l.startsWith(pre)) return slug; // slug may be null (explicit drop)
  for (const pre of DROP_PREFIXES) if (l.startsWith(pre)) return null;
  for (const re of DROP_REGEX) if (re.test(l)) return null;
  // Auto-kebab only clean, short, single-concept labels; drop sentences/bios.
  const words = l.split(/\s+/);
  if (words.length > 4 || l.length > 30 || l.includes(":") || /\d/.test(l)) return null;
  return kebab(l);
}

/**
 * Normalize an Airbnb inline <svg> to a clean, self-contained icon. Airbnb ships
 * two kinds: FILLED glyphs (`fill: currentcolor`, most amenities) and STROKED
 * glyphs (`fill: none; stroke: currentcolor; stroke-width: N`, the UI chrome like
 * the close X and search magnifier). We read the original inline style to pick the
 * right root rendering — forcing fill on a stroked icon renders it invisible.
 */
function sanitize(html) {
  const vb = (html.match(/viewBox="([^"]*)"/) || [])[1] || "0 0 32 32";
  const style = (html.match(/style="([^"]*)"/) || [])[1] || "";
  const stroked = /stroke:\s*currentcolor/i.test(style) ||
    (/stroke-width/i.test(style) && /fill:\s*none/i.test(style));
  let inner = html.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  inner = inner
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/\sclass="[^"]*"/g, "")
    .replace(/\saria-hidden="[^"]*"/g, "")
    .replace(/\sfocusable="[^"]*"/g, "")
    .replace(/\srole="[^"]*"/g, "")
    .replace(/\sstyle="[^"]*"/g, "")
    .trim();
  const root = stroked
    ? `fill="none" stroke="currentColor" stroke-width="${(style.match(/stroke-width:\s*([\d.]+)/) || [])[1] || "3"}" stroke-linecap="round" stroke-linejoin="round"`
    : `fill="currentColor"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" width="32" height="32" ${root}>${inner}</svg>\n`;
}

// Stability anchor: any slug already published on the CDN (read from the
// committed manifest) must NEVER be renamed by a new crawl label.
const MANIFEST = resolve(__dirname, "../../../src/registry/cdn-manifest.json");
let liveSlugs = new Set();
try {
  const m = JSON.parse(readFileSync(MANIFEST, "utf8"));
  liveSlugs = new Set(
    m.assets
      .filter((a) => a.key.startsWith("airbnb/") && a.key.endsWith(".svg"))
      .map((a) => a.key.slice("airbnb/".length, -4)),
  );
} catch {}

// ---- Load raw + deep crawl; collect every candidate label per geometry -----
const byGeom = new Map(); // ds -> { labels: [{label, raw}], html }
const sources = [
  ...readdirSync(RAW_DIR).filter((f) => f.endsWith(".json")).map((f) => ({ fp: join(RAW_DIR, f), raw: true })),
  ...(existsSync(DEEP_DIR)
    ? readdirSync(DEEP_DIR).filter((f) => f.endsWith(".json")).map((f) => ({ fp: join(DEEP_DIR, f), raw: false }))
    : []),
];
for (const { fp, raw } of sources) {
  let data;
  try { data = JSON.parse(readFileSync(fp, "utf8")); } catch { continue; }
  for (const s of data.svgs || []) {
    const html = s.html || "";
    if (!/viewBox="0 0 32 32"/.test(html)) continue;
    const ds = (html.match(/ d="[^"]*"/g) || []).join("|");
    if (!ds || ds.length < 8) continue;
    let e = byGeom.get(ds);
    if (!e) { e = { labels: [], html }; byGeom.set(ds, e); }
    const label = (s.label || "").trim();
    if (label) e.labels.push({ label, raw });
  }
}

/** Choose the best slug for a geometry from its candidate labels, or null. */
function pickSlug(labels) {
  const cands = [];
  for (const { label, raw } of labels) {
    const slug = slugFor(label);
    if (slug) cands.push({ slug, raw, len: label.length });
  }
  if (!cands.length) return null;
  // 1) never rename a live icon; among live-slug candidates prefer the shortest
  //    (cleanest, most-exact) label — labels can be polluted by nearby modal text.
  const live = cands.filter((c) => liveSlugs.has(c.slug));
  if (live.length) { live.sort((a, b) => a.len - b.len); return live[0].slug; }
  cands.sort((a, b) => (a.raw === b.raw ? a.len - b.len : a.raw ? -1 : 1)); // 2) raw, then shortest
  return cands[0].slug;
}

// ---- Name, drop, dedupe by slug (first geometry wins the name) -------------
const bySlug = new Map();
const dropped = [];
for (const { labels, html } of byGeom.values()) {
  const slug = pickSlug(labels);
  if (!slug) { dropped.push(labels[0]?.label || "(blank)"); continue; }
  if (bySlug.has(slug)) continue;
  bySlug.set(slug, sanitize(html));
}

const kept = [...bySlug.keys()].sort();
console.log(`${DRY_RUN ? "[DRY RUN] " : ""}Airbnb crawl → public/cdn/airbnb/`);
console.log(`  sources           : ${sources.length} json (raw + deep)`);
console.log(`  unique geometries : ${byGeom.size}`);
console.log(`  kept icons        : ${kept.length}`);
console.log(`  dropped           : ${dropped.length} (chrome/highlight/profile/composite)`);
console.log("\n  " + kept.join("  "));

if (!DRY_RUN) {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  for (const [slug, svg] of bySlug) writeFileSync(join(OUT_DIR, `${slug}.svg`), svg);
  console.log(`\nWrote ${kept.length} SVG(s) → ${OUT_DIR}`);
}
