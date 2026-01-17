export interface BlockItem {
  id: string
  title: string
  description: string
  icon: string
  iconFill?: boolean
  href: string
  category?: "data" | "auth" | "payment" | "dashboard" | "forms" | "marketing" | "getting-started"
  status?: "active" | "pending" | "draft"
}

export const blocks: BlockItem[] = [
  // Data Blocks
  {
    id: "table",
    title: "Data Table",
    description: "Advanced data table with filtering, sorting, and pagination.",
    icon: "TableIcon",
    href: "/blocks/table",
    category: "data",
    status: "active",
  },

  // Auth Blocks
  {
    id: "auth",
    title: "Authentication",
    description: "Complete auth system with login, register, forgot password, and 2FA.",
    icon: "ShieldIcon",
    iconFill: true,
    href: "/blocks/auth",
    category: "auth",
    status: "active",
  },

  // Payment Blocks
  {
    id: "invoice",
    title: "Invoice",
    description: "Invoice generation and management with PDF export.",
    icon: "FileTextIcon",
    href: "/blocks/invoice",
    category: "payment",
    status: "active",
  },

  // Data/Engineering Blocks
  {
    id: "report",
    title: "T&C Report",
    description: "Electrical Testing & Commissioning reports with DOCX/PDF export.",
    icon: "FileTextIcon",
    href: "/blocks/report",
    category: "data",
    status: "active",
  },
  {
    id: "subscription",
    title: "Subscriptions",
    description: "Free and paid subscriptions using Stripe.",
    icon: "StripeIcon",
    iconFill: true,
    href: "/subscription",
    category: "payment",
    status: "active",
  },

  // Getting Started Blocks
  {
    id: "starter",
    title: "Starter Kit",
    description: "Routing, Layouts, Loading UI and API routes.",
    icon: "StarterKit",
    iconFill: true,
    href: "/starter",
    category: "getting-started",
    status: "active",
  },
  {
    id: "onboarding",
    title: "Onboarding",
    description: "Onboarding using Server Actions and Zod.",
    icon: "OnboardingIcon",
    iconFill: true,
    href: "/onboarding",
    category: "getting-started",
    status: "active",
  },
  {
    id: "notification",
    title: "Notification",
    description: "Notifications using Pusher and web sockets.",
    icon: "NotificationIcon",
    href: "/notification",
    category: "getting-started",
    status: "draft",
  },
  {
    id: "mdx",
    title: "Markdown-x",
    description: "Content using native Next.js MDX",
    icon: "MDXIcon",
    href: "/mdx",
    category: "getting-started",
    status: "active",
  },
]

// Helper functions
export function getBlocksByCategory(category: BlockItem["category"]): BlockItem[] {
  return blocks.filter((block) => block.category === category)
}

export function getActiveBlocks(): BlockItem[] {
  return blocks.filter((block) => block.status === "active")
}