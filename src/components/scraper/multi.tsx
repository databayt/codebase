'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Globe,
  Play,
  Pause,
  RotateCcw,
  Download,
  Users,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useMultiPageScraper, useScrapingAnalytics } from './use-scraper';
import { SCRAPE_STRATEGIES } from './constant';
import type { ScrapeStrategy } from './type';

export function MultiPageCrawler() {
  const [startUrl, setStartUrl] = useState('');
  const [strategy, setStrategy] = useState<ScrapeStrategy>('breadth');
  const [maxPages, setMaxPages] = useState(10);
  const [depth, setDepth] = useState(2);
  const [options, setOptions] = useState({
    sameDomainOnly: true,
    extractLeads: true,
    respectRobots: true,
    delayMs: 1000,
  });

  const {
    startScraping,
    cancelScraping,
    resetScraper,
    isRunning,
    status,
    scrapedPages,
    extractedLeads,
    progress,
    error,
  } = useMultiPageScraper();

  const { recordScraping } = useScrapingAnalytics();

  const handleStart = async () => {
    if (!startUrl) return;

    const result = await startScraping({
      startUrl,
      strategy,
      maxPages,
      depth,
      filters: {
        sameDomainOnly: options.sameDomainOnly,
      },
      options: {
        delayMs: options.delayMs,
      },
    });

    if (result.success && result.data) {
      recordScraping(result.data.pages, result.data.leads);
    }
  };

  const exportResults = () => {
    const data = {
      session: {
        startUrl,
        strategy,
        maxPages,
        completedAt: new Date().toISOString(),
      },
      pages: scrapedPages,
      leads: extractedLeads,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scraping-session-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'cancelled':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Page Crawler</CardTitle>
          <CardDescription>
            Crawl multiple pages from a website to extract comprehensive lead data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="start-url">Start URL</Label>
            <Input
              id="start-url"
              placeholder="https://example.com"
              value={startUrl}
              onChange={(e) => setStartUrl(e.target.value)}
              disabled={isRunning}
            />
            <p className="text-xs text-muted-foreground">
              The crawler will start from this URL and follow links based on your strategy
            </p>
          </div>

          {/* Strategy Selection */}
          <div className="space-y-3">
            <Label>Crawling Strategy</Label>
            <RadioGroup value={strategy} onValueChange={(v) => setStrategy(v as ScrapeStrategy)}>
              <div className="grid gap-3">
                {SCRAPE_STRATEGIES.map((s) => (
                  <div key={s.value} className="flex items-start space-x-3">
                    <RadioGroupItem value={s.value} id={s.value} disabled={isRunning} />
                    <div className="flex-1">
                      <Label htmlFor={s.value} className="flex items-center gap-2 cursor-pointer">
                        <span>{s.icon}</span>
                        <span>{s.label}</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Limits */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="max-pages">Max Pages</Label>
              <Input
                id="max-pages"
                type="number"
                min="1"
                max="100"
                value={maxPages}
                onChange={(e) => setMaxPages(Number(e.target.value))}
                disabled={isRunning}
              />
            </div>
            {strategy === 'depth' && (
              <div className="space-y-2">
                <Label htmlFor="depth">Max Depth</Label>
                <Input
                  id="depth"
                  type="number"
                  min="1"
                  max="5"
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  disabled={isRunning}
                />
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label>Options</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={options.sameDomainOnly}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, sameDomainOnly: !!checked })
                  }
                  disabled={isRunning}
                />
                <span className="text-sm">Stay within same domain</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={options.extractLeads}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, extractLeads: !!checked })
                  }
                  disabled={isRunning}
                />
                <span className="text-sm">Extract leads from each page</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={options.respectRobots}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, respectRobots: !!checked })
                  }
                  disabled={isRunning}
                />
                <span className="text-sm">Respect robots.txt</span>
              </label>
            </div>
          </div>

          {/* Delay Setting */}
          <div className="space-y-2">
            <Label htmlFor="delay">Delay between requests (ms)</Label>
            <Input
              id="delay"
              type="number"
              min="0"
              max="10000"
              step="100"
              value={options.delayMs}
              onChange={(e) => setOptions({ ...options, delayMs: Number(e.target.value) })}
              disabled={isRunning}
            />
            <p className="text-xs text-muted-foreground">
              Add delay to avoid overwhelming the server (recommended: 1000ms)
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {!isRunning && status !== 'running' ? (
              <Button
                onClick={handleStart}
                disabled={!startUrl}
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Crawling
              </Button>
            ) : (
              <Button
                onClick={cancelScraping}
                variant="destructive"
                className="flex-1"
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop Crawling
              </Button>
            )}
            {status !== 'pending' && (
              <Button
                onClick={resetScraper}
                variant="outline"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {(status !== 'pending' || isRunning) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className={getStatusColor(status)}>
                {getStatusIcon(status)}
              </span>
              Crawling Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
                  {status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {progress.current} / {progress.total} pages
              </div>
            </div>

            {/* Progress Bar */}
            <Progress
              value={progress.total > 0 ? (progress.current / progress.total) * 100 : 0}
              className="h-2"
            />

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Pages Scraped</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {scrapedPages.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Leads Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {extractedLeads.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {scrapedPages.length > 0
                      ? Math.round((scrapedPages.filter(p => !p.error).length / scrapedPages.length) * 100)
                      : 0}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {scrapedPages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Crawling Results</CardTitle>
              <Button size="sm" onClick={exportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Page List */}
              <div>
                <h4 className="font-medium mb-2">Scraped Pages ({scrapedPages.length})</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {scrapedPages.map((page, i) => (
                    <div key={i} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2 flex-1">
                        <Badge variant="outline" className="text-xs">
                          {page.pageType || 'unknown'}
                        </Badge>
                        <a
                          href={page.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline truncate"
                        >
                          {page.url}
                        </a>
                      </div>
                      {page.error ? (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Summary */}
              {extractedLeads.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Extracted Leads ({extractedLeads.length})</h4>
                  <div className="grid gap-2 md:grid-cols-2 max-h-64 overflow-y-auto">
                    {extractedLeads.slice(0, 10).map((lead, i) => (
                      <div key={i} className="p-2 border rounded">
                        <div className="font-medium text-sm">{lead.name}</div>
                        {lead.title && (
                          <p className="text-xs text-muted-foreground">{lead.title}</p>
                        )}
                        {lead.company && (
                          <p className="text-xs text-muted-foreground">{lead.company}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  {extractedLeads.length > 10 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      And {extractedLeads.length - 10} more leads...
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}