"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import type { getDictionary } from "@/components/local/dictionaries"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { day: "Mon", average: 400, today: 240 },
  { day: "Tue", average: 300, today: 139 },
  { day: "Wed", average: 200, today: 980 },
  { day: "Thu", average: 278, today: 390 },
  { day: "Fri", average: 189, today: 480 },
  { day: "Sat", average: 239, today: 380 },
  { day: "Sun", average: 349, today: 430 },
]

const chartConfig = {
  today: {
    label: "Today",
    color: "var(--chart-1)",
  },
  average: {
    label: "Average",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface CardsMetricProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export function CardsMetric({ dictionary }: CardsMetricProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {dictionary?.cards?.metric?.title || "Exercise Minutes"}
        </CardTitle>
        <CardDescription>
          {dictionary?.cards?.metric?.description || "Your exercise minutes are ahead of where you normally are."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Line
              dataKey="today"
              type="monotone"
              stroke="var(--color-today)"
              strokeWidth={2}
              dot={{ fill: "var(--color-today)" }}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="average"
              type="monotone"
              stroke="var(--color-average)"
              strokeWidth={2}
              strokeOpacity={0.5}
              dot={{ fill: "var(--color-average)", opacity: 0.5 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
