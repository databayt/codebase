/**
 * Test Chat Component
 * A debug-friendly chat interface for testing the chat system
 * Enable comprehensive logging and health checks
 */

'use client';

import { useState, useEffect } from 'react';
import { useChatActions, useChatDebug } from './use-chat-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, RefreshCw, Trash2, Heart, AlertCircle } from 'lucide-react';

export function TestChat() {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [systemPromptType, setSystemPromptType] = useState<'default' | 'coding' | 'creative' | 'business' | 'academic'>('default');

  // Enable debug logging
  useChatDebug(true);

  // Initialize chat actions
  const {
    messages,
    isLoading,
    error,
    conversationId,
    models,
    healthStatus,
    sendMessage,
    retry,
    clear,
    loadModels,
    checkHealth,
    createNewConversation,
  } = useChatActions({
    model: selectedModel,
    systemPromptType,
  });

  // Run health check on mount
  useEffect(() => {
    console.log('[TestChat] Component mounted, running health check...');
    checkHealth();
  }, []);

  // Log state changes
  useEffect(() => {
    console.log('[TestChat] State changed:', {
      messageCount: messages.length,
      isLoading,
      hasError: !!error,
      conversationId,
      modelCount: models.length,
      healthStatus,
    });
  }, [messages, isLoading, error, conversationId, models, healthStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    console.log('[TestChat] Submitting message:', input);

    await sendMessage(input, {
      model: selectedModel,
      systemPromptType,
    });

    setInput('');
  };

  const handleNewConversation = async () => {
    console.log('[TestChat] Creating new conversation');
    await createNewConversation('Test Conversation', systemPromptType);
  };

  const handleClear = async () => {
    console.log('[TestChat] Clearing conversation');
    await clear();
  };

  const handleRetry = async () => {
    console.log('[TestChat] Retrying last message');
    await retry();
  };

  const handleHealthCheck = async () => {
    console.log('[TestChat] Running health check');
    await checkHealth();
  };

  const testAPIDirectly = async () => {
    console.log('[TestChat] Testing API directly...');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Test message' }],
          model: selectedModel,
        }),
      });

      console.log('[TestChat] API Response status:', response.status);
      console.log('[TestChat] API Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const error = await response.text();
        console.error('[TestChat] API Error:', error);
        alert(`API Error: ${error}`);
      } else {
        // Read streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let result = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value, { stream: true });
          }
        }

        console.log('[TestChat] API Response (first 200 chars):', result.substring(0, 200));
        alert('API test successful! Check console for response.');
      }
    } catch (error) {
      console.error('[TestChat] API test error:', error);
      alert(`API test failed: ${error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Health Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          {healthStatus ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${healthStatus.healthy ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{healthStatus.healthy ? 'Healthy' : 'Issues Detected'}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Groq: {healthStatus.groqConfigured ? '✅ Configured' : '❌ Not configured'}</div>
                <div>Claude: {healthStatus.claudeConfigured ? '✅ Configured' : '❌ Not configured'}</div>
                <div>API Endpoint: {healthStatus.apiEndpoint || 'Unknown'}</div>
                {healthStatus.errors && healthStatus.errors.length > 0 && (
                  <Alert className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {healthStatus.errors.map((err, idx) => (
                        <div key={idx}>{err}</div>
                      ))}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleHealthCheck} size="sm" variant="outline">
                  Recheck Health
                </Button>
                <Button onClick={testAPIDirectly} size="sm" variant="outline">
                  Test API Directly
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={handleHealthCheck} size="sm">
              Check System Health
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Model</label>
            <select
              className="w-full mt-1 p-2 border rounded"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {models.length > 0 ? (
                models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.provider})
                  </option>
                ))
              ) : (
                <option>Loading models...</option>
              )}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">System Prompt Type</label>
            <select
              className="w-full mt-1 p-2 border rounded"
              value={systemPromptType}
              onChange={(e) => setSystemPromptType(e.target.value as any)}
            >
              <option value="default">Default</option>
              <option value="coding">Coding Assistant</option>
              <option value="creative">Creative Writing</option>
              <option value="business">Business Consultant</option>
              <option value="academic">Academic Assistant</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleNewConversation} size="sm" variant="outline">
              New Conversation
            </Button>
            <Button onClick={loadModels} size="sm" variant="outline">
              Reload Models
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Info */}
      {conversationId && (
        <div className="text-sm text-muted-foreground">
          Conversation ID: {conversationId}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button onClick={handleRetry} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Messages Display */}
      <Card className="min-h-[400px]">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Chat Messages</CardTitle>
            <Button onClick={handleClear} size="sm" variant="ghost">
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start a conversation!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary/10 ml-auto max-w-[80%]'
                      : 'bg-muted max-w-[80%]'
                  }`}
                >
                  <div className="text-xs font-medium mb-1 text-muted-foreground">
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Assistant is typing...</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-mono space-y-1">
            <div>Messages: {messages.length}</div>
            <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
            <div>Error: {error || 'None'}</div>
            <div>Available Models: {models.length}</div>
            <div>Selected Model: {selectedModel}</div>
            <div>System Prompt: {systemPromptType}</div>
          </div>
          <div className="mt-4">
            <Button
              onClick={() => {
                const logs = sessionStorage.getItem('chatDebugLogs');
                if (logs) {
                  const parsedLogs = JSON.parse(logs);
                  console.group('📋 Chat Debug Logs');
                  parsedLogs.forEach((log: string) => console.log(log));
                  console.groupEnd();
                  alert(`${parsedLogs.length} logs printed to console. Check DevTools.`);
                } else {
                  alert('No debug logs found in session storage.');
                }
              }}
              size="sm"
              variant="outline"
            >
              Export Debug Logs to Console
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}