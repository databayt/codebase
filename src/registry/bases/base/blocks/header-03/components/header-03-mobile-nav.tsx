"use client"

import * as React from "react"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { HeaderDictionary } from "@/registry/bases/base/blocks/header-03/components/header-03"

export function HeaderMobileNav({
  dictionary,
  lang,
}: {
  dictionary: HeaderDictionary
  lang: "en" | "ar"
}) {
  const [open, setOpen] = React.useState(false)
  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            className="h-8 touch-manipulation gap-2.5 px-0! hover:bg-transparent aria-expanded:bg-transparent md:hidden dark:hover:bg-transparent"
          />
        }
      >
        {/* Two bars that cross into an X while the menu is open */}
        <span className="relative size-4" aria-hidden="true">
          <span
            className={cn(
              "absolute start-0 block h-0.5 w-4 bg-foreground transition-all duration-150",
              open ? "top-[0.4rem] -rotate-45" : "top-1"
            )}
          />
          <span
            className={cn(
              "absolute start-0 block h-0.5 w-4 bg-foreground transition-all duration-150",
              open ? "top-[0.4rem] rotate-45" : "top-2.5"
            )}
          />
        </span>
        <span className="sr-only">{dictionary.menu.open}</span>
        <span className="text-lg leading-none font-medium" aria-hidden="true">
          {dictionary.menu.label}
        </span>
      </SheetTrigger>
      <SheetContent
        dir={dir}
        side={lang === "ar" ? "right" : "left"}
        showCloseButton={false}
        className="w-full gap-0 bg-background/95 backdrop-blur sm:max-w-sm"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b px-6">
          <SheetTitle className="font-bold">{dictionary.brand.name}</SheetTitle>
          <SheetClose render={<Button variant="ghost" size="icon-sm" />}>
            <XIcon />
            <span className="sr-only">{dictionary.menu.close}</span>
          </SheetClose>
        </div>
        <nav
          aria-label={dictionary.navLabel}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6"
        >
          <p className="text-sm font-medium text-muted-foreground">
            {dictionary.menu.label}
          </p>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href={dictionary.brand.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {dictionary.menu.home}
              </a>
            </li>
            {dictionary.links.map((link) => (
              <li key={link.href + link.label}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-2xl font-medium text-foreground/80 transition-colors hover:text-foreground",
                    link.current && "text-foreground"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <SheetFooter className="border-t p-6">
          <Button
            size="lg"
            className="w-full"
            nativeButton={false}
            render={<a href={dictionary.action.href} />}
            onClick={() => setOpen(false)}
          >
            {dictionary.action.label}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
