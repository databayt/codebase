import { type Metadata } from "next"
import { redirect } from "next/navigation"

import { getAllBlockIds, getAllBlocks } from "@/lib/blocks"
import { registryCategories } from "@/lib/categories"
import { BlockDisplay } from "@/components/docs/block-display"
import { type Locale } from "@/components/local/config"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

// Mirrors shadcn's /blocks/[...categories]. Old per-template URLs
// (/templates/hero-01) redirect to the template inside its category.
export async function generateStaticParams() {
  const blocks = await getAllBlocks(["registry:block"])
  return [
    ...registryCategories.map((category) => ({ categories: [category.slug] })),
    ...blocks.map((block) => ({ categories: [block.name] })),
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categories?: string[] }>
}) {
  const { categories = [] } = await params
  const category = registryCategories.find(({ slug }) => slug === categories[0])

  return {
    title: category ? `${category.name} Templates` : undefined,
  } satisfies Metadata
}

export default async function TemplatesCategoryPage({
  params,
}: {
  params: Promise<{ categories?: string[]; lang: Locale }>
}) {
  const { categories = [], lang } = await params

  if (!registryCategories.some(({ slug }) => slug === categories[0])) {
    const [block] = await getAllBlocks(["registry:block"])
      .then((blocks) => blocks.filter((b) => b.name === categories[0]))
    const category = block?.categories?.find((slug) =>
      registryCategories.some((c) => c.slug === slug && !c.hidden)
    )
    redirect(`/${lang}/templates/${category ?? "sidebar"}#${categories[0]}`)
  }

  const blocks = await getAllBlockIds(["registry:block"], categories)

  return (
    <div className="flex flex-col gap-12 md:gap-24">
      {blocks.map((name) => (
        <BlockDisplay name={name} key={name} />
      ))}
    </div>
  )
}
