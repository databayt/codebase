import { notFound } from "next/navigation"
import { templates } from "@/components/root/template/registry-templates"
import dynamic from "next/dynamic"
import { type Locale } from "@/components/local/config"
import { Metadata } from "next"

interface ViewPageProps {
  params: Promise<{
    template: string
    lang: Locale
  }>
}

export async function generateMetadata({
  params,
}: ViewPageProps): Promise<Metadata> {
  const { template: templateName } = await params
  const template = templates.find((t) => t.name === templateName)

  if (!template) {
    return {}
  }

  return {
    title: `${template.name} - Template Preview`,
    description: template.description,
  }
}

export function generateStaticParams() {
  return templates.map((template) => ({
    template: template.name,
  }))
}

export default async function ViewPage({ params }: ViewPageProps) {
  const { template: templateName } = await params
  const template = templates.find((t) => t.name === templateName)

  if (!template) {
    notFound()
  }

  // Dynamically import the template component
  const TemplateComponent = dynamic(
    () => import(`@/components/template/${template.name}/page`),
    {
      loading: () => (
        <div className="flex h-screen items-center justify-center">
          <div className="text-muted-foreground">Loading template...</div>
        </div>
      ),
    }
  )

  // Render the template in isolation - no wrapper, no container
  // This gives a true fullscreen experience like shadcn's /view routes
  return <TemplateComponent />
}