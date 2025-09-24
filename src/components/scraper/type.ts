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
  // Core fields
  id?: string;
  name: string;
  email?: string;
  phone?: string;

  // Professional info
  company?: string;
  title?: string;
  department?: string;
  seniority?: 'entry' | 'mid' | 'senior' | 'executive';

  // Social profiles
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;

  // Location
  location?: string;
  country?: string;
  timezone?: string;

  // Metadata
  confidence: number;
  sourceUrl: string;
  extractedAt?: Date;
  context?: string;
  enrichedData?: any;
  validationStatus?: 'valid' | 'invalid' | 'unverified';
  qualityScore?: number;
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
  addedAt?: Date;
  processedAt?: Date;
  error?: string;
}

// Production-ready types
export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

export interface RateLimitConfig {
  requests: number;
  period: number;
  adaptiveBackoff?: boolean;
  respectCrawlDelay?: boolean;
}

export interface BrowserConfig {
  useHeadless: boolean;
  waitForSelector?: string;
  executeScript?: string;
  viewport?: { width: number; height: number };
  timeout?: number;
}

export interface CrawlConfig {
  strategy: 'breadth' | 'depth' | 'smart' | 'targeted';
  maxPages: number;
  maxDepth: number;
  concurrent: number;
  timeout: number;
  startUrl?: string;

  filters: {
    sameDomainOnly: boolean;
    includePatterns: string[];
    excludePatterns: string[];
    contentTypes?: string[];
  };

  rateLimit?: RateLimitConfig;
  browser?: BrowserConfig;
  retry?: RetryConfig;

  export?: {
    format: 'csv' | 'json' | 'excel';
    realtime: boolean;
    webhook?: string;
  };
}

export interface QueueStatus {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  totalUrls: number;
  averageProcessingTime: number;
  estimatedTimeRemaining: number;
}

export interface WorkerStatus {
  id: string;
  status: 'idle' | 'busy' | 'error';
  currentUrl?: string;
  processedCount: number;
  errorCount: number;
  startTime: Date;
  lastActivity: Date;
}

export interface DashboardMetrics {
  throughput: number;
  successRate: number;
  avgLatency: number;
  queueDepth: number;
  activeWorkers: number;
  memoryUsage: number;
  errorRate: number;
  totalPages: number;
  totalLeads: number;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'excel' | 'xml';
  fields?: string[];
  customMapping?: Record<string, string>;
  includeMetadata?: boolean;
  compression?: boolean;
}

export interface WebhookConfig {
  url: string;
  events: string[];
  headers?: Record<string, string>;
  retryPolicy?: {
    maxAttempts: number;
    backoff: 'linear' | 'exponential';
  };
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'email' | 'phone' | 'url' | 'regex';
  pattern?: string;
  message?: string;
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