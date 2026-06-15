import Hero from './hero';
import ArtsGallery from './gallery';
import manifestData from "@/registry/cdn-manifest.json";
import { type CdnManifest } from "@/lib/cdn";
import type { getDictionary } from '@/components/local/dictionaries';
import type { Locale } from '@/components/local/config';

const manifest = manifestData as CdnManifest;

interface ArtsContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  params: { lang: Locale };
}

export default function ArtsContent({ dictionary, params }: ArtsContentProps) {
    return (
        <div className="px-responsive lg:px-0">
            <Hero dictionary={dictionary} params={params} />
            <ArtsGallery
                assets={manifest.assets}
                urlBase={manifest.urlBase ?? ""}
                source={manifest.source}
                domain={manifest.domain}
            />
        </div>
    );
}
