"use client"

import * as React from "react"
import { CheckCircle2, Send } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export type ContactFormDictionary = {
  name: { label: string; placeholder: string }
  email: { label: string; placeholder: string }
  phone: { label: string; placeholder: string }
  message: { label: string; placeholder: string }
  submit: string
  success: { title: string; description: string; again: string }
}

export function ContactForm({
  dictionary,
  className,
}: {
  dictionary: ContactFormDictionary
  className?: string
}) {
  const id = React.useId()
  const [sent, setSent] = React.useState(false)

  if (sent) {
    return (
      <div
        role="status"
        className={cn(
          "flex flex-col items-start gap-4 rounded-3xl border bg-card p-6 text-card-foreground sm:p-8",
          className
        )}
      >
        <CheckCircle2 aria-hidden="true" className="size-8 text-primary" />
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold">{dictionary.success.title}</p>
          <p className="text-muted-foreground">
            {dictionary.success.description}
          </p>
        </div>
        <Button variant="outline" onClick={() => setSent(false)}>
          {dictionary.success.again}
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        // Demo only: wire your own server action or API route here.
        event.preventDefault()
        setSent(true)
      }}
      className={cn(
        "rounded-3xl border bg-card p-6 text-card-foreground sm:p-8",
        className
      )}
    >
      <FieldGroup className="gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${id}-name`}>{dictionary.name.label}</FieldLabel>
            <Input
              id={`${id}-name`}
              name="name"
              autoComplete="name"
              placeholder={dictionary.name.placeholder}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${id}-email`}>
              {dictionary.email.label}
            </FieldLabel>
            <Input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              dir="ltr"
              placeholder={dictionary.email.placeholder}
              className="text-start rtl:text-end"
              required
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor={`${id}-phone`}>{dictionary.phone.label}</FieldLabel>
          <Input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder={dictionary.phone.placeholder}
            className="text-start rtl:text-end"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-message`}>
            {dictionary.message.label}
          </FieldLabel>
          <Textarea
            id={`${id}-message`}
            name="message"
            rows={5}
            placeholder={dictionary.message.placeholder}
            className="min-h-32"
            required
          />
        </Field>
        <Button type="submit" size="lg" className="w-full px-5 sm:w-fit">
          {dictionary.submit}
          <Send aria-hidden="true" className="rtl:-scale-x-100" />
        </Button>
      </FieldGroup>
    </form>
  )
}
