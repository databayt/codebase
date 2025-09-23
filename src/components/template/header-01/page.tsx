import { SiteHeader } from "./content"

export default function HeaderTemplate() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Header Navigation Template</h1>
        <p className="text-muted-foreground">
          A responsive header with main navigation, mobile menu, command menu, and theme/language switchers.
        </p>
      </main>
    </div>
  )
}