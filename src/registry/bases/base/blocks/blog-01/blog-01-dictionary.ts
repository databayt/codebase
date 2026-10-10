import { type BlogDictionary } from "@/registry/bases/base/blocks/blog-01/components/blog-01"

const img = (id: string, size = 320) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${size}&h=${size}&q=70`

const covers = {
  apps: img("photo-1498050108023-c5249f4df085"),
  design: img("photo-1499951360447-b19be8fe80f5"),
  data: img("photo-1460925895917-afdab827c52f"),
  teams: img("photo-1521737604893-d14cc237f11d"),
  writing: img("photo-1499750310107-5fef28a66643"),
  remote: img("photo-1515378791036-0648a3ef77b2"),
}

const avatars = {
  sara: img("photo-1573496359142-b8d87734a5a2", 96),
  omar: img("photo-1507003211169-0a1dd7228f2d", 96),
  lina: img("photo-1580489944761-15a19d654956", 96),
}

export const dictionary: Record<"en" | "ar", BlogDictionary> = {
  en: {
    title: "Blog",
    subtitle:
      "Stories, ideas and lessons from building modern products, written by the people who build them.",
    staffPicks: "Staff picks",
    topicsTitle: "Recommended topics",
    topics: ["Engineering", "Design", "Product", "Data", "Culture", "Remote work"],
    about: {
      name: "Acme Journal",
      initials: "AJ",
      role: "Engineering & Design",
      description:
        "Notes from the team on how we design, build and ship software, published every other week.",
    },
    posts: [
      {
        href: "#",
        title: "Building modern web apps with server components",
        description:
          "How rendering on the server by default reshapes the way we fetch data, handle forms and ship smaller bundles.",
        author: { name: "Omar Nasser", avatar: avatars.omar },
        date: "2026-05-12",
        readingTime: "8 min read",
        cover: covers.apps,
        tag: "Engineering",
      },
      {
        href: "#",
        title: "Designing for two directions at once",
        description:
          "Practical lessons from shipping an interface that reads equally well from left to right and right to left.",
        author: { name: "Lina Farouk", avatar: avatars.lina },
        date: "2026-04-28",
        readingTime: "6 min read",
        cover: covers.design,
        tag: "Design",
      },
      {
        href: "#",
        title: "The dashboard nobody asked for",
        description:
          "We replaced forty charts with three numbers. Here is how we chose them and what happened next.",
        author: { name: "Sara Haddad", avatar: avatars.sara },
        date: "2026-04-09",
        readingTime: "5 min read",
        cover: covers.data,
        tag: "Data",
      },
      {
        href: "#",
        title: "How we run a weekly planning meeting in 25 minutes",
        description:
          "A simple agenda, one shared document and a rule about laptops kept our planning short and useful.",
        author: { name: "Sara Haddad", avatar: avatars.sara },
        date: "2026-03-21",
        readingTime: "4 min read",
        cover: covers.teams,
        tag: "Culture",
      },
      {
        href: "#",
        title: "Writing docs that people actually read",
        description:
          "Start with the task, not the feature. A short guide to documentation that answers the real question.",
        author: { name: "Lina Farouk", avatar: avatars.lina },
        date: "2026-03-02",
        readingTime: "7 min read",
        cover: covers.writing,
        tag: "Product",
      },
      {
        href: "#",
        title: "Remote, but not alone",
        description:
          "The small rituals that keep a distributed team connected across five time zones.",
        author: { name: "Omar Nasser", avatar: avatars.omar },
        date: "2026-02-14",
        readingTime: "5 min read",
        cover: covers.remote,
        tag: "Remote work",
      },
    ],
  },
  ar: {
    title: "المدونة",
    subtitle:
      "قصص وأفكار ودروس من رحلة بناء المنتجات الحديثة، يكتبها من يبنونها بأنفسهم.",
    staffPicks: "اختيارات الفريق",
    topicsTitle: "مواضيع مقترحة",
    topics: ["الهندسة", "التصميم", "المنتج", "البيانات", "ثقافة العمل", "العمل عن بُعد"],
    about: {
      name: "مجلة أكمي",
      initials: "أك",
      role: "الهندسة والتصميم",
      description:
        "ملاحظات من الفريق حول كيفية تصميم البرمجيات وبنائها وإطلاقها، تُنشر كل أسبوعين.",
    },
    posts: [
      {
        href: "#",
        title: "بناء تطبيقات ويب حديثة باستخدام مكوّنات الخادم",
        description:
          "كيف يغيّر العرض على الخادم افتراضيًا طريقتنا في جلب البيانات ومعالجة النماذج وتقليص حجم الحزم.",
        author: { name: "عمر ناصر", avatar: avatars.omar },
        date: "2026-05-12",
        readingTime: "8 دقائق قراءة",
        cover: covers.apps,
        tag: "الهندسة",
      },
      {
        href: "#",
        title: "التصميم لاتجاهين في آن واحد",
        description:
          "دروس عملية من إطلاق واجهة تُقرأ بالسلاسة نفسها من اليسار إلى اليمين ومن اليمين إلى اليسار.",
        author: { name: "لينا فاروق", avatar: avatars.lina },
        date: "2026-04-28",
        readingTime: "6 دقائق قراءة",
        cover: covers.design,
        tag: "التصميم",
      },
      {
        href: "#",
        title: "لوحة البيانات التي لم يطلبها أحد",
        description:
          "استبدلنا أربعين مخططًا بثلاثة أرقام فقط. إليك كيف اخترناها وماذا حدث بعد ذلك.",
        author: { name: "سارة حداد", avatar: avatars.sara },
        date: "2026-04-09",
        readingTime: "5 دقائق قراءة",
        cover: covers.data,
        tag: "البيانات",
      },
      {
        href: "#",
        title: "كيف نعقد اجتماع التخطيط الأسبوعي في 25 دقيقة",
        description:
          "جدول أعمال بسيط، ومستند مشترك واحد، وقاعدة بشأن الحواسيب المحمولة جعلت تخطيطنا قصيرًا ومفيدًا.",
        author: { name: "سارة حداد", avatar: avatars.sara },
        date: "2026-03-21",
        readingTime: "4 دقائق قراءة",
        cover: covers.teams,
        tag: "ثقافة العمل",
      },
      {
        href: "#",
        title: "كتابة توثيق يقرؤه الناس فعلًا",
        description:
          "ابدأ بالمهمة لا بالميزة. دليل قصير لتوثيق يجيب عن السؤال الحقيقي.",
        author: { name: "لينا فاروق", avatar: avatars.lina },
        date: "2026-03-02",
        readingTime: "7 دقائق قراءة",
        cover: covers.writing,
        tag: "المنتج",
      },
      {
        href: "#",
        title: "عن بُعد، لكن لسنا وحدنا",
        description:
          "طقوس صغيرة تُبقي فريقًا موزّعًا على خمس مناطق زمنية متّصلًا ومتقاربًا.",
        author: { name: "عمر ناصر", avatar: avatars.omar },
        date: "2026-02-14",
        readingTime: "5 دقائق قراءة",
        cover: covers.remote,
        tag: "العمل عن بُعد",
      },
    ],
  },
}
