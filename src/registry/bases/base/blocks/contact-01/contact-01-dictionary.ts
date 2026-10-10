import { type ContactDictionary } from "@/registry/bases/base/blocks/contact-01/components/contact-01"

export const dictionary: Record<"en" | "ar", ContactDictionary> = {
  en: {
    eyebrow: "Contact",
    title: "We'd love to hear from you",
    lead: "Questions about pricing, a partnership idea, or just want to say hello? Pick whichever channel suits you and we'll get back to you within one business day.",
    channels: {
      title: "Ways to reach us",
      items: [
        {
          icon: "chat",
          title: "Live chat",
          body: "The fastest way to reach us. Real people, usually within minutes.",
          action: { label: "Start a chat", href: "#" },
          highlight: true,
        },
        {
          icon: "phone",
          title: "Phone",
          body: "Sunday to Thursday, 9 am to 6 pm.",
          value: { label: "+1 (555) 010-2030", href: "tel:+15550102030", ltr: true },
        },
        {
          icon: "email",
          title: "Email",
          body: "For anything that needs more detail.",
          value: { label: "hello@example.com", href: "mailto:hello@example.com", ltr: true },
        },
        {
          icon: "location",
          title: "Visit us",
          body: "Drop by the studio. Coffee is on us.",
          address: ["100 Market Street, Suite 300", "San Francisco, CA 94105"],
          action: { label: "Open in maps", href: "#" },
        },
        {
          icon: "hours",
          title: "Opening hours",
          body: "Sunday to Thursday, 9 am to 6 pm. Closed on public holidays.",
        },
      ],
    },
    message: {
      title: "Send us a message",
      lead: "Tell us a little about what you need and the right person on our team will reply.",
      privacy:
        "We only use your details to answer your message. We never share them with anyone else.",
      form: {
        name: { label: "Full name", placeholder: "Jane Doe" },
        email: { label: "Email", placeholder: "jane@example.com" },
        phone: { label: "Phone (optional)", placeholder: "+1 555 010 2030" },
        message: {
          label: "Message",
          placeholder: "How can we help?",
        },
        submit: "Send message",
        success: {
          title: "Thanks, your message is on its way.",
          description: "We'll get back to you within one business day.",
          again: "Send another message",
        },
      },
    },
  },
  ar: {
    eyebrow: "تواصل معنا",
    title: "يسعدنا أن نسمع منك",
    lead: "لديك سؤال عن الأسعار، أو فكرة شراكة، أو تريد إلقاء التحية فحسب؟ اختر القناة التي تناسبك، وسنرد عليك خلال يوم عمل واحد.",
    channels: {
      title: "طرق التواصل",
      items: [
        {
          icon: "chat",
          title: "المحادثة المباشرة",
          body: "أسرع طريقة للوصول إلينا. فريق حقيقي يرد عادةً خلال دقائق.",
          action: { label: "ابدأ محادثة", href: "#" },
          highlight: true,
        },
        {
          icon: "phone",
          title: "الهاتف",
          body: "من الأحد إلى الخميس، من 9 صباحًا حتى 6 مساءً.",
          value: { label: "+1 (555) 010-2030", href: "tel:+15550102030", ltr: true },
        },
        {
          icon: "email",
          title: "البريد الإلكتروني",
          body: "لكل ما يحتاج إلى مزيد من التفاصيل.",
          value: { label: "hello@example.com", href: "mailto:hello@example.com", ltr: true },
        },
        {
          icon: "location",
          title: "زورونا",
          body: "مرّ بمكتبنا، والقهوة على حسابنا.",
          address: ["100 شارع ماركت، الجناح 300", "سان فرانسيسكو، كاليفورنيا 94105"],
          action: { label: "افتح في الخرائط", href: "#" },
        },
        {
          icon: "hours",
          title: "ساعات العمل",
          body: "من الأحد إلى الخميس، من 9 صباحًا حتى 6 مساءً. مغلق في العطلات الرسمية.",
        },
      ],
    },
    message: {
      title: "أرسل لنا رسالة",
      lead: "أخبرنا قليلًا عمّا تحتاجه، وسيرد عليك الشخص المناسب من فريقنا.",
      privacy:
        "نستخدم بياناتك للرد على رسالتك فقط، ولا نشاركها مع أي جهة أخرى.",
      form: {
        name: { label: "الاسم الكامل", placeholder: "سارة أحمد" },
        email: { label: "البريد الإلكتروني", placeholder: "sara@example.com" },
        phone: { label: "رقم الهاتف (اختياري)", placeholder: "+1 555 010 2030" },
        message: {
          label: "الرسالة",
          placeholder: "كيف يمكننا مساعدتك؟",
        },
        submit: "إرسال الرسالة",
        success: {
          title: "شكرًا لك، رسالتك في طريقها إلينا.",
          description: "سنرد عليك خلال يوم عمل واحد.",
          again: "إرسال رسالة أخرى",
        },
      },
    },
  },
}
