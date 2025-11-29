import { Metadata } from "next"

import Hero from "@/components/root/template/hero"
import { TemplatesNav } from "@/components/root/template/templates-nav"
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
      <div className="py-3 border-b-[0.5px] px-responsive lg:px-0">
        <div className="rtl:text-right">
          <TemplatesNav />
        </div>
      </div>
      <div className="section-soft flex-1 md:py-12 px-responsive lg:px-0">
        <div className="w-full">{children}</div>
      </div>
    </>
  )
}