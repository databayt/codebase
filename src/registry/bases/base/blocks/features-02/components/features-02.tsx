import { ArrowRight, Check } from "lucide-react"

import { cn } from "@/lib/utils"

export type FeaturesDictionary = {
  eyebrow?: string
  heading: string
  description?: string
  blocks: {
    tag: string
    title: string
    description: string
    bullets?: string[]
    link?: { label: string; href: string }
    image: { src: string; alt: string }
  }[]
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
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
          {dictionary.eyebrow && (
            <p className="mb-3 text-sm font-medium text-primary">
              {dictionary.eyebrow}
            </p>
          )}
          <h2 className="font-heading text-2xl font-bold tracking-tight text-balance md:text-4xl">
            {dictionary.heading}
          </h2>
          {dictionary.description && (
            <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
              {dictionary.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {dictionary.blocks.map((block, index) => (
            <article
              key={block.title}
              className={cn(
                "flex flex-col items-center gap-8 md:gap-14",
                // Flex rows follow `dir`, so the reverse on odd rows mirrors in RTL.
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              )}
            >
              <div className="w-full md:w-1/2">
                <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {block.tag}
                </span>
                <h3 className="mt-4 font-heading text-xl font-semibold tracking-tight text-balance md:text-3xl">
                  {block.title}
                </h3>
                <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">
                  {block.description}
                </p>
                {block.bullets && block.bullets.length > 0 && (
                  <ul className="mt-6 flex flex-col gap-3">
                    {block.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-sm">
                        <Check
                          aria-hidden="true"
                          strokeWidth={2.25}
                          className="mt-0.5 size-4 shrink-0 text-primary"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {block.link && (
                  <a
                    href={block.link.href}
                    className="group mt-7 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {block.link.label}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    />
                  </a>
                )}
              </div>

              <div className="w-full md:w-1/2">
                <div className="rounded-2xl bg-muted p-4 sm:p-6 md:p-8">
                  <div className="overflow-hidden rounded-xl border bg-background shadow-lg">
                    <div
                      aria-hidden="true"
                      className="flex items-center gap-1.5 border-b px-4 py-3"
                    >
                      <span className="size-2.5 rounded-full bg-muted-foreground/25" />
                      <span className="size-2.5 rounded-full bg-muted-foreground/25" />
                      <span className="size-2.5 rounded-full bg-muted-foreground/25" />
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={block.image.src}
                      alt={block.image.alt}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
