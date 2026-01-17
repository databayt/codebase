import { type Metadata } from "next"
import Image from "next/image"

import { CardsDemo } from "@/components/root/cards"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default function DashboardPage() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/images/dashboard-light.png"
          width={1280}
          height={843}
          alt="Dashboard"
          className="block dark:hidden"
          priority
        />
        <Image
          src="/images/dashboard-dark.png"
          width={1280}
          height={843}
          alt="Dashboard"
          className="hidden dark:block"
          priority
        />
      </div>
      <div className="hidden flex-1 flex-col p-8 md:flex">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Dashboard
            </h2>
            <p className="text-muted-foreground">
              Your application dashboard overview.
            </p>
          </div>
        </div>
        <CardsDemo />
      </div>
    </>
  )
}
