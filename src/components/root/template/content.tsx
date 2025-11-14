import Hero from './hero';
import { TemplatesNav } from './templates-nav';
import TemplatesPage from './all';
import { FEATURED_TEMPLATES } from './config';
import { TemplateDisplay } from './template-display';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { getDictionary } from '@/components/local/dictionaries';
import type { Locale } from '@/components/local/config';

interface TemplateContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  params: { lang: Locale };
}

export default function TemplateContent({ dictionary, params }: TemplateContentProps) {
    // Extract only the serializable strings for client components
    const templateLabels = {
        hero: dictionary?.template?.hero,
        landing: dictionary?.template?.landing,
        dashboard: dictionary?.template?.dashboard,
        ecommerce: dictionary?.template?.ecommerce,
        blog: dictionary?.template?.blog,
        portfolio: dictionary?.template?.portfolio,
        components: dictionary?.template?.components,
    };

    return (
        <>
            <Hero dictionary={dictionary} params={params} />
            <div className="py-3 border-b-[0.5px]">
                <div className="rtl:text-right">
                    <TemplatesNav />
                </div>
            </div>

            <div>
                {FEATURED_TEMPLATES.map((template) => (
                    <div
                        key={template}
                        className="border-grid  border-b py-8 first:pt-10 -mr-3 last:border-b-0 md:py-12"
                    >
                        <TemplateDisplay name={template} />
                    </div>
                ))}
                <div className="container-wrapper">
                    <div className="container flex justify-center py-6">
                        <Button asChild variant="outline">
                            <Link href="/templates">Browse all templates</Link>
                        </Button>
                    </div>
                </div>
            </div>

        </>
    );
}