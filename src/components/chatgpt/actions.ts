/**
 * Server actions for ChatGPT component
 * Provides comprehensive server-side functions for AI chat operations
 * Following component-driven modularity and mirror-pattern architecture
 */

'use server';

import { currentUser } from "@/lib/auth";
import { CoreMessage } from 'ai';

// =========================
// CONFIGURATION
// =========================

// Model configurations with provider grouping
export const AVAILABLE_MODELS = {
  groq: [
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", description: "Most capable Llama model" },
    { id: "llama-3.2-90b-text-preview", name: "Llama 3.2 90B", description: "Large text model" },
    { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", description: "Mixture of experts model" },
    { id: "gemma2-9b-it", name: "Gemma 2 9B", description: "Google's efficient model" },
  ],
  claude: [
    { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", description: "Most capable Claude model" },
    { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", description: "Fast and efficient" },
    { id: "claude-3-opus-20240229", name: "Claude 3 Opus", description: "Previous generation flagship" },
  ],
} as const;

// System prompts for different conversation modes
export const SYSTEM_PROMPTS = {
  default: `You are a helpful AI assistant. You provide clear, accurate, and concise responses.
Be friendly and professional. If you're not sure about something, say so.`,

  coding: `You are an expert programming assistant. You help with code, debugging, and technical questions.
Provide clean, well-commented code examples when appropriate. Follow best practices and explain your solutions.`,

  creative: `You are a creative writing assistant. Help with storytelling, content creation, and creative projects.
Be imaginative and engaging while maintaining coherence and quality.`,

  business: `You are a business consultant assistant. Help with strategy, analysis, and professional communication.
Provide actionable insights and maintain a professional tone. Focus on practical solutions.`,

  academic: `You are an academic assistant. Help with research, analysis, and scholarly writing.
Provide well-reasoned arguments with proper citations when applicable. Maintain academic rigor.`,
} as const;

export type SystemPromptType = keyof typeof SYSTEM_PROMPTS;
export type ModelProvider = keyof typeof AVAILABLE_MODELS;

// Chat configuration interface
export interface ChatConfig {
  model?: string;
  systemPromptType?: SystemPromptType;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

// Chat response interface
export interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  streamUrl?: string;
  conversationId?: string;
}

// =========================
// CORE API INTERACTION
// =========================

/**
 * Call the chat API route directly
 * This is the main function that interacts with the /api/chat endpoint
 */
export async function callChatAPI({
  messages,
  model = "llama-3.3-70b-versatile",
  systemPromptType = "default",
  stream = true,
}: {
  messages: CoreMessage[];
  model?: string;
  systemPromptType?: SystemPromptType;
  stream?: boolean;
}): Promise<ChatResponse> {
  console.log("[Action: callChatAPI] Starting API call");
  console.log("[Action: callChatAPI] Config:", {
    model,
    systemPromptType,
    stream,
    messageCount: messages.length
  });

  try {
    // Get the current user for authentication context
    const user = await currentUser();
    console.log(`[Action: callChatAPI] User context: ${user ? user.name : 'anonymous'}`);

    // Validate input messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("[Action: callChatAPI] Invalid messages format");
      throw new Error("Messages must be a non-empty array");
    }

    // Prepare the request body
    const requestBody = {
      messages,
      model,
      systemPrompt: SYSTEM_PROMPTS[systemPromptType],
      stream,
    };

    console.log("[Action: callChatAPI] Request body prepared:", {
      hasMessages: true,
      messageCount: messages.length,
      firstMessage: messages[0]?.content?.substring(0, 50) + '...',
      model,
      stream,
    });

    // Make the API call
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log("[Action: callChatAPI] Response status:", response.status);
    console.log("[Action: callChatAPI] Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Action: callChatAPI] API error:", errorText);
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }

    if (stream) {
      // For streaming responses, return the stream URL
      console.log("[Action: callChatAPI] Streaming response initiated");
      return {
        success: true,
        streamUrl: '/api/chat',
        conversationId: `conv_${Date.now()}`,
      };
    } else {
      // For non-streaming, parse the response
      const data = await response.json();
      console.log("[Action: callChatAPI] Response data:", {
        hasResponse: !!data.response,
        responseLength: data.response?.length,
      });

      return {
        success: true,
        response: data.response,
        usage: data.usage,
        conversationId: `conv_${Date.now()}`,
      };
    }
  } catch (error) {
    console.error("[Action: callChatAPI] Error caught:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// =========================
// HIGH-LEVEL ACTIONS
// =========================

/**
 * Send a message and get a response
 * High-level action that handles the full conversation flow
 */
export async function sendMessage({
  message,
  history = [],
  config = {},
}: {
  message: string;
  history?: CoreMessage[];
  config?: ChatConfig;
}): Promise<ChatResponse> {
  console.log("[Action: sendMessage] Processing message");
  console.log("[Action: sendMessage] Message:", message.substring(0, 100) + '...');
  console.log("[Action: sendMessage] History length:", history.length);
  console.log("[Action: sendMessage] Config:", config);

  try {
    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.error("[Action: sendMessage] Invalid message");
      throw new Error("Message must be a non-empty string");
    }

    // Build the messages array
    const messages: CoreMessage[] = [
      ...history,
      { role: "user", content: message },
    ];

    console.log("[Action: sendMessage] Total messages to send:", messages.length);

    // Call the API
    const result = await callChatAPI({
      messages,
      model: config.model,
      systemPromptType: config.systemPromptType as SystemPromptType,
      stream: config.stream ?? true,
    });

    console.log("[Action: sendMessage] Result:", {
      success: result.success,
      hasResponse: !!result.response,
      hasStreamUrl: !!result.streamUrl,
      error: result.error,
    });

    return result;
  } catch (error) {
    console.error("[Action: sendMessage] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    };
  }
}

/**
 * Continue a conversation with streaming
 * Optimized for real-time chat interactions
 */
export async function continueConversation({
  messages,
  config = {},
}: {
  messages: CoreMessage[];
  config?: ChatConfig;
}): Promise<ChatResponse> {
  console.log("[Action: continueConversation] Starting conversation continuation");
  console.log("[Action: continueConversation] Messages count:", messages.length);
  console.log("[Action: continueConversation] Last message:",
    messages[messages.length - 1]?.content?.substring(0, 100) + '...'
  );

  try {
    const result = await callChatAPI({
      messages,
      model: config.model,
      systemPromptType: config.systemPromptType as SystemPromptType,
      stream: true, // Always stream for conversations
    });

    console.log("[Action: continueConversation] Conversation result:", {
      success: result.success,
      conversationId: result.conversationId,
    });

    return result;
  } catch (error) {
    console.error("[Action: continueConversation] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to continue conversation',
    };
  }
}

// =========================
// MODEL & CONFIG UTILITIES
// =========================

/**
 * Get available models based on configured API keys
 * Returns models that can actually be used
 */
export async function getAvailableModels() {
  console.log("[Action: getAvailableModels] Checking available models");

  const models: Array<{
    id: string;
    name: string;
    description: string;
    provider: string;
    available: boolean;
  }> = [];

  // Check Groq availability
  const hasGroq = !!process.env.GROQ_API_KEY;
  console.log(`[Action: getAvailableModels] Groq available: ${hasGroq}`);

  if (hasGroq) {
    AVAILABLE_MODELS.groq.forEach(model => {
      models.push({
        ...model,
        provider: 'groq',
        available: true,
      });
    });
  }

  // Check Claude availability
  const hasClaude = !!process.env.ANTHROPIC_API_KEY;
  console.log(`[Action: getAvailableModels] Claude available: ${hasClaude}`);

  if (hasClaude) {
    AVAILABLE_MODELS.claude.forEach(model => {
      models.push({
        ...model,
        provider: 'claude',
        available: true,
      });
    });
  }

  console.log(`[Action: getAvailableModels] Total available models: ${models.length}`);
  return models;
}

/**
 * Validate model availability
 * Check if a specific model can be used
 */
export async function validateModel(modelId: string): Promise<boolean> {
  console.log(`[Action: validateModel] Checking model: ${modelId}`);

  const models = await getAvailableModels();
  const isAvailable = models.some(m => m.id === modelId);

  console.log(`[Action: validateModel] Model ${modelId} available: ${isAvailable}`);
  return isAvailable;
}

// =========================
// CONVERSATION MANAGEMENT
// =========================

/**
 * Create a new conversation
 * Initialize a new chat session
 */
export async function createConversation({
  title = "New Conversation",
  systemPromptType = "default",
}: {
  title?: string;
  systemPromptType?: SystemPromptType;
} = {}): Promise<{
  success: boolean;
  conversationId?: string;
  error?: string;
}> {
  console.log("[Action: createConversation] Creating new conversation");
  console.log("[Action: createConversation] Title:", title);
  console.log("[Action: createConversation] System prompt type:", systemPromptType);

  try {
    const user = await currentUser();
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In a real implementation, save to database here
    console.log(`[Action: createConversation] Created conversation: ${conversationId}`);
    console.log(`[Action: createConversation] User: ${user?.name || 'anonymous'}`);

    return {
      success: true,
      conversationId,
    };
  } catch (error) {
    console.error("[Action: createConversation] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create conversation',
    };
  }
}

/**
 * Clear conversation history
 * Reset the current chat session
 */
export async function clearConversation(conversationId?: string): Promise<{
  success: boolean;
  error?: string;
}> {
  console.log(`[Action: clearConversation] Clearing conversation: ${conversationId || 'current'}`);

  try {
    const user = await currentUser();
    console.log(`[Action: clearConversation] User: ${user?.name || 'anonymous'}`);

    // In a real implementation, clear from database here
    console.log("[Action: clearConversation] Conversation cleared successfully");

    return { success: true };
  } catch (error) {
    console.error("[Action: clearConversation] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear conversation',
    };
  }
}

// =========================
// ERROR RECOVERY
// =========================

/**
 * Retry a failed message
 * Attempt to resend a message that failed
 */
export async function retryMessage({
  message,
  history,
  config,
  attemptNumber = 1,
}: {
  message: string;
  history?: CoreMessage[];
  config?: ChatConfig;
  attemptNumber?: number;
}): Promise<ChatResponse> {
  console.log(`[Action: retryMessage] Retry attempt ${attemptNumber}`);
  console.log("[Action: retryMessage] Message:", message.substring(0, 100) + '...');

  const maxRetries = 3;

  if (attemptNumber > maxRetries) {
    console.error(`[Action: retryMessage] Max retries (${maxRetries}) exceeded`);
    return {
      success: false,
      error: `Failed after ${maxRetries} attempts. Please try again later.`,
    };
  }

  // Add exponential backoff
  const delay = Math.min(1000 * Math.pow(2, attemptNumber - 1), 5000);
  console.log(`[Action: retryMessage] Waiting ${delay}ms before retry`);

  await new Promise(resolve => setTimeout(resolve, delay));

  try {
    const result = await sendMessage({ message, history, config });

    if (!result.success && attemptNumber < maxRetries) {
      console.log("[Action: retryMessage] Attempt failed, retrying...");
      return retryMessage({
        message,
        history,
        config,
        attemptNumber: attemptNumber + 1,
      });
    }

    return result;
  } catch (error) {
    console.error(`[Action: retryMessage] Error on attempt ${attemptNumber}:`, error);

    if (attemptNumber < maxRetries) {
      return retryMessage({
        message,
        history,
        config,
        attemptNumber: attemptNumber + 1,
      });
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Retry failed',
    };
  }
}

// =========================
// HEALTH CHECK
// =========================

/**
 * Check API health and configuration
 * Verify that the chat system is properly configured
 */
export async function checkHealth(): Promise<{
  healthy: boolean;
  groqConfigured: boolean;
  claudeConfigured: boolean;
  apiEndpoint: string;
  errors: string[];
}> {
  console.log("[Action: checkHealth] Running health check");

  const errors: string[] = [];
  const groqConfigured = !!process.env.GROQ_API_KEY;
  const claudeConfigured = !!process.env.ANTHROPIC_API_KEY;
  const apiEndpoint = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/chat`;

  console.log("[Action: checkHealth] Configuration status:");
  console.log(`  - Groq: ${groqConfigured}`);
  console.log(`  - Claude: ${claudeConfigured}`);
  console.log(`  - API Endpoint: ${apiEndpoint}`);

  if (!groqConfigured && !claudeConfigured) {
    errors.push("No AI provider API keys configured");
  }

  if (!process.env.NEXTAUTH_URL && typeof window === 'undefined') {
    console.warn("[Action: checkHealth] NEXTAUTH_URL not set, using localhost:3000");
  }

  // Try a test request
  try {
    const testResponse = await sendMessage({
      message: "Hello",
      config: { model: groqConfigured ? "llama-3.3-70b-versatile" : "claude-3-5-haiku-20241022" },
    });

    if (!testResponse.success) {
      errors.push(`API test failed: ${testResponse.error}`);
    } else {
      console.log("[Action: checkHealth] API test successful");
    }
  } catch (error) {
    errors.push(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const healthy = errors.length === 0;
  console.log(`[Action: checkHealth] System healthy: ${healthy}`);

  if (errors.length > 0) {
    console.error("[Action: checkHealth] Errors found:", errors);
  }

  return {
    healthy,
    groqConfigured,
    claudeConfigured,
    apiEndpoint,
    errors,
  };
}

// =========================
// EXPORT SUMMARY
// =========================

console.log("[ChatGPT Actions] Module loaded successfully");
console.log("[ChatGPT Actions] Available functions:");
console.log("  - callChatAPI: Direct API interaction");
console.log("  - sendMessage: Send a single message");
console.log("  - continueConversation: Continue streaming chat");
console.log("  - getAvailableModels: List available AI models");
console.log("  - validateModel: Check model availability");
console.log("  - createConversation: Start new chat session");
console.log("  - clearConversation: Reset chat history");
console.log("  - retryMessage: Retry failed messages");
console.log("  - checkHealth: System health check");