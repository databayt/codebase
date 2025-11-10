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
import { atomsConfig } from "@/components/template/sidebar-01/atoms-config"

const allAtoms = atomsConfig.sidebarNav.flatMap(section => section.items)

// Extract unique categories from atoms (you can enhance this based on your atom categorization)
const categories = Array.from(new Set(allAtoms.map(() => "Component"))).length

export default function AtomsPage() {
  return (
    <div className="w-full min-w-0 max-w-[52rem] mx-auto">
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
            <div className="text-2xl font-semibold">{allAtoms.length}</div>
            <div className="text-sm text-muted-foreground">Components</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-semibold">{categories}</div>
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
            {allAtoms.map((atom) => (
              <Link
                key={atom.href}
                href={atom.href}
                className="group"
              >
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {atom.title}
                      </CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        Atom
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      Custom {atom.title.toLowerCase()} component
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
