import RulesContent from "@/components/root/vibe/rules/content"
import { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

export const metadata = {
  title: "Rules | Vibes",
}

interface PageProps {
  params: Promise<{ lang: Locale }>
}

export default async function RulesPage({ params }: PageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return <RulesContent dictionary={dictionary} params={{ lang }} />
}
