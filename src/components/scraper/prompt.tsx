/**
 * Full-screen prompt component for Scraper
 */

'use client';

import { useState } from 'react';
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
import { PlusIcon, AttachIcon, VoiceIcon, SendUpIcon } from '@/components/atom/icons';

export default function ScraperPrompt() {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiReasoning, setAiReasoning] = useState('');

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text?.trim() && !message.files?.length) return;

    // Hide agent heading and show AI response
    setHasInteracted(true);
    setIsProcessing(true);

    // Only set reasoning if we're using AI (text input for URLs)
    if (message.text?.trim()) {
      setAiReasoning(`## Web Scraping Process

1. **URL Analysis**: Parsing and validating the provided URLs
2. **Site Structure**: Analyzing website structure and identifying data patterns
3. **Data Extraction**: Using intelligent selectors to extract relevant information
4. **Data Cleaning**: Processing and formatting the extracted data
5. **Quality Assurance**: Validating extracted data for completeness and accuracy`);
    } else {
      setAiReasoning(''); // No reasoning for file uploads
    }

    try {
      // TODO: Implement AI scraping logic here
      console.log('Processing scraper prompt:', message);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate AI response
      setAiResponse(`## Scraping Results

Successfully extracted data from the specified sources.

### Extracted Data Summary:
- **Total URLs Processed**: 5
- **Successful Extractions**: 5
- **Data Points Collected**: 247
- **Average Response Time**: 1.2s

### Sample Data:
1. **Company Name**: Tech Innovations Inc.
   - Contact: john.doe@techinnovations.com
   - Phone: (555) 123-4567
   - Website: techinnovations.com

2. **Company Name**: Digital Solutions LLC
   - Contact: sarah@digitalsolutions.io
   - Phone: (555) 987-6543
   - Website: digitalsolutions.io

### Next Steps:
- Review extracted data in the table below
- Export data as CSV or JSON
- Set up automated scraping schedule
- Configure data validation rules`);

      // Scroll to scraper content after processing
      document.getElementById('scraper-content')?.scrollIntoView({
        behavior: 'smooth'
      });
    } catch (error) {
      console.error('Error processing scraper prompt:', error);
      setAiResponse(`## Scraping Failed

Unable to extract data from the provided sources.

### Error Details:
${error instanceof Error ? error.message : 'Unknown error occurred'}

### Common Issues:
- Website may have anti-scraping measures
- Invalid or inaccessible URLs
- Network connectivity issues
- Rate limiting or IP blocking

### Suggestions:
- Verify all URLs are accessible
- Try scraping fewer pages at once
- Consider using proxy rotation
- Check robots.txt compliance`);
    } finally {
      setIsProcessing(false);
      setPrompt('');
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl px-4">
        <div className="flex flex-col items-center text-center space-y-8">
          {!hasInteracted && (
            <AgentHeading
              title="Scraper Agent"
              scrollTarget="scraper-content"
              scrollText="explore scraper tools"
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
                  placeholder="Enter URLs or describe what to scrape..."
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
                    <PromptInputActionAddAttachments label="Upload URL list (CSV)" />
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