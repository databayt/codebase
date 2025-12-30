"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { pdf } from "@react-pdf/renderer";
import type { getDictionary } from "@/components/local/dictionaries";
import type { Locale } from "@/components/local/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, FileText, Plus } from "lucide-react";

import { InvoiceForm } from "./invoice-form";
import { InvoicePDF } from "./pdf-template";
import type { Invoice } from "./types";
import type { InvoiceFormSchema } from "./validation";
import { calculateInvoiceTotals } from "./validation";

interface InvoiceBlockContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: Locale;
}

// Transform form data to full Invoice object
function formDataToInvoice(data: InvoiceFormSchema): Invoice {
  const items = data.items.map((item, index) => ({
    id: `item-${index}`,
    description: item.description,
    quantity: item.quantity,
    rate: item.rate,
    amount: item.quantity * item.rate,
  }));

  const totals = calculateInvoiceTotals(
    data.items,
    data.taxRate,
    data.discountRate,
    data.shippingAmount
  );

  return {
    id: `inv-${Date.now()}`,
    invoiceNumber: data.invoiceNumber,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    status: "draft",
    currency: data.currency,
    from: data.from,
    to: data.to,
    items,
    subtotal: totals.subtotal,
    taxRate: data.taxRate,
    taxAmount: totals.taxAmount,
    discountRate: data.discountRate,
    discountAmount: totals.discountAmount,
    shippingAmount: data.shippingAmount,
    total: totals.total,
    payment: data.payment,
    notes: data.notes,
    terms: data.terms,
    logo: data.logo,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export default function InvoiceBlockContent({
  lang,
}: InvoiceBlockContentProps) {
  const [showForm, setShowForm] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePreview = (data: InvoiceFormSchema) => {
    const invoice = formDataToInvoice(data);
    setPreviewInvoice(invoice);
  };

  const handleSubmit = async (data: InvoiceFormSchema) => {
    setIsGenerating(true);
    try {
      const invoice = formDataToInvoice(data);
      const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();

      // Download the PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Close form after successful generation
      setShowForm(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Invoice Generator
          </h2>
          <p className="text-muted-foreground">
            Create professional invoices with PDF export
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 me-2" />
          New Invoice
        </Button>
      </div>

      {/* Create Invoice Form */}
      {showForm ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Create Invoice</CardTitle>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <InvoiceForm
              onSubmit={handleSubmit}
              onPreview={handlePreview}
              isLoading={isGenerating}
            />
          </CardContent>
        </Card>
      ) : (
        /* Quick Actions */
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setShowForm(true)}
          >
            <CardHeader className="pb-2">
              <FileText className="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">Create Invoice</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Generate a new invoice with items, taxes, and payment info
              </p>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader className="pb-2">
              <Download className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Invoice History</CardTitle>
                <Badge variant="secondary">Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                View and manage previously created invoices
              </p>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader className="pb-2">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Templates</CardTitle>
                <Badge variant="secondary">Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Save and reuse invoice templates
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Features */}
      {!showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                Professional PDF generation
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                Multiple currencies (USD, EUR, SAR, etc.)
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                Tax and discount calculations
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                Payment information section
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                Custom notes and terms
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                RTL support for Arabic
              </li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={!!previewInvoice}
        onOpenChange={() => setPreviewInvoice(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>
          {previewInvoice && (
            <div className="border rounded-lg p-6 bg-white text-black">
              {/* Preview Header */}
              <div className="flex justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold">INVOICE</h1>
                </div>
                <div className="text-end">
                  <p className="font-bold">{previewInvoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">
                    Issue:{" "}
                    {new Date(previewInvoice.issueDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(previewInvoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-xs uppercase text-gray-500 mb-2">From</p>
                  <p className="font-bold">{previewInvoice.from.name}</p>
                  <p className="text-sm text-gray-600">
                    {previewInvoice.from.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {previewInvoice.from.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 mb-2">
                    Bill To
                  </p>
                  <p className="font-bold">{previewInvoice.to.name}</p>
                  <p className="text-sm text-gray-600">
                    {previewInvoice.to.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {previewInvoice.to.address}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b">
                    <th className="text-start py-2 text-sm text-gray-600">
                      Description
                    </th>
                    <th className="text-center py-2 text-sm text-gray-600">
                      Qty
                    </th>
                    <th className="text-end py-2 text-sm text-gray-600">
                      Rate
                    </th>
                    <th className="text-end py-2 text-sm text-gray-600">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {previewInvoice.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.description}</td>
                      <td className="text-center py-2">{item.quantity}</td>
                      <td className="text-end py-2">
                        {item.rate.toFixed(2)}
                      </td>
                      <td className="text-end py-2 font-medium">
                        {item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{previewInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  {previewInvoice.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({previewInvoice.discountRate}%)</span>
                      <span>-{previewInvoice.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {previewInvoice.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Tax ({previewInvoice.taxRate}%)
                      </span>
                      <span>{previewInvoice.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>
                      {previewInvoice.currency} {previewInvoice.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
