import { CardsShare } from "@/components/atom/share"

// Cards read their copy from the site dictionary; the demo passes an empty one.
const dictionary = { locale: "en", cards: {} } as any

export default function ShareDemo() {
  return (
    <>
      <CardsShare dictionary={dictionary} />
    </>
  )
}
