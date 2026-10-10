import { Header } from "@/registry/bases/base/blocks/header-03/components/header-03"
import { dictionary } from "@/registry/bases/base/blocks/header-03/header-03-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return (
    <div className="flex min-h-svh flex-col">
      <Header dictionary={dictionary[locale]} lang={locale} />
      <main className="flex-1 bg-muted/40" />
    </div>
  )
}
