"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { isImage } from "@/lib/cdn"
import { isVideo } from "./config"
import type { ArtsView } from "./resolve"

// Lottie player is loaded only when a .json animation is actually rendered, so
// lottie-web never weighs down the initial showroom bundle.
const LottieThumb = dynamic(
  () => import("./lottie-thumb").then((m) => m.LottieThumb),
  { ssr: false },
)

const isLottie = (key: string) => key.toLowerCase().endsWith(".json")

/** Tiles per page — the big tabs (All, ClickView, Hogwarts) run to thousands. */
const PAGE = 96

const pill = cn(
  "flex h-7 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 transition-colors",
  "hover:text-primary data-[active=true]:bg-muted data-[active=true]:text-primary",
)

interface ArtsGalleryProps {
  lang: string
  view: ArtsView
}

export default function ArtsGallery({ lang, view }: ArtsGalleryProps) {
  const { facet, folder, tabs, folders, assets, total, urlBase, domain, source } = view
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "")
  const [limit, setLimit] = useState(PAGE)

  const shown = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (!terms.length) return assets
    return assets.filter((a) => terms.every((t) => a.key.toLowerCase().includes(t)))
  }, [assets, query])

  const base = `/${lang}/arts`
  const tabHref = (slug: string) => (slug ? `${base}/${slug}` : base)
  const srcFor = (key: string) =>
    urlBase ? `${urlBase.replace(/\/$/, "")}/${key}` : `https://${domain}/${key}`
  const scope = facet.namespace ? `${facet.namespace}/${folder ? `${folder}/` : ""}` : null

  return (
    <div>
      {/* Tab bar — each tab is a URL that mirrors the CDN namespace */}
      <div className="border-b-[0.5px] py-3">
        <ScrollArea className="max-w-[600px] lg:max-w-none">
          <nav className="flex items-center gap-2 rtl:flex-row-reverse">
            {tabs.map((t) => (
              <Link
                key={t.slug}
                href={tabHref(t.slug)}
                scroll={false}
                data-active={t.slug === facet.slug}
                className={pill}
              >
                <h6>{t.label}</h6>
                <span className="text-[10px] tabular-nums text-muted-foreground">{t.count}</span>
              </Link>
            ))}
          </nav>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* Folder chips — the app routes under this namespace (hogwarts/students, hogwarts/school …) */}
      {folders.length > 0 && (
        <div className="border-b-[0.5px] py-2">
          <ScrollArea className="max-w-[600px] lg:max-w-none">
            <nav className="flex items-center gap-1 text-sm rtl:flex-row-reverse">
              <Link
                href={tabHref(facet.slug)}
                scroll={false}
                data-active={!folder}
                className={cn(pill, "h-6 px-3")}
              >
                All
              </Link>
              {folders.map((f) => (
                <Link
                  key={f.slug}
                  href={`${tabHref(facet.slug)}/${f.slug}`}
                  scroll={false}
                  data-active={folder === f.slug || folder?.startsWith(`${f.slug}/`)}
                  className={cn(pill, "h-6 px-3")}
                >
                  {f.slug}
                  <span className="text-[10px] tabular-nums text-muted-foreground">{f.count}</span>
                </Link>
              ))}
            </nav>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>
      )}

      {/* Grid */}
      <div className="py-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setLimit(PAGE)
            }}
            placeholder={`Filter ${assets.length} assets by name…`}
            className="h-8 max-w-xs"
          />
          {scope && (
            <code className="bg-transparent px-0 font-mono text-xs text-muted-foreground">
              {domain}/{scope}
            </code>
          )}
        </div>

        {shown.length === 0 ? (
          <div className="rounded-lg border border-dashed py-16 text-center">
            <p className="text-sm text-muted-foreground">
              {query ? `Nothing matches “${query}”.` : `No ${facet.label} assets yet.`}
            </p>
            {!query && facet.namespace && (
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                Stage them under{" "}
                <code className="bg-transparent px-0">public/cdn/{facet.namespace}/</code>{" "}
                then run <code className="bg-transparent px-0">pnpm cdn:manifest:local</code>.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {shown.slice(0, limit).map((a) => {
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
                    ) : isLottie(a.key) ? (
                      <LottieThumb src={src} />
                    ) : isVideo(a.key) ? (
                      // Poster first, play on hover: a tab of tutorials must not
                      // download and decode every video at once.
                      <video
                        src={a.poster ? src : `${src}#t=0.5`}
                        poster={a.poster ? srcFor(a.poster) : undefined}
                        preload={a.poster ? "none" : "metadata"}
                        loop
                        muted
                        playsInline
                        onMouseEnter={(e) => void e.currentTarget.play().catch(() => {})}
                        onMouseLeave={(e) => e.currentTarget.pause()}
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

        {shown.length > limit && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setLimit((l) => l + PAGE * 2)}
              className="h-8 rounded-full border px-5 text-sm transition-colors hover:bg-muted"
            >
              Show more · {shown.length - limit} left
            </button>
          </div>
        )}

        <p className="mt-8 text-sm text-muted-foreground">
          Showing {Math.min(limit, shown.length)} of {shown.length}
          {shown.length !== total && ` (${total} in total)`} · {source}.
        </p>
      </div>
    </div>
  )
}
