# ISSUE: ChatGPT Component Not Responding

## Problem Description
The ChatGPT interface loads but does not respond to messages. Users can type and send messages, but no AI response is received.

## Root Causes Identified

### 1. Missing Runtime-API Connection
**Issue**: The `DocsRuntimeProvider` is not properly connected to the API endpoint
**Symptom**: Messages sent but no network request to `/api/chat`
**Status**: NEEDS FIX

### 2. Missing Environment Variables
**Issue**: API keys for AI providers not configured
**Symptom**: 500 error responses from `/api/chat`
**Status**: NEEDS CONFIGURATION

### 3. AssistantCloud Authorization
**Issue**: `NEXT_PUBLIC_ASSISTANT_BASE_URL` not set, causing auth errors
**Symptom**: "Authorization failed" error on page load
**Status**: FIXED (made optional in DocsRuntimeProvider)

## Solution Steps

### Step 1: Fix Runtime Provider Connection

The current `DocsRuntimeProvider` needs to connect to your API endpoint:

```typescript
// src/app/[lang]/(blocks)/chatgpt/DocsRuntimeProvider.tsx

"use client";
import { useCurrentUser } from "@/components/auth/use-current-user";
import {
  AssistantRuntimeProvider,
  WebSpeechSynthesisAdapter,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";

export function DocsRuntimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useCurrentUser();

  // Configure the runtime to use your API endpoint
  const runtime = useChatRuntime({
    api: "/api/chat",  // <-- This is the key part
    adapters: {
      speech: new WebSpeechSynthesisAdapter(),
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
```

### Step 2: Configure Environment Variables

Create or update `.env.local`:

```env
# Choose one or more providers
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

### Step 3: Update API Route for Multiple Providers

```typescript
// src/app/api/chat/route.ts

import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";

// Helper to select model based on name
function getModel(modelName: string) {
  // Claude models
  if (modelName.startsWith("claude")) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }
    return anthropic(modelName);
  }

  // OpenAI models
  if (modelName.startsWith("gpt")) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY not configured");
    }
    return openai(modelName);
  }

  // Default to Groq
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured");
  }
  return groq(modelName);
}

export async function POST(request: Request) {
  try {
    const { messages, model = "llama-3.3-70b-versatile" } = await request.json();

    const result = await streamText({
      model: getModel(model),
      messages,
      temperature: 0.7,
      maxTokens: 2048,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 }
    );
  }
}
```

## Verification Steps

### 1. Check Network Requests
Open DevTools > Network tab:
- Send a message
- Look for POST request to `/api/chat`
- Check request payload and response

### 2. Check Console Errors
Open DevTools > Console:
- Look for JavaScript errors
- Check for CORS issues
- Look for runtime initialization errors

### 3. Check Server Logs
In terminal running `pnpm dev`:
- Look for API route errors
- Check for missing environment variables
- Verify model loading

### 4. Test API Directly
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "model": "llama-3.3-70b-versatile"
  }'
```

## Common Error Messages and Fixes

### Error: "Authorization failed"
**Fix**: Already fixed by making AssistantCloud optional

### Error: "API configuration error"
**Fix**: Add missing API keys to `.env.local`

### Error: "Cannot read property 'dataStream' of undefined"
**Fix**: Ensure `useChatRuntime` has `api` parameter set

### Error: "Network request failed"
**Fix**: Check if API route exists and is properly exported

### Error: "Rate limit exceeded"
**Fix**: Check API provider quotas and limits

## Quick Diagnostic Script

Add this to test your setup:

```typescript
// src/app/[lang]/(blocks)/chatgpt/test-api.tsx
"use client";

import { useEffect } from "react";

export function TestAPI() {
  useEffect(() => {
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "test" }],
      }),
    })
      .then(res => res.text())
      .then(data => console.log("API Response:", data))
      .catch(err => console.error("API Error:", err));
  }, []);

  return null;
}
```

## Resolution Checklist

- [ ] Environment variables configured (GROQ_API_KEY, etc.)
- [ ] API route exists at `/api/chat/route.ts`
- [ ] Runtime provider uses `api: "/api/chat"`
- [ ] Model selection logic handles your providers
- [ ] Network requests reach the API endpoint
- [ ] API responds with streaming data
- [ ] No CORS or auth errors in console
- [ ] Messages appear in the chat UI

## Status

**Current State**: Chat UI loads but doesn't connect to API
**Required Action**: Update DocsRuntimeProvider to use API endpoint
**Priority**: HIGH
**Estimated Fix Time**: 5 minutes

## Related Files

- `/src/app/[lang]/(blocks)/chatgpt/DocsRuntimeProvider.tsx` - Runtime configuration
- `/src/app/api/chat/route.ts` - API endpoint
- `/src/components/chatgpt/thread.tsx` - Chat UI components
- `.env.local` - Environment variables

## Support Resources

- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [Assistant UI Docs](https://assistant-ui.com/docs)
- [Groq API Docs](https://console.groq.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com)

## Update Log

- **2024-09-25**: Initial issue documented
- **2024-09-25**: AssistantCloud made optional (auth error fixed)
- **2024-09-25**: Runtime-API connection identified as main issue