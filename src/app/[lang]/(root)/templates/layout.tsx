import { Metadata } from "next"

import { templatesSource } from "@/lib/source"
import { TemplatesSidebar } from "@/components/docs/templates-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { type Locale } from "@/components/local/config"
import "../../../globals.css"

const title = "Building Blocks for the Web"
const description = "Clean, modern building blocks. Copy and paste into your apps. Works with all React frameworks. Open Source. Free forever."

export const metadata: Metadata = {
  title,
  description,
}

interface TemplatesLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}

export default async function TemplatesLayout({
  children,
}: TemplatesLayoutProps) {
  return (
    <div className="container-wrapper flex flex-1 flex-col">
      <SidebarProvider className="3xl:fixed:container 3xl:fixed:px-3 min-h-min flex-1 items-start px-responsive lg:px-0 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)]">
        <TemplatesSidebar tree={templatesSource.pageTree} />
        <div className="h-full w-full">{children}</div>
      </SidebarProvider>
    </div>
  )
}
