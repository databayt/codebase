import { Footer } from "@/registry/bases/base/blocks/footer-03/components/footer-03"
import { dictionary } from "@/registry/bases/base/blocks/footer-03/footer-03-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return (
    <div className="flex min-h-svh flex-col justify-end">
      <Footer dictionary={dictionary[locale]} lang={locale} />
    </div>
  )
}
