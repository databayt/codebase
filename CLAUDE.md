# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Philosophy

**This codebase is heavily inspired by and deeply appreciates shadcn/ui.**

We monitor shadcn/ui updates and align our patterns accordingly. The ecosystem—registry system, directory structure, component architecture—follows shadcn conventions. However, we have our own enterprise-level architecture that extends beyond a simple component library.

### shadcn/ui Relationship

| What We Do | shadcn/ui Equivalent | Notes |
|------------|---------------------|-------|
| **UI** | shadcn/ui primitives | Radix-based, copied directly |
| **Atoms** | shadcn UI components | 2+ primitives combined, same pattern |
| **Templates** | **shadcn Blocks** | Full-page layouts, sections |
| **Blocks** | *Beyond shadcn* | UI with logic (tables, forms, data-driven) |
| **Micro** | *Beyond shadcn* | Mini micro-services |
| **Apps** | *Beyond shadcn* | Complete applications |

**Key distinction**: Our "Templates" = shadcn "Blocks". Our "Blocks" are something else entirely—reusable UI with embedded business logic.

### Legacy shadcn Patterns

We preserve some older shadcn/ui patterns that we love, even as shadcn has updated their homepage:
- **PageHeader** component - Our hero/heading pattern
- **PageActions** - Action button layouts
- A few other UI atoms from earlier shadcn versions

These are intentionally kept as they work well for our use cases.

### Four Pillars

