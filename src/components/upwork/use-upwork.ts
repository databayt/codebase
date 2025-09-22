'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import {
  analyzeJobStreaming,
  analyzeJobStructured,
  generateProposalStreaming,
  generateProposalStructured,
  analyzeProposalEffectiveness,
  generateProposalVariations,
  analyzeClient,
  extractJobFromText,
} from './action';
import type {
  UpworkJob,
  JobAnalysis,
  Proposal,
  ClientAnalysis,
  ProposalAnalysis,
  ProposalTone,
} from './type';
import type {
  JobAnalysisRequest,
  ProposalGenerationRequest,
  ClientAnalysisRequest,
} from './validation';

// Helper function to read a ReadableStream
async function readStream(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }

  return result;
}

// Hook for job analysis
export function useJobAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [streamingAnalysis, setStreamingAnalysis] = useState('');
  const [error, setError] = useState<string | null>(null);

  const analyzeJobWithStreaming = useCallback(async (jobDescription: string) => {
    setIsAnalyzing(true);
    setError(null);
    setStreamingAnalysis('');

    try {
      const result = await analyzeJobStreaming(jobDescription);

      if (result.success && result.stream) {
        const content = await readStream(result.stream);
        setStreamingAnalysis(content);
        toast.success('Job analysis complete');
        return result;
      } else {
        setError(result.error || 'Analysis failed');
        toast.error(result.error || 'Failed to analyze job');
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

  const analyzeJobWithStructure = useCallback(async (request: JobAnalysisRequest) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeJobStructured(request);

      if (result.success && result.data) {
        setAnalysis(result.data);
        toast.success('Job analysis complete');
        return result;
      } else {
        setError(result.error || 'Analysis failed');
        toast.error(result.error || 'Failed to analyze job');
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

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setStreamingAnalysis('');
    setError(null);
  }, []);

  return {
    analyzeJobWithStreaming,
    analyzeJobWithStructure,
    analysis,
    streamingAnalysis,
    isAnalyzing,
    error,
    clearAnalysis,
  };
}

// Hook for proposal generation
export function useProposalGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [streamingProposal, setStreamingProposal] = useState('');
  const [variations, setVariations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateProposalWithStreaming = useCallback(
    async (jobDetails: any, tone: ProposalTone = 'professional', keyPoints: string[] = []) => {
      setIsGenerating(true);
      setError(null);
      setStreamingProposal('');

      try {
        const result = await generateProposalStreaming(jobDetails, tone, keyPoints);

        if (result.success && result.stream) {
          const content = await readStream(result.stream);
          setStreamingProposal(content);
          toast.success('Proposal generated successfully');
          return result;
        } else {
          setError(result.error || 'Generation failed');
          toast.error(result.error || 'Failed to generate proposal');
          return result;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Generation failed';
        setError(message);
        toast.error(message);
        return { success: false, error: message };
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const generateProposalWithStructure = useCallback(
    async (request: ProposalGenerationRequest) => {
      setIsGenerating(true);
      setError(null);

      try {
        const result = await generateProposalStructured(request);

        if (result.success && result.data) {
          setProposal(result.data);
          toast.success('Proposal generated successfully');
          return result;
        } else {
          setError(result.error || 'Generation failed');
          toast.error(result.error || 'Failed to generate proposal');
          return result;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Generation failed';
        setError(message);
        toast.error(message);
        return { success: false, error: message };
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const generateVariations = useCallback(async (originalProposal: string, count: number = 3) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateProposalVariations(originalProposal, count);

      if (result.success && result.data) {
        setVariations(result.data);
        toast.success(`Generated ${result.data.length} variations`);
        return result;
      } else {
        setError(result.error || 'Generation failed');
        toast.error(result.error || 'Failed to generate variations');
        return result;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearProposal = useCallback(() => {
    setProposal(null);
    setStreamingProposal('');
    setVariations([]);
    setError(null);
  }, []);

  return {
    generateProposalWithStreaming,
    generateProposalWithStructure,
    generateVariations,
    proposal,
    streamingProposal,
    variations,
    isGenerating,
    error,
    clearProposal,
  };
}

// Hook for proposal analysis
export function useProposalAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ProposalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeProposal = useCallback(async (proposalContent: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeProposalEffectiveness(proposalContent);

      if (result.success && result.data) {
        setAnalysis(result.data);
        toast.success('Proposal analysis complete');
        return result;
      } else {
        setError(result.error || 'Analysis failed');
        toast.error(result.error || 'Failed to analyze proposal');
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
    analyzeProposal,
    analysis,
    isAnalyzing,
    error,
  };
}

// Hook for client analysis
export function useClientAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ClientAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeClientProfile = useCallback(async (request: ClientAnalysisRequest) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeClient(request);

      if (result.success && result.data) {
        setAnalysis(result.data);
        toast.success('Client analysis complete');
        return result;
      } else {
        setError(result.error || 'Analysis failed');
        toast.error(result.error || 'Failed to analyze client');
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
    analyzeClientProfile,
    analysis,
    isAnalyzing,
    error,
  };
}

// Hook for job extraction
export function useJobExtraction() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedJob, setExtractedJob] = useState<UpworkJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractJob = useCallback(async (rawText: string) => {
    setIsExtracting(true);
    setError(null);

    try {
      const result = await extractJobFromText(rawText);

      if (result.success && result.data) {
        setExtractedJob(result.data as UpworkJob);
        toast.success('Job details extracted successfully');
        return result;
      } else {
        setError(result.error || 'Extraction failed');
        toast.error(result.error || 'Failed to extract job');
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
    setExtractedJob(null);
    setError(null);
  }, []);

  return {
    extractJob,
    extractedJob,
    isExtracting,
    error,
    clearExtracted,
  };
}

// Hook for saved proposals management
export function useSavedProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  // Load saved proposals from localStorage
  useEffect(() => {
    const loadProposals = () => {
      const saved = localStorage.getItem('upwork-proposals');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProposals(parsed);
        } catch (e) {
          console.error('Failed to load saved proposals');
        }
      }
    };

    loadProposals();
  }, []);

  const saveProposal = useCallback((proposal: Proposal) => {
    const updated = [...proposals, proposal];
    setProposals(updated);
    localStorage.setItem('upwork-proposals', JSON.stringify(updated));
    toast.success('Proposal saved');
  }, [proposals]);

  const deleteProposal = useCallback((id: string) => {
    const updated = proposals.filter(p => p.id !== id);
    setProposals(updated);
    localStorage.setItem('upwork-proposals', JSON.stringify(updated));
    toast.success('Proposal deleted');
  }, [proposals]);

  const updateProposal = useCallback((id: string, updates: Partial<Proposal>) => {
    const updated = proposals.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    );
    setProposals(updated);
    localStorage.setItem('upwork-proposals', JSON.stringify(updated));
    toast.success('Proposal updated');
  }, [proposals]);

  return {
    proposals,
    loading,
    selectedProposal,
    setSelectedProposal,
    saveProposal,
    deleteProposal,
    updateProposal,
  };
}

// Hook for job analytics
export function useJobAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalAnalyzed: 0,
    averageScore: 0,
    viabilityBreakdown: {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
    },
    topCategories: [] as { category: string; count: number }[],
    successRate: 0,
    proposalsSent: 0,
    proposalsWon: 0,
  });

  // Load analytics from localStorage
  useEffect(() => {
    const loadAnalytics = () => {
      const saved = localStorage.getItem('upwork-analytics');
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
    localStorage.setItem('upwork-analytics', JSON.stringify(updated));
  }, [analytics]);

  return { analytics, updateAnalytics };
}