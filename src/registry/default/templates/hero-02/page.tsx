import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export default function HeroTemplate() {
  return (
    <section className="relative min-h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-sm font-medium text-white">New Release</span>
            <span className="mx-2 text-white/40">|</span>
            <span className="text-sm text-white/80">Version 2.0 is here</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Transform Your
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Digital Experience
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-300">
            Unlock the full potential of your business with our cutting-edge
            platform. Built for scale, designed for performance, and crafted
            with precision.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg" className="px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-purple-400"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mt-1 text-sm text-white/80">Trusted by 10,000+ users</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
