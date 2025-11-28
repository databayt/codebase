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
  { name: "Pitch", href: "/docs/pitch" },
  { name: "MVP", href: "/docs/mvp" },
  { name: "PRD", href: "/docs/prd" },
  { name: "Get Started", href: "/docs/get-started" },
  { name: "Architecture", href: "/docs/architecture" },
  { name: "Structure", href: "/docs/structure" },
  { name: "Pattern", href: "/docs/pattern" },
  { name: "Stack", href: "/docs/stack" },
  { name: "Database", href: "/docs/database" },
  { name: "Localhost", href: "/docs/localhost" },
  { name: "Contributing", href: "/docs/contributing" },
  { name: "Shared Economy", href: "/docs/shared-economy" },
  { name: "Competitors", href: "/docs/competitors" },
  { name: "Inspiration", href: "/docs/inspiration" },
  { name: "Demo", href: "/docs/demo" },
  // { name: "Installation", href: "/docs/installation" },
  // { name: "Roadmap", href: "/docs/roadmap" },
  // { name: "Changelog", href: "/docs/changelog" },
  // { name: "Issues", href: "/docs/issues" },
  // { name: "Claude Code", href: "/docs/claude-code" },
  // { name: "Vibe Coding", href: "/docs/vibe-coding" },
  // { name: "Authentication", href: "/docs/authantication" },
  // { name: "Internationalization", href: "/docs/internationalization" },
  // { name: "Domain", href: "/docs/domain" },
  // { name: "Table", href: "/docs/table" },
  // { name: "Onboarding", href: "/docs/onboarding" },
  // { name: "ESLint", href: "/docs/eslint" },
  // { name: "Prettier", href: "/docs/prettier" },
  // { name: "Community", href: "/docs/community" },
  // { name: "Code of Conduct", href: "/docs/code-of-conduct" },
  // { name: "Accordion", href: "/docs/accordion" },
  // { name: "Button", href: "/docs/button" },
  // { name: "Card", href: "/docs/card" },
  // { name: "Typography", href: "/docs/typography" },
  // { name: "Docs Factory", href: "/docs/docs-factory" },
  // { name: "Atoms Factory", href: "/docs/atoms-factory" },
  // { name: "Templates Factory", href: "/docs/templates-factory" },
]

export function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof docsSource.pageTree }) {
  const pathname = usePathname()

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+2rem)] z-30 hidden h-[calc(100vh-var(--header-height)-4rem)] overflow-y-auto no-scrollbar bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="overflow-y-auto gap-0">
        <div className="pb-4 pt-2 pl-0">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu>
                {DOCS_LINKS.map(({ name, href }) => {
                  const isActive = pathname === href

                  return (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="data-[active=true]:bg-accent data-[active=true]:border-accent relative h-[30px] w-full border border-transparent text-[0.8rem] font-medium p-0"
                      >
                        <Link href={href} className="block w-full">{name}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}