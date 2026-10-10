import * as React from "react"
import { type RegistryItem } from "shadcn/schema"

import { highlightCode } from "@/lib/highlight-code"
import {
  createFileTreeForRegistryItemFiles,
  DEFAULT_STYLE,
  getRegistryComponent,
  getRegistryItem,
} from "@/lib/registry"
import { cn } from "@/lib/utils"
import { BlockViewer } from "@/components/docs/block-viewer"

// Port of shadcn's apps/v4/components/block-display.tsx.
export async function BlockDisplay({
  name,
  styleName = DEFAULT_STYLE,
}: {
  name: string
  styleName?: string
}) {
  const item = await getCachedRegistryItem(name, styleName)

  if (!item?.files) {
    return null
  }

  const [tree, highlightedFiles] = await Promise.all([
    getCachedFileTree(item.files),
    getCachedHighlightedFiles(item.files),
  ])

  const Component = getRegistryComponent(name, styleName)

  return (
    <BlockViewer
      item={item}
      tree={tree}
      highlightedFiles={highlightedFiles}
      styleName={styleName}
    >
      {Component ? (
        <div
          className={cn(
            "overflow-hidden rounded-xl border",
            item.meta?.containerClassName
          )}
        >
          <React.Suspense fallback={null}>
            <Component />
          </React.Suspense>
        </div>
      ) : null}
    </BlockViewer>
  )
}

const getCachedRegistryItem = React.cache(
  async (name: string, styleName: string) => {
    return await getRegistryItem(name, styleName)
  }
)

const getCachedFileTree = React.cache(
  async (files: Array<{ path: string; target?: string }>) => {
    if (!files) {
      return null
    }

    return await createFileTreeForRegistryItemFiles(files)
  }
)

const getCachedHighlightedFiles = React.cache(
  async (files: NonNullable<RegistryItem["files"]>) => {
    return await Promise.all(
      files.map(async (file) => ({
        ...file,
        highlightedContent: await highlightCode(file.content ?? ""),
      }))
    )
  }
)
