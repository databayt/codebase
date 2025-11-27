"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import type { getDictionary } from "@/components/local/dictionaries"

interface MainNavProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
  className?: string
}

export function MainNav({ dictionary, className }: MainNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center gap-4 text-sm xl:gap-6", className)}>
        <Link
          href="/docs"
          className={cn(
            pathname?.startsWith("/docs")
              ? "text-foreground"
              : ""
          )}
        >
          <h6>{dictionary?.navigation?.docs || "Docs"}</h6>
        </Link>
        <Link
          href="/atoms"
          className={cn(
            pathname?.startsWith("/atoms")
              ? "text-foreground"
              : ""
          )}
        >
          <h6>{dictionary?.navigation?.atoms || "Atoms"}</h6>
        </Link>
        <Link
          href="/templates"
          className={cn(
            pathname?.startsWith("/templates")
              ? "text-foreground"
              : ""
          )}
        >
          <h6>{dictionary?.navigation?.templates || "Templates"}</h6>
        </Link>
        <Link
          href="/blocks"
          className={cn(
            pathname?.startsWith("/docs/component/blocks") ||
              pathname?.startsWith("/blocks")
              ? "text-foreground"
              : ""
          )}
        >
          <h6>{dictionary?.navigation?.blocks || "Blocks"}</h6>
        </Link>
        <Link
          href="/micros"
          className={cn(
            pathname?.startsWith("/docs/component/micros") ||
              pathname?.startsWith("/micros")
              ? "text-foreground"
              : ""
          )}
        >
          <h6>{dictionary?.navigation?.micros || "Micros"}</h6>
        </Link>
        <Link
          href="/vibes"
          className={cn(
            pathname?.startsWith("/docs/component/vibes") ||
              pathname?.startsWith("/vibes")
              ? "text-foreground"
              : ""
          )}
        >
          <h6>{dictionary?.navigation?.vibes || "Vibes"}</h6>
        </Link>
    </nav>
  )
}
