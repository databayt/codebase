/* eslint-disable react-hooks/static-components */
import * as React from "react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getDemoItem,
  getRegistryComponent,
  getRegistryItem,
} from "@/lib/registry"
import { type Locale } from "@/components/local/config"
import { Index } from "@/registry/__index__"

// Port of shadcn's app/(view)/view/[style]/[name]. Ours sits under [lang]
// so templates that take { dictionary, lang } render Arabic (RTL) on /ar.
export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

const getCachedRegistryItem = React.cache(
  async (name: string, styleName: string) => {
    // Try registry item first, then fall back to demo item (for examples).
    const item = await getRegistryItem(name, styleName)
    if (item) {
      return item
    }
    return await getDemoItem(name, styleName)
  }
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ style: string; name: string }>
}): Promise<Metadata> {
  const { style, name } = await params
  const item = await getCachedRegistryItem(name, style)

  if (!item) {
    return {}
  }

  return {
    title: item.name,
    description: (item as { description?: string }).description,
  }
}

export async function generateStaticParams() {
  const params: Array<{ style: string; name: string }> = []

  for (const style in Index) {
    for (const name in Index[style]) {
      const item = Index[style][name]
      if (
        // Atoms (registry:component) need props; their previews go through
        // examples, so only templates get a standalone view page.
        ["registry:block", "registry:example", "registry:internal"].includes(
          item.type
        )
      ) {
        params.push({ style, name })
      }
    }
  }

  return params
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{ lang: Locale; style: string; name: string }>
}) {
  const { lang, style, name } = await params
  const item = await getCachedRegistryItem(name, style)
  const Component = getRegistryComponent(name, style)

  if (!item || !Component) {
    return notFound()
  }

  return (
    <div
      data-slot="registry-view"
      className="bg-background *:data-[slot=card]:has-[[data-slot=chart]]:shadow-none"
    >
      <Component params={Promise.resolve({ lang })} />
    </div>
  )
}
