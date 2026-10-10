import { type HeroDictionary } from "@/registry/bases/base/blocks/hero-06/components/hero-06"

export const dictionary: Record<"en" | "ar", HeroDictionary> = {
  en: {
    kicker: "Acme Workspace",
    title: "A workspace that makes launching simpler, and the path to growth clearer",
    words: [
      { text: "A workspace" },
      { text: "that makes" },
      { text: "launching", break: true },
      { text: "simpler," },
      { text: "and the path" },
      { text: "to growth" },
    ],
    mark: "clearer",
    cta: { label: "Book a tour", href: "#" },
  },
  ar: {
    kicker: "مساحات أكمي للعمل",
    title: "مساحة تجعل إطلاق مشروعك أسهل، وطريق النمو أوضح",
    words: [
      { text: "مساحة" },
      { text: "تجعل" },
      { text: "إطلاق مشروعك", break: true },
      { text: "أسهل،" },
      { text: "وطريق" },
    ],
    mark: "النمو أوضح",
    cta: { label: "احجز جولة", href: "#" },
  },
}
