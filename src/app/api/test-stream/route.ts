import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    console.log("[Test Stream] Starting...");

    const body = await request.json();
    const { messages = [{ role: "user", content: "Say hello" }] } = body;

    const result = await streamText({
      model: groq("llama-3.3-70b-versatile"),
      messages,
      temperature: 0.7,
      maxTokens: 100,
    });

    console.log("[Test Stream] Creating response...");

    // Try different response methods
    try {
      // Method 1: toTextStreamResponse
      return result.toTextStreamResponse();
    } catch (e1) {
      console.error("[Test Stream] toTextStreamResponse failed:", e1);

      try {
        // Method 2: toDataStreamResponse
        return result.toDataStreamResponse();
      } catch (e2) {
        console.error("[Test Stream] toDataStreamResponse failed:", e2);

        // Method 3: Manual streaming
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of result.textStream) {
                controller.enqueue(encoder.encode(chunk));
              }
              controller.close();
            } catch (error) {
              controller.error(error);
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
          },
        });
      }
    }
  } catch (error) {
    console.error("[Test Stream] Error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}