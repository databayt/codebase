import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/registry/new-york/lib/utils"

interface LeadCardProps {
  title: string
  value: string
  description?: string
  trend?: "up" | "down"
  className?: string
}

export function LeadCard({ title, value, description, trend, className }: LeadCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend && (
          <div className={cn(
            "flex items-center text-xs",
            trend === "up" ? "text-green-600" : "text-red-600"
          )}>
            {trend === "up" ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}