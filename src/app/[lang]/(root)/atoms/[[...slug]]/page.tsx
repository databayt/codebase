import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { atomsSource } from "@/lib/source"
import { findNeighbour } from "fumadocs-core/page-tree"
import { Button } from "@/components/ui/button"
import { DocsTableOfContents } from "@/components/docs/toc"
import { DocsCopyPage } from "@/components/docs-copy-page"
import { useMDXComponents } from "@/../mdx-components"
import { AtomPreview } from "@/components/docs/atom-preview"
import { ComponentPreview } from "@/components/docs/component-preview"
import type { Metadata } from "next"

export const runtime = "nodejs"

export async function generateStaticParams() {
  return atomsSource.generateParams()
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params
  const page = atomsSource.getPage(slug)

  if (!page) {
    return {
      title: "Atom Not Found",
      description: "The requested atom could not be found.",
    }
  }

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: "article",
    },
  }
}

export default async function AtomPage({ params }: { params: Promise<{ slug?: string[], lang: string }> }) {
  const { slug, lang } = await params

  // Get page from fumadocs
  const page = atomsSource.getPage(slug)

  if (!page) {
    notFound()
  }

  // Find previous and next pages using fumadocs utility
  const neighbours = findNeighbour(atomsSource.pageTree, page.url)
  const allPages = atomsSource.getPages()

  const previous = neighbours.previous ? allPages.find((p: any) => p.url === neighbours.previous?.url) : null
  const next = neighbours.next ? allPages.find((p: any) => p.url === neighbours.next?.url) : null

  // Get MDX components
  const mdxComponents = useMDXComponents({
    AtomPreview,
    ComponentPreview,
  })

  // Full page URL for copy page component
  const pageUrl = `https://cb.databayt.org/en${page.url}`

  return (
    <div className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                  {page.data.title}
                </h1>
                <div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
                  <DocsCopyPage page={""} url={pageUrl} />
                  {previous && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="extend-touch-target ml-auto size-8 shadow-none md:size-7"
                      asChild
                    >
                      <Link href={previous.url}>
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
                      <Link href={next.url}>
                        <span className="sr-only">Next</span>
                        <ArrowRight />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              {page.data.description && (
                <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
                  {page.data.description}
                </p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
            <page.data.default components={mdxComponents} />
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
              <Link href={previous.url}>
                <ArrowLeft /> {previous.data.title}
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
              <Link href={next.url}>
                {next.data.title} <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Table of Contents Sidebar */}
      <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--footer-height)+2rem)] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
        <div className="h-(--top-spacing) shrink-0" />
        {page.data.toc && page.data.toc.length > 0 && (
          <div className="no-scrollbar overflow-y-auto px-8">
            <DocsTableOfContents toc={page.data.toc} />
            <div className="h-12" />
          </div>
        )}
      </div>
    </div>
  )
}
