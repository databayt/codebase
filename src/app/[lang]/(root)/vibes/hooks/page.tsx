import HooksContent from "@/components/root/vibe/hooks/content"
import { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

export const metadata = {
  title: "Hooks | Vibes",
}

interface PageProps {
  params: Promise<{ lang: Locale }>
}

export default async function HooksPage({ params }: PageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return <HooksContent dictionary={dictionary} params={{ lang }} />
}
