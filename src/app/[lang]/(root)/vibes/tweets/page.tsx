import TweetsContent from "@/components/root/vibe/tweets/content"
import { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

export const metadata = {
  title: "Tweets | Vibes",
}

interface PageProps {
  params: Promise<{ lang: Locale }>
}

export default async function TweetsPage({ params }: PageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return <TweetsContent dictionary={dictionary} params={{ lang }} />
}
