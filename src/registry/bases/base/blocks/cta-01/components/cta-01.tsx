import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * The pill: the section's action shape. 44px+ tall at `md` so it is a
 * comfortable touch target. Works on <a> or <button>.
 */
export const ctaVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap outline-none select-none transition-[background-color,color,box-shadow,transform] focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.15em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        ink: "bg-foreground text-background hover:bg-foreground/85",
        brand: "bg-primary text-primary-foreground hover:bg-primary/85",
        soft: "bg-secondary text-secondary-foreground hover:bg-secondary/75",
        paper: "bg-background text-foreground hover:bg-background/85",
        outline:
          "border border-foreground/15 bg-transparent text-foreground hover:bg-foreground/5",
        ghost: "text-foreground hover:bg-foreground/5",
        // For dark or colored panels: borrows the panel's text color.
        inverse:
          "border border-current/25 bg-transparent text-current hover:bg-current/10",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-13 px-7 text-base",
      },
    },
    defaultVariants: { variant: "ink", size: "md" },
  }
)

export const ctaPanelVariants = cva(
  "grid gap-10 rounded-3xl p-8 md:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16 lg:p-16",
  {
    variants: {
      tone: {
        soft: "bg-muted text-foreground",
        night: "bg-foreground text-background",
        brand: "bg-primary text-primary-foreground",
      },
    },
    defaultVariants: { tone: "night" },
  }
)

type Tone = NonNullable<VariantProps<typeof ctaPanelVariants>["tone"]>

const toneParts: Record<
  Tone,
  {
    eyebrow: string
    body: string
    primary: VariantProps<typeof ctaVariants>["variant"]
    secondary: VariantProps<typeof ctaVariants>["variant"]
  }
> = {
  soft: {
    eyebrow: "text-primary",
    body: "text-muted-foreground",
    primary: "ink",
    secondary: "outline",
  },
  night: {
    eyebrow: "text-background/65",
    body: "text-background/75",
    primary: "paper",
    secondary: "inverse",
  },
  brand: {
    eyebrow: "text-primary-foreground/75",
    body: "text-primary-foreground/80",
    primary: "paper",
    secondary: "inverse",
  },
}

export type CtaDictionary = {
  eyebrow?: string
  title: string
  description: string
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
  note?: string
}

export function Cta({
  dictionary,
  lang,
  tone = "night",
  className,
}: {
  dictionary: CtaDictionary
  lang: "en" | "ar"
  tone?: Tone
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"
  const parts = toneParts[tone]

  return (
    <section dir={dir} className={cn("bg-background py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-6">
        <div className={ctaPanelVariants({ tone })}>
          <div className="flex flex-col gap-5">
            {dictionary.eyebrow && (
              <p
                className={cn(
                  "text-sm font-medium tracking-wide uppercase",
                  parts.eyebrow
                )}
              >
                {dictionary.eyebrow}
              </p>
            )}
            <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl lg:text-5xl">
              {dictionary.title}
            </h2>
            <p
              className={cn(
                "max-w-xl text-base leading-relaxed text-pretty md:text-lg",
                parts.body
              )}
            >
              {dictionary.description}
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a
                href={dictionary.primary.href}
                className={ctaVariants({ variant: parts.primary, size: "lg" })}
              >
                {dictionary.primary.label}
                <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
              </a>
              {dictionary.secondary && (
                <a
                  href={dictionary.secondary.href}
                  className={ctaVariants({
                    variant: parts.secondary,
                    size: "lg",
                  })}
                >
                  {dictionary.secondary.label}
                </a>
              )}
            </div>
            {dictionary.note && (
              <p className={cn("text-sm", parts.body)}>{dictionary.note}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
