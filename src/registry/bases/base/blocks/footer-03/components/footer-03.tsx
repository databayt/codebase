import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type FooterDictionary = {
  cta: {
    /** First line, set light. */
    lineLight: string
    /** Second line, set black. */
    lineBold: string
    button: { label: string; href: string }
  }
  brand: { name: string; href: string }
  navLabel: string
  links: { label: string; href: string }[]
  /** e.g. "© 2026 Acme, Inc. All rights reserved." */
  copyright: string
  /** Extra notes after the copyright, joined with a dot. */
  notes: string[]
}

/**
 * A tall soft card — a light line over a black line and one pill — then a
 * quiet bar with the wordmark, a few links and the legal line.
 */
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
  const { cta } = dictionary

  return (
    <footer
      dir={dir}
      className={cn(
        "flex min-h-[64vh] w-full flex-col items-center gap-6 bg-background px-3 pt-4 pb-6 sm:min-h-[76vh] sm:px-6 sm:pt-9 sm:pb-0 xl:px-15",
        className
      )}
    >
      <section
        aria-labelledby="footer-cta-title"
        className="flex min-h-90 w-full max-w-360 flex-[1_0_auto] flex-col items-center justify-center gap-9 rounded-[2rem] bg-muted px-6 py-12 text-center text-foreground sm:min-h-105 sm:rounded-[3.5rem]"
      >
        <h2
          id="footer-cta-title"
          className="flex flex-col text-4xl leading-normal text-balance sm:text-[2.75rem] md:text-[3.25rem]"
        >
          <span className="font-light">{cta.lineLight}</span>
          <span className="font-black">{cta.lineBold}</span>
        </h2>
        <a
          href={cta.button.href}
          className="inline-flex h-11 items-center gap-2.5 rounded-full bg-foreground px-7 text-base font-medium text-background transition-colors outline-none hover:bg-foreground/85 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {cta.button.label}
          <ArrowRightIcon aria-hidden="true" className="size-4 rtl:rotate-180" />
        </a>
      </section>

      <div className="flex w-full max-w-330 flex-col items-center gap-4 px-2 pt-4 text-center sm:items-stretch sm:px-6 sm:pb-6 sm:text-start">
        <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:gap-5">
          <a
            href={dictionary.brand.href}
            className="shrink-0 rounded-full text-2xl leading-none font-black tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {dictionary.brand.name}
          </a>
          <nav
            aria-label={dictionary.navLabel}
            className="flex flex-1 flex-wrap justify-center gap-x-6 gap-y-2 text-sm tracking-tight text-muted-foreground sm:justify-end"
          >
            {dictionary.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-sm transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <p className="self-center text-center text-[13px] leading-normal text-muted-foreground">
          {[dictionary.copyright, ...dictionary.notes].join(" · ")}
        </p>
      </div>
    </footer>
  )
}
