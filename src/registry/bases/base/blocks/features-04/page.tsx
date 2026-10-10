import { Features } from "@/registry/bases/base/blocks/features-04/components/features-04"
import { dictionary } from "@/registry/bases/base/blocks/features-04/features-04-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return (
    <Features
      dictionary={dictionary[locale]}
      lang={locale}
      columns={3}
      variant="muted"
    />
  )
}
