import type { Metadata } from "next";
import "../globals.css";
import { fontSans, fontMono, fontRubik, fontVariables } from "@/components/atom/fonts";
import { getDictionary } from "@/components/local/dictionaries";
import { type Locale, localeConfig } from "@/components/local/config";
import { ThemeProvider } from "@/components/atom/theme-provider"
import { cn } from "@/lib/utils"
import { headers } from "next/headers"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params as { lang: Locale };
  const dictionary = await getDictionary(lang);
  const config = localeConfig[lang];

  return {
    title: dictionary.metadata?.title || "Codebase",
    description: dictionary.metadata?.description || "Codebase for business automation",
    other: {
      'accept-language': lang,
    },
    alternates: {
      languages: {
        'en': '/en',
        'ar': '/ar',
        'x-default': '/en',
      },
    },
  };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params as { lang: Locale };

    // Get the pathname to check if we're in a view route
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    const isViewRoute = pathname.includes('/view/templates/');

    // Fallback to default locale if config not found
    const config = localeConfig[lang] || localeConfig['en'];
    const isRTL = config.dir === 'rtl';
    const dictionary = await getDictionary(lang || 'en');

    // Use Rubik font for Arabic, Geist for English
    const fontClass = lang === 'ar' ? fontRubik.className : fontSans.className;

    return (
        <html lang={lang} dir={config.dir} suppressHydrationWarning>
            <body className={cn(fontClass, fontVariables, "group/body overscroll-none antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]")} suppressHydrationWarning>
                <ThemeProvider>
                    <div className={isViewRoute ? "" : "layout-container"}>
                        {children}
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return Object.keys(localeConfig).map((lang) => ({ lang }));
}
