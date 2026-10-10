import { CardsStats } from "@/components/atom/stats"

// Cards read their copy from the site dictionary; the demo passes an empty one.
const dictionary = { locale: "en", cards: {} } as any

export default function StatsDemo() {
  return (
    <>
      <CardsStats dictionary={dictionary} />
    </>
  )
}
