import { type CtaDictionary } from "@/registry/bases/base/blocks/cta-02/components/cta-02"

export const dictionary: Record<"en" | "ar", CtaDictionary> = {
  en: {
    title: "Start running your projects the simple way",
    description:
      "Join thousands of teams who plan, track and deliver their work with Acme. Set up takes less than five minutes.",
    primary: { label: "Get started", href: "#" },
    secondary: { label: "View pricing", href: "/pricing" },
  },
  ar: {
    title: "ابدأ في إدارة مشاريعك بالطريقة الأبسط",
    description:
      "انضم إلى آلاف الفرق التي تخطط لأعمالها وتتابعها وتنجزها مع Acme. لا يستغرق الإعداد أكثر من خمس دقائق.",
    primary: { label: "ابدأ الآن", href: "#" },
    secondary: { label: "اطّلع على الأسعار", href: "/pricing" },
  },
}
