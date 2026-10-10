# Upstream — how codebase mirrors shadcn/ui

codebase is a shadcn registry. It follows `shadcn-ui/ui` (`apps/v4`) the way
upstream builds its own site, and diverges only where listed below.

| | |
|---|---|
| Upstream | `shadcn-ui/ui@c2a67849` (2026-10-10), `shadcn@4.21.4` |
| Local clone | `/Users/abdout/oss/shadcn-ui` (read-only reference) |
| Base / style | **Base UI** (`@base-ui/react`) / **base-vega** — vega is the base style closest to the old new-york look |
| Namespace | `@codebase` → `https://cb.databayt.org/r/{name}.json` |

## The mapping

| codebase | shadcn/ui | Where |
|---|---|---|
| UI | ui (`registry:ui`) | `src/components/ui/` — installed via the CLI, not republished |
| Atoms | components (`registry:component`) | sources `src/components/atom/`, manifest `src/registry/bases/base/components/_registry.ts`, demos `src/examples/base/<atom>-demo.tsx`, docs `content/atoms/` |
| Templates | blocks (`registry:block`) | `src/registry/bases/base/blocks/<name>/`, manifest `blocks/_registry.ts`, gallery `/templates` |

Pipeline (ports of upstream files, same names):

- `scripts/build-registry.mts` (`pnpm registry:build`): `src/registry/__index__.tsx`,
  `__components__/` lazy shards, `__blocks__.json`, `src/examples/__index__.tsx`,
  root `registry.json`, then `shadcn build` → `public/r/<name>.json`.
- `scripts/capture-registry.mts` (`pnpm registry:capture [names]`): light/dark PNGs
  in `public/r/styles/base-vega/` (dev server on 3000; 1x for the repo's media guard).
- `src/lib/registry.ts`, `src/lib/blocks.ts`, `src/lib/categories.ts`,
  `src/components/docs/block-display.tsx`, `block-viewer.tsx`, `component-preview.tsx`,
  `component-source.tsx`, `src/app/[lang]/(view)/view/[style]/[name]`.

## Deliberate divergences

1. **Site chrome is ours**: header (`src/components/template/header-01`), footer
   (`footer-01`), page heading (`atom/page-header.tsx`), page nav, homepage, the
   templates hero. Upstream's shell is not adopted; only its internals are.
2. **i18n**: routes live under `[lang]` (en/ar); the view route is
   `/[lang]/view/[style]/[name]` so templates render RTL on `/ar`.
3. **Atoms stay in `src/components/atom/`** and install to `components/atom/<name>.tsx`
   (the databayt hierarchy), via an explicit `target`.
4. **Section templates take `{ dictionary, lang }`** and ship an en/ar
   `<name>-dictionary.ts`. Every template file has a unique basename: the CLI
   resolves cross-file imports by basename, so a shared `dictionary.ts` would
   cross-wire templates installed together.
5. **One style**: we build `base-vega` only (upstream builds every base × style).
6. **Our own references**: `@codebase/<atom>` in `registryDependencies` for atoms
   a template uses; bare names resolve to `@shadcn` primitives.
7. **Kept ui extras**: `form.tsx` (react-hook-form, on `useRender`), `sonner.tsx`,
   `faceted.tsx`, `sortable.tsx`, `custom-video-player.tsx`, `international-demo.tsx`;
   `chart.tsx` pinned to recharts 2. The useRender wrappers carry `"use client"`.
8. **`sheet.tsx` RTL fix**: `side` is a physical edge (upstream's own RTL example picks
   `side={dir === "rtl" ? "left" : "right"}`), but the CLI's RTL pass flips the slide
   offset under `rtl:` and turns the border logical, so in Arabic a left sheet slid in
   from the right with its border on the screen edge. Ours keeps it physical (no `rtl:`
   flips, `border-r` / `border-l`). Re-check after every `shadcn add sheet -o`.

## Downstream note

Products (hogwarts, mkan, souq…) are still on Radix. `@codebase` items now ship
Base UI call sites (`render`, not `asChild`); installing one into a Radix app means
installing its Base UI primitives too. A `bases/radix/` lane can be added later in
the same layout if a Radix consumer needs it.

## Staying in sync

- `pnpm sync:shadcn` — drift radar for `ui/` against `base-vega` (HTTP).
- `npx shadcn add <component> --diff` — exact CLI drift for one primitive;
  `npx shadcn add <component> -y -o` to take it (never for the kept extras).
- Site internals: diff the ported files above against the clone
  (`git -C /Users/abdout/oss/shadcn-ui pull` first), then bump the SHA here.
- Radix→Base history and behavior notes: `.migration/`.
