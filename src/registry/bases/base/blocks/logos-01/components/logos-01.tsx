import { InfiniteSlider } from "@/components/atom/infinite-slider"
import { ProgressiveBlur } from "@/components/atom/progressive-blur"
import { cn } from "@/lib/utils"

export type LogosDictionary = {
  title: string
  logos: {
    name: string
    src: string
  }[]
}

export function Logos({
  dictionary,
  lang,
  className,
}: {
  dictionary: LogosDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const isRTL = lang === "ar"

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      aria-labelledby="logos-01-title"
      className={cn("overflow-hidden bg-background py-16", className)}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-0">
          <div className="shrink-0 text-center md:border-e md:pe-6 md:text-start">
            <h2
              id="logos-01-title"
              className="text-base font-medium whitespace-pre-line"
            >
              {dictionary.title}
            </h2>
          </div>

          <ul className="sr-only">
            {dictionary.logos.map((logo) => (
              <li key={logo.name}>{logo.name}</li>
            ))}
          </ul>

          {/* The track is laid out LTR so the duplicated strip loops seamlessly;
              in RTL it runs the other way, flowing toward the reading start. */}
          <div
            dir="ltr"
            aria-hidden="true"
            className="relative w-full flex-1 overflow-hidden py-6 md:w-auto"
          >
            <InfiniteSlider
              speedOnHover={20}
              speed={40}
              gap={96}
              reverse={isRTL}
            >
              {dictionary.logos.map((logo) => (
                <div
                  key={logo.name}
                  className="flex items-center gap-2 text-foreground opacity-60 transition-opacity duration-300 hover:opacity-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt=""
                    width={24}
                    height={24}
                    loading="lazy"
                    className="size-6 object-contain dark:invert"
                  />
                  <span className="text-lg font-semibold tracking-tight whitespace-nowrap">
                    {logo.name}
                  </span>
                </div>
              ))}
            </InfiniteSlider>

            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background via-background/80 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background via-background/80 to-transparent" />

            <ProgressiveBlur
              className="pointer-events-none absolute top-0 left-0 z-20 h-full w-24"
              direction="left"
              blurIntensity={1}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute top-0 right-0 z-20 h-full w-24"
              direction="right"
              blurIntensity={1}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
