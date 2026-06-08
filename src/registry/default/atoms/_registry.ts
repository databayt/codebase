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
    name: "oauth-button",
    type: "registry:atom",
    description: "Single OAuth button with provider icon",
    categories: ["form", "authentication"],
    files: [
      {
        path: "components/atom/oauth-button.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["button", "icons"],
  },
  {
    name: "oauth-button-group",
    type: "registry:atom",
    description: "Grid of OAuth buttons for multiple providers",
    categories: ["form", "authentication"],
    files: [
      {
        path: "components/atom/oauth-button-group.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["oauth-button"],
  },
  {
    name: "divider-with-text",
    type: "registry:atom",
    description: "Horizontal divider with centered text label",
    categories: ["ui", "layout"],
    files: [
      {
        path: "components/atom/divider-with-text.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "user-info-card",
    type: "registry:atom",
    description: "User avatar with name and email display",
    categories: ["display", "user"],
    files: [
      {
        path: "components/atom/user-info-card.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["avatar"],
  },
  {
    name: "settings-toggle-row",
    type: "registry:atom",
    description: "Settings row with label, description, and toggle switch",
    categories: ["form", "settings"],
    files: [
      {
        path: "components/atom/settings-toggle-row.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["switch", "label"],
  },
  {
    name: "form-field",
    type: "registry:atom",
    description: "Form field primitives with label and input",
    categories: ["form", "input"],
    files: [
      {
        path: "components/atom/form-field.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["input", "label"],
  },
  {
    name: "payment-method-selector",
    type: "registry:atom",
    description: "Payment method radio selector with icons",
    categories: ["form", "payment"],
    files: [
      {
        path: "components/atom/payment-method-selector.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["radio-group", "label", "icons"],
  },
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
  {
    name: "action-menu",
    type: "registry:atom",
    description: "Action Menu atom imported from databayt repos.",
    categories: ["button", "interactive"],
    files: [
      {
        path: "components/atom/action-menu.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react", "next"],
    registryDependencies: ["button", "dropdown-menu"],
  },
  {
    name: "animated-button",
    type: "registry:atom",
    description: "Animated Button atom imported from databayt repos.",
    categories: ["button", "interactive"],
    files: [
      {
        path: "components/atom/animated-button.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["button"],
  },
  {
    name: "country-dropdown",
    type: "registry:atom",
    description: "Country Dropdown atom imported from databayt repos.",
    categories: ["form", "input"],
    files: [
      {
        path: "components/atom/country-dropdown.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["country-state-city", "lucide-react", "react-circle-flags"],
    registryDependencies: ["button", "command", "popover"],
  },
  {
    name: "empty-state",
    type: "registry:atom",
    description: "Empty State atom imported from databayt repos.",
    categories: ["display", "data"],
    files: [
      {
        path: "components/atom/empty-state.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react"],
  },
  {
    name: "encrypted-text",
    type: "registry:atom",
    description: "Encrypted Text atom imported from databayt repos.",
    categories: ["animation", "display"],
    files: [
      {
        path: "components/atom/encrypted-text.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["motion"],
  },
  {
    name: "grid-container",
    type: "registry:atom",
    description: "Grid Container atom imported from databayt repos.",
    categories: ["layout", "navigation"],
    files: [
      {
        path: "components/atom/grid-container.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "number-stepper",
    type: "registry:atom",
    description: "Number Stepper atom imported from databayt repos.",
    categories: ["form", "input"],
    files: [
      {
        path: "components/atom/number-stepper.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react"],
    registryDependencies: ["button", "button-group", "input"],
  },
  {
    name: "page-heading",
    type: "registry:atom",
    description: "Page Heading atom imported from databayt repos.",
    categories: ["layout", "navigation"],
    files: [
      {
        path: "components/atom/page-heading.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "page-nav",
    type: "registry:atom",
    description: "Page Nav atom imported from databayt repos.",
    categories: ["layout", "navigation"],
    files: [
      {
        path: "components/atom/page-nav.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["next"],
    registryDependencies: ["scroll-area"],
  },
  {
    name: "page-title",
    type: "registry:atom",
    description: "Page Title atom imported from databayt repos.",
    categories: ["layout", "navigation"],
    files: [
      {
        path: "components/atom/page-title.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "phone-input",
    type: "registry:atom",
    description: "Phone Input atom imported from databayt repos.",
    categories: ["form", "input"],
    files: [
      {
        path: "components/atom/phone-input.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["country-data-list", "libphonenumber-js", "lucide-react", "react-circle-flags", "zod"],
    registryDependencies: ["command", "popover"],
  },
  {
    name: "search-input",
    type: "registry:atom",
    description: "Search Input atom imported from databayt repos.",
    categories: ["form", "input"],
    files: [
      {
        path: "components/atom/search-input.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react"],
    registryDependencies: ["button", "input"],
  },
  {
    name: "see-more",
    type: "registry:atom",
    description: "See More atom imported from databayt repos.",
    categories: ["layout", "navigation"],
    files: [
      {
        path: "components/atom/see-more.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react"],
    registryDependencies: ["button"],
  },
  {
    name: "theme",
    type: "registry:atom",
    description: "Theme atom imported from databayt repos.",
    categories: ["display", "interactive"],
    files: [
      {
        path: "components/atom/theme.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["next-themes"],
  },
  {
    name: "toolbar",
    type: "registry:atom",
    description: "Toolbar atom imported from databayt repos.",
    categories: ["layout", "navigation"],
    files: [
      {
        path: "components/atom/toolbar.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "toast",
    type: "registry:atom",
    description: "Toast atom imported from databayt repos.",
    categories: ["display", "interactive"],
    files: [
      {
        path: "components/atom/toast.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["sonner"],
    registryDependencies: ["button", "dialog"],
  },
  {
    name: "view-toggle",
    type: "registry:atom",
    description: "View Toggle atom imported from databayt repos.",
    categories: ["layout", "navigation"],
    files: [
      {
        path: "components/atom/view-toggle.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react"],
    registryDependencies: ["button", "tooltip"],
  },
  {
    name: "section-heading",
    type: "registry:atom",
    description: "Section Heading atom imported from databayt repos.",
    categories: ["layout", "navigation"],
    files: [
      {
        path: "components/atom/section-heading.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["next"],
  },
  {
    name: "block-button",
    type: "registry:atom",
    description: "Block Button atom imported from databayt repos.",
    categories: ["button", "interactive"],
    files: [
      {
        path: "components/atom/block-button.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["next"],
  },
  {
    name: "brand-icons",
    type: "registry:atom",
    description: "Brand Icons atom imported from databayt repos.",
    categories: ["ui", "utility"],
    files: [
      {
        path: "components/atom/brand-icons.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "counter",
    type: "registry:atom",
    description: "Counter atom imported from databayt repos.",
    categories: ["display", "interactive"],
    files: [
      {
        path: "components/atom/counter.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react"],
  },
  {
    name: "date-picker-range",
    type: "registry:atom",
    description: "Date Picker Range atom imported from databayt repos.",
    categories: ["form", "input"],
    files: [
      {
        path: "components/atom/date-picker-range.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["date-fns", "lucide-react", "react-day-picker"],
    registryDependencies: ["button", "calendar", "popover"],
  },
  {
    name: "date-range-picker",
    type: "registry:atom",
    description: "Date Range Picker atom imported from databayt repos.",
    categories: ["form", "input"],
    files: [
      {
        path: "components/atom/date-range-picker.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["date-fns", "react-day-picker"],
    registryDependencies: ["calendar"],
  },
  {
    name: "expandable-card",
    type: "registry:atom",
    description: "Expandable Card atom imported from databayt repos.",
    categories: ["display", "data"],
    files: [
      {
        path: "components/atom/expandable-card.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["framer-motion", "next"],
  },
  {
    name: "guest-selector",
    type: "registry:atom",
    description: "Guest Selector atom imported from databayt repos.",
    categories: ["form", "input"],
    files: [
      {
        path: "components/atom/guest-selector.tsx",
        type: "registry:component",
      },
    ],
    registryDependencies: ["counter"],
  },
  {
    name: "header",
    type: "registry:atom",
    description: "Header atom imported from databayt repos.",
    categories: ["layout", "navigation"],
    files: [
      {
        path: "components/atom/header.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "profile",
    type: "registry:atom",
    description: "Profile atom imported from databayt repos.",
    categories: ["display", "data"],
    files: [
      {
        path: "components/atom/profile.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["next"],
  },
  {
    name: "search-button",
    type: "registry:atom",
    description: "Search Button atom imported from databayt repos.",
    categories: ["button", "interactive"],
    files: [
      {
        path: "components/atom/search-button.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react"],
    registryDependencies: ["button"],
  },
  {
    name: "search-divider",
    type: "registry:atom",
    description: "Search Divider atom imported from databayt repos.",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/search-divider.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "search-dropdown",
    type: "registry:atom",
    description: "Search Dropdown atom imported from databayt repos.",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/search-dropdown.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar",
    type: "registry:atom",
    description: "Sidebar atom imported from databayt repos.",
    categories: ["layout", "navigation"],
    files: [
      {
        path: "components/atom/sidebar.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "toggle",
    type: "registry:atom",
    description: "Toggle atom imported from databayt repos.",
    categories: ["form", "input"],
    files: [
      {
        path: "components/atom/toggle.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["@theme-toggles/react", "next-themes"],
  },
  {
    name: "github-button",
    type: "registry:atom",
    description: "Github Button atom imported from databayt repos.",
    categories: ["button", "interactive"],
    files: [
      {
        path: "components/atom/github-button.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["next"],
    registryDependencies: ["brand-icons"],
  },
  {
    name: "auto-complete",
    type: "registry:atom",
    description: "Auto Complete atom imported from databayt repos.",
    categories: ["form", "input"],
    files: [
      {
        path: "components/atom/auto-complete.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["framer-motion"],
    registryDependencies: ["command"],
  },
  {
    name: "card-article",
    type: "registry:atom",
    description: "Card Article atom imported from databayt repos.",
    categories: ["display", "data"],
    files: [
      {
        path: "components/atom/card-article.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["framer-motion", "lucide-react", "next"],
    registryDependencies: ["context-menu"],
  },
  {
    name: "confetti",
    type: "registry:atom",
    description: "Confetti atom imported from databayt repos.",
    categories: ["animation", "display"],
    files: [
      {
        path: "components/atom/confetti.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["canvas-confetti"],
  },
  {
    name: "hierarchical-select",
    type: "registry:atom",
    description: "Hierarchical Select atom imported from databayt repos.",
    categories: ["form", "input"],
    files: [
      {
        path: "components/atom/hierarchical-select.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["framer-motion", "lucide-react"],
  },
  {
    name: "icon",
    type: "registry:atom",
    description: "Icon atom imported from databayt repos.",
    categories: ["ui", "utility"],
    files: [
      {
        path: "components/atom/icon.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "marquee",
    type: "registry:atom",
    description: "Marquee atom imported from databayt repos.",
    categories: ["animation", "display"],
    files: [
      {
        path: "components/atom/marquee.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "month-year-picker",
    type: "registry:atom",
    description: "Month Year Picker atom imported from databayt repos.",
    categories: ["form", "input"],
    files: [
      {
        path: "components/atom/month-year-picker.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["date-fns", "lucide-react"],
    registryDependencies: ["button", "popover"],
  },
  {
    name: "month-year-range",
    type: "registry:atom",
    description: "Month Year Range atom imported from databayt repos.",
    categories: ["form", "input"],
    files: [
      {
        path: "components/atom/month-year-range.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["date-fns", "lucide-react"],
    registryDependencies: ["button", "popover"],
  },
  {
    name: "multi-select",
    type: "registry:atom",
    description: "Multi Select atom imported from databayt repos.",
    categories: ["form", "input"],
    files: [
      {
        path: "components/atom/multi-select.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["cmdk", "lucide-react"],
    registryDependencies: ["badge", "command"],
  },
  {
    name: "parallax-text",
    type: "registry:atom",
    description: "Parallax Text atom imported from databayt repos.",
    categories: ["animation", "display"],
    files: [
      {
        path: "components/atom/parallax-text.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["framer-motion"],
  },
  {
    name: "title",
    type: "registry:atom",
    description: "Title atom imported from databayt repos.",
    categories: ["display", "interactive"],
    files: [
      {
        path: "components/atom/title.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["next"],
  },
  {
    name: "mapbox-autocomplete",
    type: "registry:atom",
    description: "Mapbox Autocomplete atom imported from databayt repos.",
    categories: ["input", "layout"],
    files: [
      {
        path: "components/atom/mapbox-autocomplete.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react"],
    registryDependencies: ["input"],
  },
  {
    name: "mapbox-location-picker",
    type: "registry:atom",
    description: "Mapbox Location Picker atom imported from databayt repos.",
    categories: ["input", "layout"],
    files: [
      {
        path: "components/atom/mapbox-location-picker.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react", "mapbox-gl"],
    registryDependencies: ["button", "input", "skeleton"],
  },
  {
    name: "optimized-image",
    type: "registry:atom",
    description: "Optimized Image atom imported from databayt repos.",
    categories: ["display", "interactive"],
    files: [
      {
        path: "components/atom/optimized-image.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["next"],
  },
  {
    name: "property-reserve",
    type: "registry:atom",
    description: "Property Reserve atom imported from databayt repos.",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/property-reserve.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react", "next", "react-day-picker", "sonner"],
    registryDependencies: ["button", "popover"],
  },
  {
    name: "property-info",
    type: "registry:atom",
    description: "Property Info atom imported from databayt repos.",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/property-info.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react"],
  },
  {
    name: "property-header",
    type: "registry:atom",
    description: "Property Header atom imported from databayt repos.",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/property-header.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react"],
    registryDependencies: ["badge", "button", "icons"],
  },
  {
    name: "property-icons",
    type: "registry:atom",
    description: "Property Icons atom imported from databayt repos.",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/property-icons.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "property-icon",
    type: "registry:atom",
    description: "Property Icon atom imported from databayt repos.",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/property-icon.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["next"],
  },
  {
    name: "property-images",
    type: "registry:atom",
    description: "Property Images atom imported from databayt repos.",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/property-images.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["next"],
    registryDependencies: ["button"],
  },
  {
    name: "property-gallery",
    type: "registry:atom",
    description: "Property Gallery atom imported from databayt repos.",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/property-gallery.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react", "next"],
    registryDependencies: ["button", "icons"],
  },
  {
    name: "property-filter",
    type: "registry:atom",
    description: "Property Filter atom imported from databayt repos.",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/property-filter.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react"],
    registryDependencies: ["badge", "button", "checkbox", "dialog", "separator", "slider"],
  },
  {
    name: "property-select",
    type: "registry:atom",
    description: "Property Select atom imported from databayt repos.",
    categories: ["data", "display"],
    files: [
      {
        path: "components/atom/property-select.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react"],
    registryDependencies: ["button", "popover", "select"],
  },
  {
    name: "reviews",
    type: "registry:atom",
    description: "Reviews atom imported from databayt repos.",
    categories: ["display", "data"],
    files: [
      {
        path: "components/atom/reviews.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "review",
    type: "registry:atom",
    description: "Review atom imported from databayt repos.",
    categories: ["display", "data"],
    files: [
      {
        path: "components/atom/review.tsx",
        type: "registry:component",
      },
    ],
    dependencies: ["lucide-react", "next"],
    registryDependencies: ["card"],
  },
]
