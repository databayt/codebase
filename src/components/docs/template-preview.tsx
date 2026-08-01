import { TemplateDisplay } from "@/components/root/template/template-display"

// MDX-facing wrapper: renders a template's live iframe preview + code panel
// inside docs pages, mirroring what the /templates grids show.
export function TemplatePreview({ name }: { name: string }) {
  return <TemplateDisplay name={name} styleName="default" />
}
