import { Registry } from "@/components/root/template/registry"

export const atoms: Registry["items"] = [
  // Card Components (from root/cards)
  {
    name: "activity-goal",
    type: "registry:atom",
    description: "Activity goal tracking card with chart visualization",
    categories: ["display", "data"],
    files: [
      {
        path: "components/atom/activity-goal.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["recharts"],
    registryDependencies: ["button", "card", "chart"],
  },
  {
    name: "calendar",
    type: "registry:atom",
    description: "Interactive calendar card component",
    categories: ["display", "interactive"],
    files: [
      {
        path: "components/atom/calendar.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["card", "calendar"],
  },
  {
    name: "chat",
    type: "registry:atom",
    description: "Composable chat primitives with context-based state management",
    categories: ["display", "interactive"],
    files: [
      {
        path: "components/atom/chat.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["card", "avatar", "input", "button"],
  },
  {
    name: "chat-demo",
    type: "registry:atom",
    description: "Demo chat interface with user picker dialog",
    categories: ["display", "interactive"],
    files: [
      {
        path: "components/atom/chat-demo.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["chat", "avatar", "button", "command", "dialog", "tooltip"],
  },
  {
    name: "cookie-settings",
    type: "registry:atom",
    description: "Cookie consent and settings management card",
    categories: ["form", "ui"],
    files: [
      {
        path: "components/atom/cookie-settings.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["card", "switch", "button"],
  },
  {
    name: "create-account",
    type: "registry:atom",
    description: "Account creation form card",
    categories: ["form", "authentication"],
    files: [
      {
        path: "components/atom/create-account.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["card", "button", "input", "label"],
  },
  {
    name: "data-table",
    type: "registry:atom",
    description: "Composable data table primitives with sorting, filtering, and pagination",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/data-table.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["@tanstack/react-table"],
    registryDependencies: ["card", "table", "button", "input", "dropdown-menu"],
  },
  {
    name: "data-table-demo",
    type: "registry:atom",
    description: "Demo data table with payment data and actions",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/data-table-demo.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["@tanstack/react-table"],
    registryDependencies: ["data-table", "checkbox", "dropdown-menu"],
  },
  {
    name: "metric",
    type: "registry:atom",
    description: "Metric display card with progress indicator",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/metric.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["card", "progress"],
  },
  {
    name: "payment-method",
    type: "registry:atom",
    description: "Payment method selection and management card",
    categories: ["form", "ui"],
    files: [
      {
        path: "components/atom/payment-method.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["card", "button", "input", "label", "radio-group", "select"],
  },
  {
    name: "report-issue",
    type: "registry:atom",
    description: "Issue reporting form card",
    categories: ["form"],
    files: [
      {
        path: "components/atom/report-issue.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["card", "button", "input", "label", "select", "textarea"],
  },
  {
    name: "share",
    type: "registry:atom",
    description: "Social sharing card with multiple platforms",
    categories: ["ui", "interactive"],
    files: [
      {
        path: "components/atom/share.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["card", "button", "input", "separator"],
  },
  {
    name: "stats",
    type: "registry:atom",
    description: "Statistics overview card with multiple metrics",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/stats.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["recharts"],
    registryDependencies: ["card", "chart"],
  },
  {
    name: "team-member",
    type: "registry:atom",
    description: "Composable team member primitives with role management",
    categories: ["display", "form"],
    files: [
      {
        path: "components/atom/team-member.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["card", "button", "avatar", "popover", "command"],
  },
  {
    name: "team-members-demo",
    type: "registry:atom",
    description: "Demo team members card with role selection",
    categories: ["display", "form"],
    files: [
      {
        path: "components/atom/team-members-demo.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["team-member"],
  },

  // AI Category
  {
    name: "ai-prompt-input",
    type: "registry:atom",
    description: "AI-powered prompt input component with suggestions and completions",
    categories: ["ai", "form"],
    files: [
      {
        path: "components/atom/ai/ai-prompt-input.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["button", "textarea"],
  },
  {
    name: "ai-status-indicator",
    type: "registry:atom",
    description: "Visual indicator for AI processing states",
    categories: ["ai", "feedback"],
    files: [
      {
        path: "components/atom/ai/ai-status-indicator.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "ai-streaming-text",
    type: "registry:atom",
    description: "Streaming text animation for AI responses",
    categories: ["ai", "display"],
    files: [
      {
        path: "components/atom/ai/ai-streaming-text.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "ai-response-display",
    type: "registry:atom",
    description: "Display AI responses with markdown and code highlighting",
    categories: ["ai", "display"],
    files: [
      {
        path: "components/atom/ai-response-display.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["card"],
  },
  {
    name: "prompt-input",
    type: "registry:atom",
    description: "Advanced prompt input with keyboard shortcuts and suggestions",
    categories: ["ai", "form"],
    files: [
      {
        path: "components/atom/prompt-input.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["button", "textarea"],
  },
  {
    name: "response",
    type: "registry:atom",
    description: "Response container with formatting and actions",
    categories: ["ai", "display"],
    files: [
      {
        path: "components/atom/response.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "reasoning",
    type: "registry:atom",
    description: "Display reasoning steps and thought processes",
    categories: ["ai", "display"],
    files: [
      {
        path: "components/atom/reasoning.tsx",
        type: "registry:component",
      },
    ],
  },

  // Display / Animation Category
  {
    name: "card",
    type: "registry:atom",
    description: "Enhanced card component with hover effects",
    categories: ["display", "layout"],
    files: [
      {
        path: "components/atom/card.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["card"],
  },
  {
    name: "card-hover-effect",
    type: "registry:atom",
    description: "Card with animated hover effects and transitions",
    categories: ["display", "animation"],
    files: [
      {
        path: "components/atom/card-hover-effect.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "cards-metric",
    type: "registry:atom",
    description: "Metric display cards with statistics",
    categories: ["display", "data"],
    files: [
      {
        path: "components/atom/cards-metric.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["card"],
  },
  {
    name: "gradient-animation",
    type: "registry:atom",
    description: "Animated gradient background effect",
    categories: ["animation", "display"],
    files: [
      {
        path: "components/atom/gradient-animation.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "infinite-cards",
    type: "registry:atom",
    description: "Infinite scrolling card carousel",
    categories: ["animation", "display"],
    files: [
      {
        path: "components/atom/infinite-cards.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "infinite-slider",
    type: "registry:atom",
    description: "Infinite auto-scrolling slider with smooth animations",
    categories: ["animation", "display"],
    files: [
      {
        path: "components/atom/infinite-slider.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "progressive-blur",
    type: "registry:atom",
    description: "Progressive blur effect for images and backgrounds",
    categories: ["animation", "display"],
    files: [
      {
        path: "components/atom/progressive-blur.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sticky-scroll",
    type: "registry:atom",
    description: "Sticky scroll reveal animation",
    categories: ["animation", "display"],
    files: [
      {
        path: "components/atom/sticky-scroll.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "simple-marquee",
    type: "registry:atom",
    description: "Simple auto-scrolling marquee component",
    categories: ["animation", "display"],
    files: [
      {
        path: "components/atom/simple-marquee.tsx",
        type: "registry:component",
      },
    ],
  },

  // Form / Interactive Category
  {
    name: "faceted",
    type: "registry:atom",
    description: "Faceted filter component for data tables",
    categories: ["form", "interactive"],
    files: [
      {
        path: "components/atom/faceted.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["button", "popover", "checkbox", "separator", "badge"],
  },
  {
    name: "sortable",
    type: "registry:atom",
    description: "Drag-and-drop sortable list component",
    categories: ["interactive", "form"],
    files: [
      {
        path: "components/atom/sortable.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities"],
  },
  {
    name: "expand-button",
    type: "registry:atom",
    description: "Expandable button with reveal animation",
    categories: ["interactive", "ui"],
    files: [
      {
        path: "components/atom/expand-button.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["button"],
  },

  // Layout / Navigation Category
  {
    name: "header-section",
    type: "registry:atom",
    description: "Reusable header section component",
    categories: ["layout", "navigation"],
    files: [
      {
        path: "components/atom/header-section.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "page-actions",
    type: "registry:atom",
    description: "Page-level action buttons container",
    categories: ["layout", "navigation"],
    files: [
      {
        path: "components/atom/page-actions.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["button"],
  },
  {
    name: "page-header",
    type: "registry:atom",
    description: "Consistent page header with breadcrumbs",
    categories: ["layout", "navigation"],
    files: [
      {
        path: "components/atom/page-header.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "tabs",
    type: "registry:atom",
    description: "Enhanced tabs component with animations",
    categories: ["navigation", "ui"],
    files: [
      {
        path: "components/atom/tabs.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["tabs"],
  },

  // Modal / Dialog Category
  {
    name: "modal-system",
    type: "registry:atom",
    description: "Complete modal system with carousel and steps",
    categories: ["modal", "dialog"],
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
    registryDependencies: ["dialog", "button"],
  },

  // UI / Utility Category
  {
    name: "loading",
    type: "registry:atom",
    description: "Loading spinner and skeleton components",
    categories: ["ui", "feedback"],
    files: [
      {
        path: "components/atom/loading.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "announcement",
    type: "registry:atom",
    description: "Announcement banner component",
    categories: ["ui", "feedback"],
    files: [
      {
        path: "components/atom/announcement.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "two-buttons",
    type: "registry:atom",
    description: "Dual button group component",
    categories: ["ui", "interactive"],
    files: [
      {
        path: "components/atom/two-buttons.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["button"],
  },
  {
    name: "agent-heading",
    type: "registry:atom",
    description: "Agent conversation heading component",
    categories: ["ui", "display"],
    files: [
      {
        path: "components/atom/agent-heading.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "theme-provider",
    type: "registry:atom",
    description: "Theme provider wrapper component",
    categories: ["ui", "utility"],
    files: [
      {
        path: "components/atom/theme-provider.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["next-themes"],
  },
  {
    name: "icons",
    type: "registry:lib",
    description: "Comprehensive icon library",
    categories: ["ui", "utility"],
    files: [
      {
        path: "components/atom/icons.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react"],
  },
  {
    name: "fonts",
    type: "registry:lib",
    description: "Font configuration utilities",
    categories: ["ui", "utility"],
    files: [
      {
        path: "components/atom/fonts.ts",
        type: "registry:component",
      },
    ],
    dependencies: ["next/font/google"],
  },
]
