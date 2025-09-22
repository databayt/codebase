// Email Types
export type EmailTone = 'professional' | 'friendly' | 'casual' | 'urgent';
export type EmailPurpose = 'cold_outreach' | 'follow_up' | 'product_launch' | 'meeting_request' | 'newsletter' | 'announcement' | 'invitation' | 'thank_you';
export type EmailStatus = 'draft' | 'scheduled' | 'sent' | 'failed' | 'bounced' | 'opened' | 'clicked';
export type SpamRisk = 'low' | 'medium' | 'high';
export type PersonalizationField = 'firstName' | 'lastName' | 'company' | 'title' | 'industry' | 'location' | 'custom';

// Email Template
export interface EmailTemplate {
  id?: string;
  name: string;
  subject: string;
  greeting: string;
  introduction: string;
  body: string[];
  callToAction: string;
  closing: string;
  signature: string;
  tone: EmailTone;
  purpose: EmailPurpose;
  personalizationLevel: number; // 0-10
  personalizationFields: PersonalizationField[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Email Content
export interface EmailContent {
  subject: string;
  preheader?: string;
  htmlContent: string;
  textContent: string;
  personalizationTokens: Record<string, string>;
  attachments?: EmailAttachment[];
  trackingEnabled?: boolean;
}

// Email Attachment
export interface EmailAttachment {
  filename: string;
  contentType: string;
  size: number;
  url?: string;
  data?: string; // base64
}

// Lead Data for Personalization
export interface EmailLead {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  title?: string;
  industry?: string;
  location?: string;
  phone?: string;
  linkedinUrl?: string;
  notes?: string;
  customFields?: Record<string, any>;
}

// Email Campaign
export interface EmailCampaign {
  id?: string;
  name: string;
  template: EmailTemplate;
  leads: EmailLead[];
  scheduledTime?: Date;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  settings: CampaignSettings;
  metrics?: CampaignMetrics;
  createdAt?: Date;
  updatedAt?: Date;
}

// Campaign Settings
export interface CampaignSettings {
  sendingSpeed: 'immediate' | 'gradual' | 'throttled';
  batchSize?: number;
  delayBetweenBatches?: number; // minutes
  trackOpens: boolean;
  trackClicks: boolean;
  replyTo?: string;
  fromName: string;
  fromEmail: string;
  unsubscribeLink: boolean;
  footerText?: string;
}

// Campaign Metrics
export interface CampaignMetrics {
  totalSent: number;
  delivered: number;
  bounced: number;
  opened: number;
  clicked: number;
  replied: number;
  unsubscribed: number;
  markedAsSpam: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  bounceRate: number;
}

// Email Analysis
export interface EmailAnalysis {
  overallScore: number;
  scores: {
    subjectLine: number;
    personalization: number;
    clarity: number;
    valueProposition: number;
    callToAction: number;
    tone: number;
    length: number;
    readability: number;
  };
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  predictedOpenRate: number;
  predictedClickRate: number;
  predictedReplyRate: number;
  spamRisk: SpamRisk;
  spamTriggers?: string[];
  readingTime: number; // seconds
  sentimentScore: number; // -1 to 1
}

// Follow-up Email
export interface FollowUpEmail {
  followUpNumber: number;
  daysAfterPrevious: number;
  subject: string;
  content: string;
  tone: EmailTone;
  urgencyLevel: 'low' | 'medium' | 'high';
}

// Follow-up Sequence
export interface FollowUpSequence {
  id?: string;
  name: string;
  initialEmail: EmailContent;
  followUps: FollowUpEmail[];
  totalEmails: number;
  strategy: 'persistent' | 'value_add' | 'urgency' | 'nurture';
  stopOnReply: boolean;
  maxAttempts: number;
}

// A/B Test
export interface EmailABTest {
  id?: string;
  name: string;
  variantA: EmailContent;
  variantB: EmailContent;
  testingElement: 'subject' | 'content' | 'cta' | 'tone' | 'length';
  sampleSize: number;
  winner?: 'A' | 'B';
  metrics?: {
    variantA: CampaignMetrics;
    variantB: CampaignMetrics;
  };
  status: 'draft' | 'running' | 'completed';
}

// Email Automation Rule
export interface EmailAutomationRule {
  id?: string;
  name: string;
  trigger: AutomationTrigger;
  action: AutomationAction;
  conditions?: AutomationCondition[];
  enabled: boolean;
  createdAt?: Date;
}

// Automation Trigger
export interface AutomationTrigger {
  type: 'lead_added' | 'lead_updated' | 'time_based' | 'behavior' | 'custom';
  config: Record<string, any>;
}

// Automation Action
export interface AutomationAction {
  type: 'send_email' | 'add_to_campaign' | 'update_lead' | 'notify' | 'webhook';
  config: Record<string, any>;
}

// Automation Condition
export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than';
  value: any;
}

// Email Batch
export interface EmailBatch {
  id?: string;
  campaignId: string;
  batchNumber: number;
  emails: PersonalizedEmail[];
  status: EmailStatus;
  scheduledTime?: Date;
  sentAt?: Date;
  metrics?: BatchMetrics;
}

// Personalized Email
export interface PersonalizedEmail {
  id?: string;
  leadId: string;
  leadEmail: string;
  personalizedContent: EmailContent;
  status: EmailStatus;
  sentAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  repliedAt?: Date;
  bouncedAt?: Date;
  error?: string;
}

// Batch Metrics
export interface BatchMetrics {
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
}

// Email Provider Config
export interface EmailProviderConfig {
  provider: 'sendgrid' | 'mailgun' | 'ses' | 'smtp' | 'resend';
  apiKey?: string;
  apiSecret?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  fromDomain?: string;
  webhookUrl?: string;
}

// Email Sending Options
export interface EmailSendingOptions {
  provider?: EmailProviderConfig;
  priority?: 'high' | 'normal' | 'low';
  retryOnFailure?: boolean;
  maxRetries?: number;
  sandbox?: boolean;
}