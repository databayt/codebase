import PromptsContent from "@/components/root/vibe/prompts/content"
import { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

export const metadata = {
  title: "Prompts | Vibes",
}

interface PageProps {
  params: Promise<{ lang: Locale }>
}

export default async function PromptsPage({ params }: PageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return <PromptsContent dictionary={dictionary} params={{ lang }} />
}
