"use client"

import * as React from "react"
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"

export type StatsDictionary = {
  eyebrow: string
  title: string
  image: {
    src: string
    alt: string
  }
  items: {
    value: number
    prefix?: string
    suffix?: string
    label: string
  }[]
}

type Lang = "en" | "ar"

function useNumberFormat(lang: Lang, numerals: "latn" | "arab") {
  return React.useMemo(
    () =>
      new Intl.NumberFormat(lang === "ar" ? "ar" : "en-US", {
        numberingSystem: numerals,
        maximumFractionDigits: 0,
      }),
    [lang, numerals]
  )
}

function Counter({
  value,
  prefix,
  suffix,
  label,
  delay,
  format,
}: StatsDictionary["items"][number] & {
  delay: number
  format: Intl.NumberFormat
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const reduceMotion = useReducedMotion()
  const spring = useSpring(0, { stiffness: 50, damping: 20 })
  const display = useTransform(spring, (v) => format.format(Math.round(v)))

  React.useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      spring.jump(value)
      return
    }
    const timeout = window.setTimeout(() => spring.set(value), delay)
    return () => window.clearTimeout(timeout)
  }, [inView, reduceMotion, spring, value, delay])

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: delay / 1000,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="text-center"
    >
      <p className="mb-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl md:text-6xl lg:text-7xl">
        <span className="sr-only">
          {prefix}
          {format.format(value)}
          {suffix}
        </span>
        <span aria-hidden="true">
          {prefix}
          <motion.span>{display}</motion.span>
          {suffix ? (
            <span className="text-foreground/60">{suffix}</span>
          ) : null}
        </span>
      </p>
      <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
    </motion.div>
  )
}

export function Stats({
  dictionary,
  lang,
  numerals = "latn",
  className,
}: {
  dictionary: StatsDictionary
  lang: Lang
  /** "latn" renders 0-9 in both languages; "arab" renders Arabic-Indic digits (٠-٩). */
  numerals?: "latn" | "arab"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"
  const format = useNumberFormat(lang, numerals)
  const reduceMotion = useReducedMotion()
  const bannerRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"])

  return (
    <section dir={dir} className={cn("relative bg-background", className)}>
      <div
        ref={bannerRef}
        className="relative h-[60svh] max-h-[40rem] min-h-80 overflow-hidden"
      >
        <motion.img
          src={dictionary.image.src}
          alt={dictionary.image.alt}
          style={reduceMotion ? undefined : { y }}
          className="absolute inset-x-0 top-[-12%] h-[124%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-10 sm:pb-12 md:pb-16 lg:px-8">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-2 text-2xl font-black text-white sm:text-3xl md:text-4xl"
          >
            {dictionary.eyebrow}
          </motion.p>
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl font-bold text-white/80 sm:text-2xl md:text-3xl"
          >
            {dictionary.title}
          </motion.h2>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-8">
          {dictionary.items.map((item, index) => (
            <Counter
              key={item.label}
              {...item}
              delay={index * 150}
              format={format}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
