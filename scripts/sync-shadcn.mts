/**
 * sync-shadcn — upstream drift radar for src/components/ui/
 *
 * Fetches the shadcn/ui registry over HTTP (no clone needed), normalizes
 * upstream file content to our aliases + RTL logical properties, and diffs
 * against the local ui/ tree.
 *
 *   pnpm sync:shadcn                  # report only (default)
 *   pnpm sync:shadcn --only button,card
 *   pnpm sync:shadcn --write          # write updated/new files (protected/pinned never written)
 *
 * PROTECTED files are ours, not shadcn's — never compared as drift, never written.
 * PINNED files are shadcn's but intentionally held back — reported, never written.
 */
import { promises as fs } from "fs"
import path from "path"

const REGISTRY_BASE = "https://ui.shadcn.com/r"
const UPSTREAM_STYLE = "new-york-v4"
const UI_DIR = path.join(process.cwd(), "src", "components", "ui")

const PROTECTED = [
  "international-demo",
  "custom-video-player",
  "sortable",
  "faceted",
] as const

const PINNED = ["chart"] as const // held on recharts 2; upstream targets recharts 3

// Base-UI-lane items with no Radix-lane file — skip silently.
const NON_RADIX = ["toast"] as const

interface RegistryIndexItem {
  name: string
  type: string
}

interface RegistryFile {
  path: string
  content?: string
  type?: string
  target?: string
}

interface RegistryItem {
  name: string
  files?: RegistryFile[]
}

type Verdict =
  | { kind: "in-sync" }
  | { kind: "updated"; changedLines: number }
  | { kind: "new" }
  | { kind: "fetch-error"; detail: string }

/** Rewrite upstream registry aliases to this repo's aliases. */
function normalizeAliases(content: string): string {
  return content
    .replaceAll(`@/registry/${UPSTREAM_STYLE}/ui/`, "@/components/ui/")
    .replaceAll(`@/registry/${UPSTREAM_STYLE}/hooks/`, "@/hooks/")
    .replaceAll(`@/registry/${UPSTREAM_STYLE}/lib/`, "@/lib/")
}

/**
 * Apply the same physical→logical class mapping `shadcn migrate rtl` applied
 * to our tree, so RTL-migrated local files don't report as eternal drift.
 * Animation utilities (slide-in-from-right etc.) are intentionally untouched,
 * matching the codemod's behavior.
 */
