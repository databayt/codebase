"use client";

import * as React from "react";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";

import { Icons } from "@/components/tablecn/components/icons";
import { DocsLink } from "@/components/tablecn/components/docs-link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/components/tablecn/config/site";
import { useMetaColor } from "@/hooks/use-meta-color";
import { META_THEME_COLORS } from "@/components/template/header-01/constants";

function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const { setMetaColor } = useMetaColor();

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    );
  }, [resolvedTheme, setTheme, setMetaColor]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="group/toggle extend-touch-target size-8"
      onClick={toggleTheme}
      title="Toggle theme"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4.5"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 3l0 18" />
        <path d="M12 9l4.65 -4.65" />
        <path d="M12 14.3l7.37 -7.37" />
        <path d="M12 19.6l8.85 -8.85" />
      </svg>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function SiteHeader() {
  const params = useParams();
  const lang = params.lang as string;

  return (
    <header className="bg-background sticky top-0 z-50 w-full">
      <div className="container-wrapper px-3 lg:px-0">
        <div className="flex h-(--header-height) items-center **:data-[slot=separator]:!h-4">
          <Link href={`/${lang}/tablecn`} className="flex items-center gap-1.5 me-6">
            <LayoutGrid className="size-5" aria-hidden="true" />
            <span className="hidden font-bold md:inline-block">
              {siteConfig.name}
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href={`/${lang}/tablecn/data-grid`}
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              Data Grid
            </Link>
            <DocsLink />
          </nav>
          <div className="ms-auto flex items-center gap-2">
            <Separator orientation="vertical" />
            <Button variant="ghost" size="icon" className="size-8" asChild>
              <Link
                aria-label="GitHub repo"
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icons.gitHub className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
