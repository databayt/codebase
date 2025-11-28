"use client";

import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Icons } from "@/components/tablecn/components/icons";
import { DocsLink } from "@/components/tablecn/components/docs-link";
import { ModeToggle } from "@/components/tablecn/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/components/tablecn/config/site";

export function SiteHeader() {
  const params = useParams();
  const lang = params.lang as string;

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href={`/${lang}/tablecn`} className="mr-2 flex items-center md:mr-6 md:space-x-2">
          <LayoutGrid className="size-4" aria-hidden="true" />
          <span className="hidden font-bold md:inline-block">
            {siteConfig.name}
          </span>
        </Link>
        <nav className="flex w-full items-center gap-6 text-sm">
          <Link
            href={`/${lang}/tablecn/data-grid`}
            className="text-foreground/60 transition-colors hover:text-foreground"
          >
            Data Grid
          </Link>
          <DocsLink />
        </nav>
        <nav className="flex flex-1 items-center md:justify-end">
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
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
