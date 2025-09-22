# Leads Block

## Overview
The Leads block is a comprehensive lead management system for tracking potential customers through the sales pipeline. It features an AI-powered Lead Agent interface for intelligent lead generation, along with advanced lead extraction, scoring, and enrichment capabilities.

## Architecture

### Directory Structure (Standardized)
```
src/
├── app/[lang]/(blocks)/leads/
│   └── page.tsx                 # Simple page wrapper importing LeadsContent
├── components/leads/
│   ├── action.ts                # Server actions & API calls
│   ├── all.tsx                  # List view with table
│   ├── analytics.tsx            # Analytics dashboard
│   ├── card.tsx                 # Lead card components
│   ├── constant.ts              # Enums, options, static data
│   ├── content.tsx              # Main UI orchestration
│   ├── detail.tsx               # Detailed lead view
│   ├── featured.tsx             # Featured leads display
│   ├── form.tsx                 # Lead creation/edit forms
│   ├── prompt.tsx               # AI Lead Agent interface (NEW)
│   ├── type.ts                  # TypeScript interfaces
│   ├── use-leads.ts             # Custom React hooks
│   ├── validation.ts            # Zod schemas
│   ├── README.md                # This file
│   └── ISSUE.md                 # Known issues & roadmap
├── components/atom/
│   ├── prompt-input.tsx         # Vercel AI Elements prompt component (NEW)
│   └── icons.tsx                # Custom SVG icons for prompt UI (NEW)
```

## Core Features

### 1. AI Lead Agent Interface (NEW)
- **Full-Screen Hero Section**: Engaging h-screen prompt interface at the top of the leads page
- **Vercel AI Elements Design**: Modern prompt input following industry-leading patterns
- **Multi-Modal Input**: Support for text prompts, file uploads, and voice commands
- **File Processing**: Drag-and-drop CSV/Excel files for bulk lead import
- **Smart Navigation**: Smooth scroll to existing leads table

### 2. Lead Management
- **CRUD Operations**: Full create, read, update, delete functionality
- **Status Pipeline**: NEW → CONTACTED → QUALIFIED → PROPOSAL → NEGOTIATION → CLOSED
- **Lead Scoring**: AI-powered scoring (0-100) with visual indicators
- **Priority Levels**: LOW, MEDIUM, HIGH, URGENT
- **Source Tracking**: MANUAL, WEB, FILE, IMPORT, API, REFERRAL, SOCIAL_MEDIA

### 3. AI-Powered Features
- **Lead Generation**: Describe target audience to generate qualified leads
- **Lead Extraction**: Extract leads from raw text using AI
- **Lead Scoring**: Automatic scoring based on lead quality
- **Lead Enrichment**: AI-enhanced lead data with insights
- **Bulk Analysis**: Process multiple leads simultaneously

### 4. User Interface
- **Lead Agent Prompt**: Full-screen AI interface for lead generation
- **Data Table**: Advanced filtering, sorting, pagination
- **Analytics Dashboard**: Visual metrics and KPIs
- **Featured View**: Showcase high-priority leads
- **Detail Sheets**: Comprehensive lead information
- **Responsive Design**: Mobile-optimized layouts

## Server Actions (action.ts)

### Core CRUD Operations
```typescript
createLead(input: CreateLeadInput)      // Create new lead
updateLead(id: string, input: UpdateLeadInput)  // Update existing lead
deleteLead(id: string)                  // Delete lead
getLeads(filters?, page?, pageSize?)    // List with filtering
getLeadById(id: string)                 // Get single lead
```

### Bulk Operations
```typescript
bulkUpdateLeads(input: BulkUpdateInput) // Update multiple leads
```

### AI Operations
```typescript
extractLeadsFromText(input: AIExtractionInput)  // Extract leads from text
scoreLeads(leadIds: string[])                   // AI scoring
enrichLead(leadId: string)                      // AI enrichment
```

### Analytics
```typescript
getLeadAnalytics()  // Dashboard metrics
```

## Data Model

### Lead Schema
```typescript
interface Lead {
  id: string
  name: string
  email?: string
  company?: string
  title?: string
  phone?: string
  linkedinUrl?: string
  website?: string
  industry?: string
  status: LeadStatus
  source: LeadSource
  priority: Priority
  score?: number
  tags: string[]
  notes?: string
  confidence?: number
  extractionMetadata?: Json
  createdAt: Date
  updatedAt: Date
  userId: string
}
```

