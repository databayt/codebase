"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import type { Invoice, InvoiceItem, InvoiceStatus } from "@prisma/client";

// Types
export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
}

export interface CreateInvoiceInput {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  currency: string;
  from: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  to: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  items: {
    description: string;
    quantity: number;
    rate: number;
  }[];
  taxRate?: number;
  discountRate?: number;
  shippingAmount?: number;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  iban?: string;
  notes?: string;
  terms?: string;
}

// Calculate totals
function calculateTotals(
  items: { quantity: number; rate: number }[],
  taxRate: number = 0,
  discountRate: number = 0,
  shippingAmount: number = 0
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const discountAmount = subtotal * (discountRate / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (taxRate / 100);
  const total = afterDiscount + taxAmount + shippingAmount;

  return { subtotal, discountAmount, taxAmount, total };
}

// Get all invoices for current user
export async function getInvoices(page: number = 1, pageSize: number = 10) {
  const user = await currentUser();
  if (!user?.id) {
    return { invoices: [], total: 0, totalPages: 0 };
  }

  const [invoices, total] = await Promise.all([
    db.invoice.findMany({
      where: { userId: user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.invoice.count({ where: { userId: user.id } }),
  ]);

  return {
    invoices,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

// Get single invoice by ID
export async function getInvoiceById(
  id: string
): Promise<InvoiceWithItems | null> {
  const user = await currentUser();
  if (!user?.id) return null;

  return db.invoice.findFirst({
    where: { id, userId: user.id },
    include: { items: true },
  });
}

// Create new invoice
export async function createInvoice(input: CreateInvoiceInput) {
  const user = await currentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const totals = calculateTotals(
    input.items,
    input.taxRate,
    input.discountRate,
    input.shippingAmount
  );

  try {
    const invoice = await db.invoice.create({
      data: {
        invoiceNumber: input.invoiceNumber,
        issueDate: input.issueDate,
        dueDate: input.dueDate,
        currency: input.currency,
        status: "DRAFT",

        fromName: input.from.name,
        fromEmail: input.from.email,
        fromPhone: input.from.phone,
        fromAddress: input.from.address,
        fromCity: input.from.city,
        fromCountry: input.from.country,

        toName: input.to.name,
        toEmail: input.to.email,
        toPhone: input.to.phone,
        toAddress: input.to.address,
        toCity: input.to.city,
        toCountry: input.to.country,

        subtotal: totals.subtotal,
        taxRate: input.taxRate || 0,
        taxAmount: totals.taxAmount,
        discountRate: input.discountRate || 0,
        discountAmount: totals.discountAmount,
        shippingAmount: input.shippingAmount || 0,
        total: totals.total,

        bankName: input.bankName,
        accountName: input.accountName,
        accountNumber: input.accountNumber,
        iban: input.iban,

        notes: input.notes,
        terms: input.terms,

        userId: user.id,

        items: {
          create: input.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate,
          })),
        },
      },
      include: { items: true },
    });

    revalidatePath("/blocks/invoice");
    return { success: true, invoice };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return { success: false, error: "Failed to create invoice" };
  }
}

// Update invoice
export async function updateInvoice(id: string, input: CreateInvoiceInput) {
  const user = await currentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const existing = await db.invoice.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return { success: false, error: "Invoice not found" };
  }

  const totals = calculateTotals(
    input.items,
    input.taxRate,
    input.discountRate,
    input.shippingAmount
  );

  try {
    // Delete existing items
    await db.invoiceItem.deleteMany({ where: { invoiceId: id } });

    // Update invoice with new items
    const invoice = await db.invoice.update({
      where: { id },
      data: {
        invoiceNumber: input.invoiceNumber,
        issueDate: input.issueDate,
        dueDate: input.dueDate,
        currency: input.currency,

        fromName: input.from.name,
        fromEmail: input.from.email,
        fromPhone: input.from.phone,
        fromAddress: input.from.address,
        fromCity: input.from.city,
        fromCountry: input.from.country,

        toName: input.to.name,
        toEmail: input.to.email,
        toPhone: input.to.phone,
        toAddress: input.to.address,
        toCity: input.to.city,
        toCountry: input.to.country,

        subtotal: totals.subtotal,
        taxRate: input.taxRate || 0,
        taxAmount: totals.taxAmount,
        discountRate: input.discountRate || 0,
        discountAmount: totals.discountAmount,
        shippingAmount: input.shippingAmount || 0,
        total: totals.total,

        bankName: input.bankName,
        accountName: input.accountName,
        accountNumber: input.accountNumber,
        iban: input.iban,

        notes: input.notes,
        terms: input.terms,

        items: {
          create: input.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate,
          })),
        },
      },
      include: { items: true },
    });

    revalidatePath("/blocks/invoice");
    revalidatePath(`/blocks/invoice/edit/${id}`);
    return { success: true, invoice };
  } catch (error) {
    console.error("Error updating invoice:", error);
    return { success: false, error: "Failed to update invoice" };
  }
}

// Update invoice status
export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  const user = await currentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.invoice.update({
      where: { id, userId: user.id },
      data: { status },
    });

    revalidatePath("/blocks/invoice");
    return { success: true };
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

// Delete invoice
export async function deleteInvoice(id: string) {
  const user = await currentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.invoice.delete({
      where: { id, userId: user.id },
    });

    revalidatePath("/blocks/invoice");
    return { success: true };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return { success: false, error: "Failed to delete invoice" };
  }
}

// Mark invoice as paid
export async function markInvoiceAsPaid(id: string) {
  return updateInvoiceStatus(id, "PAID");
}

// Send invoice email (placeholder - implement with your email provider)
export async function sendInvoiceEmail(id: string) {
  const user = await currentUser();
  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const invoice = await getInvoiceById(id);
  if (!invoice) {
    return { success: false, error: "Invoice not found" };
  }

  // TODO: Implement email sending with your email provider
  // For now, just mark as sent
  await updateInvoiceStatus(id, "SENT");

  return { success: true, message: "Invoice marked as sent" };
}

// Get invoice statistics
export async function getInvoiceStats() {
  const user = await currentUser();
  if (!user?.id) {
    return { total: 0, paid: 0, pending: 0, overdue: 0, totalAmount: 0 };
  }

  const [total, paid, pending, overdue, amounts] = await Promise.all([
    db.invoice.count({ where: { userId: user.id } }),
    db.invoice.count({ where: { userId: user.id, status: "PAID" } }),
    db.invoice.count({
      where: { userId: user.id, status: { in: ["DRAFT", "PENDING", "SENT"] } },
    }),
    db.invoice.count({
      where: {
        userId: user.id,
        status: { not: "PAID" },
        dueDate: { lt: new Date() },
      },
    }),
    db.invoice.aggregate({
      where: { userId: user.id },
      _sum: { total: true },
    }),
  ]);

  return {
    total,
    paid,
    pending,
    overdue,
    totalAmount: amounts._sum.total || 0,
  };
}
