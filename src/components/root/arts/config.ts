import type { CdnAsset } from "@/lib/cdn"

/**
 * Showroom tab taxonomy. Tabs are data-driven from the manifest:
 *   Featured (curated) → brands/namespaces → style facets → All.
 * Brands listed in NAMESPACE_ORDER always render a tab (even at 0 assets) so the
 * roadmap is visible and new vendors light up the moment assets are staged under
 * public/cdn/<brand>/. Any extra namespace present in the manifest is appended.
 */

export const NAMESPACE_LABELS: Record<string, string> = {
  anthropic: "Anthropic",
  airbnb: "Airbnb",
  apple: "Apple",
  clickview: "ClickView",
  hogwarts: "Hogwarts",
}

/** Brands shown as tabs regardless of whether they have assets yet. */
export const NAMESPACE_ORDER = ["anthropic", "airbnb", "apple", "clickview", "hogwarts"]

/**
 * Style facets — substring match on the key; only shown when assets carry the token.
 * NOTE: "fill" is intentionally omitted — it's now a real CDN namespace
 * (cdn.databayt.org/fill), so it already renders as a namespace tab. Keeping it
 * here too would produce two identical "Fill" tabs.
 */
export const STYLE_FACETS: { id: string; label: string }[] = [
  { id: "outline", label: "Outline" },
  { id: "line", label: "Line" },
  { id: "light", label: "Light" },
]

/** Curated highlights for the default "Featured" tab. */
export const FEATURED_KEYS = [
  "anthropic/wordmark.svg",
  "anthropic/claude-wordmark.svg",
  "anthropic/starburst.svg",
  "anthropic/favicon.svg",
  "anthropic/hand-head-node.svg",
  "anthropic/code-magnifier.svg",
  "anthropic/hourglass.svg",
  "anthropic/node-constellation.svg",
  "anthropic/node-constitution.svg",
  "anthropic/hand-abacus.svg",
  "hogwarts/logo.png",
  "hogwarts/king-fahad-logo.png",
  "hogwarts/site/harry-potter.png",
]

export interface Facet {
  id: string
  label: string
  /** which CDN namespace (if any) this tab maps to — drives the empty-state hint */
  namespace?: string
  test: (a: CdnAsset) => boolean
}

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function buildFacets(assets: CdnAsset[]): Facet[] {
  const facets: Facet[] = []

  // 1) Featured (curated) — only if any curated key is actually present.
  const featured = new Set(FEATURED_KEYS)
  const featuredTest = (a: CdnAsset) => featured.has(a.key)
  if (assets.some(featuredTest)) {
    facets.push({ id: "featured", label: "Featured", test: featuredTest })
  }

  // 2) Brand / namespace tabs — known brands always, then extras present.
  const present = new Set(assets.map((a) => a.key.split("/")[0]))
  const extras = [...present].filter((ns) => !NAMESPACE_ORDER.includes(ns)).sort()
  for (const ns of [...NAMESPACE_ORDER, ...extras]) {
    facets.push({
      id: `ns:${ns}`,
      label: NAMESPACE_LABELS[ns] ?? titleCase(ns),
      namespace: ns,
      test: (a) => a.key.startsWith(`${ns}/`),
    })
  }

  // 3) Style facets — only when assets actually carry the token.
  for (const f of STYLE_FACETS) {
    const test = (a: CdnAsset) => a.key.toLowerCase().includes(f.id)
    if (assets.some(test)) facets.push({ id: `style:${f.id}`, label: f.label, test })
  }

  // 4) All — catch-all so nothing is unreachable.
  facets.push({ id: "all", label: "All", test: () => true })

  return facets
}
