
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
  "dashboard-01",  // A dashboard with sidebar, charts and data table
  "sidebar-07",    // A sidebar that collapses to icons
  "sidebar-03",    // A sidebar with submenus
  "sidebar-01",    // Collapsible sidebar with multi-level navigation
  "login-01",      // Modern login form with social authentication
]

interface TemplatePageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function Templates({ params }: TemplatePageProps) {
  const { lang } = await params;
  const activeStyle = "default" // Using default style as templates are in default folder

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