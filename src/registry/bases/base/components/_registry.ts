import { type Registry } from "shadcn/schema"

// Atoms — codebase's equivalent of shadcn components. Sources stay in
// src/components/atom (the databayt hierarchy); paths resolve from src/.

export const components: Registry["items"] = [
  {
    name: "activity-goal",
    title: "Activity Goal",
    description: "Activity goal tracking card with chart visualization",
    type: "registry:component",
    dependencies: ["recharts"],
    registryDependencies: ["button", "card", "chart"],
    files: [
      {
        path: "components/atom/activity-goal.tsx",
        type: "registry:component",
      },
    ],
    categories: ["display", "data"],
  },
  {
    name: "calendar",
    title: "Calendar",
    description: "Interactive calendar card component",
    type: "registry:component",
    registryDependencies: ["card", "calendar"],
    files: [
      {
        path: "components/atom/calendar.tsx",
        type: "registry:component",
      },
    ],
    categories: ["display", "interactive"],
  },
  {
    name: "chat",
    title: "Chat",
    description:
      "Composable chat primitives with context-based state management",
    type: "registry:component",
    registryDependencies: ["card", "avatar", "input", "button"],
    files: [
      {
        path: "components/atom/chat.tsx",
        type: "registry:component",
      },
    ],
    categories: ["display", "interactive"],
  },
  {
    name: "data-table",
    title: "Data Table",
    description:
      "Composable data table primitives with sorting, filtering, and pagination",
    type: "registry:component",
    dependencies: ["@tanstack/react-table"],
    registryDependencies: ["card", "table", "button", "input", "dropdown-menu"],
    files: [
      {
        path: "components/atom/data-table.tsx",
        type: "registry:component",
      },
    ],
    categories: ["data", "display"],
  },
  {
    name: "metric",
    title: "Metric",
    description: "Metric display card with progress indicator",
    type: "registry:component",
    registryDependencies: ["card", "progress"],
    files: [
      {
        path: "components/atom/metric.tsx",
        type: "registry:component",
      },
    ],
    categories: ["data", "display"],
  },
  {
    name: "report-issue",
    title: "Report Issue",
    description: "Issue reporting form card",
    type: "registry:component",
    registryDependencies: [
      "card",
      "button",
      "input",
      "label",
      "select",
      "textarea",
    ],
    files: [
      {
        path: "components/atom/report-issue.tsx",
        type: "registry:component",
      },
    ],
    categories: ["form"],
  },
  {
    name: "share",
    title: "Share",
    description: "Social sharing card with multiple platforms",
    type: "registry:component",
    registryDependencies: ["card", "button", "input", "separator"],
    files: [
      {
        path: "components/atom/share.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ui", "interactive"],
  },
  {
    name: "stats",
    title: "Stats",
    description: "Statistics overview card with multiple metrics",
    type: "registry:component",
    dependencies: ["recharts"],
    registryDependencies: ["card", "chart"],
    files: [
      {
        path: "components/atom/stats.tsx",
        type: "registry:component",
      },
    ],
    categories: ["data", "display"],
  },
  {
    name: "team-member",
    title: "Team Member",
    description: "Composable team member primitives with role management",
    type: "registry:component",
    registryDependencies: ["card", "button", "avatar", "popover", "command"],
    files: [
      {
        path: "components/atom/team-member.tsx",
        type: "registry:component",
      },
    ],
    categories: ["display", "form"],
  },
  {
    name: "ai-prompt-input",
    title: "Ai Prompt Input",
    description:
      "AI-powered prompt input component with suggestions and completions",
    type: "registry:component",
    registryDependencies: ["button", "textarea"],
    files: [
      {
        path: "components/atom/ai/ai-prompt-input.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ai", "form"],
  },
  {
    name: "ai-status-indicator",
    title: "Ai Status Indicator",
    description: "Visual indicator for AI processing states",
    type: "registry:component",
    files: [
      {
        path: "components/atom/ai/ai-status-indicator.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ai", "feedback"],
  },
  {
    name: "ai-streaming-text",
    title: "Ai Streaming Text",
    description: "Streaming text animation for AI responses",
    type: "registry:component",
    files: [
      {
        path: "components/atom/ai/ai-streaming-text.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ai", "display"],
  },
  {
    name: "ai-response-display",
    title: "Ai Response Display",
    description: "Display AI responses with markdown and code highlighting",
    type: "registry:component",
    registryDependencies: ["card"],
    files: [
      {
        path: "components/atom/ai-response-display.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ai", "display"],
  },
  {
    name: "prompt-input",
    title: "Prompt Input",
    description:
      "Advanced prompt input with keyboard shortcuts and suggestions",
    type: "registry:component",
    registryDependencies: ["button", "textarea"],
    files: [
      {
        path: "components/atom/prompt-input.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ai", "form"],
  },
  {
    name: "response",
    title: "Response",
    description: "Response container with formatting and actions",
    type: "registry:component",
    files: [
      {
        path: "components/atom/response.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ai", "display"],
  },
  {
    name: "reasoning",
    title: "Reasoning",
    description: "Display reasoning steps and thought processes",
    type: "registry:component",
    files: [
      {
        path: "components/atom/reasoning.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ai", "display"],
  },
  {
    name: "card",
    title: "Card",
    description: "Enhanced card component with hover effects",
    type: "registry:component",
    registryDependencies: ["card"],
    files: [
      {
        path: "components/atom/card.tsx",
        type: "registry:component",
      },
    ],
    categories: ["display", "layout"],
  },
  {
    name: "card-hover-effect",
    title: "Card Hover Effect",
    description: "Card with animated hover effects and transitions",
    type: "registry:component",
    files: [
      {
        path: "components/atom/card-hover-effect.tsx",
        type: "registry:component",
      },
    ],
    categories: ["display", "animation"],
  },
  {
    name: "cards-metric",
    title: "Cards Metric",
    description: "Metric display cards with statistics",
    type: "registry:component",
    registryDependencies: ["card"],
    files: [
      {
        path: "components/atom/cards-metric.tsx",
        type: "registry:component",
      },
    ],
    categories: ["display", "data"],
  },
  {
    name: "gradient-animation",
    title: "Gradient Animation",
    description: "Animated gradient background effect",
    type: "registry:component",
    files: [
      {
        path: "components/atom/gradient-animation.tsx",
        type: "registry:component",
      },
    ],
    categories: ["animation", "display"],
  },
  {
    name: "infinite-cards",
    title: "Infinite Cards",
    description: "Infinite scrolling card carousel",
    type: "registry:component",
    files: [
      {
        path: "components/atom/infinite-cards.tsx",
        type: "registry:component",
      },
    ],
    categories: ["animation", "display"],
  },
  {
    name: "infinite-slider",
    title: "Infinite Slider",
    description: "Infinite auto-scrolling slider with smooth animations",
    type: "registry:component",
    files: [
      {
        path: "components/atom/infinite-slider.tsx",
        type: "registry:component",
      },
    ],
    categories: ["animation", "display"],
  },
  {
    name: "progressive-blur",
    title: "Progressive Blur",
    description: "Progressive blur effect for images and backgrounds",
    type: "registry:component",
    files: [
      {
        path: "components/atom/progressive-blur.tsx",
        type: "registry:component",
      },
    ],
    categories: ["animation", "display"],
  },
  {
    name: "sticky-scroll",
    title: "Sticky Scroll",
    description: "Sticky scroll reveal animation",
    type: "registry:component",
    files: [
      {
        path: "components/atom/sticky-scroll.tsx",
        type: "registry:component",
      },
    ],
    categories: ["animation", "display"],
  },
  {
    name: "simple-marquee",
    title: "Simple Marquee",
    description: "Simple auto-scrolling marquee component",
    type: "registry:component",
    files: [
      {
        path: "components/atom/simple-marquee.tsx",
        type: "registry:component",
      },
    ],
    categories: ["animation", "display"],
  },
  {
    name: "oauth-button",
    title: "Oauth Button",
    description: "Single OAuth button with provider icon",
    type: "registry:component",
    registryDependencies: ["button", "icons"],
    files: [
      {
        path: "components/atom/oauth-button.tsx",
        type: "registry:component",
      },
    ],
    categories: ["form", "authentication"],
  },
  {
    name: "oauth-button-group",
    title: "Oauth Button Group",
    description: "Grid of OAuth buttons for multiple providers",
    type: "registry:component",
    registryDependencies: ["oauth-button"],
    files: [
      {
        path: "components/atom/oauth-button-group.tsx",
        type: "registry:component",
      },
    ],
    categories: ["form", "authentication"],
  },
  {
    name: "divider-with-text",
    title: "Divider With Text",
    description: "Horizontal divider with centered text label",
    type: "registry:component",
    files: [
      {
        path: "components/atom/divider-with-text.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ui", "layout"],
  },
  {
    name: "user-info-card",
    title: "User Info Card",
    description: "User avatar with name and email display",
    type: "registry:component",
    registryDependencies: ["avatar"],
    files: [
      {
        path: "components/atom/user-info-card.tsx",
        type: "registry:component",
      },
    ],
    categories: ["display", "user"],
  },
  {
    name: "settings-toggle-row",
    title: "Settings Toggle Row",
    description: "Settings row with label, description, and toggle switch",
    type: "registry:component",
    registryDependencies: ["switch", "label"],
    files: [
      {
        path: "components/atom/settings-toggle-row.tsx",
        type: "registry:component",
      },
    ],
    categories: ["form", "settings"],
  },
  {
    name: "form-field",
    title: "Form Field",
    description: "Form field primitives with label and input",
    type: "registry:component",
    registryDependencies: ["input", "label"],
    files: [
      {
        path: "components/atom/form-field.tsx",
        type: "registry:component",
      },
    ],
    categories: ["form", "input"],
  },
  {
    name: "payment-method-selector",
    title: "Payment Method Selector",
    description: "Payment method radio selector with icons",
    type: "registry:component",
    registryDependencies: ["radio-group", "label", "icons"],
    files: [
      {
        path: "components/atom/payment-method-selector.tsx",
        type: "registry:component",
      },
    ],
    categories: ["form", "payment"],
  },
  {
    name: "faceted",
    title: "Faceted",
    description: "Faceted filter component for data tables",
    type: "registry:component",
    registryDependencies: [
      "button",
      "popover",
      "checkbox",
      "separator",
      "badge",
    ],
    files: [
      {
        path: "components/atom/faceted.tsx",
        type: "registry:component",
      },
    ],
    categories: ["form", "interactive"],
  },
  {
    name: "sortable",
    title: "Sortable",
    description: "Drag-and-drop sortable list component",
    type: "registry:component",
    dependencies: ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities"],
    files: [
      {
        path: "components/atom/sortable.tsx",
        type: "registry:component",
      },
    ],
    categories: ["interactive", "form"],
  },
  {
    name: "expand-button",
    title: "Expand Button",
    description: "Expandable button with reveal animation",
    type: "registry:component",
    registryDependencies: ["button"],
    files: [
      {
        path: "components/atom/expand-button.tsx",
        type: "registry:component",
      },
    ],
    categories: ["interactive", "ui"],
  },
  {
    name: "header-section",
    title: "Header Section",
    description: "Reusable header section component",
    type: "registry:component",
    files: [
      {
        path: "components/atom/header-section.tsx",
        type: "registry:component",
      },
    ],
    categories: ["layout", "navigation"],
  },
  {
    name: "page-actions",
    title: "Page Actions",
    description: "Page-level action buttons container",
    type: "registry:component",
    registryDependencies: ["button"],
    files: [
      {
        path: "components/atom/page-actions.tsx",
        type: "registry:component",
      },
    ],
    categories: ["layout", "navigation"],
  },
  {
    name: "page-header",
    title: "Page Header",
    description: "Consistent page header with breadcrumbs",
    type: "registry:component",
    files: [
      {
        path: "components/atom/page-header.tsx",
        type: "registry:component",
      },
    ],
    categories: ["layout", "navigation"],
  },
  {
    name: "tabs",
    title: "Tabs",
    description: "Enhanced tabs component with animations",
    type: "registry:component",
    registryDependencies: ["tabs"],
    files: [
      {
        path: "components/atom/tabs.tsx",
        type: "registry:component",
      },
    ],
    categories: ["navigation", "ui"],
  },
  {
    name: "modal-system",
    title: "Modal System",
    description: "Complete modal system with carousel and steps",
    type: "registry:component",
    registryDependencies: ["dialog", "button"],
    files: [
      {
        path: "components/atom/modal/carousel.tsx",
        type: "registry:component",
      },
      {
        path: "components/atom/modal/context.tsx",
        type: "registry:component",
      },
      {
        path: "components/atom/modal/indicator.tsx",
        type: "registry:component",
      },
      {
        path: "components/atom/modal/modal.tsx",
        type: "registry:component",
      },
      {
        path: "components/atom/modal/route-modal.tsx",
        type: "registry:component",
      },
      {
        path: "components/atom/modal/step.ts",
        type: "registry:component",
      },
      {
        path: "components/atom/modal/type.ts",
        type: "registry:component",
      },
      {
        path: "components/atom/modal/ui.tsx",
        type: "registry:component",
      },
    ],
    categories: ["modal", "dialog"],
  },
  {
    name: "loading",
    title: "Loading",
    description: "Loading spinner and skeleton components",
    type: "registry:component",
    files: [
      {
        path: "components/atom/loading.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ui", "feedback"],
  },
  {
    name: "announcement",
    title: "Announcement",
    description: "Announcement banner component",
    type: "registry:component",
    files: [
      {
        path: "components/atom/announcement.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ui", "feedback"],
  },
  {
    name: "two-buttons",
    title: "Two Buttons",
    description: "Dual button group component",
    type: "registry:component",
    registryDependencies: ["button"],
    files: [
      {
        path: "components/atom/two-buttons.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ui", "interactive"],
  },
  {
    name: "agent-heading",
    title: "Agent Heading",
    description: "Agent conversation heading component",
    type: "registry:component",
    files: [
      {
        path: "components/atom/agent-heading.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ui", "display"],
  },
  {
    name: "theme-provider",
    title: "Theme Provider",
    description: "Theme provider wrapper component",
    type: "registry:component",
    dependencies: ["next-themes"],
    files: [
      {
        path: "components/atom/theme-provider.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ui", "utility"],
  },
  {
    name: "icons",
    title: "Icons",
    description: "Comprehensive icon library",
    type: "registry:component",
    dependencies: ["lucide-react"],
    files: [
      {
        path: "components/atom/icons.tsx",
        type: "registry:component",
      },
    ],
    categories: ["ui", "utility"],
  },
  {
    name: "fonts",
    title: "Fonts",
    description: "Font configuration utilities",
    type: "registry:component",
    dependencies: ["next/font/google"],
    files: [
      {
        path: "components/atom/fonts.ts",
        type: "registry:component",
      },
    ],
    categories: ["ui", "utility"],
  },
  {
    name: "button-group",
    title: "Button Group",
    description:
      "Horizontal or vertical group of related buttons with shared styling",
    type: "registry:component",
    registryDependencies: ["button"],
    files: [
      {
        path: "components/atom/button-group.tsx",
        type: "registry:component",
      },
    ],
    categories: ["interactive", "form"],
  },
  {
    name: "card-form",
    title: "Card Form",
    description: "Card shell for forms with header, content and footer slots",
    type: "registry:component",
    registryDependencies: ["card"],
    files: [
      {
        path: "components/atom/card-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["form", "card"],
  },
  {
    name: "labeled-input",
    title: "Labeled Input",
    description: "Input with attached label, hint and error message",
    type: "registry:component",
    registryDependencies: ["label", "input"],
    files: [
      {
        path: "components/atom/labeled-input.tsx",
        type: "registry:component",
      },
    ],
    categories: ["form"],
  },
  {
    name: "labeled-select",
    title: "Labeled Select",
    description: "Select with attached label, hint and error message",
    type: "registry:component",
    registryDependencies: ["label", "select"],
    files: [
      {
        path: "components/atom/labeled-select.tsx",
        type: "registry:component",
      },
    ],
    categories: ["form"],
  },
  {
    name: "labeled-textarea",
    title: "Labeled Textarea",
    description: "Textarea with attached label, hint and error message",
    type: "registry:component",
    registryDependencies: ["label", "textarea"],
    files: [
      {
        path: "components/atom/labeled-textarea.tsx",
        type: "registry:component",
      },
    ],
    categories: ["form"],
  },
  {
    name: "site-heading",
    title: "Site Heading",
    description: "Site section heading with title and description lockup",
    type: "registry:component",
    files: [
      {
        path: "components/atom/site-heading.tsx",
        type: "registry:component",
      },
    ],
    categories: ["display", "layout"],
  },
]
