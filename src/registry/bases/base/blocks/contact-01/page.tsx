import { Contact } from "@/registry/bases/base/blocks/contact-01/components/contact-01"
import { dictionary } from "@/registry/bases/base/blocks/contact-01/contact-01-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Contact dictionary={dictionary[locale]} lang={locale} />
}
