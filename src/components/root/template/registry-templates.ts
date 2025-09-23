import { type Registry } from "./registry"

export const templates: Registry["items"] = [
  {
    name: "login-01",
    description: "A simple login form.",
    type: "registry:template",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "template/login-01/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "template/login-01/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "login"],
  },
  {
    name: "hero-01",
    description: "A modern hero section with call-to-action buttons.",
    type: "registry:template",
    registryDependencies: ["button"],
    files: [
      {
        path: "template/hero-01/page.tsx",
        target: "app/hero/page.tsx",
        type: "registry:page",
      },
    ],
    categories: ["hero", "marketing", "landing"],
  },
  {
    name: "sidebar-01",
    description: "Documentation sidebar with navigation menu.",
    type: "registry:template",
    registryDependencies: ["sidebar", "scroll-area"],
    files: [
      {
        path: "template/sidebar-01/content.tsx",
        target: "components/sidebar-nav.tsx",
        type: "registry:component",
      },
      {
        path: "template/sidebar-01/config.ts",
        target: "config/docs.ts",
        type: "registry:component",
      },
      {
        path: "template/sidebar-01/use-mobile.ts",
        target: "hooks/use-mobile.ts",
        type: "registry:hook",
      },
    ],
    categories: ["navigation", "sidebar", "documentation"],
  },
  {
    name: "header-01",
    description: "Main navigation header with mobile menu.",
    type: "registry:template",
    registryDependencies: ["button", "navigation-menu", "sheet"],
    files: [
      {
        path: "template/header-01/content.tsx",
        target: "components/header.tsx",
        type: "registry:component",
      },
      {
        path: "template/header-01/main-nav.tsx",
        target: "components/main-nav.tsx",
        type: "registry:component",
      },
      {
        path: "template/header-01/mobile-nav.tsx",
        target: "components/mobile-nav.tsx",
        type: "registry:component",
      },
      {
        path: "template/header-01/command-menu.tsx",
        target: "components/command-menu.tsx",
        type: "registry:component",
      },
      {
        path: "template/header-01/mode-switcher.tsx",
        target: "components/mode-switcher.tsx",
        type: "registry:component",
      },
      {
        path: "template/header-01/lang-switcher.tsx",
        target: "components/lang-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["navigation", "header"],
  },
  {
    name: "header-02",
    description: "Taxonomy header for category pages.",
    type: "registry:template",
    registryDependencies: [],
    files: [
      {
        path: "template/header-02/taxonomy-header.tsx",
        target: "components/taxonomy-header.tsx",
        type: "registry:component",
      },
    ],
    categories: ["navigation", "header"],
  },
  {
    name: "footer-01",
    description: "Simple footer with links and copyright.",
    type: "registry:template",
    registryDependencies: [],
    files: [
      {
        path: "template/footer-01/content.tsx",
        target: "components/footer.tsx",
        type: "registry:component",
      },
    ],
    categories: ["navigation", "footer"],
  },
  {
    name: "cards",
    description: "Collection of card components for various use cases.",
    type: "registry:template",
    registryDependencies: ["card", "button", "input", "label", "select", "tabs"],
    files: [
      {
        path: "template/cards/index.tsx",
        target: "components/cards/index.tsx",
        type: "registry:component",
      },
      {
        path: "template/cards/activity-goal.tsx",
        target: "components/cards/activity-goal.tsx",
        type: "registry:component",
      },
      {
        path: "template/cards/calendar.tsx",
        target: "components/cards/calendar.tsx",
        type: "registry:component",
      },
      {
        path: "template/cards/chat.tsx",
        target: "components/cards/chat.tsx",
        type: "registry:component",
      },
      {
        path: "template/cards/cookie-settings.tsx",
        target: "components/cards/cookie-settings.tsx",
        type: "registry:component",
      },
      {
        path: "template/cards/create-account.tsx",
        target: "components/cards/create-account.tsx",
        type: "registry:component",
      },
      {
        path: "template/cards/data-table.tsx",
        target: "components/cards/data-table.tsx",
        type: "registry:component",
      },
      {
        path: "template/cards/metric.tsx",
        target: "components/cards/metric.tsx",
        type: "registry:component",
      },
      {
        path: "template/cards/payment-method.tsx",
        target: "components/cards/payment-method.tsx",
        type: "registry:component",
      },
      {
        path: "template/cards/report-issue.tsx",
        target: "components/cards/report-issue.tsx",
        type: "registry:component",
      },
      {
        path: "template/cards/share.tsx",
        target: "components/cards/share.tsx",
        type: "registry:component",
      },
      {
        path: "template/cards/stats.tsx",
        target: "components/cards/stats.tsx",
        type: "registry:component",
      },
      {
        path: "template/cards/team-members.tsx",
        target: "components/cards/team-members.tsx",
        type: "registry:component",
      },
    ],
    categories: ["cards", "components"],
  },
]

// Additional templates from shadcn will be added here as they are implemented
// This includes dashboard, calendar, and other templates