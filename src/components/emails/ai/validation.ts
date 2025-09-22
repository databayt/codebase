import { z } from 'zod';

// Email Template Schema
export const EmailTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100),
  subject: z.string().min(1, 'Subject is required').max(200),
  greeting: z.string().min(1).max(100),
  introduction: z.string().min(1).max(500),
  body: z.array(z.string().max(1000)).min(1).max(10),
  callToAction: z.string().min(1).max(200),
  closing: z.string().min(1).max(200),
  signature: z.string().min(1).max(300),
  tone: z.enum(['professional', 'friendly', 'casual', 'urgent']),
  purpose: z.enum([
    'cold_outreach',
    'follow_up',
    'product_launch',
    'meeting_request',
    'newsletter',
    'announcement',
    'invitation',
    'thank_you'
  ]),
  personalizationLevel: z.number().min(0).max(10),
  personalizationFields: z.array(
    z.enum(['firstName', 'lastName', 'company', 'title', 'industry', 'location', 'custom'])
  ).optional()
});

// Email Content Schema
export const EmailContentSchema = z.object({
  subject: z.string().min(1).max(200),
  preheader: z.string().max(150).optional(),
  htmlContent: z.string().min(1),
  textContent: z.string().min(1),
  personalizationTokens: z.record(z.string(), z.string()).optional(),
  trackingEnabled: z.boolean().optional().default(true)
});

// Lead Schema for Personalization
export const EmailLeadSchema = z.object({
  id: z.string(),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  linkedinUrl: z.string().url("Invalid URL format").optional().or(z.literal('')),
  notes: z.string().optional(),
  customFields: z.record(z.string(), z.any()).optional()
});

// Campaign Settings Schema
export const CampaignSettingsSchema = z.object({
  sendingSpeed: z.enum(['immediate', 'gradual', 'throttled']),
  batchSize: z.number().min(1).max(1000).optional(),
  delayBetweenBatches: z.number().min(1).max(1440).optional(), // max 24 hours in minutes
  trackOpens: z.boolean(),
  trackClicks: z.boolean(),
  replyTo: z.string().email().optional(),
  fromName: z.string().min(1).max(100),
  fromEmail: z.string().email(),
  unsubscribeLink: z.boolean(),
  footerText: z.string().max(500).optional()
});

// Email Campaign Schema
export const EmailCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(100),
  templateId: z.string().optional(),
  leadIds: z.array(z.string()).min(1, 'At least one lead is required'),
  scheduledTime: z.date().optional(),
  settings: CampaignSettingsSchema
});

// Email Analysis Schema
export const EmailAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  scores: z.object({
    subjectLine: z.number().min(0).max(100),
    personalization: z.number().min(0).max(100),
    clarity: z.number().min(0).max(100),
    valueProposition: z.number().min(0).max(100),
    callToAction: z.number().min(0).max(100),
    tone: z.number().min(0).max(100),
    length: z.number().min(0).max(100),
    readability: z.number().min(0).max(100)
  }),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  suggestions: z.array(z.string()),
  predictedOpenRate: z.number().min(0).max(100),
  predictedClickRate: z.number().min(0).max(100),
  predictedReplyRate: z.number().min(0).max(100),
  spamRisk: z.enum(['low', 'medium', 'high']),
  spamTriggers: z.array(z.string()).optional(),
  readingTime: z.number().min(0), // seconds
  sentimentScore: z.number().min(-1).max(1)
});

// Follow-up Email Schema
export const FollowUpEmailSchema = z.object({
  followUpNumber: z.number().min(1).max(10),
  daysAfterPrevious: z.number().min(1).max(90),
  subject: z.string().min(1).max(200),
  content: z.string().min(1),
  tone: z.enum(['professional', 'friendly', 'casual', 'urgent']),
  urgencyLevel: z.enum(['low', 'medium', 'high'])
});

