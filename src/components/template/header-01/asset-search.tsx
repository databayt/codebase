"use client"

import * as React from "react"
import { defaultFilter } from "cmdk"
import { Copy, Folder, ImageIcon } from "lucide-react"

import { CommandGroup, CommandItem } from "@/components/ui/command"

/**
 * Spotlight's Assets group — searches every cdn.databayt.org key from the
 * /api/arts index, which is fetched only once the menu first opens.
 *
 * Scope narrows results to one namespace: it comes from the /arts tab you're on
 * (/en/arts/hogwarts…) or from the query itself — `@hogwarts add student` or
 * `hogwarts/ add student`. With a scope and no terms, the group lists that
 * namespace's folders (its app routes).
 */

interface AssetIndex {
  domain: string
  keys: string[]
}

let cache: Promise<AssetIndex> | null = null

/**
 * cmdk filter for the whole menu: asset rows are already matched here, so they
 * score just above zero — they stay visible and sort below any page that matches.
 */
export function spotlightFilter(value: string, search: string, keywords?: string[]) {
  return /^(asset|folder) /.test(value) ? 0.001 : defaultFilter(value, search, keywords)
}

export function useAssetIndex(open: boolean) {
  const [index, setIndex] = React.useState<AssetIndex | null>(null)
  React.useEffect(() => {
    if (!open || index) return
    cache ??= fetch("/api/arts").then((r) => {
      if (!r.ok) throw new Error(String(r.status))
      return r.json()
    })
    cache.then(setIndex).catch(() => {
      cache = null
    })
  }, [open, index])
  return index
}

const IMAGE = /\.(svg|png|jpe?g|webp|avif|gif)$/i
const stemOf = (file: string) => file.replace(/\.[^.]+$/, "").replace(/\.[0-9a-f]{8}$/i, "")

/** Split `@hogwarts add student` / `hogwarts/ add student` into scope + terms. */
export function parseQuery(raw: string, namespaces: Set<string>) {
  const m = raw.match(/^\s*@?([a-z0-9-]+)(?:\/|\s|$)\s*(.*)$/i)
  const ns = m?.[1].toLowerCase()
  const explicit = !!m && (raw.trimStart().startsWith("@") || raw.includes("/"))
  if (ns && explicit && namespaces.has(ns)) return { scope: ns, terms: split(m![2]) }
  return { scope: null, terms: split(raw) }
}

const split = (s: string) => s.toLowerCase().split(/\s+/).filter(Boolean)

interface AssetResultsProps {
  index: AssetIndex
  query: string
  /** the namespace the menu is scoped to (from the /arts tab or the query) */
  scope: string | null
  lang: string
  onNavigate: (href: string) => void
}

export function AssetResults({ index, query, scope, lang, onNavigate }: AssetResultsProps) {
  const namespaces = React.useMemo(() => new Set(index.keys.map((k) => k.split("/")[0])), [index])
  const parsed = parseQuery(query, namespaces)
  const ns = parsed.scope ?? scope
  const terms = parsed.terms
  const [copied, setCopied] = React.useState<string | null>(null)

  const keys = React.useMemo(
    () => (ns ? index.keys.filter((k) => k.startsWith(`${ns}/`)) : index.keys),
    [index, ns],
  )

  const folders = React.useMemo(() => {
    if (!ns || terms.length) return []
    const counts = new Map<string, number>()
    for (const k of keys) {
      const parts = k.split("/")
      if (parts.length > 2) counts.set(parts[1], (counts.get(parts[1]) ?? 0) + 1)
    }
    return [...counts].sort((a, b) => b[1] - a[1])
  }, [keys, ns, terms.length])

  const hits = React.useMemo(() => {
    if (!terms.join("").length || terms.join("").length < 2) return []
    const scored: { key: string; rank: number }[] = []
    for (const key of keys) {
      const lower = key.toLowerCase()
      if (!terms.every((t) => lower.includes(t))) continue
      const file = lower.split("/").pop()!
      scored.push({ key, rank: file.startsWith(terms[0]) ? 0 : file.includes(terms[0]) ? 1 : 2 })
    }
    // Unscoped, assets share the menu with pages — keep them to a handful.
    return scored
      .sort((a, b) => a.rank - b.rank || a.key.length - b.key.length)
      .slice(0, ns ? 20 : 6)
  }, [keys, terms, ns])

  if (!folders.length && !hits.length) return null

  const hrefFor = (key: string) => {
    const parts = key.split("/")
    const file = parts.pop()!
    const dir = parts.slice(0, 2).join("/")
    return `/${lang}/arts/${dir}?q=${encodeURIComponent(stemOf(file))}`
  }

  return (
    <CommandGroup heading={ns ? `Assets in ${ns}` : "Assets"}>
      {folders.map(([folder, count]) => (
        <CommandItem
          key={folder}
          value={`folder ${ns}/${folder}`}
          onSelect={() => onNavigate(`/${lang}/arts/${ns}/${folder}`)}
        >
          <Folder />
          <span className="font-mono text-xs">
            {ns}/{folder}/
          </span>
          <span className="ms-auto text-xs tabular-nums text-muted-foreground">{count}</span>
        </CommandItem>
      ))}
      {hits.map(({ key }) => {
        const url = `https://${index.domain}/${key}`
        return (
          <CommandItem key={key} value={`asset ${key}`} onSelect={() => onNavigate(hrefFor(key))}>
            {IMAGE.test(key) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="" loading="lazy" className="size-5 shrink-0 object-contain" />
            ) : (
              <ImageIcon />
            )}
            <span className="truncate font-mono text-xs">{key}</span>
            <button
              type="button"
              aria-label={`Copy ${url}`}
              title="Copy CDN URL"
              className="ms-auto shrink-0 rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                void navigator.clipboard.writeText(url)
                setCopied(key)
              }}
            >
              {copied === key ? <span className="text-[10px]">Copied</span> : <Copy className="size-3.5" />}
            </button>
          </CommandItem>
        )
      })}
    </CommandGroup>
  )
}
