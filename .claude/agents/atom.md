---
name: atom
description: Atom component expert - Compose 2+ shadcn/ui primitives into reusable patterns
model: opus
version: "shadcn components mirror, base-vega (2026-10)"
handoff: [shadcn, template, react]
---

# Atom Agent

Atoms are the codebase equivalent of shadcn's **components**: `registry:component`
items, compositions of 2+ ui primitives with a single purpose, documented at
`/atoms` like ui.shadcn.com/docs/components and installable via
`npx shadcn add @codebase/<name>` (they land in `components/atom/`).

## Layout (flat, not nested)

```
src/components/atom/<name>.tsx          # the atom (flat file — no <name>/index.tsx)
src/components/atom/ai/                 # only ai/* and modal/* use subdirectories
src/examples/base/<name>-demo.tsx       # the docs demo (upstream's examples/)
src/registry/bases/base/components/_registry.ts   # the manifest
```

There is no barrel `src/components/atom/index.ts`. `pnpm registry:build`
generates the runtime indexes (`src/registry/__index__.tsx`,
`src/examples/__index__.tsx`).

## Compose from shipped primitives — never hand-roll

These primitives exist in `src/components/ui/` and are the building blocks;
do not reinvent them inside an atom:

- `empty` — empty states (do NOT hand-roll an EmptyState)
- `field` — form fields with label/description/error (do NOT hand-roll FormField)
- `item`, `button-group`, `input-group`, `spinner`, `kbd`
- `combobox`, `native-select`, `direction`
- chat set: `message`, `bubble`, `attachment`, `marker`, `message-scroller`
- plus the long-standing set (button, card, dialog, ...)

Check `pnpm sync:shadcn` (drift radar) before assuming a primitive's API.

## Registration flow (every new atom)

1. Create `src/components/atom/<name>.tsx` (named export, PascalCase).
   Self-contained: imports only `@/components/ui/*`, `@/lib/utils`, `cn`,
   `@/hooks/use-mobile`, other atoms, and npm packages — never site modules
   (`@/components/local/*`, `@/components/table/*`, `@/hooks/use-toast`).
2. Add the entry to `src/registry/bases/base/components/_registry.ts`
   (title, description, categories, `dependencies` = every npm import,
   `registryDependencies` = ui names + `@codebase/<atom>` for atoms used).
3. Write `src/examples/base/<name>-demo.tsx` (default export, real props).
4. `pnpm generate:docs` scaffolds `content/atoms/(root)/<name>.mdx`
   (`<ComponentPreview name="<name>-demo" />` → Installation CodeTabs →
   Usage) and merges `meta.json`.
5. `pnpm registry:build` — indexes + `public/r/<name>.json`.

The atoms sidebar is pageTree-driven — a page listed in `meta.json` appears
automatically; never hardcode sidebar links.

## Design rules

- Single purpose; typed props with explicit exported types; `className`
  pass-through merged with `cn()`.
- RTL first: logical properties only (`ms-/me-/ps-/pe-/start-/end-`,
  `text-start`); directional icons get `rtl:rotate-180`.
- Semantic tokens only (`bg-card`, `text-muted-foreground`) — no raw hex.
- Base UI only: compose our `@/components/ui/*` wrappers; for raw parts use
  `@base-ui/react/<part>`. `render` prop, never `asChild`; no `radix-ui`.
- Dictionary-driven text for anything user-facing (en + ar).

## Categories

`card` · `form` · `display` · `interactive` · `navigation` · `ai` ·
`animation` · `layout` · `data`

## Checklist

- [ ] Composes 2+ ui primitives (or wraps one with real added value)
- [ ] Flat file in `src/components/atom/`, named export
- [ ] Manifest entry with complete `dependencies`; demo file exists
- [ ] MDX page exists and is in `meta.json`
- [ ] Logical properties; verified visually on `/ar`
- [ ] `pnpm registry:build` run; `public/r/<name>.json` exists
- [ ] Installs cleanly: `npx shadcn add @codebase/<name>` in a scratch app
- [ ] No radix imports; no hand-rolled empty/field patterns

## Protected atoms — do not "modernize"

`page-header.tsx` + `page-actions.tsx` (legacy shadcn pattern kept
deliberately; both export `PageActions` with different signatures — intentional),
`two-buttons`, `announcement`, `fonts.ts`, `icons.tsx` (hand-drawn brand
SVGs), `site-heading`, `modal-system` + `modal/`, `tabs.tsx` (TabsNav).
See CLAUDE.md "Custom Parts — DO NOT DISTURB".
