import { Stats } from "@/registry/bases/base/blocks/stats-02/components/stats-02"
import { dictionary } from "@/registry/bases/base/blocks/stats-02/stats-02-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Stats dictionary={dictionary[locale]} lang={locale} />
}
