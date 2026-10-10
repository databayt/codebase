import {
  BatteryFull,
  Camera,
  Cpu,
  Droplets,
  Leaf,
  ShieldCheck,
  Sparkles,
  Wifi,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

const icons = {
  battery: BatteryFull,
  camera: Camera,
  chip: Cpu,
  water: Droplets,
  environment: Leaf,
  privacy: ShieldCheck,
  intelligence: Sparkles,
  connectivity: Wifi,
} satisfies Record<string, LucideIcon>

export type FeaturesIcon = keyof typeof icons

export type FeaturesDictionary = {
  eyebrow?: string
  heading?: string
  description?: string
  features: {
    icon?: FeaturesIcon
    title: string
    description: string
  }[]
}

const surfaces = {
  default: {
    section: "bg-background text-foreground",
    muted: "text-muted-foreground",
    icon: "text-primary",
  },
  muted: {
    section: "bg-muted text-foreground",
    muted: "text-muted-foreground",
    icon: "text-primary",
  },
  // Flips with the theme: dark band in light mode, light band in dark mode.
  inverted: {
    section: "bg-foreground text-background",
    muted: "text-background/65",
    icon: "text-background",
  },
} as const

const columnClasses = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
} as const

export function Features({
  dictionary,
  lang,
  columns = 3,
  variant = "default",
  className,
}: {
  dictionary: FeaturesDictionary
  lang: "en" | "ar"
  columns?: keyof typeof columnClasses
  variant?: keyof typeof surfaces
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"
  const surface = surfaces[variant]
  const hasHeader = dictionary.eyebrow || dictionary.heading || dictionary.description

  return (
    <section dir={dir} className={cn("py-20 md:py-28", surface.section, className)}>
      <div className="mx-auto max-w-6xl px-6">
        {hasHeader && (
          <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
            {dictionary.eyebrow && (
              <p className={cn("mb-3 text-base font-semibold", surface.muted)}>
                {dictionary.eyebrow}
              </p>
            )}
            {dictionary.heading && (
              <h2 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                {dictionary.heading}
              </h2>
            )}
            {dictionary.description && (
              <p
                className={cn(
                  "mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty md:text-xl",
                  surface.muted
                )}
              >
                {dictionary.description}
              </p>
            )}
          </div>
        )}
        <ul className={cn("grid grid-cols-1 gap-12", columnClasses[columns])}>
          {dictionary.features.map((feature) => {
            const Icon = feature.icon ? icons[feature.icon] : null
            return (
              <li
                key={feature.title}
                className="flex flex-col items-center text-center"
              >
                {Icon && (
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className={cn("mb-6 size-10", surface.icon)}
                  />
                )}
                <h3 className="mb-3 text-2xl font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p
                  className={cn(
                    "text-lg leading-relaxed text-pretty",
                    surface.muted
                  )}
                >
                  {feature.description}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
