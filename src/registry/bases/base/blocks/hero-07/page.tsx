import { Hero } from "@/registry/bases/base/blocks/hero-07/components/hero-07"
import { dictionary } from "@/registry/bases/base/blocks/hero-07/hero-07-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Hero dictionary={dictionary[locale]} lang={locale} />
}
