import { Testimonials } from "@/registry/bases/base/blocks/testimonials-03/components/testimonials-03"
import { dictionary } from "@/registry/bases/base/blocks/testimonials-03/testimonials-03-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Testimonials dictionary={dictionary[locale]} lang={locale} />
}
