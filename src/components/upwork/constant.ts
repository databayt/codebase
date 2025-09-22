// Static data, enums, and configuration for Upwork Job Analysis

import type { ProposalTone, ProposalStatus } from './type';

// Proposal tones with descriptions
export const PROPOSAL_TONES = [
  {
    value: 'professional' as ProposalTone,
    label: 'Professional',
    description: 'Formal, business-focused approach',
    icon: '💼',
  },
  {
    value: 'friendly' as ProposalTone,
    label: 'Friendly',
    description: 'Warm and approachable',
    icon: '😊',
  },
  {
    value: 'casual' as ProposalTone,
    label: 'Casual',
    description: 'Relaxed and conversational',
    icon: '👋',
  },
  {
    value: 'confident' as ProposalTone,
    label: 'Confident',
    description: 'Assertive and authoritative',
    icon: '💪',
  },
  {
    value: 'consultative' as ProposalTone,
    label: 'Consultative',
    description: 'Advisory and solution-focused',
    icon: '🎯',
  },
];

// Proposal status options
export const PROPOSAL_STATUS_OPTIONS = [
  { value: 'draft' as ProposalStatus, label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'ready' as ProposalStatus, label: 'Ready', color: 'bg-blue-100 text-blue-800' },
  { value: 'sent' as ProposalStatus, label: 'Sent', color: 'bg-purple-100 text-purple-800' },
  { value: 'viewed' as ProposalStatus, label: 'Viewed', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'shortlisted' as ProposalStatus, label: 'Shortlisted', color: 'bg-green-100 text-green-800' },
  { value: 'interviewed' as ProposalStatus, label: 'Interviewed', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'hired' as ProposalStatus, label: 'Hired', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'declined' as ProposalStatus, label: 'Declined', color: 'bg-red-100 text-red-800' },
  { value: 'withdrawn' as ProposalStatus, label: 'Withdrawn', color: 'bg-orange-100 text-orange-800' },
];

// Job viability levels
export const VIABILITY_LEVELS = [
  {
    value: 'excellent',
    label: 'Excellent',
    minScore: 8,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Highly recommended to pursue',
  },
  {
    value: 'good',
    label: 'Good',
    minScore: 6,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Worth pursuing',
  },
  {
    value: 'fair',
    label: 'Fair',
    minScore: 4,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: 'Consider carefully',
  },
  {
    value: 'poor',
    label: 'Poor',
    minScore: 0,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: 'Not recommended',
  },
];

// Score categories for job analysis
export const SCORE_CATEGORIES = [
  {
    key: 'technical',
    label: 'Technical Fit',
    weight: 0.25,
    description: 'Skills and requirements match',
    icon: '🔧',
  },
  {
    key: 'business',
    label: 'Business Value',
    weight: 0.20,
    description: 'Project value and potential',
    icon: '💰',
  },
  {
    key: 'scope',
    label: 'Scope Clarity',
    weight: 0.20,
    description: 'How well-defined the project is',
    icon: '📋',
  },
  {
    key: 'client',
    label: 'Client Quality',
    weight: 0.15,
    description: 'Client history and reputation',
    icon: '⭐',
  },
  {
    key: 'budget',
    label: 'Budget Fit',
    weight: 0.10,
    description: 'Budget adequacy for scope',
    icon: '💵',
  },
  {
    key: 'competition',
    label: 'Competition',
    weight: 0.10,
    description: 'Number and quality of competitors',
    icon: '🏆',
  },
];

// Common Upwork job categories
export const JOB_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Software Development',
  'Data Science',
  'Design & Creative',
  'Writing',
  'Marketing',
  'Admin Support',
  'Customer Service',
  'Sales',
  'Accounting',
  'Consulting',
  'Engineering',
  'IT & Networking',
  'Translation',
  'Legal',
];

// Experience levels
export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level', icon: '🌱' },
  { value: 'intermediate', label: 'Intermediate', icon: '📈' },
  { value: 'expert', label: 'Expert', icon: '🎯' },
];

