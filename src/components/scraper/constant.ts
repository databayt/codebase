// Static data, enums, and configuration for Web Scraper

import type { PageType, LeadPotential, ScrapeStrategy, ScrapeStatus } from './type';

// Page types with descriptions
export const PAGE_TYPES = [
  { value: 'landing' as PageType, label: 'Landing Page', icon: '🏠', leadPotential: 'medium' },
  { value: 'about' as PageType, label: 'About Us', icon: '📖', leadPotential: 'high' },
  { value: 'team' as PageType, label: 'Team', icon: '👥', leadPotential: 'high' },
  { value: 'contact' as PageType, label: 'Contact', icon: '📞', leadPotential: 'high' },
  { value: 'pricing' as PageType, label: 'Pricing', icon: '💰', leadPotential: 'low' },
  { value: 'product' as PageType, label: 'Product', icon: '📦', leadPotential: 'low' },
  { value: 'blog' as PageType, label: 'Blog', icon: '📝', leadPotential: 'medium' },
  { value: 'careers' as PageType, label: 'Careers', icon: '💼', leadPotential: 'medium' },
  { value: 'partners' as PageType, label: 'Partners', icon: '🤝', leadPotential: 'high' },
  { value: 'testimonials' as PageType, label: 'Testimonials', icon: '⭐', leadPotential: 'medium' },
  { value: 'case-studies' as PageType, label: 'Case Studies', icon: '📊', leadPotential: 'medium' },
  { value: 'unknown' as PageType, label: 'Unknown', icon: '❓', leadPotential: 'low' },
];

// Lead potential levels
export const LEAD_POTENTIAL_LEVELS = [
  {
    value: 'high' as LeadPotential,
    label: 'High',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Excellent source for leads',
  },
  {
    value: 'medium' as LeadPotential,
    label: 'Medium',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: 'Moderate lead potential',
  },
  {
    value: 'low' as LeadPotential,
    label: 'Low',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: 'Limited lead potential',
  },
  {
    value: 'none' as LeadPotential,
    label: 'None',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    description: 'No lead potential',
  },
];

// Scraping strategies
export const SCRAPE_STRATEGIES = [
  {
    value: 'single' as ScrapeStrategy,
    label: 'Single Page',
    description: 'Scrape only the specified URL',
    icon: '📄',
    maxPages: 1,
  },
  {
    value: 'breadth' as ScrapeStrategy,
    label: 'Breadth First',
    description: 'Scrape all pages at the same level',
    icon: '↔️',
    maxPages: 50,
  },
  {
    value: 'depth' as ScrapeStrategy,
    label: 'Depth First',
    description: 'Follow links to specified depth',
    icon: '↕️',
    maxPages: 100,
  },
  {
    value: 'sitemap' as ScrapeStrategy,
    label: 'Sitemap',
    description: 'Use sitemap.xml for navigation',
    icon: '🗺️',
    maxPages: 500,
  },
  {
    value: 'smart' as ScrapeStrategy,
    label: 'Smart Crawl',
    description: 'AI-guided intelligent crawling',
    icon: '🧠',
    maxPages: 200,
  },
];

