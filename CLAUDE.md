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
