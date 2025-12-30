"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Send, CheckCircle, Edit } from "lucide-react";
import { pdf } from "@react-pdf/renderer";

import { Button } from "@/components/ui/button";
import {
  markInvoiceAsPaid,
  sendInvoiceEmail,
  type InvoiceWithItems,
} from "@/components/root/block/invoice/actions";
import { InvoicePDF } from "@/components/root/block/invoice/pdf-template";
import type { Invoice as InvoiceType } from "@/components/root/block/invoice/types";
import type { Locale } from "@/components/local/config";

interface InvoiceActionsProps {
  lang: Locale;
  invoice: InvoiceWithItems;
}

export function InvoiceActions({ lang, invoice }: InvoiceActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDownload = async () => {
    // Transform to InvoiceType for PDF template
    const invoiceData: InvoiceType = {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      issueDate: new Date(invoice.issueDate),
      dueDate: new Date(invoice.dueDate),
      status: invoice.status.toLowerCase() as InvoiceType["status"],
      currency: invoice.currency,
      from: {
        name: invoice.fromName,
        email: invoice.fromEmail || undefined,
        phone: invoice.fromPhone || undefined,
        address: invoice.fromAddress || undefined,
        city: invoice.fromCity || undefined,
        country: invoice.fromCountry || undefined,
      },
      to: {
        name: invoice.toName,
        email: invoice.toEmail || undefined,
        phone: invoice.toPhone || undefined,
        address: invoice.toAddress || undefined,
        city: invoice.toCity || undefined,
        country: invoice.toCountry || undefined,
      },
      items: invoice.items.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
      })),
      subtotal: invoice.subtotal,
      taxRate: invoice.taxRate,
      taxAmount: invoice.taxAmount,
      discountRate: invoice.discountRate,
      discountAmount: invoice.discountAmount,
      shippingAmount: invoice.shippingAmount,
      total: invoice.total,
      payment: {
        bankName: invoice.bankName || undefined,
        accountName: invoice.accountName || undefined,
        accountNumber: invoice.accountNumber || undefined,
        iban: invoice.iban || undefined,
      },
      notes: invoice.notes || undefined,
      terms: invoice.terms || undefined,
      createdAt: new Date(invoice.createdAt),
      updatedAt: new Date(invoice.updatedAt),
    };

    const blob = await pdf(<InvoicePDF invoice={invoiceData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleMarkPaid = () => {
    startTransition(async () => {
      await markInvoiceAsPaid(invoice.id);
      router.refresh();
    });
  };

  const handleSendEmail = () => {
    startTransition(async () => {
      await sendInvoiceEmail(invoice.id);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handleDownload}>
        <Download className="h-4 w-4 me-2" />
        Download PDF
      </Button>
      {invoice.status !== "PAID" && (
        <>
          {invoice.status !== "SENT" && (
            <Button
              variant="outline"
              onClick={handleSendEmail}
              disabled={isPending}
            >
              <Send className="h-4 w-4 me-2" />
              Send
            </Button>
          )}
          <Button onClick={handleMarkPaid} disabled={isPending}>
            <CheckCircle className="h-4 w-4 me-2" />
            Mark Paid
          </Button>
        </>
      )}
      <Button
        variant="outline"
        onClick={() => router.push(`/${lang}/blocks/invoice/edit/${invoice.id}`)}
      >
        <Edit className="h-4 w-4 me-2" />
        Edit
      </Button>
    </div>
  );
}
