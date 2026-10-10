import { registryItemSchema, type Registry } from "shadcn/schema"

import { blocks } from "./blocks/_registry"
import { components } from "./components/_registry"

// Mirrors shadcn's apps/v4/registry/bases/base/registry.ts. Primitives (ui,
// lib/utils, hooks) are not republished: items depend on them by bare name and
// the CLI resolves them from @shadcn. Our own items are referenced as
// "@codebase/<name>" in registryDependencies.
export const registry = {
  name: "codebase",
  homepage: "https://cb.databayt.org",
  // shadcn/schema is built on zod 3 while the app runs zod 4, so build the
  // array schema from the item schema itself rather than with our `z`.
  items: registryItemSchema.array().parse([...components, ...blocks]),
} satisfies Registry
