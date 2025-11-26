"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { getDictionary } from "@/components/local/dictionaries"

const MAIN_NAV_ITEMS = [
  { href: "/docs", label: "Docs" },
  { href: "/atoms", label: "Atoms" },
  { href: "/templates", label: "Templates" },
  { href: "/blocks", label: "Blocks" },
  { href: "/micros", label: "Micros" },
  { href: "/vibes", label: "Vibes" },
]

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

interface MobileNavProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
  className?: string
}

export function MobileNav({ dictionary, className }: MobileNavProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent",
            className
          )}
        >
          <div className="relative flex h-8 w-4 items-center justify-center">
            <div className="relative size-4">
              <span
                className={cn(
                  "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                  open ? "top-[0.4rem] -rotate-45" : "top-1"
                )}
              />
              <span
                className={cn(
                  "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                  open ? "top-[0.4rem] rotate-45" : "top-2.5"
                )}
              />
            </div>
            <span className="sr-only">{dictionary?.navigation?.toggleMenu || "Toggle Menu"}</span>
          </div>
          <span className="flex h-8 items-center text-lg leading-none font-medium">
            Menu
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-background/90 no-scrollbar h-[var(--radix-popper-available-height)] w-[var(--radix-popper-available-width)] overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur duration-100"
        align="start"
        side="bottom"
        alignOffset={-16}
        sideOffset={14}
      >
        <div className="flex flex-col gap-12 overflow-auto px-6 py-6">
          {/* Main Navigation */}
          <div className="flex flex-col gap-4">
            <div className="text-muted-foreground text-sm font-medium">
              Menu
            </div>
            <div className="flex flex-col gap-3">
              <MobileLink href="/" onOpenChange={setOpen}>
                Home
              </MobileLink>
              {MAIN_NAV_ITEMS.map((item) => (
                <MobileLink key={item.href} href={item.href} onOpenChange={setOpen}>
                  {item.label}
                </MobileLink>
              ))}
            </div>
          </div>
          {/* Documentation Links */}
          <div className="flex flex-col gap-4">
            <div className="text-muted-foreground text-sm font-medium">
              Documentation
            </div>
            <div className="flex flex-col gap-3">
              {DOCS_LINKS.map(({ name, href }) => (
                <MobileLink key={href} href={href} onOpenChange={setOpen}>
                  {name}
                </MobileLink>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn("text-2xl font-medium", className)}
      {...props}
    >
      {children}
    </Link>
  )
}
