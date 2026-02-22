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
        maxOutputTokens: 2048,
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

    // Fetch recent history (last 14 days) for pattern detection
    const recentHistory = await ctx.runQuery(api.healthEntries.getHistory, {
      limit: 14,
    });

    const prompt = buildHealthPrompt(entry, recentHistory, weatherContext);

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

function buildHealthPrompt(
  entry: any,
  recentHistory: any[],
  weatherContext?: string,
): string {
  const parts: string[] = [
    "You are Pulse AI, a preventive health companion. Analyze this daily health check-in and recent history to identify patterns and provide empathetic insights (3-5 sentences).",
    "",
    "=== TODAY'S CHECK-IN ===",
    `Date: ${entry.date}`,
  ];

  // Today's comprehensive data
  if (entry.energy !== undefined)
    parts.push(`Energy: ${entry.energy}/5`);
  if (entry.sleep?.quality)
    parts.push(
      `Sleep: ${entry.sleep.hours ?? "?"}h, quality: ${entry.sleep.quality}`,
    );
  if (entry.mood !== undefined) parts.push(`Mood: ${entry.mood}/5`);
  
  if (entry.temperature?.fever && entry.temperature.fever !== "no") {
    parts.push(
      `Temperature: ${entry.temperature.fever === "yes" ? "FEVER" : entry.temperature.fever}${entry.temperature.temp ? ` (${entry.temperature.temp}°C)` : ""}`,
    );
  }
  
  if (entry.symptoms && !entry.symptoms.none && entry.symptoms.location) {
    parts.push(
      `Symptoms: ${entry.symptoms.type ?? "discomfort"} in ${entry.symptoms.location} - ${entry.symptoms.intensity ?? "unspecified"} intensity`,
    );
  }
  
  if (entry.respiratory?.length && !entry.respiratory.includes("none")) {
    parts.push(`Respiratory: ${entry.respiratory.join(", ")}`);
  }
  
  if (entry.appetite?.appetite) {
    parts.push(
      `Appetite: ${entry.appetite.appetite}${entry.appetite.digestion ? `, digestion: ${entry.appetite.digestion}` : ""}`,
    );
  }
  
  if (entry.lifestyle) {
    const l = entry.lifestyle;
    const lifestyleItems = [];
    if (l.water !== undefined) lifestyleItems.push(`hydration: ${l.water ? "yes" : "no"}`);
    if (l.exercise !== undefined) lifestyleItems.push(`exercise: ${l.exercise ? "yes" : "no"}`);
    if (lifestyleItems.length > 0) {
      parts.push(`Lifestyle: ${lifestyleItems.join(", ")}`);
    }
  }
  
  if (entry.openFlag) parts.push(`User note: "${entry.openFlag}"`);
  if (weatherContext) parts.push(`Weather: ${weatherContext}`);

  // Recent history for pattern detection (last 14 days)
  if (recentHistory && recentHistory.length > 1) {
    parts.push("", "=== RECENT 14-DAY TREND ===");
    
    // Get entries excluding today
    const historicalEntries = recentHistory.filter((e: any) => e.date !== entry.date).slice(-14);
    
    if (historicalEntries.length > 0) {
      parts.push(`Days tracked: ${historicalEntries.length}`);
      
      // Energy trend
      const energyValues = historicalEntries
        .filter((e: any) => e.energy !== undefined)
        .map((e: any) => e.energy);
      if (energyValues.length > 0) {
        const avgEnergy = (energyValues.reduce((a: number, b: number) => a + b, 0) / energyValues.length).toFixed(1);
        parts.push(`Average energy: ${avgEnergy}/5`);
      }
      
      // Mood trend
      const moodValues = historicalEntries
        .filter((e: any) => e.mood !== undefined)
        .map((e: any) => e.mood);
      if (moodValues.length > 0) {
        const avgMood = (moodValues.reduce((a: number, b: number) => a + b, 0) / moodValues.length).toFixed(1);
        parts.push(`Average mood: ${avgMood}/5`);
      }
      
      // Sleep quality trend
      const sleepQualities = historicalEntries
        .filter((e: any) => e.sleep?.quality)
        .map((e: any) => e.sleep.quality);
      if (sleepQualities.length > 0) {
        parts.push(`Recent sleep: ${sleepQualities.slice(-3).join(", ")}`);
      }
      
      // Symptom patterns
      const symptomsCount = historicalEntries.filter(
        (e: any) => e.symptoms && !e.symptoms.none && e.symptoms.location
      ).length;
      if (symptomsCount > 0) {
        parts.push(`Symptoms reported in ${symptomsCount} of last ${historicalEntries.length} days`);
        
        // Recurring symptom locations
        const symptomLocations = historicalEntries
          .filter((e: any) => e.symptoms && !e.symptoms.none && e.symptoms.location)
          .map((e: any) => e.symptoms.location);
        if (symptomLocations.length > 0) {
          const locationCounts = symptomLocations.reduce((acc: any, loc: string) => {
            acc[loc] = (acc[loc] || 0) + 1;
            return acc;
          }, {});
          const recurring = Object.entries(locationCounts)
            .filter(([_, count]) => (count as number) > 1)
            .map(([loc, count]) => `${loc} (${count}x)`);
          if (recurring.length > 0) {
            parts.push(`Recurring symptoms: ${recurring.join(", ")}`);
          }
        }
      }
      
      // Fever occurrences
      const feverDays = historicalEntries.filter(
        (e: any) => e.temperature?.fever === "yes"
      ).length;
      if (feverDays > 0) {
        parts.push(`Fever reported in ${feverDays} of last ${historicalEntries.length} days`);
      }
    }
  }

  parts.push(
    "",
    "ANALYSIS GUIDELINES:",
    "- Identify patterns by comparing today with recent trends",
    "- Note any concerning changes (e.g., declining energy, recurring symptoms, new fever)",
    "- Highlight positive patterns (e.g., consistent sleep, stable mood)",
    "- If multiple concerning indicators persist for 3+ days, suggest monitoring or consulting a doctor",
    "- Be caring and non-alarmist, but clear about concerning patterns",
    "",
    "Provide your analysis:",
  );

  return parts.join("\n");
}

