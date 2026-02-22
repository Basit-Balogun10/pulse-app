# Backend Integration Guide - Mock Data Replacement

**Date:** February 22, 2026  
**Purpose:** Step-by-step guide to replace mock data with real backend integration

---

## Table of Contents
1. [Overview](#overview)
2. [Phase 1: Core Data Migration](#phase-1-core-data-migration)
3. [Phase 2: Component Updates](#phase-2-component-updates)
4. [Phase 3: Feature Enhancements](#phase-3-feature-enhancements)
5. [Testing Strategy](#testing-strategy)
6. [Rollback Plan](#rollback-plan)

---

## Overview

### Current Architecture
```
Frontend Components
    ↓ (imports)
Mock Data Files (lib/*.ts)
    → Static data returned
```

### Target Architecture
```
Frontend Components
    ↓ (Convex hooks)
Convex Backend Functions
    ↓ (queries/mutations)
Convex Database
    → Real-time data sync
```

### Key Technologies
- **Convex**: Real-time backend with TypeScript
- **React Hooks**: `useQuery`, `useMutation`, `useAction`
- **Demo User System**: Hardcoded `"demo-user"` ID (no authentication)

---

## Phase 1: Core Data Migration

### Step 1.1: Seed User Profile

**File:** `convex/users.ts`

**Current State:**
```typescript
// Profile exists but may not match mock data
```

**Action Required:**
1. Create mutation to seed demo user profile
2. Map mock data fields to schema fields
3. Handle field name differences (gender → sex, knownConditions → medicalConditions)

**Example Implementation:**
```typescript
export const seedDemoProfile = mutation({
  args: {},
  async handler(ctx) {
    const userId = DEMO_USER_ID;
    
    // Check if profile exists
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (existing) {
      console.log("Demo profile already exists");
      return existing._id;
    }
    
    // Create profile from mock data
    return await ctx.db.insert("profiles", {
      userId,
      name: "Amara",
      age: "28",
      sex: "Female",
      height: "165 cm",
      weight: "58 kg",
      bloodType: "A+",
      medicalConditions: [],
      familyHistory: ["Hypertension (father)", "Diabetes (maternal grandmother)"],
      currentMedications: "",
      allergies: "",
      smokingStatus: "Non-smoker",
      alcoholUse: "Occasional",
      lastCheckup: "2024-12-21",
    });
  },
});
```

**Component Update:**
```typescript
// Before
import { userProfile } from '@/lib/mock-data';

// After
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const profile = useQuery(api.users.getProfile);
```

---

### Step 1.2: Seed Health Check-in History

**File:** `convex/healthEntries.ts`

**Action Required:**
1. Create mutation to seed 59 days of check-in data (Days 1-59)
2. Transform mock data format to match schema
3. Handle type conversions (mood: string → number, respiratory: boolean → array)

**Data Transformation Map:**
```typescript
// Mock Data → Backend Schema
{
  // Direct mappings
  date: entry.date,
  energy: entry.energy,
  openFlag: entry.openFlag,
  createdAt: new Date(entry.date).getTime(),
  
  // Object mappings
  sleep: {
    hours: entry.sleep.hours.toString(),
    quality: entry.sleep.quality,
  },
  
  // Type conversions
  mood: moodToNumber(entry.mood), // 'positive' → 5, 'neutral' → 3, etc.
  
  respiratory: entry.respiratory 
    ? ["congestion"] // or extract from symptoms
    : [],
  
  // Complex mappings
  symptoms: entry.symptoms.length > 0 ? {
    none: false,
    location: entry.symptoms[0].location,
    type: entry.symptoms[0].type,
    intensity: entry.symptoms[0].intensity,
  } : { none: true },
  
  temperature: {
    fever: entry.temperature.hasFever ? "yes" : "no",
    temp: entry.temperature.value,
  },
  
  // AI analysis
  aiAnalysis: {
    overview: entry.aiAnalysis.summary,
    concernLevel: entry.aiAnalysis.concern_level,
    patternsDetected: entry.aiAnalysis.patterns_detected,
    recommendation: entry.aiAnalysis.recommendation,
  },
}
```

**Example Implementation:**
```typescript
export const seedDemoCheckIns = mutation({
  args: {},
  async handler(ctx) {
    const userId = DEMO_USER_ID;
    
    // Import mock data
    const { amaraFullStory } = await import("@/lib/amara-story-data");
    
    // Skip Day 60 (today - not checked in yet)
    const checkIns = amaraFullStory.slice(0, 59);
    
    for (const entry of checkIns) {
      // Check if entry already exists
      const existing = await ctx.db
        .query("healthEntries")
        .withIndex("by_user_date", (q) => 
          q.eq("userId", userId).eq("date", entry.date)
        )
        .first();
      
      if (existing) continue;
      
      // Transform and insert
      await ctx.db.insert("healthEntries", {
        userId,
        date: entry.date,
        energy: entry.energy,
        sleep: {
          hours: entry.sleep.hours.toString(),
          quality: entry.sleep.quality,
        },
        mood: moodToNumber(entry.mood),
        // ... rest of transformations
        createdAt: new Date(entry.date).getTime(),
      });
    }
  },
});
```

---

### Step 1.3: Migrate Clinic Data

**File:** `convex/clinics.ts`

**Action Required:**
1. Create mutation to seed clinic directory
2. Transform coordinates from object to separate fields if needed

**Example Implementation:**
```typescript
export const seedClinics = mutation({
  args: {},
  async handler(ctx) {
    const { mockClinics } = await import("@/lib/mock-data-extended");
    
    for (const clinic of mockClinics) {
      const existing = await ctx.db
        .query("clinics")
        .filter((q) => q.eq(q.field("name"), clinic.name))
        .first();
      
      if (existing) continue;
      
      await ctx.db.insert("clinics", {
        name: clinic.name,
        specialty: clinic.specialties[0], // Primary specialty
        distance: clinic.distanceKm,
        rating: clinic.rating,
        discount: `${clinic.discountPercentage}%`,
        discountCode: `PULSE-${clinic.id.toUpperCase()}`,
        address: clinic.address,
        phone: clinic.contact,
        hours: clinic.operatingHours.weekdays,
        lat: clinic.coordinates.lat,
        lng: clinic.coordinates.lng,
      });
    }
  },
});
```

---

## Phase 2: Component Updates

### Step 2.1: Dashboard Component

**File:** `components/pulse/dashboard.tsx`

**Changes:**
1. Replace mock streak calculation with real query
2. Use real check-in count for today's status

```typescript
// Before
const streak = userProfile.streak;
const hasCheckedIn = false; // hardcoded

// After
const streak = useQuery(api.users.getStreak) ?? 0;
const todayEntry = useQuery(api.healthEntries.getToday, { 
  date: new Date().toISOString().split('T')[0] 
});
const hasCheckedIn = todayEntry !== null;
```

---

### Step 2.2: Day Carousel

**File:** `components/pulse/day-carousel.tsx`

**Changes:**
1. Get real list of checked-in dates from backend

```typescript
// Before
const checkedInDates = amaraFullStory
  .filter(d => d.hasCheckedIn !== false)
  .map(d => d.date);

// After
const allEntries = useQuery(api.healthEntries.getHistory, { limit: 60 }) ?? [];
const checkedInDates = allEntries.map(e => e.date);
```

---

### Step 2.3: Analytics View

**File:** `components/pulse/views/analytics-view.tsx`

**Changes:**
1. Replace `mockHealthData` with real queries
2. Transform data for charts

```typescript
// Before
const chartData = mockHealthData.map(d => ({
  date: d.date,
  energy: d.energy,
  mood: d.mood,
}));

// After
const entries = useQuery(api.healthEntries.getHistory, { limit: 30 }) ?? [];
const chartData = entries.map(e => ({
  date: e.date,
  energy: e.energy ?? 0,
  mood: e.mood ?? 0,
}));
```

---

### Step 2.4: Chat Box

**File:** `components/pulse/chat-box.tsx`

**Current State:**
```typescript
// Already integrated! Uses Convex hooks
const getChatResponse = useAction(api.ai.getChatResponse);
const convexHistory = useQuery(api.healthEntries.getHistory, { limit: 7 });
```

**Status:** ✅ Already complete

---

## Phase 3: Feature Enhancements

### Step 3.1: Real-time AI Analysis

**File:** `convex/ai.ts`

**Current:** AI analysis generated on check-in submission

**Enhancement:** Add more comprehensive check-in data to Gemini context

```typescript
function buildHealthPrompt(entry: any, recentHistory: any[]): string {
  // Include last 14 days of data
  const contextLines = [
    "PATIENT CHECK-IN ANALYSIS",
    "",
    "=== TODAY'S CHECK-IN ===",
    `Date: ${entry.date}`,
    `Energy: ${entry.energy}/5`,
    `Sleep: ${entry.sleep?.hours || '?'}h (${entry.sleep?.quality || 'unknown'})`,
    `Mood: ${entry.mood}/5`,
    // ... all fields
    "",
    "=== 14-DAY TREND ===",
  ];
  
  // Add historical context
  recentHistory.slice(-14).forEach((day, i) => {
    contextLines.push(
      `Day ${i + 1} (${day.date}): Energy ${day.energy}/5, ` +
      `Sleep ${day.sleep?.quality}, Mood ${day.mood}/5` +
      (day.symptoms ? `, Symptoms: ${JSON.stringify(day.symptoms)}` : '')
    );
  });
  
  contextLines.push("", "Provide comprehensive analysis considering patterns.");
  return contextLines.join("\n");
}
```

---

### Step 3.2: Streak Calculation

**File:** `convex/users.ts`

**Add query:**
```typescript
export const getStreak = query({
  args: {},
  async handler(ctx) {
    const userId = DEMO_USER_ID;
    
    const entries = await ctx.db
      .query("healthEntries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    
    if (entries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);
    
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasEntry = entries.some(e => e.date === dateStr);
      
      if (hasEntry) {
        streak++;
      } else if (dateStr !== today) {
        // Streak broken (allow missing today)
        break;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  },
});
```

---

## Testing Strategy

### Unit Tests
1. Test data transformation functions
2. Test streak calculation with various scenarios
3. Test schema validation

### Integration Tests
1. Seed data and verify database state
2. Query data and verify returned format
3. Test component rendering with real data

### Manual Testing Checklist
- [ ] Dashboard shows correct streak
- [ ] Day carousel highlights correct dates
- [ ] Analytics charts render with real data
- [ ] Chat uses full 14-day context
- [ ] Check-in submission creates entries
- [ ] AI analysis generates correctly
- [ ] Profile data displays correctly
- [ ] Clinic list loads from database

---

## Rollback Plan

### If Issues Occur:

1. **Quick Rollback:**
   ```typescript
   // In affected component
   const USE_MOCK_DATA = true;
   
   const data = USE_MOCK_DATA 
     ? mockHealthData 
     : useQuery(api.healthEntries.getHistory);
   ```

2. **Database Cleanup:**
   ```typescript
   // Clear seeded data
   export const clearDemoData = mutation({
     async handler(ctx) {
       const entries = await ctx.db
         .query("healthEntries")
         .withIndex("by_user", (q) => q.eq("userId", "demo-user"))
         .collect();
       
       for (const entry of entries) {
         await ctx.db.delete(entry._id);
       }
     },
   });
   ```

3. **Re-seed if needed:**
   ```bash
   # Run seed mutations again
   npx convex run users:seedDemoProfile
   npx convex run healthEntries:seedDemoCheckIns
   ```

---

## Migration Checklist

### Database Setup
- [ ] Run `seedDemoProfile` mutation
- [ ] Run `seedDemoCheckIns` mutation (59 days)
- [ ] Run `seedClinics` mutation
- [ ] Verify data in Convex dashboard

### Backend Functions
- [ ] Update `buildHealthPrompt` with 14-day context
- [ ] Update `buildChatContext` with full data
- [ ] Add `getStreak` query
- [ ] Test AI analysis generation

### Component Updates
- [ ] Update dashboard.tsx
- [ ] Update day-carousel.tsx
- [ ] Update analytics-view.tsx
- [ ] Update home-view.tsx
- [ ] Update detailed-analysis-modal.tsx
- [ ] Update clinics-view.tsx
- [ ] Update billing-view.tsx
- [ ] Update profile-view.tsx

### Testing
- [ ] Test all updated components
- [ ] Verify streak calculation
- [ ] Test AI analysis quality
- [ ] Test chat functionality
- [ ] Performance testing with real queries

### Documentation
- [ ] Update component documentation
- [ ] Document any API changes
- [ ] Update developer setup guide

---

**Last Updated:** February 22, 2026
