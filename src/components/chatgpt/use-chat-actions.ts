/**
 * Client-side hook for using chat actions
 * Provides a React hook interface to the server actions
 * Following component-driven modularity pattern
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { CoreMessage } from 'ai';
import {
  sendMessage,
  continueConversation,
  getAvailableModels,
  createConversation,
  clearConversation,
  retryMessage,
  checkHealth,
  type ChatConfig,
  type ChatResponse,
  type SystemPromptType,
} from './actions';

// Hook state interface
interface UseChatActionsState {
  messages: CoreMessage[];
  isLoading: boolean;
  error: string | null;
  conversationId: string | null;
  models: Array<{
    id: string;
    name: string;
    description: string;
    provider: string;
    available: boolean;
  }>;
  healthStatus: {
    healthy: boolean;
    groqConfigured: boolean;
    claudeConfigured: boolean;
    errors: string[];
  } | null;
}

// Hook return interface
interface UseChatActionsReturn extends UseChatActionsState {
  // Core functions
  sendMessage: (message: string, config?: ChatConfig) => Promise<void>;
  continueChat: (message: string, config?: ChatConfig) => Promise<void>;
  retry: () => Promise<void>;
  clear: () => Promise<void>;

  // Utility functions
  loadModels: () => Promise<void>;
  checkHealth: () => Promise<void>;
  createNewConversation: (title?: string, systemPromptType?: SystemPromptType) => Promise<void>;

  // State setters
  setMessages: (messages: CoreMessage[]) => void;
  addMessage: (message: CoreMessage) => void;
}

/**
 * Custom hook for chat actions
 * Manages chat state and provides methods for interaction
 */
