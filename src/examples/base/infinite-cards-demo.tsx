import { InfiniteMovingCards as InfiniteCards } from "@/components/atom/infinite-cards"

export default function InfiniteCardsDemo() {
  return (
    <>
      <InfiniteCards
        items={[
          { quote: "Amazing!", name: "John", title: "CEO" },
          { quote: "Great product.", name: "Jane", title: "CTO" },
        ]}
      />
    </>
  )
}
