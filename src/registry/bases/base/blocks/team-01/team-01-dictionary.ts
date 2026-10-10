import { type TeamDictionary } from "@/registry/bases/base/blocks/team-01/components/team-01"

const portrait = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&crop=faces&w=600&h=750&q=70`

const images = {
  sara: portrait("photo-1573496359142-b8d87734a5a2"),
  omar: portrait("photo-1507003211169-0a1dd7228f2d"),
  lina: portrait("photo-1580489944761-15a19d654956"),
  karim: portrait("photo-1506794778202-cad84cf45f1d"),
  maya: portrait("photo-1544005313-94ddf0286df2"),
  yusuf: portrait("photo-1500648767791-00dcc994a43e"),
  nora: portrait("photo-1438761681033-6461ffad8d80"),
  adam: portrait("photo-1472099645785-5658abf4ff4e"),
}

export const dictionary: Record<"en" | "ar", TeamDictionary> = {
  en: {
    eyebrow: "Our team",
    title: "The people behind the product",
    subtitle:
      "A small, senior team of builders, designers and operators who care about doing the work properly.",
    networks: {
      x: "X",
      linkedin: "LinkedIn",
      github: "GitHub",
      email: "Email",
      website: "Website",
    },
    members: [
      {
        name: "Sara Haddad",
        role: "Co-founder & CEO",
        bio: "Spent a decade scaling operations teams before setting out to fix the tools they relied on.",
        image: images.sara,
        links: [
          { network: "linkedin", href: "#" },
          { network: "x", href: "#" },
        ],
      },
      {
        name: "Omar Nasser",
        role: "Co-founder & CTO",
        bio: "Leads engineering. Happiest when a hard problem turns into a boring, reliable system.",
        image: images.omar,
        links: [
          { network: "github", href: "#" },
          { network: "linkedin", href: "#" },
        ],
      },
      {
        name: "Lina Farouk",
        role: "Head of Design",
        bio: "Shapes every screen and believes the best interface is the one you barely notice.",
        image: images.lina,
        links: [
          { network: "website", href: "#" },
          { network: "x", href: "#" },
        ],
      },
      {
        name: "Karim Saleh",
        role: "Head of Product",
        bio: "Talks to customers every week and turns what he hears into a clear roadmap.",
        image: images.karim,
        links: [
          { network: "linkedin", href: "#" },
          { network: "email", href: "mailto:hello@example.com" },
        ],
      },
      {
        name: "Maya Idris",
        role: "Engineering Lead",
        bio: "Owns the platform's reliability and keeps the release train on schedule.",
        image: images.maya,
        links: [
          { network: "github", href: "#" },
          { network: "x", href: "#" },
        ],
      },
      {
        name: "Yusuf Rahman",
        role: "Customer Success",
        bio: "Makes sure every new customer is set up and seeing value in their first week.",
        image: images.yusuf,
        links: [
          { network: "linkedin", href: "#" },
          { network: "email", href: "mailto:hello@example.com" },
        ],
      },
      {
        name: "Nora Khalil",
        role: "Marketing Lead",
        bio: "Tells the product's story clearly, without the buzzwords.",
        image: images.nora,
        links: [
          { network: "x", href: "#" },
          { network: "linkedin", href: "#" },
        ],
      },
      {
        name: "Adam Mansour",
        role: "Finance & Operations",
        bio: "Keeps the numbers honest and the company running smoothly behind the scenes.",
        image: images.adam,
        links: [{ network: "linkedin", href: "#" }],
      },
    ],
    hiring: {
      title: "Want to work with us?",
      description:
        "We're always looking for thoughtful people who love their craft. See our open roles.",
      cta: { label: "View open positions", href: "#" },
    },
  },
  ar: {
    eyebrow: "فريقنا",
    title: "الأشخاص الذين يقفون وراء المنتج",
    subtitle:
      "فريق صغير من البنّائين والمصممين وخبراء التشغيل ذوي الخبرة، يحرصون على إتقان العمل.",
    networks: {
      x: "إكس",
      linkedin: "لينكدإن",
      github: "غيت هب",
      email: "البريد الإلكتروني",
      website: "الموقع الإلكتروني",
    },
    members: [
      {
        name: "سارة حداد",
        role: "شريكة مؤسسة والرئيسة التنفيذية",
        bio: "أمضت عقدًا في توسيع فرق التشغيل قبل أن تقرر إصلاح الأدوات التي تعتمد عليها.",
        image: images.sara,
        links: [
          { network: "linkedin", href: "#" },
          { network: "x", href: "#" },
        ],
      },
      {
        name: "عمر ناصر",
        role: "شريك مؤسس والرئيس التقني",
        bio: "يقود فريق الهندسة، ويسعده أن تتحول المشكلة الصعبة إلى نظام موثوق لا يلفت الانتباه.",
        image: images.omar,
        links: [
          { network: "github", href: "#" },
          { network: "linkedin", href: "#" },
        ],
      },
      {
        name: "لينا فاروق",
        role: "رئيسة قسم التصميم",
        bio: "تصوغ كل شاشة، وتؤمن بأن أفضل واجهة هي التي بالكاد تلاحظ وجودها.",
        image: images.lina,
        links: [
          { network: "website", href: "#" },
          { network: "x", href: "#" },
        ],
      },
      {
        name: "كريم صالح",
        role: "رئيس قسم المنتج",
        bio: "يتحدث إلى العملاء كل أسبوع، ويحوّل ما يسمعه إلى خارطة طريق واضحة.",
        image: images.karim,
        links: [
          { network: "linkedin", href: "#" },
          { network: "email", href: "mailto:hello@example.com" },
        ],
      },
      {
        name: "مايا إدريس",
        role: "قائدة فريق الهندسة",
        bio: "مسؤولة عن موثوقية المنصة، وتحرص على أن تصدر التحديثات في مواعيدها.",
        image: images.maya,
        links: [
          { network: "github", href: "#" },
          { network: "x", href: "#" },
        ],
      },
      {
        name: "يوسف رحمن",
        role: "نجاح العملاء",
        bio: "يتأكد من أن كل عميل جديد قد أكمل إعداده ويجني الفائدة منذ أسبوعه الأول.",
        image: images.yusuf,
        links: [
          { network: "linkedin", href: "#" },
          { network: "email", href: "mailto:hello@example.com" },
        ],
      },
      {
        name: "نورا خليل",
        role: "قائدة فريق التسويق",
        bio: "تروي قصة المنتج بوضوح، بعيدًا عن المصطلحات الرنّانة.",
        image: images.nora,
        links: [
          { network: "x", href: "#" },
          { network: "linkedin", href: "#" },
        ],
      },
      {
        name: "آدم منصور",
        role: "المالية والعمليات",
        bio: "يحافظ على دقة الأرقام ويضمن سير أعمال الشركة بسلاسة خلف الكواليس.",
        image: images.adam,
        links: [{ network: "linkedin", href: "#" }],
      },
    ],
    hiring: {
      title: "هل ترغب في العمل معنا؟",
      description:
        "نبحث دائمًا عن أشخاص متميزين يحبون ما يتقنونه. اطّلع على الوظائف المتاحة.",
      cta: { label: "عرض الوظائف المتاحة", href: "#" },
    },
  },
}
