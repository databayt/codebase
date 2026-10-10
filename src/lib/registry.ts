// Registry lookups — a port of shadcn's apps/v4/lib/registry.ts for our one
// base (Base UI) and one style. Same function names and behavior.
import { promises as fs } from "fs"
import path from "path"
import { getComponent as getExamplesComponent } from "@/examples/__components__"
import { ExamplesIndex } from "@/examples/__index__"
import { registryItemSchema, type RegistryItem } from "shadcn/schema"

import { getComponent as getStylesComponent } from "@/registry/__components__"
import { Index as StylesIndex } from "@/registry/__index__"

export const DEFAULT_STYLE = "base-nova"

type RegistryItemFile = NonNullable<RegistryItem["files"]>[number]

const registryCache = new Map<string, RegistryItem | null>()

function getDemoIndexKey(styleName: string) {
  if (ExamplesIndex[styleName]) {
    return styleName
  }
  const base = styleName.split("-")[0]
  return ExamplesIndex[base] ? base : styleName
}

export function getDemoComponent(name: string, styleName: string = DEFAULT_STYLE) {
  return getExamplesComponent(getDemoIndexKey(styleName), name)
}

export async function getDemoItem(name: string, styleName: string = DEFAULT_STYLE) {
  const demo = ExamplesIndex[getDemoIndexKey(styleName)]?.[name]
  if (!demo) {
    return null
  }

  const content = await fs.readFile(path.join(process.cwd(), demo.filePath), "utf-8")

  return {
    name: demo.name,
    type: "registry:internal" as const,
    files: [
      {
        path: demo.filePath,
        content,
        type: "registry:internal" as const,
      },
    ],
  }
}

export function getRegistryComponent(name: string, styleName: string = DEFAULT_STYLE) {
  return getDemoComponent(name, styleName) ?? getStylesComponent(styleName, name)
}

export async function getRegistryItems(
  styleName: string = DEFAULT_STYLE,
  filter?: (item: RegistryItem) => boolean
) {
  const entries = Object.values(StylesIndex[styleName] ?? {}).filter(
    (entry) => !filter || filter(entry as RegistryItem)
  )
  const items = await Promise.all(
    entries.map((entry) => getRegistryItem(entry.name, styleName))
  )
  return items.filter(Boolean)
}

export async function getRegistryItem(
  name: string,
  styleName: string = DEFAULT_STYLE
): Promise<RegistryItem | null> {
  const cacheKey = `${styleName}:${name}`
  if (process.env.NODE_ENV === "production" && registryCache.has(cacheKey)) {
    return registryCache.get(cacheKey) ?? null
  }

  const item = StylesIndex[styleName]?.[name]
  if (!item) {
    registryCache.set(cacheKey, null)
    return null
  }

  // Fail early before doing expensive file operations.
  const result = registryItemSchema.safeParse(item) as
    | { success: true; data: RegistryItem }
    | { success: false }
  if (!result.success) {
    registryCache.set(cacheKey, null)
    return null
  }

  let files: RegistryItem["files"] = await Promise.all(
    (item.files as RegistryItemFile[]).map(async (file) => ({
      ...file,
      path: path.relative(process.cwd(), file.path),
      content: await getFileContent(file),
    }))
  )

  files = fixFilePaths(files)

  const parsed = registryItemSchema.safeParse({ ...result.data, files }) as
    | { success: true; data: RegistryItem }
    | { success: false; error: Error }
  if (!parsed.success) {
    console.error(parsed.error.message)
    registryCache.set(cacheKey, null)
    return null
  }

  registryCache.set(cacheKey, parsed.data)
  return parsed.data
}

async function getFileContent(file: RegistryItemFile) {
  let code = await fs.readFile(path.join(process.cwd(), file.path), "utf-8")

  // Some registry items use default export. We want named exports instead.
  if (file.type !== "registry:page") {
    code = code.replaceAll("export default", "export")
  }

  return fixImport(code)
}

function getFileTarget(file: RegistryItemFile) {
  let target = file.target

  if (!target || target === "") {
    const fileName = file.path.split("/").pop()
    if (
      file.type === "registry:block" ||
      file.type === "registry:component" ||
      file.type === "registry:example"
    ) {
      target = `components/${fileName}`
    }

    if (file.type === "registry:ui") {
      target = `components/ui/${fileName}`
    }

    if (file.type === "registry:hook") {
      target = `hooks/${fileName}`
    }

    if (file.type === "registry:lib") {
      target = `lib/${fileName}`
    }
  }

  return target ?? ""
}

function fixFilePaths(files: RegistryItem["files"]): RegistryItemFile[] {
  if (!files) {
    return []
  }

  // Resolve all paths relative to the first file's directory.
  const firstFilePathDir = path.dirname(files[0].path)

  return files.map((file) => ({
    ...file,
    path: path.relative(firstFilePathDir, file.path),
    target: getFileTarget(file),
  }))
}

// Rewrites registry-internal imports to what the code looks like once
// installed — the same mapping the shadcn CLI applies on `add`.
export function fixImport(content: string) {
  const regex = /@\/(.+?)\/((?:.*?\/)?(?:components|ui|hooks|lib))\/([\w-]+)/g

  const replacement = (
    match: string,
    importPath: string,
    type: string,
    component: string
  ) => {
    if (!importPath.startsWith("registry")) {
      return match
    }
    if (type.endsWith("components")) {
      return `@/components/${component}`
    } else if (type.endsWith("ui")) {
      return `@/components/ui/${component}`
    } else if (type.endsWith("hooks")) {
      return `@/hooks/${component}`
    } else if (type.endsWith("lib")) {
      return `@/lib/${component}`
    }

    return match
  }

  return content.replace(regex, replacement)
}

export type FileTree = {
  name: string
  path?: string
  children?: FileTree[]
}

export function createFileTreeForRegistryItemFiles(
  files: Array<{ path: string; target?: string }>
) {
  const root: FileTree[] = []

  for (const file of files) {
    const filePath = file.target ?? file.path
    const parts = filePath.split("/")
    let currentLevel = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isFile = i === parts.length - 1
      const existingNode = currentLevel.find((node) => node.name === part)

      if (existingNode) {
        if (isFile) {
          existingNode.path = filePath
        } else {
          currentLevel = existingNode.children!
        }
      } else {
        const newNode: FileTree = isFile
          ? { name: part, path: filePath }
          : { name: part, children: [] }

        currentLevel.push(newNode)

        if (!isFile) {
          currentLevel = newNode.children!
        }
      }
    }
  }

  return root
}
