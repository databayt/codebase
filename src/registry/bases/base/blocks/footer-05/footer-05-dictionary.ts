import { type FooterDictionary } from "@/registry/bases/base/blocks/footer-05/components/footer-05"

export const dictionary: Record<"en" | "ar", FooterDictionary> = {
  en: {
    newsletter: {
      title: "Newsletter",
      description: "Product news and guides, once a month. No spam.",
      emailLabel: "Email address",
      emailPlaceholder: "Email address",
      subscribe: "Subscribe",
    },
    navLabel: "Footer",
    sections: [
      {
        title: "About",
        links: [
          { label: "Our story", href: "#" },
          { label: "Team", href: "#" },
          { label: "Careers", href: "#" },
          { label: "Investors", href: "#" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Documentation", href: "#" },
          { label: "Guides", href: "#" },
          { label: "Templates", href: "#" },
          { label: "Changelog", href: "#" },
          { label: "Community", href: "#" },
        ],
      },
      {
        title: "Product",
        links: [
          { label: "Features", href: "#" },
          { label: "Integrations", href: "#" },
          { label: "Automation", href: "#" },
          { label: "Pricing", href: "#" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Help center", href: "#" },
          { label: "FAQs", href: "#" },
          { label: "Contact", href: "#" },
          { label: "Sitemap", href: "#" },
        ],
      },
    ],
    brand: { name: "Acme", href: "#" },
    copyright: "© 2026 Acme, Inc.",
    legalLabel: "Legal",
    legal: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Safety", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  ar: {
    newsletter: {
      title: "النشرة البريدية",
      description: "أخبار المنتج وأدلة الاستخدام مرة في الشهر، بلا رسائل مزعجة.",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "البريد الإلكتروني",
      subscribe: "اشترك",
    },
    navLabel: "تذييل الصفحة",
    sections: [
      {
        title: "عن الشركة",
        links: [
          { label: "قصتنا", href: "#" },
          { label: "الفريق", href: "#" },
          { label: "الوظائف", href: "#" },
          { label: "المستثمرون", href: "#" },
        ],
      },
      {
        title: "الموارد",
        links: [
          { label: "التوثيق", href: "#" },
          { label: "الأدلة", href: "#" },
          { label: "القوالب", href: "#" },
          { label: "سجل التحديثات", href: "#" },
          { label: "المجتمع", href: "#" },
        ],
      },
      {
        title: "المنتج",
        links: [
          { label: "المزايا", href: "#" },
          { label: "التكاملات", href: "#" },
          { label: "الأتمتة", href: "#" },
          { label: "الأسعار", href: "#" },
        ],
      },
      {
        title: "الدعم",
        links: [
          { label: "مركز المساعدة", href: "#" },
          { label: "الأسئلة الشائعة", href: "#" },
          { label: "تواصل معنا", href: "#" },
          { label: "خريطة الموقع", href: "#" },
        ],
      },
    ],
    brand: { name: "أكمي", href: "#" },
    copyright: "© 2026 أكمي.",
    legalLabel: "الشؤون القانونية",
    legal: [
      { label: "الشروط", href: "#" },
      { label: "الخصوصية", href: "#" },
      { label: "الأمان", href: "#" },
      { label: "حالة الخدمة", href: "#" },
    ],
  },
}
