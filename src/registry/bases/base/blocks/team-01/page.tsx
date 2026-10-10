import { Team } from "@/registry/bases/base/blocks/team-01/components/team-01"
import { dictionary } from "@/registry/bases/base/blocks/team-01/team-01-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Team dictionary={dictionary[locale]} lang={locale} />
}
