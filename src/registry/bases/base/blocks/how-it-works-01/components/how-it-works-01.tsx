"use client"

import * as React from "react"
import {
  CheckCircle,
  FileText,
  Rocket,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

const icons = {
  search: Search,
  file: FileText,
  check: CheckCircle,
  rocket: Rocket,
  settings: Settings,
  users: Users,
} satisfies Record<string, LucideIcon>

export type HowItWorksIcon = keyof typeof icons

export type HowItWorksDictionary = {
  eyebrow?: string
  title: string
  subtitle?: string
  /** Visually hidden prefix read before each step number, e.g. "Step". */
  stepLabel: string
  steps: {
    icon: HowItWorksIcon
    title: string
    description: string
  }[]
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
  const reduce = useReducedMotion()
  const steps = dictionary.steps

  return (
    <section
      dir={dir}
      aria-labelledby="how-it-works-title"
      className={cn("bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
          {dictionary.eyebrow && (
            <p className="mb-3 text-sm font-medium text-primary">
              {dictionary.eyebrow}
            </p>
          )}
          <h2
            id="how-it-works-title"
            className="font-heading text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            {dictionary.title}
          </h2>
          {dictionary.subtitle && (
            <p className="mt-4 text-lg text-pretty text-muted-foreground">
              {dictionary.subtitle}
            </p>
          )}
        </div>

        <ol
          style={{ "--steps": steps.length } as React.CSSProperties}
          className="mx-auto grid max-w-4xl list-none gap-12 md:grid-cols-[repeat(var(--steps),minmax(0,1fr))] md:gap-8"
        >
          {steps.map((step, index) => {
            const Icon = icons[step.icon]
            return (
              <motion.li
                key={step.title}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
                className="relative text-center"
              >
                {/* Connector to the next step (desktop only), circle edge to circle edge. */}
                {index < steps.length - 1 && (
                  <motion.span
                    aria-hidden="true"
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.3, ease: "easeOut" }}
                    className="absolute top-12 start-[calc(50%+3.5rem)] hidden w-[calc(100%-5rem)] border-t-2 border-dashed border-border ltr:origin-left rtl:origin-right md:block"
                  />
                )}

                <div className="relative mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-primary/10">
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                    <Icon aria-hidden="true" className="size-7" />
                  </div>
                  <span className="absolute -top-1 -end-1 flex size-8 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary tabular-nums">
                    <span className="sr-only">{dictionary.stepLabel} </span>
                    {index + 1}
                  </span>
                </div>

                <h3 className="mb-2 text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mx-auto max-w-xs text-pretty text-muted-foreground">
                  {step.description}
                </p>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
