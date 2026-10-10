"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { DirectionProvider } from "@/components/ui/direction"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DirectionPreview() {
  const [dir, setDir] = React.useState<"ltr" | "rtl">("ltr")

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDir((d) => (d === "ltr" ? "rtl" : "ltr"))}
      >
        Direction: {dir.toUpperCase()}
      </Button>
      <DirectionProvider direction={dir}>
        <div dir={dir} className="rounded-lg border p-6">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="secondary" />}>
              {dir === "rtl" ? "افتح القائمة" : "Open menu"}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                {dir === "rtl" ? "الملف الشخصي" : "Profile"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {dir === "rtl" ? "الإعدادات" : "Settings"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {dir === "rtl" ? "تسجيل الخروج" : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DirectionProvider>
    </div>
  )
}
