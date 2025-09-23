import { type Registry } from "./registry"

export const ui: Registry["items"] = [
  {
    name: "button",
    type: "registry:ui",
    files: ["ui/button.tsx"],
  },
  {
    name: "card",
    type: "registry:ui",
    files: ["ui/card.tsx"],
  },
  {
    name: "input",
    type: "registry:ui",
    files: ["ui/input.tsx"],
  },
  {
    name: "label",
    type: "registry:ui",
    files: ["ui/label.tsx"],
  },
  {
    name: "sidebar",
    type: "registry:ui",
    files: ["ui/sidebar.tsx"],
  },
  {
    name: "scroll-area",
    type: "registry:ui",
    files: ["ui/scroll-area.tsx"],
  },
  {
    name: "navigation-menu",
    type: "registry:ui",
    files: ["ui/navigation-menu.tsx"],
  },
  {
    name: "sheet",
    type: "registry:ui",
    files: ["ui/sheet.tsx"],
  },
  {
    name: "select",
    type: "registry:ui",
    files: ["ui/select.tsx"],
  },
  {
    name: "tabs",
    type: "registry:ui",
    files: ["ui/tabs.tsx"],
  },
]