export function useChatActions(initialConfig?: ChatConfig): UseChatActionsReturn {
  // State management
  const [state, setState] = useState<UseChatActionsState>({
    messages: [],
    isLoading: false,
    error: null,
    conversationId: null,
    models: [],
    healthStatus: null,
  });

  // Refs for retry functionality
  const lastMessageRef = useRef<string>('');
  const lastConfigRef = useRef<ChatConfig | undefined>(initialConfig);

  // Log state changes in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[useChatActions] State updated:', {
        messageCount: state.messages.length,
        isLoading: state.isLoading,
        hasError: !!state.error,
        conversationId: state.conversationId,
      });
    }
  }, [state]);

  // Load available models on mount
  useEffect(() => {
    loadModels();
  }, []);

  /**
   * Load available AI models
   */
  const loadModels = useCallback(async () => {
    console.log('[useChatActions] Loading available models');
    try {
      const models = await getAvailableModels();
      console.log(`[useChatActions] Loaded ${models.length} models`);

      setState(prev => ({
        ...prev,
        models,
      }));
    } catch (error) {
      console.error('[useChatActions] Failed to load models:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load available models',
      }));
    }
  }, []);

  /**
   * Check system health
   */
  const checkHealthStatus = useCallback(async () => {
    console.log('[useChatActions] Checking system health');
    try {
      const health = await checkHealth();
      console.log('[useChatActions] Health status:', health);

      setState(prev => ({
        ...prev,
        healthStatus: health,
        error: health.healthy ? null : health.errors.join(', '),
      }));
    } catch (error) {
      console.error('[useChatActions] Health check failed:', error);
      setState(prev => ({
        ...prev,
        error: 'Health check failed',
      }));
    }
  }, []);

  /**
   * Send a message and handle the response
   */
  const sendUserMessage = useCallback(async (
    message: string,
    config?: ChatConfig
  ) => {
    console.log('[useChatActions] Sending message:', message.substring(0, 50) + '...');
    console.log('[useChatActions] Config:', config);

    // Store for retry
    lastMessageRef.current = message;
    lastConfigRef.current = config;

    // Clear error and set loading
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    // Add user message to state
    const userMessage: CoreMessage = { role: 'user', content: message };
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    try {
      const response = await sendMessage({
        message,
        history: state.messages,
        config: config || initialConfig,
      });

      console.log('[useChatActions] Response received:', {
        success: response.success,
        hasResponse: !!response.response,
        hasStreamUrl: !!response.streamUrl,
      });

      if (response.success) {
        // Add assistant response to state
        if (response.response) {
          const assistantMessage: CoreMessage = {
            role: 'assistant',
            content: response.response,
          };

          setState(prev => ({
            ...prev,
            messages: [...prev.messages, assistantMessage],
            isLoading: false,
            conversationId: response.conversationId || prev.conversationId,
          }));
        } else if (response.streamUrl) {
          // Handle streaming response
          console.log('[useChatActions] Streaming response from:', response.streamUrl);

          // The assistant-ui library should handle the streaming
          setState(prev => ({
            ...prev,
            isLoading: false,
            conversationId: response.conversationId || prev.conversationId,
          }));
        }
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('[useChatActions] Error sending message:', error);

      // Remove the user message if sending failed
      setState(prev => ({
        ...prev,
        messages: prev.messages.slice(0, -1),
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      }));
    }
  }, [state.messages, initialConfig]);

  /**
   * Continue a conversation with a new message
   */
  const continueChat = useCallback(async (
    message: string,
    config?: ChatConfig
  ) => {
    console.log('[useChatActions] Continuing chat with message:', message.substring(0, 50) + '...');

    // Add user message first
    const userMessage: CoreMessage = { role: 'user', content: message };
    const updatedMessages = [...state.messages, userMessage];

    setState(prev => ({
      ...prev,
      messages: updatedMessages,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await continueConversation({
        messages: updatedMessages,
        config: config || initialConfig,
      });

      console.log('[useChatActions] Continue response:', {
        success: response.success,
        conversationId: response.conversationId,
      });

      if (response.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          conversationId: response.conversationId || prev.conversationId,
        }));
      } else {
        throw new Error(response.error || 'Failed to continue conversation');
      }
    } catch (error) {
      console.error('[useChatActions] Error continuing chat:', error);

      // Remove the user message if continuing failed
      setState(prev => ({
        ...prev,
        messages: prev.messages.slice(0, -1),
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to continue conversation',
      }));
    }
  }, [state.messages, initialConfig]);

  /**
   * Retry the last failed message
   */
  const retry = useCallback(async () => {
    console.log('[useChatActions] Retrying last message');

    if (!lastMessageRef.current) {
      console.warn('[useChatActions] No message to retry');
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await retryMessage({
        message: lastMessageRef.current,
        history: state.messages,
        config: lastConfigRef.current || initialConfig,
      });

      console.log('[useChatActions] Retry response:', {
        success: response.success,
      });

      if (response.success && response.response) {
        // Add both user and assistant messages
        const userMessage: CoreMessage = {
          role: 'user',
          content: lastMessageRef.current,
        };
        const assistantMessage: CoreMessage = {
          role: 'assistant',
          content: response.response,
        };

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, userMessage, assistantMessage],
          isLoading: false,
          conversationId: response.conversationId || prev.conversationId,
        }));
      } else {
        throw new Error(response.error || 'Retry failed');
      }
    } catch (error) {
      console.error('[useChatActions] Retry error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Retry failed',
      }));
    }
  }, [state.messages, initialConfig]);

  /**
   * Clear the conversation
   */
  const clear = useCallback(async () => {
    console.log('[useChatActions] Clearing conversation');

    try {
      const response = await clearConversation(state.conversationId || undefined);

      if (response.success) {
        console.log('[useChatActions] Conversation cleared');
        setState(prev => ({
          ...prev,
          messages: [],
          error: null,
          conversationId: null,
        }));

        // Clear retry refs
        lastMessageRef.current = '';
        lastConfigRef.current = undefined;
      } else {
        throw new Error(response.error || 'Failed to clear conversation');
      }
    } catch (error) {
      console.error('[useChatActions] Clear error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to clear conversation',
      }));
    }
  }, [state.conversationId]);

  /**
   * Create a new conversation
   */
  const createNewConversation = useCallback(async (
    title?: string,
    systemPromptType?: SystemPromptType
  ) => {
    console.log('[useChatActions] Creating new conversation:', { title, systemPromptType });

    try {
      const response = await createConversation({
        title,
        systemPromptType,
      });

      if (response.success) {
        console.log('[useChatActions] Conversation created:', response.conversationId);
        setState(prev => ({
          ...prev,
          conversationId: response.conversationId || null,
          messages: [],
          error: null,
        }));
      } else {
        throw new Error(response.error || 'Failed to create conversation');
      }
    } catch (error) {
      console.error('[useChatActions] Create conversation error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create conversation',
      }));
    }
  }, []);

  /**
   * Set messages directly
   */
  const setMessages = useCallback((messages: CoreMessage[]) => {
    console.log('[useChatActions] Setting messages:', messages.length);
    setState(prev => ({
      ...prev,
      messages,
    }));
  }, []);

  /**
   * Add a single message
   */
  const addMessage = useCallback((message: CoreMessage) => {
    console.log('[useChatActions] Adding message:', {
      role: message.role,
      contentLength: message.content?.length,
    });
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }, []);

  return {
    // State
    ...state,

    // Core functions
    sendMessage: sendUserMessage,
    continueChat,
    retry,
    clear,

    // Utility functions
    loadModels,
    checkHealth: checkHealthStatus,
    createNewConversation,

    // State setters
    setMessages,
    addMessage,
  };
}

/**
 * Hook for debugging chat state
 * Provides detailed logging of all chat operations
 */
export function useChatDebug(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    console.log('[Chat Debug] Monitoring enabled');

    // Monitor console for chat-related logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    const chatLogs: string[] = [];
    const maxLogs = 100;

    const captureLog = (type: string, ...args: any[]) => {
      const message = args
        .map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        )
        .join(' ');

      if (message.includes('[Chat') || message.includes('[Action') || message.includes('chat')) {
        chatLogs.push(`[${new Date().toISOString()}] [${type}] ${message}`);

        if (chatLogs.length > maxLogs) {
          chatLogs.shift();
        }

        // Store in session storage for debugging
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('chatDebugLogs', JSON.stringify(chatLogs));
        }
      }
    };

    console.log = function(...args) {
      captureLog('LOG', ...args);
      return originalLog.apply(console, args);
    };

    console.error = function(...args) {
      captureLog('ERROR', ...args);
      return originalError.apply(console, args);
    };

    console.warn = function(...args) {
      captureLog('WARN', ...args);
      return originalWarn.apply(console, args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.log('[Chat Debug] Monitoring disabled');
    };
  }, [enabled]);
}

// Export for convenience
export type { ChatConfig, ChatResponse, SystemPromptType } from './actions';
export { AVAILABLE_MODELS, SYSTEM_PROMPTS } from './actions';