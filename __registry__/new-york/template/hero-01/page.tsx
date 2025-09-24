import { Button } from "@/components/ui/button"

export default function HeroTemplate() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Build something amazing
          </h1>
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            A modern hero section template with responsive design and beautiful typography.
            Perfect for landing pages and marketing sites.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[50%] top-0 h-[48rem] w-[90rem] -translate-x-[50%] opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 blur-3xl" />
        </div>
      </div>
    </section>
  )
}