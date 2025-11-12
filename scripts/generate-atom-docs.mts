import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import { atoms } from "../src/registry/default/atoms/_registry.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")
const CONTENT_PATH = path.join(PROJECT_ROOT, "content", "atoms", "(root)")

async function ensureDir(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (error) {
    console.error(`Failed to create directory ${dirPath}:`, error)
  }
}

function generateMDX(atom: typeof atoms[0]): string {
  const title = atom.name
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  const dependencies = atom.dependencies || []
  const registryDependencies = atom.registryDependencies || []
  const categories = atom.categories || []

  const frontmatter = `---
title: "${title}"
description: "${atom.description}"
component: true
categories: [${categories.map(c => `"${c}"`).join(", ")}]
${dependencies.length > 0 ? `dependencies: [${dependencies.map(d => `"${d}"`).join(", ")}]` : ""}
${registryDependencies.length > 0 ? `registryDependencies: [${registryDependencies.map(d => `"${d}"`).join(", ")}]` : ""}
---`

  const installCommand = `npx codebase add ${atom.name}`

  const content = `${frontmatter}

# ${title}

${atom.description}

## Installation

<Tabs defaultValue="cli">
  <TabsList>
    <TabsTrigger value="cli">CLI</TabsTrigger>
    <TabsTrigger value="manual">Manual</TabsTrigger>
  </TabsList>
  <TabsContent value="cli">

\`\`\`bash
${installCommand}
\`\`\`

  </TabsContent>
  <TabsContent value="manual">

### Install dependencies

${dependencies.length > 0 ? `
\`\`\`bash
npm install ${dependencies.join(" ")}
\`\`\`
` : "*No external dependencies required.*"}

### Copy component code

Copy and paste the following code into your project:

${atom.files?.map(f => `
**${f.path}**

\`\`\`tsx title="${f.path}"
// Component code will be populated from registry
\`\`\`
`).join("\n") || ""}

  </TabsContent>
</Tabs>

## Usage

\`\`\`tsx
import { ${title.replace(/\s+/g, "")} } from "@/components/atom/${atom.name}"

export default function Example() {
  return (
    <${title.replace(/\s+/g, "")} />
  )
}
\`\`\`

## Examples

### Default

<ComponentPreview name="${atom.name}-demo">
  <${title.replace(/\s+/g, "")} />
</ComponentPreview>

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`className\` | \`string\` | - | Additional CSS classes |
| \`children\` | \`React.ReactNode\` | - | Child elements |

## Accessibility

- Follows WAI-ARIA design patterns
- Keyboard navigable
- Screen reader friendly

## Notes

${categories.includes("ai") ? "- This component is optimized for AI interactions\n" : ""}${categories.includes("animation") ? "- Includes smooth animations and transitions\n" : ""}${dependencies.length > 0 ? `- Requires external dependencies: ${dependencies.join(", ")}\n` : ""}
`

  return content
}

async function generateAllDocs() {
  console.log("Generating MDX documentation for atoms...")

  await ensureDir(CONTENT_PATH)

  let generated = 0
  let skipped = 0

  for (const atom of atoms) {
    const filename = `${atom.name}.mdx`
    const filepath = path.join(CONTENT_PATH, filename)

    try {
      // Check if file already exists
      await fs.access(filepath)
      console.log(`  ⏭️  Skipped ${filename} (already exists)`)
      skipped++
    } catch {
      // File doesn't exist, create it
      const content = generateMDX(atom)
      await fs.writeFile(filepath, content)
      console.log(`  ✅ Created ${filename}`)
      generated++
    }
  }

  console.log(`\nSummary:`)
  console.log(`  Generated: ${generated} files`)
  console.log(`  Skipped: ${skipped} files`)
  console.log(`  Total atoms: ${atoms.length}`)

  // Update meta.json
  await updateMetaJson()
}

async function updateMetaJson() {
  console.log("\nUpdating meta.json...")

  const metaPath = path.join(CONTENT_PATH, "meta.json")

  // Sort atoms alphabetically for sidebar
  const sortedAtoms = [...atoms]
    .map(a => a.name)
    .sort()

  const meta = {
    title: "Atoms",
    pages: ["index", ...sortedAtoms]
  }

  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2))
  console.log("  ✅ Updated meta.json")
}

// Run generator
generateAllDocs().catch(console.error)
