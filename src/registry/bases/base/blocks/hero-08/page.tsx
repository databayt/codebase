import { Hero } from "@/registry/bases/base/blocks/hero-08/components/hero-08"
import { dictionary } from "@/registry/bases/base/blocks/hero-08/hero-08-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Hero dictionary={dictionary[locale]} lang={locale} />
}
