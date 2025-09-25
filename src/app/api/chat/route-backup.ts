import { streamText } from "ai";
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
  console.log(`[Chat API] Requested model: ${modelName}`);

  // Claude models
  if (modelName.startsWith("claude")) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }
    console.log(`[Chat API] Using Claude model: ${modelName}`);
    return anthropic(modelName);
  }

  // Default to Groq
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured");
  }
  console.log(`[Chat API] Using Groq model: ${modelName}`);
  return groq(modelName);
}

export async function POST(request: Request) {
  try {
    console.log("[Chat API] Received POST request");

    // Check authentication (optional)
    const user = await currentUser();
    console.log(`[Chat API] User: ${user ? user.name : 'anonymous'}`);

    // Parse request body
    const body = await request.json();
    console.log("[Chat API] Request body:", {
      hasMessages: !!body.messages,
      messageCount: body.messages?.length,
      model: body.model
    });

    const { messages, model = "llama-3.3-70b-versatile" } = body;

    if (!messages || !Array.isArray(messages)) {
      console.error("[Chat API] Invalid messages format");
      return new Response("Invalid messages format", { status: 400 });
    }

    console.log(`[Chat API] Processing ${messages.length} messages with model: ${model}`);

    // Stream the response
    const result = await streamText({
      model: getModel(model),
      messages: [
        { role: "system", content: SYSTEM_MESSAGE },
        ...messages,
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

    console.log("[Chat API] Streaming response...");

    // Return the streaming response using the correct method
    return result.toDataStreamResponse({
      headers: {
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("[Chat API] Error:", error);

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