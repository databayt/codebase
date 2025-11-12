export interface TemplateCategory {
  name: string
  slug: string
  description?: string
  hidden?: boolean
  icon?: string
}

export const templateCategories: TemplateCategory[] = [
  {
    name: "Authentication",
    slug: "authentication",
    description: "Login, register, and authentication templates",
    icon: "🔐",
  },
  {
    name: "Login",
    slug: "login",
    description: "Login form templates",
    hidden: false,
  },
  {
    name: "Hero",
    slug: "hero",
    description: "Hero sections and landing page headers",
    icon: "🚀",
  },
  {
    name: "Marketing",
    slug: "marketing",
    description: "Marketing and promotional sections",
    icon: "📢",
  },
  {
    name: "Landing",
    slug: "landing",
    description: "Landing page components",
    icon: "🎯",
  },
  {
    name: "Navigation",
    slug: "navigation",
    description: "Navigation components including headers, sidebars, and footers",
    icon: "🧭",
  },
  {
    name: "Sidebar",
    slug: "sidebar",
    description: "Sidebar navigation templates",
    hidden: false,
  },
  {
    name: "Documentation",
    slug: "documentation",
    description: "Documentation-specific templates",
    icon: "📚",
  },
  {
    name: "Header",
    slug: "header",
    description: "Header and top navigation templates",
    hidden: false,
  },
  {
    name: "Footer",
    slug: "footer",
    description: "Footer templates",
    hidden: false,
  },
  {
    name: "Dashboard",
    slug: "dashboard",
    description: "Dashboard layouts and components",
    icon: "📊",
  },
  {
    name: "Forms",
    slug: "forms",
    description: "Form templates and layouts",
    icon: "📝",
  },
  {
    name: "E-commerce",
    slug: "ecommerce",
    description: "E-commerce templates including product pages and carts",
    icon: "🛍️",
  },
  {
    name: "Blog",
    slug: "blog",
    description: "Blog and article templates",
    icon: "✍️",
  },
  {
    name: "Portfolio",
    slug: "portfolio",
    description: "Portfolio and showcase templates",
    icon: "🎨",
  },
  {
    name: "Pricing",
    slug: "pricing",
    description: "Pricing tables and plans",
    icon: "💰",
  },
  {
    name: "Contact",
    slug: "contact",
    description: "Contact forms and pages",
    icon: "📧",
  },
  {
    name: "About",
    slug: "about",
    description: "About us and team pages",
    icon: "ℹ️",
  },
  {
    name: "Error",
    slug: "error",
    description: "Error pages (404, 500, etc.)",
    icon: "⚠️",
  },
  {
    name: "Settings",
    slug: "settings",
    description: "Settings and configuration pages",
    icon: "⚙️",
  },
]

// Get category by slug
export function getTemplateCategory(slug: string): TemplateCategory | undefined {
  return templateCategories.find((cat) => cat.slug === slug)
}

// Get visible categories (not hidden)
export function getVisibleTemplateCategories(): TemplateCategory[] {
  return templateCategories.filter((cat) => !cat.hidden)
}

// Get category display name
export function getCategoryDisplayName(slug: string): string {
  const category = getTemplateCategory(slug)
  return category?.name || slug.charAt(0).toUpperCase() + slug.slice(1)
}

// Check if category exists
export function categoryExists(slug: string): boolean {
  return templateCategories.some((cat) => cat.slug === slug)
}

// Get categories for navigation
export function getNavigationCategories(): TemplateCategory[] {
  // Return main categories that should appear in navigation
  const mainCategories = [
    "authentication",
    "hero",
    "navigation",
    "dashboard",
    "forms",
    "ecommerce",
  ]

  return templateCategories.filter((cat) => mainCategories.includes(cat.slug) && !cat.hidden)
}

// Group templates by category
export function groupTemplatesByCategory(templates: Array<{ categories?: string[] }>) {
  const grouped: Record<string, typeof templates> = {}

  templates.forEach((template) => {
    if (template.categories) {
      template.categories.forEach((category) => {
        if (!grouped[category]) {
          grouped[category] = []
        }
        grouped[category].push(template)
      })
    }
  })

  return grouped
}