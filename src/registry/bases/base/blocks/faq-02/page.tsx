import { Faq } from "@/registry/bases/base/blocks/faq-02/components/faq-02"
import { dictionary } from "@/registry/bases/base/blocks/faq-02/faq-02-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Faq dictionary={dictionary[locale]} lang={locale} />
}
