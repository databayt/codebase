import { Cta } from "@/registry/bases/base/blocks/cta-02/components/cta-02"
import { dictionary } from "@/registry/bases/base/blocks/cta-02/cta-02-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Cta dictionary={dictionary[locale]} lang={locale} />
}
