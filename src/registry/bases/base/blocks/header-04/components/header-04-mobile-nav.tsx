"use client"

import * as React from "react"
import { LanguagesIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { HeaderDictionary } from "@/registry/bases/base/blocks/header-04/components/header-04"

/** Full-height phone menu that slides in from the inline end. */
export function HeaderMobileNav({
  dictionary,
  lang,
}: {
  dictionary: HeaderDictionary
  lang: "en" | "ar"
}) {
  const [open, setOpen] = React.useState(false)
  const dir = lang === "ar" ? "rtl" : "ltr"
  const close = () => setOpen(false)
  const links = [...dictionary.links, ...dictionary.more.links]
  const language = dictionary.language

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-lg"
            className="size-11 rounded-full hover:bg-foreground/5 lg:hidden"
          />
        }
      >
        {/* Two-line mark: quieter than the three-bar hamburger */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="size-6"
        >
          <path d="M4 8h16M4 16h16" />
        </svg>
        <span className="sr-only">{dictionary.menu.open}</span>
      </SheetTrigger>
      <SheetContent
        dir={dir}
        side={lang === "ar" ? "left" : "right"}
        showCloseButton={false}
        className="w-full gap-0 bg-background sm:max-w-sm"
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-5">
          <SheetTitle className="text-xl font-bold">
            {dictionary.brand.name}
          </SheetTitle>
          <SheetClose
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="size-11 rounded-full hover:bg-foreground/5"
              />
            }
          >
            <XIcon className="size-6" />
            <span className="sr-only">{dictionary.menu.close}</span>
          </SheetClose>
        </div>
        <nav
          aria-label={dictionary.navLabel}
          className="flex-1 overflow-y-auto px-3 pb-4"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href + link.label}>
                <a
                  href={link.href}
                  onClick={close}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(
                    "flex h-14 items-center rounded-2xl px-4 text-2xl font-bold transition-colors outline-none hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/50",
                    link.current && "bg-muted"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex shrink-0 flex-col gap-3 border-t p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <Button
            size="lg"
            className="h-12 w-full rounded-full text-base"
            nativeButton={false}
            render={<a href={dictionary.cta.href} />}
            onClick={close}
          >
            {dictionary.cta.label}
          </Button>
          <a
            href={language.href}
            hrefLang={language.lang}
            lang={language.lang}
            aria-label={`${language.label}: ${language.switchTo}`}
            className="inline-flex h-11 items-center gap-1.5 self-center rounded-full px-3 text-sm font-medium transition-colors hover:bg-foreground/5"
          >
            <LanguagesIcon aria-hidden="true" className="size-4" />
            {language.switchTo}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
