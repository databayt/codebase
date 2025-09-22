'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiStreamingText } from '@/components/atom/ai/ai-streaming-text';
import { AiStatusIndicator } from '@/components/atom/ai/ai-status-indicator';
import {
  Sparkles,
  Copy,
  RefreshCw,
  Save,
  FileText,
  Zap,
  MessageSquare,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useProposalGeneration, useProposalAnalysis, useSavedProposals } from './use-upwork';
import { PROPOSAL_TONES } from './constant';
import type { ProposalTone, JobAnalysis } from './type';

interface ProposalGeneratorProps {
  jobAnalysis?: JobAnalysis;
  jobDetails?: any;
}

export function ProposalGenerator({ jobAnalysis, jobDetails }: ProposalGeneratorProps) {
  const [tone, setTone] = useState<ProposalTone>('professional');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [keyPointInput, setKeyPointInput] = useState('');
  const [includePortfolio, setIncludePortfolio] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');
  const [rate, setRate] = useState('');
  const [duration, setDuration] = useState('');
  const [activeTab, setActiveTab] = useState('generate');

  const {
    generateProposalWithStreaming,
    generateVariations,
    streamingProposal,
    variations,
    isGenerating,
    clearProposal,
  } = useProposalGeneration();

  const {
    analyzeProposal,
    analysis,
    isAnalyzing,
  } = useProposalAnalysis();

  const {
    saveProposal,
    proposals,
  } = useSavedProposals();

  const handleGenerate = async () => {
    if (!jobAnalysis && !jobDetails) {
      // Need to analyze job first
      return;
    }

    await generateProposalWithStreaming(
      jobAnalysis || jobDetails,
      tone,
      keyPoints
    );
  };

  const handleAnalyze = async () => {
    if (!streamingProposal) return;
    await analyzeProposal(streamingProposal);
    setActiveTab('analysis');
  };

  const handleGenerateVariations = async () => {
    if (!streamingProposal) return;
    await generateVariations(streamingProposal, 3);
    setActiveTab('variations');
  };

  const handleSaveProposal = () => {
    if (!streamingProposal) return;

    saveProposal({
      id: crypto.randomUUID(),
      jobId: jobDetails?.id || '',
      content: streamingProposal,
      coverLetter: streamingProposal,
      tone,
      keyPoints,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: '',
    });
  };

  const addKeyPoint = () => {
    if (keyPointInput.trim() && keyPoints.length < 10) {
      setKeyPoints([...keyPoints, keyPointInput.trim()]);
      setKeyPointInput('');
    }
  };

  const removeKeyPoint = (index: number) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== index));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Proposal Configuration</CardTitle>
          <CardDescription>
            Customize how AI generates your Upwork proposal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tone Selection */}
          <div className="space-y-2">
            <Label>Tone</Label>
            <RadioGroup value={tone} onValueChange={(v) => setTone(v as ProposalTone)}>
              <div className="grid gap-3 md:grid-cols-5">
                {PROPOSAL_TONES.map((t) => (
                  <div key={t.value}>
                    <RadioGroupItem
                      value={t.value}
                      id={t.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={t.value}
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="text-2xl mb-1">{t.icon}</span>
                      <span className="text-sm font-medium">{t.label}</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">
                        {t.description}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Key Points */}
          <div className="space-y-2">
            <Label>Key Points to Include</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a key point..."
                value={keyPointInput}
                onChange={(e) => setKeyPointInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyPoint();
                  }
                }}
              />
              <Button onClick={addKeyPoint} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {keyPoints.map((point, i) => (
                <Badge key={i} variant="secondary">
                  {point}
                  <button
                    onClick={() => removeKeyPoint(i)}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Suggested: Your experience, unique approach, quick turnaround, communication style
            </p>
          </div>

          {/* Additional Options */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rate">Proposed Rate</Label>
              <Input
                id="rate"
                placeholder="$50/hr or $500 fixed"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Estimated Duration</Label>
              <Input
                id="duration"
                placeholder="2 weeks"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Custom Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Any specific instructions for the AI..."
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="portfolio"
              checked={includePortfolio}
              onCheckedChange={(checked) => setIncludePortfolio(!!checked)}
            />
            <Label htmlFor="portfolio">Include portfolio references</Label>
          </div>

          {/* Generate Button */}
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || (!jobAnalysis && !jobDetails)}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Proposal
                </>
              )}
            </Button>
            {streamingProposal && (
              <>
                <Button variant="outline" onClick={handleAnalyze}>
                  <Target className="h-4 w-4 mr-2" />
                  Analyze
                </Button>
                <Button variant="outline" onClick={handleGenerateVariations}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Variations
                </Button>
              </>
            )}
          </div>

          {/* Status */}
          {isGenerating && (
            <AiStatusIndicator
              status="streaming"
              provider="Claude"
              model="claude-3-5-sonnet"
              showDetails
            />
          )}
        </CardContent>
      </Card>

      {/* Generated Proposal */}
      {(streamingProposal || variations.length > 0 || analysis) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Proposal</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(streamingProposal)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSaveProposal}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="generate">Proposal</TabsTrigger>
                <TabsTrigger value="analysis" disabled={!analysis}>
                  Analysis
                </TabsTrigger>
                <TabsTrigger value="variations" disabled={variations.length === 0}>
                  Variations ({variations.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="mt-4">
                <div className="prose dark:prose-invert max-w-none">
                  <AiStreamingText text={streamingProposal} speed="instant" />
                </div>
                <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                  <span>Words: {streamingProposal.split(' ').length}</span>
                  <span>Characters: {streamingProposal.length}</span>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="mt-4">
                {analysis && (
                  <div className="space-y-4">
                    {/* Overall Score */}
                    <div className="text-center">
                      <div className="text-5xl font-bold">
                        <span className={getScoreColor(analysis.score)}>
                          {analysis.score}
                        </span>
                        <span className="text-2xl text-muted-foreground">/100</span>
                      </div>
                      <p className="text-muted-foreground mt-2">Effectiveness Score</p>
                    </div>

                    {/* Detailed Scores */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Readability</span>
                          <span className="text-sm font-medium">{analysis.readabilityScore}/100</span>
                        </div>
                        <Progress value={analysis.readabilityScore} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Personalization</span>
                          <span className="text-sm font-medium">{analysis.personalizationScore}/100</span>
                        </div>
                        <Progress value={analysis.personalizationScore} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Value Proposition</span>
                          <span className="text-sm font-medium">{analysis.valuePropositionScore}/100</span>
                        </div>
                        <Progress value={analysis.valuePropositionScore} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Call to Action</span>
                          <span className="text-sm font-medium">{analysis.callToActionScore}/100</span>
                        </div>
                        <Progress value={analysis.callToActionScore} className="h-2" />
                      </div>
                    </div>

                    {/* Estimated Response Rate */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Estimated Response Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analysis.estimatedResponseRate}%</div>
                      </CardContent>
                    </Card>

                    {/* Strengths & Improvements */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Strengths
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {analysis.strengths.map((strength, i) => (
                              <li key={i} className="text-sm">• {strength}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            Improvements
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {analysis.improvements.map((improvement, i) => (
                              <li key={i} className="text-sm">• {improvement}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Suggestions */}
                    {analysis.suggestions.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {analysis.suggestions.map((suggestion, i) => (
                              <li key={i} className="text-sm">→ {suggestion}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="variations" className="mt-4 space-y-4">
                {variations.map((variation, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Variation {i + 1}</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(variation)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose dark:prose-invert max-w-none text-sm">
                        {variation}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}