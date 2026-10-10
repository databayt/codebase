import { type CtaDictionary } from "@/registry/bases/base/blocks/cta-03/components/cta-03"

export const dictionary: Record<"en" | "ar", CtaDictionary> = {
  en: {
    title: "Ready to build what's next?",
    description:
      "Tell us where you want to go and we'll help you get there. Start today, or book a call with our team to plan your launch together.",
    primary: { label: "Start your journey", href: "#" },
    secondary: { label: "Schedule a meeting", href: "#" },
  },
  ar: {
    title: "هل أنت مستعد لبناء ما هو قادم؟",
    description:
      "أخبرنا إلى أين تريد الوصول وسنساعدك على بلوغه. ابدأ اليوم، أو احجز مكالمة مع فريقنا لنخطط لانطلاقتك معًا.",
    primary: { label: "ابدأ رحلتك", href: "#" },
    secondary: { label: "احجز موعدًا", href: "#" },
  },
}
