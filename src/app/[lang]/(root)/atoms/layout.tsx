import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AtomsSidebar } from "@/components/template/sidebar-01/atoms-content"
import "../../../globals.css"

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
