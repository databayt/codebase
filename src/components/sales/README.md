# ChatGPT Component - Vercel AI SDK v5 Setup

## Overview
This ChatGPT component uses the Vercel AI SDK v5 with assistant-ui/react to create a conversational AI interface. The system supports multiple AI providers including Groq and Claude (Anthropic).

**Status**: ✅ **FULLY WORKING** (Last updated: 2025-09-25)

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
# Required for AI providers (at least one)
GROQ_API_KEY=your_groq_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Getting API Keys
1. **Groq**: Sign up at [console.groq.com](https://console.groq.com) and get your API key
2. **Claude/Anthropic**: Sign up at [console.anthropic.com](https://console.anthropic.com) and get your API key

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
  api: "/api/chat",
  body: {
    model: selectedModel,  // Dynamically selected from ModelPicker
  },
  onError: (error: any) => {
    console.error("Chat error:", error);
  },
});
```

### 3. API Route (`/api/chat/route.ts`)
The API route handles:
- Message processing with `convertToModelMessages()`
- Model selection (Groq/Claude)
- Streaming responses via `toUIMessageStreamResponse()`
- Tool execution (weather, calculator examples)
- Error handling with proper status codes

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


## Troubleshooting

### ✅ RESOLVED ISSUES (2025-09-25)

All major issues have been fixed. The chat is now fully functional with:
- Proper API connection via `useChatRuntime`
- Correct message format conversion with `convertToModelMessages()`
- Streaming responses using `toUIMessageStreamResponse()`
- Dynamic model selection stored in localStorage
- Support for both Groq and Claude models

### If Chat Still Not Working

1. **Check Environment Variables**
   - Ensure at least one API key is set (GROQ_API_KEY or ANTHROPIC_API_KEY)
   - Restart dev server after adding keys

2. **Verify API Route**
   - File exists at `/api/chat/route.ts`
   - Returns `toUIMessageStreamResponse()` not `toTextStreamResponse()`

3. **Check Browser Console**
   - Look for network errors
   - Verify requests to `/api/chat` are being made

## Current Implementation

The chat already supports both Groq and Claude models. The API route automatically selects the provider based on the model name:

```typescript
// src/app/api/chat/route.ts
function getModel(modelName: string) {
  // Claude models
  if (modelName.startsWith("claude")) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }
    return anthropic(modelName);
  }

  // Default to Groq
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured");
  }
  return groq(modelName);
}
```

## Testing the Chat

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Navigate to: `http://localhost:3000/en/chatgpt`

3. Check the browser console for errors

4. Check the terminal for server-side errors

## Quick Checklist

- [x] Environment variables are set correctly
- [x] API route exists at `/api/chat/route.ts`
- [x] Runtime provider is using correct endpoint
- [x] Network tab shows requests to `/api/chat`
- [x] Messages are properly formatted with `convertToModelMessages()`
- [x] Response uses `toUIMessageStreamResponse()`

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