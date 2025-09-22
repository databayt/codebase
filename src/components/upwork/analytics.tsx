'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  Target,
  Award,
  DollarSign,
  Clock,
  Activity,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { useJobAnalytics, useSavedProposals } from './use-upwork';
import { VIABILITY_LEVELS, PROPOSAL_STATUS_OPTIONS } from './constant';

export function JobAnalytics() {
  const { analytics } = useJobAnalytics();
  const { proposals } = useSavedProposals();

  // Calculate proposal statistics
  const proposalStats = {
    total: proposals.length,
    byStatus: PROPOSAL_STATUS_OPTIONS.reduce((acc, status) => {
      acc[status.value] = proposals.filter(p => p.status === status.value).length;
      return acc;
    }, {} as Record<string, number>),
    averageScore: proposals.reduce((sum, p) => sum + (p.score || 0), 0) / (proposals.length || 1),
  };

  // Prepare chart data
  const viabilityData = Object.entries(analytics.viabilityBreakdown).map(([key, value]) => {
    const level = VIABILITY_LEVELS.find(v => v.value === key);
    return {
      name: level?.label || key,
      value,
      color: level?.color.replace('text-', ''),
    };
  });

  const statusData = Object.entries(proposalStats.byStatus).map(([status, count]) => {
    const option = PROPOSAL_STATUS_OPTIONS.find(o => o.value === status);
    return {
      name: option?.label || status,
      value: count,
    };
  });

  // Mock timeline data (would be real data in production)
  const timelineData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    analyzed: Math.floor(Math.random() * 10),
    sent: Math.floor(Math.random() * 5),
    won: Math.floor(Math.random() * 2),
  }));

  // Custom colors for charts
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Jobs Analyzed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalAnalyzed}</div>
            <div className="flex items-center gap-1 mt-2">
              <Activity className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {analytics.viabilityBreakdown.excellent + analytics.viabilityBreakdown.good} viable
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.averageScore.toFixed(1)}/10</div>
            <Progress value={analytics.averageScore * 10} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              {analytics.proposalsSent > 0
                ? ((analytics.proposalsWon / analytics.proposalsSent) * 100).toFixed(0)
                : 0}%
              {analytics.successRate > 20 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {analytics.proposalsWon} won / {analytics.proposalsSent} sent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Est. Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$24.5k</div>
            <p className="text-xs text-muted-foreground mt-2">From won proposals</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Viability Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Job Viability Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={viabilityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {viabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Proposal Status */}
        <Card>
          <CardHeader>
            <CardTitle>Proposal Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="analyzed" stroke="#3b82f6" name="Jobs Analyzed" />
              <Line type="monotone" dataKey="sent" stroke="#f59e0b" name="Proposals Sent" />
              <Line type="monotone" dataKey="won" stroke="#10b981" name="Jobs Won" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Best Performing Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topCategories.length > 0 ? (
                analytics.topCategories.slice(0, 5).map((category, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{category.category}</span>
                    <Badge variant={i === 0 ? 'default' : 'outline'}>
                      {category.count} jobs
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No data yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Time to Response */}
        <Card>
          <CardHeader>
            <CardTitle>Response Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Avg. Analysis Time</span>
                  <span className="text-sm font-medium">3.2 min</span>
                </div>
                <Progress value={32} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Avg. Proposal Time</span>
                  <span className="text-sm font-medium">5.7 min</span>
                </div>
                <Progress value={57} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Time to First Response</span>
                  <span className="text-sm font-medium">1.2 hrs</span>
                </div>
                <Progress value={12} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Best Day</p>
                  <p className="text-xs text-muted-foreground">
                    Tuesday (35% higher response)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Best Time</p>
                  <p className="text-xs text-muted-foreground">
                    10 AM - 12 PM EST
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Optimal Length</p>
                  <p className="text-xs text-muted-foreground">
                    200-250 words
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Most Successful Tone</h4>
              <p className="text-2xl font-bold">Professional</p>
              <p className="text-xs text-muted-foreground">42% win rate</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Average Job Score</h4>
              <p className="text-2xl font-bold">
                {analytics.averageScore.toFixed(1)}/10
              </p>
              <p className="text-xs text-muted-foreground">
                Focus on 7+ scores
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Conversion Funnel</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Analyzed</span>
                  <span>{analytics.totalAnalyzed}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>→ Proposals</span>
                  <span>{analytics.proposalsSent}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span>→ Won</span>
                  <span>{analytics.proposalsWon}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Next Actions</h4>
              <ul className="space-y-1 text-xs">
                <li>• Focus on {analytics.viabilityBreakdown.excellent > 0 ? 'excellent' : 'good'} jobs</li>
                <li>• Improve proposal personalization</li>
                <li>• Follow up within 24 hours</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}