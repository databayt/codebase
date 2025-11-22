"use client"

export default function SidebarPage() {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-background">
        <div className="">
          <h2 className="text-lg font-semibold">Sidebar Navigation</h2>
        </div>
        <nav className="space-y-1 p-2">
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Dashboard
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Analytics
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Reports
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Settings
          </a>
        </nav>
      </div>
      <div className="flex-1 ">
        <h1 className="text-2xl font-bold">Main Content Area</h1>
        <p className="text-muted-foreground mt-2">
          This is a sidebar navigation template with collapsible menu items.
        </p>
      </div>
    </div>
  )
}