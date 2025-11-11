"use client"

import * as React from "react"
import { Check, Clipboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

export function CopyButton({
  value,
  className,
  variant = "ghost",
  tooltip = "Copy to Clipboard",
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string
  tooltip?: string
}) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-slot="copy-button"
          data-copied={isCopied}
          size="icon"
          variant={variant}
          className={cn(
            "bg-code absolute top-3 right-2 z-10 size-7 hover:opacity-100 focus-visible:opacity-100",
            className
          )}
          onClick={() => copyToClipboard(value)}
          {...props}
        >
          <span className="sr-only">Copy</span>
          {isCopied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isCopied ? "Copied" : tooltip}</TooltipContent>
    </Tooltip>
  )
}