function normalizeRtl(content: string): string {
  const pairs: Array<[RegExp, string]> = [
    [/(?<![\w-])-left-(?=\d|\[)/g, "-start-"],
    [/(?<![\w-])-right-(?=\d|\[)/g, "-end-"],
    [/(?<![\w-])-ml-(?=\d|\[)/g, "-ms-"],
    [/(?<![\w-])-mr-(?=\d|\[)/g, "-me-"],
    [/(?<![\w-])left-(?=\d|\[|auto|px|full)/g, "start-"],
    [/(?<![\w-])right-(?=\d|\[|auto|px|full)/g, "end-"],
    [/(?<![\w-])ml-(?=\d|\[|auto|px)/g, "ms-"],
    [/(?<![\w-])mr-(?=\d|\[|auto|px)/g, "me-"],
    [/(?<![\w-])pl-(?=\d|\[|auto|px)/g, "ps-"],
    [/(?<![\w-])pr-(?=\d|\[|auto|px)/g, "pe-"],
    [/(?<![\w-])border-l-(?=\d|\[)/g, "border-s-"],
    [/(?<![\w-])border-r-(?=\d|\[)/g, "border-e-"],
    [/(?<![\w-])border-l(?![\w-])/g, "border-s"],
    [/(?<![\w-])border-r(?![\w-])/g, "border-e"],
    [/(?<![\w-])rounded-tl(?![\w])/g, "rounded-ss"],
    [/(?<![\w-])rounded-tr(?![\w])/g, "rounded-se"],
    [/(?<![\w-])rounded-bl(?![\w])/g, "rounded-es"],
    [/(?<![\w-])rounded-br(?![\w])/g, "rounded-ee"],
    [/(?<![\w-])rounded-l-(?=\d|\[)/g, "rounded-s-"],
    [/(?<![\w-])rounded-r-(?=\d|\[)/g, "rounded-e-"],
    [/(?<![\w-])rounded-l(?![\w-])/g, "rounded-s"],
    [/(?<![\w-])rounded-r(?![\w-])/g, "rounded-e"],
    [/(?<![\w-])text-left(?![\w-])/g, "text-start"],
    [/(?<![\w-])text-right(?![\w-])/g, "text-end"],
  ]
  let out = content
  for (const [re, to] of pairs) out = out.replaceAll(re, to)
  return out
}

function normalize(content: string): string {
  return normalizeRtl(normalizeAliases(content)).trimEnd() + "\n"
}

/**
 * For comparison only: drop `rtl:` variant tokens from both sides. The RTL
 * migration adds enrichments (rtl:rotate-180, rtl:translate-x-1/2, …) that
 * upstream's physical-class files will never contain; they are intentional
 * local layer, not drift. `--write` output keeps normalize() untouched.
 */
function stripRtlVariants(content: string): string {
  return content
    .replace(/rtl:[^\s"'`]+\s?/g, "")
    .replace(/\s+"/g, '"')
    .replace(/ {2,}/g, " ")
    .replace(/ className=""/g, "")
}

function countChangedLines(ours: string, upstream: string): number {
  const ourLines = new Set(ours.split("\n"))
  let changed = 0
  for (const line of upstream.split("\n")) if (!ourLines.has(line)) changed++
  return changed
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  return (await res.json()) as T
}

async function readLocal(file: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(UI_DIR, file), "utf8")
  } catch {
    return null
  }
}

async function inspectItem(name: string): Promise<Map<string, Verdict>> {
  const verdicts = new Map<string, Verdict>()
  let item: RegistryItem
  try {
    item = await fetchJson<RegistryItem>(
      `${REGISTRY_BASE}/styles/${UPSTREAM_STYLE}/${name}.json`
    )
  } catch (err) {
    verdicts.set(`${name}.tsx`, {
      kind: "fetch-error",
      detail: err instanceof Error ? err.message : String(err),
    })
    return verdicts
  }
  for (const file of item.files ?? []) {
    const base = path.basename(file.path)
    // The radar only watches the ui/ tree; hooks/lib payloads are installed
    // by the CLI on add and don't need drift tracking here.
    if (!file.path.includes("/ui/") || !file.content) continue
    const local = await readLocal(base)
    if (local === null) {
      verdicts.set(base, { kind: "new" })
      continue
    }
    const upstream = stripRtlVariants(normalize(file.content))
    const ours = stripRtlVariants(local.trimEnd() + "\n")
    if (upstream === ours) {
      verdicts.set(base, { kind: "in-sync" })
    } else {
      verdicts.set(base, {
        kind: "updated",
        changedLines: countChangedLines(ours, upstream),
      })
    }
  }
  return verdicts
}

async function writeItem(name: string): Promise<string[]> {
  const written: string[] = []
  const item = await fetchJson<RegistryItem>(
    `${REGISTRY_BASE}/styles/${UPSTREAM_STYLE}/${name}.json`
  )
  for (const file of item.files ?? []) {
    const base = path.basename(file.path)
    if (!file.path.includes("/ui/") || !file.content) continue
    const stem = base.replace(/\.tsx?$/, "")
    if (
      (PROTECTED as readonly string[]).includes(stem) ||
      (PINNED as readonly string[]).includes(stem)
    )
      continue
    await fs.writeFile(path.join(UI_DIR, base), normalize(file.content), "utf8")
    written.push(base)
  }
  return written
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const write = args.includes("--write")
  const onlyArg = args.find((a) => a.startsWith("--only"))
  const only = onlyArg
    ? (onlyArg.includes("=")
        ? onlyArg.split("=")[1]
        : args[args.indexOf(onlyArg) + 1] ?? ""
      )
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : null

  console.log(`shadcn drift radar — upstream style: ${UPSTREAM_STYLE}\n`)

  const index = await fetchJson<RegistryIndexItem[]>(`${REGISTRY_BASE}/index.json`)
  let names = index
    .filter((i) => i.type === "registry:ui")
    .map((i) => i.name)
    .filter((n) => !(NON_RADIX as readonly string[]).includes(n))
  if (only) names = names.filter((n) => only.includes(n))

  const inSync: string[] = []
  const updated: Array<{ file: string; changedLines: number }> = []
  const fresh: string[] = []
  const errors: Array<{ file: string; detail: string }> = []

  for (const name of names) {
    if (
      (PROTECTED as readonly string[]).includes(name) ||
      (PINNED as readonly string[]).includes(name)
    )
      continue
    const verdicts = await inspectItem(name)
    for (const [file, v] of verdicts) {
      if (v.kind === "in-sync") inSync.push(file)
      else if (v.kind === "updated") updated.push({ file, changedLines: v.changedLines })
      else if (v.kind === "new") fresh.push(file)
      else errors.push({ file, detail: v.detail })
    }
  }

  // Local ui/ files with no upstream counterpart.
  const upstreamNames = new Set(names.map((n) => `${n}.tsx`))
  const localFiles = (await fs.readdir(UI_DIR)).filter((f) => f.endsWith(".tsx"))
  const localOnly = localFiles.filter((f) => {
    const stem = f.replace(/\.tsx$/, "")
    return (
      !upstreamNames.has(f) &&
      !(PROTECTED as readonly string[]).includes(stem) &&
      !(PINNED as readonly string[]).includes(stem)
    )
  })

  console.log(`  in sync     : ${inSync.length}`)
  console.log(`  protected   : ${PROTECTED.length} (${PROTECTED.join(", ")})`)
  console.log(`  pinned      : ${PINNED.length} (${PINNED.join(", ")})`)
  if (updated.length) {
    console.log(`  updated     : ${updated.length}`)
    for (const u of updated.sort((a, b) => b.changedLines - a.changedLines))
      console.log(`      ~ ${u.file} (${u.changedLines} lines differ)`)
  }
  if (fresh.length) {
    console.log(`  new upstream: ${fresh.length}`)
    for (const f of fresh) console.log(`      + ${f}`)
  }
  if (localOnly.length)
    console.log(`  local extra : ${localOnly.length} (${localOnly.join(", ")})`)
  if (errors.length) {
    console.log(`  fetch errors: ${errors.length}`)
    for (const e of errors) console.log(`      ! ${e.file}: ${e.detail}`)
  }

  if (write) {
    const targets = updated.map((u) => u.file.replace(/\.tsx$/, ""))
    const freshTargets = fresh.map((f) => f.replace(/\.tsx$/, ""))
    const all = [...new Set([...targets, ...freshTargets])]
    console.log(`\n--write: pulling ${all.length} file(s)...`)
    for (const name of all) {
      const written = await writeItem(name)
      for (const w of written) console.log(`      wrote ${w}`)
    }
    console.log("Review with: git diff src/components/ui/")
  } else if (updated.length || fresh.length) {
    console.log(`\nRun with --write to pull, or: pnpm exec shadcn add -y -o <names>`)
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
