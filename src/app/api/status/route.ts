export const runtime = "nodejs";

export async function GET() {
  const status = {
    groq: {
      configured: !!process.env.GROQ_API_KEY,
      keyLength: process.env.GROQ_API_KEY?.length || 0,
    },
    anthropic: {
      configured: !!process.env.ANTHROPIC_API_KEY,
      keyLength: process.env.ANTHROPIC_API_KEY?.length || 0,
    },
  };

  console.log("[Status API] Configuration check:", status);

  return new Response(JSON.stringify(status), {
    headers: { "Content-Type": "application/json" },
  });
}