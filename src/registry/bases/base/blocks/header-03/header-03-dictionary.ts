import { type HeaderDictionary } from "@/registry/bases/base/blocks/header-03/components/header-03"

export const dictionary: Record<"en" | "ar", HeaderDictionary> = {
  en: {
    brand: { name: "Acme", href: "#" },
    navLabel: "Main",
    links: [
      { label: "Features", href: "#", current: true },
      { label: "Customers", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Documentation", href: "#" },
    ],
    language: {
      label: "Switch language",
      name: "العربية",
      href: "/ar",
      lang: "ar",
    },
    theme: { label: "Toggle theme" },
    action: { label: "Sign in", href: "#" },
    menu: {
      label: "Menu",
      open: "Open menu",
      close: "Close menu",
      home: "Home",
    },
  },
  ar: {
    brand: { name: "أكمي", href: "#" },
    navLabel: "التنقل الرئيسي",
    links: [
      { label: "المزايا", href: "#", current: true },
      { label: "العملاء", href: "#" },
      { label: "الأسعار", href: "#" },
      { label: "التوثيق", href: "#" },
    ],
    language: {
      label: "تغيير اللغة",
      name: "English",
      href: "/en",
      lang: "en",
    },
    theme: { label: "تبديل المظهر" },
    action: { label: "تسجيل الدخول", href: "#" },
    menu: {
      label: "القائمة",
      open: "فتح القائمة",
      close: "إغلاق القائمة",
      home: "الرئيسية",
    },
  },
}
