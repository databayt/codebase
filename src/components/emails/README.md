# Emails Block

## Overview
The Emails block provides comprehensive email automation capabilities for sales and marketing campaigns. It follows the standardized architecture pattern with AI-powered features for template generation, campaign management, and analytics.

## Architecture

### Directory Structure (Standardized)
```
src/
├── app/[lang]/(blocks)/emails/
│   └── page.tsx                 # Simple page wrapper importing EmailsContent
├── components/emails/
│   ├── action.ts                # Server actions for email operations
│   ├── content.tsx              # Main UI orchestration
│   ├── README.md                # This file
│   └── ISSUE.md                 # Known issues & roadmap
```

## Core Features

### 1. Email Campaign Management
- **Campaign Creation**: Build and manage email campaigns
- **Template Library**: Pre-built templates for various purposes
- **Scheduling**: Schedule emails for optimal sending times
- **Recipient Management**: Manage contact lists and segments

### 2. AI-Powered Features
- **Template Generation**: AI-generated email templates
- **Personalization**: Dynamic content based on recipient data
- **Effectiveness Analysis**: Predict open and click rates
- **Follow-up Sequences**: Automated follow-up generation
- **Spam Risk Assessment**: Check content for spam triggers

### 3. User Interface
- **Compose Dialog**: Rich email composer with AI assistance
- **Campaign Dashboard**: Visual metrics and KPIs
- **Template Gallery**: Browse and use email templates
- **Sequence Builder**: Create automated email workflows
- **Analytics View**: Track campaign performance

## Server Actions (action.ts)

### Email Generation
```typescript
generatePersonalizedEmail()      // AI-powered personalization
generateEmailTemplateStreaming()  // Stream template generation
generateFollowUpSequence()        // Create follow-up emails
```

### Campaign Analysis
```typescript
analyzeEmailEffectiveness()      // Analyze email content
predictOpenRate()                 // Predict engagement
assessSpamRisk()                  // Check for spam triggers
```

## Component Structure

### Main Content Component
```tsx
import EmailsContent from "@/components/emails/content";

// In page.tsx
export default function Emails() {
  return <EmailsContent />;
}
```

### Key UI Sections
- **Stats Cards**: Display key metrics (emails sent, open rate, templates, recipients)
- **Tabs Navigation**: Campaigns, Templates, Sequences, Analytics
- **Compose Dialog**: Full-featured email composer
- **Template Selection**: Quick template access

## AI Features

### Template Generation
- Professional, friendly, or casual tone options
- Industry-specific templates
- Purpose-driven content (cold outreach, follow-up, etc.)

### Email Analysis
```typescript
interface EmailAnalysis {
  overallScore: number
  scores: {
    subjectLine: number
    personalization: number
    clarity: number
    valueProposition: number
    callToAction: number
    tone: number
  }
  strengths: string[]
  improvements: string[]
  predictedOpenRate: number
  predictedClickRate: number
  spamRisk: 'low' | 'medium' | 'high'
}
```

### Follow-up Sequences
- Automated sequence generation
- Time-based scheduling
- Content variation for each follow-up
- Response tracking

## State Management

- **Local State**: Email content, recipients, templates
- **Server State**: Campaign data, analytics
- **UI State**: Modal/dialog states, active tabs
- **Streaming State**: Real-time AI generation

## Recent Changes (Architecture Refactor)

### What Changed
- **Removed nested AI folder**: Flattened structure
- **Moved actions**: Server actions from app to components
- **Standard page pattern**: Minimal page.tsx
- **New content.tsx**: Main UI orchestration component

### Migration Notes
- Old: `/app/[lang]/(blocks)/emails/actions.ts` → New: `/components/emails/action.ts`
- Old: Complex page component → New: Simple wrapper with EmailsContent
- All email logic now centralized in components folder

## Testing Checklist

- [ ] Email composition
- [ ] Template generation
- [ ] Campaign creation
- [ ] Recipient management
- [ ] AI analysis accuracy
- [ ] Follow-up generation
- [ ] Sending functionality
- [ ] Analytics tracking

## Known Issues
See [ISSUE.md](./ISSUE.md) for current issues and roadmap.

## Future Enhancements
- Email provider integration (Gmail, Outlook, SendGrid)
- Advanced personalization with merge tags
- A/B testing capabilities
- Bounce and unsubscribe handling
- Email warm-up features
- Multi-language support
- Visual email builder