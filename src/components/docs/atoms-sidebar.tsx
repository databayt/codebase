"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { atomsSource } from "@/lib/source"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Flat list of links without sections
const ATOMS_LINKS = [
  { name: "Introduction", href: "/atoms" },

  // Card Components
  { name: "Activity Goal", href: "/atoms/activity-goal" },
  { name: "Calendar", href: "/atoms/calendar" },
  { name: "Chat", href: "/atoms/chat" },
  { name: "Cookie Settings", href: "/atoms/cookie-settings" },
  { name: "Create Account", href: "/atoms/create-account" },
  { name: "Data Table", href: "/atoms/data-table" },
  { name: "Metric", href: "/atoms/metric" },
  { name: "Payment Method", href: "/atoms/payment-method" },
  { name: "Report Issue", href: "/atoms/report-issue" },
  { name: "Share", href: "/atoms/share" },
  { name: "Stats", href: "/atoms/stats" },
  { name: "Team Members", href: "/atoms/team-members" },

  // Other Atoms
  { name: "Accordion", href: "/atoms/accordion" },
]

export function AtomsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof atomsSource.pageTree }) {
  const pathname = usePathname()

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)-4rem)] overscroll-none bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="no-scrollbar overflow-x-hidden">
        <div className="from-background via-background/80 to-background/50 sticky -top-1 z-10 h-8 shrink-0 bg-gradient-to-b blur-xs" />
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {ATOMS_LINKS.map(({ name, href }) => {
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
        <div className="from-background via-background/80 to-background/50 sticky -bottom-1 z-10 h-16 shrink-0 bg-gradient-to-t blur-xs" />
      </SidebarContent>
    </Sidebar>
  )
}
