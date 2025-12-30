"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceForm } from "@/components/root/block/invoice/invoice-form";
import { updateInvoice, type InvoiceWithItems } from "@/components/root/block/invoice/actions";
import type { InvoiceFormSchema } from "@/components/root/block/invoice/validation";
import type { Locale } from "@/components/local/config";

interface EditInvoiceClientProps {
  lang: Locale;
  invoice: InvoiceWithItems;
}

export function EditInvoiceClient({ lang, invoice }: EditInvoiceClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Transform invoice to form data
  const defaultValues: InvoiceFormSchema = {
    invoiceNumber: invoice.invoiceNumber,
    issueDate: new Date(invoice.issueDate),
    dueDate: new Date(invoice.dueDate),
    currency: invoice.currency,
    from: {
      name: invoice.fromName,
      email: invoice.fromEmail || "",
      phone: invoice.fromPhone || "",
      address: invoice.fromAddress || "",
      city: invoice.fromCity || "",
      country: invoice.fromCountry || "",
    },
    to: {
      name: invoice.toName,
      email: invoice.toEmail || "",
      phone: invoice.toPhone || "",
      address: invoice.toAddress || "",
      city: invoice.toCity || "",
      country: invoice.toCountry || "",
    },
    items: invoice.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
    })),
    taxRate: invoice.taxRate,
    discountRate: invoice.discountRate,
    shippingAmount: invoice.shippingAmount,
    payment: {
      bankName: invoice.bankName || "",
      accountName: invoice.accountName || "",
      accountNumber: invoice.accountNumber || "",
      iban: invoice.iban || "",
    },
    notes: invoice.notes || "",
    terms: invoice.terms || "",
  };

  const handleSubmit = async (data: InvoiceFormSchema) => {
    setError(null);
    startTransition(async () => {
      const result = await updateInvoice(invoice.id, {
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
        setError(result.error || "Failed to update invoice");
      }
    });
  };

  const handlePreview = (data: InvoiceFormSchema) => {
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
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Invoice {invoice.invoiceNumber}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Update the invoice details
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
            defaultValues={defaultValues}
          />
        </CardContent>
      </Card>
    </div>
  );
}
