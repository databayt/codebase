/**
 * Custom hook for managing lead state and operations
 * Provides a centralized way to interact with lead data
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { getLeads, getLeadAnalytics } from './action';
import type { Lead, LeadFilters, LeadAnalytics } from './type';
import { PAGINATION_OPTIONS } from './constant';

interface UseLeadsOptions {
  initialFilters?: LeadFilters;
  pageSize?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseLeadsReturn {
  // Data
  leads: Lead[];
  analytics: LeadAnalytics | null;

  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;

  // Filters & Pagination
  filters: LeadFilters;
  setFilters: (filters: LeadFilters) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalPages: number;
  total: number;

  // Selection
  selectedLeads: string[];
  setSelectedLeads: (ids: string[]) => void;
  selectAll: () => void;
  clearSelection: () => void;

  // Actions
  refreshLeads: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;

  // Computed
  hasFilters: boolean;
  canLoadMore: boolean;
}

export function useLeads(options: UseLeadsOptions = {}): UseLeadsReturn {
  const {
    initialFilters = {},
    pageSize: initialPageSize = PAGINATION_OPTIONS.DEFAULT_PAGE_SIZE,
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
  } = options;

  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<LeadAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState<LeadFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  // Debounce search filter
  const debouncedSearch = useDebounce(filters.search, 300);

  // Computed values
  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);
  const canLoadMore = useMemo(() => page < totalPages, [page, totalPages]);
  const hasFilters = useMemo(() => {
    return Object.keys(filters).some(key => {
      const value = filters[key as keyof LeadFilters];
      return value !== undefined && value !== '' && value !== null;
    });
  }, [filters]);

  // Fetch leads
  const fetchLeads = useCallback(async (showLoading = true) => {
    console.log('🔍 CLIENT: fetchLeads called');
    console.log('🔍 CLIENT: showLoading:', showLoading);
    console.log('🔍 CLIENT: Current page:', page, 'PageSize:', pageSize);

    if (showLoading) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const filtersWithSearch = {
        ...filters,
        search: debouncedSearch,
      };
      console.log('🔍 CLIENT: Filters:', filtersWithSearch);

      const response = await getLeads(filtersWithSearch, page, pageSize);
      console.log('✅ CLIENT: Response received!');
      console.log('✅ CLIENT: Leads count:', response.leads.length);
      console.log('✅ CLIENT: Total in DB:', response.pagination.total);
      console.log('✅ CLIENT: First 3 leads:', response.leads.slice(0, 3).map(l => ({ id: l.id, name: l.name, email: l.email })));

      setLeads(response.leads);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error('❌ CLIENT: Failed to fetch leads:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      console.log('🔍 CLIENT: fetchLeads complete');
    }
  }, [filters, debouncedSearch, page, pageSize]);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      const result = await getLeadAnalytics();
      if (result.success && result.data) {
        setAnalytics(result.data as LeadAnalytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  }, []);

  // Refresh functions
  const refreshLeads = useCallback(async () => {
    console.log('🔄 CLIENT: refreshLeads called');
    await fetchLeads(false);
    console.log('🔄 CLIENT: refreshLeads complete');
  }, [fetchLeads]);

  const refreshAnalytics = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  // Selection helpers
  const selectAll = useCallback(() => {
    setSelectedLeads(leads.map(l => l.id));
  }, [leads]);

  const clearSelection = useCallback(() => {
    setSelectedLeads([]);
  }, []);

  // Initial load
  useEffect(() => {
    console.log('🚀 CLIENT: useLeads initial load effect triggered');
    console.log('🚀 CLIENT: Dependencies - page:', page, 'pageSize:', pageSize, 'search:', debouncedSearch);
    fetchLeads();
    fetchAnalytics();
  }, [page, pageSize, debouncedSearch]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshLeads();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshLeads]);

  // Clear selection when filters change
  useEffect(() => {
    clearSelection();
  }, [filters]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  return {
    // Data
    leads,
    analytics,

    // Loading states
    isLoading,
    isRefreshing,

    // Filters & Pagination
    filters,
    setFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    total,

    // Selection
    selectedLeads,
    setSelectedLeads,
    selectAll,
    clearSelection,

    // Actions
    refreshLeads,
    refreshAnalytics,

    // Computed
    hasFilters,
    canLoadMore,
  };
}

// Additional hooks for specific use cases

/**
 * Hook for managing a single lead
 */
export function useLead(id: string) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLead = async () => {
      setIsLoading(true);
      try {
        const result = await getLeads({ search: id }, 1, 1);
        if (result.leads.length > 0) {
          setLead(result.leads[0]);
        } else {
          setError('Lead not found');
        }
      } catch (err) {
        setError('Failed to fetch lead');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchLead();
    }
  }, [id]);

  return { lead, isLoading, error };
}

/**
 * Hook for lead search suggestions
 */
export function useLeadSearch(query: string) {
  const [suggestions, setSuggestions] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const result = await getLeads({ search: debouncedQuery }, 1, 5);
        setSuggestions(result.leads);
      } catch (error) {
        console.error('Search failed:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    search();
  }, [debouncedQuery]);

  return { suggestions, isSearching };
}