function buildChatContext(entries: any[], userName?: string): string {
  if (entries.length === 0) return "No recent check-in data available.";

  const lines = [
    `=== HEALTH DATA FOR ${userName?.toUpperCase() ?? "USER"} ===`,
    `Check-in history: Last ${entries.length} days`,
    "",
  ];

  // Show up to last 14 days of comprehensive data
  entries.slice(-14).forEach((entry, index) => {
    const dayParts = [`Day ${index + 1} (${entry.date}):`];
    
    // Core metrics
    if (entry.energy !== undefined) dayParts.push(`energy ${entry.energy}/5`);
    if (entry.mood !== undefined) dayParts.push(`mood ${entry.mood}/5`);
    if (entry.sleep?.quality) {
      dayParts.push(`sleep ${entry.sleep.hours || "?"}h (${entry.sleep.quality})`);
    }
    
    // Symptoms and health concerns
    if (entry.symptoms && !entry.symptoms.none && entry.symptoms.location) {
      dayParts.push(
        `SYMPTOM: ${entry.symptoms.type || "discomfort"} in ${entry.symptoms.location} (${entry.symptoms.intensity})`,
      );
    }
    
    if (entry.temperature?.fever === "yes") {
      dayParts.push(`FEVER${entry.temperature.temp ? ` (${entry.temperature.temp}°C)` : ""}`);
    }
    
    if (entry.respiratory?.length && !entry.respiratory.includes("none")) {
      dayParts.push(`respiratory: ${entry.respiratory.join(", ")}`);
    }
    
    if (entry.appetite?.appetite && entry.appetite.appetite !== "good") {
      dayParts.push(`appetite: ${entry.appetite.appetite}`);
    }
    
    if (entry.openFlag) {
      dayParts.push(`note: "${entry.openFlag}"`);
    }
    
    lines.push(`  ${dayParts.join(" | ")}`);
  });

  // Pattern summary
  lines.push("", "=== PATTERN SUMMARY ===");
  
  // Calculate averages
  const recentEntries = entries.slice(-7); // Last 7 days
  const energyAvg = recentEntries
    .filter((e: any) => e.energy !== undefined)
    .reduce((sum: number, e: any) => sum + e.energy, 0) / Math.max(recentEntries.filter((e: any) => e.energy !== undefined).length, 1);
  const moodAvg = recentEntries
    .filter((e: any) => e.mood !== undefined)
    .reduce((sum: number, e: any) => sum + e.mood, 0) / Math.max(recentEntries.filter((e: any) => e.mood !== undefined).length, 1);
  
  lines.push(`Recent averages (7 days): Energy ${energyAvg.toFixed(1)}/5, Mood ${moodAvg.toFixed(1)}/5`);
  
  // Recurring issues
  const symptomsCount = entries.filter(
    (e: any) => e.symptoms && !e.symptoms.none
  ).length;
  if (symptomsCount > 0) {
    lines.push(`Symptoms reported in ${symptomsCount} of ${entries.length} days`);
  }
  
  const feverCount = entries.filter(
    (e: any) => e.temperature?.fever === "yes"
  ).length;
  if (feverCount > 0) {
    lines.push(`Fever episodes: ${feverCount}`);
  }

  return lines.join("\n");
}
