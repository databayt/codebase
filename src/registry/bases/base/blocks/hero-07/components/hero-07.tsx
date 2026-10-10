"use client"

import { Search } from "lucide-react"
import { motion, useReducedMotion, type Variants } from "motion/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type HeroDictionary = {
  badge: string
  /** Headline lines: two on wide screens, a tighter set on phones. */
  title: { desktop: string[]; mobile: string[] }
  subtitle: string
  /** Background media. `video` is optional; `image` doubles as its poster. */
  media: { image: string; video?: string; alt: string }
  search: {
    /** Where the form submits (GET), e.g. "/track". */
    action: string
    /** Query parameter name, e.g. "q". */
    name: string
    label: string
    placeholder: string
    button: string
  }
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
}

function AnimatedWords({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <motion.span
      className={cn("block", className)}
      style={{ perspective: "1000px" }}
    >
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={wordVariants}
          className="inline-block"
          style={{ marginInlineEnd: "0.25em", transformStyle: "preserve-3d" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

/**
 * Full-screen media hero: a looping video (or photo) behind a word-by-word
 * 3D headline reveal, a subtitle and a pill search field.
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
  const reduceMotion = useReducedMotion()
  const { media, search } = dictionary

  return (
    <section
      dir={dir}
      aria-labelledby="hero-07-title"
      className={cn("relative isolate min-h-svh overflow-hidden", className)}
    >
      {/* Background media */}
      <div className="absolute inset-0 -z-10 bg-muted">
        {media.video ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={media.image}
            aria-hidden="true"
            className="size-full object-cover"
          >
            <source src={media.video} type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.image}
            alt={media.alt}
            className="size-full object-cover"
          />
        )}
        {/* Legibility scrim, darkest behind the copy. */}
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/35 to-black/10 rtl:bg-linear-to-l" />
      </div>

      {/* Content */}
      <div className="flex min-h-svh items-center px-6 py-16 md:px-12 lg:px-16">
        <div className="max-w-lg rounded-2xl border border-white/30 bg-black/30 p-5 backdrop-blur-md sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <span className="mb-4 inline-block text-xs font-semibold tracking-wider text-white/80 uppercase">
            {dictionary.badge}
          </span>

          <motion.h1
            id="hero-07-title"
            className={cn(
              "mb-4 text-5xl font-black text-white sm:mb-6 sm:text-6xl lg:text-7xl",
              lang === "ar" ? "leading-[1.3]" : "leading-[1.1]"
            )}
            variants={containerVariants}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
          >
            <span className="sm:hidden">
              {dictionary.title.mobile.map((line, index) => (
                <AnimatedWords key={index} text={line} />
              ))}
            </span>
            <span className="hidden sm:block">
              {dictionary.title.desktop.map((line, index) => (
                <AnimatedWords
                  key={index}
                  text={line}
                  className="lg:whitespace-nowrap"
                />
              ))}
            </span>
          </motion.h1>

          <p className="mb-6 text-base leading-relaxed text-white/90 sm:mb-8 sm:text-lg md:text-xl">
            {dictionary.subtitle}
          </p>

          <form
            role="search"
            action={search.action}
            method="get"
            className="relative inline-flex w-full items-center sm:w-auto"
          >
            <label htmlFor="hero-07-search" className="sr-only">
              {search.label}
            </label>
            <Input
              id="hero-07-search"
              type="search"
              name={search.name}
              required
              autoComplete="off"
              placeholder={search.placeholder}
              className="h-11 w-full rounded-full border-white/30 bg-white/10 ps-4 pe-14 text-sm text-white backdrop-blur-sm placeholder:text-white/60 sm:h-12 sm:w-80 sm:ps-5 sm:pe-28 sm:text-base dark:bg-white/10 [&::-webkit-search-cancel-button]:hidden"
            />
            <Button
              type="submit"
              size="sm"
              aria-label={search.button}
              className="absolute end-1.5 h-8 gap-1.5 rounded-full px-3 sm:h-9 sm:px-5"
            >
              <Search aria-hidden="true" className="size-3.5 sm:size-4" />
              <span className="hidden sm:inline">{search.button}</span>
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
