/**
 * Lead detail page
 * Displays detailed information about a specific lead
 */

export const runtime = "nodejs";

import { notFound } from 'next/navigation';
import { getLeadById } from '@/components/leads/action';
import { PageHeader } from '@/components/atom/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { VerificationBadge } from '@/components/leads/verification-badge';
import { LEAD_STATUS, LEAD_SOURCE } from '@/components/leads/constant';
import { ArrowLeft, Edit, Trash, Mail, Phone, Globe, Building, User, Calendar, Target } from 'lucide-react';
import Link from 'next/link';

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = await params;
  const result = await getLeadById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const lead = result.data;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <PageHeader
        heading={
          <div className="flex items-center gap-2">
            <Link href={`/${lang}/leads`}>
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            {lead.name}
            <VerificationBadge verified={lead.verified} />
          </div>
        }
        description={`View and manage details for ${lead.name}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Name</span>
                  </div>
                  <div className="font-medium flex items-center gap-2">
                    {lead.name}
                    <VerificationBadge verified={lead.verified} />
                  </div>
                </div>

                {lead.company && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>Company</span>
                    </div>
                    <div className="font-medium">{lead.company}</div>
                  </div>
                )}

                {lead.email && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                    <a href={`mailto:${lead.email}`} className="font-medium text-primary hover:underline">
                      {lead.email}
                    </a>
                  </div>
                )}

                {lead.phone && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>Phone</span>
                    </div>
                    <a href={`tel:${lead.phone}`} className="font-medium text-primary hover:underline">
                      {lead.phone}
                    </a>
                  </div>
                )}

                {lead.website && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>Website</span>
                    </div>
                    <a href={lead.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                      {lead.website}
                    </a>
                  </div>
                )}
              </div>

              {lead.description && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                    <p className="text-sm">{lead.description}</p>
                  </div>
                </>
              )}

              {lead.notes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                    <p className="text-sm">{lead.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge>{LEAD_STATUS[lead.status]}</Badge>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Source</div>
                <Badge variant="secondary">{LEAD_SOURCE[lead.source]}</Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>Score</span>
                </div>
                <div className="text-2xl font-bold">{lead.score || 0}</div>
              </div>

              {lead.verified && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Verification</div>
                  <div className="flex items-center gap-2">
                    <VerificationBadge verified={true} />
                    <span className="text-sm">Verified Lead</span>
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Created</span>
                </div>
                <div className="text-sm">{new Date(lead.createdAt).toLocaleDateString()}</div>
              </div>

              {lead.lastContactedAt && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Last Contacted</div>
                  <div className="text-sm">{new Date(lead.lastContactedAt).toLocaleDateString()}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}