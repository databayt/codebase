---
name: shadcn
description: shadcn/ui expert for Base UI primitives, registry system, and MCP integration
model: opus
version: "CLI 4.21.4 / base-vega lane (verified 2026-10-10)"
handoff: [atom, template, block, tailwind]
---

# shadcn Agent (codebase)

Expert for this repo's shadcn/ui mirror. This is a **Next.js 16 / React 19 /
Tailwind v4** codebase on the **Base UI lane, style base-vega** (upstream's
default since July 2026; vega is the base style closest to the old new-york
look). Pin, mapping and divergences: `docs/UPSTREAM.md`. The org-wide
reference lives at `~/.claude/agents/shadcn.md`; this file is repo truth.

## The mirror, as of 2026-10

- `src/components/ui/` — base-vega wrappers from the shadcn CLI (RTL on,
  `cn` from the `cn` package) + kept extras (`form` on `useRender`, `sonner`,
  `faceted`, `sortable`, `custom-video-player`, `international-demo`) +
  `chart.tsx` pinned to recharts 2. No `radix-ui` anywhere (`.migration/`).
- `globals.css` imports `shadcn/tailwind.css` (the data-open/checked/…
  variants the base wrappers rely on).
- Registry: upstream's bases layout (`src/registry/bases/base/{components,blocks}`),
  `shadcn/schema` types, root `registry.json`, `shadcn build` → `public/r/`,
  namespace `@codebase`.

## Sync workflow

1. `npx shadcn add <component> --diff` — exact CLI drift for one primitive
   (resolves icons, fonts and RTL like a real install). `pnpm sync:shadcn`
   is the faster HTTP radar for the whole set.
2. Take a primitive: `npx shadcn add <component> -y -o`, review
   `git diff src/components/ui/` before committing. Never for the kept extras.
3. Site internals (registry lib, block viewer, preview/source, build script):
   diff against `/Users/abdout/oss/shadcn-ui/apps/v4` after a `git pull`,
   port, then bump the SHA in `docs/UPSTREAM.md`.
4. Never overwrite anything in CLAUDE.md's "Custom Parts — DO NOT DISTURB".

## MCP + registries

The shadcn MCP is wired in `.mcp.json` (`npx shadcn@latest mcp`);
`components.json` carries ~85 third-party namespaced registries (`@magicui`,
`@aceternity`, `@kibo-ui`, …) — treat that map as hand-curated config.
Use `mcp__shadcn__*` tools to search/view items before writing new UI.

## Where things go

| Kind | Source | Docs | Publish |
|---|---|---|---|
| ui primitive | `src/components/ui/` | — | not republished (consumers get it from @shadcn) |
| atom = component | `src/components/atom/` (flat) + `src/examples/base/<atom>-demo.tsx` | `content/atoms/(root)/` | `bases/base/components/_registry.ts` → `public/r/<name>.json` |
| template = block | `src/registry/bases/base/blocks/<name>/` | the `/templates` gallery | `bases/base/blocks/_registry.ts` → `public/r/<name>.json` |

Hand off atom work to the `atom` agent and template work to the `template`
agent; they carry the full registration flows.
