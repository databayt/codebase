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
]
