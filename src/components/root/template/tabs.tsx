"use client"

import { TabsNav } from "@/components/atom/tabs"

interface TemplateLabels {
  hero?: string;
  landing?: string;
  dashboard?: string;
  ecommerce?: string;
  blog?: string;
  portfolio?: string;
  components?: string;
}

interface TemplateTabsProps {
  templateLabels?: TemplateLabels;
}

export default function TemplateTabs({ templateLabels }: TemplateTabsProps) {
  const examples = [
    {
      name: templateLabels?.hero || "Hero",
      href: "/templates/hero",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/hero-templates",
      hidden: false,
    },
    {
      name: templateLabels?.landing || "Landing",
      href: "/templates/landing",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/landing-templates",
      hidden: false,
    },
    {
      name: templateLabels?.dashboard || "Dashboard",
      href: "/templates/dashboard",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/dashboard-templates",
      hidden: false,
    },
    {
      name: templateLabels?.ecommerce || "E-commerce",
      href: "/templates/ecommerce",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/ecommerce-templates",
      hidden: false,
    },
    {
      name: templateLabels?.blog || "Blog",
      href: "/templates/blog",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/blog-templates",
      hidden: false,
    },
    {
      name: templateLabels?.portfolio || "Portfolio",
      href: "/templates/portfolio",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/portfolio-templates",
      hidden: false,
    },
  ]

  const defaultTab = {
    name: templateLabels?.components || "Template Components",
    href: "/templates",
    code: "",
    hidden: false,
  }

  return (
    <div className="py-3 border-b-[0.5px]">
      <div className="rtl:text-right">
        <TabsNav tabs={examples} defaultTab={defaultTab} />
      </div>
    </div>
  )
}