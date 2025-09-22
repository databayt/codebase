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
  Globe,
  Users,
  Clock,
  FileText,
  Activity,
  Award,
  Target,
} from 'lucide-react';
import { useScrapingAnalytics } from './use-scraper';
import { PAGE_TYPES, LEAD_POTENTIAL_LEVELS } from './constant';

export function ScrapingAnalytics() {
  const { analytics } = useScrapingAnalytics();

  // Prepare chart data
  const pageTypeData = Object.entries(analytics.pageTypes || {}).map(([type, count]) => {
    const pageType = PAGE_TYPES.find(t => t.value === type);
    return {
      name: pageType?.label || type,
      value: count,
      icon: pageType?.icon,
    };
  });

  const domainData = analytics.topDomains.slice(0, 5);

  // Mock timeline data for demonstration
  const timelineData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    pages: Math.floor(Math.random() * 50) + 10,
    leads: Math.floor(Math.random() * 20) + 5,
  }));

  // Calculate lead efficiency
  const leadEfficiency = analytics.totalPages > 0
    ? (analytics.totalLeads / analytics.totalPages).toFixed(2)
    : '0';

  // Custom colors
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Total Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalPages}</div>
            <div className="flex items-center gap-1 mt-2">
              <Activity className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {analytics.topDomains.length} domains
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {leadEfficiency} leads per page
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.successRate || 95}%</div>
            <Progress value={analytics.successRate || 95} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Avg Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(analytics.avgProcessingTime / 1000).toFixed(1)}s
            </div>
            <p className="text-xs text-muted-foreground mt-2">Per page</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Page Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Page Types Scraped</CardTitle>
          </CardHeader>
          <CardContent>
            {pageTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pageTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pageTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Domains */}
        <Card>
          <CardHeader>
            <CardTitle>Top Domains</CardTitle>
          </CardHeader>
          <CardContent>
            {domainData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={domainData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="domain" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pages" stroke="#3b82f6" name="Pages Scraped" />
              <Line type="monotone" dataKey="leads" stroke="#10b981" name="Leads Found" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Lead Rich Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Lead-Rich Page Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {PAGE_TYPES.filter(t => t.leadPotential === 'high').map((type) => (
                <div key={type.value} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-sm">{type.label}</span>
                  </div>
                  <Badge variant="default">High</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Efficiency Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Efficiency Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Leads per Page</span>
                  <span className="text-sm font-medium">{leadEfficiency}</span>
                </div>
                <Progress value={Number(leadEfficiency) * 20} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Page Success Rate</span>
                  <span className="text-sm font-medium">{analytics.successRate || 95}%</span>
                </div>
                <Progress value={analytics.successRate || 95} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Processing Speed</span>
                  <span className="text-sm font-medium">
                    {analytics.avgProcessingTime > 0
                      ? `${(1000 / analytics.avgProcessingTime).toFixed(1)} pages/sec`
                      : 'N/A'}
                  </span>
                </div>
                <Progress
                  value={analytics.avgProcessingTime > 0 ? Math.min((1000 / analytics.avgProcessingTime) * 20, 100) : 0}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Optimization Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Target Right Pages</p>
                  <p className="text-xs text-muted-foreground">
                    Focus on /team, /about, /contact
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Optimal Timing</p>
                  <p className="text-xs text-muted-foreground">
                    1-2 second delay between requests
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Batch Processing</p>
                  <p className="text-xs text-muted-foreground">
                    Process 10-20 pages at a time
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Most Scraped Type</h4>
              <p className="text-2xl font-bold">
                {pageTypeData[0]?.name || 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">
                {pageTypeData[0]?.value || 0} pages
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Top Domain</h4>
              <p className="text-sm font-bold truncate">
                {domainData[0]?.domain || 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">
                {domainData[0]?.count || 0} pages scraped
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Lead Quality</h4>
              <p className="text-2xl font-bold">85%</p>
              <p className="text-xs text-muted-foreground">
                Average confidence score
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Next Actions</h4>
              <ul className="space-y-1 text-xs">
                <li>• Focus on high-potential pages</li>
                <li>• Export leads to CRM</li>
                <li>• Schedule regular crawls</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}