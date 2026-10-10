import { StickyScroll } from "@/components/atom/sticky-scroll"

export default function StickyScrollDemo() {
  return (
    <>
      <StickyScroll
        content={[
          { title: "Section 1", description: "Description" },
          { title: "Section 2", description: "Description" },
        ]}
      />
    </>
  )
}
