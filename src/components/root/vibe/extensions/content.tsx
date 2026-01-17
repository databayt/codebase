"use client"

import { PageHeader } from "@/components/atom/page-header"
import type { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

interface ExtensionsContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  params: { lang: Locale }
}

interface Extension {
  name: string
  publisher: string
  description: string
  url: string
  category: "ai" | "productivity" | "language" | "ui"
}

const extensions: Extension[] = [
  {
    name: "Cline",
    publisher: "saoudrizwan",
    description: "Autonomous AI coding agent for VSCode. Can plan, execute, and iterate on tasks.",
    url: "https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev",
    category: "ai",
  },
  {
    name: "Continue",
    publisher: "Continue",
    description: "Open-source AI code assistant. Supports multiple LLMs including Claude.",
    url: "https://marketplace.visualstudio.com/items?itemName=Continue.continue",
    category: "ai",
  },
  {
    name: "GitHub Copilot",
    publisher: "GitHub",
    description: "AI pair programmer. Inline suggestions and chat powered by OpenAI.",
    url: "https://marketplace.visualstudio.com/items?itemName=GitHub.copilot",
    category: "ai",
  },
  {
    name: "Supermaven",
    publisher: "Supermaven",
    description: "Fast AI code completion with 1M token context window.",
    url: "https://marketplace.visualstudio.com/items?itemName=supermaven.supermaven",
    category: "ai",
  },
  {
    name: "ESLint",
    publisher: "Microsoft",
    description: "JavaScript/TypeScript linting. Essential for code quality.",
    url: "https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint",
    category: "language",
  },
  {
    name: "Prettier",
    publisher: "Prettier",
    description: "Code formatter. Consistent formatting across your codebase.",
    url: "https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode",
    category: "language",
  },
  {
    name: "Tailwind CSS IntelliSense",
    publisher: "Tailwind Labs",
    description: "Autocomplete, syntax highlighting, and linting for Tailwind CSS.",
    url: "https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss",
    category: "language",
  },
  {
    name: "Prisma",
    publisher: "Prisma",
    description: "Syntax highlighting and autocompletion for Prisma schema files.",
    url: "https://marketplace.visualstudio.com/items?itemName=Prisma.prisma",
    category: "language",
  },
  {
    name: "Error Lens",
    publisher: "usernamehw",
    description: "Inline error and warning highlighting. See issues without hovering.",
    url: "https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens",
    category: "productivity",
  },
  {
    name: "GitLens",
    publisher: "GitKraken",
    description: "Git supercharged. Blame, history, and repository insights.",
    url: "https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens",
    category: "productivity",
  },
  {
    name: "Auto Rename Tag",
    publisher: "Jun Han",
    description: "Automatically rename paired HTML/JSX tags.",
    url: "https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag",
    category: "ui",
  },
  {
    name: "Color Highlight",
    publisher: "Sergii N",
    description: "Highlight colors in your code with their actual color.",
    url: "https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight",
    category: "ui",
  },
]

const categoryColors = {
  ai: "bg-purple-500/10 text-purple-600",
  productivity: "bg-green-500/10 text-green-600",
  language: "bg-blue-500/10 text-blue-600",
  ui: "bg-orange-500/10 text-orange-600",
}

export default function ExtensionsContent({ dictionary, params }: ExtensionsContentProps) {
  return (
    <div className="px-responsive lg:px-0 py-12">
      <PageHeader
        heading="Extensions"
        description="VSCode extensions for vibe coding. Essential tools for AI-assisted development."
      />

      <div className="mt-12 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">AI Extensions</h2>
          <p className="text-muted-foreground mb-6">
            AI-powered coding assistants that integrate with VSCode.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {extensions
              .filter((ext) => ext.category === "ai")
              .map((ext, index) => (
                <a
                  key={index}
                  href={ext.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border p-4 hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{ext.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{ext.description}</p>
                      <p className="text-xs text-muted-foreground">by {ext.publisher}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${categoryColors[ext.category]}`}>
                      {ext.category}
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Language Support</h2>
          <p className="text-muted-foreground mb-6">
            Extensions for TypeScript, Tailwind, and Prisma development.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {extensions
              .filter((ext) => ext.category === "language")
              .map((ext, index) => (
                <a
                  key={index}
                  href={ext.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border p-4 hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{ext.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{ext.description}</p>
                      <p className="text-xs text-muted-foreground">by {ext.publisher}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${categoryColors[ext.category]}`}>
                      {ext.category}
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Productivity</h2>
          <p className="text-muted-foreground mb-6">
            Extensions that boost your development workflow.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {extensions
              .filter((ext) => ext.category === "productivity")
              .map((ext, index) => (
                <a
                  key={index}
                  href={ext.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border p-4 hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{ext.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{ext.description}</p>
                      <p className="text-xs text-muted-foreground">by {ext.publisher}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${categoryColors[ext.category]}`}>
                      {ext.category}
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">UI Enhancements</h2>
          <p className="text-muted-foreground mb-6">
            Visual improvements for better coding experience.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {extensions
              .filter((ext) => ext.category === "ui")
              .map((ext, index) => (
                <a
                  key={index}
                  href={ext.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border p-4 hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{ext.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{ext.description}</p>
                      <p className="text-xs text-muted-foreground">by {ext.publisher}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${categoryColors[ext.category]}`}>
                      {ext.category}
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Recommended Setup</h2>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground mb-4">
              For vibe coding, we recommend this minimal extension set:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li><strong>Cline or Continue</strong> - AI coding agent</li>
              <li><strong>ESLint + Prettier</strong> - Code quality</li>
              <li><strong>Tailwind CSS IntelliSense</strong> - Styling</li>
              <li><strong>Prisma</strong> - Database</li>
              <li><strong>Error Lens</strong> - Inline errors</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
