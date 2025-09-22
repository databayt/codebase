import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LeadsContent() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Lead Pipeline</CardTitle>
          <CardDescription>
            Track and manage your leads through the sales funnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">234</div>
              <p className="text-sm text-muted-foreground">New</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">156</div>
              <p className="text-sm text-muted-foreground">Contacted</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">89</div>
              <p className="text-sm text-muted-foreground">Qualified</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">45</div>
              <p className="text-sm text-muted-foreground">Converted</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}