import SkillsContent from "@/components/root/vibe/skills/content"
import { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

export const metadata = {
  title: "Skills | Vibes",
}

interface PageProps {
  params: Promise<{ lang: Locale }>
}

export default async function SkillsPage({ params }: PageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return <SkillsContent dictionary={dictionary} params={{ lang }} />
}
