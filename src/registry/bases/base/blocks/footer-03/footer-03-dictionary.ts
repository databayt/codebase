import { type FooterDictionary } from "@/registry/bases/base/blocks/footer-03/components/footer-03"

export const dictionary: Record<"en" | "ar", FooterDictionary> = {
  en: {
    cta: {
      lineLight: "Good work needs good company.",
      lineBold: "Come see the space.",
      button: { label: "Book a tour", href: "#" },
    },
    brand: { name: "Acme", href: "#" },
    navLabel: "Footer",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Docs", href: "#" },
      { label: "Privacy", href: "#" },
    ],
    copyright: "© 2026 Acme, Inc. All rights reserved.",
    notes: ["Open daily 8am–10pm"],
  },
  ar: {
    cta: {
      lineLight: "العمل الجيد يحتاج إلى صحبة جيدة.",
      lineBold: "تعال وشاهد المساحة.",
      button: { label: "احجز جولة", href: "#" },
    },
    brand: { name: "أكمي", href: "#" },
    navLabel: "تذييل الصفحة",
    links: [
      { label: "من نحن", href: "#" },
      { label: "تواصل معنا", href: "#" },
      { label: "الوظائف", href: "#" },
      { label: "التوثيق", href: "#" },
      { label: "الخصوصية", href: "#" },
    ],
    copyright: "© 2026 أكمي. جميع الحقوق محفوظة.",
    notes: ["مفتوح يوميًا من 8 صباحًا حتى 10 مساءً"],
  },
}
