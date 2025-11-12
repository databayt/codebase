import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")
const ATOM_PATH = path.join(PROJECT_ROOT, "src", "components", "atom")
const CONTENT_PATH = path.join(PROJECT_ROOT, "content", "atoms", "(root)")

// Card components to update
const CARDS = [
  {
    name: "calendar",
    title: "Calendar",
    description: "An interactive calendar card component for date selection and display.",
    dependencies: [],
    registryDeps: ["card", "calendar"],
  },
  {
    name: "chat",
    title: "Chat",
    description: "A chat interface card with message history and input functionality.",
    dependencies: [],
    registryDeps: ["card", "avatar", "input", "button"],
  },
  {
    name: "cookie-settings",
    title: "Cookie Settings",
    description: "A cookie consent and settings management card with toggle switches.",
    dependencies: [],
    registryDeps: ["card", "switch", "button"],
  },
  {
    name: "create-account",
    title: "Create Account",
    description: "An account creation form card with input fields and validation.",
    dependencies: [],
    registryDeps: ["card", "button", "input", "label"],
  },
  {
    name: "data-table",
    title: "Data Table",
    description: "A data table card with sorting, filtering, and pagination capabilities.",
    dependencies: [],
    registryDeps: ["card", "table"],
  },
  {
    name: "metric",
    title: "Metric",
    description: "A metric display card with progress indicator and statistics.",
    dependencies: [],
    registryDeps: ["card", "progress"],
  },
  {
    name: "payment-method",
    title: "Payment Method",
    description: "A payment method selection and management card with form inputs.",
    dependencies: [],
    registryDeps: ["card", "button", "input", "label", "radio-group", "select"],
  },
  {
    name: "report-issue",
    title: "Report Issue",
    description: "An issue reporting form card with text inputs and dropdown selectors.",
    dependencies: [],
    registryDeps: ["card", "button", "input", "label", "select", "textarea"],
  },
  {
    name: "share",
    title: "Share",
    description: "A social sharing card with multiple platform options and link copying.",
    dependencies: [],
    registryDeps: ["card", "button", "input", "separator"],
  },
  {
    name: "stats",
    title: "Stats",
    description: "A statistics overview card with multiple metrics and chart visualizations.",
    dependencies: ["recharts"],
    registryDeps: ["card", "chart"],
  },
  {
    name: "team-members",
    title: "Team Members",
    description: "A team members management card with avatars and role selection.",
    dependencies: [],
    registryDeps: ["card", "button", "input", "select", "avatar"],
  },
]

async function readComponentFile(filename: string): Promise<string> {
  const filePath = path.join(ATOM_PATH, `${filename}.tsx`)
  return await fs.readFile(filePath, "utf-8")
}

function generateMDX(card: typeof CARDS[0], componentCode: string): string {
  const depsInstall = card.dependencies.length > 0
    ? `\`\`\`bash\nnpm install ${card.dependencies.join(" ")}\n\`\`\``
    : ""

  const depsStep = card.dependencies.length > 0
    ? `<Step>Install the following dependencies:</Step>\n\n${depsInstall}\n\n`
    : ""

  // Extract function name from component code
  const functionMatch = componentCode.match(/export function (Cards\w+)/);
  const functionName = functionMatch ? functionMatch[1] : `Cards${card.title.replace(/\s+/g, "")}`;

  return `---
title: ${card.title}
description: ${card.description}
component: true
---

<ComponentPreview
  code={\`${componentCode.trim()}\`}
>
  <${functionName} />
</ComponentPreview>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>

<TabsContent value="cli">

\`\`\`bash
npx codebase add ${card.name}
\`\`\`

</TabsContent>

<TabsContent value="manual">

<Steps>

${depsStep}<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  code={\`${componentCode.trim()}\`}
  title="components/atom/${card.name}.tsx"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

\`\`\`tsx showLineNumbers
import { ${functionName} } from "@/components/atom/${card.name}"
\`\`\`

\`\`\`tsx showLineNumbers
export default function Page() {
  return <${functionName} />
}
\`\`\`
`
}

async function generateAllDocs() {
  console.log("🎨 Generating beautiful MDX documentation for card components...\n")

  let generated = 0

  for (const card of CARDS) {
    try {
      const componentCode = await readComponentFile(card.name)
      const mdxContent = generateMDX(card, componentCode)
      const outputPath = path.join(CONTENT_PATH, `${card.name}.mdx`)

      await fs.writeFile(outputPath, mdxContent)
      console.log(`  ✅ Generated ${card.name}.mdx`)
      generated++
    } catch (error) {
      console.error(`  ❌ Failed to generate ${card.name}.mdx:`, error)
    }
  }

  console.log(`\n✨ Successfully generated ${generated}/${CARDS.length} documentation files!`)
}

generateAllDocs().catch(console.error)
