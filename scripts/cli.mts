#!/usr/bin/env node

import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import { promisify } from "util"
import { exec as execCallback } from "child_process"

const exec = promisify(execCallback)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")

interface RegistryItem {
  name: string
  type: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: Array<{
    path: string
    content: string
    type: string
    target?: string
  }>
}

// Registry base resolves in fetchRegistryItem (remote-first, local fallback)
const COMPONENTS_PATH = path.join(PROJECT_ROOT, "src", "components")

async function fetchRegistryItem(name: string): Promise<RegistryItem> {
  // Deployed registry first (override with CODEBASE_REGISTRY_URL), local
  // public/r fallback for development inside the repo.
  const baseUrl =
    process.env.CODEBASE_REGISTRY_URL ?? "https://cb.databayt.org/r/styles/default"

  try {
    const res = await fetch(`${baseUrl}/${name}.json`)
    if (res.ok) return (await res.json()) as RegistryItem
  } catch {
    // fall through to local read
  }

  const jsonPath = path.join(PROJECT_ROOT, "public", "r", "styles", "default", `${name}.json`)
  try {
    const content = await fs.readFile(jsonPath, "utf-8")
    return JSON.parse(content) as RegistryItem
  } catch {
    throw new Error(`Component "${name}" not found in registry (remote + local)`)
  }
}

async function ensureDir(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (error) {
    // Directory already exists
  }
}

async function installDependencies(dependencies: string[]) {
  if (dependencies.length === 0) return

  console.log(`\n📦 Installing dependencies: ${dependencies.join(", ")}`)

  try {
    await exec(`pnpm add ${dependencies.join(" ")}`)
    console.log("✅ Dependencies installed")
  } catch (error) {
    console.error("❌ Failed to install dependencies:", error)
  }
}

async function addComponent(name: string) {
  console.log(`\n🔍 Fetching ${name} from registry...`)

  try {
    const item = await fetchRegistryItem(name)

    console.log(`📝 ${item.description || "No description"}`)
    console.log(`📦 Type: ${item.type}`)

    // Install dependencies
    if (item.dependencies && item.dependencies.length > 0) {
      await installDependencies(item.dependencies)
    }

    // Install registry dependencies (other components)
    if (item.registryDependencies && item.registryDependencies.length > 0) {
      console.log(`\n🔗 Registry dependencies: ${item.registryDependencies.join(", ")}`)
      for (const dep of item.registryDependencies) {
        await addComponent(dep)
      }
    }

    // Write files
    console.log(`\n📁 Writing component files...`)
    for (const file of item.files) {
      const targetPath = path.join(PROJECT_ROOT, "src", file.target || file.path)
      const targetDir = path.dirname(targetPath)

      await ensureDir(targetDir)
      await fs.writeFile(targetPath, file.content)

      console.log(`  ✅ ${file.target || file.path}`)
    }

    console.log(`\n✨ Successfully added ${name}!`)
  } catch (error) {
    console.error(`\n❌ Error adding ${name}:`, (error as Error).message)
    process.exit(1)
  }
}

async function listComponents() {
  console.log("\n📋 Available components:\n")

  const registryDir = path.join(PROJECT_ROOT, "public", "r", "styles", "default")

  try {
    const files = await fs.readdir(registryDir)
    const jsonFiles = files.filter(f => f.endsWith(".json"))

    const items: Array<{ name: string; description: string; type: string }> = []

    for (const file of jsonFiles) {
      const content = await fs.readFile(path.join(registryDir, file), "utf-8")
      const item = JSON.parse(content)
      items.push({
        name: item.name,
        description: item.description || "",
        type: item.type
      })
    }

    // Group by type
    const atoms = items.filter(i => i.type === "registry:atom")
    const templates = items.filter(i => i.type === "registry:template")
    const others = items.filter(i => !["registry:atom", "registry:template"].includes(i.type))

    if (atoms.length > 0) {
      console.log("🔹 Atoms:")
      atoms.forEach(item => {
        console.log(`  ${item.name.padEnd(30)} ${item.description}`)
      })
    }

    if (templates.length > 0) {
      console.log("\n📄 Templates:")
      templates.forEach(item => {
        console.log(`  ${item.name.padEnd(30)} ${item.description}`)
      })
    }

    if (others.length > 0) {
      console.log("\n📦 Other:")
      others.forEach(item => {
        console.log(`  ${item.name.padEnd(30)} ${item.description}`)
      })
    }

    console.log(`\n💡 Usage: pnpm codebase add <component-name>`)
  } catch (error) {
    console.error("❌ Error listing components:", (error as Error).message)
    process.exit(1)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  const componentName = args[1]

  console.log("🚀 Codebase CLI\n")

  if (!command || command === "help") {
    console.log("Usage:")
    console.log("  pnpm codebase add <component>  Add a component from the registry")
    console.log("  pnpm codebase list             List all available components")
    console.log("  pnpm codebase help             Show this help message")
    return
  }

  switch (command) {
    case "add":
      if (!componentName) {
        console.error("❌ Error: Please specify a component name")
        console.log("Usage: pnpm codebase add <component>")
        process.exit(1)
      }
      await addComponent(componentName)
      break

    case "list":
      await listComponents()
      break

    default:
      console.error(`❌ Unknown command: ${command}`)
      console.log("\nRun 'pnpm codebase help' for usage information")
      process.exit(1)
  }
}

main().catch(console.error)
