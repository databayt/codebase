"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import type { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Circle, File, Laptop, Moon, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"

import { docsConfig } from "./constants"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import type { getDictionary } from "@/components/local/dictionaries"
import { AssetResults, parseQuery, spotlightFilter, useAssetIndex } from "./asset-search"

interface CommandMenuProps extends DialogPrimitive.Root.Props {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export function CommandMenu({ dictionary, ...props }: CommandMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [scopeCleared, setScopeCleared] = React.useState(false)
  const { setTheme } = useTheme()
  const index = useAssetIndex(open)

  // On /<lang>/arts/<namespace>… Spotlight starts scoped to that namespace.
  const lang = pathname?.match(/^\/(en|ar)(?=\/|$)/)?.[1] ?? "en"
  const tabScope = pathname?.match(/^\/(?:en|ar)\/arts\/([^/]+)/)?.[1] ?? null
  const namespaces = React.useMemo(
    () => new Set(index?.keys.map((k) => k.split("/")[0]) ?? []),
    [index],
  )
  const pathScope = tabScope && namespaces.has(tabScope) && !scopeCleared ? tabScope : null
  const scope = parseQuery(query, namespaces).scope ?? pathScope
  const assetResults =
    index && (
      <AssetResults
        index={index}
        query={query}
        scope={pathScope}
        lang={lang}
        onNavigate={(href) => runCommand(() => router.push(href))}
      />
    )

  React.useEffect(() => {
    if (open) return
    setQuery("")
    setScopeCleared(false)
  }, [open])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <h6 className="hidden lg:inline-flex">{dictionary?.header?.searchPlaceholder || "Search documentation..."}</h6>
        <h6 className="inline-flex lg:hidden">{dictionary?.header?.search || "Search..."}</h6>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono opacity-100 sm:flex">
          <small>⌘</small>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command filter={spotlightFilter}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder={dictionary?.header?.searchPlaceholder || "Search docs, or @hogwarts for assets..."}
        />
        {scope && (
          <div className="flex items-center gap-2 border-b px-3 py-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-mono">
              in: {scope}
              {scope === pathScope && !parseQuery(query, namespaces).scope && (
                <button
                  type="button"
                  aria-label="Search everything"
                  onClick={() => setScopeCleared(true)}
                  className="hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </span>
          </div>
        )}
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Links">
            {docsConfig.mainNav
              .filter((navitem) => !navitem.external)
              .map((navItem) => (
                <CommandItem
                  key={navItem.href}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => router.push(navItem.href as string))
                  }}
                >
                  <File />
                  {navItem.title}
                </CommandItem>
              ))}
          </CommandGroup>
          {docsConfig.sidebarNav.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem) => (
                <CommandItem
                  key={navItem.href}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => router.push(navItem.href as string))
                  }}
                >
                  <div className="mr-2 flex h-4 w-4 items-center justify-center">
                    <Circle className="h-3 w-3" />
                  </div>
                  {navItem.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          {assetResults}
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
