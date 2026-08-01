import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { findNeighbour } from "fumadocs-core/page-tree"
import type { Metadata } from "next"

import { templatesSource } from "@/lib/source"
import { getAllTemplateIds } from "@/lib/templates"
import { registryCategories } from "@/lib/categories"
import { TemplateDisplay } from "@/components/root/template/template-display"
import { TemplatesSidebar } from "@/components/docs/templates-sidebar"
import { DocsTableOfContents } from "@/components/docs/toc"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { mdxComponents } from "@/mdx-components"
import { type Locale } from "@/components/local/config"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

const FEATURED_TEMPLATES = [
  "dashboard-01",
  "sidebar-07",
  "sidebar-03",
  "sidebar-01",
  "login-01",
]

const categorySlugs = new Set(registryCategories.map((c) => c.slug))

export function generateStaticParams() {
  const params: { slug?: string[] }[] = [
    { slug: [] },
    ...registryCategories.map((category) => ({ slug: [category.slug] })),
  ]
  const seen = new Set(params.map((p) => (p.slug ?? []).join("/")))
  for (const p of templatesSource.generateParams()) {
    const key = (p.slug ?? []).join("/")
    if (seen.has(key)) continue
    seen.add(key)
    params.push(p)
  }
  return params
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const { slug } = await props.params

  if (!slug?.length) {
    return { title: "Templates" }
  }
  if (slug.length === 1 && categorySlugs.has(slug[0])) {
    const category = registryCategories.find((c) => c.slug === slug[0])
    return { title: `${category?.name ?? slug[0]} Templates` }
  }

  const page = templatesSource.getPage(slug)
  if (!page) notFound()
  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: "article",
      url: `https://cb.databayt.org${page.url}`,
    },
  }
}

export default async function TemplatesPage(props: {
  params: Promise<{ slug?: string[]; lang: Locale }>
}) {
  const { slug, lang } = await props.params

  // 1. /templates — featured grid
  if (!slug?.length) {
    return (
      <div className="flex flex-col gap-12 md:gap-24">
        {FEATURED_TEMPLATES.map((name) => (
          <TemplateDisplay name={name} key={name} styleName="default" />
        ))}
        <div className="container-wrapper">
          <div className="container flex justify-center py-6">
            <Button asChild variant="outline">
              <Link href={`/${lang}/templates/sidebar`}>Browse more templates</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 2. /templates/<category> — filtered grid
  if (slug.length === 1 && categorySlugs.has(slug[0])) {
    const templates = await getAllTemplateIds(["registry:template"], [slug[0]])

    if (templates.length === 0) {
      return (
        <div className="container py-8">
          <p className="text-center text-muted-foreground">
            No templates found in this category.
          </p>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-12 md:gap-24">
        {templates.map((name) => (
          <TemplateDisplay name={name} key={name} styleName="default" />
        ))}
      </div>
    )
  }

  // 3. /templates/<name> — per-template MDX docs (atoms parity)
  const page = templatesSource.getPage(slug)
  if (!page) notFound()

  const doc = page.data
  const MDX = doc.body
  const neighbours = findNeighbour(templatesSource.pageTree, page.url)

  return (
    <SidebarProvider className="min-h-0 [--sidebar-width:220px] lg:[--sidebar-width:240px]">
      <div className="flex w-full items-stretch gap-8 text-[1.05rem] sm:text-[15px]">
        <TemplatesSidebar tree={templatesSource.pageTree} />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-4xl min-w-0 flex-1 flex-col gap-8 py-6 text-neutral-800 lg:py-8 dark:text-neutral-300">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                  {doc.title}
                </h1>
                <div className="flex items-center gap-2 pt-1.5">
                  {neighbours.previous && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="extend-touch-target ms-auto size-8 shadow-none md:size-7"
                      asChild
                    >
                      <Link href={neighbours.previous.url}>
                        <ArrowLeft className="rtl:rotate-180" />
                        <span className="sr-only">Previous</span>
                      </Link>
                    </Button>
                  )}
                  {neighbours.next && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="extend-touch-target size-8 shadow-none md:size-7"
                      asChild
                    >
                      <Link href={neighbours.next.url}>
                        <span className="sr-only">Next</span>
                        <ArrowRight className="rtl:rotate-180" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              {doc.description && (
                <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
                  {doc.description}
                </p>
              )}
            </div>
            <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
              <MDX components={mdxComponents} />
            </div>
          </div>
        </div>
        <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--footer-height)+2rem)] w-64 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
          {doc.toc?.length ? (
            <div className="no-scrollbar overflow-y-auto px-6">
              <DocsTableOfContents toc={doc.toc} />
              <div className="h-12" />
            </div>
          ) : null}
        </div>
      </div>
    </SidebarProvider>
  )
}
