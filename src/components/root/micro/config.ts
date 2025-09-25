export interface MicroItem {
  id: string
  title: string
  description: string
  icon: string
  iconFill?: boolean
  iconSize?: string
  href: string
}

export const micros: MicroItem[] = [
  {
    id: "math",
    title: "Math",
    description: "Automate calculations and formula processing.",
    icon: "MathIcon",
    iconSize: "w-10 h-10",
    href: "/math",
  },
  {
    id: "flow",
    title: "Flow",
    description: "Automate workflow and process management.",
    icon: "FlowIcon",
    href: "/flow",
  },
  {
    id: "docs",
    title: "Docs",
    description: "Generate and manage documentation.",
    icon: "DocsIcon",
    href: "/docs",
  },
  {
    id: "report",
    title: "Report",
    description: "Autom generate comprehensive reports.",
    icon: "ReportIcon",
    iconFill: true,
    href: "/report",
  },
  {
    id: "pdf",
    title: "PDF",
    description: "Automate PDF processing, extraction, and manipulation.",
    icon: "PDFIcon",
    iconFill: true,
    href: "/pdf",
  },
  {
    id: "chatbot",
    title: "Chatbot",
    description: "Handle automated customer interactions and support.",
    icon: "ChatbotIcon",
    href: "/chatbot",
  },
  {
    id: "invoice",
    title: "Invoice",
    description: "Automate invoice generation and payment processing.",
    icon: "InvoiceIcon",
    href: "/invoice",
  },
  {
    id: "salary",
    title: "Salary",
    description: "Automate payroll calculations and salary management.",
    icon: "SalaryIcon",
    href: "/salary",
  },
  {
    id: "timesheet",
    title: "Timesheet",
    description: "Automate time tracking and attendance management.",
    icon: "TimesheetIcon",
    iconSize: "w-7 h-7",
    href: "/timesheet",
  },
  {
    id: "leads",
    title: "Leads",
    description: "Automate leads tracking and customer relation.",
    icon: "LeadsIcon",
    href: "/leads",
  },
  {
    id: "proposal",
    title: "Proposal",
    description: "Auto generate proposal and document.",
    icon: "ProposalIcon",
    iconSize: "w-7 h-7",
    href: "/proposal",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Automate data visualization and monitoring.",
    icon: "DashboardIcon",
    href: "/dashboard",
  },
  {
    id: "logbook",
    title: "Logbook",
    description: "Automate activity logging and record keeping.",
    icon: "LogbookIcon",
    href: "/logbook",
  },
]