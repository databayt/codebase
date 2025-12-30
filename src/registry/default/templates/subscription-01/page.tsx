"use client"

import { SubscriptionManagement } from "@/components/billingsdk/subscription-management"
import { type CurrentPlan, plans } from "@/lib/billingsdk-config"

export default function Page() {
  const currentPlan: CurrentPlan = {
    plan: plans[1],
    type: "monthly",
    price: "$20",
    nextBillingDate: "January 15, 2025",
    paymentMethod: "Visa ending in 4242",
    status: "active"
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SubscriptionManagement
        className="max-w-2xl w-full"
        currentPlan={currentPlan}
        updatePlan={{
          currentPlan: currentPlan.plan,
          plans: plans,
          onPlanChange: (planId) => console.log("Plan changed to:", planId),
          triggerText: "Update Plan"
        }}
        cancelSubscription={{
          title: "Cancel Subscription",
          description: "Are you sure you want to cancel your subscription?",
          leftPanelImageUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80",
          plan: currentPlan.plan,
          warningTitle: "You will lose access to Pro features",
          warningText: "If you cancel your subscription, you will be downgraded to the Starter plan at the end of your billing period.",
          onCancel: async (planId) => {
            console.log("Cancelling subscription:", planId)
            return new Promise((resolve) => setTimeout(resolve, 1000))
          },
          onKeepSubscription: async (planId) => console.log("Keeping subscription:", planId)
        }}
      />
    </div>
  )
}
