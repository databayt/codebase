import { Blog } from "@/registry/bases/base/blocks/blog-01/components/blog-01"
import { dictionary } from "@/registry/bases/base/blocks/blog-01/blog-01-dictionary"

export default async function Page({
  params,
}: {
  params?: Promise<{ lang?: string }>
}) {
  const { lang } = (await params) ?? {}
  const locale = lang === "ar" ? "ar" : "en"
  return <Blog dictionary={dictionary[locale]} lang={locale} />
}
