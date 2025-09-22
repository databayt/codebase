'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase,
  FileText,
  TrendingUp,
  Search,
  BarChart3,
  Star,
  Target,
  Award,
  Clock,
  DollarSign,
} from 'lucide-react';
import { JobAnalyzer } from './analyzer';
import { ProposalGenerator } from './generator';
import { ProposalList } from './all';
import { JobAnalytics } from './analytics';
import { useJobAnalytics } from './use-upwork';
import UpworkPrompt from './prompt';

export function UpworkContent() {
  const [activeTab, setActiveTab] = useState('analyze');
  const { analytics } = useJobAnalytics();

  return (
    <>
      <UpworkPrompt />
      <div id="upwork-content" className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            Upwork Job Analyzer
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyze jobs, generate proposals, and track performance with AI
          </p>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Jobs Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAnalyzed}</div>
            <p className="text-xs text-muted-foreground">Total all time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              {analytics.averageScore.toFixed(1)}
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <Progress value={analytics.averageScore * 10} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Proposals Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.proposalsSent}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.proposalsWon} won
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.proposalsSent > 0
                ? ((analytics.proposalsWon / analytics.proposalsSent) * 100).toFixed(0)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Viability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              <Badge variant="default" className="text-sm">
                {analytics.viabilityBreakdown.excellent || 0}
              </Badge>
              <span className="text-sm text-muted-foreground">excellent</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.viabilityBreakdown.good || 0} good jobs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analyze">
            <Search className="h-4 w-4 mr-2" />
            Analyze
          </TabsTrigger>
          <TabsTrigger value="generate">
            <FileText className="h-4 w-4 mr-2" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="proposals">
            <Briefcase className="h-4 w-4 mr-2" />
            Proposals
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="mt-6">
          <JobAnalyzer />
        </TabsContent>

        <TabsContent value="generate" className="mt-6">
          <ProposalGenerator />
        </TabsContent>

        <TabsContent value="proposals" className="mt-6">
          <ProposalList />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <JobAnalytics />
        </TabsContent>
      </Tabs>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge className="mt-0.5" variant="outline">1</Badge>
              <div>
                <p className="font-medium">Analyze First</p>
                <p className="text-muted-foreground text-xs">
                  Always analyze jobs before writing proposals to save time on poor matches
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="mt-0.5" variant="outline">2</Badge>
              <div>
                <p className="font-medium">Focus on 7+ Scores</p>
                <p className="text-muted-foreground text-xs">
                  Jobs scoring 7 or higher have the best ROI for your time investment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="mt-0.5" variant="outline">3</Badge>
              <div>
                <p className="font-medium">Personalize Always</p>
                <p className="text-muted-foreground text-xs">
                  Use AI as a starting point but always add personal touches
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}