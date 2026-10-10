import { type HowItWorksDictionary } from "@/registry/bases/base/blocks/how-it-works-01/components/how-it-works-01"

export const dictionary: Record<"en" | "ar", HowItWorksDictionary> = {
  en: {
    eyebrow: "How it works",
    title: "Up and running in three simple steps",
    subtitle:
      "No lengthy onboarding and no consultants. Find what you need, set it up, and start seeing results the same day.",
    stepLabel: "Step",
    steps: [
      {
        icon: "search",
        title: "Discover",
        description:
          "Browse the catalog and compare options side by side to find the right fit for your team.",
      },
      {
        icon: "file",
        title: "Configure",
        description:
          "Fill in a short form, tailor the settings to your workflow, and invite your colleagues.",
      },
      {
        icon: "check",
        title: "Launch",
        description:
          "Go live with one click. We handle the rest and keep you updated every step of the way.",
      },
    ],
  },
  ar: {
    eyebrow: "كيف يعمل",
    title: "ابدأ العمل في ثلاث خطوات بسيطة",
    subtitle:
      "لا إعداد مطوّل ولا حاجة إلى مستشارين. اعثر على ما تحتاجه، وجهّزه، وابدأ في رؤية النتائج في اليوم نفسه.",
    stepLabel: "الخطوة",
    steps: [
      {
        icon: "search",
        title: "استكشف",
        description:
          "تصفّح الكتالوج وقارن بين الخيارات جنبًا إلى جنب لتجد الأنسب لفريقك.",
      },
      {
        icon: "file",
        title: "خصّص",
        description:
          "املأ نموذجًا قصيرًا، واضبط الإعدادات بما يناسب سير عملك، وادعُ زملاءك.",
      },
      {
        icon: "check",
        title: "انطلق",
        description:
          "ابدأ بنقرة واحدة، ونتولّى نحن الباقي ونُطلعك على كل خطوة أولًا بأول.",
      },
    ],
  },
}
