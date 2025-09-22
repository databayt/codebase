'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import {
  scrapePage,
  extractLeadsFromPage,
  analyzePageContent,
  scrapeMultiplePages,
} from './action';
import type {
  ScrapedPage,
  ExtractedLead,
  CompanyInfo,
  PageAnalysis,
  ScrapeStrategy,
  ScrapeStatus,
} from './type';
import type {
  ScrapeRequest,
  LeadExtractionRequest,
  PageAnalysisRequest,
  MultiPageScrapeRequest,
} from './validation';

// Hook for single page scraping
export function usePageScraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedPage, setScrapedPage] = useState<ScrapedPage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scrapeUrl = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await scrapePage(url);

      if (result.success && result.data) {
        setScrapedPage(result.data);
        toast.success('Page scraped successfully');
        return result;
      } else {
        setError(result.error || 'Scraping failed');
        toast.error(result.error || 'Failed to scrape page');
        return result;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Scraping failed';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setScrapedPage(null);
    setError(null);
  }, []);

  return {
    scrapeUrl,
    scrapedPage,
    isLoading,
    error,
    clearResults,
  };
}

// Hook for lead extraction
export function useLeadExtractor() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedLeads, setExtractedLeads] = useState<ExtractedLead[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [pageAnalysis, setPageAnalysis] = useState<PageAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractLeads = useCallback(async (request: LeadExtractionRequest) => {
    setIsExtracting(true);
    setError(null);

    try {
      const result = await extractLeadsFromPage(request);

      if (result.success && result.data) {
        setExtractedLeads(result.data.leads);
        setCompanyInfo(result.data.companyInfo || null);
        setPageAnalysis(result.data.pageAnalysis || null);
        toast.success(`Extracted ${result.data.leads.length} leads`);
        return result;
      } else {
        setError(result.error || 'Extraction failed');
        toast.error(result.error || 'Failed to extract leads');
        return result;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Extraction failed';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const clearExtracted = useCallback(() => {
    setExtractedLeads([]);
    setCompanyInfo(null);
    setPageAnalysis(null);
    setError(null);
  }, []);

  return {
    extractLeads,
    extractedLeads,
    companyInfo,
    pageAnalysis,
    isExtracting,
    error,
    clearExtracted,
  };
}

// Hook for page analysis
export function usePageAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PageAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzePage = useCallback(async (request: PageAnalysisRequest) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzePageContent(request);

      if (result.success && result.data) {
        setAnalysis(result.data);
        toast.success('Page analysis complete');
        return result;
      } else {
        setError(result.error || 'Analysis failed');
        toast.error(result.error || 'Failed to analyze page');
        return result;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    analyzePage,
    analysis,
    isAnalyzing,
    error,
  };
}

// Hook for multi-page scraping
export function useMultiPageScraper() {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<ScrapeStatus>('pending');
  const [scrapedPages, setScrapedPages] = useState<ScrapedPage[]>([]);
  const [extractedLeads, setExtractedLeads] = useState<ExtractedLead[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const startScraping = useCallback(async (request: MultiPageScrapeRequest) => {
    setIsRunning(true);
    setStatus('running');
    setError(null);
    setScrapedPages([]);
    setExtractedLeads([]);

    try {
      const result = await scrapeMultiplePages(request);

      if (result.success && result.data) {
        setScrapedPages(result.data.pages);
        setExtractedLeads(result.data.leads);
        setProgress({ current: result.data.totalPages, total: request.maxPages });
        setStatus('completed');
        toast.success(`Scraped ${result.data.totalPages} pages, found ${result.data.leads.length} leads`);
        return result;
      } else {
        setStatus('failed');
        setError(result.error || 'Scraping failed');
        toast.error(result.error || 'Failed to scrape pages');
        return result;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Scraping failed';
      setStatus('failed');
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsRunning(false);
    }
  }, []);

  const cancelScraping = useCallback(() => {
    setStatus('cancelled');
    setIsRunning(false);
    toast.info('Scraping cancelled');
  }, []);

  const resetScraper = useCallback(() => {
    setStatus('pending');
    setScrapedPages([]);
    setExtractedLeads([]);
    setProgress({ current: 0, total: 0 });
    setError(null);
  }, []);

  return {
    startScraping,
    cancelScraping,
    resetScraper,
    isRunning,
    status,
    scrapedPages,
    extractedLeads,
    progress,
    error,
  };
}

// Hook for saved scraping sessions
export function useScrapingSessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  // Load sessions from localStorage
  useEffect(() => {
    const loadSessions = () => {
      const saved = localStorage.getItem('scraping-sessions');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSessions(parsed);
        } catch (e) {
          console.error('Failed to load scraping sessions');
        }
      }
    };

    loadSessions();
  }, []);

  const saveSession = useCallback((session: any) => {
    const updated = [...sessions, { ...session, id: crypto.randomUUID(), savedAt: new Date() }];
    setSessions(updated);
    localStorage.setItem('scraping-sessions', JSON.stringify(updated));
    toast.success('Session saved');
  }, [sessions]);

  const deleteSession = useCallback((id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    localStorage.setItem('scraping-sessions', JSON.stringify(updated));
    toast.success('Session deleted');
  }, [sessions]);

  const exportSession = useCallback((session: any) => {
    const data = JSON.stringify(session, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scraping-session-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return {
    sessions,
    loading,
    selectedSession,
    setSelectedSession,
    saveSession,
    deleteSession,
    exportSession,
  };
}

// Hook for scraping templates
export function useScrapingTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);

  // Load templates from localStorage
  useEffect(() => {
    const loadTemplates = () => {
      const saved = localStorage.getItem('scraping-templates');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setTemplates(parsed);
        } catch (e) {
          console.error('Failed to load templates');
        }
      } else {
        // Set default templates
        const defaults = [
          {
            id: 'team-pages',
            name: 'Team Pages',
            urlPattern: '*/team*',
            strategy: 'single' as ScrapeStrategy,
            description: 'Extract team member contacts',
          },
          {
            id: 'about-pages',
            name: 'About Pages',
            urlPattern: '*/about*',
            strategy: 'breadth' as ScrapeStrategy,
            description: 'Company information and key people',
          },
          {
            id: 'contact-pages',
            name: 'Contact Pages',
            urlPattern: '*/contact*',
            strategy: 'single' as ScrapeStrategy,
            description: 'Direct contact information',
          },
          {
            id: 'full-site',
            name: 'Full Site Crawl',
            urlPattern: '*',
            strategy: 'depth' as ScrapeStrategy,
            description: 'Comprehensive site scraping',
          },
        ];
        setTemplates(defaults);
        localStorage.setItem('scraping-templates', JSON.stringify(defaults));
      }
    };

    loadTemplates();
  }, []);

  const saveTemplate = useCallback((template: any) => {
    const updated = [...templates, { ...template, id: crypto.randomUUID() }];
    setTemplates(updated);
    localStorage.setItem('scraping-templates', JSON.stringify(updated));
    toast.success('Template saved');
  }, [templates]);

  const deleteTemplate = useCallback((id: string) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem('scraping-templates', JSON.stringify(updated));
    toast.success('Template deleted');
  }, [templates]);

  return {
    templates,
    saveTemplate,
    deleteTemplate,
  };
}

