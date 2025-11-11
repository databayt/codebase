"use client"

import * as React from "react"
import { Check, Clipboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  code?: string
  language?: string
  title?: string
  collapsible?: boolean
}

export function ComponentSource({
  code,
  language = "tsx",
  title,
  collapsible = true,
  className,
  ...props
}: ComponentSourceProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const [isOpen, setIsOpen] = React.useState(!collapsible)

  if (!code) {
    return null
  }

  const content = (
    <div className="relative">
      {title && (
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground border-b">
          <span className="font-mono">{title}</span>
        </div>
      )}
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-4 top-4 h-7 w-7 z-10"
        onClick={() => copyToClipboard(code)}
      >
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Clipboard className="h-4 w-4" />
        )}
      </Button>
      <pre className={cn("overflow-auto p-4 text-sm max-h-96")}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )

  if (!collapsible) {
    return (
      <div className={cn("relative", className)} {...props}>
        {content}
      </div>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={cn("relative", className)} {...props}>
      <div className="flex items-center justify-between p-4 border-t">
        <h4 className="text-sm font-medium">Code</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            {isOpen ? "Hide" : "View"} code
            <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        {content}
      </CollapsibleContent>
    </Collapsible>
  )
}
