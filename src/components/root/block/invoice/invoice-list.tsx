"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  MoreVertical,
  Eye,
  Edit,
  CheckCircle,
  Send,
  Trash2,
  Plus,
  Loader2,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getInvoices,
  deleteInvoice,
  markInvoiceAsPaid,
  sendInvoiceEmail,
  type InvoiceWithItems,
} from "./actions";
import { INVOICE_STATUS_COLORS, type InvoiceStatus } from "./types";

interface InvoiceListProps {
  lang: string;
}

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  PENDING: "Pending",
  SENT: "Sent",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

export function InvoiceList({ lang }: InvoiceListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [invoices, setInvoices] = useState<InvoiceWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadInvoices = async () => {
    setLoading(true);
    const result = await getInvoices(page, 10);
    setInvoices(result.invoices);
    setTotalPages(result.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    loadInvoices();
  }, [page]);

  const handleDelete = async () => {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteInvoice(deleteId);
      setDeleteId(null);
      loadInvoices();
    });
  };

  const handleMarkPaid = async (id: string) => {
    startTransition(async () => {
      await markInvoiceAsPaid(id);
      loadInvoices();
    });
  };

  const handleSendEmail = async (id: string) => {
    startTransition(async () => {
      await sendInvoiceEmail(id);
      loadInvoices();
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusKey = status.toLowerCase() as InvoiceStatus;
    const colorClass =
      INVOICE_STATUS_COLORS[statusKey] || INVOICE_STATUS_COLORS.draft;
    return (
      <Badge variant="outline" className={colorClass}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
          <p className="text-muted-foreground text-center mb-6">
            Create your first invoice to get started
          </p>
          <Button onClick={() => router.push(`/${lang}/blocks/invoice/create`)}>
            <Plus className="h-4 w-4 me-2" />
            Create Invoice
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoices</CardTitle>
          <Button onClick={() => router.push(`/${lang}/blocks/invoice/create`)}>
            <Plus className="h-4 w-4 me-2" />
            New Invoice
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>{invoice.toName}</TableCell>
                  <TableCell>
                    {format(new Date(invoice.issueDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(invoice.total, invoice.currency)}
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/${lang}/blocks/invoice/view/${invoice.id}`
                            )
                          }
                        >
                          <Eye className="h-4 w-4 me-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/${lang}/blocks/invoice/edit/${invoice.id}`
                            )
                          }
                        >
                          <Edit className="h-4 w-4 me-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {invoice.status !== "PAID" && (
                          <DropdownMenuItem
                            onClick={() => handleMarkPaid(invoice.id)}
                          >
                            <CheckCircle className="h-4 w-4 me-2" />
                            Mark as Paid
                          </DropdownMenuItem>
                        )}
                        {invoice.status !== "SENT" &&
                          invoice.status !== "PAID" && (
                            <DropdownMenuItem
                              onClick={() => handleSendEmail(invoice.id)}
                            >
                              <Send className="h-4 w-4 me-2" />
                              Send Email
                            </DropdownMenuItem>
                          )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(invoice.id)}
                        >
                          <Trash2 className="h-4 w-4 me-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invoice? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
