import { ThemeProvider } from "@/components/atom/theme-provider"

export default function ThemeProviderDemo() {
  return (
    <>
      <ThemeProvider>
        <p className="text-sm text-muted-foreground">
          Wrap your app in ThemeProvider to enable dark mode.
        </p>
      </ThemeProvider>
    </>
  )
}
