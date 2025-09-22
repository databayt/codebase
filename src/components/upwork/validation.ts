// Zod schemas for data validation and type generation

import { z } from 'zod';
import {
  PROPOSAL_TONES,
  PROPOSAL_STATUS_OPTIONS,
  EXPERIENCE_LEVELS,
  VALIDATION_RULES,
} from './constant';

// Job schema
export const upworkJobSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string()
    .min(VALIDATION_RULES.titleMinLength)
    .max(VALIDATION_RULES.titleMaxLength),
  description: z.string()
    .min(VALIDATION_RULES.descriptionMinLength)
    .max(VALIDATION_RULES.descriptionMaxLength),
  budget: z.object({
    type: z.enum(['fixed', 'hourly']),
    amount: z.number().positive().optional(),
    min: z.number().positive().optional(),
    max: z.number().positive().optional(),
    currency: z.string().default('USD'),
  }).optional(),
  duration: z.string().optional(),
  experienceLevel: z.enum(['entry', 'intermediate', 'expert']).optional(),
  category: z.string().optional(),
  skills: z.array(z.string()).max(VALIDATION_RULES.skillsMaxCount).optional(),
  clientInfo: z.object({
    country: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
    jobsPosted: z.number().min(0).optional(),
    hireRate: z.number().min(0).max(100).optional(),
    totalSpent: z.string().optional(),
    verified: z.boolean().optional(),
  }).optional(),
  postedAt: z.date().optional(),
  proposals: z.number().min(0).optional(),
  url: z.string().url().optional(),
  attachments: z.array(z.string()).optional(),
  extractedAt: z.date().optional(),
  userId: z.string().optional(),
});

// Job analysis request schema
export const jobAnalysisRequestSchema = z.object({
  jobDescription: z.string()
    .min(VALIDATION_RULES.descriptionMinLength)
    .max(VALIDATION_RULES.descriptionMaxLength),
  skills: z.array(z.string()).optional(),
  experienceYears: z.number().min(0).max(50).optional(),
  hourlyRate: z.number().positive().optional(),
  availability: z.enum(['full-time', 'part-time', 'as-needed']).optional(),
  portfolio: z.array(z.object({
    title: z.string(),
    url: z.string().url().optional(),
    relevance: z.number().min(0).max(10).optional(),
  })).optional(),
});

