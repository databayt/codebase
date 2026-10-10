import { type HeaderDictionary } from "@/registry/bases/base/blocks/header-04/components/header-04"

export const dictionary: Record<"en" | "ar", HeaderDictionary> = {
  en: {
    brand: { name: "Acme", href: "#" },
    skipToContent: "Skip to content",
    navLabel: "Main",
    links: [
      { label: "Spaces", href: "#", current: true },
      { label: "Membership", href: "#" },
      { label: "Events", href: "#" },
      { label: "Programs", href: "#" },
      { label: "Community", href: "#" },
    ],
    more: {
      label: "More",
      links: [
        { label: "Stories", href: "#" },
        { label: "Partners", href: "#" },
        { label: "About", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    language: {
      label: "Language",
      switchTo: "العربية",
      href: "/ar",
      lang: "ar",
    },
    cta: { label: "Book a tour", href: "#" },
    menu: { open: "Open menu", close: "Close menu" },
  },
  ar: {
    brand: { name: "أكمي", href: "#" },
    skipToContent: "انتقل إلى المحتوى",
    navLabel: "التنقل الرئيسي",
    links: [
      { label: "المساحات", href: "#", current: true },
      { label: "العضوية", href: "#" },
      { label: "الفعاليات", href: "#" },
      { label: "البرامج", href: "#" },
      { label: "المجتمع", href: "#" },
    ],
    more: {
      label: "المزيد",
      links: [
        { label: "قصص", href: "#" },
        { label: "الشركاء", href: "#" },
        { label: "من نحن", href: "#" },
        { label: "تواصل معنا", href: "#" },
      ],
    },
    language: {
      label: "اللغة",
      switchTo: "English",
      href: "/en",
      lang: "en",
    },
    cta: { label: "احجز جولة", href: "#" },
    menu: { open: "فتح القائمة", close: "إغلاق القائمة" },
  },
}
