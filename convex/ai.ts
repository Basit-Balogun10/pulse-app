import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response generated."
  );
}

/**
 * Server-side Gemini analysis of a daily health entry.
 * Reads the entry from DB, calls Gemini, writes the result back.
 */
export const generateDailyAnalysis = action({
  args: {
    entryId: v.id("healthEntries"),
    weatherContext: v.optional(v.string()),
  },
  async handler(ctx, { entryId, weatherContext }) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback: store a placeholder analysis
      await ctx.runMutation(api.healthEntries.updateAnalysis, {
        entryId,
        analysis: {
          overview:
            "Analysis unavailable — GEMINI_API_KEY not configured. Your check-in has been saved.",
          concernLevel: "none",
        },
      });
      return;
    }

    // Fetch the entry data
    const entry = await ctx.runQuery(api.healthEntries.getEntryById, {
      entryId,
    });
    if (!entry) return;

    const prompt = buildHealthPrompt(entry, weatherContext);

    try {
      const responseText = await callGemini(prompt, apiKey);

      // Parse concern level from response
      const lowerText = responseText.toLowerCase();
      let concernLevel = "none";
      if (
        lowerText.includes("urgent") ||
        lowerText.includes("immediately") ||
        lowerText.includes("high concern")
      ) {
        concernLevel = "high";
      } else if (
        lowerText.includes("moderate") ||
        lowerText.includes("consult") ||
        lowerText.includes("monitor")
      ) {
        concernLevel = "moderate";
      } else if (
        lowerText.includes("mild") ||
        lowerText.includes("low concern")
      ) {
        concernLevel = "low";
      }

      await ctx.runMutation(api.healthEntries.updateAnalysis, {
        entryId,
        analysis: {
          overview: responseText,
          concernLevel,
          patternsDetected: [],
        },
      });
    } catch (error) {
      console.error("Gemini action error:", error);
      await ctx.runMutation(api.healthEntries.updateAnalysis, {
        entryId,
        analysis: {
          overview:
            "Unable to generate AI analysis at this time. Your check-in has been saved and we will analyze it shortly.",
          concernLevel: "none",
        },
      });
    }
  },
});

/**
 * Server-side Gemini chat response using real check-in history.
 * Returns the AI's response text.
 */
export const getChatResponse = action({
  args: {
    message: v.string(),
    recentEntries: v.array(v.any()),
    userName: v.optional(v.string()),
  },
  async handler(ctx, { message, recentEntries, userName }) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return "I am here to help with your health questions. (Configure GEMINI_API_KEY to enable AI responses.)";
    }

    const contextSummary = buildChatContext(recentEntries, userName);

    const prompt = `You are Pulse, a compassionate AI health companion. You have access to the user's recent health data and provide personalized, empathetic health insights.

IMPORTANT: You are NOT a doctor. Always encourage consulting healthcare professionals for medical advice. Keep responses concise (2-4 sentences).

${contextSummary}

User message: ${message}

Respond as a helpful health companion, referencing their recent data where relevant.`;

    try {
      return await callGemini(prompt, apiKey);
    } catch (error) {
      console.error("Chat Gemini error:", error);
      return "I apologize, I am having trouble connecting right now. Please try again in a moment.";
    }
  },
});

function buildHealthPrompt(entry: any, weatherContext?: string): string {
  const parts: string[] = [
    "Analyze this daily health check-in and provide a brief, empathetic health insight (2-4 sentences). Focus on patterns, what looks good, and what needs attention.",
    "",
    "CHECK-IN DATA:",
  ];

  if (entry.energy !== undefined)
    parts.push(`- Energy level: ${entry.energy}/5`);
  if (entry.sleep?.quality)
    parts.push(
      `- Sleep: ${entry.sleep.hours ?? "?"}h, ${entry.sleep.quality} quality`,
    );
  if (entry.mood !== undefined) parts.push(`- Mood: ${entry.mood}/5`);
  if (entry.temperature?.fever)
    parts.push(`- Fever: ${entry.temperature.fever}`);
  if (entry.symptoms && !entry.symptoms.none && entry.symptoms.location) {
    parts.push(
      `- Symptoms: ${entry.symptoms.type ?? "discomfort"} in ${entry.symptoms.location} (${entry.symptoms.intensity ?? "unspecified"})`,
    );
  }
  if (entry.respiratory?.length && !entry.respiratory.includes("none")) {
    parts.push(`- Respiratory: ${entry.respiratory.join(", ")}`);
  }
  if (entry.appetite?.appetite)
    parts.push(`- Appetite: ${entry.appetite.appetite}`);
  if (entry.lifestyle) {
    const l = entry.lifestyle;
    parts.push(
      `- Hydration: ${l.water ? "Yes" : "No"}, Exercise: ${l.exercise ? "Yes" : "No"}`,
    );
  }
  if (entry.openFlag) parts.push(`- User note: "${entry.openFlag}"`);
  if (weatherContext) parts.push(`- Weather: ${weatherContext}`);

  parts.push(
    "",
    "Provide a caring, non-alarmist response. If there are concerning symptoms, gently suggest monitoring or consulting a doctor.",
  );

  return parts.join("\n");
}

function buildChatContext(entries: any[], userName?: string): string {
  if (entries.length === 0) return "No recent check-in data available.";

  const lines = [
    `RECENT HEALTH DATA FOR ${userName ?? "USER"} (last ${entries.length} days):`,
  ];

  entries.slice(0, 7).forEach((entry) => {
    const parts = [entry.date];
    if (entry.energy !== undefined) parts.push(`energy ${entry.energy}/5`);
    if (entry.mood !== undefined) parts.push(`mood ${entry.mood}/5`);
    if (entry.sleep?.quality) parts.push(`sleep ${entry.sleep.quality}`);
    if (entry.temperature?.fever === "yes") parts.push("FEVER");
    lines.push(`  ${parts.join(", ")}`);
  });

  return lines.join("\n");
}
