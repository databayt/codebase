import { CardsActivityGoal } from "@/components/atom/activity-goal"

// Cards read their copy from the site dictionary; the demo passes an empty one.
const dictionary = { locale: "en", cards: {} } as any

export default function ActivityGoalDemo() {
  return (
    <>
      <CardsActivityGoal dictionary={dictionary} />
    </>
  )
}
