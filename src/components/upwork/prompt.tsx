/**
 * Full-screen prompt component for Upwork
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

export default function UpworkPrompt() {
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

    // Set reasoning for the AI process
    setAiReasoning(`## Job Analysis Process

1. **Requirements Extraction**: Identifying key skills and qualifications from job description
2. **Proposal Generation**: Creating tailored proposal based on requirements
3. **Rate Analysis**: Determining competitive pricing based on market rates
4. **Compatibility Check**: Assessing match percentage with your profile
5. **Strategy Optimization**: Suggesting improvements for winning the project`);

    try {
      // TODO: Implement AI job analysis logic here
      console.log('Processing upwork prompt:', message);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate AI response
      setAiResponse(`## Job Analysis Complete

I've analyzed the job posting and prepared a winning strategy.

### Key Requirements:
- **Primary Skills**: React, Node.js, TypeScript
- **Experience Level**: Intermediate (3-5 years)
- **Project Duration**: 2-3 months
- **Budget Range**: $30-50/hour

### Match Score: 92%
Your profile strongly aligns with this opportunity.

### Recommended Proposal Opening:
"Hi [Client Name], I noticed you're looking for a React developer with TypeScript expertise. Having built 15+ similar applications, I can deliver exactly what you need..."

### Pricing Strategy:
- **Suggested Rate**: $45/hour (competitive for this project)
- **Estimated Total**: $14,400 (320 hours)
- **Milestone 1**: $3,600 (design & setup)

### Next Steps:
- Customize the generated proposal below
- Attach relevant portfolio samples
- Submit within 2 hours for best visibility
- Follow up after 24 hours if no response`);

      // Scroll to upwork content after processing
      document.getElementById('upwork-content')?.scrollIntoView({
        behavior: 'smooth'
      });
    } catch (error) {
      console.error('Error processing upwork prompt:', error);
      setAiResponse(`## Analysis Failed

Unable to analyze the job posting.

### Error Details:
${error instanceof Error ? error.message : 'Unknown error occurred'}

### Troubleshooting:
- Ensure the job description is complete
- Check for proper formatting
- Try copying directly from Upwork
- Remove any special characters

### Alternative Actions:
- Manually enter key requirements
- Upload job posting as a file
- Use the template generator instead`);
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
              title="Upwork Agent"
              scrollTarget="upwork-content"
              scrollText="explore job tools"
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
              accept="text/plain,.txt,.pdf,text/html,.html"
              maxFiles={10}
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
                  placeholder="Paste job description or describe your ideal project..."
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
                    <PromptInputActionAddAttachments label="Upload job descriptions" />
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
                accept="text/plain,.txt,.pdf,text/html,.html"
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