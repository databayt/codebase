"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { docsSource } from "@/lib/source"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Flat list of links without sections - exactly like atoms sidebar
const DOCS_LINKS = [
  { name: "Introduction", href: "/docs" },
  { name: "Installation", href: "/docs/installation" },
  { name: "Architecture", href: "/docs/architecture" },
  { name: "Pattern", href: "/docs/pattern" },
  { name: "Stack", href: "/docs/stack" },
  { name: "Structure", href: "/docs/structure" },
  { name: "Roadmap", href: "/docs/roadmap" },
  { name: "Changelog", href: "/docs/changelog" },
  { name: "Issues", href: "/docs/issues" },
  { name: "Claude Code", href: "/docs/claude-code" },
  { name: "Vibe Coding", href: "/docs/vibe-coding" },
  { name: "Authentication", href: "/docs/authantication" },
  { name: "Internationalization", href: "/docs/internationalization" },
  { name: "Domain", href: "/docs/domain" },
  { name: "Table", href: "/docs/table" },
  { name: "Onboarding", href: "/docs/onboarding" },
  { name: "ESLint", href: "/docs/eslint" },
  { name: "Prettier", href: "/docs/prettier" },
  { name: "Community", href: "/docs/community" },
  { name: "Code of Conduct", href: "/docs/code-of-conduct" },
  { name: "Accordion", href: "/docs/accordion" },
  { name: "Button", href: "/docs/button" },
  { name: "Card", href: "/docs/card" },
  { name: "Typography", href: "/docs/typography" },
  { name: "Docs Factory", href: "/docs/docs-factory" },
  { name: "Atoms Factory", href: "/docs/atoms-factory" },
  { name: "Templates Factory", href: "/docs/templates-factory" },
]

export function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof docsSource.pageTree }) {
  const pathname = usePathname()

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)-4rem)] overscroll-none bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="no-scrollbar overflow-x-hidden">
        <div className="from-background via-background/80 to-background/50 sticky -top-1 z-10 h-8 shrink-0 bg-gradient-to-b blur-xs" />
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {DOCS_LINKS.map(({ name, href }) => {
                const isActive = pathname === href

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="data-[active=true]:bg-accent data-[active=true]:border-accent relative h-[30px] w-full border border-transparent text-[0.8rem] font-medium px-0"
                    >
                      <Link href={href}>{name}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="from-background via-background/80 to-background/50 sticky -bottom-1 z-10 h-16 shrink-0 bg-gradient-to-t blur-xs" />
      </SidebarContent>
    </Sidebar>
  )
}