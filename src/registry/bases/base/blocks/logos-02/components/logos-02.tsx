"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type LogosDictionary = {
  eyebrow: string
  title: string
  previous: string
  next: string
  /** Accessible label for each logo button; `{company}` is replaced. */
  showPartner: string
  partners: {
    company: string
    logo: string
    name: string
    role: string
    quote: string
    image: string
    tag: string
  }[]
}

const AUTOPLAY_DELAY = 5000

export function Logos({
  dictionary,
  lang,
  className,
}: {
  dictionary: LogosDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"
  const reduceMotion = useReducedMotion()
  const [viewportRef, api] = useEmblaCarousel({
    loop: true,
    align: "start",
    direction: dir,
  })
  const [selected, setSelected] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const [stopped, setStopped] = React.useState(false)

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    const onPointerDown = () => setStopped(true)
    onSelect()
    api.on("select", onSelect).on("reInit", onSelect)
    api.on("pointerDown", onPointerDown)
    return () => {
      api.off("select", onSelect).off("reInit", onSelect)
      api.off("pointerDown", onPointerDown)
    }
  }, [api])

  // Small autoplay: advance every few seconds, pause while hovered or
  // focused, stop for good once the visitor drags or picks a partner.
  React.useEffect(() => {
    if (!api || paused || stopped || reduceMotion) return
    const id = window.setInterval(() => api.scrollNext(), AUTOPLAY_DELAY)
    return () => window.clearInterval(id)
  }, [api, paused, stopped, reduceMotion])

  const goTo = (index: number) => {
    setStopped(true)
    api?.scrollTo(index)
  }

  return (
    <section
      dir={dir}
      aria-labelledby="logos-02-title"
      className={cn("bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
              {dictionary.eyebrow}
            </p>
            <h2
              id="logos-02-title"
              className="mt-3 text-3xl font-bold tracking-tight text-balance md:text-4xl"
            >
              {dictionary.title}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full"
              aria-label={dictionary.previous}
              onClick={() => {
                setStopped(true)
                api?.scrollPrev()
              }}
            >
              <ArrowLeft className="rtl:rotate-180" />
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full"
              aria-label={dictionary.next}
              onClick={() => {
                setStopped(true)
                api?.scrollNext()
              }}
            >
              <ArrowRight className="rtl:rotate-180" />
            </Button>
          </div>
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={dictionary.title}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div ref={viewportRef} className="overflow-hidden">
            <div className="-ms-4 flex touch-pan-y">
              {dictionary.partners.map((partner, index) => (
                <div
                  key={partner.company}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} / ${dictionary.partners.length}`}
                  className="min-w-0 shrink-0 grow-0 basis-full ps-4"
                >
                  <figure className="grid h-full gap-6 rounded-3xl border bg-card p-4 text-card-foreground md:grid-cols-[2fr_3fr] md:gap-10 md:p-6">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted md:aspect-auto md:min-h-[26rem]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={partner.image}
                        alt={partner.name}
                        loading="lazy"
                        className="absolute inset-0 size-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-6 md:py-4 md:pe-4">
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={partner.logo}
                          alt=""
                          width={24}
                          height={24}
                          className="size-6 dark:invert"
                        />
                        <span className="text-lg font-semibold tracking-tight">
                          {partner.company}
                        </span>
                      </div>
                      <blockquote className="flex-1 space-y-4 text-base leading-relaxed text-pretty md:text-lg">
                        {partner.quote.split("\n\n").map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </blockquote>
                      <figcaption className="flex flex-wrap items-end justify-between gap-4 border-t pt-6">
                        <div>
                          <p className="font-semibold">{partner.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {partner.role}
                          </p>
                        </div>
                        <Badge variant="secondary">{partner.tag}</Badge>
                      </figcaption>
                    </div>
                  </figure>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {dictionary.partners.map((partner, index) => {
              const active = index === selected
              return (
                <button
                  key={partner.company}
                  type="button"
                  aria-label={dictionary.showPartner.replace(
                    "{company}",
                    partner.company
                  )}
                  aria-current={active ? "true" : undefined}
                  onClick={() => goTo(index)}
                  className={cn(
                    "group relative flex items-center justify-center gap-2 rounded-xl px-4 py-5 transition-[opacity,background-color] outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                    active ? "opacity-100" : "opacity-50 hover:opacity-80"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partner.logo}
                    alt=""
                    width={20}
                    height={20}
                    className="size-5 dark:invert"
                  />
                  <span className="font-semibold tracking-tight">
                    {partner.company}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-foreground transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
