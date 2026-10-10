import { Pricing } from "@/registry/bases/base/blocks/pricing-01/components/pricing-01"
import { dictionary } from "@/registry/bases/base/blocks/pricing-01/pricing-01-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Pricing dictionary={dictionary[locale]} lang={locale} />
}
