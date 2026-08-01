/**
 * generate-template-docs — scaffold MDX pages for registry templates.
 *
 *   pnpm generate:template-docs           # scaffold missing pages, merge meta.json
 *   pnpm generate:template-docs --prune   # also drop meta entries with no MDX
 *
 * Scaffold-only: existing .mdx files are never touched. Per-template docs are
 * our own enhancement — upstream shadcn /blocks has no per-block MDX layer.
 */
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import { createRequire } from "module"
import type { RegistryItem } from "../src/registry/schema"

const require = createRequire(import.meta.url)
const { templates } = require("../src/registry/registry-templates") as {
  templates: RegistryItem[]
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")
const CONTENT_PATH = path.join(PROJECT_ROOT, "content", "templates", "(root)")

function titleCase(name: string): string {
  return name
    .split("-")
    .map((w) => (/^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ")
}

function generateMDX(template: RegistryItem): string {
  const title = titleCase(template.name)
  const files = template.files ?? []

  const fileList = files
    .map((f) => `- \`${typeof f === "string" ? f : f.path}\``)
    .join("\n")

  return `---
title: ${title}
description: ${template.description ?? `${title} template.`}
component: true
---

<TemplatePreview name="${template.name}" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

\`\`\`bash
npx codebase add ${template.name}
\`\`\`

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Open the full-page preview and copy the files you need.</Step>

[Open in full page](/view/templates/${template.name})

<Step>This template ships the following files:</Step>

${fileList}

</Steps>

</TabsContent>

</CodeTabs>

## Usage

The CLI installs the page under \`app/\` and its components alongside it.
Adapt the routes, wire your data, and keep logical properties (\`ms-\`/\`me-\`,
\`start-\`/\`end-\`) so the layout mirrors correctly in RTL.
`
}

function generateIndex(): string {
  return `---
title: Templates
description: Full-page layouts and major sections — the codebase equivalent of shadcn blocks, installable with one command.
---

Templates are complete layouts composed from ui primitives and atoms:
dashboards, sidebars, auth screens, heroes, headers, footers and pricing
sections. Preview any template live, open it full-page, or install it with
\`npx codebase add <name>\`.

Browse by category from the bar above, or pick a template from the sidebar.
`
}

async function main(): Promise<void> {
  const prune = process.argv.includes("--prune")
  await fs.mkdir(CONTENT_PATH, { recursive: true })

  let created = 0

  const indexPath = path.join(CONTENT_PATH, "index.mdx")
  try {
    await fs.access(indexPath)
  } catch {
    await fs.writeFile(indexPath, generateIndex())
    console.log("  created index.mdx")
    created++
  }

  for (const template of templates) {
    const target = path.join(CONTENT_PATH, `${template.name}.mdx`)
    try {
      await fs.access(target)
      continue
    } catch {
      await fs.writeFile(target, generateMDX(template))
      created++
    }
  }

  // meta.json: registry order, index first; merge-preserving on reruns.
  const metaPath = path.join(CONTENT_PATH, "meta.json")
  let pages: string[] = ["index", ...templates.map((t) => t.name)]
  try {
    const existing = JSON.parse(await fs.readFile(metaPath, "utf-8")) as {
      pages?: string[]
    }
    if (existing.pages?.length) {
      const known = new Set(existing.pages)
      pages = [...existing.pages, ...pages.filter((p) => !known.has(p))]
    }
  } catch {
    // first run — registry order stands
  }
  if (prune) {
    const mdx = new Set(
      (await fs.readdir(CONTENT_PATH))
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => f.replace(/\.mdx$/, ""))
    )
    pages = pages.filter((p) => mdx.has(p))
  }
  await fs.writeFile(
    metaPath,
    JSON.stringify({ title: "Templates", pages }, null, 2) + "\n"
  )

  console.log(`Done. ${created} page(s) scaffolded, meta.json has ${pages.length} pages.`)
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
