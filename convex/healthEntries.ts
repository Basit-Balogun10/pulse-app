import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
// import { getAuthUserId } from '@convex-dev/auth/server';
import { DEMO_USER_ID } from "./demoUser";

/** Save today's check-in. Prevents double-entry by returning existing entry if one exists. */
export const save = mutation({
  args: {
    date: v.string(), // YYYY-MM-DD
    energy: v.optional(v.number()),
    sleep: v.optional(
      v.object({
        hours: v.optional(v.string()),
        quality: v.optional(v.string()),
      }),
    ),
    symptoms: v.optional(v.any()),
    respiratory: v.optional(v.array(v.string())),
    temperature: v.optional(v.any()),
    mood: v.optional(v.number()),
    appetite: v.optional(v.any()),
    lifestyle: v.optional(v.any()),
    openFlag: v.optional(v.string()),
    weatherContext: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    // Check for existing entry on this date
    const existing = await ctx.db
      .query("healthEntries")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", userId).eq("date", args.date),
      )
      .first();

    if (existing) {
      // Update existing entry (e.g., if re-submitting)
      await ctx.db.patch(existing._id, { ...args, userId });
      return existing._id;
    }

    return await ctx.db.insert("healthEntries", {
      userId,
      ...args,
      createdAt: Date.now(),
    });
  },
});

/** Get today's health entry for the current user. */
export const getToday = query({
  args: { date: v.string() },
  async handler(ctx, { date }) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    const entry = await ctx.db
      .query("healthEntries")
      .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", date))
      .first();

    return entry ?? null;
  },
});

/** Get recent check-in history for the current user (last N days). */
export const getHistory = query({
  args: { limit: v.optional(v.number()) },
  async handler(ctx, { limit = 30 }) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    const entries = await ctx.db
      .query("healthEntries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return entries;
  },
});

/** Get a single entry by ID (used by AI action). */
export const getEntryById = query({
  args: { entryId: v.id("healthEntries") },
  async handler(ctx, { entryId }) {
    return await ctx.db.get(entryId);
  },
});

/** Store AI analysis result on a health entry (called from AI action). */
export const updateAnalysis = mutation({
  args: {
    entryId: v.id("healthEntries"),
    analysis: v.object({
      overview: v.string(),
      concernLevel: v.optional(v.string()),
      patternsDetected: v.optional(v.array(v.string())),
      recommendation: v.optional(v.string()),
    }),
  },
  async handler(ctx, { entryId, analysis }) {
    await ctx.db.patch(entryId, { aiAnalysis: analysis });
  },
});
