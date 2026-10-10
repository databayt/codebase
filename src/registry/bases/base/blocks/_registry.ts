import { type Registry } from "shadcn/schema"

export const blocks: Registry["items"] = [
  {
    name: "dashboard-01",
    title: "Dashboard 01",
    description: "A dashboard with sidebar, charts and data table.",
    type: "registry:block",
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
      "chart",
    ],
    files: [
      {
        path: "blocks/dashboard-01/page.tsx",
        type: "registry:page",
        target: "app/dashboard-01/page.tsx",
      },
      {
        path: "blocks/dashboard-01/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/chart-area-interactive.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/data-table.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/nav-documents.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/section-cards.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/site-header.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/data.json",
        type: "registry:file",
        target: "app/dashboard-01/data.json",
      },
    ],
    categories: ["dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-01",
    title: "Sidebar 01",
    description: "A simple sidebar with navigation grouped by section.",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "dropdown-menu",
    ],
    files: [
      {
        path: "blocks/sidebar-01/page.tsx",
        type: "registry:page",
        target: "app/sidebar-01/page.tsx",
      },
      {
        path: "blocks/sidebar-01/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-01/components/search-form.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-01/components/version-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "login-01",
    title: "Login 01",
    description: "A simple login form.",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label", "field"],
    files: [
      {
        path: "blocks/login-01/page.tsx",
        type: "registry:page",
        target: "app/login-01/page.tsx",
      },
      {
        path: "blocks/login-01/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "login"],
    meta: {
      iframeHeight: "600px",
    },
  },
  {
    name: "hero-01",
    title: "Hero 01",
    description: "Landing page hero section with CTA and gradient background",
    type: "registry:block",
    registryDependencies: ["button"],
    files: [
      {
        path: "blocks/hero-01/page.tsx",
        type: "registry:page",
        target: "app/hero-01/page.tsx",
      },
    ],
    categories: ["hero"],
    meta: {
      iframeHeight: "600px",
    },
  },
  {
    name: "sidebar-03",
    title: "Sidebar 03",
    description: "A sidebar with submenus",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb", "separator", "collapsible"],
    files: [
      {
        path: "blocks/sidebar-03/page.tsx",
        type: "registry:page",
        target: "app/sidebar-03/page.tsx",
      },
      {
        path: "blocks/sidebar-03/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-07",
    title: "Sidebar 07",
    description: "A sidebar that collapses to icons",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
    ],
    files: [
      {
        path: "blocks/sidebar-07/page.tsx",
        type: "registry:page",
        target: "app/sidebar-07/page.tsx",
      },
      {
        path: "blocks/sidebar-07/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-07/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-07/components/nav-projects.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-07/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-07/components/team-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-02",
    title: "Sidebar 02",
    description: "A sidebar with collapsible sections.",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "dropdown-menu",
    ],
    files: [
      {
        path: "blocks/sidebar-02/page.tsx",
        type: "registry:page",
        target: "app/sidebar-02/page.tsx",
      },
      {
        path: "blocks/sidebar-02/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-02/components/search-form.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-02/components/version-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-04",
    title: "Sidebar 04",
    description: "A floating sidebar with submenus.",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb", "separator"],
    files: [
      {
        path: "blocks/sidebar-04/page.tsx",
        type: "registry:page",
        target: "app/sidebar-04/page.tsx",
      },
      {
        path: "blocks/sidebar-04/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-05",
    title: "Sidebar 05",
    description: "A sidebar with collapsible submenus.",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "collapsible",
    ],
    files: [
      {
        path: "blocks/sidebar-05/page.tsx",
        type: "registry:page",
        target: "app/sidebar-05/page.tsx",
      },
      {
        path: "blocks/sidebar-05/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-05/components/search-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-06",
    title: "Sidebar 06",
    description: "A sidebar with submenus as dropdowns.",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "card",
      "dropdown-menu",
    ],
    files: [
      {
        path: "blocks/sidebar-06/page.tsx",
        type: "registry:page",
        target: "app/sidebar-06/page.tsx",
      },
      {
        path: "blocks/sidebar-06/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-06/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-06/components/sidebar-opt-in-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-08",
    title: "Sidebar 08",
    description: "An inset sidebar with secondary navigation.",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
    ],
    files: [
      {
        path: "blocks/sidebar-08/page.tsx",
        type: "registry:page",
        target: "app/sidebar-08/page.tsx",
      },
      {
        path: "blocks/sidebar-08/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-08/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-08/components/nav-projects.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-08/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-08/components/nav-user.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-09",
    title: "Sidebar 09",
    description: "Collapsible nested sidebars.",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
      "switch",
      "label",
    ],
    files: [
      {
        path: "blocks/sidebar-09/page.tsx",
        type: "registry:page",
        target: "app/sidebar-09/page.tsx",
      },
      {
        path: "blocks/sidebar-09/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-09/components/nav-user.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-10",
    title: "Sidebar 10",
    description: "A sidebar in a popover.",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "popover",
      "collapsible",
      "dropdown-menu",
    ],
    files: [
      {
        path: "blocks/sidebar-10/page.tsx",
        type: "registry:page",
        target: "app/sidebar-10/page.tsx",
      },
      {
        path: "blocks/sidebar-10/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-10/components/nav-actions.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-10/components/nav-favorites.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-10/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-10/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-10/components/nav-workspaces.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-10/components/team-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-11",
    title: "Sidebar 11",
    description: "A sidebar with a collapsible file tree.",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb", "separator", "collapsible"],
    files: [
      {
        path: "blocks/sidebar-11/page.tsx",
        type: "registry:page",
        target: "app/sidebar-11/page.tsx",
      },
      {
        path: "blocks/sidebar-11/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-12",
    title: "Sidebar 12",
    description: "A sidebar with a calendar.",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "calendar",
      "dropdown-menu",
      "avatar",
    ],
    files: [
      {
        path: "blocks/sidebar-12/page.tsx",
        type: "registry:page",
        target: "app/sidebar-12/page.tsx",
      },
      {
        path: "blocks/sidebar-12/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-12/components/calendars.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-12/components/date-picker.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-12/components/nav-user.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-13",
    title: "Sidebar 13",
    description: "A sidebar in a dialog.",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb", "button", "dialog"],
    files: [
      {
        path: "blocks/sidebar-13/page.tsx",
        type: "registry:page",
        target: "app/sidebar-13/page.tsx",
      },
      {
        path: "blocks/sidebar-13/components/settings-dialog.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-14",
    title: "Sidebar 14",
    description: "A sidebar on the right.",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb"],
    files: [
      {
        path: "blocks/sidebar-14/page.tsx",
        type: "registry:page",
        target: "app/sidebar-14/page.tsx",
      },
      {
        path: "blocks/sidebar-14/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-15",
    title: "Sidebar 15",
    description: "A left and right sidebar.",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "popover",
      "collapsible",
      "dropdown-menu",
      "calendar",
      "avatar",
    ],
    files: [
      {
        path: "blocks/sidebar-15/page.tsx",
        type: "registry:page",
        target: "app/sidebar-15/page.tsx",
      },
      {
        path: "blocks/sidebar-15/components/calendars.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/date-picker.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/nav-favorites.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/nav-workspaces.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/sidebar-left.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/sidebar-right.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/team-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "sidebar-16",
    title: "Sidebar 16",
    description: "A sidebar with a sticky site header.",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
      "button",
      "label",
    ],
    files: [
      {
        path: "blocks/sidebar-16/page.tsx",
        type: "registry:page",
        target: "app/sidebar-16/page.tsx",
      },
      {
        path: "blocks/sidebar-16/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-16/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-16/components/nav-projects.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-16/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-16/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-16/components/search-form.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-16/components/site-header.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "signup-01",
    title: "Signup 01",
    description: "A simple signup form.",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "blocks/signup-01/page.tsx",
        type: "registry:page",
        target: "app/signup-01/page.tsx",
      },
      {
        path: "blocks/signup-01/components/signup-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "signup"],
    meta: {
      iframeHeight: "600px",
    },
  },
  {
    name: "signup-02",
    title: "Signup 02",
    description: "A two column signup page with a cover image.",
    type: "registry:block",
    registryDependencies: ["button", "input", "label"],
    files: [
      {
        path: "blocks/signup-02/page.tsx",
        type: "registry:page",
        target: "app/signup-02/page.tsx",
      },
      {
        path: "blocks/signup-02/components/signup-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "signup"],
    meta: {
      iframeHeight: "800px",
    },
  },
  {
    name: "signup-03",
    title: "Signup 03",
    description: "A signup page with a muted background color.",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "blocks/signup-03/page.tsx",
        type: "registry:page",
        target: "app/signup-03/page.tsx",
      },
      {
        path: "blocks/signup-03/components/signup-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "signup"],
    meta: {
      iframeHeight: "700px",
    },
  },
  {
    name: "signup-04",
    title: "Signup 04",
    description: "A signup page with form and image.",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "blocks/signup-04/page.tsx",
        type: "registry:page",
        target: "app/signup-04/page.tsx",
      },
      {
        path: "blocks/signup-04/components/signup-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "signup"],
    meta: {
      iframeHeight: "800px",
    },
  },
  {
    name: "signup-05",
    title: "Signup 05",
    description: "A simple signup form with social providers.",
    type: "registry:block",
    registryDependencies: ["button", "input", "label"],
    files: [
      {
        path: "blocks/signup-05/page.tsx",
        type: "registry:page",
        target: "app/signup-05/page.tsx",
      },
      {
        path: "blocks/signup-05/components/signup-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "signup"],
    meta: {
      iframeHeight: "600px",
    },
  },
  {
    name: "subscription-01",
    title: "Subscription 01",
    description:
      "Subscription management with plan details, billing info, and cancel/update actions",
    type: "registry:block",
    dependencies: ["lucide-react"],
    registryDependencies: [
      "button",
      "card",
      "badge",
      "separator",
      "dialog",
      "radio-group",
      "label",
    ],
    files: [
      {
        path: "blocks/subscription-01/page.tsx",
        type: "registry:page",
        target: "app/subscription-01/page.tsx",
      },
    ],
    categories: ["subscription"],
    meta: {
      iframeHeight: "800px",
    },
  },
  {
    name: "subscription-02",
    title: "Subscription 02",
    description:
      "Invoice history table with status badges, dates, and download actions",
    type: "registry:block",
    dependencies: ["lucide-react"],
    registryDependencies: ["card", "button", "table", "badge"],
    files: [
      {
        path: "blocks/subscription-02/page.tsx",
        type: "registry:page",
        target: "app/subscription-02/page.tsx",
      },
    ],
    categories: ["subscription"],
    meta: {
      iframeHeight: "600px",
    },
  },
  {
    name: "subscription-03",
    title: "Subscription 03",
    description:
      "Usage tracking table with token consumption and cost breakdown",
    type: "registry:block",
    registryDependencies: ["table", "card"],
    files: [
      {
        path: "blocks/subscription-03/page.tsx",
        type: "registry:page",
        target: "app/subscription-03/page.tsx",
      },
    ],
    categories: ["subscription"],
    meta: {
      iframeHeight: "500px",
    },
  },
  {
    name: "header-01",
    title: "Header 01",
    description: "Responsive navigation header with logo and menu links",
    type: "registry:block",
    registryDependencies: ["button", "navigation-menu", "sheet"],
    files: [
      {
        path: "blocks/header-01/page.tsx",
        type: "registry:page",
        target: "app/header-01/page.tsx",
      },
    ],
    categories: ["header"],
    meta: {
      iframeHeight: "100px",
    },
  },
  {
    name: "header-02",
    title: "Header 02",
    description: "Header with dropdown navigation and user menu",
    type: "registry:block",
    registryDependencies: [
      "button",
      "navigation-menu",
      "dropdown-menu",
      "avatar",
    ],
    files: [
      {
        path: "blocks/header-02/page.tsx",
        type: "registry:page",
        target: "app/header-02/page.tsx",
      },
    ],
    categories: ["header"],
    meta: {
      iframeHeight: "100px",
    },
  },
  {
    name: "footer-01",
    title: "Footer 01",
    description: "Simple footer with links and copyright",
    type: "registry:block",
    registryDependencies: ["separator"],
    files: [
      {
        path: "blocks/footer-01/page.tsx",
        type: "registry:page",
        target: "app/footer-01/page.tsx",
      },
    ],
    categories: ["footer"],
    meta: {
      iframeHeight: "200px",
    },
  },
  {
    name: "footer-02",
    title: "Footer 02",
    description: "Footer with newsletter signup and social links",
    type: "registry:block",
    registryDependencies: ["button", "input", "separator"],
    dependencies: ["@tabler/icons-react"],
    files: [
      {
        path: "blocks/footer-02/page.tsx",
        type: "registry:page",
        target: "app/footer-02/page.tsx",
      },
    ],
    categories: ["footer"],
    meta: {
      iframeHeight: "300px",
    },
  },
  {
    name: "hero-02",
    title: "Hero 02",
    description: "Hero section with image background and overlay",
    type: "registry:block",
    registryDependencies: ["button"],
    files: [
      {
        path: "blocks/hero-02/page.tsx",
        type: "registry:page",
        target: "app/hero-02/page.tsx",
      },
    ],
    categories: ["hero"],
    meta: {
      iframeHeight: "600px",
    },
  },
  {
    name: "hero-03",
    title: "Hero 03",
    description: "Hero with split layout - content and image",
    type: "registry:block",
    registryDependencies: ["button", "badge"],
    files: [
      {
        path: "blocks/hero-03/page.tsx",
        type: "registry:page",
        target: "app/hero-03/page.tsx",
      },
    ],
    categories: ["hero"],
    meta: {
      iframeHeight: "600px",
    },
  },
  {
    name: "hero-04",
    title: "Hero 04",
    description: "Hero with animated Rive gradient background and dual CTA",
    type: "registry:block",
    dependencies: ["@rive-app/webgl2"],
    registryDependencies: ["button"],
    files: [
      {
        path: "blocks/hero-04/page.tsx",
        type: "registry:page",
        target: "app/hero-04/page.tsx",
      },
    ],
    categories: ["hero"],
    meta: {
      iframeHeight: "800px",
    },
  },
  {
    name: "leads-01",
    title: "Leads 01",
    description: "Lead management board with cards, filters and capture form",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label", "badge", "tabs"],
    files: [
      {
        path: "blocks/leads-01/page.tsx",
        type: "registry:page",
        target: "app/leads-01/page.tsx",
      },
      {
        path: "blocks/leads-01/components/content.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/leads-01/components/all.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/leads-01/components/featured.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/leads-01/components/card.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/leads-01/components/form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["dashboard"],
    meta: {
      iframeHeight: "800px",
    },
  },
  {
    name: "login-03",
    title: "Login 03",
    description: "Login form with muted card layout",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "blocks/login-03/page.tsx",
        type: "registry:page",
        target: "app/login-03/page.tsx",
      },
      {
        path: "blocks/login-03/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "login"],
    meta: {
      iframeHeight: "600px",
    },
  },
  {
    name: "login-04",
    title: "Login 04",
    description: "Split login form with image panel",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "blocks/login-04/page.tsx",
        type: "registry:page",
        target: "app/login-04/page.tsx",
      },
      {
        path: "blocks/login-04/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "login"],
    meta: {
      iframeHeight: "600px",
    },
  },
  {
    name: "header-03",
    title: "Header 03",
    description:
      'Thin sticky bar: mark and quiet text links on the start side, language, theme and sign-in on the end; a "Menu" control opens a sheet of large links on phones.',
    type: "registry:block",
    dependencies: ["next-themes"],
    registryDependencies: ["button", "separator", "sheet"],
    files: [
      {
        path: "blocks/header-03/page.tsx",
        type: "registry:page",
        target: "app/header-03/page.tsx",
      },
      {
        path: "blocks/header-03/components/header-03.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/header-03/components/header-03-mobile-nav.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/header-03/components/header-03-mode-switcher.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/header-03/header-03-dictionary.ts",
        type: "registry:file",
        target: "app/header-03/header-03-dictionary.ts",
      },
    ],
    categories: ["header"],
    meta: {
      iframeHeight: "600px",
    },
  },
  {
    name: "header-04",
    title: "Header 04",
    description:
      'Bold wordmark with pill-shaped nav links, a language link, a rounded call-to-action and a "More" menu; a full-height sheet of large links on phones.',
    type: "registry:block",
    dependencies: [],
    registryDependencies: ["button", "dropdown-menu", "sheet"],
    files: [
      {
        path: "blocks/header-04/page.tsx",
        type: "registry:page",
        target: "app/header-04/page.tsx",
      },
      {
        path: "blocks/header-04/components/header-04.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/header-04/components/header-04-mobile-nav.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/header-04/header-04-dictionary.ts",
        type: "registry:file",
        target: "app/header-04/header-04-dictionary.ts",
      },
    ],
    categories: ["header"],
    meta: {
      iframeHeight: "600px",
    },
  },
  {
    name: "header-05",
    title: "Header 05",
    description:
      "Storefront header: utility top bar with a help dropdown, category nav with full-width mega menus, an expanding search tray, favorites and bag, and an accordion drawer on phones.",
    type: "registry:block",
    dependencies: ["motion"],
    registryDependencies: ["button", "sheet", "accordion"],
    files: [
      {
        path: "blocks/header-05/page.tsx",
        type: "registry:page",
        target: "app/header-05/page.tsx",
      },
      {
        path: "blocks/header-05/components/header-05.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/header-05/components/header-05-search.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/header-05/components/header-05-mobile-menu.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/header-05/header-05-dictionary.ts",
        type: "registry:file",
        target: "app/header-05/header-05-dictionary.ts",
      },
    ],
    categories: ["header"],
    meta: {
      iframeHeight: "700px",
    },
  },
  {
    name: "footer-03",
    title: "Footer 03",
    description:
      "A tall rounded call-to-action card with a light and a black headline line and a pill button, over a quiet bar with the wordmark, links and legal line.",
    type: "registry:block",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "blocks/footer-03/page.tsx",
        type: "registry:page",
        target: "app/footer-03/page.tsx",
      },
      {
        path: "blocks/footer-03/components/footer-03.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/footer-03/footer-03-dictionary.ts",
        type: "registry:file",
        target: "app/footer-03/footer-03-dictionary.ts",
      },
    ],
    categories: ["footer"],
    meta: {
      iframeHeight: "800px",
    },
  },
  {
    name: "footer-04",
    title: "Footer 04",
    description:
      'Always-dark footer: four link columns (2 × 2 on phones) beside a "ready to start" button with a lifted hover and a row of social icons.',
    type: "registry:block",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "blocks/footer-04/page.tsx",
        type: "registry:page",
        target: "app/footer-04/page.tsx",
      },
      {
        path: "blocks/footer-04/components/footer-04.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/footer-04/components/footer-04-social-icons.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/footer-04/footer-04-dictionary.ts",
        type: "registry:file",
        target: "app/footer-04/footer-04-dictionary.ts",
      },
    ],
    categories: ["footer"],
    meta: {
      iframeHeight: "800px",
    },
  },
  {
    name: "footer-05",
    title: "Footer 05",
    description:
      "Muted footer with a newsletter form, four link columns and a bottom line with the brand, copyright and legal links.",
    type: "registry:block",
    dependencies: [],
    registryDependencies: ["button", "input"],
    files: [
      {
        path: "blocks/footer-05/page.tsx",
        type: "registry:page",
        target: "app/footer-05/page.tsx",
      },
      {
        path: "blocks/footer-05/components/footer-05.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/footer-05/components/footer-05-newsletter.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/footer-05/footer-05-dictionary.ts",
        type: "registry:file",
        target: "app/footer-05/footer-05-dictionary.ts",
      },
    ],
    categories: ["footer"],
    meta: {
      iframeHeight: "600px",
    },
  },
  {
    name: "hero-05",
    title: "Hero 05",
    description:
      "A split hero with a stacked black headline, subtitle and two actions beside a large geometric brand mark.",
    type: "registry:block",
    registryDependencies: ["button"],
    files: [
      {
        path: "blocks/hero-05/page.tsx",
        type: "registry:page",
        target: "app/hero-05/page.tsx",
      },
      {
        path: "blocks/hero-05/components/hero-05.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/hero-05/hero-05-dictionary.ts",
        type: "registry:file",
        target: "app/hero-05/hero-05-dictionary.ts",
      },
    ],
    categories: ["hero"],
    meta: {
      iframeHeight: "800px",
    },
  },
  {
    name: "hero-06",
    title: "Hero 06",
    description:
      "A full-bleed editorial hero on a solid primary field with an oversized word-group headline, a highlighted closing phrase and a scroll-down pill.",
    type: "registry:block",
    files: [
      {
        path: "blocks/hero-06/page.tsx",
        type: "registry:page",
        target: "app/hero-06/page.tsx",
      },
      {
        path: "blocks/hero-06/components/hero-06.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/hero-06/hero-06-dictionary.ts",
        type: "registry:file",
        target: "app/hero-06/hero-06-dictionary.ts",
      },
    ],
    categories: ["hero"],
    meta: {
      iframeHeight: "800px",
    },
  },
  {
    name: "hero-07",
    title: "Hero 07",
    description:
      "A full-screen photo or video hero with a word-by-word 3D headline reveal and a pill search field.",
    type: "registry:block",
    dependencies: ["motion"],
    registryDependencies: ["button", "input"],
    files: [
      {
        path: "blocks/hero-07/page.tsx",
        type: "registry:page",
        target: "app/hero-07/page.tsx",
      },
      {
        path: "blocks/hero-07/components/hero-07.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/hero-07/hero-07-dictionary.ts",
        type: "registry:file",
        target: "app/hero-07/hero-07-dictionary.ts",
      },
    ],
    categories: ["hero"],
    meta: {
      iframeHeight: "800px",
    },
  },
  {
    name: "hero-08",
    title: "Hero 08",
    description:
      "A full-bleed campaign carousel with uppercase headlines, dot pagination and a play/pause control ringed by autoplay progress.",
    type: "registry:block",
    files: [
      {
        path: "blocks/hero-08/page.tsx",
        type: "registry:page",
        target: "app/hero-08/page.tsx",
      },
      {
        path: "blocks/hero-08/components/hero-08.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/hero-08/hero-08-dictionary.ts",
        type: "registry:file",
        target: "app/hero-08/hero-08-dictionary.ts",
      },
    ],
    categories: ["hero"],
    meta: {
      iframeHeight: "800px",
    },
  },
  {
    name: "features-01",
    title: "Features 01",
    description:
      "A heading with a three-column grid of bordered feature cards, each with an icon that warms to the primary color on hover.",
    type: "registry:block",
    registryDependencies: [],
    files: [
      {
        path: "blocks/features-01/page.tsx",
        type: "registry:page",
        target: "app/features-01/page.tsx",
      },
      {
        path: "blocks/features-01/components/features-01.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/features-01/features-01-dictionary.ts",
        type: "registry:file",
        target: "app/features-01/features-01-dictionary.ts",
      },
    ],
    categories: ["features"],
    meta: {
      iframeHeight: "760px",
    },
  },
  {
    name: "features-02",
    title: "Features 02",
    description:
      "Alternating image and text rows with a tag, bullet list and link; images sit in a browser-window frame and the rows mirror in RTL.",
    type: "registry:block",
    registryDependencies: [],
    files: [
      {
        path: "blocks/features-02/page.tsx",
        type: "registry:page",
        target: "app/features-02/page.tsx",
      },
      {
        path: "blocks/features-02/components/features-02.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/features-02/features-02-dictionary.ts",
        type: "registry:file",
        target: "app/features-02/features-02-dictionary.ts",
      },
    ],
    categories: ["features"],
    meta: {
      iframeHeight: "2100px",
    },
  },
  {
    name: "features-03",
    title: "Features 03",
    description:
      "A checklist of included features in a three-column grid of bordered rows with check marks.",
    type: "registry:block",
    registryDependencies: [],
    files: [
      {
        path: "blocks/features-03/page.tsx",
        type: "registry:page",
        target: "app/features-03/page.tsx",
      },
      {
        path: "blocks/features-03/components/features-03.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/features-03/features-03-dictionary.ts",
        type: "registry:file",
        target: "app/features-03/features-03-dictionary.ts",
      },
    ],
    categories: ["features"],
    meta: {
      iframeHeight: "560px",
    },
  },
  {
    name: "features-04",
    title: "Features 04",
    description:
      "An Apple-style centered feature grid with large icons and headings, configurable columns and default, muted or inverted surfaces.",
    type: "registry:block",
    registryDependencies: [],
    files: [
      {
        path: "blocks/features-04/page.tsx",
        type: "registry:page",
        target: "app/features-04/page.tsx",
      },
      {
        path: "blocks/features-04/components/features-04.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/features-04/features-04-dictionary.ts",
        type: "registry:file",
        target: "app/features-04/features-04-dictionary.ts",
      },
    ],
    categories: ["features"],
    meta: {
      iframeHeight: "1000px",
    },
  },
  {
    name: "cta-01",
    title: "CTA 01",
    description:
      "A rounded call-to-action panel with pill buttons built from cva variants, in night, soft or brand tones.",
    type: "registry:block",
    dependencies: ["class-variance-authority"],
    registryDependencies: [],
    files: [
      {
        path: "blocks/cta-01/page.tsx",
        type: "registry:page",
        target: "app/cta-01/page.tsx",
      },
      {
        path: "blocks/cta-01/components/cta-01.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/cta-01/cta-01-dictionary.ts",
        type: "registry:file",
        target: "app/cta-01/cta-01-dictionary.ts",
      },
    ],
    categories: ["cta"],
    meta: {
      iframeHeight: "560px",
    },
  },
  {
    name: "cta-02",
    title: "CTA 02",
    description:
      "A centered call-to-action banner in a bordered muted card with primary and outline buttons.",
    type: "registry:block",
    registryDependencies: ["button"],
    files: [
      {
        path: "blocks/cta-02/page.tsx",
        type: "registry:page",
        target: "app/cta-02/page.tsx",
      },
      {
        path: "blocks/cta-02/components/cta-02.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/cta-02/cta-02-dictionary.ts",
        type: "registry:file",
        target: "app/cta-02/cta-02-dictionary.ts",
      },
    ],
    categories: ["cta"],
    meta: {
      iframeHeight: "460px",
    },
  },
  {
    name: "cta-03",
    title: "CTA 03",
    description:
      "A full-bleed animated gradient call-to-action that follows the pointer and insets with rounded corners as it scrolls away.",
    type: "registry:block",
    dependencies: ["motion"],
    registryDependencies: ["button"],
    files: [
      {
        path: "blocks/cta-03/page.tsx",
        type: "registry:page",
        target: "app/cta-03/page.tsx",
      },
      {
        path: "blocks/cta-03/components/cta-03.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/cta-03/cta-03-dictionary.ts",
        type: "registry:file",
        target: "app/cta-03/cta-03-dictionary.ts",
      },
    ],
    categories: ["cta"],
    meta: {
      iframeHeight: "800px",
    },
  },
  {
    name: "stats-01",
    title: "Stats 01",
    description:
      "Parallax photo banner with a headline, followed by four counters that spring-count up when scrolled into view.",
    type: "registry:block",
    dependencies: ["motion"],
    registryDependencies: [],
    files: [
      {
        path: "blocks/stats-01/page.tsx",
        type: "registry:page",
        target: "app/stats-01/page.tsx",
      },
      {
        path: "blocks/stats-01/components/stats-01.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/stats-01/stats-01-dictionary.ts",
        type: "registry:file",
        target: "app/stats-01/stats-01-dictionary.ts",
      },
    ],
    categories: ["stats"],
    meta: {
      iframeHeight: "1000px",
    },
  },
  {
    name: "stats-02",
    title: "Stats 02",
    description:
      "Centered heading above a muted rounded panel with three large key figures.",
    type: "registry:block",
    registryDependencies: [],
    files: [
      {
        path: "blocks/stats-02/page.tsx",
        type: "registry:page",
        target: "app/stats-02/page.tsx",
      },
      {
        path: "blocks/stats-02/components/stats-02.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/stats-02/stats-02-dictionary.ts",
        type: "registry:file",
        target: "app/stats-02/stats-02-dictionary.ts",
      },
    ],
    categories: ["stats"],
    meta: {
      iframeHeight: "600px",
    },
  },
  {
    name: "logos-01",
    title: "Logos 01",
    description:
      "Trusted-by label beside an infinite logo marquee with faded, progressively blurred edges.",
    type: "registry:block",
    registryDependencies: [
      "@codebase/infinite-slider",
      "@codebase/progressive-blur",
    ],
    files: [
      {
        path: "blocks/logos-01/page.tsx",
        type: "registry:page",
        target: "app/logos-01/page.tsx",
      },
      {
        path: "blocks/logos-01/components/logos-01.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/logos-01/logos-01-dictionary.ts",
        type: "registry:file",
        target: "app/logos-01/logos-01-dictionary.ts",
      },
    ],
    categories: ["logos"],
    meta: {
      iframeHeight: "320px",
    },
  },
  {
    name: "logos-02",
    title: "Logos 02",
    description:
      "Autoplaying partner carousel of photo-and-quote cards, driven by a row of partner logo tabs.",
    type: "registry:block",
    dependencies: ["embla-carousel-react", "motion"],
    registryDependencies: ["badge", "button"],
    files: [
      {
        path: "blocks/logos-02/page.tsx",
        type: "registry:page",
        target: "app/logos-02/page.tsx",
      },
      {
        path: "blocks/logos-02/components/logos-02.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/logos-02/logos-02-dictionary.ts",
        type: "registry:file",
        target: "app/logos-02/logos-02-dictionary.ts",
      },
    ],
    categories: ["logos"],
    meta: {
      iframeHeight: "1000px",
    },
  },
  {
    name: "testimonials-01",
    title: "Testimonials 01",
    description:
      "Centered heading over a three-column grid of quote cards with avatar, name and role.",
    type: "registry:block",
    registryDependencies: ["avatar"],
    files: [
      {
        path: "blocks/testimonials-01/page.tsx",
        type: "registry:page",
        target: "app/testimonials-01/page.tsx",
      },
      {
        path: "blocks/testimonials-01/components/testimonials-01.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/testimonials-01/testimonials-01-dictionary.ts",
        type: "registry:file",
        target: "app/testimonials-01/testimonials-01-dictionary.ts",
      },
    ],
    categories: ["testimonials"],
    meta: {
      iframeHeight: "860px",
    },
  },
  {
    name: "testimonials-02",
    title: "Testimonials 02",
    description:
      "Primary-colored band with marquee watermarks, a scrollable chat-bubble testimonial card and vertical category tabs.",
    type: "registry:block",
    dependencies: ["motion"],
    registryDependencies: ["avatar"],
    files: [
      {
        path: "blocks/testimonials-02/page.tsx",
        type: "registry:page",
        target: "app/testimonials-02/page.tsx",
      },
      {
        path: "blocks/testimonials-02/components/testimonials-02.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/testimonials-02/testimonials-02-dictionary.ts",
        type: "registry:file",
        target: "app/testimonials-02/testimonials-02-dictionary.ts",
      },
    ],
    categories: ["testimonials"],
    meta: {
      iframeHeight: "960px",
    },
  },
  {
    name: "testimonials-03",
    title: "Testimonials 03",
    description:
      "Centered looping carousel of large story cards with rating, date and portrait; neighbouring cards peek at reduced scale.",
    type: "registry:block",
    dependencies: ["embla-carousel-react", "motion"],
    registryDependencies: ["button"],
    files: [
      {
        path: "blocks/testimonials-03/page.tsx",
        type: "registry:page",
        target: "app/testimonials-03/page.tsx",
      },
      {
        path: "blocks/testimonials-03/components/testimonials-03.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/testimonials-03/testimonials-03-dictionary.ts",
        type: "registry:file",
        target: "app/testimonials-03/testimonials-03-dictionary.ts",
      },
    ],
    categories: ["testimonials"],
    meta: {
      iframeHeight: "1060px",
    },
  },
  {
    name: "pricing-01",
    title: "Pricing 01",
    description:
      "Three plan cards with a monthly/yearly billing toggle, animated prices and a highlighted plan.",
    type: "registry:block",
    dependencies: ["motion"],
    registryDependencies: [
      "badge",
      "button",
      "card",
      "separator",
      "toggle-group",
    ],
    files: [
      {
        path: "blocks/pricing-01/page.tsx",
        type: "registry:page",
        target: "app/pricing-01/page.tsx",
      },
      {
        path: "blocks/pricing-01/components/pricing-01.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/pricing-01/pricing-01-dictionary.ts",
        type: "registry:file",
        target: "app/pricing-01/pricing-01-dictionary.ts",
      },
    ],
    categories: ["pricing"],
    meta: {
      iframeHeight: "1100px",
    },
  },
  {
    name: "pricing-02",
    title: "Pricing 02",
    description:
      "Compare-plans table with grouped features and info popovers, stacking into collapsible plan cards on mobile.",
    type: "registry:block",
    registryDependencies: ["accordion", "button", "popover"],
    files: [
      {
        path: "blocks/pricing-02/page.tsx",
        type: "registry:page",
        target: "app/pricing-02/page.tsx",
      },
      {
        path: "blocks/pricing-02/components/pricing-02.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/pricing-02/pricing-02-dictionary.ts",
        type: "registry:file",
        target: "app/pricing-02/pricing-02-dictionary.ts",
      },
    ],
    categories: ["pricing"],
    meta: {
      iframeHeight: "1200px",
    },
  },
  {
    name: "faq-01",
    title: "FAQ 01",
    description:
      "Centered FAQ with rounded, tinted accordion cards that turn solid when open, plus a contact line.",
    type: "registry:block",
    registryDependencies: ["accordion"],
    files: [
      {
        path: "blocks/faq-01/page.tsx",
        type: "registry:page",
        target: "app/faq-01/page.tsx",
      },
      {
        path: "blocks/faq-01/components/faq-01.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/faq-01/faq-01-dictionary.ts",
        type: "registry:file",
        target: "app/faq-01/faq-01-dictionary.ts",
      },
    ],
    categories: ["faq"],
    meta: {
      iframeHeight: "800px",
    },
  },
  {
    name: "faq-02",
    title: "FAQ 02",
    description:
      "Two-column FAQ: heading and subtitle beside a divided accordion list with optional links.",
    type: "registry:block",
    registryDependencies: ["accordion"],
    files: [
      {
        path: "blocks/faq-02/page.tsx",
        type: "registry:page",
        target: "app/faq-02/page.tsx",
      },
      {
        path: "blocks/faq-02/components/faq-02.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/faq-02/faq-02-dictionary.ts",
        type: "registry:file",
        target: "app/faq-02/faq-02-dictionary.ts",
      },
    ],
    categories: ["faq"],
    meta: {
      iframeHeight: "700px",
    },
  },
  {
    name: "how-it-works-01",
    title: "How It Works 01",
    description:
      "Three numbered steps with icon medallions joined by a dashed connector, revealed in sequence on scroll.",
    type: "registry:block",
    dependencies: ["motion"],
    registryDependencies: [],
    files: [
      {
        path: "blocks/how-it-works-01/page.tsx",
        type: "registry:page",
        target: "app/how-it-works-01/page.tsx",
      },
      {
        path: "blocks/how-it-works-01/components/how-it-works-01.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/how-it-works-01/how-it-works-01-dictionary.ts",
        type: "registry:file",
        target: "app/how-it-works-01/how-it-works-01-dictionary.ts",
      },
    ],
    categories: ["how-it-works"],
    meta: {
      iframeHeight: "720px",
    },
  },
  {
    name: "how-it-works-02",
    title: "How It Works 02",
    description:
      "Big heading over four columns of use-case cards that drift apart as you scroll (looping tracks on mobile), closed by a stats row.",
    type: "registry:block",
    dependencies: ["motion"],
    registryDependencies: [],
    files: [
      {
        path: "blocks/how-it-works-02/page.tsx",
        type: "registry:page",
        target: "app/how-it-works-02/page.tsx",
      },
      {
        path: "blocks/how-it-works-02/components/how-it-works-02.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/how-it-works-02/how-it-works-02-dictionary.ts",
        type: "registry:file",
        target: "app/how-it-works-02/how-it-works-02-dictionary.ts",
      },
    ],
    categories: ["how-it-works"],
    meta: {
      iframeHeight: "900px",
    },
  },
  {
    name: "team-01",
    title: "Team 01",
    description:
      "Four-up grid of portrait cards with name, role, short bio and social icon links, plus a hiring call-out.",
    type: "registry:block",
    registryDependencies: ["button"],
    files: [
      {
        path: "blocks/team-01/page.tsx",
        type: "registry:page",
        target: "app/team-01/page.tsx",
      },
      {
        path: "blocks/team-01/components/team-01.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/team-01/team-01-dictionary.ts",
        type: "registry:file",
        target: "app/team-01/team-01-dictionary.ts",
      },
    ],
    categories: ["team"],
    meta: {
      iframeHeight: "1400px",
    },
  },
  {
    name: "contact-01",
    title: "Contact 01",
    description:
      "Contact channel cards (chat, phone, email, address, hours) above a two-column message form with a success state.",
    type: "registry:block",
    registryDependencies: ["button", "field", "input", "textarea"],
    files: [
      {
        path: "blocks/contact-01/page.tsx",
        type: "registry:page",
        target: "app/contact-01/page.tsx",
      },
      {
        path: "blocks/contact-01/components/contact-01.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/contact-01/components/contact-01-form.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/contact-01/contact-01-dictionary.ts",
        type: "registry:file",
        target: "app/contact-01/contact-01-dictionary.ts",
      },
    ],
    categories: ["contact"],
    meta: {
      iframeHeight: "1500px",
    },
  },
  {
    name: "newsletter-01",
    title: "Newsletter 01",
    description:
      "Centered newsletter sign-up: heading, short pitch, tilted mail glyph and an inline email field with subscribe button.",
    type: "registry:block",
    registryDependencies: ["button", "input"],
    files: [
      {
        path: "blocks/newsletter-01/page.tsx",
        type: "registry:page",
        target: "app/newsletter-01/page.tsx",
      },
      {
        path: "blocks/newsletter-01/components/newsletter-01.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/newsletter-01/newsletter-01-dictionary.ts",
        type: "registry:file",
        target: "app/newsletter-01/newsletter-01-dictionary.ts",
      },
    ],
    categories: ["newsletter"],
    meta: {
      iframeHeight: "480px",
    },
  },
  {
    name: "blog-01",
    title: "Blog 01",
    description:
      "Editorial blog index: masthead, feed of posts with author, tag, date and thumbnail, and a sticky sidebar of picks and topics.",
    type: "registry:block",
    registryDependencies: ["avatar", "badge", "separator"],
    files: [
      {
        path: "blocks/blog-01/page.tsx",
        type: "registry:page",
        target: "app/blog-01/page.tsx",
      },
      {
        path: "blocks/blog-01/components/blog-01.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/blog-01/components/blog-01-card.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/blog-01/blog-01-dictionary.ts",
        type: "registry:file",
        target: "app/blog-01/blog-01-dictionary.ts",
      },
    ],
    categories: ["blog"],
    meta: {
      iframeHeight: "1200px",
    },
  },
]
