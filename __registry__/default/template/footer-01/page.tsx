import { SiteFooter } from "./content"

export default function FooterTemplate() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Footer Template</h1>
        <p className="text-muted-foreground mb-8">
          A simple footer component with links and copyright information.
        </p>
        <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Page content goes here</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}