// Common skills for tech jobs
export const COMMON_SKILLS = [
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'TypeScript',
  'Next.js',
  'AWS',
  'Docker',
  'MongoDB',
  'PostgreSQL',
  'GraphQL',
  'REST API',
  'Machine Learning',
  'Data Analysis',
  'UI/UX Design',
  'WordPress',
  'Shopify',
  'SEO',
  'Content Writing',
  'Project Management',
];

// Proposal templates
export const PROPOSAL_TEMPLATES = [
  {
    id: 'quick-intro',
    name: 'Quick Introduction',
    description: 'Brief and to the point',
    variables: ['name', 'experience', 'availability'],
  },
  {
    id: 'detailed-approach',
    name: 'Detailed Approach',
    description: 'Comprehensive project breakdown',
    variables: ['approach', 'timeline', 'deliverables'],
  },
  {
    id: 'portfolio-focused',
    name: 'Portfolio Focused',
    description: 'Highlight relevant work',
    variables: ['portfolio', 'case-studies', 'results'],
  },
  {
    id: 'value-proposition',
    name: 'Value Proposition',
    description: 'Focus on client benefits',
    variables: ['benefits', 'roi', 'unique-value'],
  },
];

// Red flags in job postings
export const RED_FLAGS = [
  {
    pattern: /urgent|asap|immediately/i,
    flag: 'Unrealistic timeline expectations',
    severity: 'medium',
  },
  {
    pattern: /unlimited revisions/i,
    flag: 'Scope creep risk',
    severity: 'high',
  },
  {
    pattern: /payment after completion/i,
    flag: 'Payment terms risk',
    severity: 'high',
  },
  {
    pattern: /looking for (a )?rock ?star|ninja|guru/i,
    flag: 'Unrealistic expectations',
    severity: 'low',
  },
  {
    pattern: /multiple projects|long[ -]term/i,
    flag: 'Potential for ongoing work (positive)',
    severity: 'positive',
  },
];

// Competition levels
export const COMPETITION_LEVELS = [
  {
    value: 'low',
    label: 'Low',
    maxProposals: 5,
    color: 'text-green-600',
    icon: '🟢',
  },
  {
    value: 'medium',
    label: 'Medium',
    maxProposals: 15,
    color: 'text-yellow-600',
    icon: '🟡',
  },
  {
    value: 'high',
    label: 'High',
    maxProposals: 30,
    color: 'text-orange-600',
    icon: '🟠',
  },
  {
    value: 'very-high',
    label: 'Very High',
    maxProposals: Infinity,
    color: 'text-red-600',
    icon: '🔴',
  },
];

// AI Model configurations for Upwork features
export const AI_MODELS = {
  jobAnalysis: {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    label: 'Claude 3.5 Sonnet',
    costPer1M: 3.00,
  },
  proposalGeneration: {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    label: 'Claude 3.5 Sonnet',
    costPer1M: 3.00,
  },
  proposalVariation: {
    provider: 'openai',
    model: 'gpt-4o',
    label: 'GPT-4o',
    costPer1M: 5.00,
  },
  quickAnalysis: {
    provider: 'groq',
    model: 'llama-3.1-70b-versatile',
    label: 'Groq Llama 3.1 70B',
    costPer1M: 0.70,
  },
};

// Default values
export const DEFAULT_PROPOSAL_TONE: ProposalTone = 'professional';
export const DEFAULT_PROPOSAL_STATUS: ProposalStatus = 'draft';
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Score thresholds
export const SCORE_THRESHOLDS = {
  autoRecommend: 80,  // Auto-recommend jobs above this score
  consideration: 60,   // Consider jobs above this score
  autoReject: 40,     // Auto-reject jobs below this score
};

// Time estimates
export const TIME_UNITS = [
  { value: 'hours', label: 'Hours', max: 40 },
  { value: 'days', label: 'Days', max: 30 },
  { value: 'weeks', label: 'Weeks', max: 12 },
  { value: 'months', label: 'Months', max: 12 },
];

// Validation rules
export const VALIDATION_RULES = {
  titleMinLength: 10,
  titleMaxLength: 200,
  descriptionMinLength: 50,
  descriptionMaxLength: 10000,
  proposalMinLength: 100,
  proposalMaxLength: 5000,
  questionsMaxCount: 5,
  skillsMaxCount: 20,
  attachmentsMaxCount: 10,
};