export interface RegistryFile {
  path: string
  type: "registry:page" | "registry:component" | "registry:file"
  target?: string
}

export interface RegistryItemSource {
  type: "local" | "github"
  owner?: string
  repo?: string
  branch?: string
  basePath?: string
  lastFetched?: string
}

export interface RegistryItem {
  name: string
  description: string
  type: "registry:template" | "registry:block" | "registry:component"
  dependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
  categories?: string[]
  meta?: {
    iframeHeight?: string
    containerClassName?: string
  }
  source?: RegistryItemSource
}

export type Registry = RegistryItem[]

export interface RegistryItemSchema {
  $schema: string
  name: string
  description?: string
  type: "registry:template" | "registry:block" | "registry:component"
  dependencies?: string[]
  registryDependencies?: string[]
  files: Array<{
    path: string
    content: string
    type: "registry:page" | "registry:component" | "registry:file"
    target?: string
  }>
  categories?: string[]
  meta?: Record<string, any>
}