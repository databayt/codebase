import LeadsContent from "@/components/leads/content";

export const runtime = "nodejs";

export const metadata = {
  title: "Leads",
}

export default function Leads() {
  return <LeadsContent />;
}