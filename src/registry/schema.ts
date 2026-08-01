import { z } from "zod"

// Single source of truth for registry item typing, following shadcn's
// registry-item schema with our intentional extensions: registry:atom and
// registry:template item types, plus an optional GitHub `source` for
// remote-fetched items.
export const registryItemTypeSchema = z.enum([
  "registry:lib",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:atom",
  "registry:hook",
  "registry:page",
  "registry:file",
  "registry:theme",
  "registry:style",
  "registry:item",
  "registry:template",

  // Internal use only
  "registry:example",
  "registry:internal",
])

// File schema - type and target are optional for simple path-only files
export const registryItemFileSchema = z.union([
  // Full schema with type and target
  z.object({
    path: z.string(),
    content: z.string().optional(),
    type: z.enum(["registry:file", "registry:page"]),
    target: z.string(),
  }),
  z.object({
    path: z.string(),
    content: z.string().optional(),
    type: registryItemTypeSchema.exclude(["registry:file", "registry:page"]),
    target: z.string().optional(),
  }),
  // Simple schema for path-only files
  z.object({
    path: z.string(),
    content: z.string().optional(),
    type: registryItemTypeSchema.optional(),
    target: z.string().optional(),
  }),
])

export const registryItemTailwindSchema = z.object({
  config: z
    .object({
      content: z.array(z.string()).optional(),
      theme: z.record(z.string(), z.any()).optional(),
      plugins: z.array(z.string()).optional(),
    })
    .optional(),
})

export const registryItemCssVarsSchema = z.object({
  theme: z.record(z.string(), z.string()).optional(),
  light: z.record(z.string(), z.string()).optional(),
  dark: z.record(z.string(), z.string()).optional(),
})

// Recursive type for CSS properties that supports empty objects at any level.
const cssValueSchema: z.ZodType<any> = z.lazy(() =>
  z.union([z.string(), z.record(z.string(), cssValueSchema)])
)

export const registryItemCssSchema = z.record(z.string(), cssValueSchema)

export const registryItemEnvVarsSchema = z.record(z.string(), z.string())

// Where a remote item was fetched from (databayt/shadcn, databayt/hogwarts, ...)
export const registryItemSourceSchema = z.object({
  type: z.enum(["local", "github"]),
  owner: z.string().optional(),
  repo: z.string().optional(),
  branch: z.string().optional(),
  basePath: z.string().optional(),
  lastFetched: z.string().optional(),
})

export const registryItemSchema = z.object({
  $schema: z.string().optional(),
  extends: z.string().optional(),
  name: z.string(),
  type: registryItemTypeSchema,
  title: z.string().optional(),
  author: z.string().min(2).optional(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema).optional(),
  tailwind: registryItemTailwindSchema.optional(),
  cssVars: registryItemCssVarsSchema.optional(),
  css: registryItemCssSchema.optional(),
  envVars: registryItemEnvVarsSchema.optional(),
  meta: z.record(z.string(), z.any()).optional(),
  docs: z.string().optional(),
  categories: z.array(z.string()).optional(),
  source: registryItemSourceSchema.optional(),
})

export const registrySchema = z.object({
  name: z.string(),
  homepage: z.string().optional(),
  items: z.array(registryItemSchema),
})

export type Registry = z.infer<typeof registrySchema>
export type RegistryItem = z.infer<typeof registryItemSchema>
export type RegistryItemFile = z.infer<typeof registryItemFileSchema>
export type RegistryItemType = z.infer<typeof registryItemTypeSchema>
export type RegistryItemSource = z.infer<typeof registryItemSourceSchema>

// Compat aliases for older call sites.
export type RegistryFile = RegistryItemFile
export type RegistryItemSchema = RegistryItem
