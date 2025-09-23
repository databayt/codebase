"use server"

import { registryItemSchema } from "@/components/root/template/registry"
import { z } from "zod"

import { Style } from "@/components/root/template/registry-styles"

export async function getAllBlockIds(
  types: z.infer<typeof registryItemSchema>["type"][] = [
    "registry:component",
    "registry:internal",
  ],
  categories: string[] = [],
  style: Style["name"] = "new-york"
): Promise<string[]> {
  const { Index } = await import("@/__registry__")
  const index = z.record(z.string(), registryItemSchema).parse(Index[style])

  return Object.values(index)
    .filter(
      (block) =>
        types.includes(block.type) &&
        (categories.length === 0 ||
          block.categories?.some((category) =>
            categories.includes(category)
          )) &&
        !block.name.startsWith("chart-")
    )
    .map((block) => block.name)
}
