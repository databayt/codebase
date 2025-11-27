"use client"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function DocsMobileToggle({ className }: { className?: string }) {
  const { isMobile } = useSidebar()

  if (!isMobile) return null

  return <SidebarTrigger className={cn("lg:hidden", className)} />
}
