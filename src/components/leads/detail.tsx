/**
 * Lead detail view component
 * Full detail modal/sheet for viewing and interacting with a lead
 */

'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Mail,
  Phone,
  Building,
  User,
  Globe,
  Calendar,
  Tag,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  Clock,
  Activity,
  MessageSquare,
  FileText,
  TrendingUp,
  Star,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { Lead, LeadActivity } from './type';
import { LEAD_STATUS, LEAD_SOURCE, LEAD_SCORE_RANGES } from './constant';

interface DetailProps {
  lead: Lead;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function Detail({ lead, open, onClose, onEdit, onDelete }: DetailProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock activity data (would come from API in real implementation)
  const activities: LeadActivity[] = [
    {
      id: '1',
      leadId: lead.id,
      type: 'status_change',
      description: `Status changed to ${LEAD_STATUS[lead.status]}`,
      createdAt: new Date(lead.updatedAt),
      userId: 'system',
    },
    {
      id: '2',
      leadId: lead.id,
      type: 'note',
      description: 'Lead created',
      createdAt: new Date(lead.createdAt),
      userId: 'system',
    },
  ];

  // Get score details
  const getScoreDetails = (score: number) => {
    if (score >= LEAD_SCORE_RANGES.HOT.min) {
      return { ...LEAD_SCORE_RANGES.HOT, variant: 'destructive' as const };
    }
    if (score >= LEAD_SCORE_RANGES.WARM.min) {
      return { ...LEAD_SCORE_RANGES.WARM, variant: 'warning' as const };
    }
    if (score >= LEAD_SCORE_RANGES.COOL.min) {
      return { ...LEAD_SCORE_RANGES.COOL, variant: 'default' as const };
    }
    return { ...LEAD_SCORE_RANGES.COLD, variant: 'secondary' as const };
  };

  const scoreDetails = getScoreDetails(lead.score);

  // Copy to clipboard helper
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-xl flex items-center gap-2">
            {lead.name}
            <Badge variant={scoreDetails.variant}>
              {scoreDetails.label} ({lead.score})
            </Badge>
          </SheetTitle>
          <SheetDescription>
            Lead ID: {lead.id.slice(0, 8)}...
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-280px)] mt-4">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Score Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Lead Quality</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Score</span>
                      <span className="font-medium">{lead.score}/100</span>
                    </div>
                    <Progress value={lead.score} className="h-2" />
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(lead.score / 20)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Contact Information</h3>
                  <div className="space-y-2">
                    {lead.email && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${lead.email}`} className="hover:underline">
                            {lead.email}
                          </a>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(lead.email!, 'Email')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {lead.phone && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${lead.phone}`} className="hover:underline">
                            {lead.phone}
                          </a>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(lead.phone!, 'Phone')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {lead.linkedinUrl && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={lead.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline truncate max-w-[250px]"
                          >
                            {lead.linkedinUrl}
                          </a>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => window.open(lead.linkedinUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Professional Information */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Professional Information</h3>
                  <div className="space-y-2">
                    {lead.company && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{lead.company}</span>
                      </div>
                    )}

                    {lead.title && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{lead.title}</span>
                      </div>
                    )}

                    {lead.industry && (
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{lead.industry}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Status Information */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Status & Source</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="outline">{LEAD_STATUS[lead.status]}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Source</span>
                      <Badge variant="secondary">{LEAD_SOURCE[lead.source]}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Tags */}
                {lead.tags && lead.tags.length > 0 && (
                  <>
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {lead.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Timestamps */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span>{format(new Date(lead.createdAt), 'PPp')}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span>{format(new Date(lead.updatedAt), 'PPp')}</span>
                    </div>

                    {lead.lastContactedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Last Contacted</span>
                        <span>{format(new Date(lead.lastContactedAt), 'PPp')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-4">
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No activity recorded yet
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="mt-1">
                          {activity.type === 'email_sent' && <Mail className="h-4 w-4" />}
                          {activity.type === 'email_received' && <Mail className="h-4 w-4" />}
                          {activity.type === 'call' && <Phone className="h-4 w-4" />}
                          {activity.type === 'meeting' && <Calendar className="h-4 w-4" />}
                          {activity.type === 'note' && <MessageSquare className="h-4 w-4" />}
                          {activity.type === 'status_change' && <Activity className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-4">
                {lead.notes ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Added {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No notes added yet
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        <SheetFooter className="mt-6">
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
            {onDelete && (
              <Button variant="destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            {onEdit && (
              <Button onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Lead
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}