"use client"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { addDays } from "date-fns"
import * as React from "react"
import { type DateRange } from "react-day-picker"

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange | undefined
  onDateChange?: (date: DateRange | undefined) => void
}

export default function DateRangePicker({
  className,
  date: externalDate,
  onDateChange,
}: DateRangePickerProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -20),
    to: new Date(),
  })

  const date = externalDate !== undefined ? externalDate : internalDate
  const setDate = onDateChange || setInternalDate

  return (
    <div className={cn("grid gap-2", className)}>
      <Calendar
        autoFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        className="rounded-full border-0 scale-75 origin-top-left"
      />
    </div>
  )
}