"use client"

import { InvoiceHistory, type InvoiceItem } from "@/components/billingsdk/invoice-history"

const demoInvoices: InvoiceItem[] = [
  {
    id: "INV-001",
    date: "Dec 1, 2024",
    amount: "$20.00",
    status: "paid",
    description: "Pro Plan - Monthly Subscription",
    invoiceUrl: "#"
  },
  {
    id: "INV-002",
    date: "Nov 1, 2024",
    amount: "$20.00",
    status: "paid",
    description: "Pro Plan - Monthly Subscription",
    invoiceUrl: "#"
  },
  {
    id: "INV-003",
    date: "Oct 1, 2024",
    amount: "$20.00",
    status: "paid",
    description: "Pro Plan - Monthly Subscription",
    invoiceUrl: "#"
  },
  {
    id: "INV-004",
    date: "Sep 1, 2024",
    amount: "$15.00",
    status: "refunded",
    description: "Starter Plan - Partial Refund",
    invoiceUrl: "#"
  },
  {
    id: "INV-005",
    date: "Aug 1, 2024",
    amount: "$10.00",
    status: "void",
    description: "Starter Plan - Cancelled",
    invoiceUrl: "#"
  }
]

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <InvoiceHistory
        className="max-w-4xl w-full"
        title="Invoice History"
        description="Your past invoices and payment receipts."
        invoices={demoInvoices}
        onDownload={(invoiceId) => console.log("Downloading invoice:", invoiceId)}
      />
    </div>
  )
}
