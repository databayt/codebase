import { Cta } from "@/registry/bases/base/blocks/cta-01/components/cta-01"
import { dictionary } from "@/registry/bases/base/blocks/cta-01/cta-01-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Cta dictionary={dictionary[locale]} lang={locale} tone="night" />
}
