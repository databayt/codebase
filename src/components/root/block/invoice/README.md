# Invoice Block

A full-featured invoice generation block with PDF export.

## Features

- **Multi-step Form**: Wizard-style form with 5 steps
  - Parties (From/To)
  - Invoice Details (Number, Dates, Currency)
  - Line Items (Products/Services)
  - Payment Information
  - Summary (Totals, Notes, Terms)

- **PDF Generation**: Professional PDF export using @react-pdf/renderer
- **Multiple Currencies**: USD, EUR, GBP, SAR, AED, EGP, SDG
- **Calculations**: Automatic subtotal, tax, discount, shipping, and total
- **Preview**: Real-time invoice preview before download
- **RTL Support**: Full Arabic language support

## Files

```
src/components/root/block/invoice/
├── content.tsx         # Main block component
├── invoice-form.tsx    # Multi-step form component
├── pdf-template.tsx    # PDF document template
├── types.ts            # TypeScript interfaces
├── validation.ts       # Zod schemas and utilities
└── README.md           # This file
```

## Usage

```tsx
import InvoiceBlockContent from "@/components/root/block/invoice/content";

<InvoiceBlockContent dictionary={dictionary} lang="en" />
```

## Route

Available at: `/blocks/invoice`

## Dependencies

- `@react-pdf/renderer` - PDF generation
- `react-hook-form` - Form management
- `zod` - Validation
- `@hookform/resolvers` - Zod integration
- shadcn/ui components (Button, Card, Input, etc.)

## Stack Adaptation

This block is adapted to the codebase stack:
- ✅ TypeScript strict mode
- ✅ shadcn/ui components
- ✅ RTL support (ms/me, text-start/end)
- ✅ OKLCH color tokens (via shadcn theme)
- 🔲 Auth.js integration (pending)
- 🔲 Prisma persistence (pending)
- 🔲 i18n strings (pending)

## Future Enhancements

- [ ] Save invoices to database
- [ ] Invoice history with filtering
- [ ] Email invoice to client
- [ ] Invoice templates
- [ ] Logo upload
- [ ] Recurring invoices
- [ ] Payment tracking (Stripe integration)
