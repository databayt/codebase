'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Zap,
  Plus,
  Settings,
  UserPlus,
  Clock,
  MousePointer,
  Code,
  Mail,
  Users,
  Bell,
  Webhook,
  Edit,
  Trash2,
  Play,
  Pause
} from 'lucide-react';
import type { EmailAutomationRule } from './type';

export function EmailAutomation() {
  const [automations, setAutomations] = useState<EmailAutomationRule[]>([
    {
      id: '1',
      name: 'Welcome New Leads',
      trigger: {
        type: 'lead_added',
        config: {
          source: 'any'
        }
      },
      action: {
        type: 'send_email',
        config: {
          templateId: 'welcome-template',
          delay: 0
        }
      },
      conditions: [
        {
          field: 'email',
          operator: 'contains',
          value: '@'
        }
      ],
      enabled: true,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Follow-up After 3 Days',
      trigger: {
        type: 'time_based',
        config: {
          afterDays: 3,
          eventType: 'email_sent'
        }
      },
      action: {
        type: 'send_email',
        config: {
          templateId: 'follow-up-template'
        }
      },
      conditions: [
        {
          field: 'opened',
          operator: 'equals',
          value: false
        }
      ],
      enabled: true,
      createdAt: new Date('2024-01-18')
    },
    {
      id: '3',
      name: 'High-Value Lead Alert',
      trigger: {
        type: 'lead_updated',
        config: {
          field: 'score'
        }
      },
      action: {
        type: 'notify',
        config: {
          channel: 'slack',
          message: 'High-value lead detected!'
        }
      },
      conditions: [
        {
          field: 'score',
          operator: 'greater_than',
          value: 80
        }
      ],
      enabled: false,
      createdAt: new Date('2024-01-20')
    }
  ]);

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'lead_added': return <UserPlus className="h-4 w-4" />;
      case 'lead_updated': return <Edit className="h-4 w-4" />;
      case 'time_based': return <Clock className="h-4 w-4" />;
      case 'behavior': return <MousePointer className="h-4 w-4" />;
      case 'custom': return <Code className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'send_email': return <Mail className="h-4 w-4" />;
      case 'add_to_campaign': return <Users className="h-4 w-4" />;
      case 'update_lead': return <Edit className="h-4 w-4" />;
      case 'notify': return <Bell className="h-4 w-4" />;
      case 'webhook': return <Webhook className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const toggleAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(auto =>
        auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
      )
    );
  };

  const deleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(auto => auto.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Automation Rules</CardTitle>
              <CardDescription>
                Set up automated workflows for your email campaigns
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Automation
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Automation Rules */}
      <div className="grid gap-4">
        {automations.map((automation) => (
          <Card key={automation.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${automation.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Zap className={`h-5 w-5 ${automation.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{automation.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Created {automation.createdAt?.toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={automation.enabled}
                    onCheckedChange={() => toggleAutomation(automation.id!)}
                  />
                  <Button size="sm" variant="ghost">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteAutomation(automation.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Workflow Visualization */}
              <div className="flex items-center gap-2 mb-4">
                {/* Trigger */}
                <div className="flex-1">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      {getTriggerIcon(automation.trigger.type)}
                      <span className="text-sm font-medium">Trigger</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {automation.trigger.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center">
                  <div className="w-8 h-px bg-border" />
                  <div className="w-2 h-2 border-t-2 border-r-2 border-border transform rotate-45" />
                </div>

                {/* Conditions */}
                {automation.conditions && automation.conditions.length > 0 && (
                  <>
                    <div className="flex-1">
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Settings className="h-4 w-4" />
                          <span className="text-sm font-medium">Conditions</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {automation.conditions.length} condition{automation.conditions.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-px bg-border" />
                      <div className="w-2 h-2 border-t-2 border-r-2 border-border transform rotate-45" />
                    </div>
                  </>
                )}

                {/* Action */}
                <div className="flex-1">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      {getActionIcon(automation.action.type)}
                      <span className="text-sm font-medium">Action</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {automation.action.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Condition Details */}
              {automation.conditions && automation.conditions.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs">Conditions:</Label>
                  <div className="flex flex-wrap gap-2">
                    {automation.conditions.map((condition, index) => (
                      <Badge key={index} variant="secondary">
                        {condition.field} {condition.operator.replace('_', ' ')} {condition.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center gap-2 mt-4">
                <Badge variant={automation.enabled ? 'default' : 'outline'}>
                  {automation.enabled ? (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <Pause className="h-3 w-3 mr-1" />
                      Paused
                    </>
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Automation Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Templates</CardTitle>
          <CardDescription>
            Quick-start templates for common automation scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-sm">Welcome Series</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  Automatically send a series of welcome emails to new leads
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-sm">Re-engagement Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  Re-engage inactive leads with targeted emails
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-sm">Lead Scoring Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  Get notified when leads reach high engagement scores
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-sm">Birthday Greetings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  Send personalized birthday emails automatically
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {automations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No automation rules yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first automation to streamline your email workflows
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Automation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}