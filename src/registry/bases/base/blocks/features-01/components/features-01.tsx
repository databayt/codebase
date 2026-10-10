import {
  BarChart3,
  Bell,
  CalendarClock,
  FileText,
  Globe,
  Layers,
  Lock,
  MessageSquare,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

const icons = {
  analytics: BarChart3,
  notifications: Bell,
  scheduling: CalendarClock,
  documents: FileText,
  global: Globe,
  integrations: Layers,
  security: Lock,
  messaging: MessageSquare,
  teams: Users,
  automation: Workflow,
  speed: Zap,
} satisfies Record<string, LucideIcon>

export type FeaturesIcon = keyof typeof icons

export type FeaturesDictionary = {
  heading: string
  description?: string
  cards: {
    icon: FeaturesIcon
    title: string
    description: string
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
    <section
      dir={dir}
      className={cn("bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 max-w-2xl">
          <h2
            className="font-heading text-2xl font-bold tracking-tight text-balance md:text-3xl"
          >
            {dictionary.heading}
          </h2>
          {dictionary.description && (
            <p className="mt-3 text-pretty text-muted-foreground">
              {dictionary.description}
            </p>
          )}
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dictionary.cards.map((card) => {
            const Icon = icons[card.icon]
            return (
              <li
                key={card.title}
                className="group h-full rounded-lg border bg-background p-6 transition-[border-color] hover:border-primary"
              >
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="mb-5 size-9 text-foreground transition-colors group-hover:text-primary"
                />
                <h3 className="font-semibold tracking-tight">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
