"use client"

import { LeadsContent } from "./components/content"
import { LeadForm } from "./components/form"
import { LeadCard } from "./components/card"
import { AllLeads } from "./components/all"
import { FeaturedLeads } from "./components/featured"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"

export default function LeadsTemplate() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Leads Management</h2>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <LeadForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="all">All Leads</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <LeadsContent />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <LeadCard
                title="Total Leads"
                value="1,234"
                description="+20.1% from last month"
                trend="up"
              />
              <LeadCard
                title="Qualified Leads"
                value="456"
                description="+15% from last month"
                trend="up"
              />
              <LeadCard
                title="Conversion Rate"
                value="23.5%"
                description="-2% from last month"
                trend="down"
              />
            </div>
          </TabsContent>

          <TabsContent value="all">
            <AllLeads />
          </TabsContent>

          <TabsContent value="featured">
            <FeaturedLeads />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}