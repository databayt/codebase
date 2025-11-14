
import Link from "next/link"

import { TemplateDisplay } from "@/components/root/template/template-display"
import { Button } from "@/components/ui/button"
import { type Locale } from "@/components/local/config"

export const dynamic = "force-static"
export const revalidate = false

export const metadata = {
  title: "Templates",
}

const FEATURED_TEMPLATES = [
  "dashboard-01",
  "sidebar-01",
  "login-01",
  "hero-01",
  "footer-01",
]

interface TemplatePageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function Templates({ params }: TemplatePageProps) {
  const { lang } = await params;
  const activeStyle = "new-york" // You can implement getActiveStyle() if needed

  return (
    <div className="flex flex-col gap-12 md:gap-24">
      {FEATURED_TEMPLATES.map((name) => (
        <TemplateDisplay name={name} key={name} styleName={activeStyle} />
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