"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { atomsSource } from "@/lib/source"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Flat list of links without sections
const ATOMS_LINKS = [
  { name: "Introduction", href: "/atoms" },

  // Form / Authentication
  { name: "OAuth Button", href: "/atoms/oauth-button" },
  { name: "OAuth Button Group", href: "/atoms/oauth-button-group" },
  { name: "Divider With Text", href: "/atoms/divider-with-text" },
  { name: "Form Field", href: "/atoms/form-field" },
  { name: "Settings Toggle Row", href: "/atoms/settings-toggle-row" },
  { name: "Payment Method Selector", href: "/atoms/payment-method-selector" },

  // Display / User
  { name: "User Info Card", href: "/atoms/user-info-card" },

  // Card Components
  { name: "Activity Goal", href: "/atoms/activity-goal" },
  { name: "Calendar", href: "/atoms/calendar" },
  { name: "Metric", href: "/atoms/metric" },
  { name: "Report Issue", href: "/atoms/report-issue" },
  { name: "Share", href: "/atoms/share" },
  { name: "Stats", href: "/atoms/stats" },

  // Animation
  { name: "Card Hover Effect", href: "/atoms/card-hover-effect" },
  { name: "Cards Metric", href: "/atoms/cards-metric" },
  { name: "Card", href: "/atoms/card" },
  { name: "Gradient Animation", href: "/atoms/gradient-animation" },
  { name: "Infinite Cards", href: "/atoms/infinite-cards" },
  { name: "Infinite Slider", href: "/atoms/infinite-slider" },
  { name: "Progressive Blur", href: "/atoms/progressive-blur" },
  { name: "Simple Marquee", href: "/atoms/simple-marquee" },
  { name: "Sticky Scroll", href: "/atoms/sticky-scroll" },

  // Interactive
  { name: "Accordion", href: "/atoms/accordion" },
  { name: "Expand Button", href: "/atoms/expand-button" },
  { name: "Faceted", href: "/atoms/faceted" },
  { name: "Sortable", href: "/atoms/sortable" },
  { name: "Tabs", href: "/atoms/tabs" },
  { name: "Two Buttons", href: "/atoms/two-buttons" },

  // AI
  { name: "AI Prompt Input", href: "/atoms/ai-prompt-input" },
  { name: "AI Response Display", href: "/atoms/ai-response-display" },
  { name: "AI Status Indicator", href: "/atoms/ai-status-indicator" },
  { name: "AI Streaming Text", href: "/atoms/ai-streaming-text" },
  { name: "Prompt Input", href: "/atoms/prompt-input" },
  { name: "Reasoning", href: "/atoms/reasoning" },
  { name: "Response", href: "/atoms/response" },

  // Layout
  { name: "Agent Heading", href: "/atoms/agent-heading" },
  { name: "Announcement", href: "/atoms/announcement" },
  { name: "Header Section", href: "/atoms/header-section" },
  { name: "Loading", href: "/atoms/loading" },
  { name: "Modal System", href: "/atoms/modal-system" },
  { name: "Page Actions", href: "/atoms/page-actions" },
  { name: "Page Header", href: "/atoms/page-header" },
  { name: "Theme Provider", href: "/atoms/theme-provider" },

  // Utilities
  { name: "Fonts", href: "/atoms/fonts" },
  { name: "Icons", href: "/atoms/icons" },

  // Imported from databayt repos
  { name: "Action Menu", href: "/atoms/action-menu" },
  { name: "Animated Button", href: "/atoms/animated-button" },
  { name: "Auto Complete", href: "/atoms/auto-complete" },
  { name: "Block Button", href: "/atoms/block-button" },
  { name: "Brand Icons", href: "/atoms/brand-icons" },
  { name: "Card Article", href: "/atoms/card-article" },
  { name: "Confetti", href: "/atoms/confetti" },
  { name: "Counter", href: "/atoms/counter" },
  { name: "Country Dropdown", href: "/atoms/country-dropdown" },
  { name: "Date Picker Range", href: "/atoms/date-picker-range" },
  { name: "Date Range Picker", href: "/atoms/date-range-picker" },
  { name: "Empty State", href: "/atoms/empty-state" },
  { name: "Encrypted Text", href: "/atoms/encrypted-text" },
  { name: "Expandable Card", href: "/atoms/expandable-card" },
  { name: "Github Button", href: "/atoms/github-button" },
  { name: "Grid Container", href: "/atoms/grid-container" },
  { name: "Guest Selector", href: "/atoms/guest-selector" },
  { name: "Header", href: "/atoms/header" },
  { name: "Hierarchical Select", href: "/atoms/hierarchical-select" },
  { name: "Icon", href: "/atoms/icon" },
  { name: "Marquee", href: "/atoms/marquee" },
  { name: "Month Year Picker", href: "/atoms/month-year-picker" },
  { name: "Month Year Range", href: "/atoms/month-year-range" },
  { name: "Multi Select", href: "/atoms/multi-select" },
  { name: "Number Stepper", href: "/atoms/number-stepper" },
  { name: "Page Heading", href: "/atoms/page-heading" },
  { name: "Page Nav", href: "/atoms/page-nav" },
  { name: "Page Title", href: "/atoms/page-title" },
  { name: "Parallax Text", href: "/atoms/parallax-text" },
  { name: "Phone Input", href: "/atoms/phone-input" },
  { name: "Profile", href: "/atoms/profile" },
  { name: "Search Button", href: "/atoms/search-button" },
  { name: "Search Divider", href: "/atoms/search-divider" },
  { name: "Search Dropdown", href: "/atoms/search-dropdown" },
  { name: "Search Input", href: "/atoms/search-input" },
  { name: "Section Heading", href: "/atoms/section-heading" },
  { name: "See More", href: "/atoms/see-more" },
  { name: "Sidebar", href: "/atoms/sidebar" },
  { name: "Theme", href: "/atoms/theme" },
  { name: "Title", href: "/atoms/title" },
  { name: "Toast", href: "/atoms/toast" },
  { name: "Toggle", href: "/atoms/toggle" },
  { name: "Toolbar", href: "/atoms/toolbar" },
  { name: "View Toggle", href: "/atoms/view-toggle" },
  { name: "Mapbox Autocomplete", href: "/atoms/mapbox-autocomplete" },
  { name: "Mapbox Location Picker", href: "/atoms/mapbox-location-picker" },
  { name: "Optimized Image", href: "/atoms/optimized-image" },
  { name: "Property Filter", href: "/atoms/property-filter" },
  { name: "Property Gallery", href: "/atoms/property-gallery" },
  { name: "Property Header", href: "/atoms/property-header" },
  { name: "Property Icon", href: "/atoms/property-icon" },
  { name: "Property Icons", href: "/atoms/property-icons" },
  { name: "Property Images", href: "/atoms/property-images" },
  { name: "Property Info", href: "/atoms/property-info" },
  { name: "Property Reserve", href: "/atoms/property-reserve" },
  { name: "Property Select", href: "/atoms/property-select" },
  { name: "Review", href: "/atoms/review" },
  { name: "Reviews", href: "/atoms/reviews" },
]

export function AtomsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof atomsSource.pageTree }) {
  const pathname = usePathname()

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+2rem)] z-30 hidden h-[calc(100vh-var(--header-height)-4rem)] overflow-y-auto bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="overflow-y-auto gap-0">
        <ScrollArea className="h-full w-full">
          <div className="pb-4 pt-2 pl-0">
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu>
                  {ATOMS_LINKS.map(({ name, href }) => {
                    const isActive = pathname === href

                    return (
                      <SidebarMenuItem key={href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className="relative h-[30px] w-full border border-transparent text-[0.8rem] font-medium p-0"
                        >
                          <Link href={href} className="block w-full">{name}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}
