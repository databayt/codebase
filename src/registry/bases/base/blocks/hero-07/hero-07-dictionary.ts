import { type HeroDictionary } from "@/registry/bases/base/blocks/hero-07/components/hero-07"

const image =
  "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=2400&q=80"

export const dictionary: Record<"en" | "ar", HeroDictionary> = {
  en: {
    badge: "Global freight & logistics",
    title: {
      desktop: ["Freight that", "moves with you"],
      mobile: ["Freight", "that moves", "with you"],
    },
    subtitle:
      "Track every shipment in real time, from the warehouse floor to your customer's door.",
    media: { image, alt: "Aerial view of a busy container port" },
    search: {
      action: "#",
      name: "q",
      label: "Tracking number",
      placeholder: "Enter a tracking number",
      button: "Track",
    },
  },
  ar: {
    badge: "الشحن والخدمات اللوجستية حول العالم",
    title: {
      desktop: ["شحنٌ يتحرّك", "بإيقاع أعمالك"],
      mobile: ["شحنٌ", "يتحرّك بإيقاع", "أعمالك"],
    },
    subtitle: "تابِع كل شحنة لحظة بلحظة، من أرض المستودع حتى باب عميلك.",
    media: { image, alt: "منظر جوي لميناء حاويات مزدحم" },
    search: {
      action: "#",
      name: "q",
      label: "رقم التتبّع",
      placeholder: "أدخل رقم التتبّع",
      button: "تتبّع",
    },
  },
}
