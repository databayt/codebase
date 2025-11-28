"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { getDictionary } from "@/components/local/dictionaries"

type Dictionary = Awaited<ReturnType<typeof getDictionary>>

interface CodeBlockWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  expandButtonTitle?: string
  dictionary?: Dictionary
}

export function CodeBlockWrapper({
  expandButtonTitle,
  className,
  children,
  dictionary,
  ...props
}: CodeBlockWrapperProps) {
  const [isOpened, setIsOpened] = React.useState(false)
  const viewCodeText = expandButtonTitle || dictionary?.docs?.viewCode || "View Code"

  return (
    <div className={cn("relative", className)} {...props}>
      <pre className={cn("mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-muted px-4 py-4", {
        "max-h-none": isOpened,
      })}>
        {children}
      </pre>
      <div className={cn("flex items-center justify-end px-4", {
        "hidden": isOpened,
      })}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsOpened(!isOpened)}
          className="h-8 text-xs"
        >
          {viewCodeText}
        </Button>
      </div>
    </div>
  )
} 