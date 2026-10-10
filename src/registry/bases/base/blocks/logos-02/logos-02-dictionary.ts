import { type LogosDictionary } from "@/registry/bases/base/blocks/logos-02/components/logos-02"

// Neutral placeholder marks, inlined as SVG data URIs (drawn in near-black;
// the component inverts them in dark mode).
const mark = (body: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#18181b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
  )}`

const logos = {
  northwind: mark(
    '<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h15a3 3 0 1 1-3 3"/><path d="M3 16h7"/>'
  ),
  globex: mark(
    '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>'
  ),
  lumen: mark(
    '<circle cx="12" cy="12" r="4" fill="#18181b"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
  ),
  atlas: mark('<path d="M12 3 2 21h20L12 3Z" fill="#18181b"/>'),
}

const images = {
  layla:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=1000&fit=crop",
  omar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
  mei: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
  daniel:
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop",
}

export const dictionary: Record<"en" | "ar", LogosDictionary> = {
  en: {
    eyebrow: "Partners",
    title: "Hear from the teams we build with",
    previous: "Previous partner",
    next: "Next partner",
    showPartner: "Show {company}",
    partners: [
      {
        company: "Northwind",
        logo: logos.northwind,
        name: "Layla Haddad",
        role: "Chief Operating Officer",
        quote:
          "From the first demo, the Acme team delivered exactly what they promised. Our rollout across every region finished ahead of schedule, and the feedback from our customers has been overwhelmingly positive.\n\nWhat started as a single workflow has grown into the platform our whole operation runs on.",
        image: images.layla,
        tag: "Partner since 2021",
      },
      {
        company: "Globex",
        logo: logos.globex,
        name: "Omar Farouk",
        role: "Chief Information Officer",
        quote:
          "We run a lean finance team. Reconciliation used to take days of manual entry; now it is a single click. Acme spent time on the ground with our people to understand how we actually work, and it shows in the product.",
        image: images.omar,
        tag: "Partner since 2022",
      },
      {
        company: "Lumen Labs",
        logo: logos.lumen,
        name: "Mei Chen",
        role: "Head of Product",
        quote:
          "Acme feels like an extension of our own team. They listen, they move quickly, and every release makes our customers' lives a little easier. It is rare to find a partner that understands both the vision and the execution.",
        image: images.mei,
        tag: "Partner since 2020",
      },
      {
        company: "Atlas Group",
        logo: logos.atlas,
        name: "Daniel Reyes",
        role: "VP of Engineering",
        quote:
          "Integration took an afternoon, not a quarter. Our engineers stopped maintaining glue code and went back to building features our customers had been asking for.",
        image: images.daniel,
        tag: "Partner since 2023",
      },
    ],
  },
  ar: {
    eyebrow: "شركاؤنا",
    title: "استمع إلى الفرق التي نبني معها",
    previous: "الشريك السابق",
    next: "الشريك التالي",
    showPartner: "عرض {company}",
    partners: [
      {
        company: "Northwind",
        logo: logos.northwind,
        name: "ليلى حداد",
        role: "الرئيسة التنفيذية للعمليات",
        quote:
          "منذ العرض التجريبي الأول، قدّم فريق أكمي ما وعد به تمامًا. أنجزنا الإطلاق في جميع المناطق قبل الموعد المحدد، وجاءت آراء عملائنا إيجابية للغاية.\n\nما بدأ بسير عمل واحد أصبح اليوم المنصة التي تقوم عليها عملياتنا بأكملها.",
        image: images.layla,
        tag: "شريك منذ 2021",
      },
      {
        company: "Globex",
        logo: logos.globex,
        name: "عمر فاروق",
        role: "الرئيس التنفيذي للمعلومات",
        quote:
          "فريقنا المالي صغير، وكانت المطابقة تستغرق أيامًا من الإدخال اليدوي؛ أما الآن فتتم بنقرة واحدة. أمضى فريق أكمي وقتًا ميدانيًا مع موظفينا ليفهم طريقة عملنا الفعلية، وهذا ينعكس بوضوح في المنتج.",
        image: images.omar,
        tag: "شريك منذ 2022",
      },
      {
        company: "Lumen Labs",
        logo: logos.lumen,
        name: "مي تشين",
        role: "رئيسة قسم المنتج",
        quote:
          "نشعر أن أكمي امتداد لفريقنا. يصغون جيدًا ويتحركون بسرعة، وكل إصدار جديد يجعل حياة عملائنا أسهل. من النادر أن تجد شريكًا يفهم الرؤية والتنفيذ معًا.",
        image: images.mei,
        tag: "شريك منذ 2020",
      },
      {
        company: "Atlas Group",
        logo: logos.atlas,
        name: "دانيال رييس",
        role: "نائب رئيس الهندسة",
        quote:
          "أنجزنا التكامل في بضع ساعات لا في أشهر. توقف مهندسونا عن صيانة الشيفرات الوسيطة وعادوا إلى بناء الميزات التي طالما طلبها عملاؤنا.",
        image: images.daniel,
        tag: "شريك منذ 2023",
      },
    ],
  },
}
