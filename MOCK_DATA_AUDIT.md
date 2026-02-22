# Mock Data Audit - Pulse App

**Date:** February 22, 2026  
**Purpose:** Document all mock/demo data used in the application

---

## 1. Mock Data Files

### 1.1 `lib/amara-story-data.ts` (PRIMARY DEMO DATA)
**Purpose:** Complete 60-day health journey narrative for demo user "Amara"

**Data Structures:**
- `amaraFullStory`: 60 days of check-in entries
  - Days 1-44: Healthy baseline (auto-generated)
  - Days 45-59: Progressive health decline with pattern detection
  - Day 60: Today (pending check-in)
  
**Key Exports:**
- `CheckInEntry` interface - Complete check-in structure
- `amaraFullStory` - Array of 60 daily check-ins
- `amaraProfile` - User profile data
- `amaraDay15DetailedAnalysis` - Detailed health pattern analysis
- `amaraNudges` - Nudge tracking records
- `amaraChatDetections` - AI chat detection examples

**Data Fields per Check-in:**
- `date`: string (YYYY-MM-DD)
- `dayNumber`: number (1-60)
- `energy`: number (1-5 scale)
- `sleep`: { hours, quality }
- `symptoms`: Array of { location, type, intensity }
- `respiratory`: boolean
- `temperature`: { hasFever, value }
- `mood`: string ('positive' | 'neutral' | 'low' | 'anxious')
- `appetite`: string ('great' | 'good' | 'low' | 'very low')
- `lifestyle`: { water, exercise, meditation, screenTime, social, customNote }
- `openFlag`: string (optional user note)
- `aiAnalysis`: { summary, concern_level, patterns_detected, recommendation }
- `hasCheckedIn`: boolean (for pending days)

---

### 1.2 `lib/mock-data.ts`
**Purpose:** Simplified 15-day health data and supporting entities

**Key Exports:**
- `mockHealthData`: 15-day health journey (Days 1-15)
- `userProfile`: Amara's profile with streak/tier data
- `clinics`: 2 clinic locations
- `checkInCategories`: UI configuration for check-in interface

**Data Fields:**
- Simplified compared to amara-story-data.ts
- Uses numeric scales instead of descriptive strings
- Contains basic clinic information

**Status:** PARTIALLY REDUNDANT with amara-story-data.ts

---

### 1.3 `lib/mock-data-extended.ts`
**Purpose:** Extended clinic data and subscription tier information

**Key Exports:**
- `mockClinics`: 12 detailed clinic locations with coordinates
- `subscriptionTiers`: 5 subscription tiers (Basic to Platinum)
- `amaraSubscription`: Current subscription status
- `amaraAutoBookingStatus`: Auto-booking eligibility
- `amaraAppointments`: Appointment bookings
- `paymentMethods`: Payment options

**Data Structures:**
- `Clinic` interface - Full clinic details with coordinates
- `SubscriptionTier` interface - Tier benefits and pricing
- `Appointment` interface - Booking details
- `AutoBookingEligibility` interface - Auto-booking status

---

## 2. Data Volume Summary

| Category | Count | Source File |
|----------|-------|-------------|
| Check-in Entries | 60 | amara-story-data.ts |
| Check-in Entries (alt) | 15 | mock-data.ts |
| Clinics | 12 | mock-data-extended.ts |
| Clinics (basic) | 2 | mock-data.ts |
| Subscription Tiers | 5 | mock-data-extended.ts |
| Appointments | 1 | mock-data-extended.ts |
| Nudge Records | 1 | amara-story-data.ts |
| Chat Detections | 1 | amara-story-data.ts |
| User Profiles | 1 | All files |

---

## 3. Current Usage in Components

### Frontend Components Using Mock Data:

1. **Dashboard Components:**
   - `dashboard.tsx` - Uses userProfile.streak for streak display
   - `day-carousel.tsx` - Uses amaraFullStory for date selection
   - `detailed-analysis-modal.tsx` - Uses amaraDay15DetailedAnalysis

2. **View Components:**
   - `home-view.tsx` - Uses amaraFullStory for recent check-ins
   - `analytics-view.tsx` - Uses mockHealthData for charts
   - `clinics-view.tsx` - Uses mockClinics for clinic list
   - `billing-view.tsx` - Uses subscriptionTiers
   - `profile-view.tsx` - Uses userProfile

3. **Feature Components:**
   - `chat-box.tsx` - Uses amaraFullStory, amaraChatDetections
   - `clinic-map.tsx` - Uses mockClinics with coordinates
   - `check-in-card.tsx` - Uses checkInCategories
   - `auto-booking-card.tsx` - Uses amaraAutoBookingStatus

