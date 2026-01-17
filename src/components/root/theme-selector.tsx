"use client"

import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const THEMES = [
  { name: "neutral", label: "Neutral" },
  { name: "zinc", label: "Zinc" },
  { name: "slate", label: "Slate" },
  { name: "stone", label: "Stone" },
  { name: "gray", label: "Gray" },
]

export function ThemeSelector({ className }: React.ComponentProps<"div">) {
  const { theme, setTheme } = useTheme()

  // For now, we'll use a simple dark/light toggle since full theme switching
  // would require additional CSS variables setup
  const currentMode = theme === "dark" ? "dark" : "light"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Label htmlFor="theme-selector" className="sr-only">
        Theme
      </Label>
      <Select value="neutral" onValueChange={() => {}}>
        <SelectTrigger
          id="theme-selector"
          className="bg-secondary text-secondary-foreground border-secondary h-8 justify-start shadow-none w-auto"
        >
          <span className="font-medium">Theme:</span>
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent align="end">
          {THEMES.map((t) => (
            <SelectItem
              key={t.name}
              value={t.name}
              className="data-[state=checked]:opacity-50"
            >
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
