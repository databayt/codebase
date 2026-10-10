import { InfiniteMovingCards } from "@/components/atom/simple-marquee"

export default function SimpleMarqueeDemo() {
  return (
    <>
      <InfiniteMovingCards
        items={[
          { quote: "Item 1", name: "Name", title: "Title" },
          { quote: "Item 2", name: "Name", title: "Title" },
        ]}
      />
    </>
  )
}
