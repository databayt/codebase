import "server-only"

import manifestData from "@/registry/cdn-manifest.json"
import type { CdnAsset, CdnManifest } from "@/lib/cdn"
import { buildFacets, buildFolders, type Folder } from "./config"

const manifest = manifestData as CdnManifest
const facets = buildFacets(manifest.assets)

export interface ArtsTab {
  slug: string
  label: string
  count: number
}

/** One /arts URL resolved on the server — the client only receives the slice it shows. */
export interface ArtsView {
  facet: { slug: string; label: string; namespace?: string }
  /** CDN folder under the namespace, e.g. "students" or "school/bulk" */
  folder?: string
  tabs: ArtsTab[]
  folders: Folder[]
  assets: CdnAsset[]
  total: number
  urlBase: string
  domain: string
  source: string
}

const tabs: ArtsTab[] = facets.map((f) => ({
  slug: f.slug,
  label: f.label,
  count: manifest.assets.filter(f.test).length,
}))

export function resolveArts(slug: string[] = []): ArtsView | null {
  const [head = "", ...rest] = slug
  const facet = facets.find((f) => f.slug === head)
  if (!facet) return null
  if (rest.length && !facet.namespace) return null

  const folder = rest.length ? rest.join("/") : undefined
  const prefix = folder ? `${facet.namespace}/${folder}/` : null
  const assets = manifest.assets.filter((a) => facet.test(a) && (!prefix || a.key.startsWith(prefix)))
  if (folder && assets.length === 0) return null

  return {
    facet: { slug: facet.slug, label: facet.label, namespace: facet.namespace },
    folder,
    tabs,
    folders: facet.namespace ? buildFolders(manifest.assets, facet.namespace) : [],
    assets,
    total: manifest.assets.length,
    urlBase: manifest.urlBase ?? "",
    domain: manifest.domain,
    source: manifest.source,
  }
}

/** Every prerendered /arts path: the default tab, each tab, and each namespace's first-level folders. */
export function artsParams(): { slug: string[] }[] {
  const params: { slug: string[] }[] = []
  for (const f of facets) {
    params.push({ slug: f.slug ? [f.slug] : [] })
    if (!f.namespace) continue
    for (const folder of buildFolders(manifest.assets, f.namespace)) {
      params.push({ slug: [f.slug, folder.slug] })
    }
  }
  return params
}
