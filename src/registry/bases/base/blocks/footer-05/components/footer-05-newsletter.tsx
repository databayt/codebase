"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FooterDictionary } from "@/registry/bases/base/blocks/footer-05/components/footer-05"

/** Plain email form — wire `onSubmit` to your own list provider. */
export function FooterNewsletter({
  newsletter,
}: {
  newsletter: FooterDictionary["newsletter"]
}) {
  const inputId = React.useId()

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="flex flex-col items-center gap-4 lg:items-start"
    >
      <h2 className="text-base font-medium">{newsletter.title}</h2>
      {newsletter.description && (
        <p className="max-w-xs text-center text-sm text-muted-foreground lg:text-start">
          {newsletter.description}
        </p>
      )}
      <label htmlFor={inputId} className="sr-only">
        {newsletter.emailLabel}
      </label>
      <Input
        id={inputId}
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder={newsletter.emailPlaceholder}
        dir="ltr"
        className="h-9 w-full max-w-60 bg-background rtl:text-end"
      />
      <Button type="submit" size="sm" className="min-w-24">
        {newsletter.subscribe}
      </Button>
    </form>
  )
}
