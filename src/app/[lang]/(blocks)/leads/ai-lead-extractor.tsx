'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiPromptInput } from '@/components/atom/ai/ai-prompt-input';
import { AiStatusIndicator } from '@/components/atom/ai/ai-status-indicator';
import { extractLeadsFromText, scoreLeads, enrichLead } from './actions';
import { FileText, Globe, Database, Sparkles, Users, TrendingUp } from 'lucide-react';

interface ExtractedLead {
  id?: string;
  name: string;
  email?: string;
  company?: string;
  score: number;
  confidence: number;
  duplicate?: boolean;
}

export function AiLeadExtractor() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [extractedLeads, setExtractedLeads] = useState<ExtractedLead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  const templates = [
    {
      label: 'LinkedIn Search Results',
      prompt: 'Paste LinkedIn search results or profile information here...'
    },
    {
      label: 'Conference Attendee List',
      prompt: 'Paste conference or webinar attendee list here...'
    },
    {
      label: 'Email Signatures',
      prompt: 'Paste email threads with signatures here...'
    },
    {
      label: 'Company Directory',
      prompt: 'Paste company team page or directory content here...'
    }
  ];

  const suggestions = [
    'Extract leads from LinkedIn',
    'Parse business cards',
    'Find contacts in email',
    'Extract from website'
  ];

  const handleExtraction = async (rawText: string) => {
    setStatus('processing');
    setMessage('Analyzing text and extracting leads...');

    try {
      const result = await extractLeadsFromText(rawText, 'manual');

      if (result.success && result.data) {
        setExtractedLeads(result.data.leads);
        setStatus('success');
        setMessage(
          `Extracted ${result.data.extracted} leads (${result.data.saved} new, ${result.data.duplicates} duplicates)`
        );
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to extract leads');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during extraction');
    }
  };

  const handleScoring = async () => {
    const leadIds = Array.from(selectedLeads);
    if (leadIds.length === 0) return;

    setStatus('processing');
    setMessage('Scoring selected leads...');

    try {
      const result = await scoreLeads(leadIds);

      if (result.success) {
        setStatus('success');
        setMessage(`Successfully scored ${leadIds.length} leads`);
        // Refresh leads display
        setExtractedLeads(prev =>
          prev.map(lead => {
            const scored = result.data?.find(s => s.id === lead.id);
            return scored ? { ...lead, score: scored.score } : lead;
          })
        );
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to score leads');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during scoring');
    }
  };

  const handleEnrichment = async (leadId: string) => {
    setStatus('processing');
    setMessage('Enriching lead data...');

    try {
      const result = await enrichLead(leadId);

      if (result.success) {
        setStatus('success');
        setMessage('Lead enriched successfully');
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to enrich lead');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during enrichment');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Lead Extraction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">
              <FileText className="h-4 w-4 mr-2" />
              Text
            </TabsTrigger>
            <TabsTrigger value="web" disabled>
              <Globe className="h-4 w-4 mr-2" />
              Web
            </TabsTrigger>
            <TabsTrigger value="database" disabled>
              <Database className="h-4 w-4 mr-2" />
              Database
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <AiPromptInput
              onSubmit={handleExtraction}
              placeholder="Paste text containing lead information (emails, LinkedIn profiles, contact lists, etc.)"
              suggestions={suggestions}
              templates={templates}
              maxLength={5000}
              loading={status === 'processing'}
              className="mt-4"
            />

            {/* Status indicator */}
            <AiStatusIndicator
              status={status}
              message={message}
              provider="Groq"
              model="llama-3.1-70b"
              showDetails={status !== 'idle'}
            />

            {/* Extracted leads display */}
            {extractedLeads.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Extracted Leads ({extractedLeads.length})
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleScoring}
                      disabled={selectedLeads.size === 0}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Score Selected
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {extractedLeads.map((lead, index) => (
                    <div
                      key={lead.id || index}
                      className={`p-3 rounded-lg border ${
                        lead.duplicate
                          ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800'
                          : 'bg-card'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedLeads.has(lead.id || String(index))}
                            onChange={(e) => {
                              const newSelected = new Set(selectedLeads);
                              if (e.target.checked) {
                                newSelected.add(lead.id || String(index));
                              } else {
                                newSelected.delete(lead.id || String(index));
                              }
                              setSelectedLeads(newSelected);
                            }}
                            className="mt-1"
                            disabled={!lead.id}
                          />
                          <div className="space-y-1">
                            <div className="font-medium">{lead.name}</div>
                            {lead.company && (
                              <div className="text-sm text-muted-foreground">
                                {lead.company}
                              </div>
                            )}
                            {lead.email && (
                              <div className="text-sm text-muted-foreground">
                                {lead.email}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {lead.duplicate && (
                            <span className="text-xs text-orange-600 dark:text-orange-400">
                              Duplicate
                            </span>
                          )}
                          <div className="text-sm">
                            <span className="text-muted-foreground">Score: </span>
                            <span className="font-medium">{lead.score}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Confidence: </span>
                            <span className="font-medium">
                              {Math.round(lead.confidence * 100)}%
                            </span>
                          </div>
                          {lead.id && !lead.duplicate && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEnrichment(lead.id!)}
                            >
                              Enrich
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}