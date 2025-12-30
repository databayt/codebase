// Invoice Block Types

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceParty {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
}

export interface InvoicePayment {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  routingNumber?: string;
  iban?: string;
  swiftCode?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
  currency: string;

  // Parties
  from: InvoiceParty;
  to: InvoiceParty;

  // Items
  items: InvoiceItem[];

  // Totals
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  shippingAmount: number;
  total: number;

  // Payment
  payment?: InvoicePayment;

  // Extras
  notes?: string;
  terms?: string;
  signature?: string;
  logo?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export type InvoiceStatus =
  | "draft"
  | "pending"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled";

export interface InvoiceFormData {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  currency: string;

  from: InvoiceParty;
  to: InvoiceParty;

  items: Omit<InvoiceItem, "id" | "amount">[];

  taxRate: number;
  discountRate: number;
  shippingAmount: number;

  payment?: InvoicePayment;
  notes?: string;
  terms?: string;
  logo?: string;
}

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
  { code: "SDG", symbol: "ج.س", name: "Sudanese Pound" },
] as const;

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};
