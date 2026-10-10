"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

export type HeroSlide = {
  id: string
  title: string
  body: string
  cta: { label: string; href: string }
  alt: string
  /** Art-directed crops: landscape from 640px up, portrait below. */
  image: { landscape: string; portrait: string }
  /** Optional ambient, muted, looping background video. */
  video?: string
  /** Autoplay dwell time before advancing, in ms (default 6000). */
  delay?: number
}

export type HeroDictionary = {
  labels: {
    carousel: string
    pagination: string
    goToSlide: string
    play: string
    pause: string
    previous: string
    next: string
  }
  slides: HeroSlide[]
}

const DEFAULT_DELAY = 6000
const RING_RADIUS = 22
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return reduced
}

/**
 * Full-bleed campaign carousel: art-directed slides with oversized uppercase
 * headlines, a seamless forward loop, dot pagination, and a play/pause control
 * whose ring fills over each slide's dwell time. Mirrors for RTL.
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
  const rtl = dir === "rtl"
  const { slides, labels } = dictionary
  const n = slides.length

  // `index` runs 0..n, where n is a clone of the first slide used for a
  // seamless forward loop. `active` collapses the clone back to a real index.
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [paused, setPaused] = useState(false)
  const reduced = usePrefersReducedMotion()
  const active = n > 0 ? index % n : 0
  const delay = slides[active]?.delay ?? DEFAULT_DELAY
  const resumeRef = useRef<number | null>(null)
  const wrapRef = useRef<number | null>(null)

  const items = useMemo(
    () => (n > 1 ? [...slides, slides[0]] : slides),
    [slides, n]
  )

  // Autoplay
  useEffect(() => {
    if (paused || reduced || n <= 1) return
    const timer = setTimeout(() => setIndex((i) => i + 1), delay)
    return () => clearTimeout(timer)
  }, [index, paused, reduced, n, delay])

  // After the clone slides in, jump back to the real first slide without animating.
  const handleTransitionEnd = () => {
    if (index === n) {
      setAnimate(false)
      setIndex(0)
    }
  }

  // Re-enable the transition two frames after an instant jump.
  useEffect(() => {
    if (animate) return
    resumeRef.current = requestAnimationFrame(() => {
      resumeRef.current = requestAnimationFrame(() => setAnimate(true))
    })
    return () => {
      if (resumeRef.current) cancelAnimationFrame(resumeRef.current)
    }
  }, [animate])

  useEffect(
    () => () => {
      if (wrapRef.current) cancelAnimationFrame(wrapRef.current)
    },
    []
  )

  const goNext = useCallback(() => setIndex((i) => Math.min(i + 1, n)), [n])

  const goPrev = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1)
      return
    }
    // Wrap from the first slide: jump to the clone, then animate to the last.
    setAnimate(false)
    setIndex(n)
    wrapRef.current = requestAnimationFrame(() => {
      wrapRef.current = requestAnimationFrame(() => {
        setAnimate(true)
        setIndex(n - 1)
      })
    })
  }, [index, n])

  if (n === 0) return null

  return (
    <section
      dir={dir}
      aria-roledescription="carousel"
      aria-label={labels.carousel}
      className={cn("relative w-full overflow-hidden bg-muted", className)}
    >
      <style href="hero-08-keyframes" precedence="default">
        {`@keyframes hero-08-progress{from{stroke-dashoffset:${RING_CIRCUMFERENCE}}to{stroke-dashoffset:0}}`}
      </style>

      {/* Slide track. It follows the reading direction: in RTL the slides are
          laid out right-to-left and the track moves the other way. */}
      <div
        className="flex aspect-[4/5] w-full sm:aspect-video xl:aspect-[1512/735]"
        style={{
          transform: `translateX(${rtl ? "" : "-"}${index * 100}%)`,
          transition:
            animate && !reduced
              ? "transform 1000ms ease-in-out"
              : animate
                ? "transform 1ms linear"
                : "none",
        }}
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget) handleTransitionEnd()
        }}
      >
        {items.map((slide, i) => {
          const current = i === index
          return (
            <div
              key={`${slide.id}-${i}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${(i % n) + 1} / ${n}`}
              aria-hidden={!current}
              inert={!current}
              className="relative h-full w-full shrink-0"
            >
              {slide.video ? (
                <video
                  className="absolute inset-0 size-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={slide.image.landscape}
                  aria-hidden="true"
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
              ) : (
                <picture>
                  <source
                    media="(min-width: 640px)"
                    srcSet={slide.image.landscape}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image.portrait}
                    alt={slide.alt}
                    className="absolute inset-0 size-full object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "auto"}
                  />
                </picture>
              )}

              {/* Legibility scrim; clicks fall through to the card link. */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-transparent" />

              {/* Whole-slide click target. Decorative for assistive tech:
                  keyboard and screen-reader users get the CTA below. */}
              <a
                href={slide.cta.href}
                aria-hidden="true"
                tabIndex={-1}
                className="absolute inset-0 z-10"
              />

              <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-6 pb-20 sm:p-10 sm:pb-20 lg:p-16">
                <div className="me-auto max-w-2xl text-start">
                  <h2
                    className={cn(
                      "text-[clamp(2.25rem,1.1rem+4.5vw,4.75rem)] font-semibold text-white uppercase",
                      rtl ? "leading-[1.15]" : "leading-[0.9]"
                    )}
                  >
                    {slide.title}
                  </h2>
                  <p className="mt-2 max-w-md text-base text-white sm:text-xl">
                    {slide.body}
                  </p>
                  <div className="mt-6">
                    <a
                      href={slide.cta.href}
                      className="pointer-events-auto inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-colors outline-none hover:bg-white/85 focus-visible:ring-3 focus-visible:ring-white/60"
                    >
                      {slide.cta.label}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {n > 1 ? (
        <>
          {/* Pagination dots */}
          <div
            role="group"
            aria-label={labels.pagination}
            className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center"
          >
            <div className="pointer-events-auto flex items-center drop-shadow">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`${labels.goToSlide} ${i + 1}`}
                  aria-current={i === active}
                  onClick={() => setIndex(i)}
                  className="group/dot flex size-5 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span
                    className={cn(
                      "size-[5px] rounded-full bg-white transition-opacity",
                      i === active
                        ? "opacity-100"
                        : "opacity-50 group-hover/dot:opacity-80"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Controls: play/pause with an autoplay progress ring, then
              prev/next. Arrow glyphs mirror in RTL. */}
          <div className="absolute end-6 bottom-6 z-20 flex items-center gap-4">
            <button
              type="button"
              aria-label={paused ? labels.play : labels.pause}
              aria-pressed={paused}
              onClick={() => setPaused((p) => !p)}
              className="relative flex size-9 items-center justify-center rounded-full text-white drop-shadow outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {!reduced && (
                <svg
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  className="absolute inset-0 size-full -rotate-90"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity={0.3}
                    strokeWidth={4}
                  />
                  <circle
                    key={index}
                    cx="24"
                    cy="24"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={4}
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: RING_CIRCUMFERENCE,
                      strokeDashoffset: RING_CIRCUMFERENCE,
                      animation: `hero-08-progress ${delay}ms linear forwards`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                </svg>
              )}
              {paused ? (
                <svg
                  viewBox="0 0 24 24"
                  width={16}
                  height={16}
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width={16}
                  height={16}
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <rect x="7" y="5" width="3.2" height="14" rx="1" />
                  <rect x="13.8" y="5" width="3.2" height="14" rx="1" />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={labels.previous}
                onClick={goPrev}
                className="flex size-9 items-center justify-center rounded-full bg-white text-black transition-colors outline-none hover:bg-white/85 focus-visible:ring-3 focus-visible:ring-white/60"
              >
                <svg
                  viewBox="0 0 24 24"
                  width={20}
                  height={20}
                  fill="none"
                  aria-hidden="true"
                  className="rtl:-scale-x-100"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth={1.5}
                    d="M15.525 18.966 8.558 12l6.967-6.967"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label={labels.next}
                onClick={goNext}
                className="flex size-9 items-center justify-center rounded-full bg-white text-black transition-colors outline-none hover:bg-white/85 focus-visible:ring-3 focus-visible:ring-white/60"
              >
                <svg
                  viewBox="0 0 24 24"
                  width={20}
                  height={20}
                  fill="none"
                  aria-hidden="true"
                  className="rtl:-scale-x-100"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth={1.5}
                    d="M8.474 18.966 15.44 12 8.474 5.033"
                  />
                </svg>
              </button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  )
}
