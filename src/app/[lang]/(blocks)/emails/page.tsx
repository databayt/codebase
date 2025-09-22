import EmailsContent from "@/components/emails/content";

export const runtime = "nodejs";

export const metadata = {
  title: "Emails",
}

export default function Emails() {
  return <EmailsContent />;
}