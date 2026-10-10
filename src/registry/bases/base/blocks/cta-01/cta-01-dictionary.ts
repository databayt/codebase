import { type CtaDictionary } from "@/registry/bases/base/blocks/cta-01/components/cta-01"

export const dictionary: Record<"en" | "ar", CtaDictionary> = {
  en: {
    eyebrow: "Get started",
    title: "Ready to bring your team together?",
    description:
      "Set up your Acme workspace in minutes and invite your team. Our specialists are here to help you every step of the way.",
    primary: { label: "Start free trial", href: "#" },
    secondary: { label: "Talk to sales", href: "#" },
    note: "Free for 14 days. No credit card required.",
  },
  ar: {
    eyebrow: "ابدأ الآن",
    title: "هل أنت مستعد لجمع فريقك في مكان واحد؟",
    description:
      "أنشئ مساحة عملك في Acme خلال دقائق وادعُ فريقك إليها. يرافقك مختصّونا في كل خطوة.",
    primary: { label: "ابدأ تجربتك المجانية", href: "#" },
    secondary: { label: "تحدّث مع فريق المبيعات", href: "#" },
    note: "مجانًا لمدة 14 يومًا، دون الحاجة إلى بطاقة ائتمان.",
  },
}
