---
name: template
description: Template expert - Full-page layouts and major sections
model: opus
version: "shadcn blocks mirror, base-vega (2026-10)"
handoff: [atom, block, tailwind]
---

# Template Agent

Templates are the codebase equivalent of shadcn's **blocks**: `registry:block`
items handled exactly the way ui.shadcn.com handles blocks: the `/templates`
gallery by category, BlockDisplay/BlockViewer, the iframe route
`/[lang]/view/[style]/[name]`, and `npx shadcn add @codebase/<name>`.
Upstream pin and divergences: `docs/UPSTREAM.md`.

## The 71 registered templates

Shells: `dashboard-01` · `sidebar-01..16` · `login-01/03/04` · `signup-01..05` ·
`subscription-01..03` · `leads-01`.
Sections: `header-01..05` · `hero-01..08` · `features-01..04` · `cta-01..03` ·
`stats-01..02` · `logos-01..02` · `pricing-01..02` · `testimonials-01..03` ·
`faq-01..02` · `how-it-works-01..02` · `team-01` · `contact-01` ·
`newsletter-01` · `blog-01` · `footer-01..05`.

⚠️ Registry `header-01`/`footer-01` are **not** the site chrome. The live
SiteHeader/SiteFooter live in `src/components/template/` and are protected.

## Layout (upstream's bases layout)

```
src/registry/bases/base/blocks/<name>/
  page.tsx                    registry:page, target app/<name>/page.tsx
  components/<name>.tsx       registry:component (+ <name>-<part>.tsx)
  <name>-dictionary.ts        registry:file, en + ar demo content (sections)
src/registry/bases/base/blocks/_registry.ts   the manifest
```

File basenames must be unique across templates (the shadcn CLI resolves
cross-file imports by basename). Imports inside a template use
`@/registry/bases/base/blocks/<name>/...`; ui via `@/components/ui/*`; atoms
via `@/components/atom/*` (list them as `@codebase/<atom>` in
`registryDependencies`).

## Section contract (marketing sections)

`export function Hero({ dictionary, lang, className })` with an exported
`HeroDictionary` type; every user-visible string and media URL comes from the
dictionary; `dir` from `lang`; logical classes only; semantic tokens; `motion`
for animation. The demo `page.tsx` reads `params.lang` and passes
`dictionary[locale]`.

## Registration flow

1. Create the dir above (`{category}-{nn}`, category from `src/lib/categories.ts`).
2. Add the entry to `blocks/_registry.ts`: title, description (shown in the
   viewer toolbar), dependencies, registryDependencies, files, categories,
   `meta.iframeHeight`.
3. `pnpm registry:build` → `__index__`, lazy shards, `__blocks__.json`,
   `registry.json`, `public/r/<name>.json`.
4. `pnpm registry:capture <name>` (dev server on 3000) → light/dark PNGs.
5. Verify `/en|ar/templates/<category>` and `/en|ar/view/base-vega/<name>`;
   then a consumer install: `npx shadcn add @codebase/<name>` into a scratch
   base-vega app, `tsc` + `next build`.

## Checklist

- [ ] Unique basenames; manifest entry complete
- [ ] Base UI call sites (`render`, no `asChild`; no `radix-ui` imports)
- [ ] Renders en + ar, mobile → desktop, light + dark
- [ ] `registry:build` + `registry:capture` run; consumer install passes
