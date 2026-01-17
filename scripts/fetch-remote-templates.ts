#!/usr/bin/env tsx
/**
 * Fetch Remote Templates Script
 *
 * This script fetches templates from configured remote GitHub sources
 * and saves them as JSON files for build-time consumption.
 *
 * Usage: pnpm build:remote-registry
 */

import { promises as fs } from "fs"
import path from "path"

interface RemoteSource {
  name: string
  owner: string
  repo: string
  branch: string
  basePath: string
  enabled: boolean
  categories?: string[]
}

interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
  download_url: string | null
  type: "file" | "dir"
}

interface RemoteTemplateFile {
  path: string
  content: string
  type: "registry:page" | "registry:component" | "registry:file"
}

interface RemoteTemplate {
  $schema: string
  name: string
  description: string
  type: "registry:template"
  files: RemoteTemplateFile[]
  categories: string[]
  dependencies: string[]
  registryDependencies: string[]
  meta: {
    iframeHeight?: string
    containerClassName?: string
  }
  source: {
    type: "github"
    owner: string
    repo: string
    branch: string
    basePath: string
    lastFetched: string
  }
}

const GITHUB_API_BASE = "https://api.github.com"
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com"
const OUTPUT_DIR = path.join(process.cwd(), "public/r/remote")

const remoteSources: RemoteSource[] = [
  {
    name: "databayt-shadcn",
    owner: "databayt",
    repo: "shadcn",
    branch: "main",
    basePath: "apps/v4/registry/new-york-v4/blocks",
    enabled: true,
    categories: ["sidebar", "login", "signup", "otp", "calendar", "dashboard"],
  },
  {
    name: "databayt-hogwarts",
    owner: "databayt",
    repo: "hogwarts",
    branch: "main",
    basePath: "src/components/template",
    enabled: true,
    categories: ["header", "hero", "footer"],
  },
]

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "codebase-registry",
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  return headers
}

async function fetchGitHubDirectory(
  owner: string,
  repo: string,
  dirPath: string,
  branch: string
): Promise<GitHubFile[]> {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${dirPath}?ref=${branch}`

  try {
    const response = await fetch(url, { headers: getHeaders() })

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`  Directory not found: ${dirPath}`)
        return []
      }
      if (response.status === 403) {
        console.error(`  Rate limit exceeded. Set GITHUB_TOKEN env var for higher limits.`)
        return []
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    if (!Array.isArray(data)) return []

    return data.map((item: any) => ({
      name: item.name,
      path: item.path,
      sha: item.sha,
      size: item.size,
      download_url: item.download_url,
      type: item.type === "dir" ? "dir" : "file",
    }))
  } catch (error) {
    console.error(`  Error fetching directory ${dirPath}:`, error)
    return []
  }
}

async function fetchGitHubFile(
  owner: string,
  repo: string,
  filePath: string,
  branch: string
): Promise<string | null> {
  const url = `${GITHUB_RAW_BASE}/${owner}/${repo}/${branch}/${filePath}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`GitHub raw fetch error: ${response.status}`)
    }
    return await response.text()
  } catch (error) {
    console.error(`  Error fetching file ${filePath}:`, error)
    return null
  }
}

function inferCategory(name: string): string[] {
  const categories: string[] = []

  if (name.startsWith("header-")) categories.push("header")
  else if (name.startsWith("hero-")) categories.push("hero")
  else if (name.startsWith("footer-")) categories.push("footer")
  else if (name.startsWith("sidebar-")) categories.push("sidebar")
  else if (name.startsWith("login-")) categories.push("login", "authentication")
  else if (name.startsWith("signup-")) categories.push("signup", "authentication")
  else if (name.startsWith("otp-")) categories.push("otp", "authentication")
  else if (name.startsWith("calendar-")) categories.push("calendar")
  else if (name.startsWith("dashboard-")) categories.push("dashboard")
  else if (name.startsWith("subscription-")) categories.push("subscription")

  return categories
}

function inferIframeHeight(categories: string[]): string {
  if (categories.includes("header")) return "100px"
  if (categories.includes("footer")) return "200px"
  if (categories.includes("hero")) return "600px"
  if (categories.includes("sidebar")) return "900px"
  if (categories.includes("dashboard")) return "900px"
  if (categories.includes("login")) return "600px"
  if (categories.includes("signup")) return "700px"
  if (categories.includes("otp")) return "500px"
  if (categories.includes("calendar")) return "400px"
  return "600px"
}

function extractRegistryDependencies(content: string): string[] {
  const deps: Set<string> = new Set()
  const uiImportRegex = /from\s+["']@\/components\/ui\/([^"']+)["']/g
  let match

  while ((match = uiImportRegex.exec(content)) !== null) {
    deps.add(match[1])
  }

  return Array.from(deps)
}

