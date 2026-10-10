import { Logos } from "@/registry/bases/base/blocks/logos-02/components/logos-02"
import { dictionary } from "@/registry/bases/base/blocks/logos-02/logos-02-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Logos dictionary={dictionary[locale]} lang={locale} />
}
