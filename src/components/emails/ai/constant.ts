import { EmailTone, EmailPurpose } from './type';

// Email Tones
export const EMAIL_TONES = [
  { value: 'professional' as EmailTone, label: 'Professional', icon: '👔', description: 'Formal and business-focused' },
  { value: 'friendly' as EmailTone, label: 'Friendly', icon: '😊', description: 'Warm and approachable' },
  { value: 'casual' as EmailTone, label: 'Casual', icon: '👋', description: 'Relaxed and conversational' },
  { value: 'urgent' as EmailTone, label: 'Urgent', icon: '⚡', description: 'Time-sensitive and direct' }
] as const;

// Email Purposes
export const EMAIL_PURPOSES = [
  { value: 'cold_outreach' as EmailPurpose, label: 'Cold Outreach', icon: '🎯', description: 'Initial contact with prospects' },
  { value: 'follow_up' as EmailPurpose, label: 'Follow-up', icon: '🔄', description: 'Follow up on previous communication' },
  { value: 'product_launch' as EmailPurpose, label: 'Product Launch', icon: '🚀', description: 'Announce new products or features' },
  { value: 'meeting_request' as EmailPurpose, label: 'Meeting Request', icon: '📅', description: 'Schedule meetings or calls' },
  { value: 'newsletter' as EmailPurpose, label: 'Newsletter', icon: '📰', description: 'Regular updates and content' },
  { value: 'announcement' as EmailPurpose, label: 'Announcement', icon: '📢', description: 'Company or product announcements' },
  { value: 'invitation' as EmailPurpose, label: 'Invitation', icon: '✉️', description: 'Event or webinar invitations' },
  { value: 'thank_you' as EmailPurpose, label: 'Thank You', icon: '🙏', description: 'Express gratitude' }
] as const;

// Email Templates
export const EMAIL_TEMPLATES = [
  {
    label: 'B2B Cold Outreach',
    prompt: 'Create a cold outreach email for B2B software services targeting decision makers',
    tone: 'professional' as EmailTone,
    purpose: 'cold_outreach' as EmailPurpose
  },
  {
    label: 'Follow-up After Demo',
    prompt: 'Write a follow-up email after a product demo call',
    tone: 'friendly' as EmailTone,
    purpose: 'follow_up' as EmailPurpose
  },
  {
    label: 'Product Feature Update',
    prompt: 'Announce a new product feature to existing customers',
    tone: 'friendly' as EmailTone,
    purpose: 'product_launch' as EmailPurpose
  },
  {
    label: 'Meeting Request',
    prompt: 'Request a meeting with a potential client to discuss their needs',
    tone: 'professional' as EmailTone,
    purpose: 'meeting_request' as EmailPurpose
  },
  {
    label: 'Re-engagement Campaign',
    prompt: 'Re-engage inactive users with a special offer',
    tone: 'friendly' as EmailTone,
    purpose: 'cold_outreach' as EmailPurpose
  },
  {
    label: 'Partnership Proposal',
    prompt: 'Propose a strategic partnership opportunity',
    tone: 'professional' as EmailTone,
    purpose: 'cold_outreach' as EmailPurpose
  }
] as const;

// Personalization Fields
export const PERSONALIZATION_FIELDS = [
  { field: 'firstName', label: 'First Name', token: '{{firstName}}' },
  { field: 'lastName', label: 'Last Name', token: '{{lastName}}' },
  { field: 'company', label: 'Company', token: '{{company}}' },
  { field: 'title', label: 'Job Title', token: '{{title}}' },
  { field: 'industry', label: 'Industry', token: '{{industry}}' },
  { field: 'location', label: 'Location', token: '{{location}}' },
  { field: 'previousInteraction', label: 'Previous Interaction', token: '{{previousInteraction}}' },
  { field: 'productInterest', label: 'Product Interest', token: '{{productInterest}}' }
] as const;

// Spam Trigger Words (to avoid)
export const SPAM_TRIGGERS = [
  'FREE', 'GUARANTEED', 'NO OBLIGATION', 'WINNER', 'CONGRATULATIONS',
  'CLICK HERE', 'LIMITED TIME', 'ACT NOW', 'URGENT', 'SPECIAL OFFER',
  'MAKE MONEY', 'EARN CASH', 'WORK FROM HOME', 'BE YOUR OWN BOSS',
  'INCREASE SALES', 'DOUBLE YOUR', '100% SATISFIED', 'RISK-FREE',
  'VIAGRA', 'WEIGHT LOSS', 'LOSE WEIGHT', 'DIET', 'PILLS'
] as const;

