import { CardsReportIssue } from "@/components/atom/report-issue"

// Cards read their copy from the site dictionary; the demo passes an empty one.
const dictionary = { locale: "en", cards: {} } as any

export default function ReportIssueDemo() {
  return (
    <>
      <CardsReportIssue dictionary={dictionary} />
    </>
  )
}
