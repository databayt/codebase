"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Mail, Phone, Edit, Trash } from "lucide-react"

const leads = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    company: "Acme Corp",
    status: "qualified",
    source: "website",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    company: "Tech Solutions",
    status: "new",
    source: "referral",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    company: "Global Industries",
    status: "contacted",
    source: "social",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    company: "StartUp Inc",
    status: "converted",
    source: "email",
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@example.com",
    company: "Enterprise Co",
    status: "qualified",
    source: "website",
    createdAt: "2024-01-11",
  },
]

const statusColors = {
  new: "default",
  contacted: "secondary",
  qualified: "outline",
  converted: "default",
} as const

export function AllLeads() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-sm text-muted-foreground">{lead.email}</div>
                </div>
              </TableCell>
              <TableCell>{lead.company}</TableCell>
              <TableCell>
                <Badge variant={statusColors[lead.status as keyof typeof statusColors]}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>{lead.source}</TableCell>
              <TableCell>{lead.createdAt}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}