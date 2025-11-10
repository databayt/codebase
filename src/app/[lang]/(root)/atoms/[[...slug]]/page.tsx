import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import {
  getAllAtomSlugs,
  findAtomNeighbours,
  getAtomMetadata,
  extractToc
} from "@/lib/atoms-utils"
import { Button } from "@/components/ui/button"
import { DocsTableOfContents } from "@/components/docs/toc"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { atomsConfig } from "@/components/template/sidebar-01/atoms-config"

export const runtime = "nodejs"

const allAtoms = atomsConfig.sidebarNav.flatMap(section => section.items)
const categories = Array.from(new Set(allAtoms.map(() => "Component"))).length

export async function generateStaticParams() {
  const atoms = getAllAtomSlugs()
  return [
    { slug: undefined }, // For the landing page
    ...atoms.map(atom => ({
      slug: atom.slug,
    }))
  ]
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params

  // Use introduction for empty slug
  const effectiveSlug = !slug || slug.length === 0 ? ['introduction'] : slug

  const metadata = await getAtomMetadata(effectiveSlug)

  if (!metadata) {
    return {
      title: "Atom Not Found",
      description: "The requested atom could not be found.",
    }
  }

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.tags,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "article",
    },
  }
}

export default async function AtomPage({ params }: { params: Promise<{ slug?: string[], lang: string }> }) {
  const { slug, lang } = await params

  // When slug is empty or undefined, load introduction.mdx
  const effectiveSlug = !slug || slug.length === 0 ? ['introduction'] : slug

  // Individual atom page
  const atomPath = effectiveSlug.join('/')
  const atomHref = `/atoms/${atomPath}`

  // Get metadata
  const metadata = await getAtomMetadata(effectiveSlug)

  if (!metadata) {
    notFound()
  }

  // Get navigation
  const { previous, next } = findAtomNeighbours(displayHref)

  // Extract ToC
  const toc = extractToc(metadata.content)

  // Dynamic import of MDX component from content directory
  let AtomContent
  let frontmatter = metadata.frontmatter

  try {
    // Try to import from content/atoms/ directory
    const mdxModule = await import(`@/content/atoms/${atomPath}.mdx`)
    AtomContent = mdxModule.default
    // Override with MDX exported frontmatter if it exists
    if (mdxModule.frontmatter) {
      frontmatter = { ...frontmatter, ...mdxModule.frontmatter }
    }
  } catch (error) {
    console.error(`Failed to load atom: ${atomPath}`, error)
    notFound()
  }

  // For introduction page, adjust the href for navigation
  const displayHref = atomPath === 'introduction' ? '/atoms' : atomHref

  return (
    <div className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                  {metadata.title}
                </h1>
                <div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
                  {previous && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="extend-touch-target ml-auto size-8 shadow-none md:size-7"
                      asChild
                    >
                      <Link href={previous.href}>
                        <ArrowLeft />
                        <span className="sr-only">Previous</span>
                      </Link>
                    </Button>
                  )}
                  {next && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="extend-touch-target size-8 shadow-none md:size-7"
                      asChild
                    >
                      <Link href={next.href}>
                        <span className="sr-only">Next</span>
                        <ArrowRight />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              {metadata.description && (
                <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
                  {metadata.description}
                </p>
              )}
            </div>

            {/* Category & Tags */}
            {(metadata.category || metadata.tags.length > 0) && (
              <div className="flex items-center gap-2 pt-2">
                {metadata.category && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    {metadata.category}
                  </span>
                )}
                {metadata.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
            <AtomContent />
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mx-auto hidden h-16 w-full max-w-2xl items-center gap-2 px-4 sm:flex md:px-0">
          {previous && (
            <Button
              variant="secondary"
              size="sm"
              asChild
              className="shadow-none"
            >
              <Link href={previous.href}>
                <ArrowLeft /> {previous.title}
              </Link>
            </Button>
          )}
          {next && (
            <Button
              variant="secondary"
              size="sm"
              className="ml-auto shadow-none"
              asChild
            >
              <Link href={next.href}>
                {next.title} <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Table of Contents Sidebar */}
      <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--footer-height)+2rem)] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
        <div className="h-(--top-spacing) shrink-0" />
        {toc.length > 0 && (
          <div className="no-scrollbar overflow-y-auto px-8">
            <DocsTableOfContents toc={toc} />
            <div className="h-12" />
          </div>
        )}
      </div>
    </div>
  )
}
