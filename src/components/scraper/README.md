# Scraper Block

## Overview
The Scraper block provides AI-powered web scraping and lead extraction capabilities. It follows the standardized architecture pattern with features for intelligent content extraction, lead identification, and website analysis.

## Architecture

### Directory Structure (Standardized)
```
src/
├── app/[lang]/(blocks)/scraper/
│   └── page.tsx                 # Simple page wrapper importing ScraperContent
├── components/scraper/
│   ├── action.ts                # Server actions for scraping operations
│   ├── analytics.tsx            # Analytics dashboard
│   ├── constant.ts              # Static configuration and constants
│   ├── content.tsx              # Main UI orchestration
│   ├── extractor.tsx            # Lead extraction interface
│   ├── multi.tsx                # Multi-page crawler UI
│   ├── single.tsx               # Single page scraper UI
│   ├── type.ts                  # TypeScript type definitions
│   ├── use-scraper.ts           # React hooks for state management
│   ├── validation.ts            # Zod validation schemas
│   ├── README.md                # This file
│   └── ISSUE.md                 # Known issues & roadmap
```

## Core Features

### 1. Single Page Scraping
- **Smart Page Detection**: Identifies page types (team, about, contact, etc.)
- **Lead Potential Assessment**: Evaluates likelihood of finding leads
- **Content Extraction**: Preserves structure while extracting data
- **Data Cleaning**: Intelligent formatting and normalization

### 2. Multi-Page Crawling
- **Crawling Strategies**: Breadth-first, depth-first, targeted
- **Configurable Limits**: Control depth and page count
- **Domain Boundaries**: Stay within specified domains
- **Polite Crawling**: Rate limiting and robots.txt compliance

### 3. Lead Extraction
- **AI-Powered Identification**: Smart contact detection
- **Multi-Format Support**: Email signatures, team pages, contact lists
- **Confidence Scoring**: Quality assessment for each lead
- **Company Information**: Extract organizational data
- **Role Detection**: Identify departments and positions

### 4. Website Analysis
- **Page Type Classification**: Automatic categorization
- **Lead Potential Scoring**: Assess value of pages
- **Company Information**: Extract business details
- **Recommendations**: AI suggestions for better extraction

## Server Actions (action.ts)

### Scraping Operations
```typescript
scrapeAndExtractLeads(url: string)        // Single page scrape
analyzeWebsite(url: string)               // Website analysis
scrapeMultiplePages(request)              // Multi-page crawl
extractLeadsFromPage(request)             // Extract from content
```

### Analysis Functions
```typescript
analyzePageForLeads(content: string)      // Lead potential
detectPageType(content: string)           // Page classification
assessLeadQuality(leads: Lead[])          // Quality scoring
```

## Data Models

### Scraped Lead Structure
```typescript
interface ScrapedLead {
  name?: string
  email?: string
  phone?: string
  company?: string
  title?: string
  linkedinUrl?: string
  website?: string
  location?: string
  confidence?: number
  source: string
}
```

### Page Analysis
```typescript
interface PageAnalysis {
  pageType: PageType
  hasContactInfo: boolean
  leadPotential: 'high' | 'medium' | 'low'
  companyInfo?: {
    name?: string
    industry?: string
    size?: string
    location?: string
  }
  recommendations: string[]
}
```

### Crawling Configuration
```typescript
interface CrawlConfig {
  strategy: 'breadth' | 'depth' | 'targeted'
  maxPages: number
  depth: number
  filters: {
    sameDomainOnly: boolean
    includePatterns: string[]
    excludePatterns: string[]
  }
}
```

## Page Types & Lead Potential

### High Potential Pages
- **team**: Team/staff pages (80%+ success)
- **contact**: Contact pages (80%+ success)
- **directory**: Staff directories (80%+ success)

### Medium Potential Pages
- **about**: About us pages (40-79% success)
- **bio**: Individual bio pages (40-79% success)
- **landing**: Landing pages (40-79% success)

### Low Potential Pages
- **blog**: Blog posts (<40% success)
- **product**: Product pages (<40% success)
- **news**: News articles (<40% success)

## Component Usage

### Main Content Component
```tsx
import ScraperContent from "@/components/scraper/content";

// In page.tsx
export default function Scraper() {
  return <ScraperContent />;
}
```

### Using Hooks
```tsx
import {
  useSinglePageScraper,
  useMultiPageScraper,
  useLeadExtractor
} from '@/components/scraper/use-scraper';

function MyComponent() {
  const { scrapePage, isLoading } = useSinglePageScraper();
  const { extractLeads } = useLeadExtractor();
  // Your logic here
}
```

### Server Actions Usage
```tsx
import { scrapeAndExtractLeads, analyzeWebsite } from '@/components/scraper/action';

// Scrape single page
const result = await scrapeAndExtractLeads('https://example.com/team');

// Analyze website
const analysis = await analyzeWebsite('https://example.com');
```

## Recent Changes (Architecture Refactor)

### What Changed
- **Removed nested AI folder**: Flattened structure from `/scraper/ai/*` to `/scraper/*`
- **Consolidated actions**: All server actions in single `action.ts`
- **Standard page pattern**: Minimal page.tsx with metadata only
- **Simplified imports**: Direct imports from scraper folder

### Migration Notes
- Old: `/components/scraper/ai/content.tsx` → New: `/components/scraper/content.tsx`
- Old: Complex page component → New: Simple wrapper pattern
- All scraping functionality preserved

## Best Practices

### Targeting
1. Focus on high-value pages (/team, /about, /contact)
2. Use targeted crawling strategy for efficiency
3. Set appropriate confidence thresholds (70%+)
4. Prioritize quality over quantity

### Compliance
1. Always check robots.txt
2. Implement reasonable delays (1000ms+)
3. Identify your crawler in User-Agent
4. Respect rate limits and backoff

### Performance
1. Use breadth-first for discovery
2. Limit depth for focused extraction
3. Monitor memory usage
4. Process pages in batches

### Data Quality
1. Set minimum confidence thresholds
2. Validate email formats
3. Verify lead completeness
4. Deduplicate results

## Testing Checklist

- [ ] Single page scraping
- [ ] Multi-page crawling
- [ ] Lead extraction accuracy
- [ ] Page type detection
- [ ] Company info extraction
- [ ] Rate limiting
- [ ] Error handling
- [ ] CSV export

## Known Issues
See [ISSUE.md](./ISSUE.md) for current issues and roadmap.

## Future Enhancements
- Browser automation with Puppeteer
- JavaScript rendering support
- API endpoint scraping
- LinkedIn integration
- CRM auto-import
- Scheduled scraping jobs
- Webhook notifications
- Advanced filtering rules