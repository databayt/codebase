#!/usr/bin/env tsx
/**
 * scripts/cdn/stage-clickview.ts
 *
 * Stage the raw ClickView archive (~/clickview) into public/cdn/clickview/ under the
 * flat, level-prefixed conceptual key scheme, and emit src/registry/clickview-map.json
 * (coverId → { level, topicSlug, key }) so hogwarts seeds resolve lesson keys without
 * re-reading the archive.
 *
 * Key scheme (hybrid):
 *   concept art   illustrations/{level}-{concept}.jpg → clickview/{level}-{concept}-thumbnail.jpg
 *                 banners/{level}-{concept}.jpg       → clickview/{level}-{concept}-banner.jpg
 *   lesson cover  by-url/{..}-{level}-{..}/{topic}-{coverId}.jpg
 *                                                     → clickview/{level}-{topic}-cover.jpg
 *
 * Single optimized file per asset (source .jpg preserved). The -thumbnail/-banner vs
 * -cover suffix separates concept art from covers so a concept and a same-named topic
 * never collide. Within a level, a topic-slug collision appends -{coverId}.
 *
 * Usage:
 *   tsx scripts/cdn/stage-clickview.ts [--dry-run]
 *   CLICKVIEW_ARCHIVE=/path/to/clickview tsx scripts/cdn/stage-clickview.ts
 */
import {
  readdirSync,
  statSync,
  mkdirSync,
  copyFileSync,
  writeFileSync,
  existsSync,
} from "node:fs"
import { join, resolve } from "node:path"
import { homedir } from "node:os"

const DRY_RUN = process.argv.includes("--dry-run")
const ARCHIVE = process.env.CLICKVIEW_ARCHIVE || join(homedir(), "clickview")
const OUT_DIR = resolve(process.cwd(), "public/cdn/clickview")
const MAP_OUT = resolve(process.cwd(), "src/registry/clickview-map.json")

const LEVELS = new Set(["elementary", "middle", "high"])
/** Concept-slug normalisations (banners/illustrations spelling drift). */
const CONCEPT_FIX: Record<string, string> = { "u-s-history": "us-history" }
const fixConcept = (c: string) => CONCEPT_FIX[c] ?? c

const COVER_ID_RE = /^[A-Za-z0-9]{5,8}$/

interface Plan {
  src: string
  key: string // repo-relative under clickview/, includes extension
}
interface CoverEntry {
  level: string
  topicSlug: string
  key: string
}

const plans: Plan[] = []
const coverMap: Record<string, CoverEntry> = {}
const skipped: string[] = []
const collisions: string[] = []
const usedKeys = new Map<string, string>() // key → source (collision detection)

/** elementary-math.jpg → { level:"elementary", rest:"math" } ; null if no level prefix. */
function splitLevel(base: string): { level: string; rest: string } | null {
  const i = base.indexOf("-")
  if (i < 0) return null
  const level = base.slice(0, i)
  if (!LEVELS.has(level)) return null
  return { level, rest: base.slice(i + 1) }
}

function addPlan(key: string, src: string) {
  if (usedKeys.has(key)) {
    collisions.push(`${key}  (${usedKeys.get(key)}  vs  ${src})`)
    return false
  }
  usedKeys.set(key, src)
  plans.push({ src, key })
  return true
}

// ---- concept art: illustrations/ (-thumbnail) + banners/ (-banner) ----
for (const [dir, suffix] of [
  ["illustrations", "thumbnail"],
  ["banners", "banner"],
] as const) {
  const abs = join(ARCHIVE, dir)
  if (!existsSync(abs)) {
    skipped.push(`(missing dir) ${abs}`)
    continue
  }
  for (const f of readdirSync(abs)) {
    if (!/\.(jpe?g|png|webp)$/i.test(f)) continue
    const dot = f.lastIndexOf(".")
    const base = f.slice(0, dot)
    const ext = f.slice(dot + 1).toLowerCase()
    const split = splitLevel(base)
    if (!split) {
      skipped.push(`${dir}/${f}  (no level prefix)`)
      continue
    }
    const concept = fixConcept(split.rest)
    addPlan(`${split.level}-${concept}-${suffix}.${ext}`, join(abs, f))
  }
}

// ---- lesson covers: by-url/{..-level-..}/{topic}-{coverId}.jpg ----
const byUrl = join(ARCHIVE, "by-url")
if (existsSync(byUrl)) {
  for (const d of readdirSync(byUrl)) {
    const dAbs = join(byUrl, d)
    if (!statSync(dAbs).isDirectory()) continue
    const level = d.split("-").find((t) => LEVELS.has(t))
    if (!level) {
      skipped.push(`by-url/${d}/  (no level in dir name)`)
      continue
    }
    for (const f of readdirSync(dAbs)) {
      if (!/\.(jpe?g|png|webp)$/i.test(f)) continue
      const dot = f.lastIndexOf(".")
      const base = f.slice(0, dot)
      const ext = f.slice(dot + 1).toLowerCase()
      const lastDash = base.lastIndexOf("-")
      const coverId = lastDash >= 0 ? base.slice(lastDash + 1) : ""
      const topic = lastDash >= 0 ? base.slice(0, lastDash) : base
      if (!COVER_ID_RE.test(coverId) || !topic) {
        skipped.push(`by-url/${d}/${f}  (unparsable topic/coverId)`)
        continue
      }
      let key = `${level}-${topic}-cover.${ext}`
      if (usedKeys.has(key)) {
        // within-level topic-slug collision → disambiguate with the coverId
        key = `${level}-${topic}-cover-${coverId}.${ext}`
      }
      if (addPlan(key, join(dAbs, f))) {
        coverMap[coverId] = { level, topicSlug: topic, key: `clickview/${key}` }
      }
    }
  }
}

// ---- execute ----
plans.sort((a, b) => a.key.localeCompare(b.key))
const concepts = plans.filter((p) => /-(thumbnail|banner)\./.test(p.key)).length
const covers = plans.length - concepts

console.log(`${DRY_RUN ? "[DRY RUN] " : ""}ClickView archive → public/cdn/clickview/`)
console.log(`  source : ${ARCHIVE}`)
console.log(`  concept art : ${concepts}  (illustrations + banners)`)
console.log(`  covers      : ${covers}`)
console.log(`  total       : ${plans.length}`)
if (collisions.length) {
  console.log(`  COLLISIONS (${collisions.length}) — not staged:`)
  collisions.slice(0, 20).forEach((c) => console.log(`    ${c}`))
}
if (skipped.length) {
  console.log(`  skipped ${skipped.length} (first 10):`)
  skipped.slice(0, 10).forEach((s) => console.log(`    ${s}`))
}

if (!DRY_RUN) {
  for (const p of plans) {
    const dest = join(OUT_DIR, p.key)
    mkdirSync(join(dest, ".."), { recursive: true })
    copyFileSync(p.src, dest)
  }
  writeFileSync(MAP_OUT, JSON.stringify(coverMap, null, 2) + "\n")
  console.log(`\nStaged ${plans.length} files → ${OUT_DIR}`)
  console.log(`Wrote coverId map (${Object.keys(coverMap).length}) → ${MAP_OUT}`)
} else {
  console.log("\nSample keys:")
  plans.slice(0, 6).forEach((p) => console.log(`  clickview/${p.key}`))
}
