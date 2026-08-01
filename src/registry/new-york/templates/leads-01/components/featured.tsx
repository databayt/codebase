import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Mail, Phone, Calendar } from "lucide-react"

const featuredLeads = [
  {
    id: "1",
    name: "Enterprise Client A",
    company: "Fortune 500 Corp",
    value: "$250,000",
    probability: "85%",
    status: "qualified",
    lastContact: "2 days ago",
    nextAction: "Schedule demo",
  },
  {
    id: "2",
    name: "Strategic Partner B",
    company: "Tech Giant Inc",
    value: "$180,000",
    probability: "70%",
    status: "contacted",
    lastContact: "1 week ago",
    nextAction: "Send proposal",
  },
  {
    id: "3",
    name: "High Value Lead C",
    company: "Global Solutions",
    value: "$150,000",
    probability: "60%",
    status: "new",
    lastContact: "Never",
    nextAction: "Initial outreach",
  },
]

export function FeaturedLeads() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {featuredLeads.map((lead) => (
        <Card key={lead.id} className="relative">
          <div className="absolute top-4 right-4">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>
          <CardHeader>
            <CardTitle className="pr-8">{lead.name}</CardTitle>
            <CardDescription>{lead.company}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Deal Value</span>
              <span className="font-semibold">{lead.value}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Probability</span>
              <Badge variant="outline">{lead.probability}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge>{lead.status}</Badge>
            </div>
            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground mb-1">
                Last contact: {lead.lastContact}
              </div>
              <div className="text-sm font-medium">
                Next: {lead.nextAction}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Calendar className="h-4 w-4 mr-1" />
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}