import { type StatsDictionary } from "@/registry/bases/base/blocks/stats-01/components/stats-01"

const image =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2000&q=80"

export const dictionary: Record<"en" | "ar", StatsDictionary> = {
  en: {
    eyebrow: "Acme Studio",
    title: "A decade of work, in numbers",
    image: {
      src: image,
      alt: "Glass office towers seen from street level",
    },
    items: [
      { value: 120, suffix: "+", label: "Projects delivered" },
      { value: 70, label: "Specialists" },
      { value: 14, label: "Industry awards" },
      { value: 98, suffix: "%", label: "Client satisfaction" },
    ],
  },
  ar: {
    eyebrow: "استوديو أكمي",
    title: "عقدٌ من الإنجاز بالأرقام",
    image: {
      src: image,
      alt: "أبراج مكاتب زجاجية من مستوى الشارع",
    },
    items: [
      { value: 120, suffix: "+", label: "مشاريع منجزة" },
      { value: 70, label: "خبراء متخصصون" },
      { value: 14, label: "جوائز في القطاع" },
      { value: 98, suffix: "٪", label: "رضا العملاء" },
    ],
  },
}
