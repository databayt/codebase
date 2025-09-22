'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe,
  Search,
  Users,
  Building,
  Mail,
  Phone,
  Linkedin,
  MapPin,
  Download,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
} from 'lucide-react';
import { usePageScraper, useLeadExtractor, usePageAnalyzer } from './use-scraper';
import { PAGE_TYPES, LEAD_POTENTIAL_LEVELS } from './constant';
import type { ExtractedLead } from './type';

export function SinglePageScraper() {
  const [url, setUrl] = useState('');
  const [activeView, setActiveView] = useState('content');

  const { scrapeUrl, scrapedPage, isLoading, clearResults } = usePageScraper();
  const { extractLeads, extractedLeads, companyInfo, isExtracting, clearExtracted } = useLeadExtractor();
  const { analyzePage, analysis, isAnalyzing } = usePageAnalyzer();

  const handleScrape = async () => {
    if (!url) return;

    // First scrape the page
    const scrapeResult = await scrapeUrl(url);

    if (scrapeResult.success && scrapeResult.data) {
      // Then extract leads
      await extractLeads({
        url,
        content: scrapeResult.data.content,
        pageType: scrapeResult.data.pageType,
      });

      // And analyze the page
      await analyzePage({
        url,
        content: scrapeResult.data.content,
      });
    }
  };

  const handleClear = () => {
    setUrl('');
    clearResults();
    clearExtracted();
  };

  const getPageTypeInfo = (pageType?: string) => {
    const type = PAGE_TYPES.find(t => t.value === pageType);
    return type || PAGE_TYPES[PAGE_TYPES.length - 1]; // Default to 'unknown'
  };

  const getLeadPotentialInfo = (potential?: string) => {
    const level = LEAD_POTENTIAL_LEVELS.find(l => l.value === potential);
    return level || LEAD_POTENTIAL_LEVELS[LEAD_POTENTIAL_LEVELS.length - 1];
  };

  const exportToCSV = () => {
    if (extractedLeads.length === 0) return;

    const headers = ['Name', 'Email', 'Phone', 'Title', 'Company', 'LinkedIn', 'Location'];
    const rows = extractedLeads.map(lead => [
      lead.name,
      lead.email || '',
      lead.phone || '',
      lead.title || '',
      lead.company || '',
      lead.linkedinUrl || '',
      lead.location || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Scrape Single Page</CardTitle>
          <CardDescription>
            Enter a URL to extract content, business contacts, and company information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/about"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleScrape();
              }}
              className="flex-1"
            />
            <Button
              onClick={handleScrape}
              disabled={!url || isLoading}
            >
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Scrape
                </>
              )}
            </Button>
            {scrapedPage && (
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Try:</span>
            {['/about', '/team', '/contact', '/partners'].map(path => (
              <Button
                key={path}
                variant="outline"
                size="sm"
                onClick={() => setUrl(`https://example.com${path}`)}
              >
                {path}
              </Button>
            ))}
          </div>

          {/* Loading States */}
          {(isLoading || isExtracting || isAnalyzing) && (
            <div className="space-y-2">
              {isLoading && (
                <div className="flex items-center gap-2">
                  <Progress value={33} className="flex-1" />
                  <span className="text-sm text-muted-foreground">Fetching content...</span>
                </div>
              )}
              {isExtracting && (
                <div className="flex items-center gap-2">
                  <Progress value={66} className="flex-1" />
                  <span className="text-sm text-muted-foreground">Extracting leads...</span>
                </div>
              )}
              {isAnalyzing && (
                <div className="flex items-center gap-2">
                  <Progress value={100} className="flex-1" />
                  <span className="text-sm text-muted-foreground">Analyzing page...</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {scrapedPage && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {scrapedPage.title || 'Scraped Page'}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {getPageTypeInfo(scrapedPage.pageType).icon} {getPageTypeInfo(scrapedPage.pageType).label}
                </Badge>
                <Badge className={getLeadPotentialInfo(scrapedPage.leadPotential).bgColor}>
                  {getLeadPotentialInfo(scrapedPage.leadPotential).label} Potential
                </Badge>
              </div>
            </div>
            <CardDescription className="flex items-center gap-2">
              <ExternalLink className="h-3 w-3" />
              <a
                href={scrapedPage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {scrapedPage.url}
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeView} onValueChange={setActiveView}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="leads">
                  Leads ({extractedLeads.length})
                </TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-4 space-y-4">
                {scrapedPage.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{scrapedPage.description}</p>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Page Content</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(scrapedPage.content)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap">{scrapedPage.content.substring(0, 2000)}...</pre>
                  </div>
                </div>

                {scrapedPage.metadata && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {scrapedPage.metadata.technologies && scrapedPage.metadata.technologies.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-1">
                          {scrapedPage.metadata.technologies.map(tech => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {scrapedPage.metadata.socialLinks && scrapedPage.metadata.socialLinks.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Social Links</h4>
                        <div className="space-y-1">
                          {scrapedPage.metadata.socialLinks.map((link, i) => (
                            <a
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {link.platform}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="leads" className="mt-4 space-y-4">
                {extractedLeads.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Found {extractedLeads.length} potential leads
                      </p>
                      <Button size="sm" onClick={exportToCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {extractedLeads.map((lead, i) => (
                        <Card key={i}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div>
                                  <h4 className="font-semibold">{lead.name}</h4>
                                  {lead.title && (
                                    <p className="text-sm text-muted-foreground">{lead.title}</p>
                                  )}
                                  {lead.company && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Building className="h-3 w-3" />
                                      {lead.company}
                                    </p>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-3 text-sm">
                                  {lead.email && (
                                    <a
                                      href={`mailto:${lead.email}`}
                                      className="flex items-center gap-1 hover:underline"
                                    >
                                      <Mail className="h-3 w-3" />
                                      {lead.email}
                                    </a>
                                  )}
                                  {lead.phone && (
                                    <a
                                      href={`tel:${lead.phone}`}
                                      className="flex items-center gap-1 hover:underline"
                                    >
                                      <Phone className="h-3 w-3" />
                                      {lead.phone}
                                    </a>
                                  )}
                                  {lead.linkedinUrl && (
                                    <a
                                      href={lead.linkedinUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 hover:underline"
                                    >
                                      <Linkedin className="h-3 w-3" />
                                      LinkedIn
                                    </a>
                                  )}
                                  {lead.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {lead.location}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <Badge variant="outline">
                                {lead.confidence}% confidence
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No leads found on this page</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try scraping /about, /team, or /contact pages for better results
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="company" className="mt-4 space-y-4">
                {companyInfo ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{companyInfo.name}</h3>
                      {companyInfo.description && (
                        <p className="text-sm text-muted-foreground mt-2">{companyInfo.description}</p>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {companyInfo.industry && (
                        <div>
                          <span className="text-sm font-medium">Industry:</span>
                          <p className="text-sm text-muted-foreground">{companyInfo.industry}</p>
                        </div>
                      )}
                      {companyInfo.size && (
                        <div>
                          <span className="text-sm font-medium">Size:</span>
                          <p className="text-sm text-muted-foreground">{companyInfo.size}</p>
                        </div>
                      )}
                      {companyInfo.location && (
                        <div>
                          <span className="text-sm font-medium">Location:</span>
                          <p className="text-sm text-muted-foreground">{companyInfo.location}</p>
                        </div>
                      )}
                      {companyInfo.founded && (
                        <div>
                          <span className="text-sm font-medium">Founded:</span>
                          <p className="text-sm text-muted-foreground">{companyInfo.founded}</p>
                        </div>
                      )}
                    </div>

                    {companyInfo.services && companyInfo.services.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          {companyInfo.services.map(service => (
                            <Badge key={service} variant="secondary">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No company information found</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analysis" className="mt-4 space-y-4">
                {analysis ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Page Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge>
                            {getPageTypeInfo(analysis.pageType).icon} {getPageTypeInfo(analysis.pageType).label}
                          </Badge>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Lead Potential</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge className={getLeadPotentialInfo(analysis.leadPotential).bgColor}>
                            {getLeadPotentialInfo(analysis.leadPotential).label}
                          </Badge>
                        </CardContent>
                      </Card>
                    </div>

                    {analysis.keyTopics && analysis.keyTopics.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Key Topics</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.keyTopics.map(topic => (
                            <Badge key={topic} variant="outline">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.recommendations && analysis.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Recommendations</h4>
                        <ul className="space-y-1">
                          {analysis.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No analysis available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}