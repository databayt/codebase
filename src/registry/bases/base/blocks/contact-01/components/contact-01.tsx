import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ContactForm,
  type ContactFormDictionary,
} from "@/registry/bases/base/blocks/contact-01/components/contact-01-form"

const icons = {
  chat: MessageCircle,
  phone: Phone,
  email: Mail,
  location: MapPin,
  hours: Clock,
} satisfies Record<string, LucideIcon>

export type ContactDictionary = {
  eyebrow?: string
  title: string
  lead: string
  channels: {
    title: string
    items: {
      icon: keyof typeof icons
      title: string
      body?: string
      /** Primary contact value, e.g. a phone number or email address. */
      value?: { label: string; href: string; ltr?: boolean }
      /** Multi-line postal address. */
      address?: string[]
      action?: { label: string; href: string }
      highlight?: boolean
    }[]
  }
  message: {
    title: string
    lead: string
    privacy: string
    form: ContactFormDictionary
  }
}

export function Contact({
  dictionary,
  lang,
  className,
}: {
  dictionary: ContactDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"
  const { channels, message } = dictionary

  return (
    <section
      dir={dir}
      aria-labelledby="contact-title"
      className={cn("bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 md:gap-24">
        <div className="flex flex-col gap-10">
          <div className="max-w-2xl">
            {dictionary.eyebrow && (
              <p className="mb-3 text-sm font-medium text-primary">
                {dictionary.eyebrow}
              </p>
            )}
            <h2
              id="contact-title"
              className="font-heading text-3xl font-bold tracking-tight text-balance md:text-5xl"
            >
              {dictionary.title}
            </h2>
            <p className="mt-4 text-lg text-pretty text-muted-foreground">
              {dictionary.lead}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="font-heading text-xl font-semibold tracking-tight">
              {channels.title}
            </h3>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {channels.items.map((item) => {
                const Icon = icons[item.icon]
                return (
                  <li
                    key={item.title}
                    className={cn(
                      "flex flex-col items-start gap-4 rounded-3xl p-6",
                      item.highlight
                        ? "bg-primary/5 ring-1 ring-primary/15 dark:bg-primary/10"
                        : "border bg-background"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-11 place-items-center rounded-full bg-foreground text-background [&_svg]:size-5"
                    >
                      <Icon />
                    </span>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-lg font-semibold tracking-tight">
                        {item.title}
                      </h4>
                      {item.body && (
                        <p className="text-pretty text-muted-foreground">
                          {item.body}
                        </p>
                      )}
                    </div>
                    {item.value && (
                      <a
                        href={item.value.href}
                        dir={item.value.ltr ? "ltr" : undefined}
                        className="inline-flex min-h-11 items-center rounded-sm text-lg font-medium break-all tabular-nums underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {item.value.label}
                      </a>
                    )}
                    {item.address && (
                      <address className="font-medium not-italic">
                        {item.address.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </address>
                    )}
                    {item.action && (
                      <Button
                        variant={item.highlight ? "default" : "outline"}
                        size="sm"
                        className="mt-auto px-3"
                        nativeButton={false}
                        render={<a href={item.action.href} />}
                      >
                        {item.action.label}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="rtl:-scale-x-100"
                        />
                      </Button>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-2xl font-bold tracking-tight text-balance md:text-3xl">
              {message.title}
            </h3>
            <p className="text-lg text-pretty text-muted-foreground">
              {message.lead}
            </p>
            <p className="text-sm text-muted-foreground">{message.privacy}</p>
          </div>
          <ContactForm dictionary={message.form} />
        </div>
      </div>
    </section>
  )
}
