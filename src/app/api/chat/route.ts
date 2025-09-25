import { streamText, convertToModelMessages } from "ai";
import { groq } from "@ai-sdk/groq";
import { anthropic } from "@ai-sdk/anthropic";
import { currentUser } from "@/lib/auth";

// Force Node.js runtime for auth operations
export const runtime = "nodejs";

// System message for the AI assistant
const SYSTEM_MESSAGE = `You are a helpful AI assistant. You provide clear, accurate, and concise responses.
Be friendly and professional. If you're not sure about something, say so.`;

// Helper to get the model based on selection
function getModel(modelName: string) {
  console.log(`[Chat API] ============================================`);
  console.log(`[Chat API] Requested model: ${modelName}`);
  console.log(`[Chat API] Environment check:`);
  console.log(`[Chat API]   GROQ_API_KEY: ${process.env.GROQ_API_KEY ? 'SET (length: ' + process.env.GROQ_API_KEY.length + ')' : 'NOT SET'}`);
  console.log(`[Chat API]   ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? 'SET (length: ' + process.env.ANTHROPIC_API_KEY.length + ')' : 'NOT SET'}`);
  console.log(`[Chat API] ============================================`);

  // Claude models
  if (modelName.startsWith("claude")) {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error(`[Chat API] ERROR: ANTHROPIC_API_KEY not configured`);
      throw new Error("ANTHROPIC_API_KEY not configured");
    }
    console.log(`[Chat API] Using Claude model: ${modelName}`);
    return anthropic(modelName);
  }

  // Default to Groq
  if (!process.env.GROQ_API_KEY) {
    console.error(`[Chat API] ERROR: GROQ_API_KEY not configured`);
    throw new Error("GROQ_API_KEY not configured");
  }
  console.log(`[Chat API] Using Groq model: ${modelName}`);
  return groq(modelName);
}

export async function POST(request: Request) {
  const startTime = Date.now();
  console.log(`\n[Chat API] ============================================`);
  console.log(`[Chat API] NEW REQUEST at ${new Date().toISOString()}`);
  console.log(`[Chat API] ============================================`);

  try {
    // Log request headers
    const headers = Object.fromEntries(request.headers.entries());
    console.log("[Chat API] Request headers:", {
      'content-type': headers['content-type'],
      'user-agent': headers['user-agent'],
      'origin': headers['origin'],
      'referer': headers['referer']
    });

    // TEMPORARILY SKIP AUTH FOR DEBUGGING
    // const user = await currentUser();
    // console.log(`[Chat API] User: ${user ? user.name : 'anonymous'}`);
    const user = null; // Bypass auth temporarily
    console.log("[Chat API] AUTH BYPASSED FOR DEBUGGING");

    // Parse request body
    console.log("[Chat API] Parsing request body...");
    const body = await request.json();
    console.log("[Chat API] Request body structure:", {
      hasMessages: !!body.messages,
      messageCount: body.messages?.length,
      model: body.model,
      firstMessage: body.messages?.[0] ? {
        role: body.messages[0].role,
        contentLength: typeof body.messages[0].content === 'string' ? body.messages[0].content.length : 'not a string',
        contentPreview: typeof body.messages[0].content === 'string' ? body.messages[0].content.substring(0, 100) : body.messages[0].content
      } : null
    });

    const { messages, model = "llama-3.3-70b-versatile" } = body;

    if (!messages || !Array.isArray(messages)) {
      console.error("[Chat API] ERROR: Invalid messages format:", {
        messages,
        isArray: Array.isArray(messages),
        type: typeof messages
      });
      return new Response("Invalid messages format", { status: 400 });
    }

    console.log(`[Chat API] Processing ${messages.length} messages with model: ${model}`);
    console.log(`[Chat API] Messages details:`, messages.map((m: any, i: number) => ({
      index: i,
      role: m.role,
      contentType: typeof m.content,
      contentLength: typeof m.content === 'string' ? m.content.length : 'N/A'
    })));

    console.log(`[Chat API] Creating stream with model...`);

    // Stream the response
    const result = await streamText({
      model: getModel(model),
      messages: [
        { role: "system", content: SYSTEM_MESSAGE },
        ...convertToModelMessages(messages),
      ],
      temperature: 0.7,
      maxTokens: 2048,
      // Optional: Add tools/functions
      tools: {
        // Example: Weather tool
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
            // Mock weather data - replace with actual API call
            const mockWeather = {
              location,
              temperature: unit === "celsius" ? 22 : 72,
              unit,
              condition: "Partly cloudy",
              humidity: 65,
              windSpeed: 15,
            };
            return mockWeather;
          },
        },
        // Example: Calculator tool
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
              // Simple eval for demo - use a proper math parser in production
              const result = Function('"use strict"; return (' + expression + ')')();
              return { expression, result };
            } catch (error) {
              return { error: "Invalid expression" };
            }
          },
        },
      },
      // Track usage if user is authenticated
      metadata: user ? { userId: user.id, userName: user.name } : undefined,
    });

    console.log("[Chat API] Stream created successfully");
    console.log(`[Chat API] Request processing time: ${Date.now() - startTime}ms`);
    console.log("[Chat API] Returning streaming response...");

    // Return the streaming response in assistant-ui compatible format
    const response = result.toUIMessageStreamResponse();
    console.log("[Chat API] Response created (UI format), sending to client...");
    return response;
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`[Chat API] ============================================`);
    console.error(`[Chat API] ERROR OCCURRED after ${errorTime}ms`);
    console.error("[Chat API] Error details:", error);
    console.error(`[Chat API] Error type:`, error instanceof Error ? error.constructor.name : typeof error);
    console.error(`[Chat API] Error message:`, error instanceof Error ? error.message : String(error));
    console.error(`[Chat API] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
    console.error(`[Chat API] ============================================`);

    if (error instanceof Error) {
      // Check for rate limiting
      if (error.message.includes("rate limit")) {
        return new Response("Rate limit exceeded. Please try again later.", { status: 429 });
      }

      // Check for invalid API key
      if (error.message.includes("API key") || error.message.includes("authentication")) {
        return new Response("API configuration error. Please contact support.", { status: 500 });
      }
    }

    return new Response("An error occurred while processing your request.", { status: 500 });
  }
}