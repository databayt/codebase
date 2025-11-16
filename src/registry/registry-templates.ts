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
  },
  {
    name: "sidebar-02",
    description: "A sidebar with collapsible sections.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "dropdown-menu"
    ],
    files: [
      {
        path: "templates/sidebar-02/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-02/components/app-sidebar.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-02/components/search-form.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-02/components/version-switcher.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "sidebar-04",
    description: "A floating sidebar with submenus.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator"
    ],
    files: [
      {
        path: "templates/sidebar-04/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-04/components/app-sidebar.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "sidebar-05",
    description: "A sidebar with collapsible submenus.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "collapsible"
    ],
    files: [
      {
        path: "templates/sidebar-05/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-05/components/app-sidebar.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-05/components/search-form.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "sidebar-06",
    description: "A sidebar with submenus as dropdowns.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "card",
      "dropdown-menu"
    ],
    files: [
      {
        path: "templates/sidebar-06/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-06/components/app-sidebar.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-06/components/nav-main.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-06/components/sidebar-opt-in-form.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "sidebar-08",
    description: "An inset sidebar with secondary navigation.",
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
        path: "templates/sidebar-08/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-08/components/app-sidebar.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-08/components/nav-main.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-08/components/nav-projects.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-08/components/nav-secondary.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-08/components/nav-user.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "sidebar-09",
    description: "Collapsible nested sidebars.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
      "switch",
      "label"
    ],
    files: [
      {
        path: "templates/sidebar-09/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-09/components/app-sidebar.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-09/components/nav-user.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "sidebar-10",
    description: "A sidebar in a popover.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "popover",
      "collapsible",
      "dropdown-menu"
    ],
    files: [
      {
        path: "templates/sidebar-10/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-10/components/app-sidebar.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-10/components/nav-actions.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-10/components/nav-favorites.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-10/components/nav-main.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-10/components/nav-secondary.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-10/components/nav-workspaces.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-10/components/team-switcher.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "sidebar-11",
    description: "A sidebar with a collapsible file tree.",
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
        path: "templates/sidebar-11/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-11/components/app-sidebar.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "sidebar-12",
    description: "A sidebar with a calendar.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "calendar",
      "dropdown-menu",
      "avatar"
    ],
    files: [
      {
        path: "templates/sidebar-12/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-12/components/app-sidebar.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-12/components/calendars.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-12/components/date-picker.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-12/components/nav-user.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "sidebar-13",
    description: "A sidebar in a dialog.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "button",
      "dialog"
    ],
    files: [
      {
        path: "templates/sidebar-13/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-13/components/settings-dialog.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "sidebar-14",
    description: "A sidebar on the right.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "sidebar",
      "breadcrumb"
    ],
    files: [
      {
        path: "templates/sidebar-14/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-14/components/app-sidebar.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "sidebar-15",
    description: "A left and right sidebar.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "popover",
      "collapsible",
      "dropdown-menu",
      "calendar",
      "avatar"
    ],
    files: [
      {
        path: "templates/sidebar-15/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-15/components/calendars.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-15/components/date-picker.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-15/components/nav-favorites.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-15/components/nav-main.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-15/components/nav-secondary.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-15/components/nav-user.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-15/components/nav-workspaces.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-15/components/sidebar-left.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-15/components/sidebar-right.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-15/components/team-switcher.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "sidebar-16",
    description: "A sidebar with a sticky site header.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
      "button",
      "label"
    ],
    files: [
      {
        path: "templates/sidebar-16/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/sidebar-16/components/app-sidebar.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-16/components/nav-main.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-16/components/nav-projects.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-16/components/nav-secondary.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-16/components/nav-user.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-16/components/search-form.tsx",
        type: "registry:component"
      },
      {
        path: "templates/sidebar-16/components/site-header.tsx",
        type: "registry:component"
      }
    ],
    categories: ["sidebar", "dashboard"],
    meta: {
      iframeHeight: "900px"
    }
  },
  {
    name: "signup-01",
    description: "A simple signup form.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "button",
      "card",
      "input",
      "label"
    ],
    files: [
      {
        path: "templates/signup-01/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/signup-01/components/signup-form.tsx",
        type: "registry:component"
      }
    ],
    categories: ["authentication", "signup"],
    meta: {
      iframeHeight: "600px"
    }
  },
  {
    name: "signup-02",
    description: "A two column signup page with a cover image.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "button",
      "input",
      "label"
    ],
    files: [
      {
        path: "templates/signup-02/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/signup-02/components/signup-form.tsx",
        type: "registry:component"
      }
    ],
    categories: ["authentication", "signup"],
    meta: {
      iframeHeight: "800px"
    }
  },
  {
    name: "signup-03",
    description: "A signup page with a muted background color.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "button",
      "card",
      "input",
      "label"
    ],
    files: [
      {
        path: "templates/signup-03/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/signup-03/components/signup-form.tsx",
        type: "registry:component"
      }
    ],
    categories: ["authentication", "signup"],
    meta: {
      iframeHeight: "700px"
    }
  },
  {
    name: "signup-04",
    description: "A signup page with form and image.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "button",
      "card",
      "input",
      "label"
    ],
    files: [
      {
        path: "templates/signup-04/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/signup-04/components/signup-form.tsx",
        type: "registry:component"
      }
    ],
    categories: ["authentication", "signup"],
    meta: {
      iframeHeight: "800px"
    }
  },
  {
    name: "signup-05",
    description: "A simple signup form with social providers.",
    type: "registry:template",
    dependencies: [],
    registryDependencies: [
      "button",
      "input",
      "label"
    ],
    files: [
      {
        path: "templates/signup-05/page.tsx",
        type: "registry:page"
      },
      {
        path: "templates/signup-05/components/signup-form.tsx",
        type: "registry:component"
      }
    ],
    categories: ["authentication", "signup"],
    meta: {
      iframeHeight: "600px"
    }
  }
]