"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { docsSource } from "@/lib/source"
import { ScrollArea } from "@/components/ui/scroll-area"
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
      className="sticky top-[calc(var(--header-height)+2rem)] z-30 hidden h-[calc(100vh-var(--header-height)-4rem)] overflow-y-auto bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="overflow-y-auto">
        <ScrollArea className="h-full w-full">
          <div className="pb-4 pt-2">
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
                          className="data-[active=true]:bg-accent data-[active=true]:border-accent relative h-[30px] w-full border border-transparent text-[0.8rem] font-medium px-2"
                        >
                          <Link href={href}>{name}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}