1. **Follow shadcn patterns** - Always check [ui.shadcn.com](https://ui.shadcn.com) for reference
2. **Component hierarchy** - Understand UI → Atoms → Templates → Blocks → Micro progression
3. **Registry system** - Use shadcn-style registry for component distribution
4. **Mirror-pattern** - Every URL route maps 1:1 to `app/` and `components/` directories

## Atoms ↔ shadcn Components Mirror

Our `/atoms` (`cb.databayt.org/en/atoms`) is a **1:1 architectural clone** of shadcn's `/docs/components` (`ui.shadcn.com/docs/components`). Same DX, same delivery mechanism, renamed for our composition tier.

### What mirrors what

| Concern | shadcn | Ours | File / Path |
|---------|--------|------|-------------|
| Intro copy | "This is not a component library..." | Verbatim opening | `content/atoms/(root)/index.mdx:6` |
| Principles | 4 (Open Code, Composition, Distribution, Beautiful Defaults) | Same 4 + **AI-Ready** | `content/atoms/(root)/index.mdx:14-18` |
| Registry schema | `type: "registry:ui"` | `type: "registry:atom"` (only rename) | `src/registry/default/atoms/_registry.ts` |
| Style namespaces | `default`, `new-york` | Same two carried | `src/registry/default/`, `src/registry/new-york/` |
| Per-page MDX anatomy | Frontmatter → `<ComponentPreview>` → `## Installation` (CLI/Manual `<CodeTabs>`) → `## Usage` → `## Examples` | Identical | `content/atoms/(root)/oauth-button.mdx` (canonical example) |
| MDX components | `<ComponentPreview>`, `<ComponentSource>`, `<CodeTabs>`, `<Steps>`, `<Step>` | Same primitives | `src/mdx-components.tsx` |
| Route shape | `/docs/[[...slug]]` catch-all | `/atoms/[[...slug]]` catch-all | `src/app/[lang]/(root)/atoms/[[...slug]]/page.tsx` |
| Source loader | shadcn docs source | `atomsSource` (fumadocs) | `src/lib/source.ts` |
| Prev/next nav | `findNeighbour` from page tree | Same util | `src/app/[lang]/(root)/atoms/[[...slug]]/page.tsx:66` |
| ToC right-rail | `<DocsTableOfContents>` | Same | `src/components/docs/toc.tsx` |
| CLI install | `npx shadcn add <slug>` | `npx codebase add <slug>` | `package.json:18` (`"codebase": "tsx scripts/cli.mts"`) |
| Registry build | `build:registry` script | Same script name | `scripts/build-registry.mts` |
| Upstream sync | n/a | `pnpm sync:shadcn` | `scripts/sync-shadcn.mts` |
| JSON distribution | `r/` directory | `public/r/` | published JSON files for CLI |
| Sidebar primitives | shadcn sidebar | Same imports | `src/components/docs/atoms-sidebar.tsx:8-16` |
| Sidebar group headings | Rendered | **Still in comments** (not rendered) | `src/components/docs/atoms-sidebar.tsx:19-58` |
| `registryDependencies` | shadcn primitive slugs | Same slugs (`button`, `card`, `chart`, …) | resolves to shadcn primitives |
| `shadcn` package | n/a | Listed as devDependency | `package.json:146` (`"shadcn": "^4.5.0"`) |

### Intentional divergences

1. `registry:ui` → `registry:atom` (atoms are *compositions* of primitives, not primitives themselves)
2. Added **AI-Ready** as the 5th principle, with 7 AI-specific atoms (Reasoning, Response, Streaming Text, Status Indicator, Prompt Input, Response Display, Agent Heading)
3. Sidebar group headings exist as code comments but aren't rendered (pending wire-up)

### Watching shadcn upstream

**Watch shadcn closely** — not for new components, but for changes to **how they compose, preview, and register components**. The meta-architecture is what we mirror; pattern shifts ripple straight into our system.

When the user mentions atoms, registry, preview, or shadcn updates:
- Check shadcn-ui/ui recent commits (especially `apps/www/registry/`, `apps/www/components/mdx/`, `apps/www/registry/registry-*.ts`)
- Compare against `src/registry/`, `src/mdx-components.tsx`, `scripts/build-registry.mts`
- Run `pnpm sync:shadcn` if upstream patterns changed
- New shadcn components are low-priority; shadcn pattern changes are high-priority

### Inventory drift to be aware of

Atoms exist in 5 sources that don't fully agree (snapshot today):

| Source | Path | Count |
|---|---|---|
| Lazy runtime index | `src/registry/atoms-index.ts` | 56 |
| Authoritative registry | `src/registry/default/atoms/_registry.ts` | 51 |
| MDX docs | `content/atoms/(root)/*.mdx` | 51 |
| Sidebar links | `src/components/docs/atoms-sidebar.tsx` | 50 |
| Page tree | `content/atoms/(root)/meta.json` | 43 |

Categories also drift: 18 used in `_registry.ts`, only 12 declared in `registry-categories.ts`.

## Templates ↔ shadcn Blocks Mirror (Partial)

Our `/templates` (`cb.databayt.org/en/templates`) **partially mirrors** shadcn's `/blocks` (`ui.shadcn.com/blocks`). The registry schema and live-preview viewer are faithfully cloned; the per-template docs/install layer that atoms inherited from `/docs/components` has not been built for templates yet.

### What IS cloned

| Concern | shadcn | Ours | File / Path |
|---------|--------|------|-------------|
| Registry type | `type: "registry:block"` | `type: "registry:template"` (same shape, renamed) | `src/components/root/template/registry.ts:3-20` |
| `meta` block | `iframeHeight`, `container`, `mobile` | Same fields | e.g. sidebar-01 in `src/__registry__/index.tsx:54-83` |
| Multi-file with `target` paths | Files written into consumer's `app/`, `components/`, `config/` | Same — e.g. `target: "app/sidebar/page.tsx"` | `src/__registry__/index.tsx` |
| Per-style namespacing (source) | `default` + `new-york` | Both folders exist | `src/registry/default/templates/` (30), `src/registry/new-york/templates/` (34) |
| Live iframe preview | `<BlockViewer>` with toolbar/file-tree | `<TemplateViewer>` | `src/components/root/template/template-viewer.tsx` |
| Iframe target route | `/view/<style>/<slug>` | `/view/templates/[name]` | `src/app/[lang]/(view)/view/templates/[name]/page.tsx` |
| Category filter route | Yes | `[...categories]/page.tsx` | `src/app/[lang]/(root)/templates/[...categories]/page.tsx` |
| CLI install | `npx shadcn add <slug>` | `npx codebase add <slug>` resolvable for `registry:template` | published JSON (see below) |
| Distribution JSON | `r/templates/<style>/<slug>.json` | `public/r/templates/default/*.json` (9 published) | distribution dir |
| `registryDependencies` | shadcn primitive slugs | Same slugs | per-template registry entry |

### What IS NOT cloned (gap vs atoms ↔ /docs/components parity)

| Concern | Atoms (clean 1:1) | Templates (gap) |
|---|---|---|
| Per-item MDX docs page | 110 files in `content/atoms/(root)/*.mdx` | **0 files** — `content/templates/` does not exist |
| Per-item docs route | `[[...slug]]/page.tsx` (fumadocs MDX) | **None** — no `[[...slug]]/page.tsx` for templates |
| Index landing | Prose intro (could be card grid) | Hard-coded `FEATURED_TEMPLATES` list of 5 in `src/app/[lang]/(root)/templates/page.tsx:15-21` |
| Sidebar nav | Vertical Sidebar (`atoms-sidebar.tsx`, 104 entries) | **Horizontal pill bar** (`src/components/root/template/templates-nav.tsx`, categories only) |
| Installation tabs (CLI/Manual) | Yes per atom | None |
| `<ComponentPreview>` MDX integration | Yes per atom | None |
| Style published | Both `default` + `new-york` (81 JSONs each via `public/r/styles/`) | **Only `default`** — `STYLES = [{name:"default"}]` hardcoded in `scripts/build-template-registry.ts:13-16` |

### Internal drift (mid-flight state)

Two parallel pipelines coexist for templates:

| Pipeline | Registry source | Build script | Output |
|---|---|---|---|
| Older / smaller | `src/components/root/template/registry-templates.ts` (8 items) | `scripts/build-template-registry.ts` | `__registry__/index.tsx` (5 items, subscriptions skipped), `__registry__/templates.json`, `public/r/templates/default/*.json` (9 JSONs) |
| Newer / larger | `src/registry/registry-templates.ts` (33 items) | `scripts/build-registry.mts` (atoms + templates) | `src/__registry__/index.tsx` (48 templates, in-memory only — not published as standalone JSON) |

`pnpm build:templates` runs the older script. `pnpm build:registry` runs the newer one. The published surface (`public/r/templates/default/*.json`) is the older pipeline's output (9 templates), not the newer registry's 48 entries.

Source-folder counts also disagree:

| Source | Path | Template count |
|---|---|---|
| Live components | `src/components/template/` | 6 |
| Default registry | `src/registry/default/templates/` | 30 |
| New-york registry | `src/registry/new-york/templates/` | 34 |
| Generated registry (older) | `__registry__/default/template/` | 5 |
| Generated registry (newer) | `src/__registry__/index.tsx` | 48 (in-memory) |
| Published JSON | `public/r/templates/default/*.json` | 9 |

### Gaps to close to reach atoms-level parity

If we want templates to mirror `/blocks` as cleanly as atoms mirror `/docs/components`:

1. **Create `content/templates/(root)/`** with one `.mdx` per template (frontmatter, `<ComponentPreview>`, Installation tabs, Usage). Mirror the `content/atoms/(root)/` structure exactly.
2. **Add `src/app/[lang]/(root)/templates/[[...slug]]/page.tsx`** — a fumadocs MDX renderer parallel to `src/app/[lang]/(root)/atoms/[[...slug]]/page.tsx`.
3. **Add `templatesSource`** to `src/lib/source.ts` (parallel to `atomsSource`).
4. **Build `src/components/docs/templates-sidebar.tsx`** — vertical Sidebar listing all templates by category, parallel to `atoms-sidebar.tsx`.
5. **Reconcile the two registry sources** — pick one (recommend `src/registry/registry-templates.ts`, 33 items, the newer/larger one) and delete the older 8-item parallel.
6. **Reconcile the two build scripts** — fold `build-template-registry.ts` into `build-registry.mts` so a single `pnpm build:registry` produces both atoms and templates JSON.
7. **Publish both styles** — change `STYLES = [{name:"default"}]` to include `"new-york"` so `public/r/templates/new-york/*.json` exists.
8. **Card-grid index landing** — replace the hard-coded `FEATURED_TEMPLATES` list with a generated grid over the full registry (mirrors shadcn's `/blocks` UX).

### Watching shadcn upstream (extends prior atoms directive)

The shadcn `/blocks` page UX iterates fast (block viewer, file-tree, code-tabs, "Open in v0" integration). When watching shadcn upstream, also check:

- `apps/www/registry/registry-blocks.ts` for new block-shape conventions
- `apps/www/components/block-viewer.tsx` for viewer pattern changes
- `apps/www/registry/blocks/<slug>/` for the canonical multi-file layout

Pattern changes here ripple into our templates registry the same way component pattern changes ripple into atoms.

## Tech Stack

- **Framework**: Next.js 16.1.1 with App Router (Turbopack default)
- **Runtime**: React 19.2.3, Node.js runtime only (Edge deprecated in Next.js 16)
- **Database**: PostgreSQL with Prisma ORM 6.19.0 (library engine)
- **Authentication**: NextAuth v5 (beta) with Prisma adapter
- **Styling**: Tailwind CSS v4 with OKLCH color tokens
- **UI Components**: Radix UI primitives + shadcn/ui
- **Internationalization**: Custom i18n (English, Arabic RTL)
- **Documentation**: Fumadocs MDX
- **AI Integration**: Vercel AI SDK (Anthropic, Groq, OpenAI)

## Commands

```bash
pnpm dev              # Development server (Turbopack default)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm build:registry   # Build component registry
pnpm generate:docs    # Generate atom documentation
pnpm sync:shadcn      # Sync shadcn/ui components
```

### Prisma

```bash
pnpm prisma generate  # Generate client (runs on postinstall)
pnpm prisma db push   # Push schema changes (development)
pnpm prisma studio    # Database GUI
```

## Architecture

### Component Hierarchy

```
Foundation: Radix UI → shadcn/ui → shadcn Ecosystem
Building:   UI → Atoms → Templates → Blocks → Micro → Apps
```

- **UI** (`src/components/ui/`) - shadcn/ui primitives, 54+ components
- **Atoms** (`src/components/atom/`) - 2+ UI primitives combined, 62+ components
- **Templates** (`src/components/template/`) - Full-page layouts (= shadcn blocks)
- **Blocks** - UI with logic: reusable tables, forms, data-driven components
- **Micro** - Mini micro-services and micro-frontends

### Mirror-Pattern

Every URL route produces **two directories**:
- `app/[lang]/abc/` — `page.tsx`, `layout.tsx`
- `components/abc/` — `content.tsx`, `actions.ts`, `form.tsx`, `validation.ts`, `types.ts`

### Registry System

Follows shadcn registry pattern:
- `__registry__/` - Generated component index
- `src/registry/` - Source definitions by style (default, new-york)
- `public/r/` - Published JSON files for CLI consumption
- `scripts/build-registry.mts` - Registry build script

### Proxy (Next.js 16)

**Next.js 16 renamed middleware.ts to proxy.ts**. Located at `src/proxy.ts`:
- Authentication checks (cookie-based session verification)
- i18n locale detection and redirection
- Protected route enforcement
- Node.js runtime only (Edge not supported)

## Key Patterns

### Async Request APIs (Next.js 16)

All dynamic APIs must be awaited:

```tsx
export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
}
```

### Prisma in Client Components

Never import `@prisma/client` in client components (breaks Turbopack):

```tsx
// ❌ Bad
import { UserRole } from "@prisma/client";

// ✅ Good - local mirror
const UserRole = { ADMIN: "ADMIN", USER: "USER" } as const;
```

### Authentication

```tsx
// Server Component
import { currentUser } from "@/lib/auth";
const user = await currentUser();

// Client Component
import { useCurrentUser } from "@/components/auth/use-current-user";
const user = useCurrentUser();
```

## Configuration Files

| File | Purpose |
|------|---------|
| `src/proxy.ts` | Auth & i18n routing |
| `src/routes.ts` | Route protection rules |
| `src/auth.ts` | NextAuth configuration |
| `next.config.ts` | Next.js + MDX config |
| `prisma.config.ts` | Prisma directory config |

## Environment Variables

Required:
```env
DATABASE_URL=          # PostgreSQL (Neon)
AUTH_SECRET=           # openssl rand -hex 32
NEXTAUTH_URL=          # Production URL
```

OAuth (optional):
```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
```

## Vibe Coding

This codebase supports **Vibe Coding**—AI-powered development where you describe what you want in natural language and AI handles implementation details. See `/docs/vibe-coding` for prompting techniques and best practices.

## Known Issues

1. TypeScript errors ignored via `ignoreBuildErrors: true` in next.config
2. Prisma requires Node.js runtime (add `export const runtime = "nodejs"`)
3. `next-auth` peer dependency warning (expects Next.js 14/15, works with 16)

## Deployment

Production: https://cb.databayt.org (Vercel)

Always push changes to remote after committing.
