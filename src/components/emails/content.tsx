/**
 * Email Management Content Component
 * Main UI orchestration for the email feature
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, Send, FileText, Sparkles, Users, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EmailsPrompt from "./prompt";

export default function EmailsContent() {
  const { toast } = useToast();
  const [emailContent, setEmailContent] = useState("");
  const [subject, setSubject] = useState("");
  const [recipient, setRecipient] = useState("");
  const [template, setTemplate] = useState("");

  const handleSendEmail = async () => {
    // TODO: Implement email sending logic
    toast({
      title: "Email Sent",
      description: "Your email has been sent successfully.",
    });
  };

  const handleGenerateTemplate = async () => {
    // TODO: Implement AI template generation
    toast({
      title: "Template Generated",
      description: "AI has generated a new email template for you.",
    });
  };

  return (
    <>
      <EmailsPrompt />
      <div id="emails-content" className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Email Automation</h1>
          <p className="text-muted-foreground mt-2">
            Manage email campaigns, templates, and automated sequences
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Compose Email
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose Email</DialogTitle>
              <DialogDescription>
                Create and send a new email or save it as a draft
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">To</Label>
                <Input
                  id="recipient"
                  placeholder="recipient@example.com"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  placeholder="Write your email here..."
                  className="min-h-[200px]"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleGenerateTemplate}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Generate
                </Button>
                <Button onClick={handleSendEmail}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              5 AI-generated
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">
              Active contacts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="sequences">Sequences</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>
                View and manage your email campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">Product Launch Campaign</p>
                    <p className="text-sm text-muted-foreground">Sent to 450 contacts • 28% open rate</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">Monthly Newsletter</p>
                    <p className="text-sm text-muted-foreground">Scheduled for tomorrow • 892 recipients</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">Welcome Series</p>
                    <p className="text-sm text-muted-foreground">Automated • 156 active subscribers</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Pre-built templates for various email types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-medium">Sales Follow-up</h4>
                  <p className="text-sm text-muted-foreground">Professional follow-up template for sales leads</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Preview</Button>
                    <Button size="sm">Use Template</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-medium">Meeting Request</h4>
                  <p className="text-sm text-muted-foreground">Schedule meetings with prospects</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Preview</Button>
                    <Button size="sm">Use Template</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-medium">Product Demo</h4>
                  <p className="text-sm text-muted-foreground">Invite prospects to product demonstrations</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Preview</Button>
                    <Button size="sm">Use Template</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-medium">Thank You</h4>
                  <p className="text-sm text-muted-foreground">Express gratitude to customers</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Preview</Button>
                    <Button size="sm">Use Template</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sequences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Sequences</CardTitle>
              <CardDescription>
                Set up automated email workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create automated email sequences that trigger based on user actions
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Analytics</CardTitle>
              <CardDescription>
                Track performance metrics for your email campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View detailed analytics about open rates, click-through rates, and conversions
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}