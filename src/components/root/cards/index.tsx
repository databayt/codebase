// Re-export from atom for backward compatibility
import { CardsActivityGoal } from "@/components/atom/activity-goal"
import { CardsCalendar } from "@/components/atom/calendar"
import { CardsMetric } from "@/components/atom/metric"
import { CardsReportIssue } from "@/components/atom/report-issue"
import { CardsShare } from "@/components/atom/share"
import { CardsStats } from "@/components/atom/stats"
import type { getDictionary } from "@/components/local/dictionaries"

interface CardsDemoProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export function CardsDemo({ dictionary }: CardsDemoProps) {
  return (
    <div className="mt-10 md:grids-col-2 grid md:gap-4 lg:grid-cols-10 xl:grid-cols-11 xl:gap-4 rtl:space-x-reverse">
      <div className="space-y-4 lg:col-span-4 xl:col-span-6 xl:space-y-4">
        <CardsStats dictionary={dictionary} />
        <div className="grid gap-1 sm:grid-cols-[260px_1fr] md:hidden">
          <CardsCalendar dictionary={dictionary} />
          <div className="pt-3 sm:pl-2 sm:pt-0 xl:pl-4">
            <CardsActivityGoal dictionary={dictionary} />
          </div>
          <div className="pt-3 sm:col-span-2 xl:pt-4">
            <CardsMetric dictionary={dictionary} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="space-y-4 xl:space-y-4">
            <CardsReportIssue dictionary={dictionary} />
          </div>
          <div className="space-y-4 xl:space-y-4">
            <CardsShare dictionary={dictionary} />
          </div>
        </div>
      </div>
      <div className="space-y-4 lg:col-span-6 xl:col-span-5 xl:space-y-4">
        <div className="hidden gap-1 sm:grid-cols-[260px_1fr] md:grid">
          <CardsCalendar dictionary={dictionary} />
          <div className="pt-3 sm:pl-2 sm:pt-0 xl:pl-3">
            <CardsActivityGoal dictionary={dictionary} />
          </div>
          <div className="pt-3 sm:col-span-2 xl:pt-3">
            <CardsMetric dictionary={dictionary} />
          </div>
        </div>
      </div>
    </div>
  )
}