### Enums
```typescript
enum LeadStatus {
  NEW, CONTACTED, QUALIFIED, PROPOSAL,
  NEGOTIATION, CLOSED_WON, CLOSED_LOST
}

enum LeadSource {
  MANUAL, WEB, FILE, IMPORT, API,
  REFERRAL, SOCIAL_MEDIA, EMAIL_CAMPAIGN
}

enum Priority {
  LOW, MEDIUM, HIGH, URGENT
}
```

## Component Usage

### Main Content Component
```tsx
import LeadsContent from "@/components/leads/content";

// In page.tsx
export default function Leads() {
  return <LeadsContent />;
}
```

### Lead Agent Prompt Component
```tsx
import LeadsPrompt from "@/components/leads/prompt";

// The prompt component is automatically rendered in LeadsContent
// It provides:
// - Full-screen hero section with Lead Agent branding
// - AI-powered prompt input for lead generation
// - File upload support (CSV/Excel)
// - Smooth scroll navigation to leads table
```

### Using Server Actions
```tsx
import { createLead, getLeads } from "@/components/leads/action";

// Create a lead
const result = await createLead({
  name: "John Doe",
  email: "john@example.com",
  company: "Acme Corp",
  status: "NEW"
});

// Get leads with filters
const leads = await getLeads(
  { status: "NEW", scoreMin: 70 },
  1,  // page
  10  // pageSize
);
```

### AI Features Usage
```tsx
import { extractLeadsFromText, scoreLeads } from "@/components/leads/action";

// Extract leads from text
const extraction = await extractLeadsFromText({
  rawText: "Contact John Doe at john@example.com...",
  source: "web",
  options: { autoScore: true }
});

// Score multiple leads
const scores = await scoreLeads(["lead-id-1", "lead-id-2"]);
```

## Validation Schemas

The block uses Zod for comprehensive validation:

```typescript
// Create lead validation
const createLeadSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  company: z.string().max(100).optional(),
  // ... more fields
});

// Filter validation
const leadFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum([...]).optional(),
  scoreMin: z.number().min(0).max(100).optional(),
  // ... more filters
});
```

## State Management

- **Server State**: Server actions with revalidation
- **Form State**: React Hook Form with Zod resolvers
- **UI State**: Local state for modals, sheets, filters
- **Optimistic Updates**: Immediate UI feedback

## Performance Optimizations

1. **Server Components**: Data fetching on server
2. **Pagination**: Server-side pagination for large datasets
3. **Caching**: Next.js cache with proper revalidation
4. **Lazy Loading**: Dynamic imports for heavy components
5. **Debouncing**: Search and filter inputs

## Security

1. **Authentication**: Required via `requireAuth()`
2. **User Isolation**: Data scoped by userId
3. **Input Validation**: Zod schemas on all inputs
4. **Type Safety**: Full TypeScript coverage

## Recent Changes

### Latest Updates (Lead Agent Interface)
- **NEW: Lead Agent Prompt**: Added full-screen hero section with AI prompt interface
- **NEW: Vercel AI Elements**: Integrated prompt-input component following Vercel patterns
- **NEW: Custom Icons**: Added PlusIcon, AttachIcon, VoiceIcon, SendUpIcon
- **NEW: File Upload**: Support for CSV/Excel file processing
- **ENHANCED: UI Flow**: Smooth navigation between prompt and leads table

### Architecture Refactor
- **Removed nested folders**: No more `ai/` or `clients/` subdirectories
- **Flat structure**: All files now in `/components/leads/`
- **Simplified imports**: Direct imports from leads folder
- **Consolidated actions**: All server actions in single `action.ts`
- **Standard page pattern**: Minimal page.tsx with metadata only

### Migration Notes
- Old path: `/components/leads/ai/action.ts` → New: `/components/leads/action.ts`
- Old path: `/components/leads/clients/*` → Removed or merged
- Page now uses standard pattern with `LeadsContent` component
- Added `prompt.tsx` for AI Lead Agent interface
- Added `prompt-input.tsx` and `icons.tsx` to `/components/atom/`

## Testing Checklist

### Lead Agent Interface
- [ ] Prompt input accepts text and files
- [ ] File upload supports CSV/Excel formats
- [ ] Submit button enables with content
- [ ] Processing state shows visual feedback
- [ ] Smooth scroll to leads table works
- [ ] Voice button displays (future implementation)

### Core Functionality
- [ ] Server action error handling
- [ ] Form validation
- [ ] AI extraction accuracy
- [ ] Bulk operations
- [ ] Filter combinations
- [ ] Mobile responsiveness
- [ ] RTL support

## Known Issues
See [ISSUE.md](./ISSUE.md) for current issues and roadmap.

## Future Enhancements
- Email campaign integration
- Advanced analytics dashboard
- Workflow automation
- CRM integrations (Salesforce, HubSpot)
- Lead nurturing sequences