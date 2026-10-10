import * as React from "react"
import fs from "node:fs/promises"
import path from "node:path"
import { highlightCode } from "@/lib/highlight-code"
import { getDemoItem, getRegistryItem } from "@/lib/registry"
import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/docs/copy-button"
import { CodeCollapsibleWrapper } from "@/components/docs/code-collapsible-wrapper"

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  src?: string
  code?: string
  language?: string
  fileName?: string
  title?: string
  collapsible?: boolean
  styleName?: string
}

// Mirrors shadcn's components/component-source.tsx: `name` resolves a demo
// (examples/) or a registry item, `src` reads a file from the repo root.
export async function ComponentSource({
  name,
  src,
  code: codeProp,
  language,
  fileName,
  title,
  collapsible = true,
  styleName,
  className,
  ...props
}: ComponentSourceProps) {
  let code = codeProp

  if (name && !code) {
    const item =
      (await getDemoItem(name, styleName)) ??
      (await getRegistryItem(name, styleName))
    code = item?.files?.[0]?.content
  }

  if (src && !code) {
    try {
      code = await fs.readFile(path.join(process.cwd(), src), "utf-8")
    } catch (error) {
      console.error(`Failed to read file: ${src}`, error)
    }
  }

  code = code
    ?.replace(/^"use client"\s*\n?/m, "")
    .replace(/\/\* eslint-disable \*\/\s*\n?/g, "")

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
