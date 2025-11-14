import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import { templates } from "../src/registry/registry-templates"
import { registryCategories } from "../src/registry/registry-categories"
import { atoms } from "../src/registry/default/atoms/_registry"
import type { RegistryItemSchema } from "../src/registry/schema"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")
const REGISTRY_PATH = path.join(PROJECT_ROOT, "src", "registry")
const PUBLIC_REGISTRY_PATH = path.join(PROJECT_ROOT, "public", "r")

async function ensureDir(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (error) {
    console.error(`Failed to create directory ${dirPath}:`, error)
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function syncStyles() {
  console.log("Syncing styles...")

  const sourceStyle = "new-york"
  const targetStyle = "default"

  for (const template of templates) {
    for (const file of template.files) {
      const sourcePath = path.join(REGISTRY_PATH, sourceStyle, file.path)
      const targetPath = path.join(REGISTRY_PATH, targetStyle, file.path)

      if (await fileExists(sourcePath)) {
        const targetDir = path.dirname(targetPath)
        await ensureDir(targetDir)

        let content = await fs.readFile(sourcePath, "utf-8")
        // Replace style imports
        content = content.replace(
          new RegExp(`@/registry/${sourceStyle}/`, "g"),
          `@/registry/${targetStyle}/`
        )

        await fs.writeFile(targetPath, content)
        console.log(`  Synced ${file.path}`)
      }
    }
  }
}

async function buildRegistry() {
  console.log("Building registry index...")

  const registryIndex: Record<string, any> = {
    default: {},
    "new-york": {}
  }

  // Build templates registry
  for (const style of ["default", "new-york"]) {
    for (const template of templates) {
      // Create lazy-loaded component mapping
      registryIndex[style][template.name] = {
        name: template.name,
        description: template.description,
        type: template.type,
        component: `React.lazy(() => import("@/registry/${style}/templates/${template.name}/page"))`,
        files: template.files.map(f => `registry/${style}/${f.path}`),
        dependencies: template.dependencies || [],
        registryDependencies: template.registryDependencies || [],
        categories: template.categories || [],
        meta: template.meta || {}
      }
    }
  }

  // Build atoms registry (only for default style since atoms are not style-specific)
  for (const atom of atoms) {
    registryIndex["default"][atom.name] = {
      name: atom.name,
      description: atom.description,
      type: atom.type,
      files: atom.files?.map(f => f.path) || [],
      dependencies: atom.dependencies || [],
      registryDependencies: atom.registryDependencies || [],
      categories: atom.categories || [],
      meta: atom.meta || {}
    }
    // Copy atoms to new-york style as well
    registryIndex["new-york"][atom.name] = registryIndex["default"][atom.name]
  }

  const indexContent = `import React from "react"

export const Index: Record<string, any> = ${JSON.stringify(registryIndex, null, 2)
    .replace(/"React\.lazy\((.*?)\)"/g, "React.lazy($1)")
    .replace(/\\"/g, '"')}
`

  await ensureDir(path.join(PROJECT_ROOT, "src", "__registry__"))
  await fs.writeFile(path.join(PROJECT_ROOT, "src", "__registry__", "index.tsx"), indexContent)
}

async function buildStyleJSONs() {
  console.log("Building style JSONs...")

  for (const style of ["default", "new-york"]) {
    const styleDir = path.join(PUBLIC_REGISTRY_PATH, "styles", style)
    await ensureDir(styleDir)

    // Build template JSONs
    for (const template of templates) {
      const files = []

      for (const file of template.files) {
        const filePath = path.join(REGISTRY_PATH, style, file.path)

        if (await fileExists(filePath)) {
          const content = await fs.readFile(filePath, "utf-8")

          files.push({
            path: file.path,
            content: content,
            type: file.type,
            target: file.target || file.path.replace("templates/", "app/")
          })
        }
      }

      const registryItem: RegistryItemSchema = {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        name: template.name,
        description: template.description,
        type: template.type,
        dependencies: template.dependencies,
        registryDependencies: template.registryDependencies,
        files: files,
        categories: template.categories,
        meta: template.meta
      }

      await fs.writeFile(
        path.join(styleDir, `${template.name}.json`),
        JSON.stringify(registryItem, null, 2)
      )
      console.log(`  Created ${style}/${template.name}.json`)
    }

    // Build atom JSONs (atoms are in src/components/atom/ not in registry/)
    for (const atom of atoms) {
      const files = []

      for (const file of atom.files || []) {
        const filePath = path.join(PROJECT_ROOT, "src", file.path)

        if (await fileExists(filePath)) {
          const content = await fs.readFile(filePath, "utf-8")

          files.push({
            path: file.path,
            content: content,
            type: file.type || "registry:component",
            target: file.target || `components/${file.path.replace("components/atom/", "")}`
          })
        }
      }

      const registryItem: RegistryItemSchema = {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        name: atom.name,
        description: atom.description,
        type: atom.type,
        dependencies: atom.dependencies,
        registryDependencies: atom.registryDependencies,
        files: files,
        categories: atom.categories,
        meta: atom.meta
      }

      await fs.writeFile(
        path.join(styleDir, `${atom.name}.json`),
        JSON.stringify(registryItem, null, 2)
      )
      console.log(`  Created ${style}/${atom.name}.json`)
    }
  }
}

async function buildCategories() {
  console.log("Building categories...")

  const categoriesPath = path.join(PUBLIC_REGISTRY_PATH, "categories.json")
  await fs.writeFile(
    categoriesPath,
    JSON.stringify(registryCategories, null, 2)
  )
}

async function buildThemes() {
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
          ring: "222.2 84% 4.9%"
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
          ring: "212.7 26.8% 83.9%"
        }
      }
    }
  }

  await ensureDir(path.join(PUBLIC_REGISTRY_PATH, "colors"))

  for (const [name, theme] of Object.entries(themes)) {
    await fs.writeFile(
      path.join(PUBLIC_REGISTRY_PATH, "colors", `${name}.json`),
      JSON.stringify(theme, null, 2)
    )
  }

  // Generate CSS
  let css = ""
  for (const [themeName, theme] of Object.entries(themes)) {
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

async function build() {
  console.log("Starting template build process...")

  try {
    await syncStyles()
    await buildRegistry()
    await buildStyleJSONs()
    await buildCategories()
    await buildThemes()

    console.log("Build completed successfully!")
  } catch (error) {
    console.error("Build failed:", error)
    process.exit(1)
  }
}

// Run build
build()