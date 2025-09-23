import React from "react"

export const Index: Record<string, any> = {
  "default": {
    "dashboard-01": {
      "name": "dashboard-01",
      "description": "Analytics dashboard with sidebar navigation, data tables, and charts",
      "component": React.lazy(() => import("@/registry/default/templates/dashboard-01/page")),
      "files": [
        "registry/default/templates/dashboard-01/page.tsx",
        "registry/default/templates/dashboard-01/components/header.tsx",
        "registry/default/templates/dashboard-01/components/overview.tsx",
        "registry/default/templates/dashboard-01/components/recent-sales.tsx",
        "registry/default/templates/dashboard-01/data.json"
      ],
      "dependencies": [
        "@tanstack/react-table",
        "recharts",
        "date-fns"
      ],
      "registryDependencies": [
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
      "categories": [
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-01": {
      "name": "sidebar-01",
      "description": "Collapsible sidebar with multi-level navigation and search",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-01/page")),
      "files": [
        "registry/default/templates/sidebar-01/page.tsx",
        "registry/default/templates/sidebar-01/components/app-sidebar.tsx",
        "registry/default/templates/sidebar-01/components/nav-main.tsx",
        "registry/default/templates/sidebar-01/components/nav-user.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "button",
        "input",
        "tooltip",
        "dropdown-menu",
        "separator",
        "avatar",
        "collapsible"
      ],
      "categories": [
        "sidebar"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "login-01": {
      "name": "login-01",
      "description": "Modern login form with social authentication options",
      "component": React.lazy(() => import("@/registry/default/templates/login-01/page")),
      "files": [
        "registry/default/templates/login-01/page.tsx",
        "registry/default/templates/login-01/components/login-form.tsx"
      ],
      "dependencies": [
        "react-hook-form",
        "zod",
        "@hookform/resolvers"
      ],
      "registryDependencies": [
        "button",
        "card",
        "input",
        "label",
        "form",
        "separator"
      ],
      "categories": [
        "authentication",
        "login"
      ],
      "meta": {
        "iframeHeight": "600px"
      }
    },
    "leads-01": {
      "name": "leads-01",
      "description": "Lead management interface with forms, cards, and analytics",
      "component": React.lazy(() => import("@/registry/default/templates/leads-01/page")),
      "files": [
        "registry/default/templates/leads-01/page.tsx",
        "registry/default/templates/leads-01/components/content.tsx",
        "registry/default/templates/leads-01/components/form.tsx",
        "registry/default/templates/leads-01/components/card.tsx",
        "registry/default/templates/leads-01/components/all.tsx",
        "registry/default/templates/leads-01/components/featured.tsx"
      ],
      "dependencies": [
        "react-hook-form",
        "zod",
        "@hookform/resolvers",
        "@tanstack/react-table"
      ],
      "registryDependencies": [
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
      "categories": [
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "hero-01": {
      "name": "hero-01",
      "description": "Landing page hero section with CTA and gradient background",
      "component": React.lazy(() => import("@/registry/default/templates/hero-01/page")),
      "files": [
        "registry/default/templates/hero-01/page.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button"
      ],
      "categories": [
        "hero"
      ],
      "meta": {
        "iframeHeight": "600px"
      }
    }
  },
  "new-york": {
    "dashboard-01": {
      "name": "dashboard-01",
      "description": "Analytics dashboard with sidebar navigation, data tables, and charts",
      "component": React.lazy(() => import("@/registry/new-york/templates/dashboard-01/page")),
      "files": [
        "registry/new-york/templates/dashboard-01/page.tsx",
        "registry/new-york/templates/dashboard-01/components/header.tsx",
        "registry/new-york/templates/dashboard-01/components/overview.tsx",
        "registry/new-york/templates/dashboard-01/components/recent-sales.tsx",
        "registry/new-york/templates/dashboard-01/data.json"
      ],
      "dependencies": [
        "@tanstack/react-table",
        "recharts",
        "date-fns"
      ],
      "registryDependencies": [
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
      "categories": [
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-01": {
      "name": "sidebar-01",
      "description": "Collapsible sidebar with multi-level navigation and search",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-01/page")),
      "files": [
        "registry/new-york/templates/sidebar-01/page.tsx",
        "registry/new-york/templates/sidebar-01/components/app-sidebar.tsx",
        "registry/new-york/templates/sidebar-01/components/nav-main.tsx",
        "registry/new-york/templates/sidebar-01/components/nav-user.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "button",
        "input",
        "tooltip",
        "dropdown-menu",
        "separator",
        "avatar",
        "collapsible"
      ],
      "categories": [
        "sidebar"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "login-01": {
      "name": "login-01",
      "description": "Modern login form with social authentication options",
      "component": React.lazy(() => import("@/registry/new-york/templates/login-01/page")),
      "files": [
        "registry/new-york/templates/login-01/page.tsx",
        "registry/new-york/templates/login-01/components/login-form.tsx"
      ],
      "dependencies": [
        "react-hook-form",
        "zod",
        "@hookform/resolvers"
      ],
      "registryDependencies": [
        "button",
        "card",
        "input",
        "label",
        "form",
        "separator"
      ],
      "categories": [
        "authentication",
        "login"
      ],
      "meta": {
        "iframeHeight": "600px"
      }
    },
    "leads-01": {
      "name": "leads-01",
      "description": "Lead management interface with forms, cards, and analytics",
      "component": React.lazy(() => import("@/registry/new-york/templates/leads-01/page")),
      "files": [
        "registry/new-york/templates/leads-01/page.tsx",
        "registry/new-york/templates/leads-01/components/content.tsx",
        "registry/new-york/templates/leads-01/components/form.tsx",
        "registry/new-york/templates/leads-01/components/card.tsx",
        "registry/new-york/templates/leads-01/components/all.tsx",
        "registry/new-york/templates/leads-01/components/featured.tsx"
      ],
      "dependencies": [
        "react-hook-form",
        "zod",
        "@hookform/resolvers",
        "@tanstack/react-table"
      ],
      "registryDependencies": [
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
      "categories": [
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "hero-01": {
      "name": "hero-01",
      "description": "Landing page hero section with CTA and gradient background",
      "component": React.lazy(() => import("@/registry/new-york/templates/hero-01/page")),
      "files": [
        "registry/new-york/templates/hero-01/page.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button"
      ],
      "categories": [
        "hero"
      ],
      "meta": {
        "iframeHeight": "600px"
      }
    }
  }
}
