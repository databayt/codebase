import { cn } from "@/lib/utils"

export type StatsDictionary = {
  title: string
  description: string
  items: {
    value: string
    label: string
  }[]
}

export function Stats({
  dictionary,
  lang,
  className,
}: {
  dictionary: StatsDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <section
      dir={dir}
      aria-labelledby="stats-02-title"
      className={cn("bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <h2
            id="stats-02-title"
            className="text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            {dictionary.title}
          </h2>
          <p className="mt-4 text-base text-pretty text-muted-foreground md:text-lg">
            {dictionary.description}
          </p>
        </div>

        <dl className="grid gap-8 rounded-2xl border bg-muted/40 p-8 sm:grid-cols-2 md:grid-cols-3 md:p-12">
          {dictionary.items.map((item) => (
            <div key={item.label} className="flex flex-col-reverse text-center">
              <dt className="mt-2 text-sm text-muted-foreground">
                {item.label}
              </dt>
              <dd className="text-4xl font-bold tracking-tight tabular-nums md:text-5xl">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
