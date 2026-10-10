import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  socialIcons,
  type SocialIcon,
} from "@/registry/bases/base/blocks/footer-04/components/footer-04-social-icons"

export type FooterDictionary = {
  brand: { name: string; href: string }
  navLabel: string
  /** Four columns: a 2 × 2 grid on phones, one row beside the CTA on desktop. */
  columns: { title: string; links: { label: string; href: string }[] }[]
  ready: {
    title: string
    button: { label: string; href: string }
  }
  socialLabel: string
  social: { label: string; href: string; icon: SocialIcon }[]
  copyright: string
}

/**
 * An always-dark footer: the `dark` class scopes the dark tokens to this
 * element, so it stays dark (and on-theme) whatever the page's mode is.
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
  const { ready } = dictionary

  return (
    <footer
      dir={dir}
      className={cn(
        "dark flex min-h-[calc(100svh-3rem)] flex-col border-t bg-background text-foreground",
        className
      )}
    >
      <div className="flex flex-1 flex-col px-4 pt-10 md:px-20">
        <a
          href={dictionary.brand.href}
          aria-label={dictionary.brand.name}
          className="w-fit rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8">
            <rect width="32" height="32" rx="8" className="fill-foreground" />
            <path
              d="M9 22 16 9l7 13"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-background"
            />
          </svg>
        </a>

        <div className="flex flex-1 flex-col gap-12 py-10 md:flex-row md:gap-0">
          <nav
            aria-label={dictionary.navLabel}
            className="grid grid-cols-2 gap-x-8 gap-y-8 md:flex md:w-4/6 md:gap-0"
          >
            {dictionary.columns.map((column) => (
              <div key={column.title} className="md:w-1/4 md:pe-6">
                <h2 className="mb-3 font-medium">{column.title}</h2>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="rounded-sm text-foreground/80 transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="w-full md:w-2/6 md:min-w-75">
            <p className="mb-4 font-medium">{ready.title}</p>
            <a
              href={ready.button.href}
              className="group mb-6 inline-flex w-full items-center justify-center rounded-2xl bg-foreground px-6 py-3 font-semibold text-background transition-all duration-300 outline-none hover:-translate-x-1 hover:-translate-y-1 hover:rounded-3xl hover:shadow-[4px_4px_0_var(--muted-foreground)] focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-0 active:rounded-2xl active:shadow-none sm:w-auto md:py-2 rtl:hover:translate-x-1 rtl:hover:shadow-[-4px_4px_0_var(--muted-foreground)]"
            >
              {/* The arrow trades places with the label on hover */}
              <span className="order-1 transition-all duration-300 group-hover:order-2">
                {ready.button.label}
              </span>
              <ArrowRightIcon
                aria-hidden="true"
                className="order-2 ms-2 size-4 transition-all duration-300 group-hover:order-1 group-hover:ms-0 group-hover:me-2 rtl:rotate-180"
              />
            </a>
            <ul
              aria-label={dictionary.socialLabel}
              className="flex flex-wrap items-center gap-4"
            >
              {dictionary.social.map((item) => {
                const Icon = socialIcons[item.icon]
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      aria-label={item.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-md text-foreground transition-transform outline-none hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <Icon className="size-10 md:size-8" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-6 md:px-20">
        <p className="text-sm text-muted-foreground">{dictionary.copyright}</p>
      </div>
    </footer>
  )
}
