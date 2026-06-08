"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { templatesSource } from "@/lib/source"
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

// Flat list of links (section comments mark groups but don't render — mirrors atoms-sidebar)
const TEMPLATES_LINKS = [
  { name: "Introduction", href: "/templates" },

  // Dashboard
  { name: "Dashboard 01", href: "/templates/dashboard-01" },

  // Sidebar
  { name: "Sidebar 01", href: "/templates/sidebar-01" },
  { name: "Sidebar 02", href: "/templates/sidebar-02" },
  { name: "Sidebar 03", href: "/templates/sidebar-03" },
  { name: "Sidebar 04", href: "/templates/sidebar-04" },
  { name: "Sidebar 05", href: "/templates/sidebar-05" },
  { name: "Sidebar 06", href: "/templates/sidebar-06" },
  { name: "Sidebar 07", href: "/templates/sidebar-07" },
  { name: "Sidebar 08", href: "/templates/sidebar-08" },
  { name: "Sidebar 09", href: "/templates/sidebar-09" },
  { name: "Sidebar 10", href: "/templates/sidebar-10" },
  { name: "Sidebar 11", href: "/templates/sidebar-11" },
  { name: "Sidebar 12", href: "/templates/sidebar-12" },
  { name: "Sidebar 13", href: "/templates/sidebar-13" },
  { name: "Sidebar 14", href: "/templates/sidebar-14" },
  { name: "Sidebar 15", href: "/templates/sidebar-15" },
  { name: "Sidebar 16", href: "/templates/sidebar-16" },

  // Login
  { name: "Login 01", href: "/templates/login-01" },

  // Signup
  { name: "Signup 01", href: "/templates/signup-01" },
  { name: "Signup 02", href: "/templates/signup-02" },
  { name: "Signup 03", href: "/templates/signup-03" },
  { name: "Signup 04", href: "/templates/signup-04" },
  { name: "Signup 05", href: "/templates/signup-05" },

  // Hero
  { name: "Hero 01", href: "/templates/hero-01" },
  { name: "Hero 02", href: "/templates/hero-02" },
  { name: "Hero 03", href: "/templates/hero-03" },

  // Header
  { name: "Header 01", href: "/templates/header-01" },
  { name: "Header 02", href: "/templates/header-02" },

  // Footer
  { name: "Footer 01", href: "/templates/footer-01" },
  { name: "Footer 02", href: "/templates/footer-02" },

  // Subscription
  { name: "Subscription 01", href: "/templates/subscription-01" },
  { name: "Subscription 02", href: "/templates/subscription-02" },
  { name: "Subscription 03", href: "/templates/subscription-03" },
]

export function TemplatesSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof templatesSource.pageTree }) {
  const pathname = usePathname()

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
                  {TEMPLATES_LINKS.map(({ name, href }) => {
                    const isActive =
                      pathname === href ||
                      pathname === `/en${href}` ||
                      pathname === `/ar${href}`

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
