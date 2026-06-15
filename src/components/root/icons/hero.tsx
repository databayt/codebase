import { PageHeader } from '@/components/atom/page-header';
import { Announcement } from '@/components/atom/announcement';
import { TwoButtons } from '@/components/atom/two-buttons';
import type { getDictionary } from '@/components/local/dictionaries';
import type { Locale } from '@/components/local/config';

interface HeroProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  params: { lang: Locale };
}

export default function Hero({ dictionary, params }: HeroProps) {
    return (
        <PageHeader
            announcement={<Announcement dictionary={dictionary} />}
            heading={dictionary.iconpage?.heading || "Icons, logos & media"}
            description={dictionary.iconpage?.description || "Every asset on cdn.databayt.org — icons, logos, illustrations, and media — with flat, clean names. Copy a URL and drop it anywhere. One CDN for the whole org."}
            actions={
                <TwoButtons
                    primaryLabel={dictionary.actions?.browseIcons || "Browse assets"}
                    primaryHref={`/${params.lang}/icons`}
                    secondaryLabel={dictionary.actions?.iconDocs || "Read the docs"}
                    secondaryHref={`/${params.lang}/docs/cdn`}
                />
            }
        />
    );
}
