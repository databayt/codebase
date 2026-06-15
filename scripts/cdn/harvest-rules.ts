/**
 * scripts/cdn/harvest-rules.ts
 *
 * Single source of truth for WHAT we harvest into the asset CDN and HOW we name it.
 * Imported by the manifest builders, the S3 sync, and the per-brand crawlers
 * (kun's /crawl-anthropic and its airbnb/apple/clickview siblings) so the rules
 * are identical everywhere — fetch, store, list, and show all agree.
 *
 * THE RULE (generalises across vendor brands):
 *   KEEP   → illustrations, diagrams, concept art, and functional UI glyphs.
 *   DROP   → brand/site chrome and third-party logos:
 *            · browser/OS chrome   (favicons, touch icons, webclips, pinned-tab)
 *            · letter / logomarks  (the "A", logomark, symbol fragments)
 *            · third-party logos   (partner / customer logo walls — other brands)
 *            · social media glyphs (x, linkedin, youtube, instagram, …)
 *            · sub-brand / model / section marks (opus/sonnet/haiku/news -icon|-wordmark)
 *   EXCEPT → each brand's own canonical wordmark/logo (KEEP_ALLOWLIST below).
 */

export interface ExcludeRule {
  id: string
  label: string
  test: RegExp
  /** Apply only inside vendor-brand namespaces (anthropic, airbnb, …), not products. */
  vendorOnly?: boolean
}

/** Non-vendor top-level namespaces (their own curated assets aren't brand chrome). */
const SHARED = new Set(["icons", "illustrations", "animations"])
const PRODUCT = new Set(["hogwarts", "souq", "mkan", "shifa", "kun"])
const CONTENT = new Set(["catalog", "clickview"])
function isVendorNamespace(key: string): boolean {
  const top = key.split("/")[0]
  return !SHARED.has(top) && !PRODUCT.has(top) && !CONTENT.has(top)
}

/** Matched against the file NAME (last path segment), case-insensitive. */
export const EXCLUDE_RULES: ExcludeRule[] = [
  {
    id: "chrome",
    label: "Browser / OS chrome",
    test: /(^|[-_])(favicon|webclip|apple-touch-icon|safari-pinned-tab|mask-icon|mstile|android-chrome|app-icon|tile)([-_.]|$)/i,
  },
  {
    id: "partner",
    label: "Third-party / partner logos",
    test: /^(partner|customer|sponsor|company|logo-wall)[-_]/i,
  },
  {
    id: "social",
    label: "Social media icons",
    test: /^(x-twitter|twitter|x|instagram|linkedin|youtube|facebook|tiktok|threads|discord|github|whatsapp|mastodon|bluesky)\.(svg|png)$/i,
  },
  {
    id: "mark",
    label: "Letter / logomarks",
    test: /([-_]a[-_](large|small)|logomark|lettermark|[-_]symbol|[-_]glyph)\.(svg|png)$/i,
  },
  {
    id: "submark",
    label: "Sub-brand / model / section marks",
    test: /[-_](icon|wordmark|logo|logotype|brandmark)\.(svg|png)$/i,
    vendorOnly: true, // product namespaces own legit *-icon / *-logo (marker-icon, school-logo)
  },
]

/**
 * Canonical brand identity assets to KEEP even though they'd match a rule above.
 * Keyed by exact file name. Extend per brand as new canonical marks appear.
 */
export const KEEP_ALLOWLIST = new Set<string>([
  // Anthropic / Claude
  "wordmark.svg",
  "anthropic-wordmark.svg",
  "claude-wordmark.svg",
  "anthropic.svg",
  "claude.svg",
  "starburst.svg",
])

export interface ExcludeMatch {
  id: string
  label: string
}

const nameOf = (key: string): string => key.split("/").pop() ?? key

/** The exclusion rule a key matches, or null when the asset is wanted. */
export function classifyExcluded(key: string): ExcludeMatch | null {
  const name = nameOf(key)
  if (KEEP_ALLOWLIST.has(name.toLowerCase())) return null
  const vendor = isVendorNamespace(key)
  for (const r of EXCLUDE_RULES) {
    if (r.vendorOnly && !vendor) continue
    if (r.test.test(name)) return { id: r.id, label: r.label }
  }
  return null
}

/** True when an asset should be harvested / stored / shown. */
export function isWantedAsset(key: string): boolean {
  return classifyExcluded(key) === null
}

/**
 * Provenance slug overrides — keyed by top-level path segment, for assets that live
 * under a clean structural path but should be filtered by a different source. Empty
 * today: ClickView art lives under the literal `clickview/` namespace, so slugOf()
 * already derives the right slug from the path segment. Kept as the extension point.
 */
const SLUG_BY_PREFIX: Record<string, string> = {}
export function provenanceSlug(key: string): string | undefined {
  return SLUG_BY_PREFIX[key.split("/")[0]]
}

const HASH_RE = /[0-9a-f]{12,}/i
const DIM_RE = /[-_]\d{2,4}x\d{2,4}\b/i

/**
 * Suggest a clean, short, kebab-case name for an asset, or null when the source
 * name is opaque (a bare CMS hash) and a meaningful name must come from crawl
 * context (alt text / page heading). The crawler uses this to flag renames.
 *
 *   6903d22d…-1000x1000.svg            → null   (needs a real name)
 *   advanced-tool-use-2400x1600.svg    → advanced-tool-use.svg
 *   Build_With_Claude.SVG              → build-with-claude.svg
 */
export function suggestCleanName(fileName: string): string | null {
  const dot = fileName.lastIndexOf(".")
  const ext = dot >= 0 ? fileName.slice(dot + 1).toLowerCase() : ""
  let base = dot >= 0 ? fileName.slice(0, dot) : fileName

  base = base.replace(DIM_RE, "") // drop "-1000x1000" dimension suffixes
  // strip leading/trailing hash tokens
  base = base
    .split(/[-_]/)
    .filter((tok) => !(HASH_RE.test(tok) && /^[0-9a-f]+$/i.test(tok)))
    .join("-")
  base = base
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()

  if (!base || HASH_RE.test(base)) return null
  return ext ? `${base}.${ext}` : base
}