---

## 4. Schema Mismatches

### Key Differences Between Mock Data & Backend Schema:

#### 4.1 Health Entries Schema Mapping

| Mock Data (amara-story-data.ts) | Backend Schema (healthEntries) | Status |
|--------------------------------|--------------------------------|--------|
| `energy: number (1-5)` | `energy: optional number` | ✅ Compatible |
| `sleep: { hours, quality }` | `sleep: optional { hours, quality }` | ✅ Compatible |
| `symptoms: Array<{ location, type, intensity }>` | `symptoms: optional any` | ⚠️ Needs mapping |
| `respiratory: boolean` | `respiratory: optional array<string>` | ❌ Type mismatch |
| `temperature: { hasFever, value }` | `temperature: optional any` | ⚠️ Needs mapping |
| `mood: string` | `mood: optional number` | ❌ Type mismatch |
| `appetite: string` | `appetite: optional any` | ⚠️ Needs mapping |
| `lifestyle: object` | `lifestyle: optional any` | ⚠️ Needs mapping |
| `aiAnalysis: object` | `aiAnalysis: optional object` | ⚠️ Field names differ |

#### 4.2 Profile Schema Mapping

| Mock Data | Backend Schema (profiles) | Status |
|-----------|---------------------------|--------|
| `familyHistory: Array<{ condition, relative }>` | `familyHistory: optional array<string>` | ❌ Structure mismatch |
| `knownConditions: array` | `medicalConditions: optional array<string>` | ⚠️ Field name differs |
| `gender: string` | `sex: optional string` | ⚠️ Field name differs |

---

## 5. Demo User Configuration

**Current Demo User:**
- ID: `"demo-user"` (defined in `convex/demoUser.ts`)
- Name: Amara
- Age: 28
- Gender: Female
- Family History: Hypertension (father), Diabetes (maternal grandmother)
- Last Checkup: December 21, 2024 (14 months ago)
- Check-in Streak: 15 days (from mock data)
- Subscription Tier: Regular (20% discount)

---

## 6. Data Dependencies

### Critical Dependencies:
1. **Streak Calculation** - Currently hardcoded in mock data
2. **Tier Calculation** - Based on mock streak value
3. **Nudge System** - Based on Day 15 analysis from mock data
4. **Auto-booking Eligibility** - Hardcoded in mock-data-extended.ts
5. **AI Analysis** - Pre-written in mock data, not generated

---

## 7. Transition Priorities

### High Priority (Core Functionality):
1. ✅ Health check-in entries (60 days) → `healthEntries` table
2. ✅ User profile → `profiles` table
3. ✅ Streak calculation → Real-time from database

### Medium Priority (Features):
4. ⚠️ Clinic data → `clinics` table
5. ⚠️ Chat history → `chatMessages` table
6. ⚠️ Appointments → `appointments` table

### Low Priority (Nice-to-have):
7. ⚠️ Subscription tiers → Application logic
8. ⚠️ Nudge records → `nudgeRecords` table

---

## 8. Recommendations

1. **Keep amara-story-data.ts as demo seed data** - Use it to populate database for demos
2. **Deprecate mock-data.ts** - Redundant with amara-story-data.ts
3. **Keep mock-data-extended.ts** - Useful for clinic/subscription data until backend implements these
4. **Create migration script** - Convert mock data format to backend schema format
5. **Update components gradually** - Start with dashboard, then views, then features

---

## 9. Files to Update After Migration

### Components to Update:
- [ ] `components/pulse/dashboard.tsx`
- [ ] `components/pulse/day-carousel.tsx`
- [ ] `components/pulse/detailed-analysis-modal.tsx`
- [ ] `components/pulse/views/home-view.tsx`
- [ ] `components/pulse/views/analytics-view.tsx`
- [ ] `components/pulse/views/clinics-view.tsx`
- [ ] `components/pulse/views/billing-view.tsx`
- [ ] `components/pulse/views/profile-view.tsx`
- [ ] `components/pulse/chat-box.tsx`
- [ ] `components/pulse/clinic-map.tsx`
- [ ] `components/pulse/auto-booking-card.tsx`

### Backend Functions to Verify:
- [ ] `convex/healthEntries.ts` - Check-in CRUD
- [ ] `convex/users.ts` - Profile management
- [ ] `convex/ai.ts` - AI analysis generation
- [ ] `convex/chat.ts` - Chat message handling
- [ ] `convex/nudges.ts` - Nudge tracking
- [ ] `convex/appointments.ts` - Appointment booking

---

**Last Updated:** February 22, 2026
