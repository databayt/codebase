import * as React from "react"
import { cn } from "@/lib/utils"
import { highlightCode } from "@/lib/highlight-code"
import {
  getDemoItem,
  getRegistryComponent,
  getRegistryItem,
} from "@/lib/registry"
import { CopyButton } from "@/components/docs/copy-button"

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  align?: "center" | "start" | "end"
  hideCode?: boolean
  chromeLessOnMobile?: boolean
  code?: string
  styleName?: string
}

export async function ComponentPreview({
  name,
  children,
  className,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  code: codeProp,
  styleName,
  ...props
}: ComponentPreviewProps) {
  let code = codeProp
  let highlightedCode: string | null = null

  // Mirrors shadcn's components/component-preview.tsx: `name` resolves a demo
  // from examples/ (or a registry item) for both the preview and its source.
  // Inline children still work for docs pages that render ad-hoc previews.
  if (name && !children) {
    const Component = getRegistryComponent(name, styleName)
    if (Component) {
      children = (
        <React.Suspense fallback={null}>
          <Component />
        </React.Suspense>
      )
    }
  }

  if (name && !code) {
    const item =
      (await getDemoItem(name, styleName)) ??
      (await getRegistryItem(name, styleName))
    code = item?.files?.[0]?.content
      ?.replace(/^"use client"\s*\n?/m, "")
      .replace(/\/\* eslint-disable \*\/\s*\n?/g, "")
  }

  if (code) {
    highlightedCode = await highlightCode(code, "tsx")
  }

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
        {!hideCode && code && highlightedCode && (
          <div
            data-slot="code"
            className="overflow-hidden [&_[data-rehype-pretty-code-figure]]:!m-0 [&_[data-rehype-pretty-code-figure]]:rounded-t-none [&_[data-rehype-pretty-code-figure]]:border-t [&_pre]:max-h-[400px]"
          >
            <ComponentCode code={code} highlightedCode={highlightedCode} />
          </div>
        )}
      </div>
    </div>
  )
}

function ComponentCode({
  code,
  highlightedCode,
}: {
  code: string
  highlightedCode: string
}) {
  return (
    <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
      <CopyButton value={code} />
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  )
}
