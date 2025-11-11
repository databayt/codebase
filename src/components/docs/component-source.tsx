import * as React from "react"
import { highlightCode } from "@/lib/highlight-code"
import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/docs/copy-button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  code?: string
  language?: string
  fileName?: string
  collapsible?: boolean
}

export async function ComponentSource({
  code,
  language = "tsx",
  fileName,
  collapsible = true,
  className,
  ...props
}: ComponentSourceProps) {
  if (!code) {
    return null
  }

  const lang = language ?? fileName?.split(".").pop() ?? "tsx"
  const highlightedCode = await highlightCode(code, lang)

  if (!collapsible) {
    return (
      <div className={cn("relative", className)} {...props}>
        <ComponentCode
          code={code}
          highlightedCode={highlightedCode}
          language={lang}
          fileName={fileName}
        />
      </div>
    )
  }

  return (
    <Collapsible defaultOpen={!collapsible} className={cn("relative", className)} {...props}>
      <div className="flex items-center justify-between p-4 border-t">
        <h4 className="text-sm font-medium">Code</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <span className="data-[state=open]:hidden">View</span>
            <span className="hidden data-[state=open]:inline">Hide</span> code
            <ChevronDown className="h-4 w-4 transition-transform [[data-state=open]>&]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <ComponentCode
          code={code}
          highlightedCode={highlightedCode}
          language={lang}
          fileName={fileName}
        />
      </CollapsibleContent>
    </Collapsible>
  )
}

function ComponentCode({
  code,
  highlightedCode,
  language,
  fileName,
}: {
  code: string
  highlightedCode: string
  language: string
  fileName: string | undefined
}) {
  return (
    <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
      {fileName && (
        <figcaption
          data-rehype-pretty-code-title=""
          className="text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
          data-language={language}
        >
          {fileName}
        </figcaption>
      )}
      <CopyButton value={code} />
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  )
}
