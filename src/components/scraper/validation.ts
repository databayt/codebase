// Zod schemas for data validation and type generation

import { z } from 'zod';
import {
  PAGE_TYPES,
  LEAD_POTENTIAL_LEVELS,
  SCRAPE_STRATEGIES,
  SCRAPE_STATUS_OPTIONS,
  VALIDATION_RULES,
} from './constant';

// URL validation helper
const urlSchema = z.string()
  .url('Invalid URL format')
  .max(VALIDATION_RULES.urlMaxLength, `URL must be less than ${VALIDATION_RULES.urlMaxLength} characters`);

// Scraped page schema
export const scrapedPageSchema = z.object({
  id: z.string().uuid().optional(),
  url: urlSchema,
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string()
    .min(VALIDATION_RULES.contentMinLength, 'Content too short')
    .max(VALIDATION_RULES.contentMaxLength, 'Content too large'),
  html: z.string().optional(),
  markdown: z.string().optional(),
  pageType: z.enum(PAGE_TYPES.map(t => t.value) as [string, ...string[]]).optional(),
  leadPotential: z.enum(LEAD_POTENTIAL_LEVELS.map(l => l.value) as [string, ...string[]]).optional(),
  extractedAt: z.date().optional(),
  processingTime: z.number().positive().optional(),
  error: z.string().optional(),
  metadata: z.object({
    domain: z.string().optional(),
    language: z.string().optional(),
    author: z.string().optional(),
    publishedDate: z.date().optional(),
    modifiedDate: z.date().optional(),
    keywords: z.array(z.string()).optional(),
    socialLinks: z.array(z.object({
      platform: z.string(),
      url: z.string().url(),
      handle: z.string().optional(),
    })).optional(),
    images: z.array(z.string().url()).optional(),
    scripts: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
  }).optional(),
  userId: z.string().optional(),
});

// Extracted lead schema
export const extractedLeadSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email').optional(),
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format')
    .optional(),
  title: z.string().optional(),
  company: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  location: z.string().optional(),
  department: z.string().optional(),
  confidence: z.number().min(0).max(100),
  sourceUrl: urlSchema,
  context: z.string().optional(),
});

// Company info schema
export const companyInfoSchema = z.object({
  name: z.string(),
  domain: z.string(),
  description: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  location: z.string().optional(),
  founded: z.string().optional(),
  website: z.string().url().optional(),
  socialProfiles: z.array(z.object({
    platform: z.string(),
    url: z.string().url(),
    followers: z.number().optional(),
    verified: z.boolean().optional(),
  })).optional(),
  technologies: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  keyPeople: z.array(extractedLeadSchema).optional(),
});

// Scrape request schema
export const scrapeRequestSchema = z.object({
  url: urlSchema,
  strategy: z.enum(SCRAPE_STRATEGIES.map(s => s.value) as [string, ...string[]]).default('single'),
  depth: z.number()
    .min(1)
    .max(VALIDATION_RULES.maxDepthLimit)
    .optional(),
  maxPages: z.number()
    .min(1)
    .max(VALIDATION_RULES.maxPagesLimit)
    .optional(),
  includeSubdomains: z.boolean().default(false),
  filters: z.object({
    includePatterns: z.array(z.string()).max(VALIDATION_RULES.patternsMaxCount).optional(),
    excludePatterns: z.array(z.string()).max(VALIDATION_RULES.patternsMaxCount).optional(),
    contentTypes: z.array(z.string()).optional(),
    minContentLength: z.number().positive().optional(),
    maxContentLength: z.number().positive().optional(),
    languages: z.array(z.string()).optional(),
  }).optional(),
  options: z.object({
    extractLeads: z.boolean().default(true),
    analyzeContent: z.boolean().default(true),
    followRedirects: z.boolean().default(true),
    respectRobotsTxt: z.boolean().default(true),
    userAgent: z.string().optional(),
    timeout: z.number().positive().optional(),
  }).optional(),
});

// Lead extraction request schema
export const leadExtractionRequestSchema = z.object({
  url: urlSchema,
  content: z.string()
    .min(VALIDATION_RULES.contentMinLength)
    .max(VALIDATION_RULES.contentMaxLength),
  pageType: z.enum(PAGE_TYPES.map(t => t.value) as [string, ...string[]]).optional(),
  selectors: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    contacts: z.string().optional(),
    team: z.string().optional(),
    about: z.string().optional(),
    social: z.string().optional(),
  }).optional(),
  options: z.object({
    extractCompanyInfo: z.boolean().default(true),
    useAI: z.boolean().default(true),
    confidenceThreshold: z.number().min(0).max(100).default(50),
  }).optional(),
});

