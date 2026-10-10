import { CardHoverEffect } from "@/components/atom/card-hover-effect"

export default function CardHoverEffectDemo() {
  return (
    <>
      <CardHoverEffect
        items={[
          { title: "Card 1", description: "Description", link: "#" },
          { title: "Card 2", description: "Description", link: "#" },
        ]}
      />
    </>
  )
}
