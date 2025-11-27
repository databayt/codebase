"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { OAuthButton, type OAuthProvider } from "./oauth-button"

export interface OAuthButtonGroupProps extends React.ComponentProps<"div"> {
  providers: OAuthProvider[]
  labels?: Partial<Record<OAuthProvider, string>>
  onProviderClick?: (provider: OAuthProvider) => void
}

export function OAuthButtonGroup({
  providers,
  labels,
  onProviderClick,
  className,
  ...props
}: OAuthButtonGroupProps) {
  return (
    <div
      data-slot="oauth-button-group"
      className={cn("grid grid-cols-2 gap-4", className)}
      {...props}
    >
      {providers.map((provider) => (
        <OAuthButton
          key={provider}
          provider={provider}
          label={labels?.[provider]}
          onClick={() => onProviderClick?.(provider)}
        />
      ))}
    </div>
  )
}
