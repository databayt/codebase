import { type FooterDictionary } from "@/registry/bases/base/blocks/footer-04/components/footer-04"

export const dictionary: Record<"en" | "ar", FooterDictionary> = {
  en: {
    brand: { name: "Acme", href: "#" },
    navLabel: "Footer",
    columns: [
      {
        title: "Product",
        links: [
          { label: "Overview", href: "#" },
          { label: "Features", href: "#" },
          { label: "Integrations", href: "#" },
          { label: "Pricing", href: "#" },
          { label: "Changelog", href: "#" },
          { label: "Security", href: "#" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "#" },
          { label: "Careers", href: "#" },
          { label: "Blog", href: "#" },
          { label: "Customers", href: "#" },
        ],
      },
      {
        title: "Services",
        links: [
          { label: "Consulting", href: "#" },
          { label: "Implementation", href: "#" },
          { label: "Training", href: "#" },
          { label: "Managed support", href: "#" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Help center", href: "#" },
          { label: "Contact", href: "#" },
          { label: "Documentation", href: "#" },
          { label: "System status", href: "#" },
        ],
      },
    ],
    ready: {
      title: "Ready to get started?",
      button: { label: "Start free trial", href: "#" },
    },
    socialLabel: "Follow us",
    social: [
      { label: "GitHub", href: "https://github.com", icon: "github" },
      { label: "X", href: "https://x.com", icon: "x" },
      { label: "LinkedIn", href: "https://www.linkedin.com", icon: "linkedin" },
      { label: "Instagram", href: "https://www.instagram.com", icon: "instagram" },
      { label: "Facebook", href: "https://www.facebook.com", icon: "facebook" },
      { label: "WhatsApp", href: "https://www.whatsapp.com", icon: "whatsapp" },
    ],
    copyright: "© 2026 Acme, Inc. All rights reserved.",
  },
  ar: {
    brand: { name: "أكمي", href: "#" },
    navLabel: "تذييل الصفحة",
    columns: [
      {
        title: "المنتج",
        links: [
          { label: "نظرة عامة", href: "#" },
          { label: "المزايا", href: "#" },
          { label: "التكاملات", href: "#" },
          { label: "الأسعار", href: "#" },
          { label: "سجل التحديثات", href: "#" },
          { label: "الأمان", href: "#" },
        ],
      },
      {
        title: "الشركة",
        links: [
          { label: "من نحن", href: "#" },
          { label: "الوظائف", href: "#" },
          { label: "المدونة", href: "#" },
          { label: "عملاؤنا", href: "#" },
        ],
      },
      {
        title: "الخدمات",
        links: [
          { label: "الاستشارات", href: "#" },
          { label: "التنفيذ", href: "#" },
          { label: "التدريب", href: "#" },
          { label: "الدعم المُدار", href: "#" },
        ],
      },
      {
        title: "الدعم",
        links: [
          { label: "مركز المساعدة", href: "#" },
          { label: "تواصل معنا", href: "#" },
          { label: "التوثيق", href: "#" },
          { label: "حالة النظام", href: "#" },
        ],
      },
    ],
    ready: {
      title: "هل أنت مستعد للبدء؟",
      button: { label: "ابدأ تجربتك المجانية", href: "#" },
    },
    socialLabel: "تابعنا",
    social: [
      { label: "GitHub", href: "https://github.com", icon: "github" },
      { label: "X", href: "https://x.com", icon: "x" },
      { label: "LinkedIn", href: "https://www.linkedin.com", icon: "linkedin" },
      { label: "Instagram", href: "https://www.instagram.com", icon: "instagram" },
      { label: "Facebook", href: "https://www.facebook.com", icon: "facebook" },
      { label: "WhatsApp", href: "https://www.whatsapp.com", icon: "whatsapp" },
    ],
    copyright: "© 2026 أكمي. جميع الحقوق محفوظة.",
  },
}
