import { Stats } from "@/registry/bases/base/blocks/stats-01/components/stats-01"
import { dictionary } from "@/registry/bases/base/blocks/stats-01/stats-01-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Stats dictionary={dictionary[locale]} lang={locale} />
}
