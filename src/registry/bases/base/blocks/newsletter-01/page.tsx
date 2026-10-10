import { Newsletter } from "@/registry/bases/base/blocks/newsletter-01/components/newsletter-01"
import { dictionary } from "@/registry/bases/base/blocks/newsletter-01/newsletter-01-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Newsletter dictionary={dictionary[locale]} lang={locale} />
}
