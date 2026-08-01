import { RegistryItem } from "./schema"

// New upstream primitives published through our registry so
// `npx codebase add <name>` can install them. The full ui/ tree is
// intentionally not republished here — these are the additions beyond the
// long-standing set.
export const uiItems: RegistryItem[] = [
  {
    name: "combobox",
    description: "Autocomplete input and command palette with a list of suggestions.",
    type: "registry:ui",
    dependencies: ["radix-ui"],
    registryDependencies: ["command", "popover"],
    files: [{ path: "components/ui/combobox.tsx", type: "registry:ui" }],
  },
  {
    name: "native-select",
    description: "Styled native select element for simple forms.",
    type: "registry:ui",
    files: [{ path: "components/ui/native-select.tsx", type: "registry:ui" }],
  },
  {
    name: "direction",
    description: "Direction provider for RTL/LTR-aware primitives.",
    type: "registry:ui",
    dependencies: ["radix-ui"],
    files: [{ path: "components/ui/direction.tsx", type: "registry:ui" }],
  },
  {
    name: "attachment",
    description: "Attachment display for chat and upload interfaces.",
    type: "registry:ui",
    files: [{ path: "components/ui/attachment.tsx", type: "registry:ui" }],
  },
  {
    name: "bubble",
    description: "Chat bubble container for conversational interfaces.",
    type: "registry:ui",
    files: [{ path: "components/ui/bubble.tsx", type: "registry:ui" }],
  },
  {
    name: "marker",
    description: "Inline marker for annotating chat and document content.",
    type: "registry:ui",
    files: [{ path: "components/ui/marker.tsx", type: "registry:ui" }],
  },
  {
    name: "message",
    description: "Message row with avatar, content and actions for chat UIs.",
    type: "registry:ui",
    files: [{ path: "components/ui/message.tsx", type: "registry:ui" }],
  },
  {
    name: "message-scroller",
    description: "Auto-scrolling viewport for streaming chat messages.",
    type: "registry:ui",
    files: [{ path: "components/ui/message-scroller.tsx", type: "registry:ui" }],
  },
]
