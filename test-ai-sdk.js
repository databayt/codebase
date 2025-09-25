const { streamText } = require("ai");
const { groq } = require("@ai-sdk/groq");

async function testAISDK() {
  console.log("[Test] Starting AI SDK test...");

  try {
    const result = await streamText({
      model: groq("llama-3.3-70b-versatile"),
      messages: [{ role: "user", content: "Say hello in 5 words" }],
      temperature: 0.7,
      maxTokens: 20,
    });

    console.log("[Test] Result object methods:");
    console.log("- toTextStreamResponse:", typeof result.toTextStreamResponse);
    console.log("- toDataStreamResponse:", typeof result.toDataStreamResponse);
    console.log("- toAIStreamResponse:", typeof result.toAIStreamResponse);
    console.log("- pipeTextStreamToResponse:", typeof result.pipeTextStreamToResponse);
    console.log("- textStream:", typeof result.textStream);

    // Try to collect the text
    let fullText = "";
    for await (const chunk of result.textStream) {
      fullText += chunk;
      process.stdout.write(chunk);
    }

    console.log("\n[Test] Full response:", fullText);
    console.log("[Test] Success!");

  } catch (error) {
    console.error("[Test] Error:", error);
  }
}

testAISDK();