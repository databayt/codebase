import React from "react"

export const Index: Record<string, any> = {
  "default": {
    "dashboard-01": {
      "name": "dashboard-01",
      "description": "A dashboard with sidebar, charts and data table.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/dashboard-01/page")),
      "files": [
        "registry/default/templates/dashboard-01/page.tsx",
        "registry/default/templates/dashboard-01/components/app-sidebar.tsx",
        "registry/default/templates/dashboard-01/components/chart-area-interactive.tsx",
        "registry/default/templates/dashboard-01/components/data-table.tsx",
        "registry/default/templates/dashboard-01/components/nav-documents.tsx",
        "registry/default/templates/dashboard-01/components/nav-main.tsx",
        "registry/default/templates/dashboard-01/components/nav-secondary.tsx",
        "registry/default/templates/dashboard-01/components/nav-user.tsx",
        "registry/default/templates/dashboard-01/components/section-cards.tsx",
        "registry/default/templates/dashboard-01/components/site-header.tsx",
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
      "type": "registry:template",
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
      "type": "registry:template",
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
    "hero-01": {
      "name": "hero-01",
      "description": "Landing page hero section with CTA and gradient background",
      "type": "registry:template",
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
    },
    "sidebar-03": {
      "name": "sidebar-03",
      "description": "A sidebar with submenus",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-03/page")),
      "files": [
        "registry/default/templates/sidebar-03/page.tsx",
        "registry/default/templates/sidebar-03/components/app-sidebar.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "collapsible"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-07": {
      "name": "sidebar-07",
      "description": "A sidebar that collapses to icons",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-07/page")),
      "files": [
        "registry/default/templates/sidebar-07/page.tsx",
        "registry/default/templates/sidebar-07/components/app-sidebar.tsx",
        "registry/default/templates/sidebar-07/components/nav-main.tsx",
        "registry/default/templates/sidebar-07/components/nav-projects.tsx",
        "registry/default/templates/sidebar-07/components/nav-user.tsx",
        "registry/default/templates/sidebar-07/components/team-switcher.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "collapsible",
        "dropdown-menu",
        "avatar"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-02": {
      "name": "sidebar-02",
      "description": "A sidebar with collapsible sections.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-02/page")),
      "files": [
        "registry/default/templates/sidebar-02/page.tsx",
        "registry/default/templates/sidebar-02/components/app-sidebar.tsx",
        "registry/default/templates/sidebar-02/components/search-form.tsx",
        "registry/default/templates/sidebar-02/components/version-switcher.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "label",
        "dropdown-menu"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-04": {
      "name": "sidebar-04",
      "description": "A floating sidebar with submenus.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-04/page")),
      "files": [
        "registry/default/templates/sidebar-04/page.tsx",
        "registry/default/templates/sidebar-04/components/app-sidebar.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-05": {
      "name": "sidebar-05",
      "description": "A sidebar with collapsible submenus.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-05/page")),
      "files": [
        "registry/default/templates/sidebar-05/page.tsx",
        "registry/default/templates/sidebar-05/components/app-sidebar.tsx",
        "registry/default/templates/sidebar-05/components/search-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "label",
        "collapsible"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-06": {
      "name": "sidebar-06",
      "description": "A sidebar with submenus as dropdowns.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-06/page")),
      "files": [
        "registry/default/templates/sidebar-06/page.tsx",
        "registry/default/templates/sidebar-06/components/app-sidebar.tsx",
        "registry/default/templates/sidebar-06/components/nav-main.tsx",
        "registry/default/templates/sidebar-06/components/sidebar-opt-in-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "card",
        "dropdown-menu"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-08": {
      "name": "sidebar-08",
      "description": "An inset sidebar with secondary navigation.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-08/page")),
      "files": [
        "registry/default/templates/sidebar-08/page.tsx",
        "registry/default/templates/sidebar-08/components/app-sidebar.tsx",
        "registry/default/templates/sidebar-08/components/nav-main.tsx",
        "registry/default/templates/sidebar-08/components/nav-projects.tsx",
        "registry/default/templates/sidebar-08/components/nav-secondary.tsx",
        "registry/default/templates/sidebar-08/components/nav-user.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "collapsible",
        "dropdown-menu",
        "avatar"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-09": {
      "name": "sidebar-09",
      "description": "Collapsible nested sidebars.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-09/page")),
      "files": [
        "registry/default/templates/sidebar-09/page.tsx",
        "registry/default/templates/sidebar-09/components/app-sidebar.tsx",
        "registry/default/templates/sidebar-09/components/nav-user.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "collapsible",
        "dropdown-menu",
        "avatar",
        "switch",
        "label"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-10": {
      "name": "sidebar-10",
      "description": "A sidebar in a popover.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-10/page")),
      "files": [
        "registry/default/templates/sidebar-10/page.tsx",
        "registry/default/templates/sidebar-10/components/app-sidebar.tsx",
        "registry/default/templates/sidebar-10/components/nav-actions.tsx",
        "registry/default/templates/sidebar-10/components/nav-favorites.tsx",
        "registry/default/templates/sidebar-10/components/nav-main.tsx",
        "registry/default/templates/sidebar-10/components/nav-secondary.tsx",
        "registry/default/templates/sidebar-10/components/nav-workspaces.tsx",
        "registry/default/templates/sidebar-10/components/team-switcher.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "popover",
        "collapsible",
        "dropdown-menu"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-11": {
      "name": "sidebar-11",
      "description": "A sidebar with a collapsible file tree.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-11/page")),
      "files": [
        "registry/default/templates/sidebar-11/page.tsx",
        "registry/default/templates/sidebar-11/components/app-sidebar.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "collapsible"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-12": {
      "name": "sidebar-12",
      "description": "A sidebar with a calendar.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-12/page")),
      "files": [
        "registry/default/templates/sidebar-12/page.tsx",
        "registry/default/templates/sidebar-12/components/app-sidebar.tsx",
        "registry/default/templates/sidebar-12/components/calendars.tsx",
        "registry/default/templates/sidebar-12/components/date-picker.tsx",
        "registry/default/templates/sidebar-12/components/nav-user.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "collapsible",
        "calendar",
        "dropdown-menu",
        "avatar"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-13": {
      "name": "sidebar-13",
      "description": "A sidebar in a dialog.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-13/page")),
      "files": [
        "registry/default/templates/sidebar-13/page.tsx",
        "registry/default/templates/sidebar-13/components/settings-dialog.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "button",
        "dialog"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-14": {
      "name": "sidebar-14",
      "description": "A sidebar on the right.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-14/page")),
      "files": [
        "registry/default/templates/sidebar-14/page.tsx",
        "registry/default/templates/sidebar-14/components/app-sidebar.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-15": {
      "name": "sidebar-15",
      "description": "A left and right sidebar.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-15/page")),
      "files": [
        "registry/default/templates/sidebar-15/page.tsx",
        "registry/default/templates/sidebar-15/components/calendars.tsx",
        "registry/default/templates/sidebar-15/components/date-picker.tsx",
        "registry/default/templates/sidebar-15/components/nav-favorites.tsx",
        "registry/default/templates/sidebar-15/components/nav-main.tsx",
        "registry/default/templates/sidebar-15/components/nav-secondary.tsx",
        "registry/default/templates/sidebar-15/components/nav-user.tsx",
        "registry/default/templates/sidebar-15/components/nav-workspaces.tsx",
        "registry/default/templates/sidebar-15/components/sidebar-left.tsx",
        "registry/default/templates/sidebar-15/components/sidebar-right.tsx",
        "registry/default/templates/sidebar-15/components/team-switcher.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "popover",
        "collapsible",
        "dropdown-menu",
        "calendar",
        "avatar"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-16": {
      "name": "sidebar-16",
      "description": "A sidebar with a sticky site header.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/sidebar-16/page")),
      "files": [
        "registry/default/templates/sidebar-16/page.tsx",
        "registry/default/templates/sidebar-16/components/app-sidebar.tsx",
        "registry/default/templates/sidebar-16/components/nav-main.tsx",
        "registry/default/templates/sidebar-16/components/nav-projects.tsx",
        "registry/default/templates/sidebar-16/components/nav-secondary.tsx",
        "registry/default/templates/sidebar-16/components/nav-user.tsx",
        "registry/default/templates/sidebar-16/components/search-form.tsx",
        "registry/default/templates/sidebar-16/components/site-header.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "collapsible",
        "dropdown-menu",
        "avatar",
        "button",
        "label"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "signup-01": {
      "name": "signup-01",
      "description": "A simple signup form.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/signup-01/page")),
      "files": [
        "registry/default/templates/signup-01/page.tsx",
        "registry/default/templates/signup-01/components/signup-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "card",
        "input",
        "label"
      ],
      "categories": [
        "authentication",
        "signup"
      ],
      "meta": {
        "iframeHeight": "600px"
      }
    },
    "signup-02": {
      "name": "signup-02",
      "description": "A two column signup page with a cover image.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/signup-02/page")),
      "files": [
        "registry/default/templates/signup-02/page.tsx",
        "registry/default/templates/signup-02/components/signup-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "input",
        "label"
      ],
      "categories": [
        "authentication",
        "signup"
      ],
      "meta": {
        "iframeHeight": "800px"
      }
    },
    "signup-03": {
      "name": "signup-03",
      "description": "A signup page with a muted background color.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/signup-03/page")),
      "files": [
        "registry/default/templates/signup-03/page.tsx",
        "registry/default/templates/signup-03/components/signup-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "card",
        "input",
        "label"
      ],
      "categories": [
        "authentication",
        "signup"
      ],
      "meta": {
        "iframeHeight": "700px"
      }
    },
    "signup-04": {
      "name": "signup-04",
      "description": "A signup page with form and image.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/signup-04/page")),
      "files": [
        "registry/default/templates/signup-04/page.tsx",
        "registry/default/templates/signup-04/components/signup-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "card",
        "input",
        "label"
      ],
      "categories": [
        "authentication",
        "signup"
      ],
      "meta": {
        "iframeHeight": "800px"
      }
    },
    "signup-05": {
      "name": "signup-05",
      "description": "A simple signup form with social providers.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/signup-05/page")),
      "files": [
        "registry/default/templates/signup-05/page.tsx",
        "registry/default/templates/signup-05/components/signup-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "input",
        "label"
      ],
      "categories": [
        "authentication",
        "signup"
      ],
      "meta": {
        "iframeHeight": "600px"
      }
    },
    "subscription-01": {
      "name": "subscription-01",
      "description": "Subscription management with plan details, billing info, and cancel/update actions",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/subscription-01/page")),
      "files": [
        "registry/default/templates/subscription-01/page.tsx"
      ],
      "dependencies": [
        "lucide-react"
      ],
      "registryDependencies": [
        "button",
        "card",
        "badge",
        "separator",
        "dialog",
        "radio-group",
        "label"
      ],
      "categories": [
        "subscription"
      ],
      "meta": {
        "iframeHeight": "800px"
      }
    },
    "subscription-02": {
      "name": "subscription-02",
      "description": "Invoice history table with status badges, dates, and download actions",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/subscription-02/page")),
      "files": [
        "registry/default/templates/subscription-02/page.tsx"
      ],
      "dependencies": [
        "lucide-react"
      ],
      "registryDependencies": [
        "card",
        "button",
        "table",
        "badge"
      ],
      "categories": [
        "subscription"
      ],
      "meta": {
        "iframeHeight": "600px"
      }
    },
    "subscription-03": {
      "name": "subscription-03",
      "description": "Usage tracking table with token consumption and cost breakdown",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/subscription-03/page")),
      "files": [
        "registry/default/templates/subscription-03/page.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "table",
        "card"
      ],
      "categories": [
        "subscription"
      ],
      "meta": {
        "iframeHeight": "500px"
      }
    },
    "header-01": {
      "name": "header-01",
      "description": "Responsive navigation header with logo and menu links",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/header-01/page")),
      "files": [
        "registry/default/templates/header-01/page.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "navigation-menu",
        "sheet"
      ],
      "categories": [
        "header"
      ],
      "meta": {
        "iframeHeight": "100px"
      }
    },
    "header-02": {
      "name": "header-02",
      "description": "Header with dropdown navigation and user menu",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/header-02/page")),
      "files": [
        "registry/default/templates/header-02/page.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "navigation-menu",
        "dropdown-menu",
        "avatar"
      ],
      "categories": [
        "header"
      ],
      "meta": {
        "iframeHeight": "100px"
      }
    },
    "footer-01": {
      "name": "footer-01",
      "description": "Simple footer with links and copyright",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/footer-01/page")),
      "files": [
        "registry/default/templates/footer-01/page.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "separator"
      ],
      "categories": [
        "footer"
      ],
      "meta": {
        "iframeHeight": "200px"
      }
    },
    "footer-02": {
      "name": "footer-02",
      "description": "Footer with newsletter signup and social links",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/footer-02/page")),
      "files": [
        "registry/default/templates/footer-02/page.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "input",
        "separator"
      ],
      "categories": [
        "footer"
      ],
      "meta": {
        "iframeHeight": "300px"
      }
    },
    "hero-02": {
      "name": "hero-02",
      "description": "Hero section with image background and overlay",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/hero-02/page")),
      "files": [
        "registry/default/templates/hero-02/page.tsx"
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
    },
    "hero-03": {
      "name": "hero-03",
      "description": "Hero with split layout - content and image",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/default/templates/hero-03/page")),
      "files": [
        "registry/default/templates/hero-03/page.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "badge"
      ],
      "categories": [
        "hero"
      ],
      "meta": {
        "iframeHeight": "600px"
      }
    },
    "activity-goal": {
      "name": "activity-goal",
      "description": "Activity goal tracking card with chart visualization",
      "type": "registry:atom",
      "files": [
        "components/atom/activity-goal.tsx"
      ],
      "dependencies": [
        "recharts"
      ],
      "registryDependencies": [
        "button",
        "card",
        "chart"
      ],
      "categories": [
        "display",
        "data"
      ],
      "meta": {}
    },
    "calendar": {
      "name": "calendar",
      "description": "Interactive calendar card component",
      "type": "registry:atom",
      "files": [
        "components/atom/calendar.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card",
        "calendar"
      ],
      "categories": [
        "display",
        "interactive"
      ],
      "meta": {}
    },
    "chat": {
      "name": "chat",
      "description": "Composable chat primitives with context-based state management",
      "type": "registry:atom",
      "files": [
        "components/atom/chat.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card",
        "avatar",
        "input",
        "button"
      ],
      "categories": [
        "display",
        "interactive"
      ],
      "meta": {}
    },
    "data-table": {
      "name": "data-table",
      "description": "Composable data table primitives with sorting, filtering, and pagination",
      "type": "registry:atom",
      "files": [
        "components/atom/data-table.tsx"
      ],
      "dependencies": [
        "@tanstack/react-table"
      ],
      "registryDependencies": [
        "card",
        "table",
        "button",
        "input",
        "dropdown-menu"
      ],
      "categories": [
        "data",
        "display"
      ],
      "meta": {}
    },
    "metric": {
      "name": "metric",
      "description": "Metric display card with progress indicator",
      "type": "registry:atom",
      "files": [
        "components/atom/metric.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card",
        "progress"
      ],
      "categories": [
        "data",
        "display"
      ],
      "meta": {}
    },
    "report-issue": {
      "name": "report-issue",
      "description": "Issue reporting form card",
      "type": "registry:atom",
      "files": [
        "components/atom/report-issue.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card",
        "button",
        "input",
        "label",
        "select",
        "textarea"
      ],
      "categories": [
        "form"
      ],
      "meta": {}
    },
    "share": {
      "name": "share",
      "description": "Social sharing card with multiple platforms",
      "type": "registry:atom",
      "files": [
        "components/atom/share.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card",
        "button",
        "input",
        "separator"
      ],
      "categories": [
        "ui",
        "interactive"
      ],
      "meta": {}
    },
    "stats": {
      "name": "stats",
      "description": "Statistics overview card with multiple metrics",
      "type": "registry:atom",
      "files": [
        "components/atom/stats.tsx"
      ],
      "dependencies": [
        "recharts"
      ],
      "registryDependencies": [
        "card",
        "chart"
      ],
      "categories": [
        "data",
        "display"
      ],
      "meta": {}
    },
    "team-member": {
      "name": "team-member",
      "description": "Composable team member primitives with role management",
      "type": "registry:atom",
      "files": [
        "components/atom/team-member.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card",
        "button",
        "avatar",
        "popover",
        "command"
      ],
      "categories": [
        "display",
        "form"
      ],
      "meta": {}
    },
    "ai-prompt-input": {
      "name": "ai-prompt-input",
      "description": "AI-powered prompt input component with suggestions and completions",
      "type": "registry:atom",
      "files": [
        "components/atom/ai/ai-prompt-input.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "textarea"
      ],
      "categories": [
        "ai",
        "form"
      ],
      "meta": {}
    },
    "ai-status-indicator": {
      "name": "ai-status-indicator",
      "description": "Visual indicator for AI processing states",
      "type": "registry:atom",
      "files": [
        "components/atom/ai/ai-status-indicator.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ai",
        "feedback"
      ],
      "meta": {}
    },
    "ai-streaming-text": {
      "name": "ai-streaming-text",
      "description": "Streaming text animation for AI responses",
      "type": "registry:atom",
      "files": [
        "components/atom/ai/ai-streaming-text.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ai",
        "display"
      ],
      "meta": {}
    },
    "ai-response-display": {
      "name": "ai-response-display",
      "description": "Display AI responses with markdown and code highlighting",
      "type": "registry:atom",
      "files": [
        "components/atom/ai-response-display.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card"
      ],
      "categories": [
        "ai",
        "display"
      ],
      "meta": {}
    },
    "prompt-input": {
      "name": "prompt-input",
      "description": "Advanced prompt input with keyboard shortcuts and suggestions",
      "type": "registry:atom",
      "files": [
        "components/atom/prompt-input.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "textarea"
      ],
      "categories": [
        "ai",
        "form"
      ],
      "meta": {}
    },
    "response": {
      "name": "response",
      "description": "Response container with formatting and actions",
      "type": "registry:atom",
      "files": [
        "components/atom/response.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ai",
        "display"
      ],
      "meta": {}
    },
    "reasoning": {
      "name": "reasoning",
      "description": "Display reasoning steps and thought processes",
      "type": "registry:atom",
      "files": [
        "components/atom/reasoning.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ai",
        "display"
      ],
      "meta": {}
    },
    "card": {
      "name": "card",
      "description": "Enhanced card component with hover effects",
      "type": "registry:atom",
      "files": [
        "components/atom/card.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card"
      ],
      "categories": [
        "display",
        "layout"
      ],
      "meta": {}
    },
    "card-hover-effect": {
      "name": "card-hover-effect",
      "description": "Card with animated hover effects and transitions",
      "type": "registry:atom",
      "files": [
        "components/atom/card-hover-effect.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "display",
        "animation"
      ],
      "meta": {}
    },
    "cards-metric": {
      "name": "cards-metric",
      "description": "Metric display cards with statistics",
      "type": "registry:atom",
      "files": [
        "components/atom/cards-metric.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card"
      ],
      "categories": [
        "display",
        "data"
      ],
      "meta": {}
    },
    "gradient-animation": {
      "name": "gradient-animation",
      "description": "Animated gradient background effect",
      "type": "registry:atom",
      "files": [
        "components/atom/gradient-animation.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "animation",
        "display"
      ],
      "meta": {}
    },
    "infinite-cards": {
      "name": "infinite-cards",
      "description": "Infinite scrolling card carousel",
      "type": "registry:atom",
      "files": [
        "components/atom/infinite-cards.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "animation",
        "display"
      ],
      "meta": {}
    },
    "infinite-slider": {
      "name": "infinite-slider",
      "description": "Infinite auto-scrolling slider with smooth animations",
      "type": "registry:atom",
      "files": [
        "components/atom/infinite-slider.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "animation",
        "display"
      ],
      "meta": {}
    },
    "progressive-blur": {
      "name": "progressive-blur",
      "description": "Progressive blur effect for images and backgrounds",
      "type": "registry:atom",
      "files": [
        "components/atom/progressive-blur.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "animation",
        "display"
      ],
      "meta": {}
    },
    "sticky-scroll": {
      "name": "sticky-scroll",
      "description": "Sticky scroll reveal animation",
      "type": "registry:atom",
      "files": [
        "components/atom/sticky-scroll.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "animation",
        "display"
      ],
      "meta": {}
    },
    "simple-marquee": {
      "name": "simple-marquee",
      "description": "Simple auto-scrolling marquee component",
      "type": "registry:atom",
      "files": [
        "components/atom/simple-marquee.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "animation",
        "display"
      ],
      "meta": {}
    },
    "oauth-button": {
      "name": "oauth-button",
      "description": "Single OAuth button with provider icon",
      "type": "registry:atom",
      "files": [
        "components/atom/oauth-button.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "icons"
      ],
      "categories": [
        "form",
        "authentication"
      ],
      "meta": {}
    },
    "oauth-button-group": {
      "name": "oauth-button-group",
      "description": "Grid of OAuth buttons for multiple providers",
      "type": "registry:atom",
      "files": [
        "components/atom/oauth-button-group.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "oauth-button"
      ],
      "categories": [
        "form",
        "authentication"
      ],
      "meta": {}
    },
    "divider-with-text": {
      "name": "divider-with-text",
      "description": "Horizontal divider with centered text label",
      "type": "registry:atom",
      "files": [
        "components/atom/divider-with-text.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ui",
        "layout"
      ],
      "meta": {}
    },
    "user-info-card": {
      "name": "user-info-card",
      "description": "User avatar with name and email display",
      "type": "registry:atom",
      "files": [
        "components/atom/user-info-card.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "avatar"
      ],
      "categories": [
        "display",
        "user"
      ],
      "meta": {}
    },
    "settings-toggle-row": {
      "name": "settings-toggle-row",
      "description": "Settings row with label, description, and toggle switch",
      "type": "registry:atom",
      "files": [
        "components/atom/settings-toggle-row.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "switch",
        "label"
      ],
      "categories": [
        "form",
        "settings"
      ],
      "meta": {}
    },
    "form-field": {
      "name": "form-field",
      "description": "Form field primitives with label and input",
      "type": "registry:atom",
      "files": [
        "components/atom/form-field.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "input",
        "label"
      ],
      "categories": [
        "form",
        "input"
      ],
      "meta": {}
    },
    "payment-method-selector": {
      "name": "payment-method-selector",
      "description": "Payment method radio selector with icons",
      "type": "registry:atom",
      "files": [
        "components/atom/payment-method-selector.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "radio-group",
        "label",
        "icons"
      ],
      "categories": [
        "form",
        "payment"
      ],
      "meta": {}
    },
    "faceted": {
      "name": "faceted",
      "description": "Faceted filter component for data tables",
      "type": "registry:atom",
      "files": [
        "components/atom/faceted.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "popover",
        "checkbox",
        "separator",
        "badge"
      ],
      "categories": [
        "form",
        "interactive"
      ],
      "meta": {}
    },
    "sortable": {
      "name": "sortable",
      "description": "Drag-and-drop sortable list component",
      "type": "registry:atom",
      "files": [
        "components/atom/sortable.tsx"
      ],
      "dependencies": [
        "@dnd-kit/core",
        "@dnd-kit/sortable",
        "@dnd-kit/utilities"
      ],
      "registryDependencies": [],
      "categories": [
        "interactive",
        "form"
      ],
      "meta": {}
    },
    "expand-button": {
      "name": "expand-button",
      "description": "Expandable button with reveal animation",
      "type": "registry:atom",
      "files": [
        "components/atom/expand-button.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button"
      ],
      "categories": [
        "interactive",
        "ui"
      ],
      "meta": {}
    },
    "header-section": {
      "name": "header-section",
      "description": "Reusable header section component",
      "type": "registry:atom",
      "files": [
        "components/atom/header-section.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "layout",
        "navigation"
      ],
      "meta": {}
    },
    "page-actions": {
      "name": "page-actions",
      "description": "Page-level action buttons container",
      "type": "registry:atom",
      "files": [
        "components/atom/page-actions.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button"
      ],
      "categories": [
        "layout",
        "navigation"
      ],
      "meta": {}
    },
    "page-header": {
      "name": "page-header",
      "description": "Consistent page header with breadcrumbs",
      "type": "registry:atom",
      "files": [
        "components/atom/page-header.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "layout",
        "navigation"
      ],
      "meta": {}
    },
    "tabs": {
      "name": "tabs",
      "description": "Enhanced tabs component with animations",
      "type": "registry:atom",
      "files": [
        "components/atom/tabs.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "tabs"
      ],
      "categories": [
        "navigation",
        "ui"
      ],
      "meta": {}
    },
    "modal-system": {
      "name": "modal-system",
      "description": "Complete modal system with carousel and steps",
      "type": "registry:atom",
      "files": [
        "components/atom/modal/carousel.tsx",
        "components/atom/modal/context.tsx",
        "components/atom/modal/indicator.tsx",
        "components/atom/modal/modal.tsx",
        "components/atom/modal/route-modal.tsx",
        "components/atom/modal/step.ts",
        "components/atom/modal/type.ts",
        "components/atom/modal/ui.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "dialog",
        "button"
      ],
      "categories": [
        "modal",
        "dialog"
      ],
      "meta": {}
    },
    "loading": {
      "name": "loading",
      "description": "Loading spinner and skeleton components",
      "type": "registry:atom",
      "files": [
        "components/atom/loading.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ui",
        "feedback"
      ],
      "meta": {}
    },
    "announcement": {
      "name": "announcement",
      "description": "Announcement banner component",
      "type": "registry:atom",
      "files": [
        "components/atom/announcement.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ui",
        "feedback"
      ],
      "meta": {}
    },
    "two-buttons": {
      "name": "two-buttons",
      "description": "Dual button group component",
      "type": "registry:atom",
      "files": [
        "components/atom/two-buttons.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button"
      ],
      "categories": [
        "ui",
        "interactive"
      ],
      "meta": {}
    },
    "agent-heading": {
      "name": "agent-heading",
      "description": "Agent conversation heading component",
      "type": "registry:atom",
      "files": [
        "components/atom/agent-heading.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ui",
        "display"
      ],
      "meta": {}
    },
    "theme-provider": {
      "name": "theme-provider",
      "description": "Theme provider wrapper component",
      "type": "registry:atom",
      "files": [
        "components/atom/theme-provider.tsx"
      ],
      "dependencies": [
        "next-themes"
      ],
      "registryDependencies": [],
      "categories": [
        "ui",
        "utility"
      ],
      "meta": {}
    },
    "icons": {
      "name": "icons",
      "description": "Comprehensive icon library",
      "type": "registry:lib",
      "files": [
        "components/atom/icons.tsx"
      ],
      "dependencies": [
        "lucide-react"
      ],
      "registryDependencies": [],
      "categories": [
        "ui",
        "utility"
      ],
      "meta": {}
    },
    "fonts": {
      "name": "fonts",
      "description": "Font configuration utilities",
      "type": "registry:lib",
      "files": [
        "components/atom/fonts.ts"
      ],
      "dependencies": [
        "next/font/google"
      ],
      "registryDependencies": [],
      "categories": [
        "ui",
        "utility"
      ],
      "meta": {}
    },
    "button-group": {
      "name": "button-group",
      "description": "Horizontal or vertical group of related buttons with shared styling",
      "type": "registry:atom",
      "files": [
        "components/atom/button-group.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button"
      ],
      "categories": [
        "interactive",
        "form"
      ],
      "meta": {}
    },
    "card-form": {
      "name": "card-form",
      "description": "Card shell for forms with header, content and footer slots",
      "type": "registry:atom",
      "files": [
        "components/atom/card-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card"
      ],
      "categories": [
        "form",
        "card"
      ],
      "meta": {}
    },
    "labeled-input": {
      "name": "labeled-input",
      "description": "Input with attached label, hint and error message",
      "type": "registry:atom",
      "files": [
        "components/atom/labeled-input.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "label",
        "input"
      ],
      "categories": [
        "form"
      ],
      "meta": {}
    },
    "labeled-select": {
      "name": "labeled-select",
      "description": "Select with attached label, hint and error message",
      "type": "registry:atom",
      "files": [
        "components/atom/labeled-select.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "label",
        "select"
      ],
      "categories": [
        "form"
      ],
      "meta": {}
    },
    "labeled-textarea": {
      "name": "labeled-textarea",
      "description": "Textarea with attached label, hint and error message",
      "type": "registry:atom",
      "files": [
        "components/atom/labeled-textarea.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "label",
        "textarea"
      ],
      "categories": [
        "form"
      ],
      "meta": {}
    },
    "site-heading": {
      "name": "site-heading",
      "description": "Site section heading with title and description lockup",
      "type": "registry:atom",
      "files": [
        "components/atom/site-heading.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "display",
        "layout"
      ],
      "meta": {}
    }
  },
  "new-york": {
    "dashboard-01": {
      "name": "dashboard-01",
      "description": "A dashboard with sidebar, charts and data table.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/dashboard-01/page")),
      "files": [
        "registry/new-york/templates/dashboard-01/page.tsx",
        "registry/new-york/templates/dashboard-01/components/app-sidebar.tsx",
        "registry/new-york/templates/dashboard-01/components/chart-area-interactive.tsx",
        "registry/new-york/templates/dashboard-01/components/data-table.tsx",
        "registry/new-york/templates/dashboard-01/components/nav-documents.tsx",
        "registry/new-york/templates/dashboard-01/components/nav-main.tsx",
        "registry/new-york/templates/dashboard-01/components/nav-secondary.tsx",
        "registry/new-york/templates/dashboard-01/components/nav-user.tsx",
        "registry/new-york/templates/dashboard-01/components/section-cards.tsx",
        "registry/new-york/templates/dashboard-01/components/site-header.tsx",
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
      "type": "registry:template",
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
      "type": "registry:template",
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
    "hero-01": {
      "name": "hero-01",
      "description": "Landing page hero section with CTA and gradient background",
      "type": "registry:template",
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
    },
    "sidebar-03": {
      "name": "sidebar-03",
      "description": "A sidebar with submenus",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-03/page")),
      "files": [
        "registry/new-york/templates/sidebar-03/page.tsx",
        "registry/new-york/templates/sidebar-03/components/app-sidebar.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "collapsible"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-07": {
      "name": "sidebar-07",
      "description": "A sidebar that collapses to icons",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-07/page")),
      "files": [
        "registry/new-york/templates/sidebar-07/page.tsx",
        "registry/new-york/templates/sidebar-07/components/app-sidebar.tsx",
        "registry/new-york/templates/sidebar-07/components/nav-main.tsx",
        "registry/new-york/templates/sidebar-07/components/nav-projects.tsx",
        "registry/new-york/templates/sidebar-07/components/nav-user.tsx",
        "registry/new-york/templates/sidebar-07/components/team-switcher.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "collapsible",
        "dropdown-menu",
        "avatar"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-02": {
      "name": "sidebar-02",
      "description": "A sidebar with collapsible sections.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-02/page")),
      "files": [
        "registry/new-york/templates/sidebar-02/page.tsx",
        "registry/new-york/templates/sidebar-02/components/app-sidebar.tsx",
        "registry/new-york/templates/sidebar-02/components/search-form.tsx",
        "registry/new-york/templates/sidebar-02/components/version-switcher.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "label",
        "dropdown-menu"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-04": {
      "name": "sidebar-04",
      "description": "A floating sidebar with submenus.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-04/page")),
      "files": [
        "registry/new-york/templates/sidebar-04/page.tsx",
        "registry/new-york/templates/sidebar-04/components/app-sidebar.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-05": {
      "name": "sidebar-05",
      "description": "A sidebar with collapsible submenus.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-05/page")),
      "files": [
        "registry/new-york/templates/sidebar-05/page.tsx",
        "registry/new-york/templates/sidebar-05/components/app-sidebar.tsx",
        "registry/new-york/templates/sidebar-05/components/search-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "label",
        "collapsible"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-06": {
      "name": "sidebar-06",
      "description": "A sidebar with submenus as dropdowns.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-06/page")),
      "files": [
        "registry/new-york/templates/sidebar-06/page.tsx",
        "registry/new-york/templates/sidebar-06/components/app-sidebar.tsx",
        "registry/new-york/templates/sidebar-06/components/nav-main.tsx",
        "registry/new-york/templates/sidebar-06/components/sidebar-opt-in-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "card",
        "dropdown-menu"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-08": {
      "name": "sidebar-08",
      "description": "An inset sidebar with secondary navigation.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-08/page")),
      "files": [
        "registry/new-york/templates/sidebar-08/page.tsx",
        "registry/new-york/templates/sidebar-08/components/app-sidebar.tsx",
        "registry/new-york/templates/sidebar-08/components/nav-main.tsx",
        "registry/new-york/templates/sidebar-08/components/nav-projects.tsx",
        "registry/new-york/templates/sidebar-08/components/nav-secondary.tsx",
        "registry/new-york/templates/sidebar-08/components/nav-user.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "collapsible",
        "dropdown-menu",
        "avatar"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-09": {
      "name": "sidebar-09",
      "description": "Collapsible nested sidebars.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-09/page")),
      "files": [
        "registry/new-york/templates/sidebar-09/page.tsx",
        "registry/new-york/templates/sidebar-09/components/app-sidebar.tsx",
        "registry/new-york/templates/sidebar-09/components/nav-user.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "collapsible",
        "dropdown-menu",
        "avatar",
        "switch",
        "label"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-10": {
      "name": "sidebar-10",
      "description": "A sidebar in a popover.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-10/page")),
      "files": [
        "registry/new-york/templates/sidebar-10/page.tsx",
        "registry/new-york/templates/sidebar-10/components/app-sidebar.tsx",
        "registry/new-york/templates/sidebar-10/components/nav-actions.tsx",
        "registry/new-york/templates/sidebar-10/components/nav-favorites.tsx",
        "registry/new-york/templates/sidebar-10/components/nav-main.tsx",
        "registry/new-york/templates/sidebar-10/components/nav-secondary.tsx",
        "registry/new-york/templates/sidebar-10/components/nav-workspaces.tsx",
        "registry/new-york/templates/sidebar-10/components/team-switcher.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "popover",
        "collapsible",
        "dropdown-menu"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-11": {
      "name": "sidebar-11",
      "description": "A sidebar with a collapsible file tree.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-11/page")),
      "files": [
        "registry/new-york/templates/sidebar-11/page.tsx",
        "registry/new-york/templates/sidebar-11/components/app-sidebar.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "collapsible"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-12": {
      "name": "sidebar-12",
      "description": "A sidebar with a calendar.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-12/page")),
      "files": [
        "registry/new-york/templates/sidebar-12/page.tsx",
        "registry/new-york/templates/sidebar-12/components/app-sidebar.tsx",
        "registry/new-york/templates/sidebar-12/components/calendars.tsx",
        "registry/new-york/templates/sidebar-12/components/date-picker.tsx",
        "registry/new-york/templates/sidebar-12/components/nav-user.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "collapsible",
        "calendar",
        "dropdown-menu",
        "avatar"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-13": {
      "name": "sidebar-13",
      "description": "A sidebar in a dialog.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-13/page")),
      "files": [
        "registry/new-york/templates/sidebar-13/page.tsx",
        "registry/new-york/templates/sidebar-13/components/settings-dialog.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "button",
        "dialog"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-14": {
      "name": "sidebar-14",
      "description": "A sidebar on the right.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-14/page")),
      "files": [
        "registry/new-york/templates/sidebar-14/page.tsx",
        "registry/new-york/templates/sidebar-14/components/app-sidebar.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-15": {
      "name": "sidebar-15",
      "description": "A left and right sidebar.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-15/page")),
      "files": [
        "registry/new-york/templates/sidebar-15/page.tsx",
        "registry/new-york/templates/sidebar-15/components/calendars.tsx",
        "registry/new-york/templates/sidebar-15/components/date-picker.tsx",
        "registry/new-york/templates/sidebar-15/components/nav-favorites.tsx",
        "registry/new-york/templates/sidebar-15/components/nav-main.tsx",
        "registry/new-york/templates/sidebar-15/components/nav-secondary.tsx",
        "registry/new-york/templates/sidebar-15/components/nav-user.tsx",
        "registry/new-york/templates/sidebar-15/components/nav-workspaces.tsx",
        "registry/new-york/templates/sidebar-15/components/sidebar-left.tsx",
        "registry/new-york/templates/sidebar-15/components/sidebar-right.tsx",
        "registry/new-york/templates/sidebar-15/components/team-switcher.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "popover",
        "collapsible",
        "dropdown-menu",
        "calendar",
        "avatar"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "sidebar-16": {
      "name": "sidebar-16",
      "description": "A sidebar with a sticky site header.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/sidebar-16/page")),
      "files": [
        "registry/new-york/templates/sidebar-16/page.tsx",
        "registry/new-york/templates/sidebar-16/components/app-sidebar.tsx",
        "registry/new-york/templates/sidebar-16/components/nav-main.tsx",
        "registry/new-york/templates/sidebar-16/components/nav-projects.tsx",
        "registry/new-york/templates/sidebar-16/components/nav-secondary.tsx",
        "registry/new-york/templates/sidebar-16/components/nav-user.tsx",
        "registry/new-york/templates/sidebar-16/components/search-form.tsx",
        "registry/new-york/templates/sidebar-16/components/site-header.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "sidebar",
        "breadcrumb",
        "separator",
        "collapsible",
        "dropdown-menu",
        "avatar",
        "button",
        "label"
      ],
      "categories": [
        "sidebar",
        "dashboard"
      ],
      "meta": {
        "iframeHeight": "900px"
      }
    },
    "signup-01": {
      "name": "signup-01",
      "description": "A simple signup form.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/signup-01/page")),
      "files": [
        "registry/new-york/templates/signup-01/page.tsx",
        "registry/new-york/templates/signup-01/components/signup-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "card",
        "input",
        "label"
      ],
      "categories": [
        "authentication",
        "signup"
      ],
      "meta": {
        "iframeHeight": "600px"
      }
    },
    "signup-02": {
      "name": "signup-02",
      "description": "A two column signup page with a cover image.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/signup-02/page")),
      "files": [
        "registry/new-york/templates/signup-02/page.tsx",
        "registry/new-york/templates/signup-02/components/signup-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "input",
        "label"
      ],
      "categories": [
        "authentication",
        "signup"
      ],
      "meta": {
        "iframeHeight": "800px"
      }
    },
    "signup-03": {
      "name": "signup-03",
      "description": "A signup page with a muted background color.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/signup-03/page")),
      "files": [
        "registry/new-york/templates/signup-03/page.tsx",
        "registry/new-york/templates/signup-03/components/signup-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "card",
        "input",
        "label"
      ],
      "categories": [
        "authentication",
        "signup"
      ],
      "meta": {
        "iframeHeight": "700px"
      }
    },
    "signup-04": {
      "name": "signup-04",
      "description": "A signup page with form and image.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/signup-04/page")),
      "files": [
        "registry/new-york/templates/signup-04/page.tsx",
        "registry/new-york/templates/signup-04/components/signup-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "card",
        "input",
        "label"
      ],
      "categories": [
        "authentication",
        "signup"
      ],
      "meta": {
        "iframeHeight": "800px"
      }
    },
    "signup-05": {
      "name": "signup-05",
      "description": "A simple signup form with social providers.",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/signup-05/page")),
      "files": [
        "registry/new-york/templates/signup-05/page.tsx",
        "registry/new-york/templates/signup-05/components/signup-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "input",
        "label"
      ],
      "categories": [
        "authentication",
        "signup"
      ],
      "meta": {
        "iframeHeight": "600px"
      }
    },
    "subscription-01": {
      "name": "subscription-01",
      "description": "Subscription management with plan details, billing info, and cancel/update actions",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/subscription-01/page")),
      "files": [
        "registry/new-york/templates/subscription-01/page.tsx"
      ],
      "dependencies": [
        "lucide-react"
      ],
      "registryDependencies": [
        "button",
        "card",
        "badge",
        "separator",
        "dialog",
        "radio-group",
        "label"
      ],
      "categories": [
        "subscription"
      ],
      "meta": {
        "iframeHeight": "800px"
      }
    },
    "subscription-02": {
      "name": "subscription-02",
      "description": "Invoice history table with status badges, dates, and download actions",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/subscription-02/page")),
      "files": [
        "registry/new-york/templates/subscription-02/page.tsx"
      ],
      "dependencies": [
        "lucide-react"
      ],
      "registryDependencies": [
        "card",
        "button",
        "table",
        "badge"
      ],
      "categories": [
        "subscription"
      ],
      "meta": {
        "iframeHeight": "600px"
      }
    },
    "subscription-03": {
      "name": "subscription-03",
      "description": "Usage tracking table with token consumption and cost breakdown",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/subscription-03/page")),
      "files": [
        "registry/new-york/templates/subscription-03/page.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "table",
        "card"
      ],
      "categories": [
        "subscription"
      ],
      "meta": {
        "iframeHeight": "500px"
      }
    },
    "header-01": {
      "name": "header-01",
      "description": "Responsive navigation header with logo and menu links",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/header-01/page")),
      "files": [
        "registry/new-york/templates/header-01/page.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "navigation-menu",
        "sheet"
      ],
      "categories": [
        "header"
      ],
      "meta": {
        "iframeHeight": "100px"
      }
    },
    "header-02": {
      "name": "header-02",
      "description": "Header with dropdown navigation and user menu",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/header-02/page")),
      "files": [
        "registry/new-york/templates/header-02/page.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "navigation-menu",
        "dropdown-menu",
        "avatar"
      ],
      "categories": [
        "header"
      ],
      "meta": {
        "iframeHeight": "100px"
      }
    },
    "footer-01": {
      "name": "footer-01",
      "description": "Simple footer with links and copyright",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/footer-01/page")),
      "files": [
        "registry/new-york/templates/footer-01/page.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "separator"
      ],
      "categories": [
        "footer"
      ],
      "meta": {
        "iframeHeight": "200px"
      }
    },
    "footer-02": {
      "name": "footer-02",
      "description": "Footer with newsletter signup and social links",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/footer-02/page")),
      "files": [
        "registry/new-york/templates/footer-02/page.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "input",
        "separator"
      ],
      "categories": [
        "footer"
      ],
      "meta": {
        "iframeHeight": "300px"
      }
    },
    "hero-02": {
      "name": "hero-02",
      "description": "Hero section with image background and overlay",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/hero-02/page")),
      "files": [
        "registry/new-york/templates/hero-02/page.tsx"
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
    },
    "hero-03": {
      "name": "hero-03",
      "description": "Hero with split layout - content and image",
      "type": "registry:template",
      "component": React.lazy(() => import("@/registry/new-york/templates/hero-03/page")),
      "files": [
        "registry/new-york/templates/hero-03/page.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "badge"
      ],
      "categories": [
        "hero"
      ],
      "meta": {
        "iframeHeight": "600px"
      }
    },
    "activity-goal": {
      "name": "activity-goal",
      "description": "Activity goal tracking card with chart visualization",
      "type": "registry:atom",
      "files": [
        "components/atom/activity-goal.tsx"
      ],
      "dependencies": [
        "recharts"
      ],
      "registryDependencies": [
        "button",
        "card",
        "chart"
      ],
      "categories": [
        "display",
        "data"
      ],
      "meta": {}
    },
    "calendar": {
      "name": "calendar",
      "description": "Interactive calendar card component",
      "type": "registry:atom",
      "files": [
        "components/atom/calendar.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card",
        "calendar"
      ],
      "categories": [
        "display",
        "interactive"
      ],
      "meta": {}
    },
    "chat": {
      "name": "chat",
      "description": "Composable chat primitives with context-based state management",
      "type": "registry:atom",
      "files": [
        "components/atom/chat.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card",
        "avatar",
        "input",
        "button"
      ],
      "categories": [
        "display",
        "interactive"
      ],
      "meta": {}
    },
    "data-table": {
      "name": "data-table",
      "description": "Composable data table primitives with sorting, filtering, and pagination",
      "type": "registry:atom",
      "files": [
        "components/atom/data-table.tsx"
      ],
      "dependencies": [
        "@tanstack/react-table"
      ],
      "registryDependencies": [
        "card",
        "table",
        "button",
        "input",
        "dropdown-menu"
      ],
      "categories": [
        "data",
        "display"
      ],
      "meta": {}
    },
    "metric": {
      "name": "metric",
      "description": "Metric display card with progress indicator",
      "type": "registry:atom",
      "files": [
        "components/atom/metric.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card",
        "progress"
      ],
      "categories": [
        "data",
        "display"
      ],
      "meta": {}
    },
    "report-issue": {
      "name": "report-issue",
      "description": "Issue reporting form card",
      "type": "registry:atom",
      "files": [
        "components/atom/report-issue.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card",
        "button",
        "input",
        "label",
        "select",
        "textarea"
      ],
      "categories": [
        "form"
      ],
      "meta": {}
    },
    "share": {
      "name": "share",
      "description": "Social sharing card with multiple platforms",
      "type": "registry:atom",
      "files": [
        "components/atom/share.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card",
        "button",
        "input",
        "separator"
      ],
      "categories": [
        "ui",
        "interactive"
      ],
      "meta": {}
    },
    "stats": {
      "name": "stats",
      "description": "Statistics overview card with multiple metrics",
      "type": "registry:atom",
      "files": [
        "components/atom/stats.tsx"
      ],
      "dependencies": [
        "recharts"
      ],
      "registryDependencies": [
        "card",
        "chart"
      ],
      "categories": [
        "data",
        "display"
      ],
      "meta": {}
    },
    "team-member": {
      "name": "team-member",
      "description": "Composable team member primitives with role management",
      "type": "registry:atom",
      "files": [
        "components/atom/team-member.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card",
        "button",
        "avatar",
        "popover",
        "command"
      ],
      "categories": [
        "display",
        "form"
      ],
      "meta": {}
    },
    "ai-prompt-input": {
      "name": "ai-prompt-input",
      "description": "AI-powered prompt input component with suggestions and completions",
      "type": "registry:atom",
      "files": [
        "components/atom/ai/ai-prompt-input.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "textarea"
      ],
      "categories": [
        "ai",
        "form"
      ],
      "meta": {}
    },
    "ai-status-indicator": {
      "name": "ai-status-indicator",
      "description": "Visual indicator for AI processing states",
      "type": "registry:atom",
      "files": [
        "components/atom/ai/ai-status-indicator.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ai",
        "feedback"
      ],
      "meta": {}
    },
    "ai-streaming-text": {
      "name": "ai-streaming-text",
      "description": "Streaming text animation for AI responses",
      "type": "registry:atom",
      "files": [
        "components/atom/ai/ai-streaming-text.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ai",
        "display"
      ],
      "meta": {}
    },
    "ai-response-display": {
      "name": "ai-response-display",
      "description": "Display AI responses with markdown and code highlighting",
      "type": "registry:atom",
      "files": [
        "components/atom/ai-response-display.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card"
      ],
      "categories": [
        "ai",
        "display"
      ],
      "meta": {}
    },
    "prompt-input": {
      "name": "prompt-input",
      "description": "Advanced prompt input with keyboard shortcuts and suggestions",
      "type": "registry:atom",
      "files": [
        "components/atom/prompt-input.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "textarea"
      ],
      "categories": [
        "ai",
        "form"
      ],
      "meta": {}
    },
    "response": {
      "name": "response",
      "description": "Response container with formatting and actions",
      "type": "registry:atom",
      "files": [
        "components/atom/response.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ai",
        "display"
      ],
      "meta": {}
    },
    "reasoning": {
      "name": "reasoning",
      "description": "Display reasoning steps and thought processes",
      "type": "registry:atom",
      "files": [
        "components/atom/reasoning.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ai",
        "display"
      ],
      "meta": {}
    },
    "card": {
      "name": "card",
      "description": "Enhanced card component with hover effects",
      "type": "registry:atom",
      "files": [
        "components/atom/card.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card"
      ],
      "categories": [
        "display",
        "layout"
      ],
      "meta": {}
    },
    "card-hover-effect": {
      "name": "card-hover-effect",
      "description": "Card with animated hover effects and transitions",
      "type": "registry:atom",
      "files": [
        "components/atom/card-hover-effect.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "display",
        "animation"
      ],
      "meta": {}
    },
    "cards-metric": {
      "name": "cards-metric",
      "description": "Metric display cards with statistics",
      "type": "registry:atom",
      "files": [
        "components/atom/cards-metric.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card"
      ],
      "categories": [
        "display",
        "data"
      ],
      "meta": {}
    },
    "gradient-animation": {
      "name": "gradient-animation",
      "description": "Animated gradient background effect",
      "type": "registry:atom",
      "files": [
        "components/atom/gradient-animation.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "animation",
        "display"
      ],
      "meta": {}
    },
    "infinite-cards": {
      "name": "infinite-cards",
      "description": "Infinite scrolling card carousel",
      "type": "registry:atom",
      "files": [
        "components/atom/infinite-cards.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "animation",
        "display"
      ],
      "meta": {}
    },
    "infinite-slider": {
      "name": "infinite-slider",
      "description": "Infinite auto-scrolling slider with smooth animations",
      "type": "registry:atom",
      "files": [
        "components/atom/infinite-slider.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "animation",
        "display"
      ],
      "meta": {}
    },
    "progressive-blur": {
      "name": "progressive-blur",
      "description": "Progressive blur effect for images and backgrounds",
      "type": "registry:atom",
      "files": [
        "components/atom/progressive-blur.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "animation",
        "display"
      ],
      "meta": {}
    },
    "sticky-scroll": {
      "name": "sticky-scroll",
      "description": "Sticky scroll reveal animation",
      "type": "registry:atom",
      "files": [
        "components/atom/sticky-scroll.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "animation",
        "display"
      ],
      "meta": {}
    },
    "simple-marquee": {
      "name": "simple-marquee",
      "description": "Simple auto-scrolling marquee component",
      "type": "registry:atom",
      "files": [
        "components/atom/simple-marquee.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "animation",
        "display"
      ],
      "meta": {}
    },
    "oauth-button": {
      "name": "oauth-button",
      "description": "Single OAuth button with provider icon",
      "type": "registry:atom",
      "files": [
        "components/atom/oauth-button.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "icons"
      ],
      "categories": [
        "form",
        "authentication"
      ],
      "meta": {}
    },
    "oauth-button-group": {
      "name": "oauth-button-group",
      "description": "Grid of OAuth buttons for multiple providers",
      "type": "registry:atom",
      "files": [
        "components/atom/oauth-button-group.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "oauth-button"
      ],
      "categories": [
        "form",
        "authentication"
      ],
      "meta": {}
    },
    "divider-with-text": {
      "name": "divider-with-text",
      "description": "Horizontal divider with centered text label",
      "type": "registry:atom",
      "files": [
        "components/atom/divider-with-text.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ui",
        "layout"
      ],
      "meta": {}
    },
    "user-info-card": {
      "name": "user-info-card",
      "description": "User avatar with name and email display",
      "type": "registry:atom",
      "files": [
        "components/atom/user-info-card.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "avatar"
      ],
      "categories": [
        "display",
        "user"
      ],
      "meta": {}
    },
    "settings-toggle-row": {
      "name": "settings-toggle-row",
      "description": "Settings row with label, description, and toggle switch",
      "type": "registry:atom",
      "files": [
        "components/atom/settings-toggle-row.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "switch",
        "label"
      ],
      "categories": [
        "form",
        "settings"
      ],
      "meta": {}
    },
    "form-field": {
      "name": "form-field",
      "description": "Form field primitives with label and input",
      "type": "registry:atom",
      "files": [
        "components/atom/form-field.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "input",
        "label"
      ],
      "categories": [
        "form",
        "input"
      ],
      "meta": {}
    },
    "payment-method-selector": {
      "name": "payment-method-selector",
      "description": "Payment method radio selector with icons",
      "type": "registry:atom",
      "files": [
        "components/atom/payment-method-selector.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "radio-group",
        "label",
        "icons"
      ],
      "categories": [
        "form",
        "payment"
      ],
      "meta": {}
    },
    "faceted": {
      "name": "faceted",
      "description": "Faceted filter component for data tables",
      "type": "registry:atom",
      "files": [
        "components/atom/faceted.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button",
        "popover",
        "checkbox",
        "separator",
        "badge"
      ],
      "categories": [
        "form",
        "interactive"
      ],
      "meta": {}
    },
    "sortable": {
      "name": "sortable",
      "description": "Drag-and-drop sortable list component",
      "type": "registry:atom",
      "files": [
        "components/atom/sortable.tsx"
      ],
      "dependencies": [
        "@dnd-kit/core",
        "@dnd-kit/sortable",
        "@dnd-kit/utilities"
      ],
      "registryDependencies": [],
      "categories": [
        "interactive",
        "form"
      ],
      "meta": {}
    },
    "expand-button": {
      "name": "expand-button",
      "description": "Expandable button with reveal animation",
      "type": "registry:atom",
      "files": [
        "components/atom/expand-button.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button"
      ],
      "categories": [
        "interactive",
        "ui"
      ],
      "meta": {}
    },
    "header-section": {
      "name": "header-section",
      "description": "Reusable header section component",
      "type": "registry:atom",
      "files": [
        "components/atom/header-section.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "layout",
        "navigation"
      ],
      "meta": {}
    },
    "page-actions": {
      "name": "page-actions",
      "description": "Page-level action buttons container",
      "type": "registry:atom",
      "files": [
        "components/atom/page-actions.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button"
      ],
      "categories": [
        "layout",
        "navigation"
      ],
      "meta": {}
    },
    "page-header": {
      "name": "page-header",
      "description": "Consistent page header with breadcrumbs",
      "type": "registry:atom",
      "files": [
        "components/atom/page-header.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "layout",
        "navigation"
      ],
      "meta": {}
    },
    "tabs": {
      "name": "tabs",
      "description": "Enhanced tabs component with animations",
      "type": "registry:atom",
      "files": [
        "components/atom/tabs.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "tabs"
      ],
      "categories": [
        "navigation",
        "ui"
      ],
      "meta": {}
    },
    "modal-system": {
      "name": "modal-system",
      "description": "Complete modal system with carousel and steps",
      "type": "registry:atom",
      "files": [
        "components/atom/modal/carousel.tsx",
        "components/atom/modal/context.tsx",
        "components/atom/modal/indicator.tsx",
        "components/atom/modal/modal.tsx",
        "components/atom/modal/route-modal.tsx",
        "components/atom/modal/step.ts",
        "components/atom/modal/type.ts",
        "components/atom/modal/ui.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "dialog",
        "button"
      ],
      "categories": [
        "modal",
        "dialog"
      ],
      "meta": {}
    },
    "loading": {
      "name": "loading",
      "description": "Loading spinner and skeleton components",
      "type": "registry:atom",
      "files": [
        "components/atom/loading.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ui",
        "feedback"
      ],
      "meta": {}
    },
    "announcement": {
      "name": "announcement",
      "description": "Announcement banner component",
      "type": "registry:atom",
      "files": [
        "components/atom/announcement.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ui",
        "feedback"
      ],
      "meta": {}
    },
    "two-buttons": {
      "name": "two-buttons",
      "description": "Dual button group component",
      "type": "registry:atom",
      "files": [
        "components/atom/two-buttons.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button"
      ],
      "categories": [
        "ui",
        "interactive"
      ],
      "meta": {}
    },
    "agent-heading": {
      "name": "agent-heading",
      "description": "Agent conversation heading component",
      "type": "registry:atom",
      "files": [
        "components/atom/agent-heading.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "ui",
        "display"
      ],
      "meta": {}
    },
    "theme-provider": {
      "name": "theme-provider",
      "description": "Theme provider wrapper component",
      "type": "registry:atom",
      "files": [
        "components/atom/theme-provider.tsx"
      ],
      "dependencies": [
        "next-themes"
      ],
      "registryDependencies": [],
      "categories": [
        "ui",
        "utility"
      ],
      "meta": {}
    },
    "icons": {
      "name": "icons",
      "description": "Comprehensive icon library",
      "type": "registry:lib",
      "files": [
        "components/atom/icons.tsx"
      ],
      "dependencies": [
        "lucide-react"
      ],
      "registryDependencies": [],
      "categories": [
        "ui",
        "utility"
      ],
      "meta": {}
    },
    "fonts": {
      "name": "fonts",
      "description": "Font configuration utilities",
      "type": "registry:lib",
      "files": [
        "components/atom/fonts.ts"
      ],
      "dependencies": [
        "next/font/google"
      ],
      "registryDependencies": [],
      "categories": [
        "ui",
        "utility"
      ],
      "meta": {}
    },
    "button-group": {
      "name": "button-group",
      "description": "Horizontal or vertical group of related buttons with shared styling",
      "type": "registry:atom",
      "files": [
        "components/atom/button-group.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "button"
      ],
      "categories": [
        "interactive",
        "form"
      ],
      "meta": {}
    },
    "card-form": {
      "name": "card-form",
      "description": "Card shell for forms with header, content and footer slots",
      "type": "registry:atom",
      "files": [
        "components/atom/card-form.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "card"
      ],
      "categories": [
        "form",
        "card"
      ],
      "meta": {}
    },
    "labeled-input": {
      "name": "labeled-input",
      "description": "Input with attached label, hint and error message",
      "type": "registry:atom",
      "files": [
        "components/atom/labeled-input.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "label",
        "input"
      ],
      "categories": [
        "form"
      ],
      "meta": {}
    },
    "labeled-select": {
      "name": "labeled-select",
      "description": "Select with attached label, hint and error message",
      "type": "registry:atom",
      "files": [
        "components/atom/labeled-select.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "label",
        "select"
      ],
      "categories": [
        "form"
      ],
      "meta": {}
    },
    "labeled-textarea": {
      "name": "labeled-textarea",
      "description": "Textarea with attached label, hint and error message",
      "type": "registry:atom",
      "files": [
        "components/atom/labeled-textarea.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [
        "label",
        "textarea"
      ],
      "categories": [
        "form"
      ],
      "meta": {}
    },
    "site-heading": {
      "name": "site-heading",
      "description": "Site section heading with title and description lockup",
      "type": "registry:atom",
      "files": [
        "components/atom/site-heading.tsx"
      ],
      "dependencies": [],
      "registryDependencies": [],
      "categories": [
        "display",
        "layout"
      ],
      "meta": {}
    }
  }
}
