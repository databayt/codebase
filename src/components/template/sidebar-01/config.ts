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

interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Architecture",
      href: "/docs/architecture",
    },
    {
      title: "Contributing",
      href: "/docs/contribute",
    },
    {
      title: "Community",
      href: "/docs/community",
    },
  ],
  sidebarNav: [
    {
      title: "",  // No section title for flat structure
      items: [
        { title: "Introduction", href: "/docs", items: [] },
        { title: "Get Started", href: "/docs/installation", items: [] },
        { title: "Contributing", href: "/docs/contributing", items: [] },
        { title: "Architecture", href: "/docs/architecture", items: [] },
        { title: "Pattern", href: "/docs/pattern", items: [] },
        { title: "Stack", href: "/docs/stack", items: [] },
        { title: "Localhost", href: "/docs/localhost", items: [] },
        { title: "Pitch", href: "/docs/pitch", items: [] },
        { title: "MVP", href: "/docs/mvp", items: [] },
        { title: "PRD", href: "/docs/prd", items: [] },
        { title: "Shared Economy", href: "/docs/shared-economy", items: [] },
        { title: "Database", href: "/docs/database", items: [] },
        { title: "Demo", href: "/docs/demo", items: [] },
        { title: "Competitors", href: "/docs/competitors", items: [] },
        { title: "Inspiration", href: "/docs/inspiration", items: [] },
        // { title: "Structure", href: "/docs/structure", items: [] },
        // { title: "Roadmap", href: "/docs/roadmap", items: [] },
        // { title: "Changelog", href: "/docs/changelog", items: [] },
        // { title: "Issues", href: "/docs/issues", items: [] },
        // { title: "Claude Code", href: "/docs/claude-code", items: [] },
        // { title: "Vibe Coding", href: "/docs/vibe-coding", items: [] },
        // { title: "Authentication", href: "/docs/authantication", items: [] },
        // { title: "Internationalization", href: "/docs/internationalization", items: [] },
        // { title: "Domain", href: "/docs/domain", items: [] },
        // { title: "Table", href: "/docs/table", items: [] },
        // { title: "Onboarding", href: "/docs/onboarding", items: [] },
        // { title: "ESLint", href: "/docs/eslint", items: [] },
        // { title: "Prettier", href: "/docs/prettier", items: [] },
        // { title: "Community", href: "/docs/community", items: [] },
        // { title: "Code of Conduct", href: "/docs/code-of-conduct", items: [] },
        // { title: "Accordion", href: "/docs/accordion", items: [] },
        // { title: "Button", href: "/docs/button", items: [] },
        // { title: "Card", href: "/docs/card", items: [] },
        // { title: "Typography", href: "/docs/typography", items: [] },
        // { title: "Docs Factory", href: "/docs/docs-factory", items: [] },
        // { title: "Atoms Factory", href: "/docs/atoms-factory", items: [] },
        // { title: "Templates Factory", href: "/docs/templates-factory", items: [] },
      ],
    },
    // {
    //   title: "Governance",
    //   items: [
    //     {
    //       title: "Code of Conduct",
    //       href: "/docs/governance/code-of-conduct",
    //       items: [],
    //     },
    //     {
    //       title: "Decision Making",
    //       href: "/docs/governance/decision-making",
    //       items: [],
    //     },
    //     {
    //       title: "Stock Sharing",
    //       href: "/docs/governance/stock-sharing",
    //       items: [],
    //     },
    //   ],
    // },
    // {
    //   title: "Development",
    //   items: [
    //     {
    //       title: "Development Patterns",
    //       href: "/docs/development/patterns",
    //       items: [],
    //     },
    //     {
    //       title: "Rules & Standards",
    //       href: "/docs/development/rules",
    //       items: [],
    //     },
    //     {
    //       title: "Technical Record",
    //       href: "/docs/development/technical-record",
    //       items: [],
    //     },
    //     {
    //       title: "MCP Protocols",
    //       href: "/docs/development/mcp",
    //       items: [],
    //     },
    //   ],
    // },
    // {
    //   title: "Business",
    //   items: [
    //     {
    //       title: "Roadmap",
    //       href: "/docs/business/roadmap",
    //       items: [],
    //     },
    //     {
    //       title: "Earning Model",
    //       href: "/docs/business/earning",
    //       items: [],
    //     },
    //     {
    //       title: "Sales Process",
    //       href: "/docs/business/sales",
    //       items: [],
    //     },
    //     {
    //       title: "Pricing Strategy",
    //       href: "/docs/business/pricing",
    //       items: [],
    //     },
    //   ],
    // },
    // {
    //   title: "Community",
    //   items: [
    //     {
    //       title: "Issues & Support",
    //       href: "/docs/community/issues",
    //       items: [],
    //     },
    //     {
    //       title: "Discussions",
    //       href: "/docs/community/discussions",
    //       items: [],
    //     },
    //     {
    //       title: "Customer Support",
    //       href: "/docs/community/support",
    //       items: [],
    //     },
    //   ],
    // },
    // {
    //   title: "Legal",
    //   items: [
    //     {
    //       title: "Open Source Licenses",
    //       href: "/docs/legal/licenses",
    //       items: [],
    //     },
    //     {
    //       title: "Terms of Service",
    //       href: "/docs/legal/terms",
    //       items: [],
    //     },
    //     {
    //       title: "Privacy Policy",
    //       href: "/docs/legal/privacy",
    //       items: [],
    //     },
    //   ],
    // },
    // {
    //   title: "Meta",
    //   items: [
    //     {
    //       title: "Changelog",
    //       href: "/docs/meta/changelog",
    //       items: [],
    //     },
    //     {
    //       title: "Site Map",
    //       href: "/docs/meta/sitemap",
    //       items: [],
    //     },
    //     {
    //       title: "API Reference",
    //       href: "/docs/meta/api-reference",
    //       items: [],
    //     },
    //   ],
    // },
  ],
} 