import McpContent from "@/components/root/vibe/mcp/content"
import { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

export const metadata = {
  title: "MCP | Vibes",
}

interface PageProps {
  params: Promise<{ lang: Locale }>
}

export default async function McpPage({ params }: PageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return <McpContent dictionary={dictionary} params={{ lang }} />
}
