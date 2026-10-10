"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

// Animated Rive "bubble" gradient behind the hero — originally the databayt.org homepage hero.
function RiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    let rive: { cleanup: () => void } | null = null

    const initRive = async () => {
      if (!canvasRef.current) return
      const { Rive } = await import("@rive-app/webgl2")
      rive = new Rive({
        src: "/templates/hero-04/bubble-tiptap.riv",
        canvas: canvasRef.current,
        artboard: "bubble",
        animations: "bubble-timeline",
        autoplay: true,
      })
    }

    initRive()
    return () => rive?.cleanup()
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Top fade — blends into the header */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 0%, transparent 8%)",
        }}
      />
      <div className="absolute inset-0 z-[1] select-none">
        <div
          className="relative flex select-none items-start justify-center"
          style={{
            top: isMobile ? "50%" : "-40%",
            left: isMobile ? "50%" : "20%",
            transform: isMobile ? "translate(-50%, -50%)" : "none",
            paddingTop: isMobile ? "0" : "20rem",
          }}
        >
          <canvas
            ref={canvasRef}
            className="select-none"
            style={{
              width: isMobile ? "200vw" : "120vw",
              maxWidth: isMobile ? "120rem" : "80rem",
              aspectRatio: isMobile ? "3 / 2" : "2 / 1",
            }}
          />
        </div>
      </div>
    </div>
  )
}

const ctaClass =
  "h-auto w-52 rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:rounded-3xl hover:shadow-[4px_4px_0px_var(--foreground)] active:translate-x-0 active:translate-y-0 active:rounded-2xl active:shadow-none md:w-48 md:py-2"

export default function HeroTemplate() {
  return (
    <section className="relative flex h-screen items-center justify-start overflow-hidden md:justify-center">
      <RiveBackground />
      <div className="relative z-10 px-6 md:px-0">
        <div className="flex flex-col items-start gap-4 text-start md:items-center md:text-center">
          <h1 className="text-5xl font-black sm:text-7xl md:text-6xl lg:text-[90px]">
            Automate the boring,
            <br />
            elevate the wondrous
          </h1>
          <p className="leading-normal text-muted-foreground sm:text-xl sm:leading-8 md:max-w-3xl">
            Building codebase for business automation and open sourcing
            everything. Follow along as we figure this out together.
          </p>
          <div className="mt-2 flex flex-col items-start gap-4 md:mx-auto md:flex-row md:items-center">
            <Button className={`${ctaClass} bg-emerald-700 text-background hover:bg-emerald-700`}>
              Appointment
            </Button>
            <Button variant="outline" className={ctaClass}>
              Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
