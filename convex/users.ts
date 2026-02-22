import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
// import { getAuthUserId } from '@convex-dev/auth/server';
import { DEMO_USER_ID } from "./demoUser";

/** Get current user's profile. Returns null if not found. */
export const getProfile = query({
  args: {},
  async handler(ctx) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return profile ?? null;
  },
});

/** Create a profile for the current user if one doesn't exist yet. */
export const getOrCreate = mutation({
  args: {
    name: v.optional(v.string()),
  },
  async handler(ctx, { name }) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("profiles", {
      userId,
      name: name ?? "Pulse User",
    });
  },
});

/** Save/update the user's health profile. */
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    age: v.optional(v.string()),
    sex: v.optional(v.string()),
    height: v.optional(v.string()),
    weight: v.optional(v.string()),
    bloodType: v.optional(v.string()),
    medicalConditions: v.optional(v.array(v.string())),
    familyHistory: v.optional(v.array(v.string())),
    currentMedications: v.optional(v.string()),
    allergies: v.optional(v.string()),
    smokingStatus: v.optional(v.string()),
    alcoholUse: v.optional(v.string()),
    lastCheckup: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      return await ctx.db.insert("profiles", {
        userId,
        name: args.name ?? "Pulse User",
        ...args,
      });
    }
  },
});

/** Compute streak: count of consecutive days with check-ins going back from today. */
export const getStreak = query({
  args: {},
  async handler(ctx) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    // Get all entries sorted by date descending
    const entries = await ctx.db
      .query("healthEntries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (entries.length === 0) return 0;

    const dates = new Set(entries.map((e) => e.date));

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    
    // Start counting from today if there's an entry, otherwise from yesterday
    let current = new Date(today);
    if (!dates.has(todayStr)) {
      // No entry for today yet - start from yesterday
      current.setDate(current.getDate() - 1);
    }

    let streak = 0;
    while (true) {
      const dateStr = current.toISOString().split("T")[0];
      if (dates.has(dateStr)) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },
});
