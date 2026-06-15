"use client"

import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { isImage, type CdnAsset } from "@/lib/cdn"
import { buildFacets } from "./config"

interface IconsGalleryProps {
  assets: CdnAsset[]
  /** manifest.urlBase — "/cdn" for the local seed preview, else https://cdn.databayt.org */
  urlBase: string
  source: string
  domain: string
}

export default function IconsGallery({ assets, urlBase, source, domain }: IconsGalleryProps) {
  const facets = useMemo(() => buildFacets(assets), [assets])
  const counts = useMemo(
    () => Object.fromEntries(facets.map((f) => [f.id, assets.filter(f.test).length])),
    [facets, assets],
  )
  const [active, setActive] = useState(facets[0]?.id ?? "all")

  const activeFacet = facets.find((f) => f.id === active) ?? facets[facets.length - 1]
  const shown = useMemo(() => assets.filter(activeFacet.test), [assets, activeFacet])

  const srcFor = (key: string) =>
    urlBase ? `${urlBase.replace(/\/$/, "")}/${key}` : `https://${domain}/${key}`

  return (
    <div>
      {/* Tab bar — filters the grid in place */}
      <div className="border-b-[0.5px] py-3">
        <ScrollArea className="max-w-[600px] lg:max-w-none">
          <nav className="flex items-center gap-2 rtl:flex-row-reverse">
            {facets.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActive(f.id)}
                data-active={f.id === active}
                className={cn(
                  "flex h-7 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 transition-colors",
                  "hover:text-primary data-[active=true]:bg-muted data-[active=true]:text-primary",
                )}
              >
                <h6>{f.label}</h6>
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {counts[f.id]}
                </span>
              </button>
            ))}
          </nav>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* Grid */}
      <div className="py-12">
        {shown.length === 0 ? (
          <div className="rounded-lg border border-dashed py-16 text-center">
            <p className="text-sm text-muted-foreground">
              No {activeFacet.label} assets yet.
            </p>
            {activeFacet.namespace && (
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                Stage them under{" "}
                <code className="bg-transparent px-0">public/cdn/{activeFacet.namespace}/</code>{" "}
                then run <code className="bg-transparent px-0">pnpm cdn:manifest:local</code>.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {shown.map((a) => {
              const src = srcFor(a.key)
              const file = a.key.split("/").pop() ?? a.key
              const ext = (file.split(".").pop() ?? "").toUpperCase()
              return (
                <a
                  key={a.key}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`/${a.key}`}
                  className="group block"
                >
                  <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border bg-muted/40 p-4 transition-colors group-hover:bg-muted">
                    {isImage(a.key) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={file}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {ext}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 truncate text-center font-mono text-[10px] text-muted-foreground">
                    {file}
                  </p>
                </a>
              )
            })}
          </div>
        )}

        <p className="mt-8 text-sm text-muted-foreground">
          Showing {shown.length} of {assets.length} assets · {source}.
        </p>
      </div>
    </div>
  )
}
