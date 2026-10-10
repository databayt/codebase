import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2 } from "lucide-react"

const features = [
  "Free 14-day trial",
  "No credit card required",
  "Cancel anytime",
]

export default function HeroTemplate() {
  return (
    <section className="overflow-hidden bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <Badge variant="secondary" className="mb-4 w-fit">
              Just launched v2.0
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Build products
              <span className="block text-primary">that matter</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Create beautiful, responsive, and accessible applications faster
              than ever before. Our comprehensive toolkit gives you everything
              you need to succeed.
            </p>

            <ul className="mt-8 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="px-8">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6 border-t pt-10">
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-muted-foreground">Active users</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-4">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-8">
                  <div className="space-y-4">
                    <div className="h-24 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur dark:bg-gray-800/80">
                      <div className="h-3 w-16 rounded bg-primary/20" />
                      <div className="mt-2 h-2 w-24 rounded bg-muted" />
                      <div className="mt-4 h-8 w-full rounded bg-primary/10" />
                    </div>
                    <div className="h-32 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur dark:bg-gray-800/80">
                      <div className="h-3 w-20 rounded bg-primary/20" />
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div
                            key={i}
                            className="h-6 rounded bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="h-40 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur dark:bg-gray-800/80">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-400" />
                        <div>
                          <div className="h-2 w-16 rounded bg-muted" />
                          <div className="mt-1 h-2 w-12 rounded bg-muted/60" />
                        </div>
                      </div>
                      <div className="mt-4 h-20 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900" />
                    </div>
                    <div className="h-20 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur dark:bg-gray-800/80">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-16 rounded bg-primary/20" />
                        <div className="h-6 w-6 rounded-full bg-green-400" />
                      </div>
                      <div className="mt-2 h-2 w-full rounded bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
          </div>
        </div>
      </div>
    </section>
  )
}
