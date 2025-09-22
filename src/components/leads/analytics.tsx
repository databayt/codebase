/**
 * Lead analytics dashboard component
 * Displays key metrics and insights about leads
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  Users,
  Target,
  Award,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import { getLeadAnalytics } from './action';
import { LEAD_STATUS, LEAD_SOURCE } from './constant';

interface AnalyticsProps {
  className?: string;
}

export function LeadAnalytics({ className }: AnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await getLeadAnalytics();
        if (result.success && result.data) {
          setAnalytics(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  // Calculate conversion rate (mock calculation)
  const conversionRate = analytics.totalLeads > 0
    ? Math.round((analytics.statusDistribution?.find((s: any) => s.status === 'CLOSED_WON')?._count || 0) / analytics.totalLeads * 100)
    : 0;

  // Calculate week-over-week change (mock)
  const weekChange = analytics.newLeadsThisWeek > 5 ? '+' : analytics.newLeadsThisWeek < 2 ? '-' : '';
  const changePercent = Math.abs(analytics.newLeadsThisWeek > 0 ? Math.round((analytics.newLeadsThisWeek - 3) / 3 * 100) : 0);

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {/* Total Leads Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalLeads}</div>
          <p className="text-xs text-muted-foreground mt-1">
            All time leads in your pipeline
          </p>
        </CardContent>
      </Card>

      {/* New This Week Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New This Week</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.newLeadsThisWeek}</div>
          <div className="flex items-center text-xs mt-1">
            {weekChange === '+' && (
              <>
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500">+{changePercent}%</span>
                <span className="text-muted-foreground ml-1">from last week</span>
              </>
            )}
            {weekChange === '-' && (
              <>
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-red-500">-{changePercent}%</span>
                <span className="text-muted-foreground ml-1">from last week</span>
              </>
            )}
            {weekChange === '' && (
              <>
                <Minus className="h-3 w-3 text-muted-foreground mr-1" />
                <span className="text-muted-foreground">Same as last week</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Rate Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionRate}%</div>
          <Progress value={conversionRate} className="h-1 mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Leads converted to customers
          </p>
        </CardContent>
      </Card>

      {/* Top Source Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Source</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics.sourceDistribution?.[0]?.source
              ? LEAD_SOURCE[analytics.sourceDistribution[0].source as keyof typeof LEAD_SOURCE]
              : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {analytics.sourceDistribution?.[0]?._count || 0} leads from this source
          </p>
        </CardContent>
      </Card>
    </div>
  );
}