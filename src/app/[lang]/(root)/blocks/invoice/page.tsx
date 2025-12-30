import { getDictionary } from "@/components/local/dictionaries";
import type { Locale } from "@/components/local/config";
import { InvoiceList } from "@/components/root/block/invoice/invoice-list";
import { getInvoiceStats } from "@/components/root/block/invoice/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export const runtime = "nodejs";

interface InvoicePageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata() {
  return {
    title: "Invoices",
    description: "Manage your invoices - create, view, and track payments",
  };
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const stats = await getInvoiceStats();

  return (
    <div className="container py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <p className="mt-2 text-muted-foreground">
          Create and manage your invoices
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice List */}
      <InvoiceList lang={lang} />
    </div>
  );
}
