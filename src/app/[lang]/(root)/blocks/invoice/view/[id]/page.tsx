import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Download, Send, CheckCircle, Edit } from "lucide-react";
import Link from "next/link";

import { getDictionary } from "@/components/local/dictionaries";
import type { Locale } from "@/components/local/config";
import { getInvoiceById } from "@/components/root/block/invoice/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { INVOICE_STATUS_COLORS, type InvoiceStatus } from "@/components/root/block/invoice/types";
import { InvoiceActions } from "./actions-client";

export const runtime = "nodejs";

interface ViewInvoicePageProps {
  params: Promise<{ lang: Locale; id: string }>;
}

export async function generateMetadata({ params }: ViewInvoicePageProps) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    return { title: "Invoice Not Found" };
  }

  return {
    title: invoice.invoiceNumber,
    description: `Invoice ${invoice.invoiceNumber} for ${invoice.toName}`,
  };
}

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  PENDING: "Pending",
  SENT: "Sent",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

export default async function ViewInvoicePage({ params }: ViewInvoicePageProps) {
  const { lang, id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", {
      style: "currency",
      currency: invoice.currency,
    }).format(amount);
  };

  const statusKey = invoice.status.toLowerCase() as InvoiceStatus;
  const statusColor = INVOICE_STATUS_COLORS[statusKey] || INVOICE_STATUS_COLORS.draft;

  return (
    <div className="container py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${lang}/blocks/invoice`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {invoice.invoiceNumber}
              </h1>
              <Badge variant="outline" className={statusColor}>
                {statusLabels[invoice.status] || invoice.status}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              Created on {format(new Date(invoice.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
        </div>
        <InvoiceActions lang={lang} invoice={invoice} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* From */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground uppercase">
              From
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{invoice.fromName}</p>
            {invoice.fromEmail && (
              <p className="text-sm text-muted-foreground">{invoice.fromEmail}</p>
            )}
            {invoice.fromPhone && (
              <p className="text-sm text-muted-foreground">{invoice.fromPhone}</p>
            )}
            {invoice.fromAddress && (
              <p className="text-sm text-muted-foreground">{invoice.fromAddress}</p>
            )}
            {(invoice.fromCity || invoice.fromCountry) && (
              <p className="text-sm text-muted-foreground">
                {[invoice.fromCity, invoice.fromCountry].filter(Boolean).join(", ")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* To */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground uppercase">
              Bill To
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{invoice.toName}</p>
            {invoice.toEmail && (
              <p className="text-sm text-muted-foreground">{invoice.toEmail}</p>
            )}
            {invoice.toPhone && (
              <p className="text-sm text-muted-foreground">{invoice.toPhone}</p>
            )}
            {invoice.toAddress && (
              <p className="text-sm text-muted-foreground">{invoice.toAddress}</p>
            )}
            {(invoice.toCity || invoice.toCountry) && (
              <p className="text-sm text-muted-foreground">
                {[invoice.toCity, invoice.toCountry].filter(Boolean).join(", ")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dates */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Invoice Date</p>
              <p className="font-medium">
                {format(new Date(invoice.issueDate), "MMMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-medium">
                {format(new Date(invoice.dueDate), "MMMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Currency</p>
              <p className="font-medium">{invoice.currency}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-end">Rate</TableHead>
                <TableHead className="text-end">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-end">
                    {formatCurrency(item.rate)}
                  </TableCell>
                  <TableCell className="text-end font-medium">
                    {formatCurrency(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Separator className="my-6" />

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({invoice.discountRate}%)</span>
                  <span>-{formatCurrency(invoice.discountAmount)}</span>
                </div>
              )}
              {invoice.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tax ({invoice.taxRate}%)
                  </span>
                  <span>{formatCurrency(invoice.taxAmount)}</span>
                </div>
              )}
              {invoice.shippingAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(invoice.shippingAmount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
      {(invoice.bankName || invoice.accountNumber || invoice.iban) && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {invoice.bankName && (
                <div>
                  <p className="text-sm text-muted-foreground">Bank Name</p>
                  <p className="font-medium">{invoice.bankName}</p>
                </div>
              )}
              {invoice.accountName && (
                <div>
                  <p className="text-sm text-muted-foreground">Account Name</p>
                  <p className="font-medium">{invoice.accountName}</p>
                </div>
              )}
              {invoice.accountNumber && (
                <div>
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="font-medium">{invoice.accountNumber}</p>
                </div>
              )}
              {invoice.iban && (
                <div>
                  <p className="text-sm text-muted-foreground">IBAN</p>
                  <p className="font-medium">{invoice.iban}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes & Terms */}
      {(invoice.notes || invoice.terms) && (
        <div className="grid gap-6 md:grid-cols-2">
          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
          {invoice.terms && (
            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{invoice.terms}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
