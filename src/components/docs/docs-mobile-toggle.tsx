"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PanelLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

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
]

export function DocsMobileToggle({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn("size-7 lg:hidden", className)}
        onClick={() => setOpen(true)}
      >
        <PanelLeftIcon className="size-4" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Documentation Navigation</SheetTitle>
            <SheetDescription>Navigate documentation pages</SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-full py-6 px-4">
            <nav className="flex flex-col gap-1">
              {DOCS_LINKS.map(({ name, href }) => {
                const isActive = pathname === href || pathname?.endsWith(href)

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {name}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}
