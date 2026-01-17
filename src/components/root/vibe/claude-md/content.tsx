"use client"

import { PageHeader } from "@/components/atom/page-header"
import { CodeBlock } from "../shared/code-block"
import type { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

interface ClaudeMdContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  params: { lang: Locale }
}

const globalClaudeMd = `# Global Claude Code Instructions

## Preferences

- **Model**: Opus 4.5 (default)
- **Package Manager**: pnpm
- **Stack**: Next.js 15, React 19, Prisma 6, TypeScript 5, Tailwind CSS 4, shadcn/ui
- **Languages**: Arabic (RTL default), English (LTR)

---

## Keyword Triggers

When user mentions these keywords, reference the mapped tools:

### Workflow Keywords

| Keyword | Agents | Commands | MCPs |
|---------|--------|----------|------|
| \`push\` | git-github | /push | github |
| \`deploy\` | - | /deploy | vercel |
| \`build\` | build, nextjs | /build | - |

### Creation Keywords

| Keyword | Agents | Commands |
|---------|--------|----------|
| \`component\` | react, shadcn | /component |
| \`page\` | nextjs, architecture | /page |
| \`api\` | api, prisma | /api |

---

## Stack to Agent Mapping

| Technology | Primary Agent | Secondary Agent |
|------------|---------------|-----------------|
| **Next.js** | nextjs | architecture |
| **React** | react | react-reviewer |
| **TypeScript** | typescript | type-safety |
| **Prisma** | prisma | database-optimizer |
| **Tailwind** | tailwind | - |

---

## Behavior

When user mentions a keyword from the trigger tables:

1. **Reference the mapped agent(s)** before starting work
2. **Use relevant MCP tools** if available
3. **Apply skills** for validation/optimization
4. **Suggest relevant commands** when appropriate`

const projectClaudeMd = `# CLAUDE.md

Project-specific instructions for this repository.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Runtime**: React 19, Node.js runtime only
- **Database**: PostgreSQL with Prisma ORM 6
- **Authentication**: NextAuth v5 (beta)
- **Styling**: Tailwind CSS v4 with OKLCH

## Commands

\`\`\`bash
pnpm dev              # Development server
pnpm build            # Production build
pnpm lint             # ESLint
pnpm prisma generate  # Generate Prisma client
\`\`\`

## Architecture

### Mirror-Pattern

Every URL route produces **two directories**:
- \`app/[lang]/abc/\` — page.tsx, layout.tsx
- \`components/abc/\` — content.tsx, actions.ts, types.ts

### Component Hierarchy

\`\`\`
UI → Atoms → Templates → Blocks → Micro → Apps
\`\`\`

## Key Patterns

### Async Request APIs (Next.js 16)

\`\`\`tsx
export default async function Page(props: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params;
}
\`\`\`

### Authentication

\`\`\`tsx
// Server Component
import { currentUser } from "@/lib/auth";
const user = await currentUser();
\`\`\``

const settingsJson = `{
  "permissions": {
    "allow": [
      "Bash(pnpm add:*)",
      "Bash(mkdir:*)",
      "Bash(git:*)",
      "WebFetch(domain:ui.shadcn.com)",
      "WebFetch(domain:github.com)"
    ],
    "deny": [],
    "ask": []
  }
}`

export default function ClaudeMdContent({ dictionary, params }: ClaudeMdContentProps) {
  return (
    <div className="px-responsive lg:px-0 py-12">
      <PageHeader
        heading="CLAUDE.md"
        description="Global and project instructions. Define preferences, keyword triggers, and behavioral guidelines."
      />

      <div className="mt-12 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">What is CLAUDE.md?</h2>
          <p className="text-muted-foreground mb-6">
            CLAUDE.md files provide instructions that Claude Code reads at the start of every session.
            They define your preferences, patterns, and behaviors.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Global Instructions</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">~/.claude/CLAUDE.md</code>
              <p className="text-sm text-muted-foreground mt-2">Applied to all projects</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Project Instructions</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">./CLAUDE.md</code>
              <p className="text-sm text-muted-foreground mt-2">Project root, checked into git</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Global CLAUDE.md Template</h2>
          <p className="text-muted-foreground mb-4">
            Define your personal preferences and keyword triggers for all projects.
          </p>
          <CodeBlock code={globalClaudeMd} language="markdown" title="~/.claude/CLAUDE.md" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Project CLAUDE.md Template</h2>
          <p className="text-muted-foreground mb-4">
            Project-specific instructions that override or extend global settings.
          </p>
          <CodeBlock code={projectClaudeMd} language="markdown" title="./CLAUDE.md" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Settings & Permissions</h2>
          <p className="text-muted-foreground mb-4">
            Control what tools Claude Code can use without asking.
          </p>
          <CodeBlock code={settingsJson} language="json" title=".claude/settings.json" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Keep It Scannable</h3>
              <p className="text-sm text-muted-foreground">
                Use tables and bullet points. Claude reads this every session.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Be Specific</h3>
              <p className="text-sm text-muted-foreground">
                Include exact commands, paths, and patterns for your workflow.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Layer Configs</h3>
              <p className="text-sm text-muted-foreground">
                Global for personal prefs, project for team standards.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Version Control</h3>
              <p className="text-sm text-muted-foreground">
                Commit project CLAUDE.md so team shares the same context.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
