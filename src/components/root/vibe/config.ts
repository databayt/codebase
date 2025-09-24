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
    id: "rules",
    title: "Rules",
    description: "AI coding rules and patterns for quick wins.",
    icon: "RulesIcon",
    iconFill: true,
    href: "/rules",
  },
  {
    id: "prompts",
    title: "Prompts",
    description: "Ready-to-use prompts for AI pair programming.",
    icon: "PromptsIcon",
    iconFill: true,
    href: "/prompts",
  },
  {
    id: "tweets",
    title: "Tweets",
    description: "Latest vibe coding updates from Twitter.",
    icon: "TwitterIcon",
    href: "/tweets",
  },
  {
    id: "mcp",
    title: "MCP",
    description: "Model Context Protocol for AI coding.",
    icon: "MCPVibeIcon",
    href: "/mcp",
  },
  {
    id: "cursor",
    title: "Cursor",
    description: "AI pair programming with Cursor.",
    icon: "CursorVibeIcon",
    href: "/cursor",
  },
  {
    id: "extensions",
    title: "Extensions",
    description: "VSCode extensions for vibe coding.",
    icon: "ExtensionsIcon",
    href: "/extensions",
  },
]