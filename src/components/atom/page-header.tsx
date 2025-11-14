import { cn } from "@/lib/utils"
import React from "react"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string | React.ReactNode
  description?: string | React.ReactNode
  actions?: React.ReactNode
  announcement?: React.ReactNode
  headingClassName?: string
  descriptionClassName?: string
  actionsClassName?: string
  announcementClassName?: string
}

export function PageHeader({
  className,
  heading,
  description,
  actions,
  announcement,
  headingClassName,
  descriptionClassName,
  actionsClassName,
  announcementClassName,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <section className={cn("border-grid", className)} {...props}>
      <div className="container-wrapper">
        <div className="container flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
          {announcement && (
            <div className={cn(announcementClassName)}>
              {announcement}
            </div>
          )}
          {heading && (
            <h1
              className={cn(
                "text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter",
                headingClassName
              )}
            >
              {heading}
            </h1>
          )}
          {description && (
            <p
              className={cn(
                "text-foreground max-w-3xl text-base text-balance sm:text-lg",
                descriptionClassName
              )}
            >
              {description}
            </p>
          )}
          {actions && (
            <div
              className={cn(
                "flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none",
                actionsClassName
              )}
            >
              {actions}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}