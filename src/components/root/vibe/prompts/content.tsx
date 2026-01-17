"use client"

import { PageHeader } from "@/components/atom/page-header"
import { CodeBlock } from "../shared/code-block"
import type { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

interface PromptsContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  params: { lang: Locale }
}

const componentPrompt = `Create a [component name] component that:
- Uses shadcn/ui primitives (Card, Button, etc.)
- Follows our atom pattern (2+ primitives)
- Includes TypeScript interface for props
- Has responsive design (mobile-first)
- Supports RTL layout

Location: src/components/atom/[name].tsx

Reference existing atoms in src/components/atom/ for patterns.`

const pagePrompt = `Create a new page at /[route] that:
- Follows mirror-pattern (app + components directories)
- Uses async params: \`const { lang } = await params\`
- Delegates to content.tsx component
- Includes proper TypeScript types

Files to create:
1. app/[lang]/(root)/[route]/page.tsx
2. components/root/[feature]/content.tsx

Reference existing pages in app/[lang]/(root)/ for patterns.`

const debugPrompt = `I have an error:
[paste error message]

Context:
- File: [file path]
- Action: [what I was doing]
- Expected: [what should happen]
- Actual: [what happened]

Please help me debug this.`

const refactorPrompt = `Refactor [file/component] to:
- [ ] Improve TypeScript types
- [ ] Extract reusable logic
- [ ] Add error handling
- [ ] Improve performance
- [ ] Follow project patterns

Keep the same functionality but improve code quality.`

const reviewPrompt = `Review this code for:
1. TypeScript errors or improvements
2. React best practices (hooks, renders)
3. Security vulnerabilities
4. Performance issues
5. Accessibility concerns

Be specific about issues and provide fixes.`

const testPrompt = `Write tests for [file/component]:
- Unit tests for individual functions
- Integration tests for component behavior
- Edge cases and error scenarios
- Mock external dependencies

Use Vitest and React Testing Library.
Target 95%+ coverage.`

export default function PromptsContent({ dictionary, params }: PromptsContentProps) {
  return (
    <div className="px-responsive lg:px-0 py-12">
      <PageHeader
        heading="Prompts"
        description="Ready-to-use prompts for AI pair programming. Copy and customize for your tasks."
      />

      <div className="mt-12 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Component Creation</h2>
          <p className="text-muted-foreground mb-4">
            Create new components following project patterns.
          </p>
          <CodeBlock code={componentPrompt} language="markdown" title="Create Component" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Page Creation</h2>
          <p className="text-muted-foreground mb-4">
            Create new pages with mirror-pattern structure.
          </p>
          <CodeBlock code={pagePrompt} language="markdown" title="Create Page" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Debugging</h2>
          <p className="text-muted-foreground mb-4">
            Get help debugging errors effectively.
          </p>
          <CodeBlock code={debugPrompt} language="markdown" title="Debug Error" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Refactoring</h2>
          <p className="text-muted-foreground mb-4">
            Improve existing code quality.
          </p>
          <CodeBlock code={refactorPrompt} language="markdown" title="Refactor Code" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Code Review</h2>
          <p className="text-muted-foreground mb-4">
            Get thorough code reviews.
          </p>
          <CodeBlock code={reviewPrompt} language="markdown" title="Review Code" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Testing</h2>
          <p className="text-muted-foreground mb-4">
            Generate comprehensive tests.
          </p>
          <CodeBlock code={testPrompt} language="markdown" title="Write Tests" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Prompt Tips</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Be Specific</h3>
              <p className="text-sm text-muted-foreground">
                Include file paths, expected behavior, and constraints.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Provide Context</h3>
              <p className="text-sm text-muted-foreground">
                Reference existing patterns and conventions.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Use Checklists</h3>
              <p className="text-sm text-muted-foreground">
                Break complex tasks into checkable items.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Iterate</h3>
              <p className="text-sm text-muted-foreground">
                Refine prompts based on results you get.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
