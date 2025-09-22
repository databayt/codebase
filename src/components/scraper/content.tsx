'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Globe,
  Search,
  Users,
  Building,
  Activity,
  Download,
  Database,
  BarChart3,
} from 'lucide-react';
import { SinglePageScraper } from './single';
import { MultiPageCrawler } from './multi';
import { LeadExtractor } from './extractor';
import { ScrapingAnalytics } from './analytics';
import { useScrapingAnalytics } from './use-scraper';
import ScraperPrompt from './prompt';

export function ScraperContent() {
  const [activeTab, setActiveTab] = useState('single');
  const { analytics } = useScrapingAnalytics();

  return (
    <>
      <ScraperPrompt />
      <div id="scraper-content" className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            Web Scraper & Lead Extractor
          </h1>
          <p className="text-muted-foreground mt-1">
            Extract business contacts and intelligence from websites with AI
          </p>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pages Scraped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPages}</div>
            <p className="text-xs text-muted-foreground">All time total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Leads Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              <Users className="h-4 w-4" />
              {analytics.totalLeads}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalPages > 0
                ? (analytics.totalLeads / analytics.totalPages).toFixed(1)
                : 0} per page
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.successRate || 95}%
            </div>
            <Progress value={analytics.successRate || 95} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analytics.avgProcessingTime / 1000).toFixed(1)}s
            </div>
            <p className="text-xs text-muted-foreground">Per page</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold truncate">
              {analytics.topDomains[0]?.domain || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.topDomains[0]?.count || 0} pages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="single">
            <Search className="h-4 w-4 mr-2" />
            Single Page
          </TabsTrigger>
          <TabsTrigger value="multi">
            <Globe className="h-4 w-4 mr-2" />
            Multi-Page
          </TabsTrigger>
          <TabsTrigger value="extract">
            <Users className="h-4 w-4 mr-2" />
            Extract
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="mt-6">
          <SinglePageScraper />
        </TabsContent>

        <TabsContent value="multi" className="mt-6">
          <MultiPageCrawler />
        </TabsContent>

        <TabsContent value="extract" className="mt-6">
          <LeadExtractor />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <ScrapingAnalytics />
        </TabsContent>
      </Tabs>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Scraping Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4 text-sm">
            <div className="flex items-start gap-2">
              <Badge className="mt-0.5" variant="outline">1</Badge>
              <div>
                <p className="font-medium">Target Right Pages</p>
                <p className="text-muted-foreground text-xs">
                  Focus on /about, /team, /contact for best results
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="mt-0.5" variant="outline">2</Badge>
              <div>
                <p className="font-medium">Respect Rate Limits</p>
                <p className="text-muted-foreground text-xs">
                  Add delays between requests to avoid blocking
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="mt-0.5" variant="outline">3</Badge>
              <div>
                <p className="font-medium">Check robots.txt</p>
                <p className="text-muted-foreground text-xs">
                  Always respect website scraping policies
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="mt-0.5" variant="outline">4</Badge>
              <div>
                <p className="font-medium">Export Regularly</p>
                <p className="text-muted-foreground text-xs">
                  Download CSV exports for CRM integration
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