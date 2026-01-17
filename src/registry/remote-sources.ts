import type { RemoteSource } from "@/lib/github-registry"

export const remoteSources: RemoteSource[] = [
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
  {
    name: "shadcn-ui-official",
    owner: "shadcn-ui",
    repo: "ui",
    branch: "main",
    basePath: "apps/www/registry/new-york-v4/blocks",
    enabled: false,
  },
]

export function getEnabledSources(): RemoteSource[] {
  return remoteSources.filter((source) => source.enabled)
}

export function getSourceByName(name: string): RemoteSource | undefined {
  return remoteSources.find((source) => source.name === name)
}

export function getSourcesForCategory(category: string): RemoteSource[] {
  return remoteSources.filter(
    (source) =>
      source.enabled &&
      (!source.categories || source.categories.includes(category))
  )
}
