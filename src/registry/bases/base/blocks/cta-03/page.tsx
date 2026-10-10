import { Cta } from "@/registry/bases/base/blocks/cta-03/components/cta-03"
import { dictionary } from "@/registry/bases/base/blocks/cta-03/cta-03-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Cta dictionary={dictionary[locale]} lang={locale} />
}
