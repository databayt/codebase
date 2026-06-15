"use client"

import { useEffect, useRef, useState } from "react"
import Lottie from "lottie-react"

/**
 * Renders a Lottie `.json` animation as a showroom thumbnail. Fetches the JSON
 * lazily (only when mounted — i.e. when its tab is active) and autoplays on loop.
 * Falls back to the file extension label if the fetch/parse fails.
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
      .then((d) => alive.current && setData(d))
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
