import Image from "next/image"

import Hero from "./hero"
import { ExamplesNav } from "./examples-nav"
import { PageNav } from "./page-nav"
import { ThemeSelector } from "./theme-selector"
import { RootComponents } from "./components"
import type { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

interface RootContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  params: { lang: Locale }
}

export default function RootContent({ dictionary, params }: RootContentProps) {
  return (
    <div className="flex flex-1 flex-col">
      <Hero dictionary={dictionary} params={params} />
      <PageNav className="hidden md:flex">
        <ExamplesNav className="[&>a:first-child]:text-primary flex-1 overflow-hidden" />
        <ThemeSelector className="mr-4 hidden md:flex" />
      </PageNav>
      <div className="container-wrapper section-soft flex-1 pb-6">
        <div className="container overflow-hidden">
          {/* Mobile: Show dashboard image */}
          <section className="border-border/50 -mx-4 w-[160vw] overflow-hidden rounded-lg border md:hidden md:w-[150vw]">
            <Image
              src="/images/dashboard-light.png"
              width={1400}
              height={875}
              alt="Dashboard"
              className="block dark:hidden"
              priority
            />
            <Image
              src="/images/dashboard-dark.png"
              width={1400}
              height={875}
              alt="Dashboard"
              className="hidden dark:block"
              priority
            />
          </section>
          {/* Desktop: Show interactive component demos */}
          <section className="theme-container hidden md:block">
            <RootComponents />
          </section>
        </div>
      </div>
    </div>
  )
}
