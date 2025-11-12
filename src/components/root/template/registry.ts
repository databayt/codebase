import { z } from "zod"

export const registryItemTypeSchema = z.enum([
  "registry:ui",
  "registry:template",
  "registry:hook",
  "registry:theme",
  "registry:lib",
  "registry:internal",
  "registry:component",
  "registry:example",
  "registry:page",
  "registry:file",
])

export const registryItemFileSchema = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: registryItemTypeSchema.optional(),
  target: z.string().optional(),
})

export const registryItemSchema = z.object({
  name: z.string(),
  type: registryItemTypeSchema,
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema.or(z.string())).optional(),
  tailwind: z
    .object({
      config: z.object({
        plugins: z.array(z.string()).optional(),
      }).optional(),
    })
    .optional(),
  cssVars: z.object({}).catchall(z.any()).optional(),
  meta: z
    .object({
      iframeHeight: z.string().optional(), // e.g., "800px", "1000px"
      container: z.string().optional(), // e.g., "bg-surface min-h-svh"
      mobile: z.enum(["component", "screenshot"]).optional(), // Mobile rendering strategy
    })
    .catchall(z.any())
    .optional(),
  docs: z.string().optional(),
  categories: z.array(z.string()).optional(),
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