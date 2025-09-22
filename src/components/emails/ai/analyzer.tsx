'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Mail,
  Clock,
  Target,
  AlertTriangle,
  Sparkles,
  FileText
} from 'lucide-react';
import { useEmailAnalysis } from './use-emails';
import { EMAIL_METRICS } from './constant';

export function EmailAnalyzer() {
  const [emailContent, setEmailContent] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [purpose, setPurpose] = useState('');

  const {
    analyzeEmail,
    analysis,
    status,
    error,
    getScoreColor,
    getSpamRiskColor,
    isAnalyzing
  } = useEmailAnalysis();

  const handleAnalyze = async () => {
    if (!emailContent.trim()) return;
    await analyzeEmail(emailContent, targetAudience, purpose);
  };

  const loadSample = () => {
    setEmailContent(`Subject: Transform Your Sales Process with AI-Powered Automation

Hi {{firstName}},

I noticed {{company}} is scaling rapidly - congrats on your recent Series B!

With growth comes challenges, especially in maintaining personalized customer engagement at scale. That's exactly what we help companies like yours solve.

Our AI sales automation platform has helped similar B2B SaaS companies:
• Increase qualified leads by 47% in just 3 months
• Reduce sales cycle time by 23%
• Improve email response rates by 3.2x

I'd love to show you how {{company}} could achieve similar results. We've prepared a custom demo specifically for your use case.

Are you available for a quick 15-minute call this week? I have slots open on Tuesday at 2 PM or Thursday at 10 AM EST.

Best regards,
Sarah Chen
VP of Sales, AITechCorp
P.S. I'm also sending you our latest case study with TechGiant Inc. - they're in your space and saw incredible results.`);
    setTargetAudience('B2B SaaS decision makers');
    setPurpose('cold_outreach');
  };

  const getMetricBadge = (value: number, metric: 'open' | 'click' | 'reply') => {
    const thresholds = EMAIL_METRICS[`${metric}Rate`];
    if (value >= thresholds.excellent) return 'default';
    if (value >= thresholds.good) return 'secondary';
    if (value >= thresholds.average) return 'outline';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Email Effectiveness Analyzer</CardTitle>
          <CardDescription>
            Analyze your email for engagement potential and optimization opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-content">Email Content</Label>
            <Textarea
              id="email-content"
              placeholder="Paste your email content here (including subject line)..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target Audience (Optional)</Label>
              <Input
                id="target"
                placeholder="e.g., B2B decision makers, startup founders..."
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Email Purpose (Optional)</Label>
              <Input
                id="purpose"
                placeholder="e.g., cold outreach, follow-up, announcement..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAnalyze}
              disabled={!emailContent.trim() || isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyze Email
                </>
              )}
            </Button>
            <Button variant="outline" onClick={loadSample}>
              <FileText className="h-4 w-4 mr-2" />
              Load Sample
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <>
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle>Email Effectiveness Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold">
                  <span className={getScoreColor(analysis.overallScore)}>
                    {analysis.overallScore}
                  </span>
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <Progress value={analysis.overallScore} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  Your email scores {analysis.overallScore >= 70 ? 'above' : 'below'} industry average
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Score Breakdown */}
              <div className="space-y-3">
                {Object.entries(analysis.scores).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`text-sm font-medium ${getScoreColor(value)}`}>
                        {value}/100
                      </span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>

              {/* Predictions and Risk */}
              <div className="grid md:grid-cols-4 gap-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Open Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-primary">
                      {analysis.predictedOpenRate}%
                    </div>
                    <Badge variant={getMetricBadge(analysis.predictedOpenRate, 'open')} className="mt-1">
                      Predicted
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Click Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-primary">
                      {analysis.predictedClickRate}%
                    </div>
                    <Badge variant={getMetricBadge(analysis.predictedClickRate, 'click')} className="mt-1">
                      Predicted
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Reply Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-primary">
                      {analysis.predictedReplyRate}%
                    </div>
                    <Badge variant={getMetricBadge(analysis.predictedReplyRate, 'reply')} className="mt-1">
                      Predicted
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Spam Risk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={getSpamRiskColor(analysis.spamRisk)}>
                      {analysis.spamRisk}
                    </Badge>
                    {analysis.spamTriggers && analysis.spamTriggers.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {analysis.spamTriggers.length} triggers
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Additional Metrics */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{analysis.readingTime}s reading time</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  <span>Sentiment: {analysis.sentimentScore > 0 ? 'Positive' : analysis.sentimentScore < 0 ? 'Negative' : 'Neutral'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strengths and Improvements */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.improvements.map((improvement, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions */}
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Optimization Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5">
                        {i + 1}
                      </Badge>
                      <p className="text-sm flex-1">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Spam Triggers */}
          {analysis.spamTriggers && analysis.spamTriggers.length > 0 && (
            <Card className="border-orange-200 dark:border-orange-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Spam Trigger Words Detected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.spamTriggers.map((trigger, i) => (
                    <Badge key={i} variant="destructive">
                      {trigger}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Consider replacing these words to improve deliverability
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}