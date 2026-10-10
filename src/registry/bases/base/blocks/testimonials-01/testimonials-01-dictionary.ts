import { type TestimonialsDictionary } from "@/registry/bases/base/blocks/testimonials-01/components/testimonials-01"

const avatar = (n: number) => `https://i.pravatar.cc/96?img=${n}`

export const dictionary: Record<"en" | "ar", TestimonialsDictionary> = {
  en: {
    title: "Loved by teams everywhere",
    description:
      "Organizations of every size use Acme to simplify their operations and spend more time on the work that matters.",
    items: [
      {
        quote:
          "We cut our admin work by 40%. The team finally spends its time on customers instead of spreadsheets.",
        name: "Amira Saleh",
        role: "Operations Director",
        avatar: avatar(47),
      },
      {
        quote:
          "Approvals, reporting, and team communication all live in one place now. Nothing slips through the cracks.",
        name: "Karim Nasser",
        role: "Regional Manager",
        avatar: avatar(12),
      },
      {
        quote:
          "Onboarding and scheduling are fully automated. Our efficiency improved dramatically within the first month.",
        name: "Sofia Martins",
        role: "Head of People",
        avatar: avatar(45),
      },
      {
        quote:
          "It transformed how we manage projects. Our leads can focus on strategy rather than chasing status updates.",
        name: "James Whitaker",
        role: "Program Lead",
        avatar: avatar(59),
      },
      {
        quote:
          "Keeping clients in the loop used to be a chore. Now updates go out automatically, and they notice.",
        name: "Nadia Rahman",
        role: "Client Success Lead",
        avatar: avatar(32),
      },
      {
        quote:
          "Tracking, reporting, and audit trails we can trust. It has become essential to how we work.",
        name: "Yusuf Adeyemi",
        role: "Finance Manager",
        avatar: avatar(68),
      },
    ],
  },
  ar: {
    title: "تحظى بثقة الفرق في كل مكان",
    description:
      "تستخدم المؤسسات بمختلف أحجامها أكمي لتبسيط عملياتها وتخصيص وقت أكبر للعمل الأهم.",
    items: [
      {
        quote:
          "خفّضنا الأعمال الإدارية بنسبة 40%. أصبح فريقنا أخيرًا يكرّس وقته للعملاء بدلًا من جداول البيانات.",
        name: "أميرة صالح",
        role: "مديرة العمليات",
        avatar: avatar(47),
      },
      {
        quote:
          "الموافقات والتقارير والتواصل بين أعضاء الفريق باتت كلها في مكان واحد، فلا يفوتنا شيء.",
        name: "كريم ناصر",
        role: "مدير إقليمي",
        avatar: avatar(12),
      },
      {
        quote:
          "أصبح التعيين وجدولة المواعيد مؤتمتين بالكامل، وتحسّنت كفاءتنا تحسنًا كبيرًا منذ الشهر الأول.",
        name: "صوفيا مارتنز",
        role: "رئيسة الموارد البشرية",
        avatar: avatar(45),
      },
      {
        quote:
          "غيّر طريقة إدارتنا للمشاريع جذريًا؛ صار قادة الفرق يركّزون على الاستراتيجية بدلًا من ملاحقة تحديثات الحالة.",
        name: "جيمس ويتاكر",
        role: "قائد البرامج",
        avatar: avatar(59),
      },
      {
        quote:
          "كان إطلاع العملاء على المستجدات مهمة مرهقة، أما اليوم فتصلهم التحديثات تلقائيًا ويلاحظون الفرق.",
        name: "نادية رحمن",
        role: "مسؤولة نجاح العملاء",
        avatar: avatar(32),
      },
      {
        quote:
          "متابعة وتقارير وسجلات تدقيق يمكننا الوثوق بها. أصبح جزءًا لا غنى عنه في طريقة عملنا.",
        name: "يوسف أديمي",
        role: "مدير مالي",
        avatar: avatar(68),
      },
    ],
  },
}
