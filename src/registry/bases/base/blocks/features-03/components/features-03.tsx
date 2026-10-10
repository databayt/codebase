import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export type FeaturesDictionary = {
  heading: string
  description?: string
  items: { text: string }[]
}

export function Features({
  dictionary,
  lang,
  className,
}: {
  dictionary: FeaturesDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <section dir={dir} className={cn("bg-background py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-balance md:text-3xl">
            {dictionary.heading}
          </h2>
          {dictionary.description && (
            <p className="mt-3 text-pretty text-muted-foreground">
              {dictionary.description}
            </p>
          )}
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dictionary.items.map((item) => (
            <li
              key={item.text}
              className="flex items-center gap-3 rounded-lg border bg-background p-4"
            >
              <Check
                aria-hidden="true"
                strokeWidth={2.25}
                className="size-5 shrink-0 text-primary"
              />
              <span className="text-sm font-medium">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
