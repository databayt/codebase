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
    <section className={cn("border-grid border-b-[0.5px]", className)} {...props}>
      <div className="flex flex-col items-start gap-1 py-8 md:py-10 lg:py-12">
        {announcement && (
          <div className={cn(announcementClassName)}>
            {announcement}
          </div>
        )}
        {heading && (
          <h2
            className={cn(
              headingClassName
            )}
          >
            {heading}
          </h2>
        )}
        {description && (
          <p
            className={cn(
              "max-w-2xl text-balance text-base font-light text-foreground leading-7 sm:text-lg ",
              descriptionClassName
            )}
          >
            {description}
          </p>
        )}
        {actions && (
          <div
            className={cn(
              "flex w-full items-center justify-start gap-2 pt-2",
              actionsClassName
            )}
          >
            {actions}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

// Subcomponents for composition-based usage (backward compatibility)
export function PageHeaderHeading({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tight",
        className
      )}
      {...props}
    />
  )
}

export function PageHeaderDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "max-w-2xl text-balance text-base font-light text-foreground leading-7 sm:text-lg",
        className
      )}
      {...props}
    />
  )
}

export function PageActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-start gap-2 pt-2",
        className
      )}
      {...props}
    />
  )
}
