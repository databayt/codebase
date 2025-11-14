import { Metadata } from "next"
import Link from "next/link"

import Hero from "@/components/root/template/hero"
import { TemplatesNav } from "@/components/root/template/templates-nav"
import { Button } from "@/components/ui/button"
import { getDictionary } from "@/components/local/dictionaries"
import { type Locale } from "@/components/local/config"

const title = "Building Blocks for the Web"
const description = "Clean, modern building blocks. Copy and paste into your apps. Works with all React frameworks. Open Source. Free forever."

export const metadata: Metadata = {
  title,
  description,
}

interface TemplatesLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}

export default async function TemplatesLayout({
  children,
  params,
}: TemplatesLayoutProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return (
    <>
      <Hero dictionary={dictionary} params={{ lang }} />
      <div className="sticky top-16 z-40 w-full border-b bg-background scroll-mt-24">
        <div className="flex items-center justify-between gap-4 py-4">
          <TemplatesNav />
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="hidden shadow-none lg:flex"
          >
            <Link href={`/${lang}/templates/sidebar`}>Browse all templates</Link>
          </Button>
        </div>
      </div>
      <div className="section-soft flex-1 md:py-12">
        <div className="w-full">{children}</div>
      </div>
    </>
  )
}