// Page analysis request schema
export const pageAnalysisRequestSchema = z.object({
  url: urlSchema,
  content: z.string(),
  html: z.string().optional(),
  options: z.object({
    analyzeSEO: z.boolean().default(false),
    analyzeReadability: z.boolean().default(false),
    analyzeSentiment: z.boolean().default(false),
    extractKeyTopics: z.boolean().default(true),
  }).optional(),
});

// Multi-page scrape request schema
export const multiPageScrapeRequestSchema = z.object({
  startUrl: urlSchema,
  strategy: z.enum(SCRAPE_STRATEGIES.map(s => s.value) as [string, ...string[]]),
  maxPages: z.number()
    .min(1)
    .max(VALIDATION_RULES.maxPagesLimit)
    .default(10),
  depth: z.number()
    .min(1)
    .max(VALIDATION_RULES.maxDepthLimit)
    .default(2),
  filters: z.object({
    includePatterns: z.array(z.string()).optional(),
    excludePatterns: z.array(z.string()).optional(),
    sameDomainOnly: z.boolean().default(true),
  }).optional(),
  options: z.object({
    concurrent: z.number().min(1).max(10).default(3),
    delayMs: z.number().min(0).default(1000),
    retryAttempts: z.number().min(0).max(5).default(3),
  }).optional(),
});

// Scraping template schema
export const scrapingTemplateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  urlPattern: z.string(),
  selectors: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    contacts: z.string().optional(),
    team: z.string().optional(),
    about: z.string().optional(),
    social: z.string().optional(),
  }).optional(),
  strategy: z.enum(SCRAPE_STRATEGIES.map(s => s.value) as [string, ...string[]]),
  filters: z.object({
    includePatterns: z.array(z.string()).optional(),
    excludePatterns: z.array(z.string()).optional(),
    contentTypes: z.array(z.string()).optional(),
    minContentLength: z.number().optional(),
    maxContentLength: z.number().optional(),
    languages: z.array(z.string()).optional(),
  }).optional(),
  extractionRules: z.array(z.object({
    field: z.string(),
    selector: z.string().optional(),
    pattern: z.string().optional(),
    transform: z.string().optional(),
    required: z.boolean().default(false),
  })).optional(),
  isActive: z.boolean().default(true),
  successRate: z.number().min(0).max(100).optional(),
  usageCount: z.number().min(0).default(0),
  userId: z.string().optional(),
});

// Scrape filter schema
export const scrapeFilterSchema = z.object({
  search: z.string().optional(),
  status: z.array(z.enum(SCRAPE_STATUS_OPTIONS.map(s => s.value) as [string, ...string[]])).optional(),
  pageType: z.array(z.enum(PAGE_TYPES.map(t => t.value) as [string, ...string[]])).optional(),
  leadPotential: z.array(z.enum(LEAD_POTENTIAL_LEVELS.map(l => l.value) as [string, ...string[]])).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  domain: z.string().optional(),
  hasLeads: z.boolean().optional(),
  hasError: z.boolean().optional(),
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['extractedAt', 'url', 'leadPotential', 'processingTime']).default('extractedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Export types
export type ScrapedPage = z.infer<typeof scrapedPageSchema>;
export type ExtractedLead = z.infer<typeof extractedLeadSchema>;
export type CompanyInfo = z.infer<typeof companyInfoSchema>;
export type ScrapeRequest = z.infer<typeof scrapeRequestSchema>;
export type LeadExtractionRequest = z.infer<typeof leadExtractionRequestSchema>;
export type PageAnalysisRequest = z.infer<typeof pageAnalysisRequestSchema>;
export type MultiPageScrapeRequest = z.infer<typeof multiPageScrapeRequestSchema>;
export type ScrapingTemplate = z.infer<typeof scrapingTemplateSchema>;
export type ScrapeFilter = z.infer<typeof scrapeFilterSchema>;

// Validation helpers
export function validateUrl(url: string): { success: boolean; error?: string } {
  try {
    urlSchema.parse(url);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Invalid URL' };
  }
}

export function validateScrapeRequest(data: unknown): { success: boolean; data?: ScrapeRequest; error?: string } {
  try {
    const validated = scrapeRequestSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Invalid scrape request' };
  }
}