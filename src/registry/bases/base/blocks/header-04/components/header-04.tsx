import { ChevronDownIcon, LanguagesIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HeaderMobileNav } from "@/registry/bases/base/blocks/header-04/components/header-04-mobile-nav"

export type HeaderLink = {
  label: string
  href: string
  /** Marks the link for the page being viewed (aria-current). */
  current?: boolean
}

export type HeaderDictionary = {
  brand: { name: string; href: string }
  /** Visually hidden until focused; jumps to `#main`. */
  skipToContent: string
  navLabel: string
  /** Shown inline on desktop. */
  links: HeaderLink[]
  /** Overflow links: a "More" menu on desktop, appended to the phone menu. */
  more: { label: string; links: HeaderLink[] }
  language: {
    /** Accessible name prefix, e.g. "Language". */
    label: string
    /** Target language in its own script, e.g. "العربية". */
    switchTo: string
    href: string
    lang: string
  }
  cta: { label: string; href: string }
  menu: { open: string; close: string }
}

export function LanguageLink({
  language,
  className,
}: {
  language: HeaderDictionary["language"]
  className?: string
}) {
  return (
    <a
      href={language.href}
      hrefLang={language.lang}
      lang={language.lang}
      aria-label={`${language.label}: ${language.switchTo}`}
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors outline-none hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <LanguagesIcon aria-hidden="true" className="size-4" />
      {language.switchTo}
    </a>
  )
}

export function Header({
  dictionary,
  lang,
  className,
}: {
  dictionary: HeaderDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <header
      dir={dir}
      className={cn(
        "sticky top-0 z-40 border-b border-foreground/10 bg-background",
        className
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        {dictionary.skipToContent}
      </a>
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-18 lg:px-8">
        <a
          href={dictionary.brand.href}
          className="rounded-full text-2xl leading-none font-black tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {dictionary.brand.name}
        </a>

        <nav aria-label={dictionary.navLabel} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {dictionary.links.map((link) => (
              <li key={link.href + link.label}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center rounded-full px-3.5 text-[0.95rem] font-medium text-foreground/75 transition-colors outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                    link.current && "bg-foreground/5 text-foreground"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageLink
            language={dictionary.language}
            className="hidden sm:inline-flex"
          />
          <Button
            className="hidden h-10 rounded-full px-5 sm:inline-flex"
            nativeButton={false}
            render={<a href={dictionary.cta.href} />}
          >
            {dictionary.cta.label}
          </Button>
          {dictionary.more.links.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="hidden h-10 rounded-full px-3.5 text-[0.95rem] text-foreground/75 lg:inline-flex"
                  />
                }
              >
                {dictionary.more.label}
                <ChevronDownIcon aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                dir={dir}
                align="end"
                sideOffset={8}
                className="w-56 rounded-2xl p-2"
              >
                {dictionary.more.links.map((link) => (
                  <DropdownMenuItem
                    key={link.href + link.label}
                    className="h-11 rounded-xl px-3 font-medium"
                    render={<a href={link.href} />}
                  >
                    {link.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <HeaderMobileNav dictionary={dictionary} lang={lang} />
        </div>
      </div>
    </header>
  )
}
