"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Billing = "monthly" | "yearly"

export type PricingPlan = {
  id: string
  name: string
  description: string
  /**
   * Price per month. `yearly` is the per-month price when billed annually.
   * `null` renders `customPrice` instead of a number (e.g. "Custom").
   */
  price: { monthly: number | null; yearly: number | null }
  /** Optional ribbon on the card, e.g. "Most popular". */
  badge?: string
  /** Highlights the card with a primary ring and a solid CTA. */
  featured?: boolean
  featuresHeading: string
  features: string[]
  cta: { label: string; href: string }
}

export type PricingDictionary = {
  badge: string
  title: string
  subtitle: string
  billing: {
    label: string
    monthly: string
    yearly: string
    /** Short saving hint next to the yearly option, e.g. "−20%". */
    yearlySaving: string
  }
  currency: {
    symbol: string
    position: "before" | "after"
  }
  /** Suffix after the price, e.g. "/ month". */
  perMonth: string
  /** Shown under the price when yearly is active. `{amount}` is replaced. */
  billedYearly: string
  /** Shown under the price when monthly is active. */
  billedMonthly: string
  /** Headline for plans whose price is `null`. */
  customPrice: string
  /** Note for plans whose price is `null`. */
  customPriceNote: string
  plans: PricingPlan[]
  footnote: string
}

export function Pricing({
  dictionary,
  lang,
  className,
}: {
  dictionary: PricingDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"
  const [billing, setBilling] = React.useState<Billing>("monthly")

  const formatNumber = React.useMemo(
    () =>
      new Intl.NumberFormat(lang === "ar" ? "ar-u-nu-arab" : "en-US", {
        maximumFractionDigits: 2,
      }),
    [lang]
  )
  const money = React.useCallback(
    (value: number) => {
      const amount = formatNumber.format(value)
      const { symbol, position } = dictionary.currency
      return position === "before" ? `${symbol}${amount}` : `${amount} ${symbol}`
    },
    [dictionary.currency, formatNumber]
  )

  return (
    <section
      dir={dir}
      aria-labelledby="pricing-01-title"
      className={cn("bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 md:px-6">
        <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <Badge variant="secondary">{dictionary.badge}</Badge>
          <h2
            id="pricing-01-title"
            className="font-heading text-4xl font-extrabold tracking-tight text-balance md:text-5xl"
          >
            {dictionary.title}
          </h2>
          <p className="text-base text-balance text-muted-foreground md:text-lg">
            {dictionary.subtitle}
          </p>
        </div>

        <BillingToggle
          value={billing}
          onChange={setBilling}
          labels={dictionary.billing}
          className="mt-10"
        />

        <div className="mt-8 grid w-full items-stretch gap-6 md:grid-cols-3 md:gap-6 lg:gap-8">
          {dictionary.plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billing={billing}
              money={money}
              dictionary={dictionary}
            />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {dictionary.footnote}
        </p>
      </div>
    </section>
  )
}

function BillingToggle({
  value,
  onChange,
  labels,
  className,
}: {
  value: Billing
  onChange: (value: Billing) => void
  labels: PricingDictionary["billing"]
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const groupId = React.useId()
  const options: { value: Billing; label: string; hint?: string }[] = [
    { value: "monthly", label: labels.monthly },
    { value: "yearly", label: labels.yearly, hint: labels.yearlySaving },
  ]

  return (
    <LayoutGroup id={groupId}>
      <ToggleGroup
        aria-label={labels.label}
        value={[value]}
        onValueChange={(next) => {
          const picked = next[0] as Billing | undefined
          if (picked) onChange(picked)
        }}
        spacing={0}
        className={cn("rounded-lg bg-muted p-1", className)}
      >
        {options.map((option) => {
          const active = option.value === value
          return (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className={cn(
                "relative h-9 min-w-28 rounded-md px-4 text-muted-foreground hover:bg-transparent aria-pressed:bg-transparent md:min-w-36",
                "group-data-[spacing=0]/toggle-group:rounded-md group-data-[spacing=0]/toggle-group:px-4",
                active && "text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="billing-pill"
                  aria-hidden
                  className="absolute inset-0 rounded-md bg-background shadow-sm ring-1 ring-foreground/5"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", bounce: 0.15, duration: 0.4 }
                  }
                />
              )}
              <span className="relative z-10">{option.label}</span>
              {option.hint && (
                <span className="relative z-10 rounded-sm bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary tabular-nums">
                  {option.hint}
                </span>
              )}
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
    </LayoutGroup>
  )
}

function PlanCard({
  plan,
  billing,
  money,
  dictionary,
}: {
  plan: PricingPlan
  billing: Billing
  money: (value: number) => string
  dictionary: PricingDictionary
}) {
  const reduceMotion = useReducedMotion()
  const amount = plan.price[billing]
  const isCustom = amount === null
  const isFree = amount === 0

  const note = isCustom
    ? dictionary.customPriceNote
    : isFree
      ? null
      : billing === "yearly"
        ? dictionary.billedYearly.replace("{amount}", money(amount * 12))
        : dictionary.billedMonthly

  return (
    <Card
      className={cn(
        "relative h-full gap-0 rounded-2xl bg-muted py-0 text-start shadow-none ring-0",
        plan.featured && "bg-background ring-2 ring-primary"
      )}
    >
      <CardHeader className="gap-3 pt-6 pb-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          {plan.badge && <Badge>{plan.badge}</Badge>}
        </div>

        <div className="flex min-h-12 items-baseline gap-1.5">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${billing}-${amount}`}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="text-4xl font-bold tracking-tight tabular-nums"
            >
              {isCustom ? dictionary.customPrice : money(amount)}
            </motion.span>
          </AnimatePresence>
          {!isCustom && (
            <span className="text-sm text-muted-foreground">
              {dictionary.perMonth}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{plan.description}</p>
        <p className="min-h-4 text-xs text-muted-foreground" aria-live="polite">
          {note}
        </p>
      </CardHeader>

      <div className="px-6">
        <Separator />
      </div>

      <CardContent className="flex-1 gap-3 pt-5 pb-6">
        <p className="text-sm font-medium">{plan.featuresHeading}</p>
        <ul className="flex flex-col gap-2.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <CheckIcon
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <span className="leading-5 text-muted-foreground">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pb-6">
        <Button
          render={<a href={plan.cta.href} />}
          nativeButton={false}
          variant={plan.featured ? "default" : "outline"}
          size="lg"
          className="w-full"
        >
          {plan.cta.label}
        </Button>
      </CardFooter>
    </Card>
  )
}
