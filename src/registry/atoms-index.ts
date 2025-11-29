import * as React from "react"

export type AtomEntry = {
  name: string
  component: React.LazyExoticComponent<React.ComponentType<any>>
  files: { path: string; type: string }[]
}

export const AtomsIndex: Record<string, AtomEntry> = {
  "activity-goal": {
    name: "activity-goal",
    component: React.lazy(() => import("@/components/atom/activity-goal")),
    files: [{ path: "src/components/atom/activity-goal.tsx", type: "registry:atom" }],
  },
  "agent-heading": {
    name: "agent-heading",
    component: React.lazy(() => import("@/components/atom/agent-heading")),
    files: [{ path: "src/components/atom/agent-heading.tsx", type: "registry:atom" }],
  },
  "ai-previews": {
    name: "ai-previews",
    component: React.lazy(() => import("@/components/atom/ai-previews")),
    files: [{ path: "src/components/atom/ai-previews.tsx", type: "registry:atom" }],
  },
  "ai-response-display": {
    name: "ai-response-display",
    component: React.lazy(() => import("@/components/atom/ai-response-display")),
    files: [{ path: "src/components/atom/ai-response-display.tsx", type: "registry:atom" }],
  },
  "announcement": {
    name: "announcement",
    component: React.lazy(() => import("@/components/atom/announcement")),
    files: [{ path: "src/components/atom/announcement.tsx", type: "registry:atom" }],
  },
  "button-group": {
    name: "button-group",
    component: React.lazy(() => import("@/components/atom/button-group")),
    files: [{ path: "src/components/atom/button-group.tsx", type: "registry:atom" }],
  },
  "calendar": {
    name: "calendar",
    component: React.lazy(() => import("@/components/atom/calendar")),
    files: [{ path: "src/components/atom/calendar.tsx", type: "registry:atom" }],
  },
  "card": {
    name: "card",
    component: React.lazy(() => import("@/components/atom/card")),
    files: [{ path: "src/components/atom/card.tsx", type: "registry:atom" }],
  },
  "card-form": {
    name: "card-form",
    component: React.lazy(() => import("@/components/atom/card-form")),
    files: [{ path: "src/components/atom/card-form.tsx", type: "registry:atom" }],
  },
  "card-hover-effect": {
    name: "card-hover-effect",
    component: React.lazy(() => import("@/components/atom/card-hover-effect")),
    files: [{ path: "src/components/atom/card-hover-effect.tsx", type: "registry:atom" }],
  },
  "card-preview": {
    name: "card-preview",
    component: React.lazy(() => import("@/components/atom/card-preview")),
    files: [{ path: "src/components/atom/card-preview.tsx", type: "registry:atom" }],
  },
  "cards-metric": {
    name: "cards-metric",
    component: React.lazy(() => import("@/components/atom/cards-metric")),
    files: [{ path: "src/components/atom/cards-metric.tsx", type: "registry:atom" }],
  },
  "chat": {
    name: "chat",
    component: React.lazy(() => import("@/components/atom/chat")),
    files: [{ path: "src/components/atom/chat.tsx", type: "registry:atom" }],
  },
  "data-table": {
    name: "data-table",
    component: React.lazy(() => import("@/components/atom/data-table")),
    files: [{ path: "src/components/atom/data-table.tsx", type: "registry:atom" }],
  },
  "divider-with-text": {
    name: "divider-with-text",
    component: React.lazy(() => import("@/components/atom/divider-with-text")),
    files: [{ path: "src/components/atom/divider-with-text.tsx", type: "registry:atom" }],
  },
  "expand-button": {
    name: "expand-button",
    component: React.lazy(() => import("@/components/atom/expand-button")),
    files: [{ path: "src/components/atom/expand-button.tsx", type: "registry:atom" }],
  },
  "faceted": {
    name: "faceted",
    component: React.lazy(() => import("@/components/atom/faceted")),
    files: [{ path: "src/components/atom/faceted.tsx", type: "registry:atom" }],
  },
  "fonts-preview": {
    name: "fonts-preview",
    component: React.lazy(() => import("@/components/atom/fonts-preview")),
    files: [{ path: "src/components/atom/fonts-preview.tsx", type: "registry:atom" }],
  },
  "form-field": {
    name: "form-field",
    component: React.lazy(() => import("@/components/atom/form-field")),
    files: [{ path: "src/components/atom/form-field.tsx", type: "registry:atom" }],
  },
  "gradient-animation": {
    name: "gradient-animation",
    component: React.lazy(() => import("@/components/atom/gradient-animation")),
    files: [{ path: "src/components/atom/gradient-animation.tsx", type: "registry:atom" }],
  },
  "header-section": {
    name: "header-section",
    component: React.lazy(() => import("@/components/atom/header-section")),
    files: [{ path: "src/components/atom/header-section.tsx", type: "registry:atom" }],
  },
  "icons": {
    name: "icons",
    component: React.lazy(() => import("@/components/atom/icons")),
    files: [{ path: "src/components/atom/icons.tsx", type: "registry:atom" }],
  },
  "icons-preview": {
    name: "icons-preview",
    component: React.lazy(() => import("@/components/atom/icons-preview")),
    files: [{ path: "src/components/atom/icons-preview.tsx", type: "registry:atom" }],
  },
  "infinite-cards": {
    name: "infinite-cards",
    component: React.lazy(() => import("@/components/atom/infinite-cards")),
    files: [{ path: "src/components/atom/infinite-cards.tsx", type: "registry:atom" }],
  },
  "infinite-slider": {
    name: "infinite-slider",
    component: React.lazy(() => import("@/components/atom/infinite-slider")),
    files: [{ path: "src/components/atom/infinite-slider.tsx", type: "registry:atom" }],
  },
  "labeled-input": {
    name: "labeled-input",
    component: React.lazy(() => import("@/components/atom/labeled-input")),
    files: [{ path: "src/components/atom/labeled-input.tsx", type: "registry:atom" }],
  },
  "labeled-select": {
    name: "labeled-select",
    component: React.lazy(() => import("@/components/atom/labeled-select")),
    files: [{ path: "src/components/atom/labeled-select.tsx", type: "registry:atom" }],
  },
  "labeled-textarea": {
    name: "labeled-textarea",
    component: React.lazy(() => import("@/components/atom/labeled-textarea")),
    files: [{ path: "src/components/atom/labeled-textarea.tsx", type: "registry:atom" }],
  },
  "loading": {
    name: "loading",
    component: React.lazy(() => import("@/components/atom/loading")),
    files: [{ path: "src/components/atom/loading.tsx", type: "registry:atom" }],
  },
  "metric": {
    name: "metric",
    component: React.lazy(() => import("@/components/atom/metric")),
    files: [{ path: "src/components/atom/metric.tsx", type: "registry:atom" }],
  },
  "modal-system": {
    name: "modal-system",
    component: React.lazy(() => import("@/components/atom/modal-system")),
    files: [{ path: "src/components/atom/modal-system.tsx", type: "registry:atom" }],
  },
  "oauth-button": {
    name: "oauth-button",
    component: React.lazy(() => import("@/components/atom/oauth-button")),
    files: [{ path: "src/components/atom/oauth-button.tsx", type: "registry:atom" }],
  },
  "oauth-button-group": {
    name: "oauth-button-group",
    component: React.lazy(() => import("@/components/atom/oauth-button-group")),
    files: [{ path: "src/components/atom/oauth-button-group.tsx", type: "registry:atom" }],
  },
  "page-actions": {
    name: "page-actions",
    component: React.lazy(() => import("@/components/atom/page-actions")),
    files: [{ path: "src/components/atom/page-actions.tsx", type: "registry:atom" }],
  },
  "page-actions-preview": {
    name: "page-actions-preview",
    component: React.lazy(() => import("@/components/atom/page-actions-preview")),
    files: [{ path: "src/components/atom/page-actions-preview.tsx", type: "registry:atom" }],
  },
  "page-header": {
    name: "page-header",
    component: React.lazy(() => import("@/components/atom/page-header")),
    files: [{ path: "src/components/atom/page-header.tsx", type: "registry:atom" }],
  },
  "payment-method-selector": {
    name: "payment-method-selector",
    component: React.lazy(() => import("@/components/atom/payment-method-selector")),
    files: [{ path: "src/components/atom/payment-method-selector.tsx", type: "registry:atom" }],
  },
  "progressive-blur": {
    name: "progressive-blur",
    component: React.lazy(() => import("@/components/atom/progressive-blur")),
    files: [{ path: "src/components/atom/progressive-blur.tsx", type: "registry:atom" }],
  },
  "prompt-input": {
    name: "prompt-input",
    component: React.lazy(() => import("@/components/atom/prompt-input")),
    files: [{ path: "src/components/atom/prompt-input.tsx", type: "registry:atom" }],
  },
  "reasoning": {
    name: "reasoning",
    component: React.lazy(() => import("@/components/atom/reasoning")),
    files: [{ path: "src/components/atom/reasoning.tsx", type: "registry:atom" }],
  },
  "report-issue": {
    name: "report-issue",
    component: React.lazy(() => import("@/components/atom/report-issue")),
    files: [{ path: "src/components/atom/report-issue.tsx", type: "registry:atom" }],
  },
  "response": {
    name: "response",
    component: React.lazy(() => import("@/components/atom/response")),
    files: [{ path: "src/components/atom/response.tsx", type: "registry:atom" }],
  },
  "settings-toggle-row": {
    name: "settings-toggle-row",
    component: React.lazy(() => import("@/components/atom/settings-toggle-row")),
    files: [{ path: "src/components/atom/settings-toggle-row.tsx", type: "registry:atom" }],
  },
  "share": {
    name: "share",
    component: React.lazy(() => import("@/components/atom/share")),
    files: [{ path: "src/components/atom/share.tsx", type: "registry:atom" }],
  },
  "simple-marquee": {
    name: "simple-marquee",
    component: React.lazy(() => import("@/components/atom/simple-marquee")),
    files: [{ path: "src/components/atom/simple-marquee.tsx", type: "registry:atom" }],
  },
  "site-heading": {
    name: "site-heading",
    component: React.lazy(() => import("@/components/atom/site-heading")),
    files: [{ path: "src/components/atom/site-heading.tsx", type: "registry:atom" }],
  },
  "sortable": {
    name: "sortable",
    component: React.lazy(() => import("@/components/atom/sortable")),
    files: [{ path: "src/components/atom/sortable.tsx", type: "registry:atom" }],
  },
  "sortable-preview": {
    name: "sortable-preview",
    component: React.lazy(() => import("@/components/atom/sortable-preview")),
    files: [{ path: "src/components/atom/sortable-preview.tsx", type: "registry:atom" }],
  },
  "stats": {
    name: "stats",
    component: React.lazy(() => import("@/components/atom/stats")),
    files: [{ path: "src/components/atom/stats.tsx", type: "registry:atom" }],
  },
  "sticky-scroll": {
    name: "sticky-scroll",
    component: React.lazy(() => import("@/components/atom/sticky-scroll")),
    files: [{ path: "src/components/atom/sticky-scroll.tsx", type: "registry:atom" }],
  },
  "tabs": {
    name: "tabs",
    component: React.lazy(() => import("@/components/atom/tabs")),
    files: [{ path: "src/components/atom/tabs.tsx", type: "registry:atom" }],
  },
  "team-member": {
    name: "team-member",
    component: React.lazy(() => import("@/components/atom/team-member")),
    files: [{ path: "src/components/atom/team-member.tsx", type: "registry:atom" }],
  },
  "theme-provider": {
    name: "theme-provider",
    component: React.lazy(() => import("@/components/atom/theme-provider")),
    files: [{ path: "src/components/atom/theme-provider.tsx", type: "registry:atom" }],
  },
  "two-buttons": {
    name: "two-buttons",
    component: React.lazy(() => import("@/components/atom/two-buttons")),
    files: [{ path: "src/components/atom/two-buttons.tsx", type: "registry:atom" }],
  },
  "two-buttons-preview": {
    name: "two-buttons-preview",
    component: React.lazy(() => import("@/components/atom/two-buttons-preview")),
    files: [{ path: "src/components/atom/two-buttons-preview.tsx", type: "registry:atom" }],
  },
  "user-info-card": {
    name: "user-info-card",
    component: React.lazy(() => import("@/components/atom/user-info-card")),
    files: [{ path: "src/components/atom/user-info-card.tsx", type: "registry:atom" }],
  },
}
