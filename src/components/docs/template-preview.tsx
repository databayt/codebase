import { BlockDisplay } from "@/components/docs/block-display"

// MDX-facing wrapper: renders a template's viewer (preview + code) inside
// docs pages, the same BlockDisplay the /templates grids use.
export function TemplatePreview({ name }: { name: string }) {
  return <BlockDisplay name={name} />
}
