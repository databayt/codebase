import Link from "next/link"

import { BlockDisplay } from "@/components/docs/block-display"
import { Button } from "@/components/ui/button"
import { type Locale } from "@/components/local/config"

export const dynamic = "force-static"
export const revalidate = false

// Mirrors shadcn's /blocks page: a handful of featured templates.
const FEATURED_TEMPLATES = [
  "dashboard-01",
  "sidebar-07",
  "sidebar-03",
  "hero-04",
  "login-03",
]

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params

  return (
    <div className="flex flex-col gap-12 md:gap-24">
      {FEATURED_TEMPLATES.map((name) => (
        <BlockDisplay name={name} key={name} />
      ))}
      <div className="container-wrapper">
        <div className="container flex justify-center py-6">
          <Button asChild variant="outline">
            <Link href={`/${lang}/templates/sidebar`}>
              Browse more templates
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
