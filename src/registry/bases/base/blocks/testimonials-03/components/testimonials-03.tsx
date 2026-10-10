"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeft, ArrowRight, Star } from "lucide-react"
import { motion, useReducedMotion, type Variants } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type TestimonialsDictionary = {
  eyebrow: string
  title: string
  previous: string
  next: string
  /** Screen-reader label for the star rating; `{rating}` is replaced. */
  ratingLabel: string
  stories: {
    name: string
    role: string
    rating: number
    date: string
    dateTime: string
    quote: string
    image: string
  }[]
}

const reveal: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <div role="img" aria-label={label} className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            "size-5",
            i < rating
              ? "fill-current text-foreground"
              : "text-muted-foreground/40"
          )}
        />
      ))}
    </div>
  )
}

export function Testimonials({
  dictionary,
  lang,
  className,
}: {
  dictionary: TestimonialsDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"
  const reduceMotion = useReducedMotion()
  const [viewportRef, api] = useEmblaCarousel({
    loop: true,
    align: "center",
    direction: dir,
  })
  const [selected, setSelected] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect).on("reInit", onSelect)
    return () => {
      api.off("select", onSelect).off("reInit", onSelect)
    }
  }, [api])

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    const forward = (event.key === "ArrowRight") === (dir === "ltr")
    if (forward) api?.scrollNext()
    else api?.scrollPrev()
  }

  const motionProps = reduceMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.3 },
      }

  return (
    <section
      dir={dir}
      aria-labelledby="testimonials-03-title"
      className={cn("overflow-hidden bg-background py-16 md:py-28", className)}
    >
      <motion.div
        {...motionProps}
        variants={stagger}
        className="mx-auto max-w-3xl px-6 text-center"
      >
        <motion.p
          variants={reveal}
          className="text-sm font-medium tracking-wider text-muted-foreground uppercase"
        >
          {dictionary.eyebrow}
        </motion.p>
        <motion.h2
          variants={reveal}
          id="testimonials-03-title"
          className="mt-3 text-4xl font-bold tracking-tight text-balance md:text-6xl"
        >
          {dictionary.title}
        </motion.h2>
      </motion.div>

      <motion.div
        {...motionProps}
        variants={reveal}
        role="region"
        aria-roledescription="carousel"
        aria-label={dictionary.title}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="mt-10 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:mt-16"
      >
        <div ref={viewportRef} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {dictionary.stories.map((story, index) => {
              const active = index === selected
              return (
                <div
                  key={story.name}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} / ${dictionary.stories.length}`}
                  aria-hidden={!active}
                  className="min-w-0 shrink-0 grow-0 basis-[88%] px-2 sm:basis-[80%] lg:basis-[56rem]"
                >
                  <figure
                    className={cn(
                      "grid h-full gap-6 rounded-3xl bg-muted p-5 transition-[scale,opacity] duration-500 ease-out sm:p-8 md:grid-cols-[1fr_auto] md:gap-10 md:p-10",
                      active ? "scale-100 opacity-100" : "scale-90 opacity-60"
                    )}
                  >
                    <div className="flex flex-col justify-between gap-8">
                      <figcaption>
                        <p className="text-xl font-medium">{story.name}</p>
                        <p className="mt-1 text-base text-muted-foreground md:text-lg">
                          {story.role}
                        </p>
                      </figcaption>
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <Stars
                            rating={story.rating}
                            label={dictionary.ratingLabel.replace(
                              "{rating}",
                              String(story.rating)
                            )}
                          />
                          <time
                            dateTime={story.dateTime}
                            className="text-sm text-muted-foreground"
                          >
                            {story.date}
                          </time>
                        </div>
                        <blockquote className="max-w-md text-lg leading-relaxed text-pretty md:text-xl">
                          <p>{story.quote}</p>
                        </blockquote>
                      </div>
                    </div>
                    <div className="relative order-first aspect-[4/3] overflow-hidden rounded-2xl bg-background md:order-none md:aspect-[4/5] md:w-72 lg:w-80">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={story.image}
                        alt={story.name}
                        loading="lazy"
                        className={cn(
                          "absolute inset-0 size-full object-cover transition-[scale] duration-700 ease-out",
                          active ? "scale-100" : "scale-110"
                        )}
                      />
                    </div>
                  </figure>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Button
            variant="outline"
            size="icon-lg"
            className="rounded-full"
            aria-label={dictionary.previous}
            onClick={() => api?.scrollPrev()}
          >
            <ArrowLeft className="rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            size="icon-lg"
            className="rounded-full"
            aria-label={dictionary.next}
            onClick={() => api?.scrollNext()}
          >
            <ArrowRight className="rtl:rotate-180" />
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
