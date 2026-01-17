import { Metadata } from "next";
import { getDictionary } from "@/components/local/dictionaries";
import type { Locale } from "@/components/local/config";
import ReportBlockContent from "@/components/root/block/report/content";

export const metadata: Metadata = {
  title: "T&C Report",
  description:
    "Electrical Testing & Commissioning Reports for 33kV/13.8kV Substations",
};

interface ReportPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="container py-8">
      <ReportBlockContent dictionary={dictionary} lang={lang} />
    </div>
  );
}
