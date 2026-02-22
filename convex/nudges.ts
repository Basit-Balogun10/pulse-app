import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
// import { getAuthUserId } from '@convex-dev/auth/server';
import { DEMO_USER_ID } from "./demoUser";

/** Get current nudge state for the user. */
export const get = query({
  args: {},
  async handler(ctx) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    const record = await ctx.db
      .query("nudgeRecords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return (
      record ?? {
        count: 0,
        lastNudgeDate: null,
        lastCheckupDate: null,
        dismissed: false,
      }
    );
  },
});

/** Increment nudge count — called when AI recommends a checkup. */
export const increment = mutation({
  args: { date: v.string() },
  async handler(ctx, { date }) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    const existing = await ctx.db
      .query("nudgeRecords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        count: existing.count + 1,
        lastNudgeDate: date,
        dismissed: false,
      });
    } else {
      await ctx.db.insert("nudgeRecords", {
        userId,
        count: 1,
        lastNudgeDate: date,
        lastCheckupDate: undefined,
        dismissed: false,
      });
    }
  },
});

/** Reset nudge count — called when user books/completes a checkup. */
export const reset = mutation({
  args: { checkupDate: v.string() },
  async handler(ctx, { checkupDate }) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    const existing = await ctx.db
      .query("nudgeRecords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        count: 0,
        lastCheckupDate: checkupDate,
        dismissed: false,
      });
    }
  },
});

/** Dismiss nudge — called when user clicks "Remind Later". */
export const dismiss = mutation({
  args: {},
  async handler(ctx) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    const existing = await ctx.db
      .query("nudgeRecords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { dismissed: true });
    }
  },
});
