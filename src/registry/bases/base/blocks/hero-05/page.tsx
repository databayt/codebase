import { Hero } from "@/registry/bases/base/blocks/hero-05/components/hero-05"
import { dictionary } from "@/registry/bases/base/blocks/hero-05/hero-05-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Hero dictionary={dictionary[locale]} lang={locale} />
}
