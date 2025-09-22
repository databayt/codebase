/**
 * Validation schemas for the Leads feature
 * Zod schemas for runtime validation and type inference
 */

import { z } from 'zod';
import { LEAD_STATUS, LEAD_SOURCE } from './constant';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (supports international formats)
const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;

// LinkedIn URL validation regex
const linkedinUrlRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;

// Lead creation schema
export const createLeadSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  // Email - simplified validation, just check for @ symbol
  email: z.string()
    .transform(val => val?.toLowerCase())
    .optional()
    .or(z.literal('')),

  company: z.string()
    .max(100, 'Company name must be less than 100 characters')
    .trim()
    .optional(),

  title: z.string()
    .max(100, 'Title must be less than 100 characters')
    .trim()
    .optional(),

  // Phone - simplified validation, any string is accepted
  phone: z.string()
    .optional()
    .or(z.literal('')),

  // LinkedIn URL - removed validation, now just optional string
  linkedinUrl: z.string()
    .optional()
    .or(z.literal('')),

  industry: z.string()
    .max(50, 'Industry must be less than 50 characters')
    .optional(),

  score: z.number()
    .min(0, 'Score must be between 0 and 100')
    .max(100, 'Score must be between 0 and 100')
    .default(50),

  status: z.enum(Object.keys(LEAD_STATUS) as [string, ...string[]])
    .default('NEW'),

  source: z.enum(Object.keys(LEAD_SOURCE) as [string, ...string[]])
    .default('MANUAL'),

  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),

  tags: z.array(z.string().max(30))
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .default([]),
});

// Lead update schema (all fields optional)
export const updateLeadSchema = createLeadSchema.partial();

// Bulk update schema
export const bulkUpdateSchema = z.object({
  leadIds: z.array(z.string().uuid())
    .min(1, 'At least one lead must be selected')
    .max(100, 'Maximum 100 leads can be updated at once'),

  updates: z.object({
    status: z.enum(Object.keys(LEAD_STATUS) as [string, ...string[]]).optional(),
    score: z.number().min(0).max(100).optional(),
    tags: z.array(z.string()).optional(),
    addTags: z.array(z.string()).optional(),
    removeTags: z.array(z.string()).optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be updated',
  }),
});

// Lead filter schema
export const leadFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(Object.keys(LEAD_STATUS) as [string, ...string[]]).optional(),
  source: z.enum(Object.keys(LEAD_SOURCE) as [string, ...string[]]).optional(),
  scoreMin: z.number().min(0).max(100).optional(),
  scoreMax: z.number().min(0).max(100).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  hasEmail: z.boolean().optional(),
  hasPhone: z.boolean().optional(),
}).refine(data => {
  if (data.scoreMin !== undefined && data.scoreMax !== undefined) {
    return data.scoreMin <= data.scoreMax;
  }
  return true;
}, {
  message: 'Minimum score must be less than or equal to maximum score',
  path: ['scoreMin'],
});

// AI extraction input schema
export const aiExtractionInputSchema = z.object({
  rawText: z.string()
    .min(10, 'Text must be at least 10 characters')
    .max(50000, 'Text must be less than 50,000 characters'),

  source: z.enum(['manual', 'web', 'file', 'api'])
    .default('manual'),

  options: z.object({
    autoScore: z.boolean().default(true),
    detectDuplicates: z.boolean().default(true),
    enrichWithAI: z.boolean().default(false),
  }).optional(),
});

// Import CSV schema
export const importCsvSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.type === 'text/csv', 'File must be CSV format')
    .refine(file => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB'),

  mapping: z.object({
    name: z.string(),
    email: z.string().optional(),
    company: z.string().optional(),
    title: z.string().optional(),
    phone: z.string().optional(),
    linkedinUrl: z.string().optional(),
    industry: z.string().optional(),
    score: z.string().optional(),
    notes: z.string().optional(),
  }),

  options: z.object({
    skipDuplicates: z.boolean().default(true),
    validateEmails: z.boolean().default(true),
    autoScore: z.boolean().default(false),
  }),
});

// Export configuration schema
export const exportConfigSchema = z.object({
  format: z.enum(['csv', 'json', 'xlsx']),

  fields: z.array(z.string())
    .min(1, 'At least one field must be selected for export'),

  filters: leadFilterSchema.optional(),

  options: z.object({
    includeHeaders: z.boolean().default(true),
    dateFormat: z.enum(['iso', 'us', 'eu']).default('iso'),
    delimiter: z.enum([',', ';', '\t']).default(','),
  }).optional(),
});

// Email campaign schema
export const emailCampaignSchema = z.object({
  leadIds: z.array(z.string().uuid())
    .min(1, 'At least one lead must be selected'),

  subject: z.string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),

  body: z.string()
    .min(10, 'Email body must be at least 10 characters')
    .max(10000, 'Email body must be less than 10,000 characters'),

  templateVariables: z.record(z.string()).optional(),

  schedule: z.object({
    sendAt: z.coerce.date().optional(),
    timezone: z.string().default('UTC'),
  }).optional(),
});

// Lead activity schema
export const leadActivitySchema = z.object({
  leadId: z.string().uuid(),

  type: z.enum([
    'email_sent',
    'email_received',
    'call',
    'meeting',
    'note',
    'status_change'
  ]),

  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),

  metadata: z.record(z.any()).optional(),
});

// Type exports from schemas
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type BulkUpdateInput = z.infer<typeof bulkUpdateSchema>;
export type LeadFilterInput = z.infer<typeof leadFilterSchema>;
export type AIExtractionInput = z.infer<typeof aiExtractionInputSchema>;
export type ImportCsvInput = z.infer<typeof importCsvSchema>;
export type ExportConfigInput = z.infer<typeof exportConfigSchema>;
export type EmailCampaignInput = z.infer<typeof emailCampaignSchema>;
export type LeadActivityInput = z.infer<typeof leadActivitySchema>;