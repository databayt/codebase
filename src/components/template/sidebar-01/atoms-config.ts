export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export type MainNavItem = NavItem

export type SidebarNavItem = NavItemWithChildren

interface AtomsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const atomsConfig: AtomsConfig = {
  mainNav: [
    {
      title: "Atoms",
      href: "/atoms",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        { title: "Introduction", href: "/atoms", items: [] },
      ],
    },
    {
      title: "Layout Components",
      items: [
        { title: "Header Section", href: "/atoms/header-section", items: [] },
        { title: "Page Header", href: "/atoms/page-header", items: [] },
        { title: "Page Actions", href: "/atoms/page-actions", items: [] },
        { title: "Progressive Blur", href: "/atoms/progressive-blur", items: [] },
        { title: "Sticky Scroll", href: "/atoms/sticky-scroll", items: [] },
      ],
    },
    {
      title: "Data Display",
      items: [
        { title: "Agent Heading", href: "/atoms/agent-heading", items: [] },
        { title: "AI Response Display", href: "/atoms/ai-response-display", items: [] },
        { title: "Announcement", href: "/atoms/announcement", items: [] },
        { title: "Card", href: "/atoms/card", items: [] },
        { title: "Card Hover Effect", href: "/atoms/card-hover-effect", items: [] },
        { title: "Cards Metric", href: "/atoms/cards-metric", items: [] },
        { title: "Faceted", href: "/atoms/faceted", items: [] },
        { title: "Reasoning", href: "/atoms/reasoning", items: [] },
        { title: "Response", href: "/atoms/response", items: [] },
        { title: "Tabs", href: "/atoms/tabs", items: [] },
      ],
    },
    {
      title: "Interactive",
      items: [
        { title: "Expand Button", href: "/atoms/expand-button", items: [] },
        { title: "Modal", href: "/atoms/modal", items: [] },
        { title: "Prompt Input", href: "/atoms/prompt-input", items: [] },
        { title: "Sortable", href: "/atoms/sortable", items: [] },
        { title: "Two Buttons", href: "/atoms/two-buttons", items: [] },
      ],
    },
    {
      title: "Animation",
      items: [
        { title: "Gradient Animation", href: "/atoms/gradient-animation", items: [] },
        { title: "Infinite Cards", href: "/atoms/infinite-cards", items: [] },
        // { title: "Infinite Slider", href: "/atoms/infinite-slider", items: [] }, // Temporarily disabled
        { title: "Loading", href: "/atoms/loading", items: [] },
        { title: "Simple Marquee", href: "/atoms/simple-marquee", items: [] },
      ],
    },
  ],
}
