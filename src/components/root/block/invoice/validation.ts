import { z } from "zod";

// Invoice Party Schema
export const invoicePartySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

// Invoice Item Schema
export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be positive"),
});

// Invoice Payment Schema
export const invoicePaymentSchema = z.object({
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  iban: z.string().optional(),
  swiftCode: z.string().optional(),
});

// Full Invoice Form Schema
export const invoiceFormSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  issueDate: z.date(),
  dueDate: z.date(),
  currency: z.string().min(1, "Currency is required"),

  from: invoicePartySchema,
  to: invoicePartySchema,

  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),

  taxRate: z.number().min(0).max(100).default(0),
  discountRate: z.number().min(0).max(100).default(0),
  shippingAmount: z.number().min(0).default(0),

  payment: invoicePaymentSchema.optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  logo: z.string().optional(),
});

export type InvoiceFormSchema = z.infer<typeof invoiceFormSchema>;

// Default values for the form
export const defaultInvoiceValues: Partial<InvoiceFormSchema> = {
  invoiceNumber: "",
  issueDate: new Date(),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  currency: "USD",
  from: {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
  },
  to: {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
  },
  items: [{ description: "", quantity: 1, rate: 0 }],
  taxRate: 0,
  discountRate: 0,
  shippingAmount: 0,
  notes: "",
  terms: "Payment is due within 30 days of invoice date.",
};

// Utility function to calculate totals
export function calculateInvoiceTotals(
  items: Array<{ quantity: number; rate: number }>,
  taxRate: number,
  discountRate: number,
  shippingAmount: number
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const discountAmount = (subtotal * discountRate) / 100;
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = (afterDiscount * taxRate) / 100;
  const total = afterDiscount + taxAmount + shippingAmount;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
  };
}

// Generate invoice number
export function generateInvoiceNumber(prefix = "INV"): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${year}${month}-${random}`;
}
