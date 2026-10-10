import { type FaqDictionary } from "@/registry/bases/base/blocks/faq-02/components/faq-02"

export const dictionary: Record<"en" | "ar", FaqDictionary> = {
  en: {
    title: "Frequently\nasked questions",
    subtitle: "Can't find what you're looking for? Our team is happy to help.",
    items: [
      {
        question: "What does the product include?",
        answer:
          "A complete workspace for your team: projects, tasks, documents, reporting and integrations with the tools you already use.",
      },
      {
        question: "How much does it cost?",
        answer:
          "Pricing is transparent and based on the plan you choose. There is a free tier, and paid plans unlock advanced features.",
      },
      {
        question: "How long does it take to get started?",
        answer:
          "A basic setup takes minutes. A full rollout, including data migration and training, usually takes one to two weeks.",
      },
      {
        question: "Do you offer support?",
        answer:
          "Yes. Every plan includes documentation and email support, and paid plans add onboarding sessions and priority response times.",
      },
      {
        question: "Still have questions?",
        answer: "Browse the documentation or reach out to us directly.",
        links: [
          { label: "Read the documentation", href: "#" },
          { label: "Talk to our team", href: "#" },
        ],
      },
    ],
  },
  ar: {
    title: "الأسئلة\nالشائعة",
    subtitle: "لم تجد ما تبحث عنه؟ يسعد فريقنا بمساعدتك.",
    items: [
      {
        question: "ماذا يتضمن المنتج؟",
        answer:
          "مساحة عمل متكاملة لفريقك: المشاريع والمهام والمستندات والتقارير، مع تكاملات مع الأدوات التي تستخدمها بالفعل.",
      },
      {
        question: "كم تبلغ التكلفة؟",
        answer:
          "أسعارنا واضحة وتعتمد على الخطة التي تختارها. تتوفر باقة مجانية، وتتيح الخطط المدفوعة ميزات متقدمة.",
      },
      {
        question: "كم يستغرق البدء؟",
        answer:
          "يستغرق الإعداد الأساسي دقائق معدودة، أما التشغيل الكامل بما فيه نقل البيانات والتدريب فيستغرق عادةً أسبوعًا إلى أسبوعين.",
      },
      {
        question: "هل تقدمون الدعم؟",
        answer:
          "نعم، تشمل كل خطة التوثيق والدعم عبر البريد الإلكتروني، وتضيف الخطط المدفوعة جلسات تهيئة وأولوية في الاستجابة.",
      },
      {
        question: "هل لديك أسئلة أخرى؟",
        answer: "تصفّح التوثيق أو تواصل معنا مباشرة.",
        links: [
          { label: "اقرأ التوثيق", href: "#" },
          { label: "تحدّث مع فريقنا", href: "#" },
        ],
      },
    ],
  },
}
