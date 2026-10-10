import * as React from "react"
import Link from "next/link"

import { siteConfig } from "./constants"
import { Icons } from "@/components/atom/icons"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function GitHubLink() {
  return (
    <Button asChild size="sm" variant="ghost" className="h-8 shadow-none">
      <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
        <Icons.gitHub />
        <React.Suspense fallback={<Skeleton className="h-4 w-8" />}>
          <StarsCount />
        </React.Suspense>
      </Link>
    </Button>
  )
}

async function StarsCount() {
  // Unauthenticated GitHub allows 60 calls/hour per IP; a rate-limit body or a
  // dropped socket must hide the count, not fail the prerender of every page.
  const stars = await fetch("https://api.github.com/repos/databayt/hogwarts", {
    next: { revalidate: 86400 },
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((json) => json?.stargazers_count)
    .catch(() => undefined)
  if (typeof stars !== "number") return null

  const formattedCount =
    stars >= 1000
      ? stars % 1000 === 0
        ? `${Math.floor(stars / 1000)}k`
        : `${(stars / 1000).toFixed(1)}k`
      : stars.toLocaleString()

  return (
    <span className="text-muted-foreground w-fit text-xs tabular-nums">
      {formattedCount.replace(".0k", "k")}
    </span>
  )
}
