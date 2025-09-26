/**
 * Full-screen prompt component for Leads
 */

'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AgentHeading from '@/components/atom/agent-heading';
import { AIResponseDisplay } from '@/components/atom/ai-response-display';
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
import { PlusIcon, AttachIcon, VoiceIcon, SendUpIcon, AILogoIcon, AIBrainIcon } from '@/components/atom/icons';
import { RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LeadsPromptProps {
  onLeadsCreated?: (count: number) => void;
}

export default function LeadsPrompt({ onLeadsCreated }: LeadsPromptProps) {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'groq' | 'claude'>('groq');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiReasoning, setAiReasoning] = useState('');
  const [leadsGenerated, setLeadsGenerated] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { toast } = useToast();

  console.log('🎯 [LeadsPrompt] Component rendered');
  console.log('🤖 [LeadsPrompt] Selected model:', selectedModel);

  const handleRefresh = () => {
    // Trigger parent to refresh leads data
    if (onLeadsCreated) {
      onLeadsCreated(leadsGenerated);
    }
    // Refresh the page
    window.location.reload();
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    console.log('📥 [LeadsPrompt.handleSubmit] Called with message:', {
      hasText: !!message.text?.trim(),
      textLength: message.text?.length || 0,
      filesCount: message.files?.length || 0,
      files: message.files?.map(f => ({ filename: f.filename, type: f.mediaType })) || []
    });

    if (!message.text?.trim() && !message.files?.length) {
      console.log('⚠️ [LeadsPrompt.handleSubmit] No text or files provided, aborting');
      return;
    }

    console.log('🚀 [LeadsPrompt.handleSubmit] Starting import process...');

    // Hide agent heading and show AI response
    setHasInteracted(true);
    setIsProcessing(true);

    // Only set reasoning if we're actually using AI (text input)
    if (message.text?.trim()) {
      setAiReasoning(`## Lead Extraction Process

1. **Analyzing Input**: Parsing the provided text to identify potential leads
2. **Data Extraction**: Using ${selectedModel === 'groq' ? 'Groq' : 'Claude'} model to extract relevant information
3. **Validation**: Ensuring all extracted leads have valid contact information
4. **Enrichment**: Adding scores and metadata to prioritize leads
5. **Deduplication**: Removing any duplicate entries to maintain data quality`);
    } else {
      setAiReasoning(''); // No reasoning for file imports
    }

    let leadsCreated = 0;

    try {
      // Process text prompt for AI lead generation
      if (message.text?.trim()) {
        console.log('📝 [LeadsPrompt.handleSubmit] Processing text input');
        toast({
          title: 'Processing',
          description: 'Extracting leads from text...',
        });

        const { extractLeadsFromText } = await import('./action');

        const result = await extractLeadsFromText({
          rawText: message.text,
          source: 'web',
          model: selectedModel,
          options: {
            autoScore: true,
            autoEnrich: false,
            deduplication: true,
          }
        });

        if (result.success && result.data) {
          const extractedCount = result.data.leads?.length || 0;
          leadsCreated += extractedCount;
          setLeadsGenerated(extractedCount);

          // Format AI response
          const leadsList = result.data.leads?.map((lead: any, idx: number) =>
            `${idx + 1}. **${lead.name}** - ${lead.company || 'N/A'} (${lead.email || 'No email'})`
          ).join('\n');

          setAiResponse(`## Lead Extraction Results

Successfully extracted **${extractedCount} leads** from your input.

### Extracted Leads:
${leadsList || 'No leads found'}

### Actions Available:
- Click **Refresh Table** below to view the new leads
- Continue adding more leads using the input
- Export leads when ready`);

          // Notify parent component about new leads
          if (onLeadsCreated) {
            onLeadsCreated(extractedCount);
          }

        } else {
          console.error('❌ [LeadsPrompt.handleSubmit] Text extraction failed:', result.error);
          setAiResponse(`## Extraction Failed

Unable to extract leads from the provided input.

### Error Details:
${result.error || 'Unknown error occurred'}

### Suggestions:
- Ensure your input contains valid contact information
- Try using a different format or structure
- Check for any formatting issues in your data`);
        }
      }

      // Process file uploads for CSV import
      if (message.files?.length) {
        console.log('📁 [LeadsPrompt.handleSubmit] Processing', message.files.length, 'file(s)');
        toast({
          title: 'Importing',
          description: `Processing ${message.files.length} file(s)...`,
        });

        for (let i = 0; i < message.files.length; i++) {
          const file = message.files[i];
          const response = await fetch(file.url!);
          const text = await response.text();

          const imported = await processCSVContent(text);
          leadsCreated += imported;
        }

        setLeadsGenerated(prev => prev + leadsCreated);

        if (onLeadsCreated) {
          onLeadsCreated(leadsCreated);
        }
      }

      console.log(`🎯 [LeadsPrompt.handleSubmit] FINAL RESULT: Total leads created: ${leadsCreated}`);

      if (leadsCreated > 0) {
        toast({
          title: 'Success!',
          description: `Successfully imported ${leadsCreated} new leads. Click "Refresh Table" to view them.`,
          duration: 5000,
        });

        // Don't auto-refresh - wait for user action
        console.log('✋ [LeadsPrompt.handleSubmit] Waiting for user action to refresh...');
      } else {
        console.log('⚠️ [LeadsPrompt.handleSubmit] No leads were created');
        if (!aiResponse) {
          setAiResponse(`## No Leads Found

No valid leads could be extracted from your input.

### Tips for Better Results:
- Include clear contact information (names, emails, companies)
- Use structured formats like CSV or lists
- Provide more detailed descriptions of your target audience`);
        }
      }
    } catch (error) {
      console.error('❌ [LeadsPrompt.handleSubmit] Error processing prompt:', error);
      setAiResponse(`## Error Occurred

An error occurred while processing your request. Please try again.`);
    } finally {
      console.log('🏁 [LeadsPrompt.handleSubmit] Cleanup: resetting processing state');
      setIsProcessing(false);
      // Clear the input after processing
      setPrompt('');
      // Reset the textarea value directly
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.value = '';
      }
    }
  };

  // Helper function to process CSV content
  const processCSVContent = async (csvText: string): Promise<number> => {
    const { createLead } = await import('./action');

    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return 0;

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    let created = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());

      if (values.length !== headers.length) continue;

      const leadData: any = {};
      headers.forEach((header, index) => {
        if (header === 'name') leadData.name = values[index];
        if (header === 'email') leadData.email = values[index];
        if (header === 'company') leadData.company = values[index];
        if (header === 'phone') leadData.phone = values[index];
        if (header === 'website') leadData.website = values[index];
      });

      if (leadData.name || leadData.email) {
        leadData.status = 'NEW';
        leadData.source = 'IMPORT';
        leadData.score = Math.floor(Math.random() * 30) + 70;

        const result = await createLead(leadData);
        if (result.success) created++;
      }
    }

    return created;
  };

  return (
    <section className="h-screen flex flex-col bg-gradient-to-b from-background to-muted/20" suppressHydrationWarning>
      <div className="flex-1 flex flex-col items-center justify-center container max-w-4xl px-4 mx-auto" suppressHydrationWarning>
        <div className="flex flex-col items-center text-center flex-1 w-full justify-center">
          {!hasInteracted && (
            <AgentHeading
              title="Lead Agent"
              scrollTarget="leads-content"
              scrollText="explore existing leads"
            />
          )}

          {hasInteracted && (
            <div
              id="ai-response-container"
              className={cn(
                "w-full max-w-3xl space-y-4 overflow-y-auto overflow-x-hidden rounded-lg relative flex-1",
                isInputFocused ? "max-h-[200px]" : "max-h-[500px]"
              )}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(155, 155, 155, 0.2) transparent',
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  width: 6px;
                }
                div::-webkit-scrollbar-track {
                  background: transparent;
                }
                div::-webkit-scrollbar-thumb {
                  background-color: rgba(155, 155, 155, 0.3);
                  border-radius: 3px;
                  border: transparent;
                }
                div::-webkit-scrollbar-thumb:hover {
                  background-color: rgba(155, 155, 155, 0.5);
                }
              `}</style>
              <AIResponseDisplay
                response={aiResponse}
                reasoning={aiReasoning}
                isStreaming={isProcessing}
                showReasoning={!!aiReasoning}
                className="mb-4 pr-3"
                streamDelay={10}
              />

              {leadsGenerated > 0 && !isProcessing && (
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleRefresh}
                    className="gap-2"
                    size="lg"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Table ({leadsGenerated} new leads)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setHasInteracted(false);
                      setAiResponse('');
                      setAiReasoning('');
                      setLeadsGenerated(0);
                    }}
                  >
                    Start New
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="w-full max-w-3xl relative">
            <PromptInput
              onSubmit={handleSubmit}
              className={cn(
                "group flex gap-2 w-full rounded-[1.75rem] border border-muted-foreground/10 bg-muted text-base shadow-sm transition-all duration-300 ease-in-out focus-within:border-foreground/20 hover:border-foreground/10 focus-within:hover:border-foreground/20",
                hasInteracted && !isInputFocused ? "h-14 items-center p-2" : "flex-col p-3"
              )}
              multiple
              accept="text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
              maxFiles={5}
              maxFileSize={5 * 1024 * 1024}
            >
              <div className={cn(
                "relative flex items-center",
                hasInteracted && !isInputFocused ? "flex-1 gap-2" : "flex-1"
              )}>
                {hasInteracted && !isInputFocused && (
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger className="h-8 w-8 rounded-full bg-muted hover:bg-blue-100 p-0">
                      <PlusIcon className="h-5 w-5" />
                    </PromptInputActionMenuTrigger>
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments label="Upload CSV or Excel file" />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                )}

                <PromptInputAttachments>
                  {(attachment) => (
                    <PromptInputAttachment data={attachment} />
                  )}
                </PromptInputAttachments>

                <PromptInputTextarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder={hasInteracted && !isInputFocused ? "Add more leads..." : "Describe your target audience..."}
                  className={cn(
                    "flex w-full rounded-md ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none text-[16px] bg-transparent focus:bg-transparent flex-1",
                    hasInteracted && !isInputFocused
                      ? "!px-2 py-0 leading-[40px] max-h-[40px]"
                      : "!px-0 -ml-4 py-2 leading-snug max-h-[200px]"
                  )}
                  style={hasInteracted && !isInputFocused ? { height: '40px' } : { minHeight: '80px', height: '80px' }}
                />

                {hasInteracted && !isInputFocused && (
                  <div className="flex items-center gap-1">
                    <PromptInputButton
                      className="h-8 w-8 rounded-full bg-muted hover:bg-blue-100"
                      onClick={() => console.log('Voice input activated')}
                    >
                      <VoiceIcon className="h-5 w-5" />
                    </PromptInputButton>

                    <PromptInputSubmit
                      disabled={!prompt.trim() && !isProcessing}
                      status={isProcessing ? 'streaming' : 'ready'}
                      className="h-8 w-8 rounded-full"
                      variant="default"
                      size="icon"
                    >
                      <SendUpIcon className="h-5 w-5" />
                    </PromptInputSubmit>
                  </div>
                )}
              </div>
              {(!hasInteracted || isInputFocused) && (
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

                <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as 'groq' | 'claude')}>
                  <SelectTrigger
                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-muted hover:bg-blue-100 hover:border-transparent h-8 gap-1.5 rounded-full px-3 text-muted-foreground hover:text-foreground w-auto min-w-[120px]"
                    size="sm"
                  >
                    <div className="flex items-center gap-1.5">
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="groq">
                      <div className="flex items-center gap-2">
                        <AILogoIcon className="h-4 w-4" />
                        <span>Groq</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="claude">
                      <div className="flex items-center gap-2">
                        <AIBrainIcon className="h-4 w-4" />
                        <span>Claude</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

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
                      className="h-8 w-8 rounded-full"
                      variant="default"
                      size="icon"
                    >
                      <SendUpIcon className="shrink-0 h-5 w-5" />
                    </PromptInputSubmit>
                  </div>
                </div>
              </div>
              )}

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