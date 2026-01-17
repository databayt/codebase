"use client"

import { PageHeader } from "@/components/atom/page-header"
import { CodeBlock } from "../shared/code-block"
import type { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

interface CommandsContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  params: { lang: Locale }
}

const commandTemplate = `# /push Command

Push changes to remote with validation.

## Usage
\`\`\`bash
/push [message]
/push "feat: add user authentication"
\`\`\`

## Arguments
| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| message | string | No | Commit message (auto-generated if omitted) |

## Execution
### Step 1: Validate
- Run \`pnpm build\` to check for errors
- Run \`pnpm lint\` for code quality

### Step 2: Stage
- \`git add .\` to stage all changes
- Review staged files

### Step 3: Commit
- Generate or use provided message
- Follow conventional commits format

### Step 4: Push
- \`git push origin <branch>\`
- Report success or failure

## Examples
\`\`\`bash
# Auto-generate commit message
/push

# Custom message
/push "fix: resolve auth redirect loop"

# With scope
/push "feat(auth): add OAuth2 support"
\`\`\`

## Error Handling
| Error | Solution |
|-------|----------|
| Build fails | Fix errors before pushing |
| Lint fails | Run \`pnpm lint --fix\` |
| Push rejected | Pull latest changes first |`

const quickCommand = `# /quick Command

Fast commit without build validation.

## Usage
\`\`\`bash
/quick [message]
\`\`\`

## When to Use
- Small documentation changes
- Config updates
- When you've already validated

## Execution
1. Stage all changes
2. Commit with message
3. Push immediately

## Examples
\`\`\`bash
/quick "docs: update README"
/quick "chore: update dependencies"
\`\`\``

const buildCommand = `# /build Command

Smart build with error reporting.

## Usage
\`\`\`bash
/build [options]
\`\`\`

## Options
| Option | Description |
|--------|-------------|
| --fix | Auto-fix lint errors |
| --strict | Fail on warnings |

## Execution
1. Run TypeScript check
2. Run ESLint
3. Run Next.js build
4. Report results

## Examples
\`\`\`bash
/build
/build --fix
/build --strict
\`\`\``

export default function CommandsContent({ dictionary, params }: CommandsContentProps) {
  return (
    <div className="px-responsive lg:px-0 py-12">
      <PageHeader
        heading="Commands"
        description="Slash commands for AI workflows. Define reusable operations with clear execution steps."
      />

      <div className="mt-12 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">What are Commands?</h2>
          <p className="text-muted-foreground mb-6">
            Commands are slash-invocable operations defined in markdown files. They provide
            structured workflows with clear steps, arguments, and error handling.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Location</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">~/.claude/commands/*.md</code>
              <p className="text-sm text-muted-foreground mt-2">Global commands</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Project-Level</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">.claude/commands/*.md</code>
              <p className="text-sm text-muted-foreground mt-2">Project-specific commands</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Command Structure</h2>
          <p className="text-muted-foreground mb-4">
            Commands follow a consistent structure with usage, arguments, execution steps, and error handling.
          </p>
          <CodeBlock code={commandTemplate} language="markdown" title="push.md" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Quick Commands</h2>
          <p className="text-muted-foreground mb-4">
            Simple commands for fast operations without extensive validation.
          </p>
          <CodeBlock code={quickCommand} language="markdown" title="quick.md" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Build Commands</h2>
          <p className="text-muted-foreground mb-4">
            Commands for building and validating your project.
          </p>
          <CodeBlock code={buildCommand} language="markdown" title="build.md" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Common Commands</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Command</th>
                  <th className="text-left py-2 pr-4">Purpose</th>
                  <th className="text-left py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>/push</code></td>
                  <td className="py-2 pr-4">Full deploy checklist</td>
                  <td className="py-2">~45s</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>/quick</code></td>
                  <td className="py-2 pr-4">Fast commit (skip build)</td>
                  <td className="py-2">~10s</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>/build</code></td>
                  <td className="py-2 pr-4">Smart build</td>
                  <td className="py-2">~45s</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>/test</code></td>
                  <td className="py-2 pr-4">Run tests</td>
                  <td className="py-2">varies</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>/review</code></td>
                  <td className="py-2 pr-4">Code review</td>
                  <td className="py-2">~2min</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4"><code>/fix-all</code></td>
                  <td className="py-2 pr-4">Auto-fix issues</td>
                  <td className="py-2">varies</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
