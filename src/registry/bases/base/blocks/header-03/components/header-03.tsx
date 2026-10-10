import { LanguagesIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { HeaderMobileNav } from "@/registry/bases/base/blocks/header-03/components/header-03-mobile-nav"
import { HeaderModeSwitcher } from "@/registry/bases/base/blocks/header-03/components/header-03-mode-switcher"

export type HeaderLink = {
  label: string
  href: string
  /** Marks the link for the page being viewed (aria-current). */
  current?: boolean
}

export type HeaderDictionary = {
  brand: { name: string; href: string }
  navLabel: string
  links: HeaderLink[]
  /** The other locale — rendered as a single icon link. */
  language: {
    /** Accessible verb, e.g. "Switch language". */
    label: string
    /** Target language in its own script, e.g. "العربية". */
    name: string
    href: string
    lang: string
  }
  theme: { label: string }
  action: { label: string; href: string }
  menu: { label: string; open: string; close: string; home: string }
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20 12 4l8 16" />
      <path d="M7.5 13h9" />
    </svg>
  )
}

export function LanguageLink({
  language,
  className,
}: {
  language: HeaderDictionary["language"]
  className?: string
}) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={className}
      nativeButton={false}
      render={
        <a href={language.href} hrefLang={language.lang} lang={language.lang} />
      }
    >
      <LanguagesIcon />
      <span className="sr-only">
        {language.label} — {language.name}
      </span>
    </Button>
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
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80",
        className
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-4 md:gap-4 lg:px-8">
        {/* Start: brand + primary links (tablet and up) */}
        <div className="me-4 hidden items-center md:flex">
          <a
            href={dictionary.brand.href}
            className="me-4 flex items-center gap-2 rounded-md text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:me-6"
          >
            <BrandMark />
            <span className="hidden font-bold lg:inline-block">
              {dictionary.brand.name}
            </span>
          </a>
          <nav
            aria-label={dictionary.navLabel}
            className="flex items-center gap-6 xl:gap-8"
          >
            {dictionary.links.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={cn(
                  "rounded-sm text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                  link.current && "text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Phone: one "Menu" control replaces the brand and links */}
        <HeaderMobileNav dictionary={dictionary} lang={lang} />

        {/* End: utilities */}
        <div className="ms-auto flex items-center gap-2 md:flex-1 md:justify-end">
          <div className="flex items-center gap-0.5">
            <LanguageLink language={dictionary.language} />
            <HeaderModeSwitcher label={dictionary.theme.label} />
            <Separator orientation="vertical" className="mx-1 h-4 self-center!" />
            <Button
              variant="ghost"
              size="sm"
              className="bg-muted px-4"
              nativeButton={false}
              render={<a href={dictionary.action.href} />}
            >
              {dictionary.action.label}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
