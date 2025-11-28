import { MainNavItem, SidebarNavItem } from "./types"


export const siteConfig = {
  name: "Codebase",
  url: "https://cb.databayt.org",
  ogImage: "https://ui.shadcn.com/og.jpg",
  description:
    "A set of beautifully-designed, accessible components and a code distribution platform. Works with your favorite frameworks. Open Source. Open Code.",
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/databayt/hogwarts",
  },
}

export type SiteConfig = typeof siteConfig

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}


export interface DocsConfig {
    mainNav: MainNavItem[]
    sidebarNav: SidebarNavItem[]
    atomsNav: SidebarNavItem[]
    chartsNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
    mainNav: [
        {
            title: "Home",
            href: "/",
        },
        {
            title: "Docs",
            href: "/docs",
        },
        {
            title: "Atoms",
            href: "/atoms",
        },
        {
            title: "Templates",
            href: "/templates",
        },
        {
            title: "Blocks",
            href: "/blocks",
        },
        {
            title: "Micros",
            href: "/micros",
        },
        {
            title: "Vibes",
            href: "/vibes",
        },
    ],
    sidebarNav: [
        {
            title: "Documentation",
            items: [
                {
                    title: "Introduction",
                    href: "/docs",
                    items: [],
                },
                {
                    title: "Pitch",
                    href: "/docs/pitch",
                    items: [],
                },
                {
                    title: "MVP",
                    href: "/docs/mvp",
                    items: [],
                },
                {
                    title: "PRD",
                    href: "/docs/prd",
                    items: [],
                },
                {
                    title: "Get Started",
                    href: "/docs/get-started",
                    items: [],
                },
                {
                    title: "Architecture",
                    href: "/docs/architecture",
                    items: [],
                },
                {
                    title: "Structure",
                    href: "/docs/structure",
                    items: [],
                },
                {
                    title: "Pattern",
                    href: "/docs/pattern",
                    items: [],
                },
                {
                    title: "Stack",
                    href: "/docs/stack",
                    items: [],
                },
                {
                    title: "Database",
                    href: "/docs/database",
                    items: [],
                },
                {
                    title: "Localhost",
                    href: "/docs/localhost",
                    items: [],
                },
                {
                    title: "Contributing",
                    href: "/docs/contributing",
                    items: [],
                },
                {
                    title: "Shared Economy",
                    href: "/docs/shared-economy",
                    items: [],
                },
                {
                    title: "Competitors",
                    href: "/docs/competitors",
                    items: [],
                },
                {
                    title: "Inspiration",
                    href: "/docs/inspiration",
                    items: [],
                },
                {
                    title: "Demo",
                    href: "/docs/demo",
                    items: [],
                },
            ],
        },
    ],
    atomsNav: [
        {
            title: "Atoms",
            items: [
                { title: "Introduction", href: "/atoms", items: [] },
                { title: "OAuth Button", href: "/atoms/oauth-button", items: [] },
                { title: "OAuth Button Group", href: "/atoms/oauth-button-group", items: [] },
                { title: "Divider With Text", href: "/atoms/divider-with-text", items: [] },
                { title: "Form Field", href: "/atoms/form-field", items: [] },
                { title: "Settings Toggle Row", href: "/atoms/settings-toggle-row", items: [] },
                { title: "Payment Method Selector", href: "/atoms/payment-method-selector", items: [] },
                { title: "User Info Card", href: "/atoms/user-info-card", items: [] },
                { title: "Activity Goal", href: "/atoms/activity-goal", items: [] },
                { title: "Calendar", href: "/atoms/calendar", items: [] },
                { title: "Metric", href: "/atoms/metric", items: [] },
                { title: "Report Issue", href: "/atoms/report-issue", items: [] },
                { title: "Share", href: "/atoms/share", items: [] },
                { title: "Stats", href: "/atoms/stats", items: [] },
                { title: "Card Hover Effect", href: "/atoms/card-hover-effect", items: [] },
                { title: "Cards Metric", href: "/atoms/cards-metric", items: [] },
                { title: "Card", href: "/atoms/card", items: [] },
                { title: "Gradient Animation", href: "/atoms/gradient-animation", items: [] },
                { title: "Infinite Cards", href: "/atoms/infinite-cards", items: [] },
                { title: "Infinite Slider", href: "/atoms/infinite-slider", items: [] },
                { title: "Progressive Blur", href: "/atoms/progressive-blur", items: [] },
                { title: "Simple Marquee", href: "/atoms/simple-marquee", items: [] },
                { title: "Sticky Scroll", href: "/atoms/sticky-scroll", items: [] },
                { title: "Accordion", href: "/atoms/accordion", items: [] },
                { title: "Expand Button", href: "/atoms/expand-button", items: [] },
                { title: "Faceted", href: "/atoms/faceted", items: [] },
                { title: "Sortable", href: "/atoms/sortable", items: [] },
                { title: "Tabs", href: "/atoms/tabs", items: [] },
                { title: "Two Buttons", href: "/atoms/two-buttons", items: [] },
                { title: "AI Prompt Input", href: "/atoms/ai-prompt-input", items: [] },
                { title: "AI Response Display", href: "/atoms/ai-response-display", items: [] },
                { title: "AI Status Indicator", href: "/atoms/ai-status-indicator", items: [] },
                { title: "AI Streaming Text", href: "/atoms/ai-streaming-text", items: [] },
                { title: "Prompt Input", href: "/atoms/prompt-input", items: [] },
                { title: "Reasoning", href: "/atoms/reasoning", items: [] },
                { title: "Response", href: "/atoms/response", items: [] },
                { title: "Agent Heading", href: "/atoms/agent-heading", items: [] },
                { title: "Announcement", href: "/atoms/announcement", items: [] },
                { title: "Header Section", href: "/atoms/header-section", items: [] },
                { title: "Loading", href: "/atoms/loading", items: [] },
                { title: "Modal System", href: "/atoms/modal-system", items: [] },
                { title: "Page Actions", href: "/atoms/page-actions", items: [] },
                { title: "Page Header", href: "/atoms/page-header", items: [] },
                { title: "Theme Provider", href: "/atoms/theme-provider", items: [] },
                { title: "Fonts", href: "/atoms/fonts", items: [] },
                { title: "Icons", href: "/atoms/icons", items: [] },
            ],
        },
    ],
    chartsNav: [
        {
            title: "Getting Started",
            items: [
                {
                    title: "Introduction",
                    href: "/docs/charts",
                    items: [],
                },
                {
                    title: "Installation",
                    href: "/docs/charts/installation",
                    items: [],
                },
                {
                    title: "Theming",
                    href: "/docs/charts/theming",
                    items: [],
                },
            ],
        },
        {
            title: "Charts",
            items: [
                {
                    title: "Area Chart",
                    href: "/docs/charts/area",
                    items: [],
                },
                {
                    title: "Bar Chart",
                    href: "/docs/charts/bar",
                    items: [],
                },
                {
                    title: "Line Chart",
                    href: "/docs/charts/line",
                    items: [],
                },
                {
                    title: "Pie Chart",
                    href: "/docs/charts/pie",
                    items: [],
                },
                {
                    title: "Radar Chart",
                    href: "/docs/charts/radar",
                    items: [],
                },
                {
                    title: "Radial Chart",
                    href: "/docs/charts/radial",
                    items: [],
                },
            ],
        },
        {
            title: "Components",
            items: [
                {
                    title: "Tooltip",
                    href: "/docs/charts/tooltip",
                    items: [],
                },
                {
                    title: "Legend",
                    href: "/docs/charts/legend",
                    items: [],
                },
            ],
        },
    ],
}

