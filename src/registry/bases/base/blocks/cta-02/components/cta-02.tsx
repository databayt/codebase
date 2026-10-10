import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type CtaDictionary = {
  title: string
  description?: string
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
}

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

  return (
    <section dir={dir} className={cn("bg-background py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl border bg-muted/40 px-6 py-10 text-center md:px-12 md:py-14">
          <h2 className="mx-auto max-w-3xl font-heading text-2xl font-bold tracking-tight text-balance md:text-3xl">
            {dictionary.title}
          </h2>
          {dictionary.description && (
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
              {dictionary.description}
            </p>
          )}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="px-6"
              nativeButton={false}
              render={<a href={dictionary.primary.href} />}
            >
              {dictionary.primary.label}
            </Button>
            {dictionary.secondary && (
              <Button
                size="lg"
                variant="outline"
                className="px-6"
                nativeButton={false}
                render={<a href={dictionary.secondary.href} />}
              >
                {dictionary.secondary.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
