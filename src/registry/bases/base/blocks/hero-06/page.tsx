import { Hero } from "@/registry/bases/base/blocks/hero-06/components/hero-06"
import { dictionary } from "@/registry/bases/base/blocks/hero-06/hero-06-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Hero dictionary={dictionary[locale]} lang={locale} />
}
