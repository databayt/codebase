import { Features } from "@/registry/bases/base/blocks/features-03/components/features-03"
import { dictionary } from "@/registry/bases/base/blocks/features-03/features-03-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Features dictionary={dictionary[locale]} lang={locale} />
}
