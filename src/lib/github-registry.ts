"use server"

import { unstable_cache } from "next/cache"

export interface RemoteSource {
  name: string
  owner: string
  repo: string
  branch: string
  basePath: string
  enabled: boolean
  categories?: string[]
}

export interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
  download_url: string | null
  type: "file" | "dir"
}

export interface DiscoveredTemplate {
  name: string
  description?: string
  files: string[]
  categories: string[]
  source: RemoteSource
}

export interface RemoteTemplateFile {
  path: string
  content: string
  type: "registry:page" | "registry:component" | "registry:file"
}

export interface RemoteTemplate {
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

export async function fetchGitHubDirectory(
  owner: string,
  repo: string,
  path: string,
  branch: string = "main"
): Promise<GitHubFile[]> {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`

  try {
    const response = await fetch(url, {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return []
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      return []
    }

    return data.map((item: any) => ({
      name: item.name,
      path: item.path,
      sha: item.sha,
      size: item.size,
      download_url: item.download_url,
      type: item.type === "dir" ? "dir" : "file",
    }))
  } catch (error) {
    console.error(`Error fetching GitHub directory ${path}:`, error)
    return []
  }
}

export async function fetchGitHubFile(
  owner: string,
  repo: string,
  path: string,
  branch: string = "main"
): Promise<string | null> {
  const url = `${GITHUB_RAW_BASE}/${owner}/${repo}/${branch}/${path}`

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`GitHub raw fetch error: ${response.status}`)
    }

    return await response.text()
  } catch (error) {
    console.error(`Error fetching GitHub file ${path}:`, error)
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

export async function discoverTemplatesFromGitHub(
  source: RemoteSource
): Promise<DiscoveredTemplate[]> {
  const { owner, repo, branch, basePath } = source
  const templates: DiscoveredTemplate[] = []

  const contents = await fetchGitHubDirectory(owner, repo, basePath, branch)

  for (const item of contents) {
    if (item.type === "dir") {
      const templateName = item.name
      const categories = inferCategory(templateName)

      if (source.categories && source.categories.length > 0) {
        const hasMatchingCategory = categories.some((cat) =>
          source.categories!.includes(cat)
        )
        if (!hasMatchingCategory) continue
      }

      const templateContents = await fetchGitHubDirectory(
        owner,
        repo,
        `${basePath}/${templateName}`,
        branch
      )

      const files = templateContents
        .filter((f) => f.type === "file")
        .map((f) => f.path)

      if (files.length > 0) {
        templates.push({
          name: templateName,
          files,
          categories,
          source,
        })
      }
    } else if (item.type === "file" && item.name.endsWith(".tsx")) {
      const templateName = item.name.replace(".tsx", "")
      const categories = inferCategory(templateName)

      if (source.categories && source.categories.length > 0) {
        const hasMatchingCategory = categories.some((cat) =>
          source.categories!.includes(cat)
        )
        if (!hasMatchingCategory) continue
      }

      templates.push({
        name: templateName,
        files: [item.path],
        categories,
        source,
      })
    }
  }

  return templates
}

export async function fetchTemplateFromGitHub(
  source: RemoteSource,
  templateName: string
): Promise<RemoteTemplate | null> {
  const { owner, repo, branch, basePath } = source
  const templatePath = `${basePath}/${templateName}`

  const contents = await fetchGitHubDirectory(owner, repo, templatePath, branch)

  if (contents.length === 0) {
    const singleFilePath = `${basePath}/${templateName}.tsx`
    const content = await fetchGitHubFile(owner, repo, singleFilePath, branch)

    if (!content) return null

    const categories = inferCategory(templateName)

    return {
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

        if (isPage) {
          mainContent = content
        }
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

function extractRegistryDependencies(content: string): string[] {
  const deps: Set<string> = new Set()

  const uiImportRegex = /from\s+["']@\/components\/ui\/([^"']+)["']/g
  let match

  while ((match = uiImportRegex.exec(content)) !== null) {
    deps.add(match[1])
  }

  return Array.from(deps)
}

export const getCachedRemoteTemplates = unstable_cache(
  async (sourceName: string) => {
    const { remoteSources } = await import("@/registry/remote-sources")
    const source = remoteSources.find((s) => s.name === sourceName)
    if (!source || !source.enabled) return []

    return discoverTemplatesFromGitHub(source)
  },
  ["remote-templates"],
  { revalidate: 3600, tags: ["templates", "remote-templates"] }
)

export const getCachedRemoteTemplate = unstable_cache(
  async (sourceName: string, templateName: string) => {
    const { remoteSources } = await import("@/registry/remote-sources")
    const source = remoteSources.find((s) => s.name === sourceName)
    if (!source || !source.enabled) return null

    return fetchTemplateFromGitHub(source, templateName)
  },
  ["remote-template"],
  { revalidate: 3600, tags: ["templates", "remote-template"] }
)
