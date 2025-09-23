import { notFound } from "next/navigation"
import { templates } from "@/registry/registry-templates"
import dynamic from "next/dynamic"
import { type Locale } from "@/components/local/config"

interface TemplatePageProps {
  params: Promise<{
    name: string
    lang: Locale
  }>
}

export function generateStaticParams() {
  return templates.map((template) => ({
    name: template.name,
  }))
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { name } = await params
  const template = templates.find((t) => t.name === name)

  if (!template) {
    notFound()
  }

  // Dynamically import the template component
  const TemplateComponent = dynamic(
    () => import(`@/registry/new-york/templates/${template.name}/page`),
    {
      loading: () => (
        <div className="flex h-[600px] items-center justify-center">
          <div className="text-muted-foreground">Loading template...</div>
        </div>
      ),
    }
  )

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{template.name}</h1>
        <p className="text-lg text-muted-foreground">{template.description}</p>

        <div className="flex flex-wrap items-center gap-4">
          {template.categories?.map((cat) => (
            <span key={cat} className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-sm font-medium text-secondary-foreground">
              {cat}
            </span>
          ))}
          {template.dependencies && template.dependencies.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Dependencies:</span> {template.dependencies.join(", ")}
            </div>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/50 p-8">
          <TemplateComponent />
        </div>
      </div>

      {/* Code Display Section */}
      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Installation</h2>
        <div className="rounded-lg bg-muted p-4">
          <code className="text-sm">
            npx shadcn@latest add {template.name}
          </code>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>This template includes:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {template.files.map((file) => (
              <li key={file.path}>{file.path}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}