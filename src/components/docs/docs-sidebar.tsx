"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PageTree } from "fumadocs-core/server"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Top-level section navigation
const TOP_LEVEL_SECTIONS = [
  { name: "Get Started", href: "/docs" },
  { name: "Components", href: "/docs/components" },
  { name: "Operations", href: "/docs/operations" },
  { name: "Contribute", href: "/docs/contribute" },
  { name: "Business", href: "/docs/business" },
]

const EXCLUDED_SECTIONS: string[] = [] // Add any sections to exclude
const EXCLUDED_PAGES: string[] = [] // Add any pages to exclude

interface DocsSidebarProps extends React.ComponentProps<typeof Sidebar> {
  tree: PageTree
}

export function DocsSidebar({ tree, ...props }: DocsSidebarProps) {
  const pathname = usePathname()

  // Function to render page tree items recursively
  const renderPageTree = (items: typeof tree.children, level = 0) => {
    return items.map((item) => {
      if (EXCLUDED_SECTIONS.includes(item.type === 'folder' ? item.$id ?? "" : "")) {
        return null
      }

      if (item.type === 'folder') {
        return (
          <SidebarGroup key={item.$id}>
            <SidebarGroupLabel className="text-muted-foreground font-medium">
              {item.name}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {item.children.map((page) => {
                  if (page.type === 'page' && !EXCLUDED_PAGES.includes(page.url)) {
                    return (
                      <SidebarMenuItem key={page.url}>
                        <SidebarMenuButton
                          asChild
                          isActive={page.url === pathname}
                          className="data-[active=true]:bg-accent data-[active=true]:border-accent relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium"
                        >
                          <Link href={page.url}>{page.name}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  }
                  if (page.type === 'folder') {
                    // Handle nested folders if needed
                    return renderPageTree([page], level + 1)
                  }
                  return null
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )
      }

      if (item.type === 'page' && !EXCLUDED_PAGES.includes(item.url)) {
        // Root-level pages
        return (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton
              asChild
              isActive={item.url === pathname}
              className="data-[active=true]:bg-accent data-[active=true]:border-accent relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium"
            >
              <Link href={item.url}>{item.name}</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      }

      return null
    })
  }

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)-4rem)] overscroll-none bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="no-scrollbar overflow-x-hidden px-2">
        <div className="from-background via-background/80 to-background/50 sticky -top-1 z-10 h-8 shrink-0 bg-gradient-to-b blur-xs" />

        {/* Top-level sections navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-medium">
            Sections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {TOP_LEVEL_SECTIONS.map(({ name, href }) => (
                <SidebarMenuItem key={name}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      href === "/docs"
                        ? pathname === href || pathname === "/en/docs" || pathname === "/ar/docs"
                        : pathname.startsWith(href) || pathname.startsWith(`/en${href}`) || pathname.startsWith(`/ar${href}`)
                    }
                    className="data-[active=true]:bg-accent data-[active=true]:border-accent relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium"
                  >
                    <Link href={href}>{name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Dynamic page tree sections */}
        {renderPageTree(tree.children)}

        <div className="from-background via-background/80 to-background/50 sticky -bottom-1 z-10 h-16 shrink-0 bg-gradient-to-t blur-xs" />
      </SidebarContent>
    </Sidebar>
  )
}