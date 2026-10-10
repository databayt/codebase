import { CircleCheckIcon, InfoIcon, MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

/** `true` = included, `false`/`null` = not included, string = a value. */
export type ComparePlanValue = string | boolean | null

export type ComparePlan = {
  id: string
  name: string
  /** Short price line under the plan name, e.g. "$29 / month". */
  price: string
  cta: { label: string; href: string }
  featured?: boolean
}

export type CompareRow = {
  feature: string
  /** Optional explanation shown in a popover (desktop) or under the row (mobile). */
  tooltip?: string
  /** Keyed by plan id. */
  values: Record<string, ComparePlanValue>
}

export type PricingDictionary = {
  title: string
  subtitle: string
  /** Column header for the feature column (visually hidden). */
  featureColumn: string
  included: string
  notIncluded: string
  /** aria-label for the info buttons; `{feature}` is replaced. */
  moreInfo: string
  plans: ComparePlan[]
  sections: { title: string; rows: CompareRow[] }[]
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

  return (
    <section
      dir={dir}
      aria-labelledby="pricing-02-title"
      className={cn("bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2
            id="pricing-02-title"
            className="font-heading text-3xl font-extrabold tracking-tight text-balance md:text-4xl"
          >
            {dictionary.title}
          </h2>
          <p className="text-base text-balance text-muted-foreground md:text-lg">
            {dictionary.subtitle}
          </p>
        </div>

        <DesktopTable dictionary={dictionary} />
        <MobileStack dictionary={dictionary} />
      </div>
    </section>
  )
}

function Cell({
  value,
  dictionary,
}: {
  value: ComparePlanValue
  dictionary: PricingDictionary
}) {
  if (value === true) {
    return (
      <>
        <CircleCheckIcon aria-hidden className="size-5 text-primary" />
        <span className="sr-only">{dictionary.included}</span>
      </>
    )
  }
  if (value === false || value === null) {
    return (
      <>
        <MinusIcon aria-hidden className="size-4 text-muted-foreground/60" />
        <span className="sr-only">{dictionary.notIncluded}</span>
      </>
    )
  }
  return <span>{value}</span>
}

function InfoPopover({
  row,
  dictionary,
}: {
  row: CompareRow
  dictionary: PricingDictionary
}) {
  if (!row.tooltip) return null
  return (
    <Popover>
      <PopoverTrigger
        aria-label={dictionary.moreInfo.replace("{feature}", row.feature)}
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <InfoIcon aria-hidden className="size-4" />
      </PopoverTrigger>
      <PopoverContent side="top" className="w-auto max-w-72 text-start">
        {row.tooltip}
      </PopoverContent>
    </Popover>
  )
}

function DesktopTable({ dictionary }: { dictionary: PricingDictionary }) {
  const { plans, sections } = dictionary

  return (
    <div className="mt-12 hidden md:block">
      <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
        <caption className="sr-only">{dictionary.title}</caption>
        <colgroup>
          <col className="w-1/4" />
          {plans.map((plan) => (
            <col key={plan.id} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky top-0 z-10 border-b bg-background py-5 text-start align-bottom"
            >
              <span className="sr-only">{dictionary.featureColumn}</span>
            </th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                scope="col"
                className="sticky top-0 z-10 border-b bg-background px-3 py-5 align-bottom font-normal"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base font-semibold">{plan.name}</span>
                  <span className="text-muted-foreground">{plan.price}</span>
                  <Button
                    render={<a href={plan.cta.href} />}
                    nativeButton={false}
                    variant={plan.featured ? "default" : "outline"}
                    size="sm"
                    className="mt-3 w-full max-w-40"
                  >
                    {plan.cta.label}
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        {sections.map((section) => (
          <tbody key={section.title}>
            <tr>
              <th
                scope="colgroup"
                colSpan={plans.length + 1}
                className="pt-10 pb-3 text-start text-sm font-semibold"
              >
                {section.title}
              </th>
            </tr>
            {section.rows.map((row) => (
              <tr key={row.feature} className="group">
                <th
                  scope="row"
                  className="border-t py-3.5 pe-4 text-start font-normal group-hover:bg-muted/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="lg:text-base">{row.feature}</span>
                    <InfoPopover row={row} dictionary={dictionary} />
                  </div>
                </th>
                {plans.map((plan) => (
                  <td
                    key={plan.id}
                    className={cn(
                      "border-t px-3 py-3.5 text-center text-muted-foreground group-hover:bg-muted/40 lg:text-base",
                      plan.featured && "bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-center">
                      <Cell value={row.values[plan.id] ?? null} dictionary={dictionary} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  )
}

function MobileStack({ dictionary }: { dictionary: PricingDictionary }) {
  const { plans, sections } = dictionary
  const featured = plans.find((plan) => plan.featured) ?? plans[0]

  return (
    <Accordion
      multiple
      defaultValue={featured ? [featured.id] : []}
      className="mt-10 gap-4 md:hidden"
    >
      {plans.map((plan) => (
        <AccordionItem
          key={plan.id}
          value={plan.id}
          className={cn(
            "rounded-2xl border",
            plan.featured && "border-primary"
          )}
        >
          <AccordionTrigger className="items-center px-5 py-4 hover:no-underline">
            <span className="flex flex-col gap-0.5 text-start">
              <span className="text-base font-semibold">{plan.name}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {plan.price}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="flex flex-col gap-6">
              {sections.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-1 text-sm font-semibold">{section.title}</h3>
                  <dl className="divide-y">
                    {section.rows.map((row) => (
                      <div
                        key={row.feature}
                        className="flex items-start justify-between gap-4 py-3"
                      >
                        <dt className="flex flex-col gap-1">
                          <span>{row.feature}</span>
                          {row.tooltip && (
                            <span className="text-xs text-muted-foreground">
                              {row.tooltip}
                            </span>
                          )}
                        </dt>
                        <dd className="flex shrink-0 items-center text-end text-muted-foreground">
                          <Cell
                            value={row.values[plan.id] ?? null}
                            dictionary={dictionary}
                          />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </AccordionContent>
          <div className="px-5 pb-5">
            <Button
              render={<a href={plan.cta.href} />}
              nativeButton={false}
              variant={plan.featured ? "default" : "outline"}
              className="w-full"
            >
              {plan.cta.label}
            </Button>
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
