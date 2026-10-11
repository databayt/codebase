import { Suspense } from 'react';
import Hero from './hero';
import ArtsGallery from './gallery';
import type { ArtsView } from './resolve';
import type { getDictionary } from '@/components/local/dictionaries';
import type { Locale } from '@/components/local/config';

interface ArtsContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  params: { lang: Locale };
  view: ArtsView;
}

export default function ArtsContent({ dictionary, params, view }: ArtsContentProps) {
    return (
        <div className="px-responsive lg:px-0">
            <Hero dictionary={dictionary} params={params} />
            {/* The gallery reads ?q= (Spotlight hands it a filename), so it needs a Suspense boundary to prerender. */}
            <Suspense>
                <ArtsGallery
                    key={[view.facet.slug, view.folder].join('/')}
                    lang={params.lang}
                    view={view}
                />
            </Suspense>
        </div>
    );
}
