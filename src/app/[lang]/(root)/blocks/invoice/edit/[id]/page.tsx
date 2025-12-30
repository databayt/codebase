import { notFound } from "next/navigation";
import { getDictionary } from "@/components/local/dictionaries";
import type { Locale } from "@/components/local/config";
import { getInvoiceById } from "@/components/root/block/invoice/actions";
import { EditInvoiceClient } from "./client";

export const runtime = "nodejs";

interface EditInvoicePageProps {
  params: Promise<{ lang: Locale; id: string }>;
}

export async function generateMetadata({ params }: EditInvoicePageProps) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    return { title: "Invoice Not Found" };
  }

  return {
    title: `Edit ${invoice.invoiceNumber}`,
    description: `Edit invoice ${invoice.invoiceNumber}`,
  };
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { lang, id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  return <EditInvoiceClient lang={lang} invoice={invoice} />;
}
