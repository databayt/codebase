/**
 * Constants for the Leads feature
 * Contains static data, enums, and configuration values
 */

// Lead status options (matching Prisma enum)
export const LEAD_STATUS = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  PROPOSAL: 'PROPOSAL',
  NEGOTIATION: 'NEGOTIATION',
  CLOSED_WON: 'CLOSED_WON',
  CLOSED_LOST: 'CLOSED_LOST',
  ARCHIVED: 'ARCHIVED',
} as const;

// Lead source options (matching Prisma enum)
export const LEAD_SOURCE = {
  MANUAL: 'MANUAL',
  IMPORT: 'IMPORT',
  API: 'API',
  WEBSITE: 'WEBSITE',
  REFERRAL: 'REFERRAL',
  SOCIAL_MEDIA: 'SOCIAL_MEDIA',
  EMAIL_CAMPAIGN: 'EMAIL_CAMPAIGN',
  COLD_CALL: 'COLD_CALL',
  CONFERENCE: 'CONFERENCE',
  PARTNER: 'PARTNER',
} as const;

// Lead score ranges
export const LEAD_SCORE_RANGES = {
  HOT: { min: 80, max: 100, label: 'Hot', color: 'red' },
  WARM: { min: 60, max: 79, label: 'Warm', color: 'orange' },
  COOL: { min: 40, max: 59, label: 'Cool', color: 'yellow' },
  COLD: { min: 0, max: 39, label: 'Cold', color: 'blue' },
} as const;

// Table pagination options
export const PAGINATION_OPTIONS = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// AI extraction models
export const AI_MODELS = {
  EXTRACTION: {
    DEFAULT: 'gpt-4-turbo',
    FALLBACK: 'gpt-3.5-turbo',
  },
  ENRICHMENT: {
    DEFAULT: 'gpt-4',
    FALLBACK: 'gpt-3.5-turbo',
  },
} as const;

// Field visibility defaults
export const DEFAULT_VISIBLE_FIELDS = [
  'name',
  'email',
  'company',
  'title',
  'score',
  'status',
  'createdAt',
] as const;

// Bulk operation limits
export const BULK_OPERATION_LIMITS = {
  MAX_SELECTION: 100,
  MAX_EXPORT: 5000,
  MAX_IMPORT: 1000,
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  AI_EXTRACTION: true,
  BULK_OPERATIONS: true,
  EMAIL_INTEGRATION: true,
  LINKEDIN_SCRAPING: false, // Coming soon
  AUTOMATED_FOLLOW_UP: false, // Coming soon
} as const;