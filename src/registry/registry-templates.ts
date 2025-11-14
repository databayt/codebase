import { Registry } from "./schema"

export const templates: Registry = [
  {
    name: "dashboard-01",
    description: "A dashboard with sidebar, charts and data table.",
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
        path: "templates/dashboard-01/components/app-sidebar.tsx",
        type: "registry:component"
      },
      {
        path: "templates/dashboard-01/components/chart-area-interactive.tsx",
        type: "registry:component"
      },
      {
        path: "templates/dashboard-01/components/data-table.tsx",
        type: "registry:component"
      },
      {
        path: "templates/dashboard-01/components/nav-documents.tsx",
        type: "registry:component"
      },
      {
        path: "templates/dashboard-01/components/nav-main.tsx",
        type: "registry:component"
      },
      {
        path: "templates/dashboard-01/components/nav-secondary.tsx",
        type: "registry:component"
      },
      {
        path: "templates/dashboard-01/components/nav-user.tsx",
        type: "registry:component"
      },
      {
        path: "templates/dashboard-01/components/section-cards.tsx",
        type: "registry:component"
      },
      {
        path: "templates/dashboard-01/components/site-header.tsx",
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
  },
  {
    name: "sidebar-03",
    description: "A sidebar with submenus",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible"
    ],
    files: [
      {
        path: "templates/sidebar-03/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-03/components/app-sidebar.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "sidebar-07",
    description: "A sidebar that collapses to icons",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar"
    ],
    files: [
      {
        path: "templates/sidebar-07/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-07/components/app-sidebar.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-07/components/nav-main.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-07/components/nav-projects.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-07/components/nav-user.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-07/components/team-switcher.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  }
]