import { CardsCalendar } from "@/components/atom/calendar"

// Cards read their copy from the site dictionary; the demo passes an empty one.
const dictionary = { locale: "en", cards: {} } as any

export default function CalendarDemo() {
  return (
    <>
      <CardsCalendar dictionary={dictionary} />
    </>
  )
}
