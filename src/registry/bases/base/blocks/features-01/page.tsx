import { Features } from "@/registry/bases/base/blocks/features-01/components/features-01"
import { dictionary } from "@/registry/bases/base/blocks/features-01/features-01-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Features dictionary={dictionary[locale]} lang={locale} />
}
