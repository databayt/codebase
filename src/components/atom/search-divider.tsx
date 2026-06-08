"use client"

import { cn } from "@/lib/utils"

interface SearchDividerProps {
  className?: string
  showTransition?: boolean
  isHidden?: boolean
}

export default function SearchDivider({
  className,
  showTransition = false,
  isHidden = false
}: SearchDividerProps) {
  return (
    <div
      className={cn(
        "w-px h-8 bg-[#e5e7eb]",
        showTransition && "transition-opacity duration-200",
        isHidden && "opacity-0",
        !isHidden && "opacity-100",
        className
      )}
    />
  )
} 