import Card from "@/components/atom/card"
import { vibes } from "./config"
import {
  RulesIcon,
  PromptsIcon,
  TwitterIcon,
  MCPVibeIcon,
  CursorVibeIcon,
  ExtensionsIcon,
  AgentsIcon,
  CommandsIcon,
  SkillsIcon,
  HooksIcon,
  ClaudeMdIcon,
} from "@/components/atom/icons"
import type { Locale } from '@/components/local/config'

const iconMap = {
  RulesIcon,
  PromptsIcon,
  TwitterIcon,
  MCPVibeIcon,
  CursorVibeIcon,
  ExtensionsIcon,
  AgentsIcon,
  CommandsIcon,
  SkillsIcon,
  HooksIcon,
  ClaudeMdIcon,
}

interface VibesPageProps {
  lang?: Locale
}

export default function VibesPage({ lang = 'en' }: VibesPageProps) {
  return (
    <div className="grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {vibes.map((vibe) => {
        const IconComponent = iconMap[vibe.icon as keyof typeof iconMap]
        return (
          <Card
            key={vibe.id}
            id={vibe.id}
            title={vibe.title}
            description={vibe.description}
            icon={IconComponent ? <IconComponent className={vibe.iconFill ? "fill-current" : ""} /> : null}
            href={`/${lang}${vibe.href}`}
          />
        )
      })}
    </div>
  )
}