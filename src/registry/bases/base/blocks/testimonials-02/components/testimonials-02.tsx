"use client"

import * as React from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export type TestimonialsDictionary = {
  watermark: string
  title: string
  subtitle: string
  description: string
  scrollUp: string
  scrollDown: string
  categories: {
    id: string
    label: string
  }[]
  items: {
    category: string
    name: string
    role: string
    company: string
    quote: string
    reactions: string[]
    avatar: string
  }[]
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

function Watermark({
  text,
  isRTL,
  className,
}: {
  text: string
  isRTL: boolean
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const copy = Array.from({ length: 4 }, (_, i) => (
    <span
      key={i}
      className="mx-8 text-[14vw] leading-none font-bold whitespace-nowrap text-primary-foreground/15 md:text-[11vw]"
    >
      {text}
    </span>
  ))

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 overflow-hidden select-none",
        className
      )}
    >
      <motion.div
        className="flex w-max"
        animate={
          reduceMotion ? undefined : { x: ["0%", isRTL ? "50%" : "-50%"] }
        }
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        <div className="flex shrink-0">{copy}</div>
        <div className="flex shrink-0">{copy}</div>
      </motion.div>
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
  const isRTL = lang === "ar"
  const reduceMotion = useReducedMotion()
  const idPrefix = React.useId()
  const listRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(
    dictionary.categories[0]?.id ?? ""
  )
  const [canScroll, setCanScroll] = React.useState({ up: false, down: false })

  const items = dictionary.items.filter((item) => item.category === active)

  const updateScroll = React.useCallback(() => {
    const el = listRef.current
    if (!el) return
    setCanScroll({
      up: el.scrollTop > 4,
      down: el.scrollTop + el.clientHeight < el.scrollHeight - 4,
    })
  }, [])

  React.useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = 0
    const frame = window.requestAnimationFrame(updateScroll)
    const observer = new ResizeObserver(updateScroll)
    observer.observe(el)
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [active, updateScroll])

  const scroll = (direction: 1 | -1) => {
    listRef.current?.scrollBy({
      top: direction * 220,
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      aria-labelledby={`${idPrefix}-title`}
      className={cn(
        "relative overflow-hidden bg-primary py-20 text-primary-foreground md:py-32",
        className
      )}
    >
      <Watermark text={dictionary.watermark} isRTL={isRTL} className="top-8" />
      <Watermark
        text={dictionary.watermark}
        isRTL={isRTL}
        className="bottom-8"
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 md:flex-row md:items-stretch md:justify-center md:gap-8 md:px-6"
      >
        <div className="max-w-sm text-center md:max-w-xs md:self-center md:text-end">
          <h2
            id={`${idPrefix}-title`}
            className="mb-1 text-4xl font-black tracking-wide md:text-6xl"
          >
            {dictionary.title}
          </h2>
          <p className="mb-2 text-lg font-medium text-primary-foreground/90 md:mb-4 md:text-2xl">
            {dictionary.subtitle}
          </p>
          <p className="text-sm leading-relaxed text-primary-foreground/70 md:ms-auto md:max-w-56 md:text-base">
            {dictionary.description}
          </p>
        </div>

        <div className="flex w-full max-w-lg flex-col-reverse gap-4 md:flex-row md:gap-0">
          <div
            role="tabpanel"
            id={`${idPrefix}-panel`}
            aria-labelledby={`${idPrefix}-tab-${active}`}
            className="flex-1 overflow-hidden rounded-2xl bg-background text-foreground shadow-xl md:rounded-3xl"
          >
            <div
              ref={listRef}
              onScroll={updateScroll}
              tabIndex={0}
              className="h-[420px] overflow-y-auto overscroll-contain p-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:h-[640px] md:p-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-border"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 md:space-y-6"
                >
                  {items.map((item, index) => {
                    const alternate = index % 2 === 1
                    return (
                      <motion.li
                        key={item.name}
                        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={cn(
                          "flex items-start gap-3 md:gap-4",
                          alternate && "flex-row-reverse"
                        )}
                      >
                        <Avatar className="size-10 md:size-14">
                          <AvatarImage src={item.avatar} alt="" />
                          <AvatarFallback>{initials(item.name)}</AvatarFallback>
                        </Avatar>
                        <figure
                          className={cn(
                            "flex-1",
                            alternate ? "text-end" : "text-start"
                          )}
                        >
                          <figcaption className="mb-2">
                            <p className="text-sm font-bold text-primary md:text-base">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground md:text-sm">
                              {item.role}{" "}
                              <span className="text-muted-foreground/50">|</span>{" "}
                              {item.company}
                            </p>
                          </figcaption>
                          <div
                            className={cn(
                              "inline-block max-w-[90%] rounded-2xl bg-muted p-3 md:p-4",
                              alternate ? "rounded-se-sm" : "rounded-ss-sm"
                            )}
                          >
                            <blockquote className="text-start text-xs leading-relaxed md:text-sm">
                              <p>{item.quote}</p>
                            </blockquote>
                            {item.reactions.length > 0 ? (
                              <div
                                aria-hidden="true"
                                className={cn(
                                  "mt-2 flex gap-1 md:gap-2",
                                  alternate ? "justify-end" : "justify-start"
                                )}
                              >
                                {item.reactions.map((emoji, i) => (
                                  <span
                                    key={i}
                                    className="flex size-6 items-center justify-center rounded-full bg-background text-xs shadow-sm md:size-8 md:text-base"
                                  >
                                    {emoji}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </figure>
                      </motion.li>
                    )
                  })}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-center md:flex-col md:justify-start">
            <div
              role="tablist"
              className="flex gap-2 md:mt-24 md:flex-col"
            >
              {dictionary.categories.map((category) => {
                const selected = category.id === active
                return (
                  <button
                    key={category.id}
                    id={`${idPrefix}-tab-${category.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`${idPrefix}-panel`}
                    onClick={() => setActive(category.id)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground/50",
                      "md:rounded-s-none md:rounded-e-md md:border-s-0 md:px-3 md:py-4 md:text-xs md:[writing-mode:vertical-rl]",
                      selected
                        ? "border-background bg-background text-foreground"
                        : "border-primary-foreground/50 text-primary-foreground hover:border-primary-foreground"
                    )}
                  >
                    {category.label}
                  </button>
                )
              })}
            </div>

            <div className="mt-auto hidden flex-col gap-1 md:flex">
              <button
                type="button"
                aria-label={dictionary.scrollUp}
                disabled={!canScroll.up}
                onClick={() => scroll(-1)}
                className="flex h-12 w-8 items-center justify-center rounded-t-md rounded-b-none bg-background text-foreground transition-colors outline-none hover:bg-background/90 focus-visible:ring-3 focus-visible:ring-primary-foreground/50 disabled:bg-primary-foreground/20 disabled:text-primary-foreground/40"
              >
                <ArrowUp className="size-4" />
              </button>
              <button
                type="button"
                aria-label={dictionary.scrollDown}
                disabled={!canScroll.down}
                onClick={() => scroll(1)}
                className="flex h-12 w-8 items-center justify-center rounded-t-none rounded-b-md bg-background text-foreground transition-colors outline-none hover:bg-background/90 focus-visible:ring-3 focus-visible:ring-primary-foreground/50 disabled:bg-primary-foreground/20 disabled:text-primary-foreground/40"
              >
                <ArrowDown className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
