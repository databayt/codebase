# ChatGPT Component - Vercel AI SDK v5 Setup

## Overview
This ChatGPT component uses the Vercel AI SDK v5 with assistant-ui/react to create a conversational AI interface. The system supports multiple AI providers including Groq, Claude (Anthropic), and OpenAI.

## Current Architecture

### Components Structure
```
src/components/chatgpt/
├── thread.tsx                 # Main chat thread UI component
├── Shadcn.tsx                 # Layout wrapper with sidebar and header
├── ModelPicker.tsx            # Model selection component
├── thread-list.tsx            # Conversation history list
├── attachment.tsx             # File attachment handling
├── markdown-text.tsx          # Markdown rendering
├── syntax-highlighter.tsx     # Code highlighting
├── tool-fallback.tsx          # Tool execution UI
└── weather-tool.tsx           # Example tool implementation
```

### API Integration
The chat functionality is powered by:
- **API Route**: `/api/chat/route.ts`
- **Runtime Provider**: `DocsRuntimeProvider.tsx`
- **AI SDK**: Vercel AI SDK v5 with streaming support

## Environment Variables Setup

Create or update your `.env` or `.env.local` file with the following:

```env
# Required for AI providers
GROQ_API_KEY=your_groq_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here  # Optional

# Optional - for AssistantCloud features
NEXT_PUBLIC_ASSISTANT_BASE_URL=https://api.assistant-ui.com  # Optional
```

### Getting API Keys
1. **Groq**: Sign up at [console.groq.com](https://console.groq.com) and get your API key
2. **Claude/Anthropic**: Sign up at [console.anthropic.com](https://console.anthropic.com) and get your API key
3. **OpenAI** (Optional): Sign up at [platform.openai.com](https://platform.openai.com) and get your API key

## How the Chat Works

### 1. Client-Side Flow
```typescript
// The chat UI uses assistant-ui/react components
<Thread>                       // Main chat container
  <Messages>                   // Message list
  <Composer>                   // Input field
</Thread>
```

### 2. Runtime Provider
The `DocsRuntimeProvider` sets up the chat runtime:
```typescript
const runtime = useChatRuntime({
  // Connects to your API endpoint
  api: "/api/chat",
  // Handles streaming responses
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
});
```

### 3. API Route (`/api/chat/route.ts`)
The API route handles:
- Message processing
- Model selection
- Streaming responses
- Tool execution
- Error handling

## Available Models

### Groq Models (Default)
- `llama-3.3-70b-versatile` (Default)
- `llama-3.2-90b-text-preview`
- `mixtral-8x7b-32768`
- `gemma2-9b-it`

### Claude Models (Anthropic)
- `claude-3-5-sonnet-20241022`
- `claude-3-5-haiku-20241022`
- `claude-3-opus-20240229`

### OpenAI Models
- `gpt-4o`
- `gpt-4o-mini`
- `gpt-4-turbo`
- `gpt-3.5-turbo`

## Troubleshooting: No Reply Issue

### Common Causes and Solutions

#### 1. Missing API Keys
**Problem**: Chat doesn't respond because API keys are not configured
**Solution**: Add your API keys to `.env` file

#### 2. Wrong API Endpoint
**Problem**: The runtime is not connecting to the correct API endpoint
**Solution**: Ensure the API route exists at `/api/chat/route.ts`

#### 3. CORS Issues
**Problem**: Cross-origin requests being blocked
**Solution**: API routes in Next.js handle CORS automatically

#### 4. Runtime Not Connected
**Problem**: The chat runtime is not properly initialized
**Solution**: Check that `useChatRuntime` is configured correctly

#### 5. AssistantCloud Error
**Problem**: "Authorization failed" error
**Solution**: Either:
- Add `NEXT_PUBLIC_ASSISTANT_BASE_URL` to env
- Or use the updated `DocsRuntimeProvider` that makes it optional

## How to Add Claude Support

To use Claude models, update the API route:

```typescript
// src/app/api/chat/route.ts
import { anthropic } from "@ai-sdk/anthropic";

// In your POST handler
const result = await streamText({
  model: anthropic("claude-3-5-sonnet-20241022"),
  messages: messages,
  // ... rest of config
});
```

## How to Add Multiple Provider Support

```typescript
// src/app/api/chat/route.ts
import { groq } from "@ai-sdk/groq";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";

function getModel(modelName: string) {
  if (modelName.startsWith("claude")) {
    return anthropic(modelName);
  } else if (modelName.startsWith("gpt")) {
    return openai(modelName);
  } else {
    return groq(modelName);
  }
}

// Use in your handler
const result = await streamText({
  model: getModel(model),
  // ... rest of config
});
```

## Testing the Chat

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Navigate to: `http://localhost:3000/en/chatgpt`

3. Check the browser console for errors

4. Check the terminal for server-side errors

## Debug Checklist

- [ ] Environment variables are set correctly
- [ ] API route exists at `/api/chat/route.ts`
- [ ] Runtime provider is using correct endpoint
- [ ] Network tab shows requests to `/api/chat`
- [ ] Console shows no CORS errors
- [ ] API keys have sufficient credits/quota

## Example Test Message

Try sending: "Hello, can you help me with coding?"

If no response:
1. Check browser DevTools Network tab
2. Look for `/api/chat` request
3. Check response status and payload
4. Check server terminal for errors

## Support

For issues with:
- **assistant-ui**: Check [assistant-ui docs](https://assistant-ui.com)
- **Vercel AI SDK**: Check [AI SDK docs](https://sdk.vercel.ai)
- **This implementation**: See ISSUE.md for common problems