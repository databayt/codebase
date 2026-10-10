"use server"

import { type RegistryItem } from "shadcn/schema"

import { registry } from "@/registry/bases/base/registry"

// Port of shadcn's apps/v4/lib/blocks.ts. Templates are registry:block items.
export async function getAllBlockIds(
  types: RegistryItem["type"][] = [
    "registry:block",
    "registry:internal",
  ],
  categories: string[] = []
): Promise<string[]> {
  const blocks = await getAllBlocks(types, categories)
  return blocks.map((block) => block.name)
}

export async function getAllBlocks(
  types: RegistryItem["type"][] = [
    "registry:block",
    "registry:internal",
  ],
  categories: string[] = []
) {
  return (registry.items as RegistryItem[]).filter(
    (block) =>
      types.includes(block.type) &&
      (categories.length === 0 ||
        block.categories?.some((category) => categories.includes(category)))
  )
}
