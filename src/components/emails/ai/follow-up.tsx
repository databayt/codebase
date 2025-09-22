'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MessageSquare,
  Clock,
  Copy,
  Download,
  RefreshCw,
  ArrowRight,
  Calendar,
  Zap,
  TrendingUp,
  Heart,
  Target
} from 'lucide-react';
import { useFollowUpSequence } from './use-emails';
import { FOLLOW_UP_STRATEGIES } from './constant';

export function FollowUpGenerator() {
  const [initialEmail, setInitialEmail] = useState('');
  const [numberOfFollowUps, setNumberOfFollowUps] = useState(3);
  const [daysBetween, setDaysBetween] = useState(3);
  const [strategy, setStrategy] = useState<'persistent' | 'value_add' | 'urgency' | 'nurture'>('value_add');
  const [stopOnReply, setStopOnReply] = useState(true);

  const {
    generateSequence,
    sequence,
    status,
    error,
    isGenerating
  } = useFollowUpSequence();

  const handleGenerateSequence = async () => {
    if (!initialEmail.trim()) return;
    await generateSequence(initialEmail, numberOfFollowUps, daysBetween, strategy);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportSequence = () => {
    if (!sequence) return;

    const blob = new Blob([JSON.stringify(sequence, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `follow-up-sequence-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInitialEmail(`Subject: Quick question about your sales process

Hi Sarah,

I noticed your team at TechCorp has been growing rapidly. Congrats!

With that growth, I imagine managing personalized outreach at scale is becoming challenging.

We've helped similar companies automate their sales emails while maintaining that personal touch. Would you be interested in a quick demo?

Best,
John`);
  };

  const getStrategyIcon = (strat: string) => {
    switch (strat) {
      case 'persistent': return <Target className="h-4 w-4" />;
      case 'value_add': return <TrendingUp className="h-4 w-4" />;
      case 'urgency': return <Zap className="h-4 w-4" />;
      case 'nurture': return <Heart className="h-4 w-4" />;
      default: return null;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Follow-up Sequence Generator</CardTitle>
          <CardDescription>
            Create strategic follow-up sequences that get responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Initial Email */}
          <div className="space-y-2">
            <Label htmlFor="initial">Initial Email</Label>
            <Textarea
              id="initial"
              placeholder="Paste your initial email here..."
              value={initialEmail}
              onChange={(e) => setInitialEmail(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
            <Button variant="outline" size="sm" onClick={loadSample}>
              Load Sample Email
            </Button>
          </div>

          {/* Strategy Selection */}
          <div className="space-y-3">
            <Label>Follow-up Strategy</Label>
            <RadioGroup value={strategy} onValueChange={(v) => setStrategy(v as any)}>
              <div className="grid gap-3">
                {FOLLOW_UP_STRATEGIES.map((s) => (
                  <div key={s.value} className="flex items-start space-x-3">
                    <RadioGroupItem value={s.value} id={s.value} />
                    <div className="flex-1">
                      <Label htmlFor={s.value} className="flex items-center gap-2 cursor-pointer">
                        {getStrategyIcon(s.value)}
                        <span>{s.label}</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Schedule: {s.schedule.join(', ')} days
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Number of Follow-ups */}
          <div className="space-y-2">
            <Label htmlFor="number">
              Number of Follow-ups: <span className="font-bold">{numberOfFollowUps}</span>
            </Label>
            <Slider
              id="number"
              value={[numberOfFollowUps]}
              onValueChange={([v]) => setNumberOfFollowUps(v)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Total emails in sequence: {numberOfFollowUps + 1} (including initial)
            </p>
          </div>

          {/* Days Between */}
          <div className="space-y-2">
            <Label htmlFor="days">
              Days Between Emails: <span className="font-bold">{daysBetween}</span>
            </Label>
            <Slider
              id="days"
              value={[daysBetween]}
              onValueChange={([v]) => setDaysBetween(v)}
              min={1}
              max={30}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Total sequence duration: {numberOfFollowUps * daysBetween} days
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="stop"
                checked={stopOnReply}
                onCheckedChange={(checked) => setStopOnReply(!!checked)}
              />
              <Label htmlFor="stop" className="cursor-pointer">
                Stop sequence when recipient replies
              </Label>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateSequence}
            disabled={!initialEmail.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating Sequence...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                Generate Follow-up Sequence
              </>
            )}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Sequence */}
      {sequence && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Follow-up Sequence</CardTitle>
                  <CardDescription>
                    {sequence.totalEmails} emails using {sequence.strategy} strategy
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={exportSequence}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Timeline View */}
              <div className="relative space-y-6">
                {/* Initial Email */}
                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      0
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>Initial Email</Badge>
                      <span className="text-sm text-muted-foreground">Day 0</span>
                    </div>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-sm">
                            {sequence.initialEmail.subject}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(sequence.initialEmail.textContent)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {sequence.initialEmail.textContent}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Follow-ups */}
                {sequence.followUps.map((followUp, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    {/* Connection Line */}
                    <div className="absolute left-5 top-0 bottom-0 w-px bg-border -translate-y-full" />

                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        {followUp.followUpNumber}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Follow-up #{followUp.followUpNumber}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Day {followUp.daysAfterPrevious * followUp.followUpNumber}
                        </span>
                        <Badge className={getUrgencyColor(followUp.urgencyLevel)} variant="secondary">
                          {followUp.urgencyLevel} urgency
                        </Badge>
                      </div>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-medium text-sm">
                              {followUp.subject}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(followUp.content)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {followUp.content}
                          </p>
                          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                            <span>~{followUp.content.split(' ').length} words</span>
                            <span>•</span>
                            <span>{followUp.tone} tone</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sequence Summary */}
              <Card className="mt-6 bg-muted/50">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Emails</p>
                      <p className="font-medium">{sequence.totalEmails}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{sequence.followUps.length * daysBetween} days</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Strategy</p>
                      <p className="font-medium capitalize">{sequence.strategy.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stop on Reply</p>
                      <p className="font-medium">{sequence.stopOnReply ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Follow-up Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Keep each follow-up shorter than the previous one</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Reference previous emails naturally</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Add new value or information in each email</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Change the angle or approach if no response</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}