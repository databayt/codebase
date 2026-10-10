import { type FeaturesDictionary } from "@/registry/bases/base/blocks/features-02/components/features-02"

const images = {
  analytics:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  reports:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
}

export const dictionary: Record<"en" | "ar", FeaturesDictionary> = {
  en: {
    eyebrow: "How it works",
    heading: "Built for the way modern teams work",
    description:
      "From the first plan to the final report, Acme keeps every step connected and visible.",
    blocks: [
      {
        tag: "Insights",
        title: "See the whole picture in real time",
        description:
          "Live dashboards pull data from every project so you can spot trends early and make decisions with confidence.",
        bullets: [
          "Customizable widgets and filters",
          "Automatic daily and weekly summaries",
          "Export to PDF or spreadsheet in one click",
        ],
        link: { label: "Explore analytics", href: "#" },
        image: {
          src: images.analytics,
          alt: "Analytics dashboard with charts on a laptop screen",
        },
      },
      {
        tag: "Collaboration",
        title: "Keep everyone on the same page",
        description:
          "Shared workspaces, threaded comments and mentions bring conversations next to the work they are about.",
        bullets: [
          "Workspaces for every team and project",
          "Comments, mentions and file sharing",
          "Granular, role-based permissions",
        ],
        link: { label: "See collaboration tools", href: "#" },
        image: {
          src: images.team,
          alt: "A team collaborating around a table with laptops",
        },
      },
      {
        tag: "Reporting",
        title: "Reports that write themselves",
        description:
          "Schedule recurring reports, choose who receives them and let Acme deliver the numbers on time, every time.",
        bullets: [
          "Scheduled delivery by email",
          "Templates for common report types",
          "Secure links with expiry dates",
        ],
        link: { label: "Learn about reporting", href: "#" },
        image: {
          src: images.reports,
          alt: "Laptop showing a report with growth charts",
        },
      },
    ],
  },
  ar: {
    eyebrow: "كيف يعمل",
    heading: "صُمّم بما يناسب طريقة عمل الفرق الحديثة",
    description:
      "من الخطة الأولى حتى التقرير النهائي، تُبقي Acme كل خطوة مترابطة وواضحة للجميع.",
    blocks: [
      {
        tag: "الرؤى",
        title: "شاهد الصورة كاملة لحظة بلحظة",
        description:
          "تجمع لوحات المعلومات الحيّة البيانات من جميع المشاريع، لتكتشف المؤشرات مبكرًا وتتخذ قراراتك بثقة.",
        bullets: [
          "عناصر ومرشّحات قابلة للتخصيص",
          "ملخصات يومية وأسبوعية تلقائية",
          "تصدير إلى PDF أو جدول بيانات بنقرة واحدة",
        ],
        link: { label: "استكشف التحليلات", href: "#" },
        image: {
          src: images.analytics,
          alt: "لوحة تحليلات تعرض رسومًا بيانية على شاشة حاسوب محمول",
        },
      },
      {
        tag: "التعاون",
        title: "اجعل الجميع على اطلاع دائم",
        description:
          "مساحات عمل مشتركة وتعليقات متسلسلة وإشارات تضع النقاش بجوار العمل الذي يخصّه.",
        bullets: [
          "مساحات عمل لكل فريق ومشروع",
          "تعليقات وإشارات ومشاركة للملفات",
          "صلاحيات دقيقة حسب الأدوار",
        ],
        link: { label: "تعرّف على أدوات التعاون", href: "#" },
        image: {
          src: images.team,
          alt: "فريق يتعاون حول طاولة عليها أجهزة حاسوب محمولة",
        },
      },
      {
        tag: "التقارير",
        title: "تقارير تُعدّ نفسها بنفسها",
        description:
          "جدوِل التقارير الدورية، وحدّد من يتسلّمها، ودع Acme توصل الأرقام في موعدها في كل مرة.",
        bullets: [
          "إرسال مجدول عبر البريد الإلكتروني",
          "قوالب جاهزة لأنواع التقارير الشائعة",
          "روابط آمنة بتاريخ انتهاء صلاحية",
        ],
        link: { label: "اعرف المزيد عن التقارير", href: "#" },
        image: {
          src: images.reports,
          alt: "حاسوب محمول يعرض تقريرًا برسوم بيانية للنمو",
        },
      },
    ],
  },
}
