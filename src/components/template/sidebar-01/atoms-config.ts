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
      href: "/atom",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
  ],
  sidebarNav: [
    {
      title: "All Atoms",
      items: [
        { title: "Agent Heading", href: "/atom/agent-heading", items: [] },
        { title: "AI Response Display", href: "/atom/ai-response-display", items: [] },
        { title: "Announcement", href: "/atom/announcement", items: [] },
        { title: "Card", href: "/atom/card", items: [] },
        { title: "Card Hover Effect", href: "/atom/card-hover-effect", items: [] },
        { title: "Cards Metric", href: "/atom/cards-metric", items: [] },
        { title: "Expand Button", href: "/atom/expand-button", items: [] },
        { title: "Faceted", href: "/atom/faceted", items: [] },
        { title: "Gradient Animation", href: "/atom/gradient-animation", items: [] },
        { title: "Header Section", href: "/atom/header-section", items: [] },
        { title: "Infinite Cards", href: "/atom/infinite-cards", items: [] },
        { title: "Infinite Slider", href: "/atom/infinite-slider", items: [] },
        { title: "Loading", href: "/atom/loading", items: [] },
        { title: "Modal", href: "/atom/modal", items: [] },
        { title: "Page Actions", href: "/atom/page-actions", items: [] },
        { title: "Page Header", href: "/atom/page-header", items: [] },
        { title: "Progressive Blur", href: "/atom/progressive-blur", items: [] },
        { title: "Prompt Input", href: "/atom/prompt-input", items: [] },
        { title: "Reasoning", href: "/atom/reasoning", items: [] },
        { title: "Response", href: "/atom/response", items: [] },
        { title: "Simple Marquee", href: "/atom/simple-marquee", items: [] },
        { title: "Sortable", href: "/atom/sortable", items: [] },
        { title: "Sticky Scroll", href: "/atom/sticky-scroll", items: [] },
        { title: "Tabs", href: "/atom/tabs", items: [] },
        { title: "Two Buttons", href: "/atom/two-buttons", items: [] },
      ],
    },
  ],
}
