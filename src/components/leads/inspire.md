# Chat Logic Implementation for Leads Prompt

This document shows how to implement proper chat functionality in your leads prompt area, inspired by the AI SDK v5 implementation.

## Current State Analysis

Your current `LeadsPrompt` component has good UI but lacks proper chat conversation logic. Currently:

- Message is sent once and input cleared
- No conversation history
- No proper streaming/loading states
- Limited message management

## AI SDK v5 Architecture

The AI SDK v5 uses a clean separation of concerns:

1. **Runtime Provider**: `AssistantRuntimeProvider` + `useChatRuntime()`
2. **Message Management**: Built-in message history and state
3. **Streaming**: Native streaming support with proper loading states
4. **Components**: Reusable primitives (`ThreadPrimitive`, `ComposerPrimitive`, etc.)

## Implementation Strategy

### Option 1: Integrate Assistant-UI (Recommended)

```tsx
'use client';

import { Thread } from '@/components/assistant-ui/thread';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { useChatRuntime } from '@assistant-ui/react-ai-sdk';
import { useState } from 'react';
import AgentHeading from '@/components/atom/agent-heading';

export default function LeadsPrompt({ onLeadsCreated }: LeadsPromptProps) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const runtime = useChatRuntime({
    api: '/api/leads/chat', // Your custom API endpoint
    onStart: () => setHasInteracted(true),
  });

  return (
    <section className="h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <div className="flex-1 flex flex-col items-center justify-center container max-w-4xl px-4 mx-auto">

        {/* Keep your beautiful heading */}
        {!hasInteracted && (
          <AgentHeading
            title="Lead Agent"
            scrollTarget="leads-content"
            scrollText="explore existing leads"
          />
        )}

        {/* Replace your custom chat logic with Assistant-UI */}
        <div className="w-full max-w-3xl flex-1">
          <AssistantRuntimeProvider runtime={runtime}>
            <Thread />
          </AssistantRuntimeProvider>
        </div>

      </div>
    </section>
  );
}
```

### Option 2: Custom Chat Implementation

If you prefer to keep your current UI, here's how to add proper chat logic:

```tsx
'use client';

import { useState, useCallback } from 'react';
import { useChat } from 'ai/react';
import { AIResponseDisplay } from '@/components/atom/ai-response-display';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function LeadsPrompt({ onLeadsCreated }: LeadsPromptProps) {
  const [hasInteracted, setHasInteracted] = useState(false);

  // Use AI SDK's useChat hook
  const {
    messages,
    input,
    setInput,
    handleSubmit: aiHandleSubmit,
    isLoading,
    error,
  } = useChat({
    api: '/api/leads/chat',
    onFinish: (message) => {
      // Handle lead extraction results from AI response
      handleLeadExtractionResponse(message.content);
    },
  });

  const handleSubmit = useCallback((message: PromptInputMessage) => {
    if (!message.text?.trim()) return;

    setHasInteracted(true);
    setInput(message.text);

    // Submit to AI
    aiHandleSubmit(new Event('submit') as any);

    // Clear the input after submitting
    setTimeout(() => setInput(''), 100);
  }, [aiHandleSubmit, setInput]);

  const handleLeadExtractionResponse = (aiResponse: string) => {
    // Parse AI response and extract leads
    // Call your existing extraction logic
    // Update onLeadsCreated callback
  };

  return (
    <section className="h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <div className="flex-1 flex flex-col items-center justify-center container max-w-4xl px-4 mx-auto">

        {/* Keep your heading */}
        {!hasInteracted && (
          <AgentHeading
            title="Lead Agent"
            scrollTarget="leads-content"
            scrollText="explore existing leads"
          />
        )}

        {/* Chat Messages Display */}
        {hasInteracted && (
          <div className="flex-1 w-full max-w-3xl overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="mb-4">
                {message.role === 'user' ? (
                  <div className="bg-muted rounded-3xl px-5 py-2.5 ml-auto max-w-[80%]">
                    {message.content}
                  </div>
                ) : (
                  <AIResponseDisplay
                    response={message.content}
                    isStreaming={isLoading && message.id === messages[messages.length - 1]?.id}
                  />
                )}
              </div>
            ))}

            {error && (
              <div className="text-red-500 p-4 rounded-lg bg-red-50">
                Error: {error.message}
              </div>
            )}
          </div>
        )}

        {/* Keep your existing PromptInput */}
        <div className="w-full max-w-3xl">
          <PromptInput
            onSubmit={handleSubmit}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            // ... rest of your props
          />
        </div>

      </div>
    </section>
  );
}
```

## Required API Endpoint

Create `/api/leads/chat/route.ts`:

```tsx
import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(messages),
    system: `You are a lead extraction assistant. When users provide text or describe their target audience, extract potential leads and format them as structured data. Always respond with actionable lead information.`,
    tools: {
      extractLeads: {
        description: 'Extract leads from provided text',
        parameters: {
          type: 'object',
          properties: {
            leads: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  company: { type: 'string' },
                  score: { type: 'number' }
                }
              }
            }
          }
        },
        execute: async ({ leads }) => {
          // Your existing lead creation logic here
          const { createLead } = await import('@/components/leads/action');

          const results = await Promise.all(
            leads.map(lead => createLead({
              ...lead,
              status: 'NEW',
              source: 'AI_CHAT'
            }))
          );

          return { created: results.length, leads };
        }
      }
    }
  });

  return result.toUIMessageStreamResponse();
}
```

## Key Benefits

### Option 1 (Assistant-UI):
- ✅ Full conversation history
- ✅ Built-in streaming
- ✅ Message editing/branching
- ✅ Proper loading states
- ✅ Error handling
- ✅ Mobile responsive

### Option 2 (Custom):
- ✅ Keep existing UI design
- ✅ Full control over styling
- ✅ Easy integration with current logic
- ✅ Gradual migration path

## Migration Steps

1. **Phase 1**: Add conversation history with Option 2
2. **Phase 2**: Implement proper streaming
3. **Phase 3**: Add message persistence
4. **Phase 4**: Consider migrating to Assistant-UI for advanced features

## UI Enhancements

### Message Bubble Styling
```css
/* User messages */
.user-message {
  @apply bg-muted text-foreground rounded-3xl px-5 py-2.5 ml-auto max-w-[80%];
}

/* Assistant messages */
.assistant-message {
  @apply text-foreground max-w-[80%] break-words leading-7;
}

/* Chat container */
.chat-container {
  @apply flex-1 w-full overflow-y-auto space-y-4 px-4;
}
```

### Compact Mode
```tsx
const [isCompact, setIsCompact] = useState(false);

// In your JSX
<div className={cn(
  "transition-all duration-300",
  isCompact ? "h-14" : "min-h-[200px]"
)}>
  {/* Chat content */}
</div>
```

## Best Practices

1. **Message Management**: Keep messages in state with proper typing
2. **Streaming**: Show loading indicators during AI responses
3. **Error Handling**: Display errors gracefully
4. **Input Clearing**: Clear input after successful submission
5. **Scroll Management**: Auto-scroll to latest messages
6. **Responsive Design**: Ensure mobile compatibility
7. **Accessibility**: Proper ARIA labels and keyboard navigation

## Integration with Existing Features

Your current features can be preserved:
- Model selection (Groq/Claude)
- File uploads for CSV import
- Lead scoring and enrichment
- Real-time table updates
- Success notifications

The chat interface will enhance the user experience while maintaining all existing functionality.