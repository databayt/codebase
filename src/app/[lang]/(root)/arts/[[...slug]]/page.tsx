import { notFound } from "next/navigation";
import ArtsContent from "@/components/root/arts/content";
import { resolveArts, artsParams } from "@/components/root/arts/resolve";
import { getDictionary } from "@/components/local/dictionaries";
import { type Locale } from "@/components/local/config";

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

// /arts · /arts/<tab> · /arts/<namespace>/<folder> — the path mirrors cdn.databayt.org.
export function generateStaticParams() {
  return artsParams();
}

interface ArtsPageProps {
  params: Promise<{ lang: Locale; slug?: string[] }>;
}

export async function generateMetadata({ params }: ArtsPageProps) {
  const { slug } = await params;
  const view = resolveArts(slug);
  if (!view) return { title: "Arts" };
  const title = [view.facet.label, view.folder].filter(Boolean).join(" / ");
  return { title: view.facet.slug ? `Arts · ${title}` : "Arts" };
}

export default async function Arts({ params }: ArtsPageProps) {
  const { lang, slug } = await params;
  const view = resolveArts(slug);
  if (!view) notFound();
  const dictionary = await getDictionary(lang);

  return <ArtsContent dictionary={dictionary} params={{ lang }} view={view} />;
}
