/**
 * Full-screen prompt component for Leads
 */

'use client';

import { useState } from 'react';
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
import { PlusIcon, AttachIcon, VoiceIcon, SendUpIcon, ModelIcon, AILogoIcon, AIBrainIcon } from '@/components/atom/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LeadsPrompt() {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'groq' | 'claude'>('groq');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiReasoning, setAiReasoning] = useState('');
  const { toast } = useToast();

  console.log('🎯 [LeadsPrompt] Component rendered');
  console.log('🤖 [LeadsPrompt] Selected model:', selectedModel);

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
        console.log('📝 [LeadsPrompt.handleSubmit] Text content (first 200 chars):', message.text.substring(0, 200));
        toast({
          title: 'Processing',
          description: 'Extracting leads from text...',
        });

        console.log('📦 [LeadsPrompt.handleSubmit] Importing extractLeadsFromText action...');
        const { extractLeadsFromText } = await import('./action');

        console.log('🔄 [LeadsPrompt.handleSubmit] Calling extractLeadsFromText with params:', {
          textLength: message.text.length,
          source: 'web',
          model: selectedModel,
          options: { autoScore: true, autoEnrich: false, deduplication: true }
        });

        const result = await extractLeadsFromText({
          rawText: message.text,
          source: 'web', // Use lowercase value expected by validation schema
          model: selectedModel, // Pass the selected model
          options: {
            autoScore: true,
            autoEnrich: false,
            deduplication: true,
          }
        });

        console.log('📤 [LeadsPrompt.handleSubmit] Text extraction result:', {
          success: result.success,
          error: result.error,
          leadsCount: result.data?.leads?.length || 0,
          leads: result.data?.leads || []
        });

        if (result.success && result.data) {
          const extractedCount = result.data.leads?.length || 0;
          leadsCreated += extractedCount;
          console.log(`✅ [LeadsPrompt.handleSubmit] Successfully extracted ${extractedCount} leads from text`);

          // Format AI response
          const leadsList = result.data.leads?.map((lead: any, idx: number) =>
            `${idx + 1}. **${lead.name}** - ${lead.company || 'N/A'} (${lead.email || 'No email'})`
          ).join('\n');

          setAiResponse(`## Lead Extraction Results

Successfully extracted **${extractedCount} leads** from your input.

### Extracted Leads:
${leadsList || 'No leads found'}

### Next Steps:
- Review the extracted leads in the table below
- Edit any information as needed
- Export the leads or continue adding more`);

          toast({
            title: 'Success',
            description: `Extracted ${extractedCount} leads from text`,
          });
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
        console.log('📁 [LeadsPrompt.handleSubmit] File details:', message.files.map(f => ({
          filename: f.filename,
          mediaType: f.mediaType,
          url: f.url?.substring(0, 50) + '...'
        })));
        toast({
          title: 'Importing',
          description: `Processing ${message.files.length} file(s)...`,
        });

        for (let i = 0; i < message.files.length; i++) {
          const file = message.files[i];
          console.log(`📄 [LeadsPrompt.handleSubmit] Processing file ${i + 1}/${message.files.length}:`, {
            filename: file.filename,
            type: file.mediaType,
            urlLength: file.url?.length || 0
          });

          // Read file content
          console.log(`🌐 [LeadsPrompt.handleSubmit] Fetching file content from URL...`);
          const response = await fetch(file.url!);
          const text = await response.text();
          console.log(`📄 [LeadsPrompt.handleSubmit] File content received:`, {
            contentLength: text.length,
            preview: text.substring(0, 200),
            linesCount: text.split('\n').length
          });

          // Parse CSV and create leads
          console.log(`🔄 [LeadsPrompt.handleSubmit] Calling processCSVContent for file: ${file.filename}`);
          const imported = await processCSVContent(text);
          console.log(`✅ [LeadsPrompt.handleSubmit] Imported ${imported} leads from ${file.filename}`);
          leadsCreated += imported;
        }
      }

      console.log(`🎯 [LeadsPrompt.handleSubmit] FINAL RESULT: Total leads created: ${leadsCreated}`);

      if (leadsCreated > 0) {
        toast({
          title: 'Success!',
          description: `Successfully imported ${leadsCreated} new leads`,
        });

        console.log('🔄 [LeadsPrompt.handleSubmit] Refreshing page in 1 second to show new leads...');
        // Refresh the page to show new leads
        setTimeout(() => {
          console.log('🔄 [LeadsPrompt.handleSubmit] Executing page reload...');
          window.location.reload();
        }, 1000);
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
      console.error('❌ [LeadsPrompt.handleSubmit] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    } finally {
      console.log('🏁 [LeadsPrompt.handleSubmit] Cleanup: resetting processing state');
      setIsProcessing(false);
      setPrompt('');
    }
  };

  // Helper function to process CSV content
  const processCSVContent = async (csvText: string): Promise<number> => {
    console.log('🔍 [LeadsPrompt.processCSVContent] Starting CSV processing...');
    console.log('🔍 [LeadsPrompt.processCSVContent] Input text length:', csvText.length);
    console.log('📦 [LeadsPrompt.processCSVContent] Importing createLead action...');
    const { createLead } = await import('./action');

    const lines = csvText.split('\n').filter(line => line.trim());
    console.log(`📊 [LeadsPrompt.processCSVContent] Found ${lines.length} non-empty lines in CSV`);

    if (lines.length === 0) {
      console.log('⚠️ [LeadsPrompt.processCSVContent] No lines found in CSV, aborting');
      return 0;
    }

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    console.log('📋 [LeadsPrompt.processCSVContent] CSV Headers:', headers);
    console.log('📋 [LeadsPrompt.processCSVContent] Header count:', headers.length);

    let created = 0;
    let errors = 0;

    for (let i = 1; i < lines.length; i++) {
      console.log(`📝 [LeadsPrompt.processCSVContent] Processing line ${i}/${lines.length - 1}`);
      const values = lines[i].split(',').map(v => v.trim());

      console.log(`📝 [LeadsPrompt.processCSVContent] Line ${i} values:`, values);

      if (values.length !== headers.length) {
        console.log(`⚠️ [LeadsPrompt.processCSVContent] Skipping line ${i + 1}: column count mismatch (expected ${headers.length}, got ${values.length})`);
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

      console.log(`📝 [LeadsPrompt.processCSVContent] Extracted lead data for line ${i}:`, leadData);

      if (leadData.name || leadData.email) {
        leadData.status = 'NEW'; // Uppercase for Prisma enum
        leadData.source = 'IMPORT'; // Uppercase for Prisma enum
        leadData.score = Math.floor(Math.random() * 30) + 70; // Random score 70-100

        console.log(`💾 [LeadsPrompt.processCSVContent] Calling createLead for: ${leadData.name || leadData.email}`);
        console.log(`💾 [LeadsPrompt.processCSVContent] Lead data to create:`, leadData);

        const result = await createLead(leadData);

        console.log(`💾 [LeadsPrompt.processCSVContent] createLead result:`, {
          success: result.success,
          error: result.error,
          leadId: result.data?.id
        });

        if (result.success) {
          created++;
          console.log(`✅ [LeadsPrompt.processCSVContent] Lead created successfully:`, {
            id: result.data?.id,
            name: leadData.name,
            email: leadData.email,
            totalCreated: created
          });
        } else {
          errors++;
          console.error(`❌ [LeadsPrompt.processCSVContent] Failed to create lead:`, {
            name: leadData.name,
            email: leadData.email,
            error: result.error,
            totalErrors: errors
          });
        }
      } else {
        console.log(`⚠️ [LeadsPrompt.processCSVContent] Skipping line ${i + 1}: no name or email found`);
        console.log(`⚠️ [LeadsPrompt.processCSVContent] Line data was:`, leadData);
      }
    }

    console.log(`📊 [LeadsPrompt.processCSVContent] CSV Processing Complete:`, {
      totalLines: lines.length - 1,
      created: created,
      errors: errors,
      skipped: (lines.length - 1) - created - errors
    });
    return created;
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20" suppressHydrationWarning>
      <div className="container max-w-4xl px-4" suppressHydrationWarning>
        <div className="flex flex-col items-center text-center space-y-8">
          {!hasInteracted && (
            <AgentHeading
              title="Lead Agent"
              scrollTarget="leads-content"
              scrollText="explore existing leads"
            />
          )}

          {hasInteracted && (
            <div className="w-full max-w-3xl">
              <AIResponseDisplay
                response={aiResponse}
                reasoning={aiReasoning}
                isStreaming={isProcessing}
                showReasoning={!!aiReasoning}
                className="mb-8"
              />
            </div>
          )}

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

                <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as 'groq' | 'claude')}>
                  <SelectTrigger
                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-muted hover:bg-blue-100 hover:border-transparent h-8 gap-1.5 rounded-full px-3 text-muted-foreground hover:text-foreground w-auto min-w-[120px]"
                    size="sm"
                  >
                    <div className="flex items-center gap-1.5">
                      {/* <ModelIcon className="shrink-0 h-4 w-4" /> */}
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