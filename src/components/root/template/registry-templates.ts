import { type Registry } from "./registry"

export const templates: Registry["items"] = [
  {
    name: "login-01",
    description: "A simple login form with email and password fields.",
    type: "registry:template",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "template/login-01/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
    ],
    categories: ["authentication", "login"],
    meta: {
      iframeHeight: "600px",
      container: "flex min-h-screen items-center justify-center",
      mobile: "component",
    },
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
    meta: {
      iframeHeight: "700px",
      container: "bg-background",
      mobile: "component",
    },
  },
  {
    name: "sidebar-01",
    description: "Documentation sidebar with collapsible navigation.",
    type: "registry:template",
    registryDependencies: ["sidebar", "scroll-area"],
    files: [
      {
        path: "template/sidebar-01/page.tsx",
        target: "app/sidebar/page.tsx",
        type: "registry:page",
      },
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
    ],
    categories: ["navigation", "sidebar", "documentation"],
    meta: {
      iframeHeight: "1000px",
      container: "flex min-h-screen",
      mobile: "screenshot",
    },
  },
  {
    name: "header-01",
    description: "Responsive header with navigation and mobile menu.",
    type: "registry:template",
    registryDependencies: ["button", "navigation-menu", "sheet"],
    files: [
      {
        path: "template/header-01/page.tsx",
        target: "app/header/page.tsx",
        type: "registry:page",
      },
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
        path: "template/footer-01/page.tsx",
        target: "app/footer/page.tsx",
        type: "registry:page",
      },
      {
        path: "template/footer-01/content.tsx",
        target: "components/footer.tsx",
        type: "registry:component",
      },
    ],
    categories: ["navigation", "footer"],
  },
]

// Additional templates from shadcn will be added here as they are implemented
// This includes dashboard, calendar, and other templates