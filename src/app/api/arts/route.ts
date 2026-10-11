import manifestData from "@/registry/cdn-manifest.json"
import type { CdnManifest } from "@/lib/cdn"

export const dynamic = "force-static"

/**
 * Slim asset index for the ⌘K Spotlight — every CDN key, nothing else (~15 KB gzipped).
 * Built once at build time; the command menu fetches it only when it opens.
 */
export function GET() {
  const { assets, domain } = manifestData as CdnManifest
  return Response.json({ domain, keys: assets.map((a) => a.key) })
}
