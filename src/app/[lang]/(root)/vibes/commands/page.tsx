import CommandsContent from "@/components/root/vibe/commands/content"
import { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

export const metadata = {
  title: "Commands | Vibes",
}

interface PageProps {
  params: Promise<{ lang: Locale }>
}

export default async function CommandsPage({ params }: PageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return <CommandsContent dictionary={dictionary} params={{ lang }} />
}
