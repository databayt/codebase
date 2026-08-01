"use client"

import { UsageTable, type UsageItem } from "@/components/billingsdk/usage-table"

const demoUsageHistory: UsageItem[] = [
  {
    model: "Claude 3.5 Sonnet",
    inputWithCache: 125000,
    inputWithoutCache: 45000,
    cacheRead: 80000,
    output: 32000,
    totalTokens: 282000,
    apiCost: 4.23,
    costToYou: 3.38
  },
  {
    model: "Claude 3 Opus",
    inputWithCache: 50000,
    inputWithoutCache: 25000,
    cacheRead: 25000,
    output: 15000,
    totalTokens: 115000,
    apiCost: 8.62,
    costToYou: 6.90
  },
  {
    model: "Claude 3 Haiku",
    inputWithCache: 500000,
    inputWithoutCache: 150000,
    cacheRead: 350000,
    output: 100000,
    totalTokens: 1100000,
    apiCost: 0.55,
    costToYou: 0.44
  },
  {
    model: "GPT-4 Turbo",
    inputWithCache: 75000,
    inputWithoutCache: 30000,
    cacheRead: 45000,
    output: 20000,
    totalTokens: 170000,
    apiCost: 2.55,
    costToYou: 2.04
  }
]

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <UsageTable
        className="max-w-5xl w-full"
        title="Usage Summary"
        description="Token usage breakdown by model for the current billing period."
        usageHistory={demoUsageHistory}
        showTotal={true}
      />
    </div>
  )
}
