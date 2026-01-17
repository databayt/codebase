export interface VibeItem {
  id: string
  title: string
  description: string
  icon: string
  iconFill?: boolean
  href: string
}

export const vibes: VibeItem[] = [
  {
    id: "agents",
    title: "Agents",
    description: "Specialized AI agents for coding tasks.",
    icon: "AgentsIcon",
    href: "/vibes/agents",
  },
  {
    id: "commands",
    title: "Commands",
    description: "Slash commands for AI workflows.",
    icon: "CommandsIcon",
    href: "/vibes/commands",
  },
  {
    id: "skills",
    title: "Skills",
    description: "Reusable skill definitions for AI.",
    icon: "SkillsIcon",
    href: "/vibes/skills",
  },
  {
    id: "hooks",
    title: "Hooks",
    description: "Event hooks for AI automation.",
    icon: "HooksIcon",
    href: "/vibes/hooks",
  },
  {
    id: "claude-md",
    title: "CLAUDE.md",
    description: "Global and project instructions.",
    icon: "ClaudeMdIcon",
    href: "/vibes/claude-md",
  },
  {
    id: "rules",
    title: "Rules",
    description: "AI coding rules and patterns for quick wins.",
    icon: "RulesIcon",
    iconFill: true,
    href: "/vibes/rules",
  },
  {
    id: "prompts",
    title: "Prompts",
    description: "Ready-to-use prompts for AI pair programming.",
    icon: "PromptsIcon",
    iconFill: true,
    href: "/vibes/prompts",
  },
  {
    id: "tweets",
    title: "Tweets",
    description: "Curated articles, blogs, and tweets on vibe coding.",
    icon: "TwitterIcon",
    href: "/vibes/tweets",
  },
  {
    id: "mcp",
    title: "MCP",
    description: "Model Context Protocol for AI coding.",
    icon: "MCPVibeIcon",
    href: "/vibes/mcp",
  },
  {
    id: "cursor",
    title: "Cursor",
    description: "AI pair programming with Cursor.",
    icon: "CursorVibeIcon",
    href: "/vibes/cursor",
  },
  {
    id: "extensions",
    title: "Extensions",
    description: "VSCode extensions for vibe coding.",
    icon: "ExtensionsIcon",
    href: "/vibes/extensions",
  },
]