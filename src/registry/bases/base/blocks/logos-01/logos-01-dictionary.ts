import { type LogosDictionary } from "@/registry/bases/base/blocks/logos-01/components/logos-01"

const logos: LogosDictionary["logos"] = [
  { name: "Vercel", src: "https://cdn.simpleicons.org/vercel/18181b" },
  { name: "Stripe", src: "https://cdn.simpleicons.org/stripe/18181b" },
  { name: "GitHub", src: "https://cdn.simpleicons.org/github/18181b" },
  { name: "Notion", src: "https://cdn.simpleicons.org/notion/18181b" },
  { name: "Figma", src: "https://cdn.simpleicons.org/figma/18181b" },
  { name: "Shopify", src: "https://cdn.simpleicons.org/shopify/18181b" },
  { name: "Supabase", src: "https://cdn.simpleicons.org/supabase/18181b" },
  { name: "Linear", src: "https://cdn.simpleicons.org/linear/18181b" },
]

export const dictionary: Record<"en" | "ar", LogosDictionary> = {
  en: {
    title: "Trusted by teams\nat leading companies",
    logos,
  },
  ar: {
    title: "تثق بنا فرقٌ\nفي شركات رائدة",
    logos,
  },
}
