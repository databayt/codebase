
import TemplateContent from "@/components/root/template/content";
import { getDictionary } from "@/components/local/dictionaries";
import { type Locale } from "@/components/local/config";

export const dynamic = "force-static"
export const revalidate = false

export const metadata = {
  title: "Templates",
}

const FEATURED_TEMPLATES = [
  "login-01",
  "hero-01",
  "sidebar-01",
  "header-01",
  "footer-01",
]

interface TemplatePageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function Templates({ params }: TemplatePageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <TemplateContent dictionary={dictionary} params={{ lang }} />;
}