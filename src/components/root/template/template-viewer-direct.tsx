"use client"

import * as React from "react"
import { getRegistryComponent } from "@/lib/registry"

interface TemplateViewerDirectProps {
  name: string
}

export function TemplateViewerDirect({ name }: TemplateViewerDirectProps) {
  const Component = getRegistryComponent(name, "default")

  if (!Component) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        Template not found
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <React.Suspense fallback={
        <div className="flex h-[400px] items-center justify-center text-muted-foreground">
          Loading...
        </div>
      }>
        <Component />
      </React.Suspense>
    </div>
  )
}