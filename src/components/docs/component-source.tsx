"use client"

import * as React from "react"
import { Check, Clipboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string
  language?: string
  fileName?: string
}

export function ComponentSource({
  code,
  language = "tsx",
  fileName,
  className,
  ...props
}: ComponentSourceProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <div className={cn("relative my-4", className)} {...props}>
      {fileName && (
        <div className="flex items-center justify-between rounded-t-md border border-b-0 bg-muted px-4 py-2">
          <span className="text-sm font-mono text-muted-foreground">{fileName}</span>
        </div>
      )}
      <div className="relative">
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
        <pre
          className={cn(
            "overflow-auto rounded-md border bg-muted p-4 text-sm",
            fileName && "rounded-t-none"
          )}
        >
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  )
}
