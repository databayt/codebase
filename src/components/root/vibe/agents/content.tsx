"use client"

import { PageHeader } from "@/components/atom/page-header"
import { CodeBlock, ConfigCard } from "../shared/code-block"
import type { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

interface AgentsContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  params: { lang: Locale }
}

const agentTemplate = `---
name: architect
description: System architecture expert for component design and patterns
model: opus
handoff: [nextjs, prisma, react]
skills: ["/component", "/page"]
memory: ["~/.claude/memory/patterns.json"]
mcps: [github, shadcn]
---

# Architect Agent

You are a system architecture expert specializing in:
- Component-driven modularity
- Mirror-pattern directory structure
- Prisma schema design
- Multi-tenant architecture

## When to Use
Use this agent when the user needs:
- Architectural guidance for new features
- Code structure reviews
- Component organization decisions

## Examples
<example>
Context: User needs to create a new feature
user: "I need to add user profile management"
assistant: Uses architect agent for structure guidance
</example>`

const agentCategories = `| Category | Agents | Purpose |
|----------|--------|---------|
| **Stack** | nextjs, react, typescript, tailwind, prisma | Framework expertise |
| **Design** | orchestration, architecture, pattern | System design |
| **UI** | shadcn, atom, template, block | Component hierarchy |
| **DevOps** | build, deploy, test | Infrastructure |
| **VCS** | git, github | Version control |`

const handoffExample = `---
name: orchestration
handoff: [architecture, nextjs, prisma, react]
---

# Orchestration Agent (Master Coordinator)

When a task requires multiple domains:
1. Analyze the request
2. Delegate to specialized agents
3. Coordinate responses
4. Return unified solution

Handoff chain:
orchestration
├── architecture → pattern → structure
├── nextjs → react → typescript
└── prisma → database-optimizer`

export default function AgentsContent({ dictionary, params }: AgentsContentProps) {
  return (
    <div className="px-responsive lg:px-0 py-12">
      <PageHeader
        heading="Agents"
        description="Specialized AI agents for coding tasks. Define experts for your stack, design patterns, and workflows."
      />

      <div className="mt-12 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">What are Agents?</h2>
          <p className="text-muted-foreground mb-6">
            Agents are specialized AI personas defined in markdown files. Each agent has expertise
            in specific domains and can delegate to other agents through handoff chains.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Location</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">~/.claude/agents/*.md</code>
              <p className="text-sm text-muted-foreground mt-2">Global agents available everywhere</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Project-Level</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">.claude/agents/*.md</code>
              <p className="text-sm text-muted-foreground mt-2">Project-specific overrides</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Agent Template</h2>
          <p className="text-muted-foreground mb-4">
            Agents use YAML frontmatter for metadata and markdown for detailed instructions.
          </p>
          <CodeBlock code={agentTemplate} language="markdown" title="architect.md" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Agent Categories</h2>
          <p className="text-muted-foreground mb-4">
            Organize agents by domain for easy discovery and delegation.
          </p>
          <CodeBlock code={agentCategories} language="markdown" title="Agent Organization" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Handoff Patterns</h2>
          <p className="text-muted-foreground mb-4">
            Agents can delegate tasks to other specialists through the handoff field.
          </p>
          <CodeBlock code={handoffExample} language="markdown" title="orchestration.md" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">YAML Frontmatter Fields</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Field</th>
                  <th className="text-left py-2 pr-4">Required</th>
                  <th className="text-left py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>name</code></td>
                  <td className="py-2 pr-4">Yes</td>
                  <td className="py-2">Unique identifier for the agent</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>description</code></td>
                  <td className="py-2 pr-4">Yes</td>
                  <td className="py-2">When to invoke this agent</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>model</code></td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2">Model to use (opus, sonnet, haiku)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>handoff</code></td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2">Array of agents to delegate to</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>skills</code></td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2">Array of skill commands</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4"><code>memory</code></td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2">Array of memory file paths</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4"><code>mcps</code></td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2">Array of MCP servers to use</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
