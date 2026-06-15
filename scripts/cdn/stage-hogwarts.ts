#!/usr/bin/env tsx
/**
 * scripts/cdn/stage-hogwarts.ts
 *
 * Harvest ~/hogwarts/public product assets into public/cdn/hogwarts/, EXCLUDING the
 * parts that belong elsewhere in the CDN:
 *   - courses/, subjects/  → ClickView-sourced art, owned by stage-clickview.ts
 *                            (concept dupes + low-quality subject icons are dropped there)
 *   - anthropic/           → vendor mirror, staged separately
 *   - junk dirs (.claude, .backup, .git, reviewed) + non-image files + PDFs
 *
 * Brand chrome / social-icon harvest rules are applied downstream by the manifest
 * builder and the S3 sync (scripts/cdn/harvest-rules.ts), so they aren't re-checked here.
 *
 * Usage:
 *   tsx scripts/cdn/stage-hogwarts.ts [--dry-run]
 *   HOGWARTS_PUBLIC=/path/to/hogwarts/public tsx scripts/cdn/stage-hogwarts.ts
 */
import {
  readdirSync,
  statSync,
  mkdirSync,
  copyFileSync,
  existsSync,
} from "node:fs"
import { join, resolve, relative, dirname } from "node:path"
import { homedir } from "node:os"

const DRY_RUN = process.argv.includes("--dry-run")
const SRC = process.env.HOGWARTS_PUBLIC || join(homedir(), "hogwarts", "public")
const OUT_DIR = resolve(process.cwd(), "public/cdn/hogwarts")

/** Top-level dirs under hogwarts/public that do NOT belong in the hogwarts namespace. */
const EXCLUDE_TOP = new Set(["courses", "subjects", "anthropic"])
const SKIP_DIRS = new Set([".git", ".claude", ".backup", "reviewed", "node_modules"])
const SKIP_FILES = new Set([".DS_Store", "Thumbs.db"])
const IMG_RE = /\.(svg|png|jpe?g|webp|avif|gif|ico)$/i

const plans: { src: string; key: string }[] = []

function walk(dir: string, top: string | null): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      // at the top level, skip the ClickView/vendor dirs
      if (top === null && EXCLUDE_TOP.has(entry.name)) continue
      walk(join(dir, entry.name), top ?? entry.name)
    } else if (entry.isFile()) {
      if (SKIP_FILES.has(entry.name) || !IMG_RE.test(entry.name)) continue
      const full = join(dir, entry.name)
      const key = relative(SRC, full).split("\\").join("/")
      plans.push({ src: full, key })
    }
  }
}

if (!existsSync(SRC)) {
  console.error(`hogwarts/public not found at ${SRC}`)
  process.exit(1)
}
walk(SRC, null)
plans.sort((a, b) => a.key.localeCompare(b.key))

console.log(`${DRY_RUN ? "[DRY RUN] " : ""}hogwarts/public → public/cdn/hogwarts/`)
console.log(`  source  : ${SRC}`)
console.log(`  excluded: ${[...EXCLUDE_TOP].join(", ")} (clickview/vendor)`)
console.log(`  staging : ${plans.length} files`)

if (!DRY_RUN) {
  for (const p of plans) {
    const dest = join(OUT_DIR, p.key)
    mkdirSync(dirname(dest), { recursive: true })
    copyFileSync(p.src, dest)
  }
  console.log(`Staged ${plans.length} files → ${OUT_DIR}`)
} else {
  console.log("Sample:", plans.slice(0, 4).map((p) => p.key).join(", "))
}
