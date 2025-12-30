"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Download, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  invoiceFormSchema,
  defaultInvoiceValues,
  calculateInvoiceTotals,
  generateInvoiceNumber,
  type InvoiceFormSchema,
} from "./validation";
import { CURRENCIES } from "./types";

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormSchema) => void;
  onPreview: (data: InvoiceFormSchema) => void;
  isLoading?: boolean;
  defaultValues?: InvoiceFormSchema;
}

export function InvoiceForm({
  onSubmit,
  onPreview,
  isLoading = false,
  defaultValues: initialValues,
}: InvoiceFormProps) {
  const [activeTab, setActiveTab] = useState("parties");

  const form = useForm<InvoiceFormSchema>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: initialValues || {
      ...defaultInvoiceValues,
      invoiceNumber: generateInvoiceNumber(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchItems = form.watch("items");
  const watchTaxRate = form.watch("taxRate") || 0;
  const watchDiscountRate = form.watch("discountRate") || 0;
  const watchShippingAmount = form.watch("shippingAmount") || 0;

  const totals = calculateInvoiceTotals(
    watchItems,
    watchTaxRate,
    watchDiscountRate,
    watchShippingAmount
  );

  const handlePreview = () => {
    const data = form.getValues();
    onPreview(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="parties">Parties</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Tab 1: From & To */}
        <TabsContent value="parties" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">From (Your Details)</CardTitle>
                <CardDescription>Your business information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="from.name">Name / Company *</Label>
                  <Input
                    id="from.name"
                    {...form.register("from.name")}
                    placeholder="Your Company Name"
                  />
                  {form.formState.errors.from?.name && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.from.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="from.email">Email</Label>
                  <Input
                    id="from.email"
                    type="email"
                    {...form.register("from.email")}
                    placeholder="email@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="from.phone">Phone</Label>
                  <Input
                    id="from.phone"
                    {...form.register("from.phone")}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <Label htmlFor="from.address">Address</Label>
                  <Input
                    id="from.address"
                    {...form.register("from.address")}
                    placeholder="123 Street Name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from.city">City</Label>
                    <Input
                      id="from.city"
                      {...form.register("from.city")}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="from.country">Country</Label>
                    <Input
                      id="from.country"
                      {...form.register("from.country")}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bill To (Client)</CardTitle>
                <CardDescription>Client information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="to.name">Name / Company *</Label>
                  <Input
                    id="to.name"
                    {...form.register("to.name")}
                    placeholder="Client Name"
                  />
                  {form.formState.errors.to?.name && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.to.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="to.email">Email</Label>
                  <Input
                    id="to.email"
                    type="email"
                    {...form.register("to.email")}
                    placeholder="client@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="to.phone">Phone</Label>
                  <Input
                    id="to.phone"
                    {...form.register("to.phone")}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <Label htmlFor="to.address">Address</Label>
                  <Input
                    id="to.address"
                    {...form.register("to.address")}
                    placeholder="123 Street Name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="to.city">City</Label>
                    <Input
                      id="to.city"
                      {...form.register("to.city")}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="to.country">Country</Label>
                    <Input
                      id="to.country"
                      {...form.register("to.country")}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={() => setActiveTab("details")}>
              Next: Invoice Details
            </Button>
          </div>
        </TabsContent>

        {/* Tab 2: Invoice Details */}
        <TabsContent value="details" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Details</CardTitle>
              <CardDescription>
                Invoice number, dates, and currency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                  <Input
                    id="invoiceNumber"
                    {...form.register("invoiceNumber")}
                    placeholder="INV-001"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={form.watch("currency")}
                    onValueChange={(value) => form.setValue("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={
                      form.watch("issueDate")
                        ? new Date(form.watch("issueDate"))
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      form.setValue("issueDate", new Date(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={
                      form.watch("dueDate")
                        ? new Date(form.watch("dueDate"))
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      form.setValue("dueDate", new Date(e.target.value))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab("parties")}
            >
              Back
            </Button>
            <Button type="button" onClick={() => setActiveTab("items")}>
              Next: Line Items
            </Button>
          </div>
        </TabsContent>

        {/* Tab 3: Line Items */}
        <TabsContent value="items" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Line Items</CardTitle>
              <CardDescription>
                Add products or services to your invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-start p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <Label htmlFor={`items.${index}.description`}>
                      Description
                    </Label>
                    <Input
                      {...form.register(`items.${index}.description`)}
                      placeholder="Product or service description"
                    />
                  </div>
                  <div className="w-24">
                    <Label htmlFor={`items.${index}.quantity`}>Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      {...form.register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="w-32">
                    <Label htmlFor={`items.${index}.rate`}>Rate</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      {...form.register(`items.${index}.rate`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="w-32">
                    <Label>Amount</Label>
                    <div className="h-10 flex items-center font-medium">
                      {(
                        (watchItems[index]?.quantity || 0) *
                        (watchItems[index]?.rate || 0)
                      ).toFixed(2)}
                    </div>
                  </div>
                  <div className="pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => append({ description: "", quantity: 1, rate: 0 })}
                className="w-full"
              >
                <Plus className="h-4 w-4 me-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab("details")}
            >
              Back
            </Button>
            <Button type="button" onClick={() => setActiveTab("payment")}>
              Next: Payment Info
            </Button>
          </div>
        </TabsContent>

        {/* Tab 4: Payment */}
        <TabsContent value="payment" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Information</CardTitle>
              <CardDescription>
                Bank details for receiving payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="payment.bankName">Bank Name</Label>
                  <Input
                    id="payment.bankName"
                    {...form.register("payment.bankName")}
                    placeholder="Bank Name"
                  />
                </div>
                <div>
                  <Label htmlFor="payment.accountName">Account Name</Label>
                  <Input
                    id="payment.accountName"
                    {...form.register("payment.accountName")}
                    placeholder="Account Holder Name"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="payment.accountNumber">Account Number</Label>
                  <Input
                    id="payment.accountNumber"
                    {...form.register("payment.accountNumber")}
                    placeholder="Account Number"
                  />
                </div>
                <div>
                  <Label htmlFor="payment.iban">IBAN</Label>
                  <Input
                    id="payment.iban"
                    {...form.register("payment.iban")}
                    placeholder="IBAN"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab("items")}
            >
              Back
            </Button>
            <Button type="button" onClick={() => setActiveTab("summary")}>
              Next: Summary
            </Button>
          </div>
        </TabsContent>

        {/* Tab 5: Summary */}
        <TabsContent value="summary" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="discountRate">Discount (%)</Label>
                    <Input
                      id="discountRate"
                      type="number"
                      min="0"
                      max="100"
                      {...form.register("discountRate", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxRate">Tax (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      {...form.register("taxRate", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingAmount">Shipping</Label>
                    <Input
                      id="shippingAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      {...form.register("shippingAmount", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    {...form.register("terms")}
                    placeholder="Payment terms..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    {...form.register("notes")}
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invoice Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{totals.subtotal.toFixed(2)}</span>
                </div>
                {watchDiscountRate > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({watchDiscountRate}%)</span>
                    <span>-{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {watchTaxRate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Tax ({watchTaxRate}%)
                    </span>
                    <span>{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                {watchShippingAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{watchShippingAmount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {form.watch("currency")} {totals.total.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab("payment")}
            >
              Back
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 me-2" />
                Preview
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Download className="h-4 w-4 me-2" />
                Generate Invoice
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}
