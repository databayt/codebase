"use client"

import { Bar, BarChart, Line, LineChart } from "recharts"
import { DollarSign, Users } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { getDictionary } from "@/components/local/dictionaries"

const revenueData = [
  { month: "Jan", revenue: 10400 },
  { month: "Feb", revenue: 14405 },
  { month: "Mar", revenue: 9400 },
  { month: "Apr", revenue: 8200 },
  { month: "May", revenue: 7000 },
  { month: "Jun", revenue: 9600 },
  { month: "Jul", revenue: 11244 },
  { month: "Aug", revenue: 26475 },
]

const subscriptionData = [
  { month: "Jan", subscription: 240 },
  { month: "Feb", subscription: 300 },
  { month: "Mar", subscription: 200 },
  { month: "Apr", subscription: 278 },
  { month: "May", subscription: 189 },
  { month: "Jun", subscription: 239 },
  { month: "Jul", subscription: 278 },
  { month: "Aug", subscription: 189 },
]

const revenueConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const subscriptionConfig = {
  subscription: {
    label: "Subscriptions",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface CardsStatsProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export function CardsStats({ dictionary }: CardsStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            {dictionary?.cards?.stats?.totalRevenue || "Total Revenue"}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {dictionary?.cards?.stats?.revenueAmount || "$15,231.89"}
          </div>
          <p className="text-xs text-muted-foreground">
            {dictionary?.cards?.stats?.revenueGrowth || "+20.1% from last month"}
          </p>
          <ChartContainer config={revenueConfig} className="mt-4 h-[80px] w-full">
            <LineChart
              accessibilityLayer
              data={revenueData}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="revenue"
                stroke="var(--color-revenue)"
                dot={false}
                activeDot={{ r: 6 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel hideIndicator />}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            {dictionary?.cards?.stats?.subscriptions || "Subscriptions"}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {dictionary?.cards?.stats?.subscriptionCount || "+2350"}
          </div>
          <p className="text-xs text-muted-foreground">
            {dictionary?.cards?.stats?.subscriptionGrowth || "+180.1% from last month"}
          </p>
          <ChartContainer config={subscriptionConfig} className="mt-4 h-[80px] w-full">
            <BarChart accessibilityLayer data={subscriptionData}>
              <Bar
                dataKey="subscription"
                fill="var(--color-subscription)"
                radius={4}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel hideIndicator />}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