async function fetchTemplate(
  source: RemoteSource,
  templateName: string
): Promise<RemoteTemplate | null> {
  const { owner, repo, branch, basePath } = source
  const templatePath = `${basePath}/${templateName}`

  console.log(`  Fetching: ${templateName}`)

  const contents = await fetchGitHubDirectory(owner, repo, templatePath, branch)

  if (contents.length === 0) {
    const singleFilePath = `${basePath}/${templateName}.tsx`
    const content = await fetchGitHubFile(owner, repo, singleFilePath, branch)

    if (!content) return null

    const categories = inferCategory(templateName)

    return {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: templateName,
      description: `Template from ${source.name}`,
      type: "registry:template",
      files: [
        {
          path: `templates/${templateName}/page.tsx`,
          content,
          type: "registry:page",
        },
      ],
      categories,
      dependencies: [],
      registryDependencies: extractRegistryDependencies(content),
      meta: {
        iframeHeight: inferIframeHeight(categories),
      },
      source: {
        type: "github",
        owner,
        repo,
        branch,
        basePath,
        lastFetched: new Date().toISOString(),
      },
    }
  }

  const files: RemoteTemplateFile[] = []
  let mainContent = ""

  for (const file of contents) {
    if (file.type === "file" && (file.name.endsWith(".tsx") || file.name.endsWith(".ts"))) {
      const content = await fetchGitHubFile(owner, repo, file.path, branch)
      if (content) {
        const isPage = file.name === "page.tsx"
        const isComponent = file.path.includes("/components/")

        files.push({
          path: `templates/${templateName}/${file.name}`,
          content,
          type: isPage ? "registry:page" : isComponent ? "registry:component" : "registry:file",
        })

        if (isPage) mainContent = content
      }
    }
  }

  const componentsDir = contents.find((f) => f.type === "dir" && f.name === "components")
  if (componentsDir) {
    const componentFiles = await fetchGitHubDirectory(owner, repo, componentsDir.path, branch)

    for (const compFile of componentFiles) {
      if (compFile.type === "file" && (compFile.name.endsWith(".tsx") || compFile.name.endsWith(".ts"))) {
        const content = await fetchGitHubFile(owner, repo, compFile.path, branch)
        if (content) {
          files.push({
            path: `templates/${templateName}/components/${compFile.name}`,
            content,
            type: "registry:component",
          })
        }
      }
    }
  }

  if (files.length === 0) return null

  const categories = inferCategory(templateName)

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: templateName,
    description: `Template from ${source.name}`,
    type: "registry:template",
    files,
    categories,
    dependencies: [],
    registryDependencies: extractRegistryDependencies(mainContent || files[0]?.content || ""),
    meta: {
      iframeHeight: inferIframeHeight(categories),
    },
    source: {
      type: "github",
      owner,
      repo,
      branch,
      basePath,
      lastFetched: new Date().toISOString(),
    },
  }
}

async function discoverTemplates(source: RemoteSource): Promise<string[]> {
  const { owner, repo, branch, basePath } = source
  const templates: string[] = []

  console.log(`Discovering templates from ${source.name}...`)
  const contents = await fetchGitHubDirectory(owner, repo, basePath, branch)

  for (const item of contents) {
    if (item.type === "dir") {
      const categories = inferCategory(item.name)

      if (source.categories && source.categories.length > 0) {
        const hasMatchingCategory = categories.some((cat) =>
          source.categories!.includes(cat)
        )
        if (!hasMatchingCategory) continue
      }

      templates.push(item.name)
    } else if (item.type === "file" && item.name.endsWith(".tsx")) {
      const templateName = item.name.replace(".tsx", "")
      const categories = inferCategory(templateName)

      if (source.categories && source.categories.length > 0) {
        const hasMatchingCategory = categories.some((cat) =>
          source.categories!.includes(cat)
        )
        if (!hasMatchingCategory) continue
      }

      templates.push(templateName)
    }
  }

  console.log(`  Found ${templates.length} templates`)
  return templates
}

async function main() {
  console.log("=== Fetch Remote Templates ===\n")

  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  for (const source of remoteSources.filter((s) => s.enabled)) {
    console.log(`\nProcessing source: ${source.name}`)

    const sourceDir = path.join(OUTPUT_DIR, source.name)
    await fs.mkdir(sourceDir, { recursive: true })

    const templateNames = await discoverTemplates(source)

    let successCount = 0
    let failCount = 0

    for (const templateName of templateNames) {
      const template = await fetchTemplate(source, templateName)

      if (template) {
        const outputPath = path.join(sourceDir, `${templateName}.json`)
        await fs.writeFile(outputPath, JSON.stringify(template, null, 2))
        successCount++
      } else {
        failCount++
      }
    }

    console.log(`  Completed: ${successCount} success, ${failCount} failed`)
  }

  console.log("\n=== Done ===")
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
