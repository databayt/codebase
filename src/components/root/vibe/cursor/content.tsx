"use client"

import { PageHeader } from "@/components/atom/page-header"
import { CodeBlock } from "../shared/code-block"
import type { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

interface CursorContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  params: { lang: Locale }
}

const cursorSettings = `// .cursor/settings.json
{
  "ai.model": "claude-3-5-sonnet",
  "ai.provider": "anthropic",
  "ai.contextMode": "full",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "files.associations": {
    "*.cursorrules": "markdown"
  }
}`

const cursorrules = `# .cursorrules

You are an expert in TypeScript, Node.js, Next.js 15 App Router, React 19,
Shadcn UI, Radix UI, and Tailwind CSS 4.

## Key Principles

- Write concise, technical TypeScript code
- Use functional and declarative programming patterns
- Prefer iteration and modularization over duplication
- Use descriptive variable names with auxiliary verbs

## Project Structure

app/
├── [lang]/
│   └── (root)/
│       └── [feature]/
│           └── page.tsx
components/
├── ui/           # shadcn/ui primitives
├── atom/         # 2+ primitives combined
└── root/
    └── [feature]/
        ├── content.tsx
        ├── actions.ts
        └── types.ts

## TypeScript

- Use interfaces over types
- Avoid enums; use const objects with \`as const\`
- Export TypeScript interfaces for component props

## React Patterns

- Prefer Server Components
- Minimize "use client", "useEffect", "useState"
- Wrap client components in Suspense

## Styling

- Use Tailwind CSS; mobile-first responsive design
- Use OKLCH color tokens from design system
- Support RTL layout with Tailwind logical properties`

const cursorShortcuts = `# Useful Cursor Shortcuts

## AI Features
Cmd+K          # Open AI command bar
Cmd+L          # Open chat panel
Cmd+Shift+L    # New chat
Cmd+Enter      # Accept AI suggestion

## Code Navigation
Cmd+P          # Quick open file
Cmd+Shift+P    # Command palette
Cmd+G          # Go to line
Cmd+D          # Select next occurrence

## Editing
Cmd+Shift+K    # Delete line
Cmd+/          # Toggle comment
Option+Up/Down # Move line up/down

## Terminal
Ctrl+\`         # Toggle terminal
Cmd+Shift+C    # New terminal`

const composerExample = `# Using Cursor Composer

## Step 1: Select Files
Select the files you want to work with in the sidebar.

## Step 2: Describe Task
"Create a new atom component called StatCard that:
- Uses Card from shadcn/ui
- Displays a title, value, and optional icon
- Has hover effects
- Supports className override"

## Step 3: Review Changes
Cursor shows a diff of proposed changes.
Accept (Cmd+Enter) or reject individual hunks.

## Step 4: Apply
Click "Apply All" or accept changes file by file.

## Tips
- Be specific about file locations
- Reference existing patterns
- Break complex tasks into steps`

export default function CursorContent({ dictionary, params }: CursorContentProps) {
  return (
    <div className="px-responsive lg:px-0 py-12">
      <PageHeader
        heading="Cursor"
        description="AI pair programming with Cursor. The AI-first code editor built for vibe coding."
      />

      <div className="mt-12 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">What is Cursor?</h2>
          <p className="text-muted-foreground mb-6">
            Cursor is a code editor built from the ground up for AI-assisted development.
            It combines VSCode&apos;s editing experience with powerful AI features like
            Composer, Chat, and inline completions.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Composer</h3>
              <p className="text-sm text-muted-foreground">
                Multi-file AI editing. Describe changes across your codebase.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Chat</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions about your code with full context awareness.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Tab Completion</h3>
              <p className="text-sm text-muted-foreground">
                Context-aware code completions as you type.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
          <p className="text-muted-foreground mb-4">
            Configure Cursor for your project.
          </p>
          <CodeBlock code={cursorSettings} language="json" title=".cursor/settings.json" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Cursor Rules</h2>
          <p className="text-muted-foreground mb-4">
            Define rules that guide Cursor&apos;s AI behavior for your project.
          </p>
          <CodeBlock code={cursorrules} language="markdown" title=".cursorrules" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Keyboard Shortcuts</h2>
          <CodeBlock code={cursorShortcuts} language="markdown" title="Shortcuts" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Using Composer</h2>
          <p className="text-muted-foreground mb-4">
            Cursor Composer enables multi-file AI editing with a single prompt.
          </p>
          <CodeBlock code={composerExample} language="markdown" title="Composer Workflow" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Use .cursorrules</h3>
              <p className="text-sm text-muted-foreground">
                Define project conventions so Cursor follows your patterns.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Reference Files</h3>
              <p className="text-sm text-muted-foreground">
                Use @file to include specific files in context.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Review Diffs</h3>
              <p className="text-sm text-muted-foreground">
                Always review proposed changes before accepting.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Iterate</h3>
              <p className="text-sm text-muted-foreground">
                Break complex tasks into smaller, reviewable steps.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
