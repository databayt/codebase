// Template categories — mirrors shadcn's apps/v4/lib/categories.ts.
// One list drives the /templates nav, static params and the registry build.
export const registryCategories = [
  { name: "Sidebar", slug: "sidebar", hidden: false },
  { name: "Dashboard", slug: "dashboard", hidden: true },
  { name: "Authentication", slug: "authentication", hidden: true },
  { name: "Login", slug: "login", hidden: false },
  { name: "Signup", slug: "signup", hidden: false },
  { name: "Subscription", slug: "subscription", hidden: false },
  { name: "Header", slug: "header", hidden: false },
  { name: "Hero", slug: "hero", hidden: false },
  { name: "Features", slug: "features", hidden: false },
  { name: "Stats", slug: "stats", hidden: false },
  { name: "Logos", slug: "logos", hidden: false },
  { name: "Pricing", slug: "pricing", hidden: false },
  { name: "Testimonials", slug: "testimonials", hidden: false },
  { name: "FAQ", slug: "faq", hidden: false },
  { name: "How It Works", slug: "how-it-works", hidden: false },
  { name: "Team", slug: "team", hidden: false },
  { name: "Contact", slug: "contact", hidden: false },
  { name: "Newsletter", slug: "newsletter", hidden: false },
  { name: "Blog", slug: "blog", hidden: false },
  { name: "CTA", slug: "cta", hidden: false },
  { name: "Footer", slug: "footer", hidden: false },
]

export type RegistryCategory = (typeof registryCategories)[number]
