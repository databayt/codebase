import { HowItWorks } from "@/registry/bases/base/blocks/how-it-works-02/components/how-it-works-02"
import { dictionary } from "@/registry/bases/base/blocks/how-it-works-02/how-it-works-02-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <HowItWorks dictionary={dictionary[locale]} lang={locale} />
}
