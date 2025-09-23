import SidebarContent from "./content"

export default function SidebarTemplate() {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r">
        <SidebarContent />
      </div>
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Sidebar Navigation Template</h1>
        <p className="text-muted-foreground">
          This is a documentation-style sidebar with collapsible navigation and search functionality.
        </p>
      </div>
    </div>
  )
}