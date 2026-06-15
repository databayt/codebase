import Link from "next/link"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import type { getDictionary } from "@/components/local/dictionaries"

// Default: the Tailwind v4 announcement (used by every hero unless overridden).
const TAILWIND_ICON_PATH =
  "M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"

interface AnnouncementProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
  /** Link target. Defaults to the Tailwind v4 docs. */
  href?: string
  /** Pill label. Defaults to the dictionary's Tailwind copy. */
  label?: string
  /** SVG <title> for a11y. Defaults to "Tailwind CSS". */
  title?: string
  /** 24×24 SVG path data for the leading mark. Defaults to the Tailwind logo. */
  iconPath?: string
  /** Extra classes for the mark (e.g. a brand color via text-[#hex]). */
  iconClassName?: string
}

export function Announcement({
  dictionary,
  href,
  label,
  title,
  iconPath,
  iconClassName,
}: AnnouncementProps) {
  const resolvedHref = href ?? "/docs/tailwind-v4"
  const resolvedTitle = title ?? dictionary?.announcement?.title ?? "Tailwind CSS"
  const resolvedLabel =
    label ?? dictionary?.announcement?.tailwindV4 ?? "Get Started with Tailwind v4"
  const resolvedPath = iconPath ?? TAILWIND_ICON_PATH

  return (
    <Link
      href={resolvedHref}
      className="group mb-2 inline-flex items-center gap-2 px-0.5 text-sm font-medium"
    >
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("h-4 w-4 fill-current", iconClassName)}
      >
        <title>{resolvedTitle}</title>
        <path d={resolvedPath} />
      </svg>
      <span className="underline-offset-4 group-hover:underline">{resolvedLabel}</span>
      <ArrowRight className="ms-1 h-4 w-4 rtl:hidden" />
      <ArrowLeft className="ms-1 h-4 w-4 hidden rtl:block" />
    </Link>
  )
}
