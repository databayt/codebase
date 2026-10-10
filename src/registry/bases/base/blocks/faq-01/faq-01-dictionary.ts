import { type FaqDictionary } from "@/registry/bases/base/blocks/faq-01/components/faq-01"

export const dictionary: Record<"en" | "ar", FaqDictionary> = {
  en: {
    eyebrow: "FAQ",
    title: "Questions, answered",
    subtitle: "Everything you need to know before getting started.",
    items: [
      {
        question: "How do I get started?",
        answer:
          "Create an account, invite your team and import your existing data. Most teams are up and running in under an hour.",
      },
      {
        question: "Is there a free trial?",
        answer:
          "Yes. Every paid plan comes with a 14-day free trial with full access to all features. No credit card is required.",
      },
      {
        question: "Which payment methods do you accept?",
        answer: "We accept the most common payment methods, including:",
        list: ["Credit and debit cards", "Bank transfer", "Invoicing for annual plans"],
      },
      {
        question: "Can I change or cancel my plan later?",
        answer:
          "You can upgrade, downgrade or cancel at any time from your account settings. Changes take effect at the start of the next billing cycle.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Your data is encrypted in transit and at rest, backed up daily, and you can export everything at any time.",
      },
    ],
    contact: {
      text: "Still have questions?",
      linkLabel: "Get in touch",
      href: "#",
    },
  },
  ar: {
    eyebrow: "الأسئلة الشائعة",
    title: "إجابات لأسئلتك",
    subtitle: "كل ما تحتاج معرفته قبل أن تبدأ.",
    items: [
      {
        question: "كيف أبدأ؟",
        answer:
          "أنشئ حسابًا، وادعُ فريقك، واستورد بياناتك الحالية. تبدأ معظم الفرق العمل في أقل من ساعة.",
      },
      {
        question: "هل تتوفر فترة تجريبية مجانية؟",
        answer:
          "نعم، تأتي كل خطة مدفوعة مع فترة تجريبية مجانية لمدة ١٤ يومًا مع وصول كامل إلى جميع الميزات، ودون الحاجة إلى بطاقة ائتمان.",
      },
      {
        question: "ما طرق الدفع المتاحة؟",
        answer: "نقبل أكثر طرق الدفع شيوعًا، ومنها:",
        list: ["البطاقات الائتمانية وبطاقات الخصم", "التحويل البنكي", "الفواتير للخطط السنوية"],
      },
      {
        question: "هل يمكنني تغيير خطتي أو إلغاؤها لاحقًا؟",
        answer:
          "يمكنك الترقية أو تخفيض الخطة أو إلغاؤها في أي وقت من إعدادات حسابك، ويسري التغيير مع بداية دورة الفوترة التالية.",
      },
      {
        question: "هل بياناتي آمنة؟",
        answer:
          "تُشفَّر بياناتك أثناء النقل والتخزين، ونحتفظ بنسخة احتياطية منها يوميًا، ويمكنك تصديرها كاملة في أي وقت.",
      },
    ],
    contact: {
      text: "هل لديك أسئلة أخرى؟",
      linkLabel: "تواصل معنا",
      href: "#",
    },
  },
}
