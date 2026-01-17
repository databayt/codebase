import AgentsContent from "@/components/root/vibe/agents/content"
import { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

export const metadata = {
  title: "Agents | Vibes",
}

interface PageProps {
  params: Promise<{ lang: Locale }>
}

export default async function AgentsPage({ params }: PageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return <AgentsContent dictionary={dictionary} params={{ lang }} />
}
