/**
 * Type definitions for the Leads feature
 * Central location for all TypeScript types and interfaces
 */

import { z } from 'zod';
import { LEAD_STATUS, LEAD_SOURCE } from './constant';

// Base lead type
export interface Lead {
  id: string;
  name: string;
  email?: string;
  company?: string;
  title?: string;
  phone?: string;
  linkedinUrl?: string;
  industry?: string;
  score: number;
  status: keyof typeof LEAD_STATUS;
  source: keyof typeof LEAD_SOURCE;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  lastContactedAt?: Date;
  metadata?: Record<string, any>;
  verified: boolean;
}

// Lead creation input
export type CreateLeadInput = Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

// Lead update input
export type UpdateLeadInput = Partial<CreateLeadInput>;

// Lead filter options
export interface LeadFilters {
  search?: string;
  status?: keyof typeof LEAD_STATUS;
  source?: keyof typeof LEAD_SOURCE;
  scoreMin?: number;
  scoreMax?: number;
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
  hasEmail?: boolean;
  hasPhone?: boolean;
}

// Lead sort options
export interface LeadSortOptions {
  field: keyof Lead;
  direction: 'asc' | 'desc';
}

// Pagination options
export interface PaginationOptions {
  page: number;
  pageSize: number;
  total?: number;
}

// Lead list response
export interface LeadListResponse {
  leads: Lead[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// AI extraction result
export interface AIExtractionResult {
  leads: Array<{
    name: string;
    email?: string;
    company?: string;
    title?: string;
    phone?: string;
    linkedinUrl?: string;
    industry?: string;
    score: number;
    notes?: string;
    confidence: number;
  }>;
  created?: number;
  metadata: {
    model: string;
    processingTime: number;
    tokensUsed: number;
  };
}

// Bulk operation types
export interface BulkOperation {
  type: 'update' | 'delete' | 'export' | 'tag';
  leadIds: string[];
  data?: any;
}

// Import/Export types
export interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    reason: string;
  }>;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  fields?: (keyof Lead)[];
  filters?: LeadFilters;
}

// Activity tracking
export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'email_sent' | 'email_received' | 'call' | 'meeting' | 'note' | 'status_change';
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  userId: string;
}

// Dashboard analytics
export interface LeadAnalytics {
  totalLeads: number;
  newLeadsThisWeek: number;
  conversionRate: number;
  averageScore: number;
  topSources: Array<{
    source: keyof typeof LEAD_SOURCE;
    count: number;
    percentage: number;
  }>;
  statusDistribution: Array<{
    status: keyof typeof LEAD_STATUS;
    count: number;
    percentage: number;
  }>;
  scoreDistribution: Array<{
    range: string;
    count: number;
  }>;
}

// Form state types
export interface LeadFormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  data: Partial<Lead>;
}

// Table column visibility
export interface ColumnVisibility {
  [key: string]: boolean;
}

// Search suggestions
export interface SearchSuggestion {
  type: 'lead' | 'company' | 'tag';
  value: string;
  metadata?: Record<string, any>;
}