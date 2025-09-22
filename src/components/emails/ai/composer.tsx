'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { AiPromptInput } from '@/components/atom/ai/ai-prompt-input';
import { AiStreamingText } from '@/components/atom/ai/ai-streaming-text';
import { AiStatusIndicator } from '@/components/atom/ai/ai-status-indicator';
import {
  Mail,
  Send,
  Sparkles,
  Copy,
  Save,
  Users,
  Target,
  Wand2,
  Download,
  Plus
} from 'lucide-react';
import { useEmailGenerator, useEmailPersonalization } from './use-emails';
import { EMAIL_TONES, EMAIL_TEMPLATES, PERSONALIZATION_FIELDS } from './constant';
import type { EmailTone, EmailLead } from './type';

export function EmailComposer() {
  const [tone, setTone] = useState<EmailTone>('professional');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>(['']);
  const [includePersonalization, setIncludePersonalization] = useState(true);
  const [selectedFields, setSelectedFields] = useState<string[]>(['firstName', 'company']);

  const {
    generateTemplate,
    streamingTemplate,
    status,
    error,
    reset,
    isGenerating
  } = useEmailGenerator();

  const { personalizeEmail, personalizedEmails } = useEmailPersonalization();

  const handleGenerateTemplate = async (purpose: string) => {
    const validKeyPoints = keyPoints.filter(point => point.trim());
    await generateTemplate(purpose, targetAudience, validKeyPoints, tone);
  };

  const handleAddKeyPoint = () => {
    setKeyPoints([...keyPoints, '']);
  };

  const handleUpdateKeyPoint = (index: number, value: string) => {
    const updated = [...keyPoints];
    updated[index] = value;
    setKeyPoints(updated);
  };

  const handleRemoveKeyPoint = (index: number) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== index));
  };

  const copyToClipboard = () => {
    if (streamingTemplate) {
      navigator.clipboard.writeText(streamingTemplate);
    }
  };

  const exportTemplate = () => {
    if (!streamingTemplate) return;

    const template = {
      content: streamingTemplate,
      tone,
      targetAudience,
      keyPoints: keyPoints.filter(p => p.trim()),
      personalizationFields: selectedFields,
      createdAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-template-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePersonalizeForLead = () => {
    // Mock lead for demonstration
    const mockLead: EmailLead = {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      company: 'TechCorp',
      title: 'CEO',
      industry: 'Technology'
    };

    if (streamingTemplate) {
      personalizeEmail(streamingTemplate, mockLead, tone);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Email Template Generator</CardTitle>
          <CardDescription>
            Create professional email templates with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tone Selection */}
          <div className="space-y-3">
            <Label>Email Tone</Label>
            <RadioGroup value={tone} onValueChange={(v) => setTone(v as EmailTone)}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {EMAIL_TONES.map((t) => (
                  <div key={t.value} className="flex items-start space-x-2">
                    <RadioGroupItem value={t.value} id={t.value} />
                    <div className="flex-1">
                      <Label htmlFor={t.value} className="cursor-pointer">
                        <span className="flex items-center gap-1">
                          <span>{t.icon}</span>
                          <span>{t.label}</span>
                        </span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Input
              id="audience"
              placeholder="e.g., B2B decision makers, startup founders, enterprise CTOs..."
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>

          {/* Key Points */}
          <div className="space-y-2">
            <Label>Key Points to Include</Label>
            <div className="space-y-2">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Enter a key point..."
                    value={point}
                    onChange={(e) => handleUpdateKeyPoint(index, e.target.value)}
                  />
                  {keyPoints.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveKeyPoint(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddKeyPoint}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Key Point
              </Button>
            </div>
          </div>

          {/* Personalization Fields */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="personalization"
                checked={includePersonalization}
                onCheckedChange={(checked) => setIncludePersonalization(!!checked)}
              />
              <Label htmlFor="personalization">Include Personalization Tokens</Label>
            </div>
            {includePersonalization && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {PERSONALIZATION_FIELDS.map((field) => (
                  <div key={field.field} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.field}
                      checked={selectedFields.includes(field.field)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedFields([...selectedFields, field.field]);
                        } else {
                          setSelectedFields(selectedFields.filter(f => f !== field.field));
                        }
                      }}
                    />
                    <Label htmlFor={field.field} className="text-sm cursor-pointer">
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button and Templates */}
          <AiPromptInput
            onSubmit={handleGenerateTemplate}
            placeholder="Describe the email you want to create..."
            templates={EMAIL_TEMPLATES.map(t => ({ label: t.label, prompt: t.prompt }))}
            suggestions={[
              'Cold outreach for software services',
              'Follow-up after product demo',
              'Re-engagement campaign for inactive users',
              'Partnership proposal email'
            ]}
            maxLength={500}
            loading={isGenerating}
          />

          <AiStatusIndicator
            status={status}
            provider="Claude"
            model="claude-3-5-sonnet"
            showDetails={status !== 'idle'}
          />
        </CardContent>
      </Card>

      {/* Generated Template */}
      {streamingTemplate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Email Template</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={exportTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" variant="outline" onClick={handlePersonalizeForLead}>
                  <Users className="h-4 w-4 mr-2" />
                  Personalize
                </Button>
                <Button size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <AiStreamingText
                text={streamingTemplate}
                speed="instant"
                className="whitespace-pre-wrap font-mono text-sm"
              />
            </div>

            {/* Template Stats */}
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Words: {streamingTemplate.split(' ').length}</span>
              <span>Characters: {streamingTemplate.length}</span>
              <span>Reading Time: ~{Math.ceil(streamingTemplate.split(' ').length / 200)} min</span>
            </div>

            {/* Personalization Preview */}
            {includePersonalization && selectedFields.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Personalization Tokens Used:</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedFields.map(field => {
                    const fieldData = PERSONALIZATION_FIELDS.find(f => f.field === field);
                    return fieldData ? (
                      <Badge key={field} variant="secondary">
                        {fieldData.token}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Personalized Emails */}
      {personalizedEmails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Personalized Versions</CardTitle>
            <CardDescription>
              Email personalized for individual leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {personalizedEmails.map((email, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{email.leadEmail}</Badge>
                    <Button size="sm" variant="ghost">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-3">
                    {email.personalizedContent.textContent}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}