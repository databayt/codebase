import manifestData from "@/registry/cdn-manifest.json"
import { type CdnManifest, type CdnAsset, slugOf, isImage } from "@/lib/cdn"

const manifest = manifestData as CdnManifest

/** Resolve an asset's URL: manifest.urlBase ("/cdn" local preview) else the CDN domain. */
function srcFor(key: string): string {
  return manifest.urlBase
    ? `${manifest.urlBase.replace(/\/$/, "")}/${key}`
    : `https://${manifest.domain}/${key}`
}

interface CdnAssetsTableProps {
  className?: string
}

/**
 * One table per top-level CDN path (cdn.databayt.org/anthropic, /catalog, …).
 * Columns: # · Art (small preview) · Name · Slug. Every asset rendered — nothing
 * collapsed. Server component, so it ships as static HTML with lazy-loaded art.
 */
export function CdnAssetsTable({ className }: CdnAssetsTableProps) {
  const groups = new Map<string, CdnAsset[]>()
  for (const a of manifest.assets) {
    const top = a.key.split("/")[0]
    const bucket = groups.get(top) ?? []
    bucket.push(a)
    groups.set(top, bucket)
  }
  const ordered = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))

  return (
    <div className={`my-6 space-y-10 ${className ?? ""}`}>
      {ordered.map(([top, assets]) => {
        const rows = [...assets].sort((a, b) => a.key.localeCompare(b.key))
        return (
          <section key={top}>
            <div className="mb-3 flex items-baseline gap-2">
              <code className="bg-transparent px-0 font-semibold">
                {manifest.domain}/{top}
              </code>
              <span className="text-xs text-muted-foreground">{rows.length} assets</span>
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-muted/40">
                  <tr className="border-b">
                    <th className="w-12 px-3 py-2 font-medium text-muted-foreground">#</th>
                    <th className="w-16 px-3 py-2 font-medium">Art</th>
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="px-3 py-2 font-medium">Slug</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a, i) => {
                    const name = a.key.split("/").pop() ?? a.key
                    const src = srcFor(a.key)
                    const ext = (name.split(".").pop() ?? "").toUpperCase()
                    return (
                      <tr
                        key={a.key}
                        className="border-b border-border/50 last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-3 py-1.5 text-xs tabular-nums text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="px-3 py-1.5">
                          <a href={src} target="_blank" rel="noopener noreferrer" className="block">
                            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded border bg-muted/40">
                              {isImage(a.key) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={src}
                                  alt={name}
                                  loading="lazy"
                                  className="max-h-full max-w-full object-contain"
                                />
                              ) : (
                                <span className="font-mono text-[8px] text-muted-foreground">
                                  {ext}
                                </span>
                              )}
                            </div>
                          </a>
                        </td>
                        <td className="px-3 py-1.5 font-mono text-xs">{name}</td>
                        <td className="px-3 py-1.5">
                          <code className="bg-transparent px-0">{slugOf(a)}</code>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}
    </div>
  )
}