// Follow-up Sequence Schema
export const FollowUpSequenceSchema = z.object({
  name: z.string().min(1).max(100),
  initialEmailId: z.string().optional(),
  numberOfFollowUps: z.number().min(1).max(10),
  daysBetween: z.number().min(1).max(30),
  strategy: z.enum(['persistent', 'value_add', 'urgency', 'nurture']),
  stopOnReply: z.boolean().default(true),
  maxAttempts: z.number().min(1).max(10)
});

// A/B Test Schema
export const EmailABTestSchema = z.object({
  name: z.string().min(1).max(100),
  variantAId: z.string(),
  variantBId: z.string(),
  testingElement: z.enum(['subject', 'content', 'cta', 'tone', 'length']),
  sampleSize: z.number().min(10).max(10000),
  leadIds: z.array(z.string()).min(20) // Need enough for statistical significance
});

// Automation Rule Schema
export const EmailAutomationRuleSchema = z.object({
  name: z.string().min(1).max(100),
  trigger: z.object({
    type: z.enum(['lead_added', 'lead_updated', 'time_based', 'behavior', 'custom']),
    config: z.record(z.string(), z.any())
  }),
  action: z.object({
    type: z.enum(['send_email', 'add_to_campaign', 'update_lead', 'notify', 'webhook']),
    config: z.record(z.string(), z.any())
  }),
  conditions: z.array(
    z.object({
      field: z.string(),
      operator: z.enum(['equals', 'contains', 'starts_with', 'ends_with', 'greater_than', 'less_than']),
      value: z.any()
    })
  ).optional(),
  enabled: z.boolean()
});

// Email Provider Config Schema
export const EmailProviderConfigSchema = z.object({
  provider: z.enum(['sendgrid', 'mailgun', 'ses', 'smtp', 'resend']),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  fromDomain: z.string().optional(),
  webhookUrl: z.string().url("Invalid URL format").optional().or(z.literal(''))
});

// Request Schemas for Actions
export const GenerateEmailRequestSchema = z.object({
  purpose: z.string().min(1).max(500),
  targetAudience: z.string().min(1).max(200),
  keyPoints: z.array(z.string().max(200)).min(1).max(10),
  tone: z.enum(['professional', 'friendly', 'casual', 'urgent']),
  includePersonalization: z.boolean().optional().default(true)
});

export const PersonalizeEmailRequestSchema = z.object({
  template: z.string().min(1),
  lead: EmailLeadSchema,
  tone: z.enum(['professional', 'friendly', 'casual', 'urgent']).optional()
});

export const AnalyzeEmailRequestSchema = z.object({
  content: z.string().min(10, 'Email content too short to analyze'),
  targetAudience: z.string().optional(),
  purpose: z.enum([
    'cold_outreach',
    'follow_up',
    'product_launch',
    'meeting_request',
    'newsletter',
    'announcement',
    'invitation',
    'thank_you'
  ]).optional()
});

export const CreateCampaignRequestSchema = z.object({
  campaign: EmailCampaignSchema,
  template: EmailTemplateSchema,
  leads: z.array(EmailLeadSchema).min(1)
});

export const GenerateFollowUpRequestSchema = z.object({
  initialEmail: z.string().min(1),
  numberOfFollowUps: z.number().min(1).max(10).default(3),
  daysBetween: z.number().min(1).max(30).default(3),
  strategy: z.enum(['persistent', 'value_add', 'urgency', 'nurture']).default('value_add')
});

export const SendEmailRequestSchema = z.object({
  to: z.array(z.string().email()).min(1),
  content: EmailContentSchema,
  provider: EmailProviderConfigSchema.optional(),
  options: z.object({
    priority: z.enum(['high', 'normal', 'low']).optional(),
    retryOnFailure: z.boolean().optional(),
    maxRetries: z.number().min(0).max(5).optional(),
    sandbox: z.boolean().optional()
  }).optional()
});