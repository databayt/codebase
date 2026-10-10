"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

import { cn } from "@/lib/utils"

export type HowItWorksDictionary = {
  eyebrow: string
  title: string
  /** Use-case cards that drift past in the marquee (8–12 reads best). */
  items: {
    title: string
    description: string
    image: string
  }[]
  stats: {
    value: string
    label: string
  }[]
}

type Item = HowItWorksDictionary["items"][number]

const COLUMNS = 4
const PER_COLUMN = 4
// How far (as a share of its own height) each desktop column travels while the
// marquee crosses the viewport. Odd columns drift up, even columns drift down.
const TRAVEL = 48

function MarqueeCard({
  item,
  hidden,
  className,
}: {
  item: Item
  hidden?: boolean
  className?: string
}) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className={cn("flex flex-col gap-4 rounded-3xl bg-muted p-5", className)}
    >
      <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image}
        alt=""
        loading="lazy"
        className="aspect-[4/3] w-full rounded-2xl object-cover"
      />
      <p className="text-sm text-balance text-muted-foreground">
        {item.description}
      </p>
    </div>
  )
}

function ParallaxColumn({
  items,
  offset,
  up,
  progress,
  reduce,
}: {
  items: Item[]
  offset: number
  up: boolean
  progress: MotionValue<number>
  reduce: boolean
}) {
  const y = useTransform(
    progress,
    [0, 1],
    up ? ["0%", `-${TRAVEL}%`] : ["0%", `${TRAVEL}%`]
  )

  return (
    <div className="relative h-full">
      <motion.div
        style={reduce ? undefined : { y }}
        className={cn(
          "absolute inset-x-0 flex flex-col gap-6 will-change-transform",
          up ? "top-0" : "bottom-0"
        )}
      >
        {Array.from({ length: PER_COLUMN }, (_, j) => {
          const slot = offset + j
          return (
            <MarqueeCard
              key={slot}
              item={items[slot % items.length]}
              // Repeats fill the columns visually; screen readers hear each card once.
              hidden={slot >= items.length}
            />
          )
        })}
      </motion.div>
    </div>
  )
}

function LoopColumn({
  items,
  reverse,
  reduce,
}: {
  items: Item[]
  reverse?: boolean
  reduce: boolean
}) {
  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        className={cn(
          "absolute inset-x-0 flex flex-col",
          reverse ? "bottom-0" : "top-0"
        )}
        animate={
          reduce ? undefined : { y: reverse ? ["0%", "50%"] : ["0%", "-50%"] }
        }
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {/* Two identical copies: shifting by half the height loops seamlessly. */}
        {[0, 1].map((copy) =>
          items.map((item, i) => (
            <div key={`${copy}-${i}`} className="pb-4 sm:pb-6">
              <MarqueeCard item={item} hidden={copy === 1} />
            </div>
          ))
        )}
      </motion.div>
    </div>
  )
}

export function HowItWorks({
  dictionary,
  lang,
  className,
}: {
  dictionary: HowItWorksDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"
  const reduce = useReducedMotion() ?? false
  const { items, stats } = dictionary

  const marqueeRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: marqueeRef,
    offset: ["start end", "end start"],
  })
  // A light spring stands in for GSAP's `scrub: 1` catch-up.
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  const half = Math.ceil(items.length / 2)
  const reveal = (index: number) => ({
    initial: reduce ? false : { opacity: 0, y: 48 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <section
      dir={dir}
      aria-labelledby="how-it-works-title"
      className={cn("overflow-hidden bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            {...reveal(0)}
            className="text-sm font-medium tracking-wide text-muted-foreground uppercase"
          >
            {dictionary.eyebrow}
          </motion.p>
          <motion.h2
            {...reveal(1)}
            id="how-it-works-title"
            className="mt-3 font-heading text-4xl font-bold tracking-tight text-balance md:text-6xl"
          >
            {dictionary.title}
          </motion.h2>
        </div>

        <div className="relative mt-12 md:mt-16">
          {/* Desktop: four columns that part ways as you scroll. */}
          <div
            ref={marqueeRef}
            className="hidden h-[44rem] grid-cols-4 gap-6 overflow-hidden lg:grid"
          >
            {Array.from({ length: COLUMNS }, (_, c) => (
              <ParallaxColumn
                key={c}
                items={items}
                offset={c * PER_COLUMN}
                up={c % 2 === 0}
                progress={progress}
                reduce={reduce}
              />
            ))}
          </div>

          {/* Mobile + tablet: two tracks looping in opposite directions. */}
          <div className="grid h-[36rem] grid-cols-2 gap-4 overflow-hidden sm:h-[40rem] sm:gap-6 lg:hidden">
            <LoopColumn items={items.slice(0, half)} reduce={reduce} />
            <LoopColumn items={items.slice(half)} reverse reduce={reduce} />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-background to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background to-transparent"
          />
        </div>

        <ul className="mt-12 grid gap-10 border-t pt-12 text-center sm:grid-cols-3 md:mt-16">
          {stats.map((stat, index) => (
            <motion.li key={stat.label} {...reveal(index)}>
              <p className="font-heading text-4xl font-bold tracking-tight tabular-nums md:text-5xl">
                {stat.value}
              </p>
              <p className="mx-auto mt-2 max-w-[14rem] text-lg text-balance text-muted-foreground">
                {stat.label}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
