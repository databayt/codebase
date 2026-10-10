import { type FeaturesDictionary } from "@/registry/bases/base/blocks/features-04/components/features-04"

export const dictionary: Record<"en" | "ar", FeaturesDictionary> = {
  en: {
    eyebrow: "Acme One",
    heading: "Designed to do more. Built to last.",
    description:
      "Every detail is engineered to work together, so the device simply gets out of your way.",
    features: [
      {
        icon: "chip",
        title: "Blazing performance",
        description:
          "A next-generation processor handles demanding apps and games without breaking a sweat.",
      },
      {
        icon: "battery",
        title: "All-day battery",
        description:
          "Go from morning to night on a single charge, with fast charging when you need a boost.",
      },
      {
        icon: "camera",
        title: "Pro-level camera",
        description:
          "Capture sharper detail and richer color in any light, from sunrise to late-night city streets.",
      },
      {
        icon: "privacy",
        title: "Privacy built in",
        description:
          "Your data stays on your device whenever possible, and you decide what you share.",
      },
      {
        icon: "water",
        title: "Water resistant",
        description:
          "Rated to withstand splashes, rain and accidental drops in the pool.",
      },
      {
        icon: "environment",
        title: "Better for the planet",
        description:
          "Made with recycled materials and shipped in plastic-free packaging.",
      },
    ],
  },
  ar: {
    eyebrow: "Acme One",
    heading: "صُمّم ليمنحك المزيد. وصُنع ليدوم.",
    description:
      "كل تفصيل فيه مُتقن ليعمل بانسجام تام، فيتوارى الجهاز ويترك لك التجربة.",
    features: [
      {
        icon: "chip",
        title: "أداء فائق السرعة",
        description:
          "معالج من الجيل الجديد يشغّل التطبيقات والألعاب الأكثر تطلبًا بكل سلاسة.",
      },
      {
        icon: "battery",
        title: "بطارية تدوم طوال اليوم",
        description:
          "من الصباح حتى المساء بشحنة واحدة، مع شحن سريع حين تحتاج إلى دفعة إضافية.",
      },
      {
        icon: "camera",
        title: "كاميرا بمستوى احترافي",
        description:
          "التقط تفاصيل أوضح وألوانًا أغنى في أي إضاءة، من شروق الشمس حتى شوارع المدينة ليلًا.",
      },
      {
        icon: "privacy",
        title: "خصوصية مدمجة",
        description:
          "تبقى بياناتك على جهازك كلما أمكن، وأنت من يقرر ما تشاركه.",
      },
      {
        icon: "water",
        title: "مقاوم للماء",
        description:
          "مصمّم ليتحمّل الرذاذ والمطر والسقوط غير المقصود في المسبح.",
      },
      {
        icon: "environment",
        title: "أفضل لكوكبنا",
        description:
          "مصنوع من مواد معاد تدويرها، ويُشحن في عبوات خالية من البلاستيك.",
      },
    ],
  },
}
