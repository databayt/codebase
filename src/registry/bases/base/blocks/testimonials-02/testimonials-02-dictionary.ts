import { type TestimonialsDictionary } from "@/registry/bases/base/blocks/testimonials-02/components/testimonials-02"

const avatar = (n: number) => `https://i.pravatar.cc/112?img=${n}`

export const dictionary: Record<"en" | "ar", TestimonialsDictionary> = {
  en: {
    watermark: "ACME",
    title: "Voices",
    subtitle: "What people say about us",
    description:
      "Real words from the customers, partners, and teammates who work with Acme every day.",
    scrollUp: "Scroll testimonials up",
    scrollDown: "Scroll testimonials down",
    categories: [
      { id: "customers", label: "Customers" },
      { id: "partners", label: "Partners" },
      { id: "team", label: "Team" },
    ],
    items: [
      {
        category: "customers",
        name: "Sara Haddad",
        role: "Founder",
        company: "Bloom Studio",
        quote:
          "Setup took ten minutes and support answered every question within the hour. It is the easiest decision we made this year.",
        reactions: ["🙌", "💯"],
        avatar: avatar(5),
      },
      {
        category: "customers",
        name: "Daniel Brooks",
        role: "Operations Lead",
        company: "Harbor Logistics",
        quote:
          "We replaced three separate tools with Acme. Our team finally works from one source of truth.",
        reactions: ["👏", "🚀"],
        avatar: avatar(8),
      },
      {
        category: "customers",
        name: "Leen Mansour",
        role: "Store Manager",
        company: "Cedar & Co.",
        quote:
          "Clear pricing, no surprises, and a product that keeps getting better every month. Highly recommended.",
        reactions: ["⭐", "❤️"],
        avatar: avatar(44),
      },
      {
        category: "customers",
        name: "Ethan Cole",
        role: "Product Designer",
        company: "Northwind",
        quote:
          "Everything feels considered. The details are right, and that makes our own customers trust us more.",
        reactions: ["✨"],
        avatar: avatar(13),
      },
      {
        category: "partners",
        name: "Maya Okafor",
        role: "Partnerships Director",
        company: "Globex",
        quote:
          "Acme is responsive, transparent, and genuinely invested in our success. Working together has been a pleasure from day one.",
        reactions: ["🤝", "💯"],
        avatar: avatar(16),
      },
      {
        category: "partners",
        name: "Omar Khalil",
        role: "Managing Partner",
        company: "Atlas Ventures",
        quote:
          "Their team shares our standards for quality. Our joint customers notice the difference immediately.",
        reactions: ["👏", "🚀"],
        avatar: avatar(12),
      },
      {
        category: "partners",
        name: "Hannah Lee",
        role: "Integration Lead",
        company: "Lumen Labs",
        quote:
          "Clean APIs, excellent documentation, and engineers who actually answer. Integrating was a breeze.",
        reactions: ["⚡"],
        avatar: avatar(25),
      },
      {
        category: "team",
        name: "Rania Aziz",
        role: "Support Engineer",
        company: "Acme",
        quote:
          "I love that we hear directly from customers every day. Their feedback shapes what we ship next.",
        reactions: ["❤️", "🙌"],
        avatar: avatar(20),
      },
      {
        category: "team",
        name: "Lucas Moreau",
        role: "Software Engineer",
        company: "Acme",
        quote:
          "Small team, big ownership. I can take an idea from a sketch to production in a week.",
        reactions: ["🚀"],
        avatar: avatar(59),
      },
      {
        category: "team",
        name: "Yara Saleh",
        role: "Customer Success",
        company: "Acme",
        quote:
          "Helping a customer hit their goals is the best part of my day, and the tools we build make it easy.",
        reactions: ["✨", "💯"],
        avatar: avatar(47),
      },
    ],
  },
  ar: {
    watermark: "أكمي",
    title: "أصوات",
    subtitle: "ماذا يقولون عنّا",
    description:
      "كلمات حقيقية من العملاء والشركاء وأعضاء الفريق الذين يعملون مع أكمي كل يوم.",
    scrollUp: "تمرير الآراء إلى الأعلى",
    scrollDown: "تمرير الآراء إلى الأسفل",
    categories: [
      { id: "customers", label: "العملاء" },
      { id: "partners", label: "الشركاء" },
      { id: "team", label: "الفريق" },
    ],
    items: [
      {
        category: "customers",
        name: "سارة حداد",
        role: "مؤسِّسة",
        company: "استوديو بلوم",
        quote:
          "استغرق الإعداد عشر دقائق، وأجاب فريق الدعم عن كل أسئلتنا خلال ساعة. إنه أسهل قرار اتخذناه هذا العام.",
        reactions: ["🙌", "💯"],
        avatar: avatar(5),
      },
      {
        category: "customers",
        name: "دانيال بروكس",
        role: "قائد العمليات",
        company: "هاربر للخدمات اللوجستية",
        quote:
          "استبدلنا ثلاث أدوات منفصلة بأكمي، وأصبح فريقنا أخيرًا يعمل من مصدر موحّد للمعلومات.",
        reactions: ["👏", "🚀"],
        avatar: avatar(8),
      },
      {
        category: "customers",
        name: "لين منصور",
        role: "مديرة المتجر",
        company: "سيدار وشركاه",
        quote:
          "أسعار واضحة بلا مفاجآت، ومنتج يتحسّن شهرًا بعد شهر. أنصح به بشدة.",
        reactions: ["⭐", "❤️"],
        avatar: avatar(44),
      },
      {
        category: "customers",
        name: "إيثان كول",
        role: "مصمم منتجات",
        company: "نورث ويند",
        quote:
          "كل شيء مدروس بعناية. التفاصيل في مكانها الصحيح، وهذا يعزّز ثقة عملائنا بنا.",
        reactions: ["✨"],
        avatar: avatar(13),
      },
      {
        category: "partners",
        name: "مايا أوكافور",
        role: "مديرة الشراكات",
        company: "جلوبكس",
        quote:
          "فريق أكمي سريع الاستجابة وشفّاف ومهتم فعلًا بنجاحنا. كان العمل معهم ممتعًا منذ اليوم الأول.",
        reactions: ["🤝", "💯"],
        avatar: avatar(16),
      },
      {
        category: "partners",
        name: "عمر خليل",
        role: "شريك إداري",
        company: "أطلس فنتشرز",
        quote:
          "يشاركنا فريقهم المعايير نفسها في الجودة، ويلمس عملاؤنا المشتركون الفرق فورًا.",
        reactions: ["👏", "🚀"],
        avatar: avatar(12),
      },
      {
        category: "partners",
        name: "هانا لي",
        role: "قائدة التكامل",
        company: "لومن لابز",
        quote:
          "واجهات برمجية نظيفة، وتوثيق ممتاز، ومهندسون يجيبون فعلًا. كان التكامل في غاية السهولة.",
        reactions: ["⚡"],
        avatar: avatar(25),
      },
      {
        category: "team",
        name: "رانيا عزيز",
        role: "مهندسة دعم",
        company: "أكمي",
        quote:
          "أحب أننا نسمع من العملاء مباشرة كل يوم؛ فملاحظاتهم هي ما يحدّد ما نطلقه لاحقًا.",
        reactions: ["❤️", "🙌"],
        avatar: avatar(20),
      },
      {
        category: "team",
        name: "لوكاس مورو",
        role: "مهندس برمجيات",
        company: "أكمي",
        quote:
          "فريق صغير ومسؤولية كبيرة. أستطيع أن أنقل فكرة من رسم أولي إلى الإنتاج خلال أسبوع.",
        reactions: ["🚀"],
        avatar: avatar(59),
      },
      {
        category: "team",
        name: "يارا صالح",
        role: "نجاح العملاء",
        company: "أكمي",
        quote:
          "مساعدة العميل على تحقيق أهدافه هي أجمل ما في يومي، والأدوات التي نبنيها تجعل ذلك سهلًا.",
        reactions: ["✨", "💯"],
        avatar: avatar(47),
      },
    ],
  },
}
