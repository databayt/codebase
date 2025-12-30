import { notFound } from "next/navigation";
import { getDictionary } from "@/components/local/dictionaries";
import type { Locale } from "@/components/local/config";
import { blockRegistry, type BlockEntry } from "@/components/root/block/registry";

export const runtime = "nodejs";

interface BlockPageProps {
  params: Promise<{ lang: Locale; name: string }>;
}

export async function generateMetadata({ params }: BlockPageProps) {
  const { name } = await params;
  const block = blockRegistry[name];

  if (!block) {
    return { title: "Block Not Found" };
  }

  return {
    title: block.title,
    description: block.description,
  };
}

export function generateStaticParams() {
  return Object.keys(blockRegistry).map((name) => ({
    name,
  }));
}

export default async function BlockPage({ params }: BlockPageProps) {
  const { lang, name } = await params;
  const dictionary = await getDictionary(lang);

  const block = blockRegistry[name];

  if (!block) {
    notFound();
  }

  const BlockComponent = block.component;

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{block.title}</h1>
        <p className="mt-2 text-muted-foreground">{block.description}</p>
      </div>

      <BlockComponent dictionary={dictionary} lang={lang} />
    </div>
  );
}
