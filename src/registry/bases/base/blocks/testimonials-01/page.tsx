import { Testimonials } from "@/registry/bases/base/blocks/testimonials-01/components/testimonials-01"
import { dictionary } from "@/registry/bases/base/blocks/testimonials-01/testimonials-01-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Testimonials dictionary={dictionary[locale]} lang={locale} />
}
