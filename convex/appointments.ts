import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
// import { getAuthUserId } from '@convex-dev/auth/server';
import { DEMO_USER_ID } from "./demoUser";

/** Book an appointment at a clinic. */
export const book = mutation({
  args: {
    clinicId: v.string(),
    clinicName: v.string(),
    specialty: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    status: v.optional(v.string()), // defaults to 'booked'; pass 'completed' for self-reported visits
  },
  async handler(ctx, args) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    const { status = "booked", ...rest } = args;
    return await ctx.db.insert("appointments", {
      userId,
      ...rest,
      status,
      createdAt: Date.now(),
    });
  },
});

/** Get all appointments for the current user. */
export const listByUser = query({
  args: {},
  async handler(ctx) {
    // Auth disabled - using demo user
    const userId = DEMO_USER_ID;

    return await ctx.db
      .query("appointments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

/** Update appointment status. */
export const update = mutation({
  args: {
    appointmentId: v.id("appointments"),
    status: v.string(),
    reportStorageId: v.optional(v.id("_storage")),
  },
  async handler(ctx, { appointmentId, status, reportStorageId }) {
    const patch: any = { status };
    if (reportStorageId) patch.reportStorageId = reportStorageId;
    await ctx.db.patch(appointmentId, patch);
  },
});
