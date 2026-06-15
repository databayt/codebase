import IconsContent from "@/components/root/icons/content";
import { getDictionary } from "@/components/local/dictionaries";
import { type Locale } from "@/components/local/config";

export const metadata = {
  title: "Icons",
}

interface IconsPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function Icons({ params }: IconsPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <IconsContent dictionary={dictionary} params={{ lang }} />;
}
