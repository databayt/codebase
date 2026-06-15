import ArtsContent from "@/components/root/arts/content";
import { getDictionary } from "@/components/local/dictionaries";
import { type Locale } from "@/components/local/config";

export const metadata = {
  title: "Arts",
}

interface ArtsPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function Arts({ params }: ArtsPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <ArtsContent dictionary={dictionary} params={{ lang }} />;
}
