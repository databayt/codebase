/**
 * Full-screen prompt component for Leads
 */

'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import AgentHeading from '@/components/atom/agent-heading';
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage
} from '@/components/atom/prompt-input';
import { PlusIcon, AttachIcon, VoiceIcon, SendUpIcon } from '@/components/atom/icons';

export default function LeadsPrompt() {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text?.trim() && !message.files?.length) return;

    console.log('🚀 Starting import process:', {
      hasText: !!message.text?.trim(),
      filesCount: message.files?.length || 0
    });

    setIsProcessing(true);
    let leadsCreated = 0;

    try {
      // Process text prompt for AI lead generation
      if (message.text?.trim()) {
        console.log('📝 Processing text input:', message.text);
        toast({
          title: 'Processing',
          description: 'Extracting leads from text...',
        });

        const { extractLeadsFromText } = await import('./action');
        const result = await extractLeadsFromText({
          rawText: message.text,
          source: 'WEB', // Use uppercase value expected by Prisma enum
          options: {
            autoScore: true,
            autoEnrich: false,
            deduplication: true,
          }
        });

        console.log('📝 Text extraction result:', result);

        if (result.success && result.data) {
          const extractedCount = result.data.leads?.length || 0;
          leadsCreated += extractedCount;
          console.log(`✅ Extracted ${extractedCount} leads from text`);
          toast({
            title: 'Success',
            description: `Extracted ${extractedCount} leads from text`,
          });
        } else {
          console.error('❌ Text extraction failed:', result.error);
        }
      }

      // Process file uploads for CSV import
      if (message.files?.length) {
        console.log('📁 Processing files:', message.files.length);
        toast({
          title: 'Importing',
          description: `Processing ${message.files.length} file(s)...`,
        });

        for (const file of message.files) {
          console.log('📄 Processing file:', {
            filename: file.filename,
            type: file.mediaType,
            url: file.url
          });

          // Read file content
          const response = await fetch(file.url!);
          const text = await response.text();
          console.log('📄 File content (first 200 chars):', text.substring(0, 200));

          // Parse CSV and create leads
          const imported = await processCSVContent(text);
          console.log(`✅ Imported ${imported} leads from ${file.filename}`);
          leadsCreated += imported;
        }
      }

      console.log(`🎯 Total leads created: ${leadsCreated}`);

      if (leadsCreated > 0) {
        toast({
          title: 'Success!',
          description: `Successfully imported ${leadsCreated} new leads`,
        });

        console.log('🔄 Refreshing page in 1 second...');
        // Refresh the page to show new leads
        setTimeout(() => window.location.reload(), 1000);
      } else {
        console.log('⚠️ No leads were created');
      }
    } catch (error) {
      console.error('Error processing prompt:', error);
    } finally {
      setIsProcessing(false);
      setPrompt('');
    }
  };

  // Helper function to process CSV content
  const processCSVContent = async (csvText: string): Promise<number> => {
    console.log('🔍 Starting CSV processing...');
    const { createLead } = await import('./action');

    const lines = csvText.split('\n').filter(line => line.trim());
    console.log(`📊 Found ${lines.length} lines in CSV`);

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    console.log('📋 CSV Headers:', headers);

    let created = 0;
    let errors = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) {
        console.log(`⚠️ Skipping line ${i + 1}: column count mismatch`);
        continue;
      }

      const leadData: any = {};
      headers.forEach((header, index) => {
        if (header === 'name') leadData.name = values[index];
        if (header === 'email') leadData.email = values[index];
        if (header === 'company') leadData.company = values[index];
        if (header === 'phone') leadData.phone = values[index];
        if (header === 'website') leadData.website = values[index];
        // Skip LinkedIn field - removed from import
        // if (header === 'linkedin') leadData.linkedinUrl = values[index];
      });

      console.log(`📝 Processing lead ${i}:`, leadData);

      if (leadData.name || leadData.email) {
        leadData.status = 'NEW'; // Uppercase for Prisma enum
        leadData.source = 'IMPORT'; // Uppercase for Prisma enum
        leadData.score = Math.floor(Math.random() * 30) + 70; // Random score 70-100

        console.log(`💾 Creating lead: ${leadData.name || leadData.email}`);
        const result = await createLead(leadData);

        if (result.success) {
          created++;
          console.log(`✅ Lead created successfully: ${result.data?.id}`);
        } else {
          errors++;
          console.error(`❌ Failed to create lead: ${leadData.name}`, result.error);
        }
      } else {
        console.log(`⚠️ Skipping line ${i + 1}: no name or email`);
      }
    }

    console.log(`📊 CSV Processing Complete: ${created} created, ${errors} errors`);
    return created;
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20" suppressHydrationWarning>
      <div className="container max-w-4xl px-4" suppressHydrationWarning>
        <div className="flex flex-col items-center text-center space-y-8">
          <AgentHeading
            title="Lead Agent"
            scrollTarget="leads-content"
            scrollText="explore existing leads"
          />

          <div className="w-full max-w-3xl relative">
            <PromptInput
              onSubmit={handleSubmit}
              className="group flex flex-col gap-2 p-3 w-full rounded-[1.75rem] border border-muted-foreground/10 bg-muted text-base shadow-sm transition-all duration-150 ease-in-out focus-within:border-foreground/20 hover:border-foreground/10 focus-within:hover:border-foreground/20"
              multiple
              accept="text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
              maxFiles={5}
              maxFileSize={5 * 1024 * 1024}
            >
              <div className="relative flex flex-1 items-center">
                <PromptInputAttachments>
                  {(attachment) => (
                    <PromptInputAttachment data={attachment} />
                  )}
                </PromptInputAttachments>
                <PromptInputTextarea
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your target audience..."
                  className="flex w-full rounded-md !px-0 -ml-4 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none text-[16px] leading-snug max-h-[200px] bg-transparent focus:bg-transparent flex-1"
                  style={{ minHeight: '80px', height: '80px' }}
                />
              </div>
              <div className="flex gap-1 flex-wrap items-center">
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-muted hover:bg-blue-100 hover:border-transparent gap-1.5 h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-foreground">
                    <PlusIcon className="shrink-0 h-5 w-5 text-muted-foreground" />
                  </PromptInputActionMenuTrigger>
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments label="Upload CSV or Excel file" />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>

                <PromptInputButton
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-muted hover:bg-blue-100 hover:border-transparent py-2 h-8 gap-1.5 rounded-full px-3 text-muted-foreground hover:text-foreground"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <AttachIcon className="shrink-0 h-4 w-4" />
                  <span className="hidden md:flex">Attach</span>
                </PromptInputButton>

                <div className="ml-auto flex items-center gap-1">
                  <div className="relative flex items-center gap-1 md:gap-2">
                    <PromptInputButton
                      className="gap-2 whitespace-nowrap text-sm font-medium ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none border border-input bg-muted hover:bg-blue-100 hover:border-transparent relative z-10 flex rounded-full p-0 text-muted-foreground transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-50 items-center justify-center h-8 w-8"
                      onClick={() => console.log('Voice input activated')}
                    >
                      <VoiceIcon className="shrink-0 relative z-10 h-5 w-5" />
                    </PromptInputButton>

                    <PromptInputSubmit
                      disabled={!prompt.trim() && !isProcessing}
                      status={isProcessing ? 'streaming' : 'ready'}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground transition-opacity duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50"
                      variant="ghost"
                    >
                      <SendUpIcon className="shrink-0 h-6 w-6 text-background" />
                    </PromptInputSubmit>
                  </div>
                </div>
              </div>
              <input
                id="file-upload"
                className="hidden"
                multiple
                type="file"
                accept="text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
                style={{
                  border: 0,
                  clip: 'rect(0, 0, 0, 0)',
                  clipPath: 'inset(50%)',
                  height: '1px',
                  margin: '0 -1px -1px 0',
                  overflow: 'hidden',
                  padding: 0,
                  position: 'absolute',
                  width: '1px',
                  whiteSpace: 'nowrap'
                }}
                tabIndex={-1}
              />
            </PromptInput>
          </div>

        </div>
      </div>
    </section>
  );
}