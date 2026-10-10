"use client"

import * as React from "react"
import { CheckCircle2, Mail } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export type NewsletterDictionary = {
  title: string
  description: string
  emailLabel: string
  emailPlaceholder: string
  subscribe: string
  note: string
  success: string
}

export function Newsletter({
  dictionary,
  lang,
  className,
}: {
  dictionary: NewsletterDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"
  const id = React.useId()
  const [email, setEmail] = React.useState("")
  const [subscribed, setSubscribed] = React.useState(false)

  return (
    <section
      dir={dir}
      aria-labelledby={`${id}-title`}
      className={cn("bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-xl px-6 text-center">
        <h2
          id={`${id}-title`}
          className="font-heading text-3xl font-bold tracking-tight text-balance md:text-4xl"
        >
          {dictionary.title}
        </h2>
        <p className="mt-4 text-lg text-pretty text-muted-foreground">
          {dictionary.description}
        </p>
      </div>

      <div className="mx-auto max-w-sm px-6 pt-8">
        <div className="mb-3 flex justify-start">
          <span
            aria-hidden="true"
            className="grid size-12 -rotate-12 place-items-center rounded-2xl border bg-muted text-foreground shadow-sm rtl:rotate-12"
          >
            <Mail className="size-6" />
          </span>
        </div>

        {subscribed ? (
          <p
            role="status"
            className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2.5 text-sm font-medium"
          >
            <CheckCircle2 aria-hidden="true" className="size-4 shrink-0 text-primary" />
            {dictionary.success}
          </p>
        ) : (
          <form
            onSubmit={(event) => {
              // Demo only: connect your email provider here.
              event.preventDefault()
              if (!email) return
              setSubscribed(true)
              setEmail("")
            }}
            className="flex items-center gap-2"
          >
            <label htmlFor={`${id}-email`} className="sr-only">
              {dictionary.emailLabel}
            </label>
            <Input
              id={`${id}-email`}
              type="email"
              name="email"
              autoComplete="email"
              dir="ltr"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={dictionary.emailPlaceholder}
              className="flex-1 text-start rtl:text-end"
            />
            <Button type="submit" className="px-4">
              {dictionary.subscribe}
            </Button>
          </form>
        )}

        <p className="mt-3 text-start text-xs text-muted-foreground">
          {dictionary.note}
        </p>
      </div>
    </section>
  )
}
