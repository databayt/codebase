"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "center" | "start" | "end"
  hideCode?: boolean
  chromeLessOnMobile?: boolean
  code?: string
}

export function ComponentPreview({
  children,
  className,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  code,
  ...props
}: ComponentPreviewProps) {
  return (
    <div
      className={cn(
        "group relative mt-4 mb-12 flex flex-col gap-2 rounded-lg border",
        className
      )}
      {...props}
    >
      <div data-slot="preview">
        <div
          data-align={align}
          className={cn(
            "preview flex w-full justify-center data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start",
            chromeLessOnMobile ? "sm:p-10" : "h-[450px] p-10"
          )}
        >
          {children}
        </div>
        {!hideCode && code && (
          <div
            data-slot="code"
            className="overflow-hidden [&_[data-rehype-pretty-code-figure]]:!m-0 [&_[data-rehype-pretty-code-figure]]:rounded-t-none [&_[data-rehype-pretty-code-figure]]:border-t [&_pre]:max-h-[400px]"
          >
            <pre className="overflow-auto p-4 text-sm max-h-[400px] m-0 rounded-t-none border-t">
              <code className="language-tsx">{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 