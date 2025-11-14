"use server"

import { cache } from "react"
import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"
import { registryItemSchema } from "@/components/root/template/registry"

export type RegistryItem = z.infer<typeof registryItemSchema>

export interface Template extends RegistryItem {
  style?: string
}

export async function getAllTemplateIds(
  types: z.infer<typeof registryItemSchema>["type"][] = [
    "registry:template",
  ],
  categories: string[] = []
): Promise<string[]> {
  const templates = await getAllTemplates(types, categories)

  return templates.map((template) => template.name)
}

export async function getAllTemplates(
  types: z.infer<typeof registryItemSchema>["type"][] = [
    "registry:template",
  ],
  categories: string[] = []
) {
  const { Index } = await import("@/__registry__/index")

  // Collect all templates from all styles.
  const allTemplates: z.infer<typeof registryItemSchema>[] = []

  for (const style in Index) {
    const styleIndex = Index[style]
    if (typeof styleIndex === "object" && styleIndex !== null) {
      for (const itemName in styleIndex) {
        const item = styleIndex[itemName]
        allTemplates.push(item)
      }
    }
  }

  // Validate each template.
  const validatedTemplates = allTemplates
    .map((template) => {
      const result = registryItemSchema.safeParse(template)
      return result.success ? result.data : null
    })
    .filter(
      (template): template is z.infer<typeof registryItemSchema> => template !== null
    )

  return validatedTemplates.filter(
    (template) =>
      types.includes(template.type) &&
      (categories.length === 0 ||
        template.categories?.some((category) => categories.includes(category)))
  )
}

// Get a specific template by name
export const getTemplate = cache(
  async (name: string, style = "new-york"): Promise<Template | null> => {
    try {
      const { Index } = await import("@/__registry__/index")

      // First try the requested style
      if (Index[style] && Index[style][name]) {
        return {
          ...Index[style][name],
          style,
        }
      }

      // If not found, try all styles
      for (const s of Object.keys(Index)) {
        if (Index[s][name]) {
          return {
            ...Index[s][name],
            style: s,
          }
        }
      }

      // If still not found, try to fetch from JSON
      const jsonPath = path.join(
        process.cwd(),
        "public/r/templates",
        style,
        `${name}.json`
      )

      try {
        const jsonContent = await fs.readFile(jsonPath, "utf-8")
        const template = JSON.parse(jsonContent)
        return {
          ...template,
          style,
        }
      } catch {
        // JSON file doesn't exist
      }

      return null
    } catch (error) {
      console.error(`Error fetching template ${name}:`, error)
      return null
    }
  }
)

// Get templates by category
export const getTemplatesByCategory = cache(
  async (category: string): Promise<Template[]> => {
    return getAllTemplates(["registry:template"], [category])
  }
)

// Get template file tree structure
export interface FileTreeNode {
  name: string
  path: string
  type: "file" | "folder"
  children?: FileTreeNode[]
}

export async function createFileTreeFromFiles(
  files: Array<{ path: string; type?: string; target?: string }>
): Promise<FileTreeNode[]> {
  const root: { [key: string]: FileTreeNode } = {}

  files.forEach((file) => {
    const parts = file.path.split("/")
    let current = root

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1
      const nodePath = parts.slice(0, index + 1).join("/")

      if (!current[part]) {
        current[part] = {
          name: part,
          path: nodePath,
          type: isFile ? "file" : "folder",
        }

        if (!isFile) {
          current[part].children = []
        }
      }

      if (!isFile && current[part].children) {
        // Create a mapping for the next level
        const childMap: { [key: string]: FileTreeNode } = {}
        current[part].children!.forEach((child) => {
          childMap[child.name] = child
        })
        current = childMap
      }
    })
  })

  // Convert the object to an array
  return Object.values(root)
}

// Get template dependencies (both npm and registry)
export async function getTemplateDependencies(name: string, style = "default") {
  const template = await getTemplate(name, style)
  if (!template) {
    return {
      dependencies: [],
      devDependencies: [],
      registryDependencies: [],
    }
  }

  return {
    dependencies: template.dependencies || [],
    devDependencies: template.devDependencies || [],
    registryDependencies: template.registryDependencies || [],
  }
}

// Check if a template exists
export async function templateExists(name: string, style = "default"): Promise<boolean> {
  const template = await getTemplate(name, style)
  return template !== null
}

// Get featured templates
export async function getFeaturedTemplates(): Promise<Template[]> {
  // Define featured template names
  const featured = ["login-01", "hero-01", "sidebar-01", "header-01", "footer-01"]

  const templates: Template[] = []
  for (const name of featured) {
    const template = await getTemplate(name)
    if (template) {
      templates.push(template)
    }
  }

  return templates
}

// Get template code content
export async function getTemplateCode(
  name: string,
  style = "default"
): Promise<{ files: Array<{ path: string; content: string }> } | null> {
  try {
    // Try to fetch from JSON file first (includes processed content)
    const jsonPath = path.join(
      process.cwd(),
      "public/r/templates",
      style,
      `${name}.json`
    )

    const jsonContent = await fs.readFile(jsonPath, "utf-8")
    const template = JSON.parse(jsonContent)

    if (template.files) {
      return {
        files: template.files.map((file: any) => ({
          path: file.path,
          content: file.content || "",
        })),
      }
    }

    return null
  } catch (error) {
    console.error(`Error fetching template code for ${name}:`, error)
    return null
  }
}