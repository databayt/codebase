import { Testimonials } from "@/registry/bases/base/blocks/testimonials-02/components/testimonials-02"
import { dictionary } from "@/registry/bases/base/blocks/testimonials-02/testimonials-02-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Testimonials dictionary={dictionary[locale]} lang={locale} />
}
