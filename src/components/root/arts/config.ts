import type { CdnAsset } from "@/lib/cdn"

/**
 * Showroom tab taxonomy. Tabs are data-driven from the manifest:
 *   Featured (curated) → brands/namespaces → style facets → All.
 * Brands listed in NAMESPACE_ORDER always render a tab (even at 0 assets) so the
 * roadmap is visible and new vendors light up the moment assets are staged under
 * public/cdn/<brand>/. Any extra namespace present in the manifest is appended.
 *
 * URLs mirror the CDN: /arts/<namespace>/<folder> shows cdn.databayt.org/<namespace>/<folder>/,
 * where <folder> is the app route the media belongs to (hogwarts/students, hogwarts/school/bulk).
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
 * Style facets — matched on the filename's last token (`star-outline.svg`,
 * `Stripe_light.svg`), so `light-bulb` or `linear-algebra` don't qualify.
 * NOTE: "fill" is intentionally omitted — it's a real CDN namespace
 * (cdn.databayt.org/fill), so it already renders as a namespace tab.
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
  /** URL segment under /arts — "" for the default tab */
  slug: string
  label: string
  /** which CDN namespace (if any) this tab maps to — drives folder chips + the empty-state hint */
  namespace?: string
  test: (a: CdnAsset) => boolean
}

export const isVideo = (key: string) => /\.(webm|mp4)$/i.test(key)

/** A /shoot still — `<flow>-<step>-<locale>-<w>.<hash>.avif`, one per screen after the manifest fold. */
const isScreen = (key: string) => /-\d+\.[0-9a-f]{8}\.avif$/i.test(key)

/** Filename without extension or content hash: `add-student-ar.8bb3d639.mp4` → `add-student-ar`. */
export const stemOf = (key: string) =>
  (key.split("/").pop() ?? key).replace(/\.[^.]+$/, "").replace(/\.[0-9a-f]{8}$/i, "")

const lastToken = (key: string) => stemOf(key).toLowerCase().split(/[-_.]/).pop() ?? ""

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function buildFacets(assets: CdnAsset[]): Facet[] {
  const facets: Facet[] = []

  // 1) Featured (curated) — only if any curated key is actually present.
  const featured = new Set(FEATURED_KEYS)
  const featuredTest = (a: CdnAsset) => featured.has(a.key)
  if (assets.some(featuredTest)) {
    facets.push({ id: "featured", slug: "", label: "Featured", test: featuredTest })
  }

  // Media from /record and /shoot — tutorials, reels and product screens.
  if (assets.some((a) => isVideo(a.key))) {
    facets.push({ id: "video", slug: "video", label: "Video", test: (a) => isVideo(a.key) })
  }
  if (assets.some((a) => isScreen(a.key))) {
    facets.push({ id: "screens", slug: "screens", label: "Screens", test: (a) => isScreen(a.key) })
  }

  // 2) Brand / namespace tabs — known brands always, then extras present.
  const present = new Set(assets.map((a) => a.key.split("/")[0]))
  const extras = [...present].filter((ns) => !NAMESPACE_ORDER.includes(ns)).sort()
  for (const ns of [...NAMESPACE_ORDER, ...extras]) {
    facets.push({
      id: `ns:${ns}`,
      slug: ns,
      label: NAMESPACE_LABELS[ns] ?? titleCase(ns),
      namespace: ns,
      test: (a) => a.key.startsWith(`${ns}/`),
    })
  }

  // 3) Style facets — only when assets actually carry the token.
  for (const f of STYLE_FACETS) {
    const test = (a: CdnAsset) => lastToken(a.key) === f.id
    if (assets.some(test)) facets.push({ id: `style:${f.id}`, slug: f.id, label: f.label, test })
  }

  // 4) All — catch-all so nothing is unreachable.
  facets.push({ id: "all", slug: "all", label: "All", test: () => true })

  // Without curated keys the first tab still owns the bare /arts URL.
  if (!facets.some((f) => f.slug === "")) facets[0].slug = ""

  return facets
}

export interface Folder {
  slug: string
  count: number
}

/** First-level folders under a namespace — `hogwarts/students/x.mp4` → `students`. Loose files have none. */
export function buildFolders(assets: CdnAsset[], namespace: string): Folder[] {
  const counts = new Map<string, number>()
  for (const a of assets) {
    const parts = a.key.split("/")
    if (parts[0] !== namespace || parts.length < 3) continue
    counts.set(parts[1], (counts.get(parts[1]) ?? 0) + 1)
  }
  return [...counts]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug))
}
