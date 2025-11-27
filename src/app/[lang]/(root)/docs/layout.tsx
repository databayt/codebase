import { docsSource } from "@/lib/source"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { DocsMobileToggle } from "@/components/docs/docs-mobile-toggle"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import "../../../globals.css"

interface DocsLayoutProps {
    children: React.ReactNode
    params: Promise<{ lang: string }>
}

export default async function DocsLayout({ children, params }: DocsLayoutProps) {
    const { lang } = await params

    return (
        <div
            className="container-wrapper flex flex-1 flex-col"
            dir="ltr"
            lang="en"
            style={{
                "--header-height": "3.5rem", // 56px - height of the header (h-14)
                "--footer-height": "0px", // We'll use a different approach for footer
            } as React.CSSProperties}
        >
            <SidebarProvider
                className="3xl:fixed:container 3xl:fixed:px-3 min-h-min flex-1 items-start pb-24 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)]"
                defaultOpen={true}
            >
                <DocsSidebar tree={docsSource.pageTree} />
                <SidebarInset>
                    <div className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background px-4 lg:hidden">
                        <DocsMobileToggle />
                        <span className="font-semibold">Documentation</span>
                    </div>
                    <div className="h-full w-full pb-8">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
} 