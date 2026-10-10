import { Fragment } from "react"
import { ArrowDown } from "lucide-react"

import { cn } from "@/lib/utils"

export type HeroDictionary = {
  kicker: string
  /** The full headline, read by assistive tech (the visible words are presentational). */
  title: string
  /**
   * The headline split into word groups that wrap as units. `break` ends the
   * first of two equal lines on wide screens.
   */
  words: { text: string; break?: boolean }[]
  /** The closing group, set on a highlight band. */
  mark: string
  cta: { label: string; href: string }
}

/**
 * Full-bleed editorial hero: a solid primary field, a small kicker, an
 * oversized headline built from word groups with the last group highlighted,
 * and a single pill that points down the page.
 */
export function Hero({
  dictionary,
  lang,
  className,
}: {
  dictionary: HeroDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"
  const appear =
    "animate-in fade-in fill-mode-both duration-1200 ease-[cubic-bezier(0.45,0.4,0.17,0.82)] motion-reduce:animate-none"

  return (
    <section
      dir={dir}
      aria-labelledby="hero-06-title"
      className={cn(
        "relative isolate flex h-[88svh] w-full flex-col items-center justify-between overflow-hidden bg-primary px-5 pt-4 pb-9 text-primary-foreground",
        "min-[600px]:h-svh min-[600px]:px-10 min-[600px]:pt-9 min-[600px]:pb-10",
        "min-[810px]:pt-20",
        "min-[1200px]:px-[60px] min-[1200px]:pt-[132px] min-[1200px]:pb-[60px]",
        className
      )}
    >
      <style href="hero-06-keyframes" precedence="default">
        {"@keyframes hero-06-nudge{50%{transform:translateY(3px)}}"}
      </style>

      <div
        className={cn(
          "flex w-full max-w-[1320px] min-w-[240px] flex-[1_0_0px] flex-col items-start justify-center gap-4",
          "min-[600px]:gap-6 min-[1200px]:flex-none min-[1200px]:justify-start",
          appear,
          "slide-in-from-bottom-24"
        )}
      >
        <p
          className={cn(
            "w-full text-xl leading-normal min-[600px]:text-2xl",
            appear,
            "slide-in-from-bottom-12"
          )}
        >
          {dictionary.kicker}
        </p>

        <h1 id="hero-06-title" className="sr-only">
          {dictionary.title}
        </h1>

        <div
          aria-hidden="true"
          className={cn(
            "flex w-full max-w-[432px] flex-row flex-wrap items-center justify-start gap-x-3 gap-y-2.5 text-[48px] leading-[1.4] font-black tracking-tight",
            "min-[600px]:max-w-[840px] min-[600px]:gap-x-[17px] min-[600px]:text-[80px]",
            "min-[1200px]:max-w-none min-[1200px]:gap-y-0"
          )}
        >
          {dictionary.words.map((word, index) => (
            <Fragment key={`${word.text}-${index}`}>
              <span className="block whitespace-nowrap">{word.text}</span>
              {word.break ? (
                <span className="hidden min-[1200px]:block min-[1200px]:h-2.5 min-[1200px]:basis-full" />
              ) : null}
            </Fragment>
          ))}
          <span className="relative flex items-center">
            <span
              className={cn(
                "absolute inset-x-0 top-[0.31em] bottom-[0.27em] bg-primary-foreground/20",
                appear,
                "slide-in-from-bottom-24"
              )}
            />
            <span className="relative block whitespace-nowrap">
              {dictionary.mark}
            </span>
          </span>
        </div>
      </div>

      <div
        className={cn(
          "flex w-full max-w-[1320px] flex-col items-start",
          appear,
          "slide-in-from-bottom-24"
        )}
      >
        <a
          href={dictionary.cta.href}
          className="inline-flex h-10 items-center justify-center gap-2.5 rounded-full bg-primary-foreground px-4 text-base text-primary transition-colors outline-none hover:bg-primary-foreground/85 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-foreground"
        >
          <span>{dictionary.cta.label}</span>
          <ArrowDown
            aria-hidden="true"
            className="size-5 motion-safe:animate-[hero-06-nudge_1.2s_ease-in-out_infinite]"
          />
        </a>
      </div>
    </section>
  )
}
