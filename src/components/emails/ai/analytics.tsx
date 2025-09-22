'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import {
  Mail,
  Send,
  Eye,
  MousePointer,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { EMAIL_METRICS } from './constant';

export function EmailAnalytics() {
  // Mock data for charts
  const performanceData = [
    { month: 'Jan', sent: 1200, opened: 450, clicked: 120, replied: 35 },
    { month: 'Feb', sent: 1500, opened: 580, clicked: 165, replied: 48 },
    { month: 'Mar', sent: 1800, opened: 720, clicked: 210, replied: 62 },
    { month: 'Apr', sent: 2200, opened: 920, clicked: 280, replied: 85 },
    { month: 'May', sent: 2500, opened: 1100, clicked: 350, replied: 105 },
    { month: 'Jun', sent: 2800, opened: 1300, clicked: 420, replied: 125 }
  ];

  const campaignComparison = [
    { name: 'Product Launch', openRate: 42, clickRate: 12, replyRate: 3.5 },
    { name: 'Re-engagement', openRate: 28, clickRate: 8, replyRate: 2.1 },
    { name: 'Welcome Series', openRate: 55, clickRate: 18, replyRate: 5.2 },
    { name: 'Newsletter', openRate: 35, clickRate: 10, replyRate: 1.8 },
    { name: 'Sales Outreach', openRate: 25, clickRate: 7, replyRate: 4.5 }
  ];

  const timeOfDayData = [
    { hour: '6 AM', openRate: 15 },
    { hour: '8 AM', openRate: 28 },
    { hour: '10 AM', openRate: 42 },
    { hour: '12 PM', openRate: 38 },
    { hour: '2 PM', openRate: 45 },
    { hour: '4 PM', openRate: 35 },
    { hour: '6 PM', openRate: 22 },
    { hour: '8 PM', openRate: 18 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#3b82f6' },
    { name: 'Mobile', value: 38, color: '#10b981' },
    { name: 'Tablet', value: 12, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#8b5cf6' }
  ];

  const topPerformingEmails = [
    { subject: 'Limited Time Offer: 50% Off', openRate: 68, clickRate: 22, sent: 1500 },
    { subject: 'Your Weekly Industry Insights', openRate: 52, clickRate: 15, sent: 2200 },
    { subject: 'Welcome to Our Community!', openRate: 48, clickRate: 18, sent: 800 },
    { subject: 'Case Study: How X Increased Revenue', openRate: 45, clickRate: 14, sent: 1200 },
    { subject: 'Quick Question About Your Goals', openRate: 42, clickRate: 12, sent: 500 }
  ];

  const metrics = {
    totalSent: 12500,
    totalOpened: 4850,
    totalClicked: 1425,
    totalReplied: 385,
    avgOpenRate: 38.8,
    avgClickRate: 11.4,
    avgReplyRate: 3.1,
    bounceRate: 2.8,
    unsubscribeRate: 0.5,
    spamRate: 0.1
  };

  const getMetricTrend = (current: number, benchmark: number): 'up' | 'down' | 'stable' => {
    const diff = current - benchmark;
    if (Math.abs(diff) < 1) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{metrics.avgOpenRate}%</div>
              {getTrendIcon(getMetricTrend(metrics.avgOpenRate, EMAIL_METRICS.openRate.average))}
            </div>
            <Progress value={metrics.avgOpenRate} className="mt-2 h-1" />
            <p className="text-xs text-muted-foreground mt-1">
              Industry avg: {EMAIL_METRICS.openRate.average}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-primary" />
              Click Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{metrics.avgClickRate}%</div>
              {getTrendIcon(getMetricTrend(metrics.avgClickRate, EMAIL_METRICS.clickRate.average))}
            </div>
            <Progress value={metrics.avgClickRate * 5} className="mt-2 h-1" />
            <p className="text-xs text-muted-foreground mt-1">
              Industry avg: {EMAIL_METRICS.clickRate.average}%
            </p>
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
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{metrics.avgReplyRate}%</div>
              {getTrendIcon(getMetricTrend(metrics.avgReplyRate, EMAIL_METRICS.replyRate.average))}
            </div>
            <Progress value={metrics.avgReplyRate * 10} className="mt-2 h-1" />
            <p className="text-xs text-muted-foreground mt-1">
              Industry avg: {EMAIL_METRICS.replyRate.average}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              Bounce Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{metrics.bounceRate}%</div>
              {getTrendIcon(getMetricTrend(EMAIL_METRICS.bounceRate.average, metrics.bounceRate))}
            </div>
            <Progress value={metrics.bounceRate * 10} className="mt-2 h-1" />
            <p className="text-xs text-muted-foreground mt-1">
              Industry avg: {EMAIL_METRICS.bounceRate.average}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="top">Top Emails</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="sent" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="opened" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="clicked" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="replied" stackId="4" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campaignComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="openRate" fill="#3b82f6" name="Open Rate %" />
                  <Bar dataKey="clickRate" fill="#10b981" name="Click Rate %" />
                  <Bar dataKey="replyRate" fill="#f59e0b" name="Reply Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Best Time to Send</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={timeOfDayData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="openRate" stroke="#3b82f6" strokeWidth={2} name="Open Rate %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="top" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformingEmails.map((email, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{email.subject}</p>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Sent: {email.sent.toLocaleString()}</span>
                        <span>Open: {email.openRate}%</span>
                        <span>Click: {email.clickRate}%</span>
                      </div>
                    </div>
                    <Badge variant={index === 0 ? 'default' : 'secondary'}>
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Delivery Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Delivered</span>
              <Badge variant="default">97.2%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Bounced</span>
              <Badge variant="outline">{metrics.bounceRate}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Unsubscribed</span>
              <Badge variant="outline">{metrics.unsubscribeRate}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Spam Reports</span>
              <Badge variant="destructive">{metrics.spamRate}%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg Read Time</span>
              <span className="font-medium">32s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Forward Rate</span>
              <span className="font-medium">2.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Print Rate</span>
              <span className="font-medium">0.8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Delete Rate</span>
              <span className="font-medium">15.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Best Practices Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">85/100</div>
              <Progress value={85} className="h-2" />
              <div className="space-y-1 text-xs text-left">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  <span>Good subject lines</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  <span>Optimal send times</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-orange-600" />
                  <span>Improve personalization</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}