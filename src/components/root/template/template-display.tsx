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
    const item = await getTemplate(name, style) || await getRegistryItem(name)

    if (!item?.files) {
        return null
    }

    const [tree, highlightedFiles] = await Promise.all([
        getCachedFileTree(item.files),
        getCachedHighlightedFiles(item.files),
    ])

    // Serialize to ensure no functions are passed to client components
    const serializedItem = JSON.parse(JSON.stringify(item))
    const serializedTree = JSON.parse(JSON.stringify(tree))
    const serializedFiles = JSON.parse(JSON.stringify(highlightedFiles))

    return (
        <TemplateViewer
            item={serializedItem}
            tree={serializedTree}
            highlightedFiles={serializedFiles}
        />
    )
}

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