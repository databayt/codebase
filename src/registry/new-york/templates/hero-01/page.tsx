import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export default function HeroTemplate() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              <Sparkles className="inline h-4 w-4 mr-1" />
              Announcing our next round of funding.{" "}
              <a href="#" className="font-semibold text-blue-600">
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Build Better Software
            <span className="block text-blue-600">Faster Than Ever</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Empower your development team with our comprehensive template system.
            Create stunning, production-ready applications in minutes, not months.
            Built on modern React patterns and best practices.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="px-8">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Templates
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">50+</div>
              <div className="mt-2 text-sm text-gray-600">Templates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">100K+</div>
              <div className="mt-2 text-sm text-gray-600">Downloads</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">5★</div>
              <div className="mt-2 text-sm text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </section>
  )
}