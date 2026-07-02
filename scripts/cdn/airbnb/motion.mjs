#!/usr/bin/env node
/**
 * scripts/cdn/airbnb/motion.mjs
 *
 * Airbnb's UI motion lives in ~705 CSS @keyframes (335 distinct) in its design
 * system — the hover/init-load micro-animations (loaders, skeletons, reveals,
 * sheet transitions, card flips, map-marker pulses). They're behaviour, not
 * downloadable files, so we capture them: this reads the keyframes dumped from a
 * live page (raw/deep/keyframes.json) and emits public/cdn/airbnb/motion.css — a
 * curated set of the signature, reusable animations with Airbnb's EXACT keyframe
 * definitions, cleanly renamed, plus ready-to-use utility classes + timing tokens.
 *
 * Usage:  node scripts/cdn/airbnb/motion.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KF = JSON.parse(readFileSync(join(__dirname, "raw/deep/keyframes.json"), "utf8")).keyframes;

// clean, reusable output name → the design-system keyframe it maps to.
const SIGNATURE = [
  ["spin", "radial-progress-spin"],
  ["dot-pulse", "dot-pulse"],
  ["bouncy-dot", "bouncyDot"],
  ["ai-dot-bounce", "aiDotBounce"],
  ["skeleton-shimmer", "ds-skeleton-shimmer"],
  ["shimmer-sweep", "shimmer-sweep"],
  ["wave", "wave"],
  ["fade-in", "fade-in"],
  ["fade-in-slide-up", "fade-in-slide-up"],
  ["slide-up", "slideUp"],
  ["slide-down", "slideDown"],
  ["grow", "growEnter"],
  ["scale-in", "scaleEnter"],
  ["bloom", "bloom"],
  ["zoom-in", "zoomIn"],
  ["bounce", "bounce"],
  ["flip-card", "flip-card"],
  ["image-grow", "imageGrow"],
  ["marker-pulse", "markerPulse"],
  ["rise-up", "ds-rise-up"],
  ["sheet-slide-up", "dls_sheets_slideUp"],
  ["sheet-fade-in", "dls_sheets_fadeIn"],
  ["overlay-enter", "overlayEnter"],
  ["blink", "blink"],
];

const cleanName = (n) => n.replace(/-[0-9a-z]{5,8}$/i, "").replace(/-[0-9a-f]{6}$/i, "");
const found = new Map(); // source clean-name -> css (first match wins)
for (const k of KF) { const c = cleanName(k.name); if (!found.has(c)) found.set(c, { orig: k.name, css: k.css }); }

const blocks = [];
const missing = [];
for (const [out, src] of SIGNATURE) {
  const hit = found.get(src);
  if (!hit) { missing.push(`${out} (${src})`); continue; }
  // rename @keyframes <orig> → <out>
  blocks.push(hit.css.replace(hit.orig, out).replace(/\s*}\s*$/, "\n}"));
}

const header = `/*
 * Airbnb signature UI motion — cdn.databayt.org/airbnb/motion.css
 * Extracted verbatim from Airbnb's design-system @keyframes (v2026), cleanly
 * renamed for reuse. These are the hover / init-load / transition animations:
 * loaders, skeletons, reveals, sheet transitions, card flip, marker pulse.
 *
 * Usage:  <div class="ab-anim ab-skeleton-shimmer"></div>
 *         .my-loader { animation: dot-pulse 1.2s infinite; }
 */
:root {
  --ab-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ab-ease-emphasized: cubic-bezier(0.2, 0, 0, 1.2);
  --ab-dur-fast: 150ms;
  --ab-dur-base: 300ms;
  --ab-dur-slow: 500ms;
}
.ab-anim { animation-duration: var(--ab-dur-base); animation-timing-function: var(--ab-ease-standard); animation-fill-mode: both; }
.ab-fade-in { animation-name: fade-in; }
.ab-fade-in-slide-up { animation-name: fade-in-slide-up; }
.ab-slide-up { animation-name: slide-up; }
.ab-grow { animation-name: grow; }
.ab-scale-in { animation-name: scale-in; }
.ab-bloom { animation-name: bloom; }
.ab-zoom-in { animation-name: zoom-in; }
.ab-skeleton-shimmer { animation: skeleton-shimmer 1.5s linear infinite; }
.ab-dot-pulse { animation: dot-pulse 1.2s ease-in-out infinite; }
.ab-spin { animation: spin 900ms linear infinite; }
.ab-marker-pulse { animation: marker-pulse 1.8s var(--ab-ease-standard) infinite; }
`;

const out = header + "\n" + blocks.join("\n\n") + "\n";
const OUT = resolve(__dirname, "../../../public/cdn/airbnb/motion.css");
writeFileSync(OUT, out);
console.log(`Wrote motion.css → ${OUT}`);
console.log(`  signature animations: ${blocks.length}/${SIGNATURE.length}`);
if (missing.length) console.log(`  not found on captured page: ${missing.join(", ")}`);
