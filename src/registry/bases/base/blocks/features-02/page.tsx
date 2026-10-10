import { Features } from "@/registry/bases/base/blocks/features-02/components/features-02"
import { dictionary } from "@/registry/bases/base/blocks/features-02/features-02-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Features dictionary={dictionary[locale]} lang={locale} />
}
