'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Send,
  Calendar,
  Play,
  Pause,
  BarChart3,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Settings,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useCampaignManagement } from './use-emails';
import { CAMPAIGN_STATUS_COLORS } from './constant';
import type { EmailCampaign } from './type';

export function CampaignManager() {
  const [activeView, setActiveView] = useState<'all' | 'draft' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    campaigns,
    activeCampaign,
    setActiveCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaignsByStatus
  } = useCampaignManagement();

  // Mock campaigns for demonstration
  const mockCampaigns: EmailCampaign[] = [
    {
      id: '1',
      name: 'Q1 Product Launch',
      template: {
        name: 'Product Launch Template',
        subject: 'Introducing Our Latest Innovation',
        greeting: 'Hi {{firstName}}',
        introduction: 'We are excited to announce...',
        body: ['Feature highlights', 'Customer benefits'],
        callToAction: 'Get Started Today',
        closing: 'Best regards',
        signature: 'The Team',
        tone: 'friendly',
        purpose: 'product_launch',
        personalizationLevel: 8,
        personalizationFields: ['firstName', 'company']
      },
      leads: [],
      status: 'active',
      settings: {
        sendingSpeed: 'gradual',
        batchSize: 50,
        delayBetweenBatches: 10,
        trackOpens: true,
        trackClicks: true,
        fromName: 'Sales Team',
        fromEmail: 'sales@company.com',
        unsubscribeLink: true
      },
      metrics: {
        totalSent: 1250,
        delivered: 1200,
        bounced: 50,
        opened: 450,
        clicked: 125,
        replied: 35,
        unsubscribed: 8,
        markedAsSpam: 2,
        openRate: 37.5,
        clickRate: 10.4,
        replyRate: 2.9,
        bounceRate: 4.0
      },
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Re-engagement Campaign',
      template: {
        name: 'Re-engagement Template',
        subject: 'We Miss You!',
        greeting: 'Hi {{firstName}}',
        introduction: 'It has been a while...',
        body: ['Special offer', 'What is new'],
        callToAction: 'Come Back',
        closing: 'Hope to see you soon',
        signature: 'Customer Success',
        tone: 'friendly',
        purpose: 'cold_outreach',
        personalizationLevel: 6,
        personalizationFields: ['firstName']
      },
      leads: [],
      status: 'scheduled',
      scheduledTime: new Date('2024-02-01'),
      settings: {
        sendingSpeed: 'throttled',
        batchSize: 25,
        delayBetweenBatches: 30,
        trackOpens: true,
        trackClicks: true,
        fromName: 'Customer Success',
        fromEmail: 'success@company.com',
        unsubscribeLink: true
      },
      createdAt: new Date('2024-01-20')
    },
    {
      id: '3',
      name: 'Welcome Series',
      template: {
        name: 'Welcome Template',
        subject: 'Welcome to the Family!',
        greeting: 'Hi {{firstName}}',
        introduction: 'Thank you for joining us...',
        body: ['Getting started guide', 'Key features'],
        callToAction: 'Start Your Journey',
        closing: 'Welcome aboard',
        signature: 'The Team',
        tone: 'friendly',
        purpose: 'announcement',
        personalizationLevel: 7,
        personalizationFields: ['firstName', 'company']
      },
      leads: [],
      status: 'draft',
      settings: {
        sendingSpeed: 'immediate',
        trackOpens: true,
        trackClicks: true,
        fromName: 'Welcome Team',
        fromEmail: 'welcome@company.com',
        unsubscribeLink: true
      },
      createdAt: new Date('2024-01-25')
    }
  ];

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesView = activeView === 'all' || campaign.status === activeView;
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesView && matchesSearch;
  });

  const getCampaignIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'active': return <Play className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getMetricColor = (value: number, metric: 'open' | 'click' | 'bounce') => {
    if (metric === 'bounce') {
      return value < 5 ? 'text-green-600' : value < 10 ? 'text-yellow-600' : 'text-red-600';
    }
    return value > 30 ? 'text-green-600' : value > 15 ? 'text-yellow-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>
                Manage and monitor your email campaigns
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Campaign List */}
      <div className="grid gap-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <Badge className={CAMPAIGN_STATUS_COLORS[campaign.status]}>
                      {getCampaignIcon(campaign.status)}
                      <span className="ml-1">{campaign.status}</span>
                    </Badge>
                  </div>
                  <CardDescription>
                    {campaign.template.purpose.replace('_', ' ')} • {campaign.template.tone} tone
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Campaign Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{campaign.createdAt?.toLocaleDateString() || 'N/A'}</p>
                </div>
                {campaign.scheduledTime && (
                  <div>
                    <p className="text-muted-foreground">Scheduled</p>
                    <p className="font-medium">{campaign.scheduledTime.toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Sending Speed</p>
                  <p className="font-medium capitalize">{campaign.settings.sendingSpeed}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Subject</p>
                  <p className="font-medium truncate">{campaign.template.subject}</p>
                </div>
              </div>

              {/* Metrics (if available) */}
              {campaign.metrics && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs">Sent</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{campaign.metrics.totalSent.toLocaleString()}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs">Open Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className={`text-lg font-bold ${getMetricColor(campaign.metrics.openRate, 'open')}`}>
                          {campaign.metrics.openRate.toFixed(1)}%
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs">Click Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className={`text-lg font-bold ${getMetricColor(campaign.metrics.clickRate, 'click')}`}>
                          {campaign.metrics.clickRate.toFixed(1)}%
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs">Replies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold">{campaign.metrics.replied}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs">Bounce Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className={`text-lg font-bold ${getMetricColor(campaign.metrics.bounceRate, 'bounce')}`}>
                          {campaign.metrics.bounceRate.toFixed(1)}%
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Delivery Progress</span>
                      <span>{campaign.metrics.delivered} / {campaign.metrics.totalSent}</span>
                    </div>
                    <Progress
                      value={(campaign.metrics.delivered / campaign.metrics.totalSent) * 100}
                      className="h-2"
                    />
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {campaign.status === 'draft' && (
                  <>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send Now
                    </Button>
                  </>
                )}
                {campaign.status === 'scheduled' && (
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Schedule
                  </Button>
                )}
                {campaign.status === 'active' && (
                  <Button size="sm" variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                )}
                {campaign.status === 'paused' && (
                  <Button size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No campaigns found</p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}