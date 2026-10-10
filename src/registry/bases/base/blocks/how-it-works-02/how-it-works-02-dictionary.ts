import { type HowItWorksDictionary } from "@/registry/bases/base/blocks/how-it-works-02/components/how-it-works-02"

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&q=70`

const images = {
  invoices: img("photo-1554224155-6726b3ff858f"),
  payments: img("photo-1556740738-b6a63e27c4df"),
  payroll: img("photo-1454165804606-c3d57bc86b40"),
  reports: img("photo-1460925895917-afdab827c52f"),
  approvals: img("photo-1556761175-5973dc0f32e7"),
  onboarding: img("photo-1522202176988-66273c2fd55f"),
  travel: img("photo-1488590528505-98d2b5aba04b"),
  subscriptions: img("photo-1563013544-824ae1b704d3"),
  support: img("photo-1531482615713-2afd69097998"),
  planning: img("photo-1552664730-d307ca884978"),
}

export const dictionary: Record<"en" | "ar", HowItWorksDictionary> = {
  en: {
    eyebrow: "How it works",
    title: "One place for everything your team pays for",
    items: [
      {
        title: "Invoices",
        description: "Send, track and reconcile invoices without a single spreadsheet.",
        image: images.invoices,
      },
      {
        title: "Payments",
        description: "Tap, click, done. Every payment lands in the right ledger.",
        image: images.payments,
      },
      {
        title: "Payroll",
        description: "Run payroll in minutes and let the payslips send themselves.",
        image: images.payroll,
      },
      {
        title: "Reports",
        description: "Live dashboards that answer the question before it is asked.",
        image: images.reports,
      },
      {
        title: "Approvals",
        description: "Route requests to the right person and approve from anywhere.",
        image: images.approvals,
      },
      {
        title: "Onboarding",
        description: "New hire on Monday? Accounts and cards are ready by Sunday.",
        image: images.onboarding,
      },
      {
        title: "Travel",
        description: "Book trips within policy and skip the expense report entirely.",
        image: images.travel,
      },
      {
        title: "Subscriptions",
        description: "See every recurring charge and cancel the ones nobody uses.",
        image: images.subscriptions,
      },
      {
        title: "Support",
        description: "Real people, real answers, usually in under five minutes.",
        image: images.support,
      },
      {
        title: "Planning",
        description: "Set budgets per team and get a nudge before anyone overspends.",
        image: images.planning,
      },
    ],
    stats: [
      { value: "$2B+", label: "Processed every year" },
      { value: "150k+", label: "Teams around the world" },
      { value: "4.8", label: "Average rating in app stores" },
    ],
  },
  ar: {
    eyebrow: "كيف يعمل",
    title: "مكان واحد لكل ما يدفعه فريقك",
    items: [
      {
        title: "الفواتير",
        description: "أرسل الفواتير وتابعها وطابقها دون جدول بيانات واحد.",
        image: images.invoices,
      },
      {
        title: "المدفوعات",
        description: "انقر وانتهى الأمر، فكل دفعة تصل إلى السجل الصحيح.",
        image: images.payments,
      },
      {
        title: "الرواتب",
        description: "أنجز مسير الرواتب في دقائق ودع القسائم تُرسَل تلقائيًا.",
        image: images.payroll,
      },
      {
        title: "التقارير",
        description: "لوحات بيانات مباشرة تجيب عن السؤال قبل أن يُطرح.",
        image: images.reports,
      },
      {
        title: "الموافقات",
        description: "وجّه الطلبات إلى الشخص المناسب ووافق عليها من أي مكان.",
        image: images.approvals,
      },
      {
        title: "تهيئة الموظفين",
        description: "موظف جديد يوم الاثنين؟ حساباته وبطاقته جاهزة يوم الأحد.",
        image: images.onboarding,
      },
      {
        title: "السفر",
        description: "احجز رحلاتك وفق السياسة واستغنِ عن تقارير المصروفات تمامًا.",
        image: images.travel,
      },
      {
        title: "الاشتراكات",
        description: "اطّلع على كل رسم متكرر وألغِ ما لا يستخدمه أحد.",
        image: images.subscriptions,
      },
      {
        title: "الدعم",
        description: "أشخاص حقيقيون وإجابات حقيقية، غالبًا في أقل من خمس دقائق.",
        image: images.support,
      },
      {
        title: "التخطيط",
        description: "حدّد ميزانية لكل فريق وتلقَّ تنبيهًا قبل أي تجاوز.",
        image: images.planning,
      },
    ],
    stats: [
      { value: "2 مليار+", label: "دولار من المعاملات سنويًا" },
      { value: "150 ألف+", label: "فريق حول العالم" },
      { value: "4.8", label: "متوسط التقييم في متاجر التطبيقات" },
    ],
  },
}
