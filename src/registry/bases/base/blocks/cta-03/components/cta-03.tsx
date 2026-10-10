"use client"

import { useEffect, useRef } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type TargetAndTransition,
  type Transition,
} from "motion/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type CtaDictionary = {
  title: string
  description: string
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
}

/** Decorative gradient art: fixed colors so the band reads the same in both themes. */
const BACKDROP = "linear-gradient(40deg, rgb(108, 0, 162), rgb(0, 17, 82))"

type Blob = {
  color: string
  origin: string
  opacity: number
  animate: TargetAndTransition
  transition: Transition
}

const BLOBS: Blob[] = [
  {
    color: "18, 113, 255",
    origin: "center center",
    opacity: 1,
    animate: { y: ["-50%", "50%", "-50%"] },
    transition: { duration: 30, ease: "easeInOut", repeat: Infinity },
  },
  {
    color: "221, 74, 255",
    origin: "calc(50% - 400px) center",
    opacity: 1,
    animate: { rotate: [360, 0] },
    transition: { duration: 20, ease: "linear", repeat: Infinity },
  },
  {
    color: "100, 220, 255",
    origin: "calc(50% + 400px) center",
    opacity: 1,
    animate: { rotate: [0, 360] },
    transition: { duration: 40, ease: "linear", repeat: Infinity },
  },
  {
    color: "200, 50, 50",
    origin: "calc(50% - 200px) center",
    opacity: 0.7,
    animate: { x: ["-50%", "50%", "-50%"], y: ["-10%", "10%", "-10%"] },
    transition: { duration: 40, ease: "easeInOut", repeat: Infinity },
  },
  {
    color: "180, 180, 50",
    origin: "calc(50% - 800px) calc(50% + 800px)",
    opacity: 1,
    animate: { rotate: [0, 360] },
    transition: { duration: 20, ease: "easeInOut", repeat: Infinity },
  },
]

const POINTER_COLOR = "140, 100, 255"

export function Cta({
  dictionary,
  lang,
  className,
}: {
  dictionary: CtaDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"
  const bandRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  // The band sits full-edge while it is in focus, then gains side insets and
  // rounded corners as it scrolls up and away. The inset is symmetric, so it
  // behaves identically in RTL.
  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ["start end", "end start"],
  })
  const insetX = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    reduceMotion ? ["0%", "0%", "0%"] : ["0%", "0%", "6%"]
  )
  const radius = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    reduceMotion ? [0, 0, 0] : [0, 0, 28]
  )
  const clipPath = useMotionTemplate`inset(0px ${insetX} round ${radius}px)`

  // A soft light that trails the pointer across the gradient.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const glowX = useSpring(pointerX, { stiffness: 60, damping: 20 })
  const glowY = useSpring(pointerY, { stiffness: 60, damping: 20 })

  useEffect(() => {
    const band = bandRef.current
    if (!band) return
    pointerX.jump(band.offsetWidth / 2)
    pointerY.jump(band.offsetHeight / 2)
  }, [pointerX, pointerY])

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set(event.clientX - rect.left)
    pointerY.set(event.clientY - rect.top)
  }

  return (
    <section dir={dir} className={cn("bg-background", className)}>
      <motion.div
        ref={bandRef}
        onPointerMove={handlePointerMove}
        style={{ clipPath, willChange: "clip-path" }}
        className="relative isolate flex min-h-[32rem] items-center justify-center overflow-hidden md:min-h-[70vh]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ background: BACKDROP }}
        >
          <div className="absolute inset-0 blur-[40px]">
            {BLOBS.map((blob, index) => (
              <motion.div
                key={index}
                className="absolute top-[10%] left-[10%] size-[80%] mix-blend-hard-light"
                style={{
                  background: `radial-gradient(circle at center, rgba(${blob.color}, 0.8) 0, rgba(${blob.color}, 0) 50%) no-repeat`,
                  transformOrigin: blob.origin,
                  opacity: blob.opacity,
                }}
                animate={reduceMotion ? undefined : blob.animate}
                transition={blob.transition}
              />
            ))}
            <motion.div
              className="absolute -top-1/2 -left-1/2 size-full opacity-70 mix-blend-hard-light"
              style={{
                x: glowX,
                y: glowY,
                background: `radial-gradient(circle at center, rgba(${POINTER_COLOR}, 0.8) 0, rgba(${POINTER_COLOR}, 0) 50%) no-repeat`,
              }}
            />
          </div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl px-6 py-16 text-center text-white"
        >
          <h2 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
            {dictionary.title}
          </h2>
          <p className="mx-auto max-w-2xl py-4 text-lg text-pretty text-white/80">
            {dictionary.description}
          </p>
          <div className="mx-auto flex max-w-xs flex-col justify-center gap-4 pt-4 sm:max-w-none sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={<a href={dictionary.primary.href} />}
              className="h-11 bg-white px-6 text-neutral-950 hover:bg-white/90 focus-visible:ring-white/50"
            >
              {dictionary.primary.label}
            </Button>
            {dictionary.secondary && (
              <Button
                size="lg"
                variant="ghost"
                nativeButton={false}
                render={<a href={dictionary.secondary.href} />}
                className="h-11 border-white/70 px-6 text-white hover:border-white hover:bg-white/10 hover:text-white focus-visible:ring-white/50 dark:hover:bg-white/10"
              >
                {dictionary.secondary.label}
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
