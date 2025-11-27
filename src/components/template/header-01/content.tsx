import Link from "next/link"

import { docsSource } from "@/lib/source"
import { siteConfig } from "./constants"
import { CommandMenu } from "./command-menu"
import { Icons } from "@/components/atom/icons"
import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"
import { ModeSwitcher } from "./mode-switcher"
import { LangSwitcher } from "./lang-switcher"
import { GitHubLink } from "./github-link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { getDictionary } from "@/components/local/dictionaries"

const NAV_ITEMS = [
    { href: "/docs", label: "Docs" },
    { href: "/atoms", label: "Atoms" },
    { href: "/templates", label: "Templates" },
    { href: "/blocks", label: "Blocks" },
    { href: "/micros", label: "Micros" },
    { href: "/vibes", label: "Vibes" },
]

interface SiteHeaderProps {
    dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export function SiteHeader({ dictionary }: SiteHeaderProps) {
    const pageTree = docsSource.pageTree

    return (
        <header className="bg-background sticky top-0 z-50 w-full">
            <div className="container-wrapper 3xl:fixed:px-0 px-6">
                <div className="3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:!h-4">
                    <MobileNav
                        tree={pageTree}
                        items={NAV_ITEMS}
                        className="flex lg:hidden"
                    />
                    <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="hidden size-8 lg:flex"
                    >
                        <Link href="/">
                            <Icons.logo className="size-5" />
                            <span className="sr-only">{siteConfig.name}</span>
                        </Link>
                    </Button>
                    <MainNav dictionary={dictionary} className="hidden lg:flex" />
                    <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
                        <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
                            <CommandMenu dictionary={dictionary} />
                        </div>
                        <Separator
                            orientation="vertical"
                            className="ml-2 hidden lg:block"
                        />
                        <GitHubLink />
                        <Separator orientation="vertical" />
                        <LangSwitcher />
                        <ModeSwitcher />
                    </div>
                </div>
            </div>
        </header>
    )
}
