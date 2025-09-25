# ChatGPT Integration Guide

## Overview
This guide explains how to integrate the chat actions with the UI components and troubleshoot common issues.

## Architecture Overview

The chat system consists of three main layers:

1. **API Route** (`/api/chat/route.ts`): Handles HTTP requests and streams AI responses
2. **Server Actions** (`actions.ts`): Provides server-side functions with comprehensive logging
3. **Client Hook** (`use-chat-actions.ts`): React hook for managing chat state and UI interaction

## Quick Start Integration

### Option 1: Using the Custom Hook (Recommended for Custom UI)

```tsx
'use client';

import { useChatActions, useChatDebug } from '@/components/chatgpt/use-chat-actions';

export function CustomChatComponent() {
  // Enable debug logging in development
  useChatDebug(process.env.NODE_ENV === 'development');

  // Initialize the chat hook
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clear,
    retry,
    checkHealth,
    models,
  } = useChatActions({
    model: 'llama-3.3-70b-versatile',
    systemPromptType: 'default',
  });

  // Check system health on mount
  useEffect(() => {
    checkHealth();
  }, []);

  const handleSend = async (message: string) => {
    await sendMessage(message);
  };

  return (
    <div>
      {/* Display messages */}
      {messages.map((msg, idx) => (
        <div key={idx} className={msg.role}>
          {msg.content}
        </div>
      ))}

      {/* Error display */}
      {error && (
        <div className="error">
          {error}
          <button onClick={retry}>Retry</button>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.target.message;
        handleSend(input.value);
        input.value = '';
      }}>
        <input name="message" disabled={isLoading} />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}
```

### Option 2: Direct Server Action Usage (For Server Components)

```tsx
import { sendMessage, getAvailableModels } from '@/components/chatgpt/actions';

export default async function ServerChatComponent() {
  // Get available models server-side
  const models = await getAvailableModels();

  // Handle form submission
  async function handleChat(formData: FormData) {
    'use server';

    const message = formData.get('message') as string;
    const result = await sendMessage({
      message,
      config: { model: 'llama-3.3-70b-versatile' }
    });

    if (result.success) {
      console.log('Response:', result.response);
    } else {
      console.error('Error:', result.error);
    }
  }

  return (
    <form action={handleChat}>
      <input name="message" />
      <button type="submit">Send</button>
    </form>
  );
}
```

### Option 3: With Assistant-UI Library (Current Implementation)

The current implementation uses the `assistant-ui` library. To debug issues:

1. **Check the DocsRuntimeProvider configuration:**
```tsx
// In DocsRuntimeProvider.tsx
const runtime = useChatRuntime({
  api: "/api/chat", // Ensure this points to your API route
  // Add debug logging
  onError: (error) => console.error('[Runtime Error]', error),
});
```

2. **Monitor Network Requests:**
- Open DevTools → Network tab
- Look for POST requests to `/api/chat`
- Check request/response payloads

## Debugging Guide

### Enable Comprehensive Logging

1. **Browser Console:**
```javascript
// Run in browser console to see all chat logs
const logs = JSON.parse(sessionStorage.getItem('chatDebugLogs') || '[]');
logs.forEach(log => console.log(log));
```

2. **Server Logs:**
- Check terminal running `pnpm dev`
- Look for logs starting with `[Chat API]`, `[Action:]`, etc.

### Common Issues and Solutions

#### Issue 1: 500 Error from API Route
**Symptoms:** Chat doesn't respond, 500 error in network tab

**Debug Steps:**
1. Check API keys in `.env`:
```bash
grep "GROQ_API_KEY\|ANTHROPIC_API_KEY" .env
```

2. Test API route directly:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"model":"llama-3.3-70b-versatile"}'
```

3. Check server logs for specific error

**Solutions:**
- Ensure API keys are valid
- Check model name is correct
- Verify Node.js runtime is set: `export const runtime = "nodejs"`

#### Issue 2: Messages Not Appearing
**Symptoms:** Send message but no response appears

**Debug Steps:**
1. Check browser console for errors
2. Verify streaming is working:
```javascript
// In your component
console.log('Runtime:', runtime);
console.log('Messages:', messages);
```

3. Check if response is streaming:
- Network tab → look for EventStream response
- Response should have `Transfer-Encoding: chunked`

**Solutions:**
- Ensure `toDataStreamResponse()` is used in API route
- Check that client is handling streaming correctly
- Verify CORS headers if needed

#### Issue 3: Authentication Issues
**Symptoms:** "Not authenticated" errors

**Debug Steps:**
1. Check user session:
```typescript
const user = await currentUser();
console.log('Current user:', user);
```

2. Verify auth middleware configuration

**Solutions:**
- For anonymous chat, remove auth checks
- Ensure session is valid
- Check `NEXTAUTH_URL` in `.env`

### Health Check Function

Run this to verify system configuration:

```typescript
import { checkHealth } from '@/components/chatgpt/actions';

// In your component or page
const health = await checkHealth();
console.log('System Health:', health);

if (!health.healthy) {
  console.error('Issues found:', health.errors);
}
```

## Testing Checklist

- [ ] API keys are configured in `.env`
- [ ] Dev server is running (`pnpm dev`)
- [ ] No permission errors in terminal
- [ ] `/api/chat` route responds to POST requests
- [ ] Browser console shows chat action logs
- [ ] Network tab shows successful API calls
- [ ] Messages appear in UI after sending
- [ ] Error states display correctly
- [ ] Retry functionality works
- [ ] Model selection works (if implemented)

## Advanced Configuration

### Custom System Prompts

```typescript
import { SYSTEM_PROMPTS } from '@/components/chatgpt/actions';

// Use predefined prompts
const chatConfig = {
  systemPromptType: 'coding', // or 'creative', 'business', 'academic'
};

// Or define custom prompt in API route
const customPrompt = "You are a specialized assistant for...";
```

### Model Selection

```typescript
// Get available models
const models = await getAvailableModels();

// Use specific model
const config = {
  model: 'claude-3-5-sonnet-20241022', // or any available model
};
```

### Streaming vs Non-Streaming

```typescript
// For streaming (real-time responses)
const config = {
  stream: true, // Default
};

// For non-streaming (wait for complete response)
const config = {
  stream: false,
};
```

## Performance Optimization

1. **Use streaming for better UX:**
   - Shows response as it's generated
   - Reduces perceived latency

2. **Implement retry with exponential backoff:**
   - Already built into `retryMessage` action
   - Prevents overwhelming the API

3. **Cache models list:**
   - Models are loaded once on mount
   - Reduces unnecessary API calls

4. **Session storage for debug logs:**
   - Logs are stored client-side
   - No performance impact on server

## Next Steps

1. Test the chat with the health check function
2. Monitor console logs for any errors
3. Verify API responses in network tab
4. Customize UI components as needed
5. Add persistence with database if required

For additional help, check:
- Server logs: `[Chat API]` and `[Action:]` prefixed messages
- Browser console: `[useChatActions]` and `[Chat Debug]` messages
- Session storage: `chatDebugLogs` key for historical logs