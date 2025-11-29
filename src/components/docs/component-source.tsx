import * as React from "react"
import fs from "node:fs/promises"
import path from "node:path"
import { highlightCode } from "@/lib/highlight-code"
import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/docs/copy-button"
import { CodeCollapsibleWrapper } from "@/components/docs/code-collapsible-wrapper"
import { AtomsIndex } from "@/registry/atoms-index"

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  code?: string
  language?: string
  fileName?: string
  title?: string
  collapsible?: boolean
}

export async function ComponentSource({
  name,
  code: codeProp,
  language,
  fileName,
  title,
  collapsible = true,
  className,
  ...props
}: ComponentSourceProps) {
  let code = codeProp

  // If name provided, fetch from registry
  if (name && !code) {
    const item = AtomsIndex[name]
    if (item?.files?.[0]) {
      const filePath = path.join(process.cwd(), item.files[0].path)
      try {
        code = await fs.readFile(filePath, "utf-8")
        // Transform imports for user consumption
        code = code
          .replace(/^"use client"\s*\n?/m, "")
          .replace(/\/\* eslint-disable \*\/\s*\n?/g, "")
      } catch (error) {
        console.error(`Failed to read file: ${filePath}`, error)
      }
    }
  }

  if (!code) {
    return null
  }

  const lang = language ?? title?.split(".").pop() ?? "tsx"
  const highlightedCode = await highlightCode(code, lang)

  if (!collapsible) {
    return (
      <div className={cn("relative", className)} {...props}>
        <ComponentCode
          code={code}
          highlightedCode={highlightedCode}
          language={lang}
          title={title}
        />
      </div>
    )
  }

  return (
    <CodeCollapsibleWrapper className={className}>
      <ComponentCode
        code={code}
        highlightedCode={highlightedCode}
        language={lang}
        title={title}
      />
    </CodeCollapsibleWrapper>
  )
}

function ComponentCode({
  code,
  highlightedCode,
  language,
  title,
}: {
  code: string
  highlightedCode: string
  language: string
  title: string | undefined
}) {
  return (
    <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
      {title && (
        <figcaption
          data-rehype-pretty-code-title=""
          className="text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
          data-language={language}
        >
          {title}
        </figcaption>
      )}
      <CopyButton value={code} />
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  )
}