// Email Best Practices
export const EMAIL_BEST_PRACTICES = [
  {
    category: 'Subject Line',
    tips: [
      'Keep it under 50 characters',
      'Avoid all caps and excessive punctuation',
      'Create urgency without spam triggers',
      'Personalize when possible',
      'A/B test different versions'
    ]
  },
  {
    category: 'Content',
    tips: [
      'Lead with value proposition',
      'Keep paragraphs short (2-3 lines)',
      'Use bullet points for clarity',
      'Include one clear CTA',
      'Mobile-optimize (single column)'
    ]
  },
  {
    category: 'Personalization',
    tips: [
      'Use recipient\'s name naturally',
      'Reference their company/industry',
      'Mention specific pain points',
      'Include relevant case studies',
      'Customize based on behavior'
    ]
  },
  {
    category: 'Timing',
    tips: [
      'Tuesday-Thursday best days',
      '10 AM or 2 PM optimal times',
      'Avoid Mondays and Fridays',
      'Consider recipient timezone',
      'Test different send times'
    ]
  }
] as const;

// Follow-up Strategies
export const FOLLOW_UP_STRATEGIES = [
  {
    value: 'persistent',
    label: 'Persistent',
    description: 'Regular follow-ups until response',
    schedule: [3, 7, 14, 21, 30] // days
  },
  {
    value: 'value_add',
    label: 'Value Addition',
    description: 'Each follow-up adds new value',
    schedule: [5, 10, 20, 30] // days
  },
  {
    value: 'urgency',
    label: 'Urgency Building',
    description: 'Increasing urgency with each email',
    schedule: [2, 5, 7, 10] // days
  },
  {
    value: 'nurture',
    label: 'Long-term Nurture',
    description: 'Gradual relationship building',
    schedule: [7, 14, 30, 45, 60] // days
  }
] as const;

// Email Metrics Thresholds
export const EMAIL_METRICS = {
  openRate: {
    excellent: 30,
    good: 20,
    average: 15,
    poor: 10
  },
  clickRate: {
    excellent: 10,
    good: 5,
    average: 2.5,
    poor: 1
  },
  replyRate: {
    excellent: 15,
    good: 8,
    average: 3,
    poor: 1
  },
  bounceRate: {
    excellent: 1,
    good: 2,
    average: 5,
    poor: 10
  }
} as const;

// Campaign Status Colors
export const CAMPAIGN_STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
} as const;

// Email Providers
export const EMAIL_PROVIDERS = [
  { value: 'sendgrid', label: 'SendGrid', icon: '📧', features: ['High deliverability', 'Advanced analytics', 'API & SMTP'] },
  { value: 'mailgun', label: 'Mailgun', icon: '🔫', features: ['Developer-friendly', 'Email validation', 'Detailed logs'] },
  { value: 'ses', label: 'Amazon SES', icon: '📬', features: ['Cost-effective', 'AWS integration', 'High volume'] },
  { value: 'resend', label: 'Resend', icon: '♻️', features: ['Modern API', 'React email', 'Great DX'] },
  { value: 'smtp', label: 'Custom SMTP', icon: '⚙️', features: ['Full control', 'Any provider', 'Self-hosted'] }
] as const;

// A/B Testing Elements
export const AB_TEST_ELEMENTS = [
  { value: 'subject', label: 'Subject Line', description: 'Test different subject lines' },
  { value: 'content', label: 'Email Content', description: 'Test different body content' },
  { value: 'cta', label: 'Call to Action', description: 'Test different CTA buttons' },
  { value: 'tone', label: 'Tone of Voice', description: 'Test different communication styles' },
  { value: 'length', label: 'Email Length', description: 'Test short vs long emails' }
] as const;

// Default Email Settings
export const DEFAULT_EMAIL_SETTINGS = {
  trackOpens: true,
  trackClicks: true,
  unsubscribeLink: true,
  sendingSpeed: 'gradual' as const,
  batchSize: 100,
  delayBetweenBatches: 5, // minutes
  maxRetries: 3,
  retryDelay: 60 // seconds
} as const;