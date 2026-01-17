"use client"

import { PageHeader } from "@/components/atom/page-header"
import { CodeBlock } from "../shared/code-block"
import type { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

interface SkillsContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  params: { lang: Locale }
}

const skillTemplate = `# /atom Skill

Create atom components (2+ primitives combined).

## Trigger
User says: "create atom", "atom component", "/atom"

## Execution
1. Check existing atoms in src/components/atom/
2. Review shadcn/ui patterns for inspiration
3. Create component with proper exports
4. Add to atom registry

## Example
\`\`\`tsx
// components/atom/stat-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
\`\`\``

const inlineSkill = `## Inline Skill Definition

Skills can be defined inline in CLAUDE.md:

\`\`\`markdown
## Skills

### test-generator
When user asks to test a file:
1. Analyze the source file
2. Generate test file with same name + .test.ts
3. Cover edge cases and error paths
4. Target 95% coverage
\`\`\``

export default function SkillsContent({ dictionary, params }: SkillsContentProps) {
  return (
    <div className="px-responsive lg:px-0 py-12">
      <PageHeader
        heading="Skills"
        description="Reusable skill definitions for AI. Define specialized capabilities that can be triggered by keywords."
      />

      <div className="mt-12 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">What are Skills?</h2>
          <p className="text-muted-foreground mb-6">
            Skills are reusable capabilities that agents can invoke. They define specific tasks
            with clear inputs, outputs, and execution steps.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">File-Based Skills</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">.claude/commands/*.md</code>
              <p className="text-sm text-muted-foreground mt-2">Standalone skill definitions</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Inline Skills</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">CLAUDE.md ## Skills</code>
              <p className="text-sm text-muted-foreground mt-2">Embedded in CLAUDE.md</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Skill Template</h2>
          <CodeBlock code={skillTemplate} language="markdown" title="atom.md" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Inline Skills</h2>
          <CodeBlock code={inlineSkill} language="markdown" title="CLAUDE.md" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Available Skills</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Skill</th>
                  <th className="text-left py-2 pr-4">Keywords</th>
                  <th className="text-left py-2">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>test-generator</code></td>
                  <td className="py-2 pr-4">test, coverage, tdd</td>
                  <td className="py-2">Generate tests (95%+ coverage)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>prisma-optimizer</code></td>
                  <td className="py-2 pr-4">prisma, query, n+1</td>
                  <td className="py-2">Query optimization</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>react-performance</code></td>
                  <td className="py-2 pr-4">optimize, render, memo</td>
                  <td className="py-2">Component optimization</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>security-scanner</code></td>
                  <td className="py-2 pr-4">security, owasp, vuln</td>
                  <td className="py-2">Vulnerability scanning</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>api-designer</code></td>
                  <td className="py-2 pr-4">api, action, route</td>
                  <td className="py-2">Server action patterns</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4"><code>ui-validator</code></td>
                  <td className="py-2 pr-4">ui, semantic, tokens</td>
                  <td className="py-2">UI quality checks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
