import { type HeroDictionary } from "@/registry/bases/base/blocks/hero-05/components/hero-05"

export const dictionary: Record<"en" | "ar", HeroDictionary> = {
  en: {
    title: ["The complete", "platform to", "run your", "business."],
    subtitle:
      "Acme brings operations, finance and customer work into one place, so your team moves faster with a modern experience and clear insight for every decision.",
    primaryAction: { label: "Get started", href: "#" },
    secondaryAction: { label: "Live demo", href: "#" },
  },
  ar: {
    title: ["المنصة", "المتكاملة", "لإدارة", "أعمالك."],
    subtitle:
      "تجمع Acme العمليات والمالية وخدمة العملاء في مكان واحد، ليعمل فريقك بسرعة أكبر عبر تجربة حديثة ورؤية واضحة تدعم كل قرار.",
    primaryAction: { label: "ابدأ الآن", href: "#" },
    secondaryAction: { label: "عرض تجريبي", href: "#" },
  },
}
