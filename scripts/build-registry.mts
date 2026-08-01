import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import { createRequire } from "module"
import type { RegistryItem, RegistryItemFile } from "../src/registry/schema"

// Node 25 no longer surfaces named exports from CJS-transpiled .ts modules
// into .mts ESM imports; createRequire sidesteps the interop entirely.
const require = createRequire(import.meta.url)
const { templates } = require("../src/registry/registry-templates") as {
  templates: RegistryItem[]
}
const { registryCategories } = require("../src/registry/registry-categories") as {
  registryCategories: unknown
}
const { atoms } = require("../src/registry/default/atoms/_registry") as {
  atoms: RegistryItem[]
}
const { uiItems } = require("../src/registry/registry-ui") as {
  uiItems: RegistryItem[]
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")
const REGISTRY_PATH = path.join(PROJECT_ROOT, "src", "registry")
const PUBLIC_REGISTRY_PATH = path.join(PROJECT_ROOT, "public", "r")

const STYLES = ["default", "new-york"] as const
type Style = (typeof STYLES)[number]

async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true })
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

// new-york is the source of truth for template sources; default is generated.
async function syncStyles(): Promise<void> {
  console.log("Syncing styles (new-york -> default)...")

  const sourceStyle = "new-york"
  const targetStyle = "default"

  for (const template of templates) {
    for (const file of template.files ?? []) {
      const sourcePath = path.join(REGISTRY_PATH, sourceStyle, file.path)
      const targetPath = path.join(REGISTRY_PATH, targetStyle, file.path)

      if (await fileExists(sourcePath)) {
        await ensureDir(path.dirname(targetPath))

        let content = await fs.readFile(sourcePath, "utf-8")
        content = content.replace(
          new RegExp(`@/registry/${sourceStyle}/`, "g"),
          `@/registry/${targetStyle}/`
        )

        await fs.writeFile(targetPath, content)
      }
    }
  }
}

async function buildRegistryIndex(): Promise<void> {
  console.log("Building registry index (src/__registry__/index.tsx)...")

  const registryIndex: Record<string, Record<string, unknown>> = {
    default: {},
    "new-york": {},
  }

  for (const style of STYLES) {
    for (const template of templates) {
      registryIndex[style][template.name] = {
        name: template.name,
        description: template.description,
        type: template.type,
        component: `React.lazy(() => import("@/registry/${style}/templates/${template.name}/page"))`,
        files: (template.files ?? []).map((f) => `registry/${style}/${f.path}`),
        dependencies: template.dependencies || [],
        registryDependencies: template.registryDependencies || [],
        categories: template.categories || [],
        meta: template.meta || {},
      }
    }
  }

  // Atoms are style-invariant: computed once, aliased into new-york.
  for (const atom of atoms) {
    registryIndex["default"][atom.name] = {
      name: atom.name,
      description: atom.description,
      type: atom.type,
      files: (atom.files ?? []).map((f) => f.path),
      dependencies: atom.dependencies || [],
      registryDependencies: atom.registryDependencies || [],
      categories: atom.categories || [],
      meta: atom.meta || {},
    }
    registryIndex["new-york"][atom.name] = registryIndex["default"][atom.name]
  }

  const indexContent = `import React from "react"

export const Index: Record<string, any> = ${JSON.stringify(registryIndex, null, 2)
    .replace(/"React\.lazy\((.*?)\)"/g, "React.lazy($1)")
    .replace(/\\"/g, '"')}
`

  await ensureDir(path.join(PROJECT_ROOT, "src", "__registry__"))
  await fs.writeFile(
    path.join(PROJECT_ROOT, "src", "__registry__", "index.tsx"),
    indexContent
  )
}

async function resolveItemFiles(
  item: RegistryItem,
  style: Style
): Promise<RegistryItemFile[]> {
  const files: RegistryItemFile[] = []

  for (const file of item.files ?? []) {
    // Templates live per-style under src/registry/<style>/; atoms and ui
    // live style-invariant under src/.
    const filePath =
      item.type === "registry:template"
        ? path.join(REGISTRY_PATH, style, file.path)
        : path.join(PROJECT_ROOT, "src", file.path)

    if (!(await fileExists(filePath))) continue

    const content = await fs.readFile(filePath, "utf-8")
    const target =
      file.target ??
      (item.type === "registry:template"
        ? file.path.replace("templates/", "app/")
        : item.type === "registry:ui"
          ? file.path
          : `components/${file.path.replace("components/atom/", "")}`)

    files.push({
      path: file.path,
      content,
      type: (file.type ?? "registry:component") as RegistryItemFile["type"],
      target,
    } as RegistryItemFile)
  }

  return files
}

function toRegistryJson(item: RegistryItem, files: RegistryItemFile[]): RegistryItem {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    description: item.description,
    type: item.type,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    files,
    categories: item.categories,
    meta: item.meta,
  }
}

