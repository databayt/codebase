import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Home, Search, BookOpen } from "lucide-react"
import Link from "next/link"
import { AtomsSidebar } from "@/components/template/sidebar-01/atoms-content"
import { DocsThemeSwitcher } from "@/components/docs/docs-theme-switcher"
import "../../globals.css"

interface AtomsLayoutProps {
    children: React.ReactNode
    params: Promise<{ lang: string }>
}

export default async function AtomsLayout({ children, params }: AtomsLayoutProps) {
    const { lang } = await params
    return (
        <div dir="ltr" lang="en" className="font-inter">
            <SidebarProvider>
                <AtomsSidebar />
                <SidebarInset className="flex-1">
                    <header className="flex h-14 shrink-0 items-center gap-2 px-4">
                        <SidebarTrigger className="size-7" />
                        <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
                        <Button variant="ghost" size="icon" className="size-7" asChild>
                            <Link href={`/${lang}`}>
                                <Home className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
                        <Button variant="ghost" size="icon" className="size-7" asChild>
                            <Link href="/docs">
                                <BookOpen className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
                        <Button variant="ghost" size="icon" className="size-7">
                            <Search className="h-4 w-4" />
                        </Button>
                        <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
                        <DocsThemeSwitcher />
                    </header>
                    <div className="flex flex-1 flex-col">
                        <div className="layout-container w-full">
                            <main className="relative py-6 lg:gap-10 lg:pt-3 lg:pb-8">
                                {children}
                            </main>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}
