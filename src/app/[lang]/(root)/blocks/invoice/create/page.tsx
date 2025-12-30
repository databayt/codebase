"use client";

import { useState, useTransition, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceForm } from "@/components/root/block/invoice/invoice-form";
import { createInvoice } from "@/components/root/block/invoice/actions";
import type { InvoiceFormSchema } from "@/components/root/block/invoice/validation";
import type { Locale } from "@/components/local/config";

interface CreateInvoicePageProps {
  params: Promise<{ lang: Locale }>;
}

export default function CreateInvoicePage({ params }: CreateInvoicePageProps) {
  const { lang } = use(params);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: InvoiceFormSchema) => {
    setError(null);
    startTransition(async () => {
      const result = await createInvoice({
        invoiceNumber: data.invoiceNumber,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        currency: data.currency,
        from: data.from,
        to: data.to,
        items: data.items,
        taxRate: data.taxRate,
        discountRate: data.discountRate,
        shippingAmount: data.shippingAmount,
        bankName: data.payment?.bankName,
        accountName: data.payment?.accountName,
        accountNumber: data.payment?.accountNumber,
        iban: data.payment?.iban,
        notes: data.notes,
        terms: data.terms,
      });

      if (result.success) {
        router.push(`/${lang}/blocks/invoice`);
      } else {
        setError(result.error || "Failed to create invoice");
      }
    });
  };

  const handlePreview = (data: InvoiceFormSchema) => {
    // For now, just log preview data
    console.log("Preview:", data);
  };

  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/${lang}/blocks/invoice`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
          <p className="mt-1 text-muted-foreground">
            Fill in the details to create a new invoice
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceForm
            onSubmit={handleSubmit}
            onPreview={handlePreview}
            isLoading={isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
