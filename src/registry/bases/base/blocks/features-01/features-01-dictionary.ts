import { type FeaturesDictionary } from "@/registry/bases/base/blocks/features-01/components/features-01"

export const dictionary: Record<"en" | "ar", FeaturesDictionary> = {
  en: {
    heading: "Everything your team needs, in one place",
    description:
      "Acme brings planning, communication and reporting together so your team spends less time switching tools and more time doing great work.",
    cards: [
      {
        icon: "automation",
        title: "Workflow automation",
        description:
          "Turn repetitive steps into rules that run on their own, from approvals to reminders.",
      },
      {
        icon: "analytics",
        title: "Real-time analytics",
        description:
          "Live dashboards show progress at a glance, with reports ready to share in one click.",
      },
      {
        icon: "teams",
        title: "Team workspaces",
        description:
          "Give every team its own space with the right people, files and permissions.",
      },
      {
        icon: "scheduling",
        title: "Smart scheduling",
        description:
          "Find the best time for everyone automatically and keep calendars in sync.",
      },
      {
        icon: "security",
        title: "Enterprise-grade security",
        description:
          "Single sign-on, role-based access and encryption at rest keep your data safe.",
      },
      {
        icon: "integrations",
        title: "Powerful integrations",
        description:
          "Connect the tools you already use and keep information flowing between them.",
      },
    ],
  },
  ar: {
    heading: "كل ما يحتاجه فريقك في مكان واحد",
    description:
      "تجمع Acme التخطيط والتواصل والتقارير في منصة واحدة، ليقضي فريقك وقتًا أقل في التنقل بين الأدوات ووقتًا أطول في إنجاز عمل متميز.",
    cards: [
      {
        icon: "automation",
        title: "أتمتة سير العمل",
        description:
          "حوّل الخطوات المتكررة إلى قواعد تعمل تلقائيًا، من الموافقات إلى التذكيرات.",
      },
      {
        icon: "analytics",
        title: "تحليلات فورية",
        description:
          "لوحات معلومات حيّة تعرض سير العمل بنظرة واحدة، وتقارير جاهزة للمشاركة بنقرة.",
      },
      {
        icon: "teams",
        title: "مساحات عمل للفرق",
        description:
          "امنح كل فريق مساحته الخاصة بالأشخاص والملفات والصلاحيات المناسبة.",
      },
      {
        icon: "scheduling",
        title: "جدولة ذكية",
        description:
          "اعثر تلقائيًا على الوقت الأنسب للجميع وأبقِ التقاويم متزامنة.",
      },
      {
        icon: "security",
        title: "أمان بمستوى المؤسسات",
        description:
          "تسجيل دخول موحّد وصلاحيات حسب الأدوار وتشفير للبيانات المخزّنة لحماية معلوماتك.",
      },
      {
        icon: "integrations",
        title: "تكاملات قوية",
        description:
          "اربط الأدوات التي تستخدمها بالفعل واجعل المعلومات تتدفق بينها بسلاسة.",
      },
    ],
  },
}
