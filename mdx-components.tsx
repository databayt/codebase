import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ComponentPreview } from "@/components/docs/component-preview"
import { ComponentSource } from "@/components/docs/component-source"
import { CodeTabs } from "@/components/docs/code-tabs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// This file is required to use MDX in `app` directory.
const mdxComponents = {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ className, ...props }) => (
      <h1
        className={cn(
          "font-heading mt-2 scroll-m-28 text-3xl font-bold tracking-tight",
          className
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => {
      return (
        <h2
          id={props.children
            ?.toString()
            .replace(/ /g, "-")
            .replace(/'/g, "")
            .replace(/\?/g, "")
            .toLowerCase()}
          className={cn(
            "font-heading mt-10 scroll-m-28 text-xl font-medium tracking-tight first:mt-0 lg:mt-16 [&+h3]:!mt-6 [&+p]:!mt-4",
            className
          )}
          {...props}
        />
      )
    },
    h3: ({ className, ...props }) => (
      <h3
        className={cn(
          "font-heading mt-12 scroll-m-28 text-lg font-medium tracking-tight [&+p]:!mt-4",
          className
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }) => (
      <h4
        className={cn(
          "font-heading mt-8 scroll-m-28 text-base font-medium tracking-tight",
          className
        )}
        {...props}
      />
    ),
    h5: ({ className, ...props }) => (
      <h5
        className={cn(
          "mt-8 scroll-m-28 text-base font-medium tracking-tight",
          className
        )}
        {...props}
      />
    ),
    h6: ({ className, ...props }) => (
      <h6
        className={cn(
          "mt-8 scroll-m-28 text-base font-medium tracking-tight",
          className
        )}
        {...props}
      />
    ),
    a: ({ className, ...props }) => (
      <a
        className={cn("font-medium underline underline-offset-4", className)}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p
        className={cn("leading-relaxed [&:not(:first-child)]:mt-6", className)}
        {...props}
      />
    ),
    strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong className={cn("font-medium", className)} {...props} />
    ),
    ul: ({ className, ...props }) => (
      <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
      <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }) => (
      <li className={cn("mt-2", className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn("mt-6 border-l-2 pl-6 italic", className)}
        {...props}
      />
    ),
    img: ({
      className,
      alt,
      ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img className={cn("rounded-md", className)} alt={alt} {...props} />
    ),
    hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
    table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="no-scrollbar my-6 w-full overflow-y-auto rounded-lg border">
        <table
          className={cn(
            "relative w-full overflow-hidden border-none text-sm [&_tbody_tr:last-child]:border-b-0",
            className
          )}
          {...props}
        />
      </div>
    ),
    tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr className={cn("m-0 border-b", className)} {...props} />
    ),
    th: ({ className, ...props }) => (
      <th
        className={cn(
          "px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }) => (
      <td
        className={cn(
          "px-4 py-2 text-left whitespace-nowrap [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    pre: ({ className, ...props }) => (
      <pre
        className={cn(
          "no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none",
          className
        )}
        {...props}
      />
    ),
    code: ({ className, ...props }) => (
      <code
        className={cn(
          "bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] break-words",
          className
        )}
        {...props}
      />
    ),
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    ComponentPreview,
    ComponentSource,
    CodeTabs,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Step: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <h3
        className={cn(
          "font-heading mt-8 scroll-m-32 text-xl font-medium tracking-tight",
          className
        )}
        {...props}
      />
    ),
    Steps: ({ ...props }) => (
      <div
        className="[&>h3]:step steps mb-12 [counter-reset:step] *:[h3]:first:!mt-0"
        {...props}
      />
    ),
}

export function useMDXComponents(components: Record<string, React.ComponentType<any>>): Record<string, React.ComponentType<any>> {
  return {
    ...mdxComponents,
    ...components,
  }
}

export { mdxComponents } 