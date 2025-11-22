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
                  {ATOMS_LINKS.map(({ name, href }) => {
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
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}
