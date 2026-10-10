import { CardsMetric as CardsMetricSingle } from "@/components/atom/metric"

// Cards read their copy from the site dictionary; the demo passes an empty one.
const dictionary = { locale: "en", cards: {} } as any

export default function MetricDemo() {
  return (
    <>
      <CardsMetricSingle dictionary={dictionary} />
    </>
  )
}
