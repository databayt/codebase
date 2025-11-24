import { SiteHeader } from '@/components/template/header-01/content';
import { getDictionary } from '@/components/local/dictionaries';
import { type Locale } from '@/components/local/config';
import { SiteFooter } from '@/components/template/footer-01/content';

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dictionary = await getDictionary(lang || 'en');

  return (
    <>
      <SiteHeader dictionary={dictionary} />
      <main className="min-h-screen">{children}</main>
      <SiteFooter dictionary={dictionary} />
    </>
  );
}