// Hook for scraping analytics
export function useScrapingAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalPages: 0,
    totalLeads: 0,
    successRate: 0,
    avgProcessingTime: 0,
    topDomains: [] as { domain: string; count: number }[],
    pageTypes: {} as Record<string, number>,
    leadSources: {} as Record<string, number>,
    timelineData: [] as any[],
  });

  // Load analytics from localStorage
  useEffect(() => {
    const loadAnalytics = () => {
      const saved = localStorage.getItem('scraping-analytics');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnalytics(parsed);
        } catch (e) {
          console.error('Failed to load analytics');
        }
      }
    };

    loadAnalytics();
  }, []);

  const updateAnalytics = useCallback((newData: Partial<typeof analytics>) => {
    const updated = { ...analytics, ...newData };
    setAnalytics(updated);
    localStorage.setItem('scraping-analytics', JSON.stringify(updated));
  }, [analytics]);

  const recordScraping = useCallback((pages: ScrapedPage[], leads: ExtractedLead[]) => {
    const domains: Record<string, number> = {};
    const pageTypes: Record<string, number> = { ...analytics.pageTypes };

    pages.forEach(page => {
      // Count domains
      const domain = page.metadata?.domain || new URL(page.url).hostname;
      domains[domain] = (domains[domain] || 0) + 1;

      // Count page types
      if (page.pageType) {
        pageTypes[page.pageType] = (pageTypes[page.pageType] || 0) + 1;
      }
    });

    // Update top domains
    const topDomains = Object.entries(domains)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate average processing time
    const totalTime = pages.reduce((sum, page) => sum + (page.processingTime || 0), 0);
    const avgTime = pages.length > 0 ? totalTime / pages.length : 0;

    updateAnalytics({
      totalPages: analytics.totalPages + pages.length,
      totalLeads: analytics.totalLeads + leads.length,
      avgProcessingTime: avgTime,
      topDomains,
      pageTypes,
    });
  }, [analytics, updateAnalytics]);

  return { analytics, updateAnalytics, recordScraping };
}