'use client';

import { useState, useCallback, useEffect } from 'react';
// Removed readStreamableValue import as streaming is not used in AI SDK v5
import {
  generateEmailTemplateStreaming,
  generatePersonalizedEmail,
  analyzeEmailEffectiveness,
  generateFollowUpSequence,
  generateABTestVariations
} from './action';
import type {
  EmailTemplate,
  EmailContent,
  EmailAnalysis,
  FollowUpSequence,
  EmailLead,
  EmailCampaign,
  EmailTone,
  PersonalizedEmail
} from './type';

// Status type for async operations
type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

// Hook for email template generation
export function useEmailGenerator() {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [template, setTemplate] = useState<string>('');
  const [streamingTemplate, setStreamingTemplate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const generateTemplate = useCallback(async (
    purpose: string,
    targetAudience: string,
    keyPoints: string[],
    tone: EmailTone = 'professional'
  ) => {
    setStatus('loading');
    setError(null);
    setStreamingTemplate('');

    try {
      const result = await generateEmailTemplateStreaming(
        purpose,
        targetAudience,
        keyPoints,
        tone
      );

      if (result.success && result.data) {
        // Convert EmailContent to template string
        const templateText = result.data.textContent || '';
        setTemplate(templateText);
        setStreamingTemplate(templateText);
        setStatus('success');
      } else {
        setError(result.error || 'Failed to generate template');
        setStatus('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setTemplate('');
    setStreamingTemplate('');
    setError(null);
  }, []);

  return {
    generateTemplate,
    template,
    streamingTemplate,
    status,
    error,
    reset,
    isGenerating: status === 'loading'
  };
}

// Hook for email personalization
export function useEmailPersonalization() {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [personalizedEmails, setPersonalizedEmails] = useState<PersonalizedEmail[]>([]);
  const [currentEmail, setCurrentEmail] = useState<EmailContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const personalizeEmail = useCallback(async (
    template: string,
    lead: EmailLead,
    tone: EmailTone = 'professional'
  ) => {
    setStatus('loading');
    setError(null);

    try {
      const result = await generatePersonalizedEmail(template, lead, tone);

      if (result.success && result.data) {
        const personalized: PersonalizedEmail = {
          leadId: lead.id,
          leadEmail: lead.email,
          personalizedContent: result.data,
          status: 'draft'
        };

        setCurrentEmail(result.data);
        setPersonalizedEmails(prev => [...prev, personalized]);
        setStatus('success');
        return personalized;
      } else {
        setError(result.error || 'Failed to personalize email');
        setStatus('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  }, []);

  const personalizeForMultipleLeads = useCallback(async (
    template: string,
    leads: EmailLead[],
    tone: EmailTone = 'professional'
  ) => {
    setStatus('loading');
    setError(null);
    const results: PersonalizedEmail[] = [];

    try {
      for (const lead of leads) {
        const result = await generatePersonalizedEmail(template, lead, tone);
        if (result.success && result.data) {
          results.push({
            leadId: lead.id,
            leadEmail: lead.email,
            personalizedContent: result.data,
            status: 'draft'
          });
        }
      }

      setPersonalizedEmails(prev => [...prev, ...results]);
      setStatus('success');
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
      return results;
    }
  }, []);

  const clearPersonalized = useCallback(() => {
    setPersonalizedEmails([]);
    setCurrentEmail(null);
  }, []);

  return {
    personalizeEmail,
    personalizeForMultipleLeads,
    personalizedEmails,
    currentEmail,
    status,
    error,
    clearPersonalized,
    isPersonalizing: status === 'loading'
  };
}

// Hook for email analysis
export function useEmailAnalysis() {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null);
  const [history, setHistory] = useState<Array<{ email: string; analysis: EmailAnalysis }>>([]);
  const [error, setError] = useState<string | null>(null);

  const analyzeEmail = useCallback(async (
    emailContent: string,
    targetAudience?: string,
    purpose?: string
  ) => {
    setStatus('loading');
    setError(null);

    try {
      const result = await analyzeEmailEffectiveness(emailContent, targetAudience, purpose);

      if (result.success && result.data) {
        setAnalysis(result.data);
        setHistory(prev => [...prev, { email: emailContent, analysis: result.data }]);
        setStatus('success');
        return result.data;
      } else {
        setError(result.error || 'Failed to analyze email');
        setStatus('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  }, []);

  const getScoreColor = useCallback((score: number): string => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  }, []);

  const getSpamRiskColor = useCallback((risk: string): string => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return '';
    }
  }, []);

  return {
    analyzeEmail,
    analysis,
    history,
    status,
    error,
    getScoreColor,
    getSpamRiskColor,
    isAnalyzing: status === 'loading'
  };
}

// Hook for follow-up sequences
export function useFollowUpSequence() {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [sequence, setSequence] = useState<FollowUpSequence | null>(null);
  const [sequences, setSequences] = useState<FollowUpSequence[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateSequence = useCallback(async (
    initialEmail: string,
    numberOfFollowUps: number = 3,
    daysBetween: number = 3,
    strategy: 'persistent' | 'value_add' | 'urgency' | 'nurture' = 'value_add'
  ) => {
    setStatus('loading');
    setError(null);

    try {
      const result = await generateFollowUpSequence(
        initialEmail,
        numberOfFollowUps,
        daysBetween,
        strategy
      );

      if (result.success && result.data) {
        setSequence(result.data);
        setSequences(prev => [...prev, result.data]);
        setStatus('success');
        return result.data;
      } else {
        setError(result.error || 'Failed to generate sequence');
        setStatus('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  }, []);

  const clearSequence = useCallback(() => {
    setSequence(null);
  }, []);

  return {
    generateSequence,
    sequence,
    sequences,
    status,
    error,
    clearSequence,
    isGenerating: status === 'loading'
  };
}

// Hook for A/B testing
export function useEmailABTesting() {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [variations, setVariations] = useState<Array<{
    original: string;
    variation: string;
    testElement: string;
  }>>([]);
  const [currentTest, setCurrentTest] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generateVariation = useCallback(async (
    baseEmail: string,
    testElement: 'subject' | 'content' | 'cta' | 'tone' | 'length'
  ) => {
    setStatus('loading');
    setError(null);

    try {
      const result = await generateABTestVariations(baseEmail, testElement);

      if (result.success && result.data) {
        setCurrentTest(result.data);
        setVariations(prev => [...prev, result.data]);
        setStatus('success');
        return result.data;
      } else {
        setError(result.error || 'Failed to generate variation');
        setStatus('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  }, []);

  return {
    generateVariation,
    variations,
    currentTest,
    status,
    error,
    isGenerating: status === 'loading'
  };
}

// Hook for campaign management
export function useCampaignManagement() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<EmailCampaign | null>(null);

  const createCampaign = useCallback((campaign: EmailCampaign) => {
    const newCampaign = {
      ...campaign,
      id: `campaign-${Date.now()}`,
      createdAt: new Date(),
      status: 'draft' as const
    };
    setCampaigns(prev => [...prev, newCampaign]);
    setActiveCampaign(newCampaign);
    return newCampaign;
  }, []);

  const updateCampaign = useCallback((campaignId: string, updates: Partial<EmailCampaign>) => {
    setCampaigns(prev =>
      prev.map(campaign =>
        campaign.id === campaignId
          ? { ...campaign, ...updates, updatedAt: new Date() }
          : campaign
      )
    );
  }, []);

  const deleteCampaign = useCallback((campaignId: string) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
    if (activeCampaign?.id === campaignId) {
      setActiveCampaign(null);
    }
  }, [activeCampaign]);

  const getCampaignsByStatus = useCallback((status: EmailCampaign['status']) => {
    return campaigns.filter(campaign => campaign.status === status);
  }, [campaigns]);

  return {
    campaigns,
    activeCampaign,
    setActiveCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaignsByStatus
  };
}

// Hook for email metrics and analytics
export function useEmailMetrics() {
  const [metrics, setMetrics] = useState({
    totalSent: 0,
    totalOpened: 0,
    totalClicked: 0,
    totalReplied: 0,
    avgOpenRate: 0,
    avgClickRate: 0,
    avgReplyRate: 0,
    topPerformingEmail: null as any
  });

  const updateMetrics = useCallback((campaignMetrics: any) => {
    setMetrics(prev => ({
      totalSent: prev.totalSent + campaignMetrics.totalSent,
      totalOpened: prev.totalOpened + campaignMetrics.opened,
      totalClicked: prev.totalClicked + campaignMetrics.clicked,
      totalReplied: prev.totalReplied + campaignMetrics.replied,
      avgOpenRate: ((prev.totalOpened + campaignMetrics.opened) / (prev.totalSent + campaignMetrics.totalSent)) * 100,
      avgClickRate: ((prev.totalClicked + campaignMetrics.clicked) / (prev.totalSent + campaignMetrics.totalSent)) * 100,
      avgReplyRate: ((prev.totalReplied + campaignMetrics.replied) / (prev.totalSent + campaignMetrics.totalSent)) * 100,
      topPerformingEmail: prev.topPerformingEmail
    }));
  }, []);

  const getMetricTrend = useCallback((metric: 'open' | 'click' | 'reply'): 'up' | 'down' | 'stable' => {
    // Mock trend calculation - in real app would compare with historical data
    return 'up';
  }, []);

  return {
    metrics,
    updateMetrics,
    getMetricTrend
  };
}