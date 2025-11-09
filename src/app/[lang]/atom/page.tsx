import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const atoms = [
  {
    name: "Agent Heading",
    href: "/atom/agent-heading",
    description: "Dynamic heading component for AI agents",
    category: "Display",
  },
  {
    name: "AI Response Display",
    href: "/atom/ai-response-display",
    description: "Formatted display for AI responses",
    category: "Display",
  },
  {
    name: "Announcement",
    href: "/atom/announcement",
    description: "Banner component for announcements",
    category: "Display",
  },
  {
    name: "Card",
    href: "/atom/card",
    description: "Custom card component with variants",
    category: "Layout",
  },
  {
    name: "Card Hover Effect",
    href: "/atom/card-hover-effect",
    description: "Interactive card with hover animations",
    category: "Interactive",
  },
  {
    name: "Cards Metric",
    href: "/atom/cards-metric",
    description: "Metric display cards for dashboards",
    category: "Display",
  },
  {
    name: "Expand Button",
    href: "/atom/expand-button",
    description: "Animated expandable button component",
    category: "Interactive",
  },
  {
    name: "Faceted",
    href: "/atom/faceted",
    description: "Faceted filter component",
    category: "Forms",
  },
  {
    name: "Gradient Animation",
    href: "/atom/gradient-animation",
    description: "Animated gradient background effects",
    category: "Animation",
  },
  {
    name: "Header Section",
    href: "/atom/header-section",
    description: "Reusable header section component",
    category: "Layout",
  },
  {
    name: "Infinite Cards",
    href: "/atom/infinite-cards",
    description: "Infinite scrolling card carousel",
    category: "Animation",
  },
  {
    name: "Infinite Slider",
    href: "/atom/infinite-slider",
    description: "Continuous auto-scrolling slider",
    category: "Animation",
  },
  {
    name: "Loading",
    href: "/atom/loading",
    description: "Loading states and indicators",
    category: "Utility",
  },
  {
    name: "Modal",
    href: "/atom/modal",
    description: "Modal dialog system with routing",
    category: "Interactive",
  },
  {
    name: "Page Actions",
    href: "/atom/page-actions",
    description: "Page-level action buttons",
    category: "Layout",
  },
  {
    name: "Page Header",
    href: "/atom/page-header",
    description: "Consistent page header component",
    category: "Layout",
  },
  {
    name: "Progressive Blur",
    href: "/atom/progressive-blur",
    description: "Progressive blur effect for content",
    category: "Animation",
  },
  {
    name: "Prompt Input",
    href: "/atom/prompt-input",
    description: "AI prompt input component",
    category: "Forms",
  },
  {
    name: "Reasoning",
    href: "/atom/reasoning",
    description: "AI reasoning display component",
    category: "Display",
  },
  {
    name: "Response",
    href: "/atom/response",
    description: "Response display component",
    category: "Display",
  },
  {
    name: "Simple Marquee",
    href: "/atom/simple-marquee",
    description: "Simple marquee scrolling text",
    category: "Animation",
  },
  {
    name: "Sortable",
    href: "/atom/sortable",
    description: "Drag and drop sortable list",
    category: "Interactive",
  },
  {
    name: "Sticky Scroll",
    href: "/atom/sticky-scroll",
    description: "Sticky scroll reveal animations",
    category: "Animation",
  },
  {
    name: "Tabs",
    href: "/atom/tabs",
    description: "Custom tabs component",
    category: "Interactive",
  },
  {
    name: "Two Buttons",
    href: "/atom/two-buttons",
    description: "Paired button component",
    category: "Interactive",
  },
]

const categories = Array.from(new Set(atoms.map((atom) => atom.category)))

export default function AtomsPage() {
  return (
    <div className="w-full min-w-0 max-w-[52rem]">
      <div className="flex flex-col gap-6">
        {/* Hero Section */}
        <div className="flex flex-col gap-4 pb-8">
          <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
            Atoms
          </h1>
          <p className="text-muted-foreground text-lg text-balance max-w-[46rem]">
            A collection of beautifully designed, reusable components built with
            React and Tailwind CSS. Copy, paste, and customize to build your
            applications faster.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <Button asChild>
              <Link href="#browse">
                Browse Atoms <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs">Documentation</Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pb-8 border-b">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-semibold">{atoms.length}</div>
            <div className="text-sm text-muted-foreground">Components</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-semibold">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-semibold">100%</div>
            <div className="text-sm text-muted-foreground">Customizable</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-semibold">TypeScript</div>
            <div className="text-sm text-muted-foreground">Type-safe</div>
          </div>
        </div>

        {/* Atoms Grid */}
        <div id="browse" className="flex flex-col gap-6 pt-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Browse Components
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {atoms.map((atom) => (
              <Link
                key={atom.href}
                href={atom.href}
                className="group"
              >
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {atom.name}
                      </CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        {atom.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {atom.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      View docs
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex flex-col gap-4 py-12 border-t mt-8">
          <h3 className="text-xl font-semibold">Ready to get started?</h3>
          <p className="text-muted-foreground">
            Click on any component above to view its documentation, see live
            examples, and copy the code.
          </p>
        </div>
      </div>
    </div>
  )
}
