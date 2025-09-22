'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiStreamingText } from '@/components/atom/ai/ai-streaming-text';
import { AiStatusIndicator } from '@/components/atom/ai/ai-status-indicator';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Target,
  DollarSign,
  Clock,
  Users,
  Sparkles,
  FileText,
  Copy,
} from 'lucide-react';
import { useJobAnalysis, useJobExtraction } from './use-upwork';
import { VIABILITY_LEVELS, SCORE_CATEGORIES } from './constant';
import type { JobAnalysis } from './type';

export function JobAnalyzer() {
  const [jobDescription, setJobDescription] = useState('');
  const [activeView, setActiveView] = useState<'streaming' | 'structured'>('streaming');

  const {
    analyzeJobWithStreaming,
    analyzeJobWithStructure,
    analysis,
    streamingAnalysis,
    isAnalyzing,
    clearAnalysis,
  } = useJobAnalysis();

  const { extractJob, extractedJob, isExtracting } = useJobExtraction();

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;

    if (activeView === 'streaming') {
      await analyzeJobWithStreaming(jobDescription);
    } else {
      await analyzeJobWithStructure({
        jobDescription,
        skills: [], // Would be populated from user profile
        experienceYears: 5, // Would be from user profile
      });
    }
  };

  const handleExtractAndAnalyze = async () => {
    if (!jobDescription.trim()) return;

    // First extract job details
    const extractResult = await extractJob(jobDescription);
    if (extractResult.success && extractResult.data) {
      // Then analyze
      await analyzeJobWithStructure({
        jobDescription,
        skills: extractResult.data.skills || [],
      });
    }
  };

  const getViabilityColor = (viability: string) => {
    const level = VIABILITY_LEVELS.find(v => v.value === viability);
    return level?.color || 'text-gray-600';
  };

  const getViabilityBg = (viability: string) => {
    const level = VIABILITY_LEVELS.find(v => v.value === viability);
    return level?.bgColor || 'bg-gray-100';
  };

  const renderStructuredAnalysis = (analysis: JobAnalysis) => (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center">
        <div className="text-6xl font-bold mb-2">
          <span className={getViabilityColor(analysis.viability)}>
            {analysis.overallScore.toFixed(1)}
          </span>
          <span className="text-2xl text-muted-foreground">/10</span>
        </div>
        <Badge className={`${getViabilityBg(analysis.viability)} ${getViabilityColor(analysis.viability)}`}>
          {analysis.viability.toUpperCase()}
        </Badge>
        <p className="text-sm text-muted-foreground mt-2">
          {VIABILITY_LEVELS.find(v => v.value === analysis.viability)?.description}
        </p>
      </div>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SCORE_CATEGORIES.map(category => {
            const score = analysis.scores[category.key as keyof typeof analysis.scores];
            return (
              <div key={category.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.label}
                  </span>
                  <span className="text-sm font-medium">{score}/10</span>
                </div>
                <Progress value={score * 10} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.estimatedSuccessRate}%</div>
          </CardContent>
        </Card>

        {analysis.suggestedRate && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Suggested Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${analysis.suggestedRate.hourly || analysis.suggestedRate.fixed}
                <span className="text-sm text-muted-foreground ml-1">
                  {analysis.suggestedRate.hourly ? '/hr' : ' fixed'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {analysis.timeEstimate && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Estimate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analysis.timeEstimate.min}-{analysis.timeEstimate.max}
                <span className="text-sm text-muted-foreground ml-1">
                  {analysis.timeEstimate.unit}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <XCircle className="h-4 w-4 text-orange-600" />
              Concerns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.weaknesses.map((weakness, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Red Flags */}
      {analysis.redFlags.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              Red Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.redFlags.map((flag, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">⚠</span>
                  {flag}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>
            Paste the Upwork job description to analyze viability and get AI insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the complete Upwork job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />

          <div className="flex gap-2">
            <Button
              onClick={handleAnalyze}
              disabled={!jobDescription.trim() || isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Job
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleExtractAndAnalyze}
              disabled={!jobDescription.trim() || isExtracting || isAnalyzing}
            >
              <FileText className="h-4 w-4 mr-2" />
              Extract & Analyze
            </Button>
            {(streamingAnalysis || analysis) && (
              <Button
                variant="outline"
                onClick={() => {
                  clearAnalysis();
                  setJobDescription('');
                }}
              >
                Clear
              </Button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Analysis Mode:</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={activeView === 'streaming' ? 'default' : 'outline'}
                onClick={() => setActiveView('streaming')}
              >
                Streaming
              </Button>
              <Button
                size="sm"
                variant={activeView === 'structured' ? 'default' : 'outline'}
                onClick={() => setActiveView('structured')}
              >
                Structured
              </Button>
            </div>
          </div>

          {/* Status */}
          {isAnalyzing && (
            <AiStatusIndicator
              status="processing"
              provider="Claude"
              model="claude-3-5-sonnet"
              showDetails
            />
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {(streamingAnalysis || analysis) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Analysis Results</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(streamingAnalysis || JSON.stringify(analysis, null, 2));
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeView === 'streaming' && streamingAnalysis ? (
              <div className="prose dark:prose-invert max-w-none">
                <AiStreamingText text={streamingAnalysis} speed="instant" />
              </div>
            ) : analysis ? (
              renderStructuredAnalysis(analysis)
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Extracted Job Details */}
      {extractedJob && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Title:</span> {extractedJob.title}
              </div>
              {extractedJob.budget && (
                <div>
                  <span className="font-medium">Budget:</span>{' '}
                  {extractedJob.budget.type === 'fixed'
                    ? `$${extractedJob.budget.amount} (Fixed)`
                    : `$${extractedJob.budget.min}-${extractedJob.budget.max}/hr`}
                </div>
              )}
              {extractedJob.skills && (
                <div>
                  <span className="font-medium">Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {extractedJob.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}