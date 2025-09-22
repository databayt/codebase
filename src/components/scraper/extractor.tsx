'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Building,
  Mail,
  Phone,
  Linkedin,
  MapPin,
  Sparkles,
  Download,
  Copy,
  AlertCircle,
} from 'lucide-react';
import { useLeadExtractor } from './use-scraper';

export function LeadExtractor() {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');

  const {
    extractLeads,
    extractedLeads,
    companyInfo,
    pageAnalysis,
    isExtracting,
    error,
    clearExtracted,
  } = useLeadExtractor();

  const handleExtract = async () => {
    if (!content.trim()) return;

    await extractLeads({
      url: url || 'manual-input',
      content,
      options: {
        extractCompanyInfo: true,
        useAI: true,
        confidenceThreshold: 50,
      },
    });
  };

  const exportToCSV = () => {
    if (extractedLeads.length === 0) return;

    const headers = ['Name', 'Email', 'Phone', 'Title', 'Company', 'LinkedIn', 'Location', 'Confidence'];
    const rows = extractedLeads.map(lead => [
      lead.name,
      lead.email || '',
      lead.phone || '',
      lead.title || '',
      lead.company || '',
      lead.linkedinUrl || '',
      lead.location || '',
      lead.confidence.toString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `extracted-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const copyToClipboard = () => {
    const text = extractedLeads
      .map(lead => `${lead.name}${lead.email ? ` - ${lead.email}` : ''}${lead.company ? ` (${lead.company})` : ''}`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  const loadExample = () => {
    setContent(`John Smith
CEO & Founder
TechCorp Inc.
john.smith@techcorp.com
+1 (555) 123-4567
LinkedIn: linkedin.com/in/johnsmith
San Francisco, CA

Sarah Johnson
VP of Sales
sarah@techcorp.com
Direct: 555-987-6543

Mike Chen | CTO | mike.chen@techcorp.com | LinkedIn: linkedin.com/in/mikechen

Contact our team:
- Lisa Park, Head of Marketing (lisa.park@techcorp.com)
- David Kim, Customer Success Manager (david@techcorp.com, +1-555-456-7890)
- Jennifer Lee, Product Manager

TechCorp Inc. is a leading software company specializing in AI solutions.
Founded in 2015, we serve over 500 enterprise clients worldwide.
Visit us at www.techcorp.com`);
    setUrl('https://example.com/team');
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Extraction from Text</CardTitle>
          <CardDescription>
            Paste any text containing contact information to extract structured lead data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Paste text containing contact information, team pages, email signatures, etc..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Works best with team pages, about us sections, contact lists, and email signatures
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleExtract}
              disabled={!content.trim() || isExtracting}
              className="flex-1"
            >
              {isExtracting ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                  Extracting...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Extract Leads
                </>
              )}
            </Button>
            <Button variant="outline" onClick={loadExample}>
              Load Example
            </Button>
            {extractedLeads.length > 0 && (
              <Button variant="outline" onClick={clearExtracted}>
                Clear
              </Button>
            )}
          </div>

          {isExtracting && (
            <Progress value={50} className="h-2" />
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {extractedLeads.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Extracted Leads ({extractedLeads.length})</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button size="sm" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {extractedLeads.map((lead, i) => (
                <Card key={i}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div>
                          <h4 className="font-semibold text-base">{lead.name}</h4>
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
                              className="flex items-center gap-1 hover:underline text-primary"
                            >
                              <Mail className="h-3 w-3" />
                              {lead.email}
                            </a>
                          )}
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="flex items-center gap-1 hover:underline text-primary"
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
                              className="flex items-center gap-1 hover:underline text-primary"
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

                        {lead.department && (
                          <Badge variant="secondary">{lead.department}</Badge>
                        )}
                      </div>

                      <div className="text-right">
                        <Badge variant={lead.confidence >= 80 ? 'default' : 'outline'}>
                          {lead.confidence}%
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">Confidence</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Info */}
      {companyInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {companyInfo.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companyInfo.description && (
                <p className="text-sm text-muted-foreground">{companyInfo.description}</p>
              )}

              <div className="grid gap-3 md:grid-cols-2">
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
                {companyInfo.website && (
                  <div>
                    <span className="text-sm font-medium">Website:</span>
                    <a
                      href={companyInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {companyInfo.website}
                    </a>
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

              {companyInfo.technologies && companyInfo.technologies.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {companyInfo.technologies.map(tech => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Analysis */}
      {pageAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Page Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pageAnalysis.keyTopics && pageAnalysis.keyTopics.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {pageAnalysis.keyTopics.map(topic => (
                      <Badge key={topic} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {pageAnalysis.recommendations && pageAnalysis.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {pageAnalysis.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}