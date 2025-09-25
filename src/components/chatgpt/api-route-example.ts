// Example API Route for Vercel AI SDK v5 with Multiple Providers
// Copy this to: src/app/api/chat/route.ts

import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { currentUser } from "@/lib/auth";

// Model configurations with their providers
const MODEL_PROVIDERS = {
  // Groq models
  "llama-3.3-70b-versatile": "groq",
  "llama-3.2-90b-text-preview": "groq",
  "mixtral-8x7b-32768": "groq",
  "gemma2-9b-it": "groq",

  // Claude models (Anthropic)
  "claude-3-5-sonnet-20241022": "anthropic",
  "claude-3-5-haiku-20241022": "anthropic",
  "claude-3-opus-20240229": "anthropic",

  // OpenAI models
  "gpt-4o": "openai",
  "gpt-4o-mini": "openai",
  "gpt-4-turbo": "openai",
  "gpt-3.5-turbo": "openai",
} as const;

type ModelName = keyof typeof MODEL_PROVIDERS;

// System prompts for different use cases
const SYSTEM_PROMPTS = {
  default: `You are a helpful AI assistant. You provide clear, accurate, and concise responses.
Be friendly and professional. If you're not sure about something, say so.`,

  coding: `You are an expert programming assistant. You help with code, debugging, and technical questions.
Provide clean, well-commented code examples when appropriate. Follow best practices.`,

  creative: `You are a creative writing assistant. Help with storytelling, content creation, and creative projects.
Be imaginative and engaging while maintaining coherence.`,
};

// Get the appropriate AI model based on the model name
function getModel(modelName: string) {
  // Check if model is in our configuration
  const provider = MODEL_PROVIDERS[modelName as ModelName];

  if (!provider) {
    // If model not found, try to infer provider from name
    if (modelName.startsWith("claude")) {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY not configured. Add it to your .env file.");
      }
      return anthropic(modelName);
    }

    if (modelName.startsWith("gpt")) {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY not configured. Add it to your .env file.");
      }
      return openai(modelName);
    }

    // Default to Groq for unknown models
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY not configured. Add it to your .env file.");
    }
    return groq(modelName);
  }

  // Use configured provider
  switch (provider) {
    case "anthropic":
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY not configured. Add it to your .env file.");
      }
      return anthropic(modelName);

    case "openai":
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY not configured. Add it to your .env file.");
      }
      return openai(modelName);

    case "groq":
    default:
      if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY not configured. Add it to your .env file.");
      }
      return groq(modelName);
  }
}

export async function POST(request: Request) {
  try {
    // Optional: Check authentication
    const user = await currentUser();

    // Parse request body
    const {
      messages,
      model = "llama-3.3-70b-versatile",
      systemPromptType = "default",
      temperature = 0.7,
      maxTokens = 2048,
    } = await request.json();

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 });
    }

    // Get system prompt
    const systemPrompt = SYSTEM_PROMPTS[systemPromptType as keyof typeof SYSTEM_PROMPTS]
      || SYSTEM_PROMPTS.default;

    console.log(`[Chat API] Using model: ${model}, Provider: ${MODEL_PROVIDERS[model as ModelName] || 'auto-detect'}`);

    // Stream the response
    const result = await streamText({
      model: getModel(model),
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature,
      maxTokens,

      // Optional: Add tools/functions
      tools: {
        // Weather tool example
        getWeather: {
          description: "Get the current weather for a location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and country, e.g. San Francisco, USA",
              },
              unit: {
                type: "string",
                enum: ["celsius", "fahrenheit"],
                description: "The temperature unit",
              },
            },
            required: ["location"],
          },
          execute: async ({ location, unit = "celsius" }) => {
            // Mock implementation - replace with actual weather API
            console.log(`[Weather Tool] Getting weather for ${location}`);
            return {
              location,
              temperature: unit === "celsius" ? 22 : 72,
              unit,
              condition: "Partly cloudy",
              humidity: 65,
              windSpeed: 15,
            };
          },
        },

        // Calculator tool example
        calculate: {
          description: "Perform mathematical calculations",
          parameters: {
            type: "object",
            properties: {
              expression: {
                type: "string",
                description: "Mathematical expression to evaluate",
              },
            },
            required: ["expression"],
          },
          execute: async ({ expression }) => {
            try {
              // Use a safe math evaluator in production
              const result = Function('"use strict"; return (' + expression + ')')();
              console.log(`[Calculator Tool] ${expression} = ${result}`);
              return { expression, result };
            } catch (error) {
              return { error: "Invalid expression" };
            }
          },
        },

        // Code executor tool example (mock)
        runCode: {
          description: "Execute code snippets (simulated)",
          parameters: {
            type: "object",
            properties: {
              language: {
                type: "string",
                enum: ["javascript", "python", "bash"],
                description: "Programming language",
              },
              code: {
                type: "string",
                description: "Code to execute",
              },
            },
            required: ["language", "code"],
          },
          execute: async ({ language, code }) => {
            console.log(`[Code Tool] Simulating ${language} execution`);
            // This is a mock - in production, use a sandboxed executor
            return {
              language,
              output: `[Simulated output of ${language} code]`,
              exitCode: 0,
            };
          },
        },
      },

      // Track usage if user is authenticated
      metadata: user ? {
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString(),
      } : undefined,

      // Optional: Set up callbacks for monitoring
      onFinish: async (result) => {
        console.log(`[Chat API] Completed. Tokens used: ${result.usage?.totalTokens}`);

        // Optional: Save to database for history
        if (user) {
          // await saveConversation(user.id, messages, result);
        }
      },
    });

    // Return the streaming response
    return result.toDataStreamResponse({
      headers: {
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        // Optional: Add CORS headers if needed
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });

  } catch (error) {
    console.error("[Chat API] Error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      // Rate limiting
      if (error.message.includes("rate limit")) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded",
            message: "Please try again later."
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      // API key issues
      if (error.message.includes("API key") || error.message.includes("API_KEY")) {
        return new Response(
          JSON.stringify({
            error: "Configuration error",
            message: error.message,
            help: "Please check your environment variables in .env file"
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      // Model not found
      if (error.message.includes("model")) {
        return new Response(
          JSON.stringify({
            error: "Invalid model",
            message: "The requested model is not available.",
            availableModels: Object.keys(MODEL_PROVIDERS)
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }

    // Generic error response
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "An unexpected error occurred while processing your request."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

// Optional: Handle OPTIONS for CORS preflight
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}