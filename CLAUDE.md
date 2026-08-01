# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Philosophy

**This codebase is heavily inspired by and deeply appreciates shadcn/ui. Pattern fidelity to shadcn/ui is a core databayt value.**

We monitor shadcn/ui updates and align our patterns accordingly. The ecosystem—registry system, directory structure, component architecture—follows shadcn conventions and draws deliberately from [ui.shadcn.com](https://ui.shadcn.com) and its registry directory model ([ui.shadcn.com/docs/directory](https://ui.shadcn.com/docs/directory)): namespaced registries, `registry.json`/`registry-item.json` schemas, CLI/MCP installability. However, we have our own enterprise-level architecture that extends beyond a simple component library.

Before naming, structuring, or registering any component, check how shadcn/ui does it first. Deviations (blocks, micro, mirror-pattern, i18n/RTL) are deliberate enterprise extensions — never casual drift from a shadcn convention we follow.

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
3. **Registry system** - Use shadcn-style registry for component distribution, aligned with the [shadcn directory](https://ui.shadcn.com/docs/directory) model (namespaced, CLI/MCP-installable)
4. **Mirror-pattern** - Every URL route maps 1:1 to `app/` and `components/` directories

## Custom Parts — DO NOT DISTURB

These are deliberate divergences from shadcn/ui. Upstream syncs, refactors, and "cleanups" must never touch them. **Headline four: header, footer, page heading, homepage.**

| Custom part | Files | Rule |
|---|---|---|
| **Header** (site chrome) | `src/components/template/header-01/` — SiteHeader, main-nav (Docs/Atoms/Templates/Blocks/Micros/Arts), mobile-nav, LangSwitcher, mode-switcher, command-menu | Never overwrite. ⚠️ Name-collides with registry item `header-01` in `src/registry/*/templates/` — registry copies are syncable; site chrome is not |
| **Footer** (site chrome) | `src/components/template/footer-01/` — dictionary-driven credit line, embeds ReportIssueButton | Same collision warning |
| **Page heading** | `src/components/atom/page-header.tsx` + `page-actions.tsx` — legacy shadcn PageHeader/PageActions kept intentionally (22 import sites; both files export `PageActions` with different signatures — intentional, don't "fix") | Stays registered as atoms + MDX docs |
| **Homepage** | `src/app/[lang]/(root)/page.tsx`, `src/components/root/content.tsx`, `root/hero.tsx` (PageHeader + Announcement + TwoButtons, dictionary-driven) | `root/components/` demo grid is mirrored surface and may refresh; hero/content may not |

Also protected:

- **Custom files inside `ui/`**: `international-demo.tsx`, `custom-video-player.tsx`, `sortable.tsx`, `faceted.tsx` (not shadcn's — a sync must skip them); `chart.tsx` pinned to recharts 2
- **i18n/RTL layer**: `src/components/local/*`, `src/app/[lang]/layout.tsx` (dir= + font swap), `src/app/layout.tsx` (bare-children passthrough — intentional, not a bug), `src/proxy.ts`, `src/styles/rtl.css`, `src/lib/arabic-utils.ts`, `content/docs-ar/`, the `[dir="rtl"]` block in `globals.css`
- **Auth** (`src/auth*.ts`, `src/components/auth/`, `(auth)` routes) and **Prisma** (`prisma/models/*`, `src/lib/db.ts`)
- **Custom registry types** `registry:atom` / `registry:template` — intentional extensions of the shadcn schema
- **Original atoms**: two-buttons, announcement, fonts.ts (Rubik/Arabic), icons.tsx (hand-drawn brand SVGs), site-heading, modal-system + `modal/`, tabs.tsx (TabsNav), report-issue, share, the cards family
- **Sections with no shadcn equivalent**: vibe (11 subsections), arts + CDN pipeline (`src/lib/cdn.ts`, `scripts/cdn/`, manifests), blocks (invoice/report business logic), micros, community/leads/sales/scraper/upwork/tablecn modules, AI layer, `src/styles/*`, custom docs topics, `components.json` registries map, `src/hooks/use-toast.ts` (3 live consumers)

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

- **UI** (`src/components/ui/`) - shadcn/ui primitives at 61-item upstream parity, plus 4 custom extras (see Custom Parts)
- **Atoms** (`src/components/atom/`) - 2+ UI primitives combined; docs at `/atoms`, manifest in `src/registry/default/atoms/_registry.ts`, runtime index in `src/registry/atoms-index.ts`
- **Templates** (`src/registry/new-york/templates/` = source, `default/` = generated) - Full-page layouts (= shadcn blocks); viewer + docs at `/templates`
  - ⚠️ `src/components/template/` is **NOT** registry content — it is the live site chrome (SiteHeader, SiteFooter, LangSwitcher) and is protected
- **Blocks** - UI with logic: reusable tables, forms, data-driven components
- **Micro** - Mini micro-services and micro-frontends

### Mirror-Pattern

Every URL route produces **two directories**:
- `app/[lang]/abc/` — `page.tsx`, `layout.tsx`
- `components/abc/` — `content.tsx`, `actions.ts`, `form.tsx`, `validation.ts`, `types.ts`

### Registry System

Follows shadcn registry pattern:
- `src/__registry__/` - Generated component index (never edit by hand; `pnpm build:registry` regenerates)
- `src/registry/` - Source definitions by style (default, new-york)
- `public/r/` - Published JSON files for CLI consumption (`/r/styles/{style}/{name}.json` + `/r/templates/{style}/`)
- `scripts/build-registry.mts` - The single registry build script

### shadcn Mirror Map

| Our surface | Mirrors upstream | Sync rule |
|---|---|---|
| `src/components/ui/` | ui.shadcn.com primitives (**Radix lane** — upstream's Base-UI default applies to *new* projects only) | `pnpm sync:shadcn` reports drift; refresh via `shadcn add -o`; skip the 4 custom files + pinned `chart.tsx` |
| `src/components/atom/` + `content/atoms/(root)/` | ui.shadcn.com/docs/components (docs-block pattern: ComponentPreview → Installation CodeTabs → Usage) | New atom = create → `atoms-index.ts` → `_registry.ts` (if installable) → MDX + meta.json → `pnpm build:registry` |
| `src/registry/*/templates/` + `/templates` route | ui.shadcn.com/blocks (viewer, categories, iframe `/view/templates/[name]`) | `new-york` is the source style; `default` is generated by `build:registry`. Per-template MDX docs are our own enhancement (upstream /blocks has none) |
| Styles `default` / `new-york` | shadcn's pre-v4 style split | Kept for URL compatibility; atoms are style-invariant (aliased) |
| `registry:atom` / `registry:template` types | *(no upstream equivalent)* | Intentional schema extension — keep |

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
