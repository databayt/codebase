"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Invoice } from "./types";
import { CURRENCIES } from "./types";

// Register fonts (optional - using default for now)
// Font.register({ family: 'Rubik', src: '/fonts/Rubik-Regular.ttf' });

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  invoiceInfo: {
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  invoiceDate: {
    color: "#6b7280",
    marginBottom: 2,
  },
  parties: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  partySection: {
    width: "45%",
  },
  partyLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#6b7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  partyName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  partyDetail: {
    color: "#4b5563",
    marginBottom: 2,
  },
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    color: "#6b7280",
    textTransform: "uppercase",
    fontSize: 9,
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 8,
  },
  descriptionCell: {
    flex: 4,
  },
  quantityCell: {
    flex: 1,
    textAlign: "center",
  },
  rateCell: {
    flex: 1.5,
    textAlign: "right",
  },
  amountCell: {
    flex: 1.5,
    textAlign: "right",
    fontWeight: "bold",
  },
  totals: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 4,
    width: 200,
  },
  totalLabel: {
    flex: 1,
    textAlign: "right",
    color: "#6b7280",
    marginRight: 16,
  },
  totalValue: {
    width: 80,
    textAlign: "right",
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#1f2937",
    width: 200,
  },
  grandTotalLabel: {
    flex: 1,
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 12,
    marginRight: 16,
  },
  grandTotalValue: {
    width: 80,
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 12,
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  footerSection: {
    marginBottom: 16,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#6b7280",
    marginBottom: 4,
  },
  footerText: {
    color: "#4b5563",
    lineHeight: 1.5,
  },
  paymentInfo: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 4,
  },
  paymentRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  paymentLabel: {
    width: 100,
    color: "#6b7280",
  },
  paymentValue: {
    flex: 1,
  },
  status: {
    position: "absolute",
    top: 40,
    right: 40,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  statusPaid: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  statusPending: {
    backgroundColor: "#fef9c3",
    color: "#854d0e",
  },
  statusOverdue: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
});

interface InvoicePDFProps {
  invoice: Invoice;
}

function formatCurrency(amount: number, currencyCode: string): string {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  const symbol = currency?.symbol || "$";
  return `${symbol}${amount.toFixed(2)}`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function InvoicePDF({ invoice }: InvoicePDFProps) {
  const getStatusStyle = () => {
    switch (invoice.status) {
      case "paid":
        return styles.statusPaid;
      case "overdue":
        return styles.statusOverdue;
      default:
        return styles.statusPending;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Status Badge */}
        {invoice.status !== "draft" && (
          <View style={[styles.status, getStatusStyle()]}>
            <Text>{invoice.status.toUpperCase()}</Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
            <Text style={styles.invoiceDate}>
              Issue Date: {formatDate(invoice.issueDate)}
            </Text>
            <Text style={styles.invoiceDate}>
              Due Date: {formatDate(invoice.dueDate)}
            </Text>
          </View>
        </View>

        {/* From / To */}
        <View style={styles.parties}>
          <View style={styles.partySection}>
            <Text style={styles.partyLabel}>From</Text>
            <Text style={styles.partyName}>{invoice.from.name}</Text>
            {invoice.from.email && (
              <Text style={styles.partyDetail}>{invoice.from.email}</Text>
            )}
            {invoice.from.phone && (
              <Text style={styles.partyDetail}>{invoice.from.phone}</Text>
            )}
            {invoice.from.address && (
              <Text style={styles.partyDetail}>{invoice.from.address}</Text>
            )}
            {(invoice.from.city || invoice.from.country) && (
              <Text style={styles.partyDetail}>
                {[invoice.from.city, invoice.from.country]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            )}
          </View>

          <View style={styles.partySection}>
            <Text style={styles.partyLabel}>Bill To</Text>
            <Text style={styles.partyName}>{invoice.to.name}</Text>
            {invoice.to.email && (
              <Text style={styles.partyDetail}>{invoice.to.email}</Text>
            )}
            {invoice.to.phone && (
              <Text style={styles.partyDetail}>{invoice.to.phone}</Text>
            )}
            {invoice.to.address && (
              <Text style={styles.partyDetail}>{invoice.to.address}</Text>
            )}
            {(invoice.to.city || invoice.to.country) && (
              <Text style={styles.partyDetail}>
                {[invoice.to.city, invoice.to.country]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.descriptionCell]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderCell, styles.quantityCell]}>
              Qty
            </Text>
            <Text style={[styles.tableHeaderCell, styles.rateCell]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.amountCell]}>
              Amount
            </Text>
          </View>

          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.descriptionCell}>{item.description}</Text>
              <Text style={styles.quantityCell}>{item.quantity}</Text>
              <Text style={styles.rateCell}>
                {formatCurrency(item.rate, invoice.currency)}
              </Text>
              <Text style={styles.amountCell}>
                {formatCurrency(item.amount, invoice.currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </Text>
          </View>

          {invoice.discountAmount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Discount ({invoice.discountRate}%)
              </Text>
              <Text style={styles.totalValue}>
                -{formatCurrency(invoice.discountAmount, invoice.currency)}
              </Text>
            </View>
          )}

          {invoice.taxAmount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%)</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(invoice.taxAmount, invoice.currency)}
              </Text>
            </View>
          )}

          {invoice.shippingAmount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(invoice.shippingAmount, invoice.currency)}
              </Text>
            </View>
          )}

          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(invoice.total, invoice.currency)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {invoice.payment && (
            <View style={styles.footerSection}>
              <Text style={styles.footerLabel}>Payment Information</Text>
              <View style={styles.paymentInfo}>
                {invoice.payment.bankName && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Bank</Text>
                    <Text style={styles.paymentValue}>
                      {invoice.payment.bankName}
                    </Text>
                  </View>
                )}
                {invoice.payment.accountName && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Account Name</Text>
                    <Text style={styles.paymentValue}>
                      {invoice.payment.accountName}
                    </Text>
                  </View>
                )}
                {invoice.payment.accountNumber && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Account No.</Text>
                    <Text style={styles.paymentValue}>
                      {invoice.payment.accountNumber}
                    </Text>
                  </View>
                )}
                {invoice.payment.iban && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>IBAN</Text>
                    <Text style={styles.paymentValue}>
                      {invoice.payment.iban}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {invoice.terms && (
            <View style={styles.footerSection}>
              <Text style={styles.footerLabel}>Terms & Conditions</Text>
              <Text style={styles.footerText}>{invoice.terms}</Text>
            </View>
          )}

          {invoice.notes && (
            <View style={styles.footerSection}>
              <Text style={styles.footerLabel}>Notes</Text>
              <Text style={styles.footerText}>{invoice.notes}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
