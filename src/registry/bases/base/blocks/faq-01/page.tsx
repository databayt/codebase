import { Faq } from "@/registry/bases/base/blocks/faq-01/components/faq-01"
import { dictionary } from "@/registry/bases/base/blocks/faq-01/faq-01-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Faq dictionary={dictionary[locale]} lang={locale} />
}
