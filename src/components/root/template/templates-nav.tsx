"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { registryCategories } from "@/lib/categories"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export function TemplatesNav() {
  const pathname = usePathname()

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-none">
        <div className="flex items-center">
          <TemplatesNavLink
            category={{ name: "Featured", slug: "", hidden: false }}
            isActive={pathname === "/templates" || pathname === "/en/templates" || pathname === "/ar/templates"}
          />
          {registryCategories.map((category) => (
            <TemplatesNavLink
              key={category.slug}
              category={category}
              isActive={
                pathname === `/templates/${category.slug}` ||
                pathname === `/en/templates/${category.slug}` ||
                pathname === `/ar/templates/${category.slug}`
              }
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}

function TemplatesNavLink({
  category,
  isActive,
}: {
  category: { name: string; slug: string; hidden: boolean }
  isActive: boolean
}) {
  if (category.hidden) {
    return null
  }

  const pathname = usePathname()
  const lang = pathname.split('/')[1] || 'en'

  return (
    <Link
      href={`/${lang}/templates/${category.slug}`}
      key={category.slug}
      className="text-muted-foreground hover:text-primary data-[active=true]:text-primary flex h-7 items-center justify-center px-4 text-center text-base font-medium transition-colors"
      data-active={isActive}
    >
      {category.name}
    </Link>
  )
}