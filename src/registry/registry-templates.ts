import { Registry } from "./schema"

export const templates: Registry = [
  {
    name: "dashboard-01",
    description: "Analytics dashboard with sidebar navigation, data tables, and charts",
    type: "registry:template",
    dependencies: ["@tanstack/react-table", "recharts", "date-fns"],
    registryDependencies: [
      "button",
      "card",
      "input",
      "label",
      "select",
      "separator",
      "sidebar",
      "breadcrumb",
      "dropdown-menu",
      "avatar",
      "badge",
      "table",
      "chart"
    ],
    files: [
      {
        path: "templates/dashboard-01/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/dashboard-01/components/header.tsx",
        type: "registry:component"
      },
      {
        path: "templates/dashboard-01/components/overview.tsx",
        type: "registry:component"
      },
      {
        path: "templates/dashboard-01/components/recent-sales.tsx",
        type: "registry:component"
      },
      {
        path: "templates/dashboard-01/data.json",
        type: "registry:file"
      }
    ],
    categories: ["dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "sidebar-01",
    description: "Collapsible sidebar with multi-level navigation and search",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "sidebar",
      "button",
      "input",
      "tooltip",
      "dropdown-menu",
      "separator",
      "avatar",
      "collapsible"
    ],
    files: [
      {
        path: "templates/sidebar-01/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-01/components/app-sidebar.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-01/components/nav-main.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-01/components/nav-user.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "login-01",
    description: "Modern login form with social authentication options",
    type: "registry:template",
    dependencies: ["react-hook-form", "zod", "@hookform/resolvers"],
    registryDependencies: [
      "button",
      "card",
      "input",
      "label",
      "form",
      "separator"
    ],
    files: [
      {
        path: "templates/login-01/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/login-01/components/login-form.tsx",
        type: "registry:component"
      }
    ],
    categories: ["authentication", "login"],
    meta: {
      iframeHeight: "600px"
    }
  },
  {
    name: "leads-01",
    description: "Lead management interface with forms, cards, and analytics",
    type: "registry:template",
    dependencies: ["react-hook-form", "zod", "@hookform/resolvers", "@tanstack/react-table"],
    registryDependencies: [
      "button",
      "card",
      "input",
      "label",
      "form",
      "table",
      "tabs",
      "badge",
      "dialog",
      "select",
      "textarea"
    ],
    files: [
      {
        path: "templates/leads-01/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/leads-01/components/content.tsx",
        type: "registry:component"
      },
      {
        path: "templates/leads-01/components/form.tsx",
        type: "registry:component"
      },
      {
        path: "templates/leads-01/components/card.tsx",
        type: "registry:component"
      },
      {
        path: "templates/leads-01/components/all.tsx",
        type: "registry:component"
      },
      {
        path: "templates/leads-01/components/featured.tsx",
        type: "registry:component"
      }
    ],
    categories: ["dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "hero-01",
    description: "Landing page hero section with CTA and gradient background",
    type: "registry:template",
    dependencies: [],
    registryDependencies: ["button"],
    files: [
      {
        path: "templates/hero-01/page.tsx",
        type: "registry:page"
      }
    ],
    categories: ["hero"],
    meta: {
      iframeHeight: "600px"
    }
  }
]