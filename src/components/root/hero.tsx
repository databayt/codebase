import Link from "next/link"
import { Plus } from "lucide-react"

import { Announcement } from "@/components/atom/announcement"
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
  PageActions,
} from "@/components/atom/page-header"
import { Button } from "@/components/ui/button"
import type { getDictionary } from "@/components/local/dictionaries"
import type { Locale } from "@/components/local/config"

const title = "The Foundation for your Design System"
const description =
  "A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code."

interface HeroProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  params: { lang: Locale }
}

export default function Hero({ dictionary, params }: HeroProps) {
  return (
    <PageHeader>
      <Announcement dictionary={dictionary} />
      <PageHeaderHeading className="max-w-4xl">
        {dictionary.homepage?.heading || title}
      </PageHeaderHeading>
      <PageHeaderDescription>
        {dictionary.homepage?.description || description}
      </PageHeaderDescription>
      <PageActions>
        <Button asChild size="sm" className="h-[31px] rounded-lg">
          <Link href={`/${params.lang}/docs`}>
            <Plus className="size-4" />
            {dictionary.actions?.newProject || "New Project"}
          </Link>
        </Button>
        <Button asChild size="sm" variant="ghost" className="rounded-lg">
          <Link href={`/${params.lang}/docs/components`}>
            {dictionary.actions?.viewComponents || "View Components"}
          </Link>
        </Button>
      </PageActions>
    </PageHeader>
  )
}