async function buildStyleJSONs(): Promise<void> {
  console.log("Building style JSONs (public/r/styles)...")

  for (const style of STYLES) {
    const styleDir = path.join(PUBLIC_REGISTRY_PATH, "styles", style)
    // Clean rebuild so deleted registry entries don't leave orphan JSONs.
    await fs.rm(styleDir, { recursive: true, force: true })
    await ensureDir(styleDir)

    for (const item of [...templates, ...atoms, ...uiItems]) {
      const files = await resolveItemFiles(item, style)
      await fs.writeFile(
        path.join(styleDir, `${item.name}.json`),
        JSON.stringify(toRegistryJson(item, files), null, 2)
      )
    }
    console.log(
      `  ${style}: ${templates.length} templates + ${atoms.length} atoms + ${uiItems.length} ui`
    )
  }
}

// Legacy URL surface consumed by getTemplateCode(): /r/templates/<style>/<name>.json
async function buildTemplateJSONs(): Promise<void> {
  console.log("Building template JSONs (public/r/templates)...")

  for (const style of STYLES) {
    const dir = path.join(PUBLIC_REGISTRY_PATH, "templates", style)
    await fs.rm(dir, { recursive: true, force: true })
    await ensureDir(dir)

    for (const template of templates) {
      const files = await resolveItemFiles(template, style)
      await fs.writeFile(
        path.join(dir, `${template.name}.json`),
        JSON.stringify(toRegistryJson(template, files), null, 2)
      )
    }

    await fs.writeFile(
      path.join(dir, "registry.json"),
      JSON.stringify(
        {
          name: "codebase-templates",
          homepage: "https://cb.databayt.org/templates",
          items: templates.map((t) => t.name),
        },
        null,
        2
      )
    )
  }
}

async function buildCategories(): Promise<void> {
  console.log("Building categories...")
  await fs.writeFile(
    path.join(PUBLIC_REGISTRY_PATH, "categories.json"),
    JSON.stringify(registryCategories, null, 2)
  )
}

async function buildThemes(): Promise<void> {
  console.log("Building themes...")

  const themes = {
    slate: {
      cssVars: {
        light: {
          background: "0 0% 100%",
          foreground: "222.2 84% 4.9%",
          card: "0 0% 100%",
          "card-foreground": "222.2 84% 4.9%",
          popover: "0 0% 100%",
          "popover-foreground": "222.2 84% 4.9%",
          primary: "222.2 47.4% 11.2%",
          "primary-foreground": "210 40% 98%",
          secondary: "210 40% 96.1%",
          "secondary-foreground": "222.2 47.4% 11.2%",
          muted: "210 40% 96.1%",
          "muted-foreground": "215.4 16.3% 46.9%",
          accent: "210 40% 96.1%",
          "accent-foreground": "222.2 47.4% 11.2%",
          destructive: "0 84.2% 60.2%",
          "destructive-foreground": "210 40% 98%",
          border: "214.3 31.8% 91.4%",
          input: "214.3 31.8% 91.4%",
          ring: "222.2 84% 4.9%",
        },
        dark: {
          background: "222.2 84% 4.9%",
          foreground: "210 40% 98%",
          card: "222.2 84% 4.9%",
          "card-foreground": "210 40% 98%",
          popover: "222.2 84% 4.9%",
          "popover-foreground": "210 40% 98%",
          primary: "210 40% 98%",
          "primary-foreground": "222.2 47.4% 11.2%",
          secondary: "217.2 32.6% 17.5%",
          "secondary-foreground": "210 40% 98%",
          muted: "217.2 32.6% 17.5%",
          "muted-foreground": "215 20.2% 65.1%",
          accent: "217.2 32.6% 17.5%",
          "accent-foreground": "210 40% 98%",
          destructive: "0 62.8% 30.6%",
          "destructive-foreground": "210 40% 98%",
          border: "217.2 32.6% 17.5%",
          input: "217.2 32.6% 17.5%",
          ring: "212.7 26.8% 83.9%",
        },
      },
    },
  }

  await ensureDir(path.join(PUBLIC_REGISTRY_PATH, "colors"))

  for (const [name, theme] of Object.entries(themes)) {
    await fs.writeFile(
      path.join(PUBLIC_REGISTRY_PATH, "colors", `${name}.json`),
      JSON.stringify(theme, null, 2)
    )
  }

  let css = ""
  for (const [, theme] of Object.entries(themes)) {
    for (const [mode, vars] of Object.entries(theme.cssVars)) {
      const selector = mode === "light" ? `:root` : `.dark`
      css += `${selector} {\n`
      for (const [key, value] of Object.entries(vars)) {
        css += `  --${key}: ${value};\n`
      }
      css += `}\n\n`
    }
  }

  await fs.writeFile(path.join(PUBLIC_REGISTRY_PATH, "themes.css"), css)
}

async function build(): Promise<void> {
  console.log("Building registry...")

  try {
    await syncStyles()
    await buildRegistryIndex()
    await buildStyleJSONs()
    await buildTemplateJSONs()
    await buildCategories()
    await buildThemes()

    console.log("Build completed successfully!")
  } catch (error) {
    console.error("Build failed:", error)
    process.exit(1)
  }
}

build()
