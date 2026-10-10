import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type HeroDictionary = {
  /** Each entry renders as its own line of the headline. */
  title: string[]
  subtitle: string
  primaryAction: { label: string; href: string }
  secondaryAction: { label: string; href: string }
  /**
   * Optional brand mark shown beside the copy. Without it the hero draws a
   * neutral geometric mark in the foreground colour (inverts with the theme).
   */
  illustration?: { src: string; alt: string }
}

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

  return (
    <section
      dir={dir}
      aria-labelledby="hero-05-title"
      className={cn("bg-background px-6 md:px-10", className)}
    >
      <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-7xl flex-col items-start justify-center gap-6 py-12 md:gap-8 lg:flex-row lg:items-center lg:gap-16 lg:py-0">
        {/* Illustration: first on mobile (column), second on desktop (row). */}
        <div className="flex items-center justify-center self-center lg:order-2 lg:flex-1 lg:justify-end lg:self-auto">
          <div className="relative size-[200px] sm:size-[280px] md:size-[320px] lg:size-[400px] xl:size-[480px]">
            {dictionary.illustration ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dictionary.illustration.src}
                alt={dictionary.illustration.alt}
                className="absolute inset-0 size-full scale-[0.7] object-contain"
              />
            ) : (
              <HeroMark className="absolute inset-0 size-full scale-[0.7] text-foreground" />
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-8 text-start lg:order-1 lg:flex-1">
          <h1
            id="hero-05-title"
            className={cn(
              "text-5xl font-black tracking-tight text-foreground md:text-6xl xl:text-7xl",
              // Arabic needs looser leading: marks on a following line collide
              // with the descenders above at the default heading line-height.
              lang === "ar" && "leading-[1.3]"
            )}
          >
            {dictionary.title.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h1>

          {dictionary.subtitle ? (
            <p className="max-w-xl leading-relaxed text-muted-foreground">
              {dictionary.subtitle}
            </p>
          ) : null}

          <div className="flex flex-row flex-wrap gap-3">
            <Button
              size="lg"
              className="px-4"
              nativeButton={false}
              render={<a href={dictionary.primaryAction.href} />}
            >
              {dictionary.primaryAction.label}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-4"
              nativeButton={false}
              render={<a href={dictionary.secondaryAction.href} />}
            >
              {dictionary.secondaryAction.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

/** A bold eight-spoke mark drawn in currentColor; purely decorative. */
function HeroMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g fill="currentColor">
        {[0, 45, 90, 135].map((rotation) => (
          <rect
            key={rotation}
            x="86"
            y="8"
            width="28"
            height="184"
            rx="14"
            transform={`rotate(${rotation} 100 100)`}
          />
        ))}
      </g>
      <circle cx="100" cy="100" r="18" className="fill-background" />
    </svg>
  )
}
