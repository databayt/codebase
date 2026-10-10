"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { registryCategories } from "@/lib/categories"
import blocks from "@/registry/__blocks__.json"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

// Categories are declared up front for the section library; only those
// with at least one template show in the nav.
const populated = new Set(blocks.flatMap((block) => block.categories))

export function TemplatesNav() {
  const pathname = usePathname()

  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <nav className="flex items-center gap-2 rtl:flex-row-reverse">
          <TemplatesNavLink
            category={{ name: "Featured", slug: "", hidden: false }}
            isActive={pathname === "/templates" || pathname === "/en/templates" || pathname === "/ar/templates"}
          />
          {registryCategories
            .filter((category) => populated.has(category.slug))
            .map((category) => (
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
        </nav>
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
  const pathname = usePathname()
  const lang = pathname.split('/')[1] || 'en'

  if (category.hidden) {
    return null
  }

  return (
    <Link
      href={`/${lang}/templates/${category.slug}`}
      key={category.slug}
      className="flex h-7 items-center justify-center rounded-full px-4 text-center transition-colors hover:text-primary data-[active=true]:bg-muted data-[active=true]:text-primary"
      data-active={isActive}
    >
      <h6 className="whitespace-nowrap">{category.name}</h6>
    </Link>
  )
}