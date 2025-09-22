// Domain and UI types for Web Scraper

export interface ScrapedPage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  content: string;
  html?: string;
  markdown?: string;
  pageType?: PageType;
  leadPotential?: LeadPotential;
  extractedAt: Date;
  processingTime?: number;
  error?: string;
  metadata?: PageMetadata;
  userId?: string;
}

export type PageType =
  | 'landing'
  | 'about'
  | 'team'
  | 'contact'
  | 'pricing'
  | 'product'
  | 'blog'
  | 'careers'
  | 'partners'
  | 'testimonials'
  | 'case-studies'
  | 'unknown';

export type LeadPotential = 'high' | 'medium' | 'low' | 'none';

export interface PageMetadata {
  domain?: string;
  language?: string;
  author?: string;
  publishedDate?: Date;
  modifiedDate?: Date;
  keywords?: string[];
  socialLinks?: SocialLink[];
  images?: string[];
  scripts?: string[];
  technologies?: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  handle?: string;
}

export interface ExtractedLead {
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  company?: string;
  linkedinUrl?: string;
  location?: string;
  department?: string;
  confidence: number;
  sourceUrl: string;
  context?: string;
}

export interface CompanyInfo {
  name: string;
  domain: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
  founded?: string;
  website?: string;
  socialProfiles?: SocialProfile[];
  technologies?: string[];
  services?: string[];
  keyPeople?: ExtractedLead[];
}

export interface SocialProfile {
  platform: string;
  url: string;
  followers?: number;
  verified?: boolean;
}

export interface ScrapeJob {
  id: string;
  url: string;
  status: ScrapeStatus;
  strategy: ScrapeStrategy;
  depth?: number;
  maxPages?: number;
  includeSubdomains?: boolean;
  filters?: ScrapeFilters;
  results?: ScrapedPage[];
  leads?: ExtractedLead[];
  companyInfo?: CompanyInfo;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  userId: string;
}

export type ScrapeStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type ScrapeStrategy =
  | 'single'      // Single page
  | 'breadth'     // All pages at same level
  | 'depth'       // Follow links to specified depth
  | 'sitemap'     // Use sitemap.xml
  | 'smart';      // AI-guided crawling

export interface ScrapeFilters {
  includePatterns?: string[];
  excludePatterns?: string[];
  contentTypes?: string[];
  minContentLength?: number;
  maxContentLength?: number;
  languages?: string[];
}

export interface PageAnalysis {
  pageType: PageType;
  leadPotential: LeadPotential;
  companyInfo?: CompanyInfo;
  keyTopics: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  readabilityScore?: number;
  seoScore?: number;
  recommendations: string[];
}

export interface LeadExtractionResult {
  url: string;
  leads: ExtractedLead[];
  companyInfo?: CompanyInfo;
  confidence: number;
  extractionMethod: 'ai' | 'pattern' | 'structured';
  processingTime: number;
}

export interface ScrapingSession {
  id: string;
  name?: string;
  urls: string[];
  strategy: ScrapeStrategy;
  filters?: ScrapeFilters;
  totalPages: number;
  successfulPages: number;
  failedPages: number;
  totalLeads: number;
  startedAt: Date;
  completedAt?: Date;
  status: ScrapeStatus;
  userId: string;
}

export interface ScrapingTemplate {
  id: string;
  name: string;
  description?: string;
  urlPattern: string;
  selectors?: PageSelectors;
  strategy: ScrapeStrategy;
  filters?: ScrapeFilters;
  extractionRules?: ExtractionRule[];
  isActive: boolean;
  successRate?: number;
  usageCount: number;
  userId: string;
}

export interface PageSelectors {
  title?: string;
  content?: string;
  contacts?: string;
  team?: string;
  about?: string;
  social?: string;
}

export interface ExtractionRule {
  field: string;
  selector?: string;
  pattern?: string;
  transform?: string;
  required?: boolean;
}

export interface ScrapeQueueItem {
  url: string;
  priority: number;
  depth: number;
  parentUrl?: string;
  retries: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

// API Response types
export interface ScrapeResponse {
  success: boolean;
  data?: ScrapedPage;
  error?: string;
}

export interface LeadExtractionResponse {
  success: boolean;
  data?: {
    leads: ExtractedLead[];
    companyInfo?: CompanyInfo;
    pageAnalysis?: PageAnalysis;
  };
  error?: string;
}

export interface MultiPageScrapeResponse {
  success: boolean;
  data?: {
    pages: ScrapedPage[];
    leads: ExtractedLead[];
    totalPages: number;
    successCount: number;
    failureCount: number;
  };
  error?: string;
}

export interface PageAnalysisResponse {
  success: boolean;
  data?: PageAnalysis;
  error?: string;
}

// Form types
export interface ScrapeFormData {
  url: string;
  strategy: ScrapeStrategy;
  depth?: number;
  maxPages?: number;
  includeSubdomains?: boolean;
  extractLeads?: boolean;
  analyzeContent?: boolean;
}

export interface ScrapeFiltersFormData {
  includePatterns?: string;
  excludePatterns?: string;
  contentTypes?: string[];
  languages?: string[];
}