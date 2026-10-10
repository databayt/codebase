import { Pricing } from "@/registry/bases/base/blocks/pricing-02/components/pricing-02"
import { dictionary } from "@/registry/bases/base/blocks/pricing-02/pricing-02-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Pricing dictionary={dictionary[locale]} lang={locale} />
}
