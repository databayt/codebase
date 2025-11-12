import * as React from "react"
import { registryItemFileSchema } from "./registry"
import { z } from "zod"

import { highlightCode } from "@/lib/highlight-code"
import {
    createFileTreeForRegistryItemFiles,
    getRegistryItem,
} from "@/lib/registry"
import { getTemplate, createFileTreeFromFiles } from "@/lib/templates"
import { TemplateViewer } from "./template-viewer"

export async function TemplateDisplay({ name, style = "default" }: { name: string; style?: string }) {
    // Try to get from template registry first, fallback to general registry
    const item = await getCachedTemplateItem(name, style) || await getCachedRegistryItem(name)

    if (!item?.files) {
        return null
    }

    const [tree, highlightedFiles] = await Promise.all([
        getCachedFileTree(item.files),
        getCachedHighlightedFiles(item.files),
    ])

    return (
        <TemplateViewer item={item} tree={tree} highlightedFiles={highlightedFiles} />
    )
}

const getCachedTemplateItem = React.cache(async (name: string, style: string) => {
    return await getTemplate(name, style)
})

const getCachedRegistryItem = React.cache(async (name: string) => {
    return await getRegistryItem(name)
})

const getCachedFileTree = React.cache(
    async (files: Array<{ path: string; target?: string }>) => {
        if (!files) {
            return null
        }

        return await createFileTreeForRegistryItemFiles(files)
    }
)

const getCachedHighlightedFiles = React.cache(
    async (files: z.infer<typeof registryItemFileSchema>[]) => {
        return await Promise.all(
            files.map(async (file) => ({
                ...file,
                highlightedContent: await highlightCode(file.content ?? ""),
            }))
        )
    }
)