import Card from "@/components/atom/card"
import { templates } from "./config"
import { templates as registryTemplates } from "./registry-templates"
import { registryCategories } from "@/lib/categories"
import { StarterKit, OnboardingIcon, NotificationIcon, MDXIcon, ShieldIcon, StripeIcon } from "@/components/atom/icons"
import { Card as UICard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const iconMap = {
  StarterKit,
  OnboardingIcon,
  NotificationIcon,
  MDXIcon,
  ShieldIcon,
  StripeIcon,
}

export default function TemplatesPage() {
  const featuredTemplates = ["leads-01", "hero-01"]
  const featured = registryTemplates.filter(t => featuredTemplates.includes(t.name))

  const categorized = registryCategories
    .filter(cat => !cat.hidden)
    .map(category => ({
      ...category,
      templates: registryTemplates.filter(t => t.categories?.includes(category.slug))
    }))
    .filter(cat => cat.templates.length > 0)

  return (
    <div className="space-y-16">
      {/* Original Templates Section */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-6">Pre-built Solutions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {templates.map((template) => {
            const IconComponent = iconMap[template.icon as keyof typeof iconMap]
            return (
              <Card
                key={template.id}
                id={template.id}
                title={template.title}
                description={template.description}
                icon={IconComponent ? <IconComponent className={template.iconFill ? "fill-current" : ""} /> : null}
                href={template.href}
              />
            )
          })}
        </div>
      </div>

      {/* Registry Templates Section */}
      <div className="space-y-12">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Component Templates</h2>
          <p className="text-muted-foreground mb-8">
            Reusable UI templates built with shadcn/ui components. Copy and paste into your project.
          </p>

          {/* Featured Templates */}
          {featured.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Featured</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featured.map((template) => (
                  <Link
                    key={template.name}
                    href={`/templates/${template.name}`}
                    className="group"
                  >
                    <UICard className="h-full transition-colors hover:bg-muted/50">
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{template.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {template.categories?.map((cat) => (
                            <Badge key={cat} variant="secondary">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </UICard>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Categorized Templates */}
        {categorized.map((category) => (
          <div key={category.slug} className="space-y-4">
            <h3 className="text-lg font-medium capitalize">{category.name}</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {category.templates.map((template) => (
                <Link
                  key={template.name}
                  href={`/templates/${template.name}`}
                  className="group"
                >
                  <UICard className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {template.registryDependencies?.slice(0, 3).map((dep) => (
                          <Badge key={dep} variant="outline" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                        {template.registryDependencies && template.registryDependencies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.registryDependencies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </UICard>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}