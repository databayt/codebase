// Test environment variables
export async function GET() {
  const env = {
    hasGroqKey: !!process.env.GROQ_API_KEY,
    groqKeyLength: process.env.GROQ_API_KEY?.length || 0,
    groqKeyFirst5: process.env.GROQ_API_KEY?.substring(0, 5) || "NOT_SET",
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    anthropicKeyLength: process.env.ANTHROPIC_API_KEY?.length || 0,
    anthropicKeyFirst5: process.env.ANTHROPIC_API_KEY?.substring(0, 5) || "NOT_SET",
    nodeEnv: process.env.NODE_ENV,
    nextAuthUrl: process.env.NEXTAUTH_URL || "NOT_SET",
  };

  console.log("[Env Test]", env);

  return Response.json(env);
}