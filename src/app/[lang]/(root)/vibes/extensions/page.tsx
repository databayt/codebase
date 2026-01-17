import ExtensionsContent from "@/components/root/vibe/extensions/content"
import { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

export const metadata = {
  title: "Extensions | Vibes",
}

interface PageProps {
  params: Promise<{ lang: Locale }>
}

export default async function ExtensionsPage({ params }: PageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return <ExtensionsContent dictionary={dictionary} params={{ lang }} />
}
