import { type StatsDictionary } from "@/registry/bases/base/blocks/stats-02/components/stats-02"

export const dictionary: Record<"en" | "ar", StatsDictionary> = {
  en: {
    title: "Built for teams that move fast",
    description:
      "Thousands of teams rely on Acme every day to ship faster, stay aligned, and keep their customers happy.",
    items: [
      { value: "10,000+", label: "Teams onboarded" },
      { value: "99.9%", label: "Uptime over the last 12 months" },
      { value: "4.9/5", label: "Average customer rating" },
    ],
  },
  ar: {
    title: "صُمّم للفرق التي تتحرك بسرعة",
    description:
      "تعتمد آلاف الفرق على أكمي يوميًا لتسليم أعمالها أسرع، والبقاء على تنسيق دائم، وإسعاد عملائها.",
    items: [
      { value: "10,000+", label: "فرق انضمت إلى المنصة" },
      { value: "99.9%", label: "نسبة التشغيل خلال آخر 12 شهرًا" },
      { value: "4.9/5", label: "متوسط تقييم العملاء" },
    ],
  },
}