// Scrape status options
export const SCRAPE_STATUS_OPTIONS = [
  { value: 'pending' as ScrapeStatus, label: 'Pending', color: 'bg-gray-100 text-gray-800' },
  { value: 'running' as ScrapeStatus, label: 'Running', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed' as ScrapeStatus, label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'failed' as ScrapeStatus, label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'cancelled' as ScrapeStatus, label: 'Cancelled', color: 'bg-orange-100 text-orange-800' },
];

// Common URL patterns for lead-rich pages
export const LEAD_RICH_PATTERNS = [
  { pattern: /\/about/i, weight: 0.8, reason: 'About pages often contain team info' },
  { pattern: /\/team/i, weight: 0.9, reason: 'Team pages have direct contact info' },
  { pattern: /\/contact/i, weight: 0.95, reason: 'Contact pages are primary lead sources' },
  { pattern: /\/staff/i, weight: 0.85, reason: 'Staff directories contain multiple contacts' },
  { pattern: /\/people/i, weight: 0.85, reason: 'People pages list team members' },
  { pattern: /\/leadership/i, weight: 0.8, reason: 'Leadership pages target decision makers' },
  { pattern: /\/management/i, weight: 0.8, reason: 'Management teams are key contacts' },
  { pattern: /\/partners/i, weight: 0.7, reason: 'Partner pages may have contacts' },
  { pattern: /\/investors/i, weight: 0.6, reason: 'Investor relations contacts' },
  { pattern: /\/press/i, weight: 0.5, reason: 'Press contacts available' },
];

// Patterns to avoid
export const AVOID_PATTERNS = [
  { pattern: /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar)$/i, reason: 'Binary files' },
  { pattern: /\.(jpg|jpeg|png|gif|svg|webp|ico)$/i, reason: 'Image files' },
  { pattern: /\.(mp3|mp4|avi|mov|wmv)$/i, reason: 'Media files' },
  { pattern: /\/api\//i, reason: 'API endpoints' },
  { pattern: /\/cdn\//i, reason: 'CDN resources' },
  { pattern: /\/assets\//i, reason: 'Asset directories' },
  { pattern: /\#/i, reason: 'Anchor links' },
  { pattern: /javascript:/i, reason: 'JavaScript URLs' },
  { pattern: /mailto:/i, reason: 'Email links' },
  { pattern: /tel:/i, reason: 'Phone links' },
];

// Common selectors for different page elements
export const COMMON_SELECTORS = {
  title: ['h1', 'h2', '.title', '.page-title', '[class*="title"]'],
  content: ['main', 'article', '.content', '.main-content', '[role="main"]'],
  contacts: ['.contact', '.team', '.staff', '.people', '[class*="contact"]'],
  email: ['a[href^="mailto:"]', '[class*="email"]', '[type="email"]'],
  phone: ['a[href^="tel:"]', '[class*="phone"]', '[class*="tel"]'],
  social: ['a[href*="linkedin"]', 'a[href*="twitter"]', 'a[href*="facebook"]'],
  address: ['address', '.address', '[class*="address"]', '[itemprop="address"]'],
};

// Technologies detection patterns
export const TECHNOLOGY_PATTERNS = [
  { name: 'WordPress', pattern: /wp-content|wordpress/i },
  { name: 'React', pattern: /react|_next/i },
  { name: 'Angular', pattern: /ng-|angular/i },
  { name: 'Vue', pattern: /vue|v-cloak/i },
  { name: 'Shopify', pattern: /shopify|myshopify/i },
  { name: 'Squarespace', pattern: /squarespace/i },
  { name: 'Wix', pattern: /wix\.com/i },
  { name: 'HubSpot', pattern: /hubspot/i },
  { name: 'Google Analytics', pattern: /google-analytics|gtag/i },
  { name: 'Google Tag Manager', pattern: /googletagmanager/i },
];

// Social platform configurations
export const SOCIAL_PLATFORMS = [
  { name: 'LinkedIn', pattern: /linkedin\.com/i, icon: '💼' },
  { name: 'Twitter', pattern: /twitter\.com|x\.com/i, icon: '🐦' },
  { name: 'Facebook', pattern: /facebook\.com/i, icon: '📘' },
  { name: 'Instagram', pattern: /instagram\.com/i, icon: '📷' },
  { name: 'GitHub', pattern: /github\.com/i, icon: '🐙' },
  { name: 'YouTube', pattern: /youtube\.com/i, icon: '📺' },
  { name: 'TikTok', pattern: /tiktok\.com/i, icon: '🎵' },
  { name: 'Medium', pattern: /medium\.com/i, icon: '📰' },
];

// Content quality indicators
export const CONTENT_QUALITY_INDICATORS = {
  high: [
    'comprehensive', 'detailed', 'in-depth', 'expert', 'professional',
    'authoritative', 'research', 'analysis', 'case study', 'white paper'
  ],
  medium: [
    'overview', 'introduction', 'guide', 'tutorial', 'how-to',
    'tips', 'best practices', 'examples', 'resources'
  ],
  low: [
    'coming soon', 'under construction', 'placeholder', 'lorem ipsum',
    'test', 'demo', 'sample', 'example'
  ],
};

// AI Model configurations for scraping
export const AI_MODELS = {
  extraction: {
    provider: 'groq',
    model: 'llama-3.1-70b-versatile',
    label: 'Groq Llama 3.1 70B',
    costPer1M: 0.70,
  },
  analysis: {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    label: 'Claude 3.5 Sonnet',
    costPer1M: 3.00,
  },
  summarization: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    label: 'GPT-4o Mini',
    costPer1M: 0.15,
  },
};

// Default values
export const DEFAULT_SCRAPE_STRATEGY: ScrapeStrategy = 'single';
export const DEFAULT_MAX_PAGES = 10;
export const DEFAULT_MAX_DEPTH = 2;
export const DEFAULT_TIMEOUT = 30000; // 30 seconds
export const DEFAULT_RETRY_ATTEMPTS = 3;
export const DEFAULT_CONCURRENT_REQUESTS = 5;

// Rate limiting
export const RATE_LIMITS = {
  requestsPerSecond: 2,
  requestsPerMinute: 60,
  requestsPerHour: 1000,
  cooldownMs: 1000, // 1 second between requests
};

// Validation rules
export const VALIDATION_RULES = {
  urlMaxLength: 2000,
  maxPagesLimit: 1000,
  maxDepthLimit: 5,
  contentMinLength: 100,
  contentMaxLength: 1000000, // 1MB
  selectorsMaxCount: 20,
  patternsMaxCount: 50,
};