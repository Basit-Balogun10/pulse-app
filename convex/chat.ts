import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
// import { getAuthUserId } from '@convex-dev/auth/server';
import { DEMO_USER_ID } from "./demoUser";

/** Save a chat message. */
export const save = mutation({
  args: {
    role: v.string(), // 'user' | 'assistant'
    content: v.string(),
  },
  async handler(ctx, { role, content }) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    return await ctx.db.insert("chatMessages", {
      userId,
      role,
      content,
      createdAt: Date.now(),
    });
  },
});

/** Get recent chat messages for the current user. */
export const list = query({
  args: { limit: v.optional(v.number()) },
  async handler(ctx, { limit = 50 }) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return messages.reverse(); // Return in chronological order
  },
});

/** Clear all chat history for the current user. */
export const clear = mutation({
  args: {},
  async handler(ctx) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
  },
});
