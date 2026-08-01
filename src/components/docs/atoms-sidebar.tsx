"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { atomsSource } from "@/lib/source"
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

type PageTree = typeof atomsSource.pageTree

type PageTreeNode = PageTree["children"][number]

// Flatten the fumadocs page tree (folders included) into ordered links.
// meta.json owns the order; every MDX page appears automatically.
function collectLinks(nodes: PageTreeNode[]): { name: string; href: string }[] {
  const links: { name: string; href: string }[] = []
  for (const node of nodes) {
    if (node.type === "page") {
      links.push({ name: String(node.name), href: node.url })
    } else if (node.type === "folder") {
      if (node.index) {
        links.push({ name: String(node.index.name), href: node.index.url })
      }
      links.push(...collectLinks(node.children))
    }
  }
  return links
}

export function AtomsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: PageTree }) {
  const pathname = usePathname()
  // Routes live under /[lang]; tree urls do not carry the locale prefix.
  const pathWithoutLang = pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || "/"

  const links = collectLinks(tree.children)

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+2rem)] z-30 hidden h-[calc(100vh-var(--header-height)-4rem)] overflow-y-auto bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="overflow-y-auto gap-0">
        <ScrollArea className="h-full w-full">
          <div className="pb-4 pt-2 pl-0">
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu>
                  {links.map(({ name, href }) => {
                    const isActive = pathWithoutLang === href

                    return (
                      <SidebarMenuItem key={href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className="relative h-[30px] w-full border border-transparent text-[0.8rem] font-medium p-0"
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
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}
