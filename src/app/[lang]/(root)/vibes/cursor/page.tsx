import CursorContent from "@/components/root/vibe/cursor/content"
import { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

export const metadata = {
  title: "Cursor | Vibes",
}

interface PageProps {
  params: Promise<{ lang: Locale }>
}

export default async function CursorPage({ params }: PageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return <CursorContent dictionary={dictionary} params={{ lang }} />
}
