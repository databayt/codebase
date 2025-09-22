/**
 * Featured leads component
 * Displays high-priority or high-score leads in a prominent way
 */

'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  TrendingUp,
  Clock,
  Mail,
  Phone,
  Building,
  User,
  Target,
  Zap,
  Star,
} from 'lucide-react';
import type { Lead } from './type';
import { LEAD_STATUS, LEAD_SCORE_RANGES } from './constant';
import { formatDistanceToNow } from 'date-fns';

interface FeaturedProps {
  leads: Lead[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function Featured({ leads, isLoading, onRefresh }: FeaturedProps) {
  // Categorize featured leads
  const categorizedLeads = useMemo(() => {
    const hotLeads = leads.filter(l => l.score >= LEAD_SCORE_RANGES.HOT.min);
    const recentLeads = leads
      .filter(l => {
        const daysSinceCreated = (Date.now() - new Date(l.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceCreated <= 7;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const readyToContact = leads.filter(
      l => l.status === 'NEW' || l.status === 'QUALIFIED'
    );

    const topCompanies = leads
      .filter(l => l.company)
      .reduce((acc, lead) => {
        const company = lead.company!;
        if (!acc[company]) {
          acc[company] = { name: company, count: 0, totalScore: 0 };
        }
        acc[company].count++;
        acc[company].totalScore += lead.score;
        return acc;
      }, {} as Record<string, { name: string; count: number; totalScore: number }>);

    const topCompaniesList = Object.values(topCompanies)
      .sort((a, b) => b.totalScore / b.count - a.totalScore / a.count)
      .slice(0, 5);

    return {
      hot: hotLeads,
      recent: recentLeads,
      readyToContact,
      topCompanies: topCompaniesList,
    };
  }, [leads]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading featured leads...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorizedLeads.hot.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Score 80+</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorizedLeads.recent.length}</div>
            <p className="text-xs text-muted-foreground mt-1">New leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Ready</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorizedLeads.readyToContact.length}</div>
            <p className="text-xs text-muted-foreground mt-1">To contact</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
              <Building className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorizedLeads.topCompanies.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Tabs */}
      <Tabs defaultValue="hot" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="hot">
            <Zap className="h-4 w-4 mr-2" />
            Hot Leads ({categorizedLeads.hot.length})
          </TabsTrigger>
          <TabsTrigger value="recent">
            <Clock className="h-4 w-4 mr-2" />
            Recent ({categorizedLeads.recent.length})
          </TabsTrigger>
          <TabsTrigger value="ready">
            <Target className="h-4 w-4 mr-2" />
            Ready to Contact ({categorizedLeads.readyToContact.length})
          </TabsTrigger>
          <TabsTrigger value="companies">
            <Building className="h-4 w-4 mr-2" />
            Top Companies
          </TabsTrigger>
        </TabsList>

        {/* Hot Leads Tab */}
        <TabsContent value="hot" className="mt-4">
          <div className="grid gap-4">
            {categorizedLeads.hot.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                No hot leads yet. Keep prospecting!
              </Card>
            ) : (
              categorizedLeads.hot.map((lead) => (
                <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {lead.name}
                          <Badge variant="destructive">
                            <Trophy className="h-3 w-3 mr-1" />
                            Score: {lead.score}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4">
                          {lead.company && (
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {lead.company}
                            </span>
                          )}
                          {lead.title && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {lead.title}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {lead.email && (
                          <Button size="icon" variant="outline">
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        {lead.phone && (
                          <Button size="icon" variant="outline">
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Progress value={lead.score} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="outline">
                          {LEAD_STATUS[lead.status]}
                        </Badge>
                        <span className="text-muted-foreground">
                          Added {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      {lead.notes && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lead.notes}
                        </p>
                      )}
                      {lead.tags && lead.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Recent Leads Tab */}
        <TabsContent value="recent" className="mt-4">
          <div className="grid gap-4">
            {categorizedLeads.recent.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                No new leads this week
              </Card>
            ) : (
              categorizedLeads.recent.map((lead) => (
                <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{lead.name}</CardTitle>
                        <CardDescription>
                          {lead.company} {lead.title && `• ${lead.title}`}
                        </CardDescription>
                      </div>
                      <Badge variant={lead.score >= 60 ? 'default' : 'secondary'}>
                        Score: {lead.score}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                      </div>
                      <div className="flex gap-2">
                        {lead.email && <Mail className="h-4 w-4" />}
                        {lead.phone && <Phone className="h-4 w-4" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Ready to Contact Tab */}
        <TabsContent value="ready" className="mt-4">
          <div className="grid gap-4">
            {categorizedLeads.readyToContact.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                No leads ready to contact
              </Card>
            ) : (
              categorizedLeads.readyToContact.map((lead) => (
                <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {lead.name}
                          <Badge variant="outline">
                            {LEAD_STATUS[lead.status]}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {lead.email || 'No email'} • {lead.phone || 'No phone'}
                        </CardDescription>
                      </div>
                      <Button size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Top Companies Tab */}
        <TabsContent value="companies" className="mt-4">
          <div className="grid gap-4">
            {categorizedLeads.topCompanies.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                No companies identified yet
              </Card>
            ) : (
              categorizedLeads.topCompanies.map((company) => (
                <Card key={company.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {company.name}
                        </CardTitle>
                        <CardDescription>
                          {company.count} lead{company.count > 1 ? 's' : ''} •
                          Avg Score: {Math.round(company.totalScore / company.count)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round((company.totalScore / company.count) / 20)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}