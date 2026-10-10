import { cn } from "@/lib/utils"
import { FooterNewsletter } from "@/registry/bases/base/blocks/footer-05/components/footer-05-newsletter"

export type FooterDictionary = {
  newsletter: {
    title: string
    description?: string
    emailLabel: string
    emailPlaceholder: string
    subscribe: string
  }
  navLabel: string
  sections: { title: string; links: { label: string; href: string }[] }[]
  brand: { name: string; href: string }
  copyright: string
  legalLabel: string
  legal: { label: string; href: string }[]
}

export function Footer({
  dictionary,
  lang,
  className,
}: {
  dictionary: FooterDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <footer dir={dir} className={cn("w-full bg-muted py-8", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 pb-3 sm:px-6 lg:px-8">
        {/* Newsletter + link columns */}
        <div className="mb-16 flex flex-col gap-12 lg:flex-row lg:gap-0">
          <div className="flex w-full justify-center lg:w-1/4 lg:justify-start">
            <FooterNewsletter newsletter={dictionary.newsletter} />
          </div>

          <nav aria-label={dictionary.navLabel} className="w-full lg:ps-20">
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 text-center md:grid-cols-4 md:gap-8 lg:flex lg:items-start lg:gap-20 lg:text-start">
              {dictionary.sections.map((section) => (
                <div key={section.title} className="w-full lg:flex-1">
                  <h2 className="mb-4 text-sm font-medium tracking-wide uppercase">
                    {section.title}
                  </h2>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="rounded-sm text-xs text-foreground/70 transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 lg:text-sm"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Brand + legal line */}
        <div className="border-t border-foreground/15 pt-8">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-10">
            <a
              href={dictionary.brand.href}
              className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-8">
                <path
                  d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-2xl font-bold">{dictionary.brand.name}</span>
            </a>
            <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-xs text-foreground/70 lg:justify-start">
              <span>{dictionary.copyright}</span>
              <nav aria-label={dictionary.legalLabel} className="contents">
                {dictionary.legal.map((link) => (
                  <span key={link.label} className="contents">
                    <span aria-hidden="true" className="hidden sm:inline">
                      •
                    </span>
                    <a
                      href={link.href}
                      className="rounded-sm transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {link.label}
                    </a>
                  </span>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
