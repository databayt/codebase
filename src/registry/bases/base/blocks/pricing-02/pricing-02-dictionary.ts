import { type PricingDictionary } from "@/registry/bases/base/blocks/pricing-02/components/pricing-02"

export const dictionary: Record<"en" | "ar", PricingDictionary> = {
  en: {
    title: "Compare plans",
    subtitle: "Find the plan that fits your team today, and grows with it tomorrow.",
    featureColumn: "Feature",
    included: "Included",
    notIncluded: "Not included",
    moreInfo: "More about {feature}",
    plans: [
      {
        id: "starter",
        name: "Starter",
        price: "Free",
        cta: { label: "Get started", href: "#" },
      },
      {
        id: "pro",
        name: "Pro",
        price: "$29 / month",
        cta: { label: "Start free trial", href: "#" },
        featured: true,
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: "Custom",
        cta: { label: "Contact sales", href: "#" },
      },
    ],
    sections: [
      {
        title: "Usage",
        rows: [
          {
            feature: "Team members",
            values: { starter: "Up to 3", pro: "Unlimited", enterprise: "Unlimited" },
          },
          {
            feature: "Projects",
            values: { starter: "5", pro: "Unlimited", enterprise: "Unlimited" },
          },
          {
            feature: "Storage",
            values: { starter: "1 GB", pro: "50 GB", enterprise: "Unlimited" },
          },
          {
            feature: "API requests",
            tooltip:
              "Starter has no API access. Pro is rate-limited; Enterprise has no limit.",
            values: { starter: null, pro: "1,000 / hour", enterprise: "Unlimited" },
          },
        ],
      },
      {
        title: "Features",
        rows: [
          {
            feature: "Core workspace",
            values: { starter: true, pro: true, enterprise: true },
          },
          {
            feature: "Analytics and reports",
            values: { starter: "Basic", pro: "Advanced", enterprise: "Advanced + custom" },
          },
          {
            feature: "Custom branding",
            values: { starter: false, pro: true, enterprise: "White-label" },
          },
          {
            feature: "Data export",
            values: { starter: true, pro: true, enterprise: true },
          },
        ],
      },
      {
        title: "Security and support",
        rows: [
          {
            feature: "Single sign-on (SAML)",
            tooltip: "Sign in through your identity provider. Enterprise only.",
            values: { starter: false, pro: false, enterprise: true },
          },
          {
            feature: "Uptime SLA",
            tooltip: "A contractual uptime guarantee with service credits.",
            values: { starter: false, pro: false, enterprise: "99.9%" },
          },
          {
            feature: "Support",
            values: {
              starter: "Community",
              pro: "Priority email",
              enterprise: "Dedicated manager",
            },
          },
        ],
      },
    ],
  },
  ar: {
    title: "قارن بين الخطط",
    subtitle: "اختر الخطة التي تناسب فريقك اليوم وتنمو معه غدًا.",
    featureColumn: "الميزة",
    included: "مشمولة",
    notIncluded: "غير مشمولة",
    moreInfo: "مزيد من التفاصيل عن {feature}",
    plans: [
      {
        id: "starter",
        name: "الأساسية",
        price: "مجانًا",
        cta: { label: "ابدأ الآن", href: "#" },
      },
      {
        id: "pro",
        name: "الاحترافية",
        price: "٢٩ $ / شهريًا",
        cta: { label: "ابدأ التجربة المجانية", href: "#" },
        featured: true,
      },
      {
        id: "enterprise",
        name: "المؤسسات",
        price: "حسب الطلب",
        cta: { label: "تواصل مع المبيعات", href: "#" },
      },
    ],
    sections: [
      {
        title: "الاستخدام",
        rows: [
          {
            feature: "أعضاء الفريق",
            values: { starter: "حتى ٣", pro: "غير محدود", enterprise: "غير محدود" },
          },
          {
            feature: "المشاريع",
            values: { starter: "٥", pro: "غير محدود", enterprise: "غير محدود" },
          },
          {
            feature: "مساحة التخزين",
            values: { starter: "١ غيغابايت", pro: "٥٠ غيغابايت", enterprise: "غير محدودة" },
          },
          {
            feature: "طلبات الواجهة البرمجية",
            tooltip:
              "لا تتضمن الخطة الأساسية وصولًا إلى الواجهة البرمجية. الخطة الاحترافية محدودة بمعدل، وخطة المؤسسات بلا حدود.",
            values: { starter: null, pro: "١٬٠٠٠ / ساعة", enterprise: "غير محدودة" },
          },
        ],
      },
      {
        title: "الميزات",
        rows: [
          {
            feature: "مساحة العمل الأساسية",
            values: { starter: true, pro: true, enterprise: true },
          },
          {
            feature: "التحليلات والتقارير",
            values: { starter: "أساسية", pro: "متقدمة", enterprise: "متقدمة ومخصصة" },
          },
          {
            feature: "هوية بصرية مخصصة",
            values: { starter: false, pro: true, enterprise: "علامة بيضاء" },
          },
          {
            feature: "تصدير البيانات",
            values: { starter: true, pro: true, enterprise: true },
          },
        ],
      },
      {
        title: "الأمان والدعم",
        rows: [
          {
            feature: "تسجيل الدخول الموحد (SAML)",
            tooltip: "سجّل الدخول عبر مزود الهوية الخاص بمؤسستك. متاح لخطة المؤسسات فقط.",
            values: { starter: false, pro: false, enterprise: true },
          },
          {
            feature: "اتفاقية مستوى الخدمة",
            tooltip: "ضمان تعاقدي لنسبة التشغيل مع تعويضات عند الإخلال به.",
            values: { starter: false, pro: false, enterprise: "٩٩٫٩٪" },
          },
          {
            feature: "الدعم",
            values: {
              starter: "المجتمع",
              pro: "بريد إلكتروني بأولوية",
              enterprise: "مدير حساب مخصص",
            },
          },
        ],
      },
    ],
  },
}
