// Debug endpoint to test AI SDK
export async function POST(request: Request) {
  console.log("[Debug API] Starting...");

  try {
    const body = await request.json();
    console.log("[Debug API] Body received:", JSON.stringify(body));

    // Test if we can import the AI SDK
    console.log("[Debug API] Testing imports...");

    try {
      const { streamText } = await import("ai");
      console.log("[Debug API] ✓ ai package imported");
    } catch (e: any) {
      console.error("[Debug API] ✗ Failed to import ai:", e.message);
      return Response.json({ error: "Failed to import ai package", details: e.message }, { status: 500 });
    }

    try {
      const { groq } = await import("@ai-sdk/groq");
      console.log("[Debug API] ✓ groq package imported");

      // Try to create a model instance
      const model = groq("llama-3.3-70b-versatile");
      console.log("[Debug API] ✓ Groq model created");

      // Check API key
      console.log("[Debug API] GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY);
      console.log("[Debug API] GROQ_API_KEY length:", process.env.GROQ_API_KEY?.length);

    } catch (e: any) {
      console.error("[Debug API] ✗ Failed with groq:", e.message);
      return Response.json({ error: "Failed with groq", details: e.message }, { status: 500 });
    }

    // Try a simple completion
    try {
      const { streamText } = await import("ai");
      const { groq } = await import("@ai-sdk/groq");

      console.log("[Debug API] Attempting streamText...");

      const result = await streamText({
        model: groq("llama-3.3-70b-versatile"),
        messages: [{ role: "user" as const, content: "Say 'test'" }],
        temperature: 0.5,
        maxTokens: 10,
      });

      console.log("[Debug API] ✓ streamText created");

      // Collect response
      let response = "";
      for await (const chunk of result.textStream) {
        response += chunk;
      }

      console.log("[Debug API] Response:", response);

      return Response.json({
        success: true,
        response,
        debug: {
          hasGroqKey: !!process.env.GROQ_API_KEY,
          keyLength: process.env.GROQ_API_KEY?.length,
        }
      });

    } catch (e: any) {
      console.error("[Debug API] ✗ streamText failed:", e);
      return Response.json({
        error: "streamText failed",
        details: e.message,
        stack: e.stack
      }, { status: 500 });
    }

  } catch (e: any) {
    console.error("[Debug API] Unexpected error:", e);
    return Response.json({
      error: "Unexpected error",
      details: e.message,
      stack: e.stack
    }, { status: 500 });
  }
}