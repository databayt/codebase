import { getAllTemplateIds } from "@/lib/templates"
import { registryCategories } from "@/lib/categories"
import { TemplateDisplay } from "@/components/root/template/template-display"
import { type Locale } from "@/components/local/config"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  return registryCategories.map((category) => ({
    categories: [category.slug],
  }))
}

interface TemplatePageProps {
  params: Promise<{
    categories?: string[]
    lang: Locale
  }>
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { categories = [] } = await params
  const templates = await getAllTemplateIds(["registry:template"], categories)

  // Get active style (you may need to implement getActiveStyle or use a default)
  const activeStyle = "default" // Changed from "new-york" to "default"

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
        <TemplateDisplay name={name} key={name} styleName={activeStyle} />
      ))}
    </div>
  )
}