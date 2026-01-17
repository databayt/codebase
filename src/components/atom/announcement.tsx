import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import type { getDictionary } from "@/components/local/dictionaries"
import { Badge } from "@/components/ui/badge"

interface AnnouncementProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export function Announcement({ dictionary }: AnnouncementProps) {
  return (
    <Badge asChild variant="secondary" className="bg-transparent">
      <Link href="/docs/changelog">
        <span className="flex size-2 rounded-full bg-blue-500" title="New" />
        {dictionary?.announcement?.text || "npx shadcn create"} <ArrowRightIcon />
      </Link>
    </Badge>
  )
}
