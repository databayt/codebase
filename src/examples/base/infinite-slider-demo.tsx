import { InfiniteSlider } from "@/components/atom/infinite-slider"

export default function InfiniteSliderDemo() {
  return (
    <>
      <InfiniteSlider>
        <div className="flex gap-4">
          <div className="h-20 w-32 rounded bg-muted flex items-center justify-center">
            1
          </div>
          <div className="h-20 w-32 rounded bg-muted flex items-center justify-center">
            2
          </div>
          <div className="h-20 w-32 rounded bg-muted flex items-center justify-center">
            3
          </div>
          <div className="h-20 w-32 rounded bg-muted flex items-center justify-center">
            4
          </div>
        </div>
      </InfiniteSlider>
    </>
  )
}
