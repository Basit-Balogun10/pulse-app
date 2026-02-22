// Test script to verify Gemini API is working
const API_KEY = "AIzaSyDi8Uyh34L4RNXiyC2SETAHXu5qIY7AFVI";

async function listAvailableModels() {
  console.log("📋 Listing available Gemini models...\n");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`,
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error fetching models:");
      console.error(errorText);
      return [];
    }

    const data = await response.json();
    console.log("Available models:");
    const models = data.models || [];
    models.forEach((model) => {
      const supportsGenerate =
        model.supportedGenerationMethods?.includes("generateContent");
      console.log(
        `  ${supportsGenerate ? "✅" : "❌"} ${model.name} - ${model.displayName}`,
      );
    });
    console.log("\n" + "=".repeat(60) + "\n");

    // Return first model that supports generateContent
    return models.find((m) =>
      m.supportedGenerationMethods?.includes("generateContent"),
    );
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function testGeminiAPI() {
  console.log("🧪 Testing Gemini API...\n");
  console.log(
    "API Key:",
    API_KEY.substring(0, 10) + "..." + API_KEY.substring(API_KEY.length - 4),
  );
  console.log("\n" + "=".repeat(60) + "\n");

  // First, list available models
  const model = await listAvailableModels();

  if (!model) {
    console.error("❌ No compatible model found");
    return;
  }

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/${model.name}:generateContent`;
  console.log("Using model:", model.displayName);
  console.log("Model name:", model.name);
  console.log("URL:", GEMINI_API_URL);
  console.log("\n" + "=".repeat(60) + "\n");

  const testPrompt =
    "Say 'Hello from Gemini! The API is working correctly.' and nothing else.";

  try {
    console.log("📤 Sending request...");
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: testPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100,
        },
      }),
    });

    console.log("📥 Response status:", response.status, response.statusText);
    console.log("\n" + "=".repeat(60) + "\n");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error:");
      console.error(errorText);
      return;
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      console.log("✅ SUCCESS! Gemini API is working!\n");
      console.log("Response:");
      console.log(data.candidates[0].content.parts[0].text);
      console.log("\n" + "=".repeat(60));
      console.log(
        "\n✅ Your Gemini API (Tier 1) is configured correctly and working!",
      );
      console.log("You can now use AI-powered health analysis in your app.\n");
    } else {
      console.log("⚠️  Unexpected response format:");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("❌ Error testing Gemini API:");
    console.error(error.message);
    if (error.cause) {
      console.error("Cause:", error.cause);
    }
  }
}

testGeminiAPI();
