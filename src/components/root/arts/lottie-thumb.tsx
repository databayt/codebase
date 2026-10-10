"use client"

import { useEffect, useRef, useState } from "react"
import Lottie from "lottie-react"

// Not every .json on the CDN is an animation (icon manifests live there too);
// lottie-web throws on anything without a layer list, so check the shape first.
const isLottieData = (d: unknown): d is object =>
  !!d &&
  typeof d === "object" &&
  Array.isArray((d as { layers?: unknown }).layers) &&
  typeof (d as { w?: unknown }).w === "number" &&
  typeof (d as { h?: unknown }).h === "number"

/**
 * Renders a Lottie `.json` animation as a showroom thumbnail. Fetches the JSON
 * lazily (only when mounted — i.e. when its tab is active) and autoplays on loop.
 * Falls back to the file extension label if the fetch/parse fails or the JSON
 * is not a Lottie animation.
 */
export function LottieThumb({ src }: { src: string }) {
  const [data, setData] = useState<object | null>(null)
  const [failed, setFailed] = useState(false)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      })
      .then((d) => {
        if (!alive.current) return
        if (isLottieData(d)) setData(d)
        else setFailed(true)
      })
      .catch(() => alive.current && setFailed(true))
    return () => {
      alive.current = false
    }
  }, [src])

  if (failed) {
    return (
      <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        JSON
      </span>
    )
  }
  if (!data) {
    return <div className="h-full w-full animate-pulse rounded bg-muted/40" />
  }
  return (
    <Lottie
      animationData={data}
      loop
      autoplay
      style={{ width: "100%", height: "100%" }}
    />
  )
}

export default LottieThumb
