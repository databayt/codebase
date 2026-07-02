#!/usr/bin/env tsx
/**
 * scripts/cdn/stage-mkan.ts
 *
 * Stage mkan's OWN static media (marketing images, landing art, transport brand
 * logos, the hero video, default placeholders) into public/cdn/mkan/ so it
 * serves from cdn.databayt.org/mkan. Airbnb-derived assets (amenity/highlight
 * glyphs, search nav marks, destination icons, host videos) live under the
 * airbnb/ namespace instead and are NOT staged here.
 *
 * Referenced-only: we copy exactly the files the mkan app references — keeps the
 * namespace purposeful and avoids uploading ~20MB of unused /public cruft. A few
 * source files carry spaces/parens in their names (Airbnb export artifacts);
 * those are renamed to clean kebab keys so the S3/CloudFront keys stay tidy, and
 * the app call sites use the clean key.
 *
 * Usage:
 *   MKAN_PUBLIC=~/mkan/public tsx scripts/cdn/stage-mkan.ts [--dry-run]
 */
import { copyFileSync, mkdirSync, existsSync, statSync, readdirSync } from "node:fs"
import { homedir } from "node:os"
import { join, dirname, resolve } from "node:path"

const DRY_RUN = process.argv.includes("--dry-run")
const SRC = process.env.MKAN_PUBLIC || join(homedir(), "mkan", "public")
const OUT = resolve(process.cwd(), "public/cdn/mkan")

/** Source files with spaces/parens → clean kebab key under mkan/. */
const RENAMES: Record<string, string> = {
  "assets/Rectangle 1.svg": "assets/rectangle-1.svg",
  "assets/Rectangle 1 (2).svg": "assets/rectangle-1-2.svg",
  "assets/Rectangle 1 (3).svg": "assets/rectangle-1-3.svg",
}

/** Every static /public asset the mkan app references (airbnb-derived excluded). */
const FILES = [
  // root marketing
  "hero.png",
  "landing-i1.png",
  "landing-call-to-action.jpg",
  "landing-icon-wand.png",
  "landing-icon-calendar.png",
  "landing-icon-heart.png",
  "placeholder.svg",
  // assets/
  "assets/hero.jpg",
  "assets/camera.avif",
  "assets/help-one.png",
  "assets/help-two.png",
  "assets/stand-out.webp",
  "assets/publish.png",
  "assets/place.webp",
  "assets/julia.png",
  "assets/gift-cards.png",
  "assets/transport-office.webp",
  "assets/transport-bus.webp",
  "assets/transport-schedule.webp",
  "assets/Rectangle 1.svg",
  "assets/Rectangle 1 (2).svg",
  "assets/Rectangle 1 (3).svg",
  // hero video (38 MB — the single biggest optimization win)
  "videos/hero-bg.mp4",
  // images/
  "images/host_waving.png",
  "images/default-property.svg",
  "images/default-avatar.svg",
  // transport brand logos
  "brands/transport/tirhal.svg",
  "brands/transport/musafir.svg",
  "brands/transport/jamal-el-din.svg",
  "brands/transport/mcv.svg",
  "brands/transport/igbalco.svg",
  "brands/transport/marshal.svg",
  "brands/transport/abu-amer.svg",
  "brands/transport/rodeena.svg",
  "brands/transport/al-rifai.svg",
  // property/listing placeholders (used across many components)
  "tent.png",
  "property-placeholder.svg",
  // refer illustrations
  "refer/service.png",
  "refer/home.png",
  "refer/experience.png",
  // hosting example photos
  "hosting/today.png",
  "hosting/bedroom.png",
  "hosting/bathroom.png",
  // co-host
  "co-hosts/find-a-cohost.png",
]

if (!existsSync(SRC)) {
  console.error(`mkan/public not found at ${SRC}`)
  process.exit(1)
}

// Category icons render dynamically via `/assets/${name}.svg` (property-icon.tsx),
// so the referenced set can't be enumerated statically. Stage every top-level
// assets/*.svg by name — tiny files — so any category name resolves on the CDN.
// The 3 decorative "Rectangle 1*.svg" used by inspiration.tsx are renamed above.
const assetsDir = join(SRC, "assets")
if (existsSync(assetsDir)) {
  for (const f of readdirSync(assetsDir)) {
    if (!f.toLowerCase().endsWith(".svg") || f.startsWith("Rectangle")) continue
    const rel = `assets/${f}`
    if (!FILES.includes(rel)) FILES.push(rel)
  }
}

let staged = 0
let bytes = 0
let missing = 0
for (const rel of FILES) {
  const src = join(SRC, rel)
  if (!existsSync(src)) {
    console.error(`  ! missing ${rel}`)
    missing++
    continue
  }
  const key = RENAMES[rel] ?? rel
  const dest = join(OUT, key)
  bytes += statSync(src).size
  if (!DRY_RUN) {
    mkdirSync(dirname(dest), { recursive: true })
    copyFileSync(src, dest)
  }
  console.log(`  ${DRY_RUN ? "would stage" : "✓"} ${rel}${key !== rel ? ` → ${key}` : ""}`)
  staged++
}
console.log(
  `\n${DRY_RUN ? "[DRY RUN] " : ""}Staged ${staged} file(s) (${(bytes / 1048576).toFixed(1)} MB)` +
    `${missing ? `, ${missing} missing` : ""} → ${OUT}`,
)
