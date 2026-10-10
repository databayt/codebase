import { type TestimonialsDictionary } from "@/registry/bases/base/blocks/testimonials-03/components/testimonials-03"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=1000&fit=crop`

const images = {
  emma: photo("1494790108377-be9c29b29330"),
  robert: photo("1472099645785-5658abf4ff4e"),
  noor: photo("1438761681033-6461ffad8d80"),
  adam: photo("1500648767791-00dcc994a43e"),
  grace: photo("1573497019940-1c28c88b4f3e"),
}

export const dictionary: Record<"en" | "ar", TestimonialsDictionary> = {
  en: {
    eyebrow: "Customer stories",
    title: "Stories from our community",
    previous: "Previous story",
    next: "Next story",
    ratingLabel: "Rated {rating} out of 5",
    stories: [
      {
        name: "Emma Lawson",
        role: "Small business owner",
        rating: 5,
        date: "April 18, 2025",
        dateTime: "2025-04-18",
        quote:
          "Very easy to use from day one. Everything connects seamlessly, and paying invoices now takes seconds instead of an afternoon.",
        image: images.emma,
      },
      {
        name: "Robert Kim",
        role: "Freelance consultant",
        rating: 5,
        date: "April 17, 2025",
        dateTime: "2025-04-17",
        quote:
          "A brilliant app for anyone juggling a busy schedule. The support team is quick, friendly, and genuinely helpful.",
        image: images.robert,
      },
      {
        name: "Noor Al-Amin",
        role: "Marketing manager",
        rating: 5,
        date: "May 20, 2025",
        dateTime: "2025-05-20",
        quote:
          "I love how simple it is to navigate. Flexible plans, no hidden fees, and it works with the payment methods we already use.",
        image: images.noor,
      },
      {
        name: "Adam Novak",
        role: "Agency founder",
        rating: 4,
        date: "May 19, 2025",
        dateTime: "2025-05-19",
        quote:
          "Acme made our monthly admin painless. It is easy to understand, fast, and saves our team hours every week.",
        image: images.adam,
      },
      {
        name: "Grace Mensah",
        role: "Operations lead",
        rating: 5,
        date: "May 17, 2025",
        dateTime: "2025-05-17",
        quote:
          "Whether it is a recurring payment or a one-off expense, I can handle it from my phone in a few taps. Exactly what we needed.",
        image: images.grace,
      },
    ],
  },
  ar: {
    eyebrow: "قصص العملاء",
    title: "قصص من مجتمعنا",
    previous: "القصة السابقة",
    next: "القصة التالية",
    ratingLabel: "التقييم {rating} من 5",
    stories: [
      {
        name: "إيما لوسون",
        role: "صاحبة مشروع صغير",
        rating: 5,
        date: "18 أبريل 2025",
        dateTime: "2025-04-18",
        quote:
          "سهل الاستخدام منذ اليوم الأول. كل شيء متكامل بسلاسة، وسداد الفواتير بات يستغرق ثوانيَ بدلًا من ساعات.",
        image: images.emma,
      },
      {
        name: "روبرت كيم",
        role: "مستشار مستقل",
        rating: 5,
        date: "17 أبريل 2025",
        dateTime: "2025-04-17",
        quote:
          "تطبيق رائع لكل من يوازن بين مهام كثيرة. فريق الدعم سريع وودود ومفيد بحق.",
        image: images.robert,
      },
      {
        name: "نور الأمين",
        role: "مديرة تسويق",
        rating: 5,
        date: "20 مايو 2025",
        dateTime: "2025-05-20",
        quote:
          "أحب سهولة التنقل فيه. خطط مرنة بلا رسوم خفية، ويعمل مع وسائل الدفع التي نستخدمها أصلًا.",
        image: images.noor,
      },
      {
        name: "آدم نوفاك",
        role: "مؤسس وكالة",
        rating: 4,
        date: "19 مايو 2025",
        dateTime: "2025-05-19",
        quote:
          "جعلت أكمي أعمالنا الإدارية الشهرية سهلة تمامًا. واضح وسريع، ويوفّر على فريقنا ساعات كل أسبوع.",
        image: images.adam,
      },
      {
        name: "غريس مينسا",
        role: "قائدة العمليات",
        rating: 5,
        date: "17 مايو 2025",
        dateTime: "2025-05-17",
        quote:
          "سواء كانت دفعة متكررة أو مصروفًا لمرة واحدة، أنجزها من هاتفي بلمسات قليلة. هذا بالضبط ما كنا نحتاجه.",
        image: images.grace,
      },
    ],
  },
}
