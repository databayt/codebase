import { type FeaturesDictionary } from "@/registry/bases/base/blocks/features-03/components/features-03"

export const dictionary: Record<"en" | "ar", FeaturesDictionary> = {
  en: {
    heading: "Included in every plan",
    description:
      "No add-ons, no surprises. Every Acme workspace comes with the essentials from day one.",
    items: [
      { text: "Unlimited projects and tasks" },
      { text: "Real-time collaboration" },
      { text: "Role-based permissions" },
      { text: "Single sign-on (SSO)" },
      { text: "Automated backups" },
      { text: "Audit log and activity history" },
      { text: "Mobile apps for iOS and Android" },
      { text: "Arabic and English interface" },
      { text: "Priority email support" },
    ],
  },
  ar: {
    heading: "متوفر في جميع الباقات",
    description:
      "بلا إضافات مدفوعة وبلا مفاجآت. تأتي كل مساحة عمل في Acme بالأساسيات منذ اليوم الأول.",
    items: [
      { text: "مشاريع ومهام غير محدودة" },
      { text: "تعاون لحظي" },
      { text: "صلاحيات حسب الأدوار" },
      { text: "تسجيل دخول موحّد (SSO)" },
      { text: "نسخ احتياطي تلقائي" },
      { text: "سجل تدقيق وتاريخ للنشاط" },
      { text: "تطبيقات للجوال على iOS وAndroid" },
      { text: "واجهة باللغتين العربية والإنجليزية" },
      { text: "دعم ذو أولوية عبر البريد الإلكتروني" },
    ],
  },
}
