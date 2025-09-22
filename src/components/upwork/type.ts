// Domain and UI types for Upwork Job Analysis

export interface UpworkJob {
  id: string;
  title: string;
  description: string;
  budget?: {
    type: 'fixed' | 'hourly';
    amount?: number;
    min?: number;
    max?: number;
    currency?: string;
  };
  duration?: string;
  experienceLevel?: 'entry' | 'intermediate' | 'expert';
  category?: string;
  skills?: string[];
  clientInfo?: {
    country?: string;
    rating?: number;
    jobsPosted?: number;
    hireRate?: number;
    totalSpent?: string;
    verified?: boolean;
  };
  postedAt?: Date;
  proposals?: number;
  url?: string;
  attachments?: string[];
  extractedAt?: Date;
  userId?: string;
}

export interface JobAnalysis {
  jobId?: string;
  overallScore: number;
  viability: 'excellent' | 'good' | 'fair' | 'poor';
  scores: {
    technical: number;
    business: number;
    scope: number;
    client: number;
    budget: number;
    competition: number;
  };
  strengths: string[];
  weaknesses: string[];
  redFlags: string[];
  recommendations: string[];
  estimatedSuccessRate: number;
  suggestedRate?: {
    hourly?: number;
    fixed?: number;
    currency: string;
  };
  timeEstimate?: {
    min: number;
    max: number;
    unit: 'hours' | 'days' | 'weeks' | 'months';
  };
  competitionLevel: 'low' | 'medium' | 'high' | 'very-high';
  matchScore: number;
}

export interface Proposal {
  id: string;
  jobId: string;
  content: string;
  coverLetter: string;
  rate?: {
    amount: number;
    type: 'hourly' | 'fixed';
  };
  duration?: string;
  tone: ProposalTone;
  keyPoints: string[];
  questions?: string[];
  attachments?: string[];
  score?: number;
  status: ProposalStatus;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  viewedAt?: Date;
  respondedAt?: Date;
  userId: string;
}

export type ProposalTone = 'professional' | 'friendly' | 'casual' | 'confident' | 'consultative';

export type ProposalStatus =
  | 'draft'
  | 'ready'
  | 'sent'
  | 'viewed'
  | 'shortlisted'
  | 'interviewed'
  | 'hired'
  | 'declined'
  | 'withdrawn';

export interface ProposalTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  variables: string[];
  tone: ProposalTone;
  category?: string;
  successRate?: number;
  usageCount: number;
  tags: string[];
  isActive: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProposalAnalysis {
  proposalId?: string;
  score: number;
  strengths: string[];
  improvements: string[];
  readabilityScore: number;
  personalizationScore: number;
  valuePropositionScore: number;
  callToActionScore: number;
  competitivenessScore: number;
  estimatedResponseRate: number;
  suggestions: string[];
}

export interface JobSearch {
  query?: string;
  category?: string[];
  skills?: string[];
  budgetMin?: number;
  budgetMax?: number;
  experienceLevel?: string[];
  clientCountry?: string[];
  clientRating?: number;
  jobType?: 'fixed' | 'hourly' | 'both';
  duration?: string[];
  proposalsMax?: number;
  postedWithin?: 'day' | 'week' | 'month' | 'anytime';
}

export interface SavedSearch {
  id: string;
  name: string;
  criteria: JobSearch;
  notificationEnabled: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
  lastRun?: Date;
  matchCount?: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientAnalysis {
  clientId?: string;
  trustScore: number;
  paymentReliability: 'excellent' | 'good' | 'fair' | 'risky';
  communicationStyle: string;
  projectClarity: 'clear' | 'moderate' | 'vague';
  expectations: string[];
  preferredWorkStyle: string;
  redFlags: string[];
  tips: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  url?: string;
  imageUrl?: string;
  completedAt?: Date;
  client?: string;
  testimonial?: string;
  metrics?: {
    budget?: number;
    duration?: string;
    outcome?: string;
  };
  featured: boolean;
  userId: string;
}

// API Response types
export interface JobAnalysisResponse {
  success: boolean;
  data?: JobAnalysis;
  error?: string;
}

export interface ProposalResponse {
  success: boolean;
  data?: Proposal;
  error?: string;
}

export interface ProposalListResponse {
  success: boolean;
  data?: {
    proposals: Proposal[];
    pagination: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  };
  error?: string;
}

export interface StreamingResponse {
  success: boolean;
  stream?: ReadableStream;
  error?: string;
}

// Form types
export interface JobFormData {
  title: string;
  description: string;
  url?: string;
  budget?: string;
  duration?: string;
  skills?: string[];
  clientInfo?: string;
}

export interface ProposalFormData {
  tone: ProposalTone;
  keyPoints: string[];
  questions?: string[];
  rate?: string;
  duration?: string;
  attachPortfolio?: boolean;
}