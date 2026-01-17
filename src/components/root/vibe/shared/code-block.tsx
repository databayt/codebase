"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/docs/copy-button"

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  className?: string
}

export function CodeBlock({ code, language = "markdown", title, className }: CodeBlockProps) {
  return (
    <div className={cn("relative rounded-lg border bg-muted", className)}>
      {title && (
        <div className="flex items-center justify-between border-b px-4 py-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <span className="text-xs text-muted-foreground">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto p-4">
          <code className="text-sm">{code}</code>
        </pre>
        <CopyButton value={code} className="top-2 end-2" />
      </div>
    </div>
  )
}

interface ConfigCardProps {
  title: string
  description: string
  code: string
  language?: string
  className?: string
}

export function ConfigCard({ title, description, code, language = "markdown", className }: ConfigCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-6 space-y-4", className)}>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <CodeBlock code={code} language={language} />
    </div>
  )
}
