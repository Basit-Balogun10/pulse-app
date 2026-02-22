import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// authTables provides: users, authAccounts, authSessions, authVerificationCodes, authRateLimits
export default defineSchema({
  ...authTables,

  // App-specific profile data (no auth - using string userId)
  profiles: defineTable({
    userId: v.string(), // Changed from v.id('users') for no-auth mode
    name: v.string(),
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
    subscriptionTier: v.optional(v.string()), // Starter, Regular, Committed, Champion
  }).index("by_user", ["userId"]),

  healthEntries: defineTable({
    userId: v.string(), // Changed from v.id('users') for no-auth mode
    date: v.string(), // YYYY-MM-DD
    energy: v.optional(v.number()), // 1–5
    sleep: v.optional(
      v.object({
        hours: v.optional(v.string()),
        quality: v.optional(v.string()),
      }),
    ),
    symptoms: v.optional(v.any()), // { none, location, type, intensity }
    respiratory: v.optional(v.array(v.string())),
    temperature: v.optional(v.any()), // { fever, temp }
    mood: v.optional(v.number()), // 1–5
    appetite: v.optional(v.any()), // { appetite, digestion, bowel }
    lifestyle: v.optional(v.any()), // { water, exercise, medications }
    openFlag: v.optional(v.string()),
    // AI analysis — populated async after entry is saved
    aiAnalysis: v.optional(
      v.object({
        overview: v.string(),
        concernLevel: v.optional(v.string()),
        patternsDetected: v.optional(v.array(v.string())),
        recommendation: v.optional(v.string()),
      }),
    ),
    weatherContext: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user", ["userId"]),

  nudgeRecords: defineTable({
    userId: v.string(), // Changed from v.id('users') for no-auth mode
    count: v.number(),
    lastNudgeDate: v.optional(v.string()),
    lastCheckupDate: v.optional(v.string()),
    dismissed: v.boolean(),
  }).index("by_user", ["userId"]),

  appointments: defineTable({
    userId: v.string(), // Changed from v.id('users') for no-auth mode
    clinicId: v.string(),
    clinicName: v.string(),
    specialty: v.optional(v.string()),
    status: v.string(), // 'pending' | 'booked' | 'completed' | 'cancelled'
    scheduledDate: v.optional(v.string()),
    reportStorageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  chatMessages: defineTable({
    userId: v.string(), // Changed from v.id('users') for no-auth mode
    role: v.string(), // 'user' | 'assistant'
    content: v.string(),
    attachmentStorageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  clinics: defineTable({
    name: v.string(),
    specialty: v.string(),
    distance: v.number(),
    rating: v.number(),
    discount: v.string(),
    discountCode: v.string(),
    address: v.string(),
    phone: v.string(),
    hours: v.string(),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
  }),
});
