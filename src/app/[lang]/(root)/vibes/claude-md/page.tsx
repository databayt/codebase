import ClaudeMdContent from "@/components/root/vibe/claude-md/content"
import { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

export const metadata = {
  title: "CLAUDE.md | Vibes",
}

interface PageProps {
  params: Promise<{ lang: Locale }>
}

export default async function ClaudeMdPage({ params }: PageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return <ClaudeMdContent dictionary={dictionary} params={{ lang }} />
}
