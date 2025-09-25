// Test endpoint to verify API is working
export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      hasGroq: !!process.env.GROQ_API_KEY,
      hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
      groqKeyLength: process.env.GROQ_API_KEY?.length || 0,
      anthropicKeyLength: process.env.ANTHROPIC_API_KEY?.length || 0,
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Try to import and use Groq
    let groqStatus = "not tested";
    try {
      const { groq } = await import("@ai-sdk/groq");
      const model = groq("llama-3.3-70b-versatile");
      groqStatus = "imported successfully";
    } catch (error: any) {
      groqStatus = `import failed: ${error.message}`;
    }

    return Response.json({
      status: "ok",
      received: body,
      groqStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return Response.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}