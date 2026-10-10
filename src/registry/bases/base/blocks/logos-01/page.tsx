import { Logos } from "@/registry/bases/base/blocks/logos-01/components/logos-01"
import { dictionary } from "@/registry/bases/base/blocks/logos-01/logos-01-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Logos dictionary={dictionary[locale]} lang={locale} />
}
