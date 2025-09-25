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

export async function POST(request: Request) {
  try {
    // Optional: Get user for authentication context
    // const user = await currentUser();

    // Parse request body
    const body = await request.json();
    const { messages, model = "llama-3.3-70b-versatile" } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 });
    }

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
    });

    // Return the streaming response in assistant-ui compatible format
    return result.toUIMessageStreamResponse();
  } catch (error) {
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