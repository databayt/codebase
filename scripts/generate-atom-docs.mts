/**
 * generate-atom-docs — scaffold MDX pages for registry atoms.
 *
 *   pnpm generate:docs            # scaffold missing pages, merge meta.json
 *   pnpm generate:docs --prune    # also drop meta.json entries with no MDX file
 *
 * Scaffold-only: existing .mdx files are never touched. Output follows the
 * hand-written page contract (ComponentPreview → Installation CodeTabs →
 * Usage); the preview is emitted self-closing — add a demo child once the
 * preview component is registered in src/mdx-components.tsx.
 */
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import { createRequire } from "module"
import type { RegistryItem } from "../src/registry/schema"

const require = createRequire(import.meta.url)
const { atoms } = require("../src/registry/default/atoms/_registry") as {
  atoms: RegistryItem[]
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")
const CONTENT_PATH = path.join(PROJECT_ROOT, "content", "atoms", "(root)")

function pascalCase(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("")
}

function titleCase(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function generateMDX(atom: RegistryItem): string {
  const title = titleCase(atom.name)
  const componentName = pascalCase(atom.name)
  const filePath = atom.files?.[0]?.path ?? `components/atom/${atom.name}.tsx`

  return `---
title: ${title}
description: ${atom.description ?? `${title} atom.`}
component: true
---

<ComponentPreview name="${atom.name}" className="mb-4" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

\`\`\`bash
npx codebase add ${atom.name}
\`\`\`

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="${atom.name}" title="${filePath}" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

\`\`\`tsx
import { ${componentName} } from "@/components/atom/${atom.name}"
\`\`\`

\`\`\`tsx
<${componentName} />
\`\`\`
`
}

interface MetaJson {
  title: string
  pages: string[]
  [key: string]: unknown
}

async function mergeMetaJson(prune: boolean): Promise<void> {
  const metaPath = path.join(CONTENT_PATH, "meta.json")
  const meta = JSON.parse(await fs.readFile(metaPath, "utf-8")) as MetaJson

  const mdxFiles = (await fs.readdir(CONTENT_PATH))
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
  const mdxSet = new Set(mdxFiles)

  let pages = [...meta.pages]

  if (prune) {
    const before = pages.length
    pages = pages.filter((p) => mdxSet.has(p))
    if (before !== pages.length)
      console.log(`  meta.json: pruned ${before - pages.length} ghost entries`)
  }

  // Union: keep existing order, append any MDX file not yet listed (sorted).
  const listed = new Set(pages)
  const missing = mdxFiles.filter((f) => !listed.has(f)).sort()
  if (missing.length) {
    // Keep "index" first if present.
    pages = [...pages, ...missing]
    console.log(`  meta.json: added ${missing.length} pages (${missing.join(", ")})`)
  }

  await fs.writeFile(metaPath, JSON.stringify({ ...meta, pages }, null, 2) + "\n")
}

async function main(): Promise<void> {
  const prune = process.argv.includes("--prune")
  await fs.mkdir(CONTENT_PATH, { recursive: true })

  let created = 0
  for (const atom of atoms) {
    const target = path.join(CONTENT_PATH, `${atom.name}.mdx`)
    try {
      await fs.access(target)
      continue // scaffold-only: never touch existing pages
    } catch {
      await fs.writeFile(target, generateMDX(atom))
      console.log(`  created ${atom.name}.mdx`)
      created++
    }
  }

  await mergeMetaJson(prune)
  console.log(`Done. ${created} page(s) scaffolded.`)
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
