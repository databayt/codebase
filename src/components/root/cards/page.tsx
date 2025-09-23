import ActivityGoal from "./activity-goal"
import Calendar from "./calendar"
import Chat from "./chat"
import CookieSettings from "./cookie-settings"
import CreateAccount from "./create-account"
import DataTable from "./data-table"
import Metric from "./metric"
import PaymentMethod from "./payment-method"
import ReportIssue from "./report-issue"
import Share from "./share"
import Stats from "./stats"
import TeamMembers from "./team-members"

export default function CardsTemplate() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Card Components Collection</h1>
        <p className="text-muted-foreground">
          A comprehensive collection of card components for various use cases including metrics, forms, and data display.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ActivityGoal />
        <Metric />
        <Stats />
        <Calendar />
        <PaymentMethod />
        <CreateAccount />
        <TeamMembers />
        <Share />
        <ReportIssue />
        <Chat />
        <DataTable />
        <CookieSettings />
      </div>
    </div>
  )
}