#!/usr/bin/env node

import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import { promisify } from "util"
import { exec as execCallback } from "child_process"

const exec = promisify(execCallback)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")
const SHADCN_PATH = "C:\\Users\\pc\\Downloads\\ui-main\\ui-main\\apps\\v4"

interface ComponentChange {
  name: string
  status: "new" | "updated" | "deleted"
  path: string
}

async function checkShadcnPath(): Promise<boolean> {
  try {
    await fs.access(SHADCN_PATH)
    return true
  } catch {
    return false
  }
}

async function readRegistryFiles(registryPath: string): Promise<Map<string, string>> {
  const files = new Map<string, string>()

  try {
    const entries = await fs.readdir(registryPath, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith("registry-")) {
        const dirPath = path.join(registryPath, entry.name)
        const dirFiles = await fs.readdir(dirPath)

        for (const file of dirFiles) {
          if (file.endsWith(".ts") || file.endsWith(".tsx")) {
            const filePath = path.join(dirPath, file)
            const content = await fs.readFile(filePath, "utf-8")
            files.set(file, content)
          }
        }
      }
    }
  } catch (error) {
    console.error("Error reading registry files:", error)
  }

  return files
}

async function checkUIComponents(): Promise<ComponentChange[]> {
  console.log("\n🔍 Checking shadcn/ui components...\n")

  const shadcnUIPath = path.join(SHADCN_PATH, "registry", "new-york-v4", "ui")
  const ourUIPath = path.join(PROJECT_ROOT, "src", "components", "ui")

  const changes: ComponentChange[] = []

  try {
    const shadcnFiles = await fs.readdir(shadcnUIPath)
    const ourFiles = await fs.readdir(ourUIPath)

    const shadcnComponents = new Set(shadcnFiles.filter(f => f.endsWith(".tsx")))
    const ourComponents = new Set(ourFiles.filter(f => f.endsWith(".tsx")))

    // Find new components in shadcn
    for (const file of shadcnComponents) {
      if (!ourComponents.has(file)) {
        changes.push({
          name: file.replace(".tsx", ""),
          status: "new",
          path: path.join(shadcnUIPath, file)
        })
      }
    }

    // Find updated components (basic check)
    for (const file of shadcnComponents) {
      if (ourComponents.has(file)) {
        const shadcnContent = await fs.readFile(path.join(shadcnUIPath, file), "utf-8")
        const ourContent = await fs.readFile(path.join(ourUIPath, file), "utf-8")

        if (shadcnContent !== ourContent) {
          changes.push({
            name: file.replace(".tsx", ""),
            status: "updated",
            path: path.join(shadcnUIPath, file)
          })
        }
      }
    }

    // Find deleted components
    for (const file of ourComponents) {
      if (!shadcnComponents.has(file)) {
        changes.push({
          name: file.replace(".tsx", ""),
          status: "deleted",
          path: path.join(ourUIPath, file)
        })
      }
    }
  } catch (error) {
    console.error("Error checking UI components:", error)
  }

  return changes
}

async function checkBlocks(): Promise<ComponentChange[]> {
  console.log("🔍 Checking shadcn/ui blocks...\n")

  const shadcnBlocksPath = path.join(SHADCN_PATH, "registry", "new-york-v4", "blocks")
  const changes: ComponentChange[] = []

  try {
    const shadcnBlocks = await fs.readdir(shadcnBlocksPath, { withFileTypes: true })

    for (const entry of shadcnBlocks) {
      if (entry.isDirectory() && !entry.name.startsWith("_")) {
        changes.push({
          name: entry.name,
          status: "new",
          path: path.join(shadcnBlocksPath, entry.name)
        })
      }
    }
  } catch (error) {
    console.error("Error checking blocks:", error)
  }

  return changes
}

async function displayChanges(uiChanges: ComponentChange[], blockChanges: ComponentChange[]) {
  console.log("📊 Sync Report\n")
  console.log("=" .repeat(60))

  if (uiChanges.length > 0) {
    console.log("\n🎨 UI Components:\n")

    const newComponents = uiChanges.filter(c => c.status === "new")
    const updatedComponents = uiChanges.filter(c => c.status === "updated")
    const deletedComponents = uiChanges.filter(c => c.status === "deleted")

    if (newComponents.length > 0) {
      console.log(`  ✨ New (${newComponents.length}):`)
      newComponents.forEach(c => console.log(`     - ${c.name}`))
    }

    if (updatedComponents.length > 0) {
      console.log(`\n  🔄 Updated (${updatedComponents.length}):`)
      updatedComponents.forEach(c => console.log(`     - ${c.name}`))
    }

    if (deletedComponents.length > 0) {
      console.log(`\n  ❌ Deleted (${deletedComponents.length}):`)
      deletedComponents.forEach(c => console.log(`     - ${c.name}`))
    }
  } else {
    console.log("\n✅ UI Components: Up to date")
  }

  if (blockChanges.length > 0) {
    console.log(`\n\n📦 Blocks (${blockChanges.length} available):\n`)
    blockChanges.slice(0, 10).forEach(c => console.log(`     - ${c.name}`))
    if (blockChanges.length > 10) {
      console.log(`     ... and ${blockChanges.length - 10} more`)
    }
  }

  console.log("\n" + "=".repeat(60))
  console.log("\n💡 Actions:")
  console.log("   - Review changes in shadcn/ui repository")
  console.log("   - Manually copy updated components if needed")
  console.log("   - Consider creating new atoms from blocks")
  console.log("\n📍 Shadcn source: " + SHADCN_PATH)
}

async function main() {
  console.log("🔄 Shadcn/UI Sync Tool\n")

  // Check if shadcn path exists
  const pathExists = await checkShadcnPath()

  if (!pathExists) {
    console.error("❌ Error: shadcn/ui source not found at:")
    console.error(`   ${SHADCN_PATH}`)
    console.error("\n💡 Update SHADCN_PATH in scripts/sync-shadcn.mts")
    process.exit(1)
  }

  console.log("✅ Found shadcn/ui source\n")

  // Check for changes
  const [uiChanges, blockChanges] = await Promise.all([
    checkUIComponents(),
    checkBlocks()
  ])

  await displayChanges(uiChanges, blockChanges)

  console.log("\n✨ Sync check complete!")
}

main().catch(console.error)
