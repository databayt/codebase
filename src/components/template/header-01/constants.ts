import { MainNavItem, SidebarNavItem } from "./types"


export const siteConfig = {
  name: "Codebase",
  url: "https://cb.databayt.org",
  ogImage: "https://ui.shadcn.com/og.jpg",
  description:
    "A set of beautifully-designed, accessible components and a code distribution platform. Works with your favorite frameworks. Open Source. Open Code.",
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn-ui/ui",
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

