"use client"

import { PageHeader } from "@/components/atom/page-header"
import type { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

interface TweetsContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  params: { lang: Locale }
}

interface Resource {
  title: string
  author: string
  url: string
  type: "article" | "tweet" | "video" | "repo"
  description: string
}

const resources: Resource[] = [
  {
    title: "Vibe Coding: The Future of Programming",
    author: "Andrej Karpathy",
    url: "https://x.com/karpathy/status/1886192184808149383",
    type: "tweet",
    description: "The original tweet that coined 'vibe coding' - programming by vibes with AI assistance.",
  },
  {
    title: "Building with Claude Code",
    author: "Anthropic",
    url: "https://docs.anthropic.com/en/docs/claude-code",
    type: "article",
    description: "Official documentation for Claude Code CLI tool.",
  },
  {
    title: "Cursor: The AI-First Code Editor",
    author: "Cursor Team",
    url: "https://cursor.sh/blog",
    type: "article",
    description: "Blog posts about AI-assisted development with Cursor.",
  },
  {
    title: "shadcn/ui: Re-usable Components",
    author: "shadcn",
    url: "https://ui.shadcn.com",
    type: "article",
    description: "The component system that powers modern React development.",
  },
  {
    title: "MCP: Model Context Protocol",
    author: "Anthropic",
    url: "https://modelcontextprotocol.io",
    type: "article",
    description: "Open protocol for connecting AI assistants to tools and data sources.",
  },
  {
    title: "Next.js 15: What's New",
    author: "Vercel",
    url: "https://nextjs.org/blog/next-15",
    type: "article",
    description: "Latest features in Next.js including async request APIs.",
  },
  {
    title: "React 19: Actions and More",
    author: "React Team",
    url: "https://react.dev/blog/2024/04/25/react-19",
    type: "article",
    description: "New features in React 19 for building modern apps.",
  },
  {
    title: "AI Coding Tools Comparison",
    author: "Fireship",
    url: "https://youtube.com/@Fireship",
    type: "video",
    description: "Video comparisons of AI coding assistants.",
  },
]

const typeColors = {
  article: "bg-blue-500/10 text-blue-600",
  tweet: "bg-sky-500/10 text-sky-600",
  video: "bg-red-500/10 text-red-600",
  repo: "bg-purple-500/10 text-purple-600",
}

export default function TweetsContent({ dictionary, params }: TweetsContentProps) {
  return (
    <div className="px-responsive lg:px-0 py-12">
      <PageHeader
        heading="Tweets & Resources"
        description="Curated articles, blogs, and tweets on vibe coding and AI-assisted development."
      />

      <div className="mt-12 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Latest Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                    <p className="text-xs text-muted-foreground">by {resource.author}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${typeColors[resource.type]}`}>
                    {resource.type}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Follow for Updates</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="https://x.com/karpathy"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-medium">@karpathy</h3>
              <p className="text-sm text-muted-foreground">AI/ML insights and vibe coding origin</p>
            </a>
            <a
              href="https://x.com/shadcn"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-medium">@shadcn</h3>
              <p className="text-sm text-muted-foreground">shadcn/ui updates and React patterns</p>
            </a>
            <a
              href="https://x.com/AnthropicAI"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-medium">@AnthropicAI</h3>
              <p className="text-sm text-muted-foreground">Claude and AI safety research</p>
            </a>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Vibe Coding</h3>
              <p className="text-sm text-muted-foreground">
                Programming by describing what you want in natural language. The AI handles implementation
                details while you focus on the high-level design.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">AI Pair Programming</h3>
              <p className="text-sm text-muted-foreground">
                Working alongside AI as a coding partner. You provide direction and review,
                AI handles boilerplate and suggestions.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Agentic Coding</h3>
              <p className="text-sm text-muted-foreground">
                AI agents that can plan, execute multi-step tasks, and delegate to specialists.
                More autonomous than simple completion.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Context Engineering</h3>
              <p className="text-sm text-muted-foreground">
                Crafting the right context (CLAUDE.md, rules, examples) to get better AI outputs.
                The new prompt engineering.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
