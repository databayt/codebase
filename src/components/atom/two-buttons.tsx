import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Props {
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
  className?: string
}

export function TwoButtons({
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-wrap gap-4", className)}>
      <Button nativeButton={false} render={<Link href={primaryHref} />}>
        {primaryLabel}
      </Button>
      <Button
        variant="ghost"
        nativeButton={false}
        render={<Link href={secondaryHref} />}
      >
        {secondaryLabel}
      </Button>
    </div>
  )
}