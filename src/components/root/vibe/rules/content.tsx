"use client"

import { PageHeader } from "@/components/atom/page-header"
import { CodeBlock } from "../shared/code-block"
import type { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

interface RulesContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  params: { lang: Locale }
}

const cursorRules = `# .cursorrules

You are an expert in TypeScript, Node.js, Next.js 15 App Router, React 19,
Shadcn UI, Radix UI, and Tailwind CSS 4.

## Code Style and Structure

- Write concise, technical TypeScript code with accurate examples
- Use functional and declarative programming patterns
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (isLoading, hasError)
- Structure files: exported component, subcomponents, helpers, types

## Naming Conventions

- Use lowercase with dashes for directories (components/auth-wizard)
- Favor named exports for components

## TypeScript Usage

- Use TypeScript for all code; prefer interfaces over types
- Avoid enums; use const objects with \`as const\` assertion
- Use functional components with TypeScript interfaces

## Syntax and Formatting

- Use the "function" keyword for pure functions
- Avoid unnecessary curly braces in conditionals
- Use declarative JSX

## UI and Styling

- Use Shadcn UI, Radix, and Tailwind for components and styling
- Implement responsive design with Tailwind CSS; mobile-first approach

## Performance Optimization

- Minimize "use client", "useEffect", and "setState"
- Favor React Server Components (RSC)
- Wrap client components in Suspense with fallback
- Use dynamic loading for non-critical components`

const claudeRules = `# CLAUDE.md Rules Section

## Anti-Patterns to Avoid

- NEVER import \`@prisma/client\` in client components
- NEVER use \`use client\` unless absolutely necessary
- NEVER create new files unless explicitly required
- NEVER add comments to code you didn't write
- NEVER use Edge runtime (deprecated in Next.js 16)

## Required Patterns

- ALWAYS await dynamic APIs: params, searchParams, cookies, headers
- ALWAYS use \`pnpm\` as package manager
- ALWAYS follow mirror-pattern for new routes
- ALWAYS use Server Components by default

## Component Rules

- UI components: src/components/ui/
- Atoms (2+ primitives): src/components/atom/
- Feature components: src/components/root/{feature}/
- Page content: content.tsx in component folder`

const clineRules = `# .clinerules

## Project Context
This is a Next.js 15+ monorepo using:
- React 19 with Server Components
- Prisma 6 for database
- NextAuth v5 for authentication
- Tailwind CSS 4 with OKLCH colors

## Key Constraints
1. Node.js runtime only (no Edge)
2. All dynamic APIs must be awaited
3. Prefer Server Actions over API routes
4. Use pnpm exclusively

## File Patterns
- Routes: app/[lang]/(root)/[feature]/page.tsx
- Components: components/root/[feature]/content.tsx
- Server actions: components/root/[feature]/actions.ts`

export default function RulesContent({ dictionary, params }: RulesContentProps) {
  return (
    <div className="px-responsive lg:px-0 py-12">
      <PageHeader
        heading="Rules"
        description="AI coding rules and patterns for quick wins. Define constraints, anti-patterns, and best practices."
      />

      <div className="mt-12 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">What are Rules?</h2>
          <p className="text-muted-foreground mb-6">
            Rules are explicit constraints and patterns that guide AI coding behavior. They prevent
            common mistakes and enforce project conventions.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Cursor</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">.cursorrules</code>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Claude Code</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">CLAUDE.md</code>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Cline</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">.clinerules</code>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Cursor Rules</h2>
          <p className="text-muted-foreground mb-4">
            Rules for Cursor IDE AI assistant.
          </p>
          <CodeBlock code={cursorRules} language="markdown" title=".cursorrules" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Claude Code Rules</h2>
          <p className="text-muted-foreground mb-4">
            Rules section in CLAUDE.md for Claude Code.
          </p>
          <CodeBlock code={claudeRules} language="markdown" title="CLAUDE.md" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Cline Rules</h2>
          <p className="text-muted-foreground mb-4">
            Rules for Cline VSCode extension.
          </p>
          <CodeBlock code={clineRules} language="markdown" title=".clinerules" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Rule Categories</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Anti-Patterns</h3>
              <p className="text-sm text-muted-foreground">
                What NOT to do. Explicit prohibitions prevent costly mistakes.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Required Patterns</h3>
              <p className="text-sm text-muted-foreground">
                What MUST be done. Enforce consistency across the codebase.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Style Guidelines</h3>
              <p className="text-sm text-muted-foreground">
                Naming, formatting, and code organization preferences.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Project Context</h3>
              <p className="text-sm text-muted-foreground">
                Stack details, constraints, and architectural decisions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
