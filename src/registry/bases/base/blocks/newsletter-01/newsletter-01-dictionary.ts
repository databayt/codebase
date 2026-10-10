import { type NewsletterDictionary } from "@/registry/bases/base/blocks/newsletter-01/components/newsletter-01"

export const dictionary: Record<"en" | "ar", NewsletterDictionary> = {
  en: {
    title: "Newsletter",
    description:
      "Product updates, practical guides and the occasional behind-the-scenes story. Once a month, never spam.",
    emailLabel: "Email address",
    emailPlaceholder: "Email address",
    subscribe: "Subscribe",
    note: "Unsubscribe at any time with one click.",
    success: "You're subscribed. Check your inbox to confirm.",
  },
  ar: {
    title: "النشرة البريدية",
    description:
      "تحديثات المنتج وأدلة عملية وقصص من وراء الكواليس بين الحين والآخر. مرة واحدة في الشهر، بلا رسائل مزعجة.",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "البريد الإلكتروني",
    subscribe: "اشترك",
    note: "يمكنك إلغاء الاشتراك في أي وقت بنقرة واحدة.",
    success: "تم اشتراكك. تفقّد بريدك الوارد لتأكيد الاشتراك.",
  },
}
