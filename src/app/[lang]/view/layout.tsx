import "@/app/globals.css"
import { type Locale } from "@/components/local/config"

interface ViewLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}

export default async function ViewLayout({
  children,
  params,
}: ViewLayoutProps) {
  const { lang } = await params

  // Don't render html/body tags since we're inside the root layout
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}