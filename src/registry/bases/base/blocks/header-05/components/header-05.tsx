import { ChevronDownIcon, HeartIcon, ShoppingBagIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { HeaderMobileMenu } from "@/registry/bases/base/blocks/header-05/components/header-05-mobile-menu"
import { HeaderSearch } from "@/registry/bases/base/blocks/header-05/components/header-05-search"

export type HeaderLink = { label: string; href: string }

export type HeaderColumn = {
  title: string
  href: string
  links: HeaderLink[]
}

export type HeaderNavItem = {
  label: string
  href: string
  /** Present → the item opens a full-width mega menu. */
  columns?: HeaderColumn[]
}

export type HeaderDictionary = {
  brand: { name: string; href: string; homeLabel: string }
  topBar: {
    brandsLabel: string
    /** Sister brands on the start side of the utility bar. */
    brands: HeaderLink[]
    userLabel: string
    /** Utility links; one may carry a small hover/focus dropdown. */
    links: (HeaderLink & { menu?: HeaderLink[]; menuLabel?: string })[]
    language: { label: string; name: string; href: string; lang: string }
  }
  nav: { label: string; items: HeaderNavItem[] }
  search: {
    label: string
    placeholder: string
    cancel: string
    clear: string
    popularLabel: string
    popular: string[]
  }
  favorites: { label: string; href: string }
  bag: { label: string; href: string; count: number }
  menu: { open: string; close: string; title: string }
}

export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 24"
      aria-hidden="true"
      className={cn("h-6 w-16", className)}
      fill="currentColor"
    >
      {/* Abstract wordmark: a slanted bar + three rounded strokes */}
      <path d="M2 20 12 4h6L8 20Z" />
      <rect x="22" y="9" width="12" height="6" rx="3" />
      <rect x="37" y="9" width="12" height="6" rx="3" />
      <rect x="52" y="9" width="10" height="6" rx="3" />
    </svg>
  )
}

function TopBar({
  topBar,
}: {
  topBar: HeaderDictionary["topBar"]
}) {
  return (
    <div className="hidden bg-muted lg:block">
      <div className="flex h-9 items-center justify-between px-12">
        <nav aria-label={topBar.brandsLabel}>
          <ul className="flex items-center gap-x-4 text-xs font-semibold tracking-wide">
            {topBar.brands.map((brand) => (
              <li key={brand.label}>
                <a
                  href={brand.href}
                  className="rounded-sm text-foreground transition-colors hover:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {brand.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={topBar.userLabel}>
          <ul className="flex items-center gap-x-3 text-xs font-medium text-foreground">
            {topBar.links.map((link) => (
              <li key={link.label} className="flex items-center gap-x-3">
                {link.menu ? (
                  <div className="group relative flex items-center gap-x-0.5">
                    <a href={link.href} className="hover:text-muted-foreground">
                      {link.label}
                    </a>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-3.5 transition-transform group-focus-within:rotate-180 group-hover:rotate-180"
                    />
                    {/* Opens on hover or keyboard focus — no client JS */}
                    <div className="invisible absolute end-0 top-full z-50 w-56 translate-y-1 rounded-md bg-popover py-2 text-popover-foreground opacity-0 shadow-lg ring-1 ring-foreground/10 transition-[opacity,transform,visibility] duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="px-4 pb-1 text-sm font-medium text-muted-foreground">
                        {link.menuLabel ?? link.label}
                      </p>
                      <ul>
                        {link.menu.map((item) => (
                          <li key={item.label}>
                            <a
                              href={item.href}
                              className="block px-4 py-1.5 text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <a href={link.href} className="hover:text-muted-foreground">
                    {link.label}
                  </a>
                )}
                <span aria-hidden="true" className="h-3.5 w-px bg-border" />
              </li>
            ))}
            <li>
              <a
                href={topBar.language.href}
                hrefLang={topBar.language.lang}
                lang={topBar.language.lang}
                aria-label={`${topBar.language.label}: ${topBar.language.name}`}
                className="hover:text-muted-foreground"
              >
                {topBar.language.name}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

function DesktopNav({ nav }: { nav: HeaderDictionary["nav"] }) {
  return (
    <nav aria-label={nav.label} className="hidden h-full lg:block">
      <ul className="flex h-full items-center gap-x-6">
        {nav.items.map((item) => (
          <li key={item.label} className="group flex h-full items-center">
            <a
              href={item.href}
              aria-haspopup={item.columns ? "true" : undefined}
              className="relative flex h-full items-center text-base font-medium text-foreground outline-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-foreground after:transition-transform after:duration-200 group-focus-within:after:scale-x-100 group-hover:after:scale-x-100 focus-visible:after:scale-x-100"
            >
              {item.label}
            </a>
            {item.columns && (
              <div className="invisible absolute inset-x-0 top-full z-40 translate-y-1 border-t bg-background opacity-0 shadow-[0_16px_24px_-12px_rgb(0_0_0/0.12)] transition-[opacity,transform,visibility] duration-200 ease-out group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="mx-auto flex max-w-[1200px] justify-center gap-x-12 gap-y-8 px-6 py-9">
                  {item.columns.map((column) => (
                    <div key={column.title} className="min-w-[140px]">
                      <a
                        href={column.href}
                        className="mb-3 block text-[15px] font-medium text-foreground hover:text-muted-foreground"
                      >
                        {column.title}
                      </a>
                      <ul className="space-y-2.5">
                        {column.links.map((link, i) => (
                          <li key={`${link.label}-${i}`}>
                            <a
                              href={link.href}
                              className="block text-[15px] leading-tight text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

const iconLink =
  "relative flex size-11 items-center justify-center rounded-full text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"

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
      className={cn("sticky top-0 z-50 bg-background", className)}
    >
      <TopBar topBar={dictionary.topBar} />

      {/* `relative` anchors the mega menus and the search tray full-width */}
      <div className="relative flex h-15 items-center justify-between px-4 lg:px-12">
        <a
          href={dictionary.brand.href}
          aria-label={dictionary.brand.homeLabel}
          className="flex items-center rounded-sm text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <BrandLogo />
        </a>

        <DesktopNav nav={dictionary.nav} />

        <div className="flex items-center gap-x-0.5">
          <HeaderSearch search={dictionary.search} />
          <a
            href={dictionary.favorites.href}
            aria-label={dictionary.favorites.label}
            className={cn(iconLink, "max-sm:hidden")}
          >
            <HeartIcon aria-hidden="true" className="size-6" strokeWidth={1.5} />
          </a>
          <a
            href={dictionary.bag.href}
            aria-label={`${dictionary.bag.label}: ${dictionary.bag.count}`}
            className={iconLink}
          >
            <ShoppingBagIcon
              aria-hidden="true"
              className="size-6"
              strokeWidth={1.5}
            />
            {dictionary.bag.count > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-2 end-2 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background"
              >
                {dictionary.bag.count}
              </span>
            )}
          </a>
          <HeaderMobileMenu dictionary={dictionary} lang={lang} />
        </div>
      </div>
    </header>
  )
}