// Proposal generation request schema
export const proposalGenerationRequestSchema = z.object({
  jobAnalysis: z.object({
    overallScore: z.number(),
    viability: z.enum(['excellent', 'good', 'fair', 'poor']),
    scores: z.object({
      technical: z.number(),
      business: z.number(),
      scope: z.number(),
      client: z.number(),
      budget: z.number(),
      competition: z.number(),
    }),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
  tone: z.enum(PROPOSAL_TONES.map(t => t.value) as [string, ...string[]]),
  keyPoints: z.array(z.string())
    .min(1, 'At least one key point is required')
    .max(10),
  questions: z.array(z.string())
    .max(VALIDATION_RULES.questionsMaxCount)
    .optional(),
  rate: z.object({
    amount: z.number().positive(),
    type: z.enum(['hourly', 'fixed']),
  }).optional(),
  duration: z.string().optional(),
  includePortfolio: z.boolean().default(false),
  customInstructions: z.string().max(1000).optional(),
});

// Proposal schema
export const proposalSchema = z.object({
  id: z.string().uuid().optional(),
  jobId: z.string().uuid(),
  content: z.string()
    .min(VALIDATION_RULES.proposalMinLength)
    .max(VALIDATION_RULES.proposalMaxLength),
  coverLetter: z.string()
    .min(VALIDATION_RULES.proposalMinLength)
    .max(VALIDATION_RULES.proposalMaxLength),
  rate: z.object({
    amount: z.number().positive(),
    type: z.enum(['hourly', 'fixed']),
  }).optional(),
  duration: z.string().optional(),
  tone: z.enum(PROPOSAL_TONES.map(t => t.value) as [string, ...string[]]),
  keyPoints: z.array(z.string()),
  questions: z.array(z.string()).optional(),
  attachments: z.array(z.string()).max(VALIDATION_RULES.attachmentsMaxCount).optional(),
  score: z.number().min(0).max(100).optional(),
  status: z.enum(PROPOSAL_STATUS_OPTIONS.map(s => s.value) as [string, ...string[]]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  sentAt: z.date().optional(),
  viewedAt: z.date().optional(),
  respondedAt: z.date().optional(),
  userId: z.string().optional(),
});

// Proposal template schema
export const proposalTemplateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  content: z.string()
    .min(50)
    .max(VALIDATION_RULES.proposalMaxLength),
  variables: z.array(z.string()),
  tone: z.enum(PROPOSAL_TONES.map(t => t.value) as [string, ...string[]]),
  category: z.string().optional(),
  successRate: z.number().min(0).max(100).optional(),
  usageCount: z.number().min(0).default(0),
  tags: z.array(z.string()).max(10).default([]),
  isActive: z.boolean().default(true),
  userId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Job search filter schema
export const jobSearchSchema = z.object({
  query: z.string().optional(),
  category: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  experienceLevel: z.array(z.enum(['entry', 'intermediate', 'expert'])).optional(),
  clientCountry: z.array(z.string()).optional(),
  clientRating: z.number().min(0).max(5).optional(),
  jobType: z.enum(['fixed', 'hourly', 'both']).optional(),
  duration: z.array(z.string()).optional(),
  proposalsMax: z.number().positive().optional(),
  postedWithin: z.enum(['day', 'week', 'month', 'anytime']).optional(),
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['relevance', 'newest', 'budget', 'proposals']).default('newest'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Proposal filter schema
export const proposalFilterSchema = z.object({
  search: z.string().optional(),
  status: z.array(z.enum(PROPOSAL_STATUS_OPTIONS.map(s => s.value) as [string, ...string[]])).optional(),
  tone: z.array(z.enum(PROPOSAL_TONES.map(t => t.value) as [string, ...string[]])).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  scoreMin: z.number().min(0).max(100).optional(),
  scoreMax: z.number().min(0).max(100).optional(),
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'updatedAt', 'score', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Client analysis request schema
export const clientAnalysisRequestSchema = z.object({
  clientInfo: z.object({
    country: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
    jobsPosted: z.number().min(0).optional(),
    hireRate: z.number().min(0).max(100).optional(),
    totalSpent: z.string().optional(),
    verified: z.boolean().optional(),
    reviewComments: z.array(z.string()).optional(),
  }),
  jobHistory: z.array(z.object({
    title: z.string(),
    budget: z.string().optional(),
    duration: z.string().optional(),
    outcome: z.enum(['successful', 'cancelled', 'disputed']).optional(),
  })).optional(),
});

// Export types
export type UpworkJob = z.infer<typeof upworkJobSchema>;
export type JobAnalysisRequest = z.infer<typeof jobAnalysisRequestSchema>;
export type ProposalGenerationRequest = z.infer<typeof proposalGenerationRequestSchema>;
export type Proposal = z.infer<typeof proposalSchema>;
export type ProposalTemplate = z.infer<typeof proposalTemplateSchema>;
export type JobSearch = z.infer<typeof jobSearchSchema>;
export type ProposalFilter = z.infer<typeof proposalFilterSchema>;
export type ClientAnalysisRequest = z.infer<typeof clientAnalysisRequestSchema>;

// Validation helpers
export function validateJob(data: unknown): { success: boolean; data?: UpworkJob; error?: string } {
  try {
    const validated = upworkJobSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Invalid job data' };
  }
}

export function validateProposal(data: unknown): { success: boolean; data?: Proposal; error?: string } {
  try {
    const validated = proposalSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Invalid proposal data' };
  }
}