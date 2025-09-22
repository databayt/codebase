'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Mail,
  Send,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  Zap,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { EmailComposer } from './composer';
import { EmailAnalyzer } from './analyzer';
import { FollowUpGenerator } from './follow-up';
import { CampaignManager } from './campaigns';
import { EmailAnalytics } from './analytics';
import { EmailAutomation } from './automation';
import { useEmailMetrics } from './use-emails';

export function EmailContent() {
  const [activeTab, setActiveTab] = useState('compose');
  const { metrics } = useEmailMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Mail className="h-8 w-8 text-primary" />
            AI Email Automation
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate, personalize, and optimize email campaigns with AI
          </p>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Total Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Avg Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgOpenRate.toFixed(1)}%</div>
            <Progress value={metrics.avgOpenRate} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Click Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgClickRate.toFixed(1)}%</div>
            <Progress value={metrics.avgClickRate * 10} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Reply Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgReplyRate.toFixed(1)}%</div>
            <Progress value={metrics.avgReplyRate * 10} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="compose">
            <Mail className="h-4 w-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="analyze">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analyze
          </TabsTrigger>
          <TabsTrigger value="followup">
            <MessageSquare className="h-4 w-4 mr-2" />
            Follow-up
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <Users className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Zap className="h-4 w-4 mr-2" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="mt-6">
          <EmailComposer />
        </TabsContent>

        <TabsContent value="analyze" className="mt-6">
          <EmailAnalyzer />
        </TabsContent>

        <TabsContent value="followup" className="mt-6">
          <FollowUpGenerator />
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <CampaignManager />
        </TabsContent>

        <TabsContent value="automation" className="mt-6">
          <EmailAutomation />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <EmailAnalytics />
        </TabsContent>
      </Tabs>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Email Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4 text-sm">
            <div className="flex items-start gap-2">
              <Badge className="mt-0.5" variant="outline">1</Badge>
              <div>
                <p className="font-medium">Subject Lines</p>
                <p className="text-muted-foreground text-xs">
                  Keep under 50 chars, avoid spam triggers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="mt-0.5" variant="outline">2</Badge>
              <div>
                <p className="font-medium">Personalization</p>
                <p className="text-muted-foreground text-xs">
                  Use merge tags naturally, reference context
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="mt-0.5" variant="outline">3</Badge>
              <div>
                <p className="font-medium">Timing</p>
                <p className="text-muted-foreground text-xs">
                  Tue-Thu, 10 AM or 2 PM optimal
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="mt-0.5" variant="outline">4</Badge>
              <div>
                <p className="font-medium">Follow-ups</p>
                <p className="text-muted-foreground text-xs">
                  3-5 touchpoints, add value each time
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}