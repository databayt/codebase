import { type HeroDictionary } from "@/registry/bases/base/blocks/hero-08/components/hero-08"

const crop = (id: string) => ({
  landscape: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&h=1080&q=80`,
  portrait: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1080&h=1350&q=80`,
})

export const dictionary: Record<"en" | "ar", HeroDictionary> = {
  en: {
    labels: {
      carousel: "Featured stories",
      pagination: "Choose a slide",
      goToSlide: "Go to slide",
      play: "Play",
      pause: "Pause",
      previous: "Previous slide",
      next: "Next slide",
    },
    slides: [
      {
        id: "after-dark",
        title: "Own the night run.",
        body: "Lightweight layers built for the miles after sunset.",
        cta: { label: "Shop running", href: "#" },
        alt: "Three runners silhouetted against a low evening sun",
        image: crop("photo-1552674605-db6ffd4facb5"),
      },
      {
        id: "start-line",
        title: "Fast starts here.",
        body: "Spikes and racing flats engineered for the first step.",
        cta: { label: "Shop track", href: "#" },
        alt: "A sprinter crouched in the starting blocks on a red track",
        image: crop("photo-1461896836934-ffe607ba8211"),
      },
      {
        id: "every-step",
        title: "Every step counts.",
        body: "Everyday trainers with cushioning that keeps up with you.",
        cta: { label: "Explore trainers", href: "#" },
        alt: "A runner in orange trainers climbing stone steps",
        image: crop("photo-1476480862126-209bfaa8edc8"),
      },
    ],
  },
  ar: {
    labels: {
      carousel: "قصص مختارة",
      pagination: "اختر شريحة",
      goToSlide: "انتقل إلى الشريحة",
      play: "تشغيل",
      pause: "إيقاف مؤقت",
      previous: "الشريحة السابقة",
      next: "الشريحة التالية",
    },
    slides: [
      {
        id: "after-dark",
        title: "الليل مضمارك.",
        body: "طبقات خفيفة صُمّمت لأميالك بعد الغروب.",
        cta: { label: "تسوّق الجري", href: "#" },
        alt: "ثلاثة عدّائين تظهر ظلالهم أمام شمس المساء",
        image: crop("photo-1552674605-db6ffd4facb5"),
      },
      {
        id: "start-line",
        title: "السرعة تبدأ من هنا.",
        body: "أحذية سباق مصمّمة لتمنحك أقوى انطلاقة.",
        cta: { label: "تسوّق ألعاب القوى", href: "#" },
        alt: "عدّاء متأهّب على مكعبات الانطلاق في مضمار أحمر",
        image: crop("photo-1461896836934-ffe607ba8211"),
      },
      {
        id: "every-step",
        title: "كل خطوة تُحتسب.",
        body: "أحذية يومية بتوسيد يواكب إيقاعك.",
        cta: { label: "اكتشف الأحذية", href: "#" },
        alt: "عدّاء بحذاء برتقالي يصعد درجات حجرية",
        image: crop("photo-1476480862126-209bfaa8edc8"),
      },
    ],
  },
}
