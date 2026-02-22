# Pulse — Product Specification

**Version:** 0.1 (Hackathon Draft)
**Last Updated:** February 21, 2026

---

## 1. The Problem

Healthcare in this region is almost entirely reactive. People visit clinics when they are already sick, and serious conditions are frequently caught too late. The dominant reason is not ignorance — it is behavior. People know they should get checkups. They don't go anyway.

Standard health apps have not solved this. They either require expensive wearables, demand too much effort, or appeal only to users who were already health-conscious. None of them meet people where they actually are.

---

## 2. The Solution

**Pulse** is a preventive health companion that disguises passive health surveillance as a simple daily habit.

Users complete a 60-second structured daily check-in — not a diary, not a chat, but a swipeable card interface that feels more like a mini-game than a form. Over time, an embedded AI layer reads the accumulation of entries and quietly detects when symptom patterns warrant attention. Users are nudged, not alarmed, and rewarded with real discounts at partner clinics for staying consistent.

The core insight: people won't go for checkups, but people will report how they feel. Pulse formalizes that.

---

## 3. Target Users

**Primary:** Adults aged 20–45 in urban/semi-urban areas, smartphone-literate, not actively managing a chronic illness, not currently using any health tracking tool.

**Secondary:** Individuals managing known chronic conditions (hypertension, diabetes, asthma) who need a lightweight daily logging tool.

**Not the target (for MVP):** Elderly users requiring caregiver mediation, children, or users without smartphone access.

---

## 4. Core Features

### 4.1 Onboarding Health Profile

Collected once at sign-up. This is the AI's baseline — without it, pattern detection has no context.

| Field | Input Type | Why It Matters |
|---|---|---|
| Age, Sex, Height, Weight | Number / Select | Baseline biometrics; BMI context |
| Known diagnoses | Multi-select (+ custom) | Contextualises all future entries |
| Current medications | Text list | Tracks adherence; flags interactions |
| Family history | Multi-select | Risk stratification (diabetes, hypertension, heart disease, cancer) |
| Smoking status | Select | Baseline lifestyle marker |
| Alcohol use | Select | Baseline lifestyle marker |
| Blood type | Select (optional) | Emergency utility |
| Last checkup date | Date picker | Sets urgency baseline |

> The profile also drives personalisation of daily cards. A user with asthma sees respiratory prompts more prominently. A diabetic user is prompted to log blood sugar readings if they have a device.

---

### 4.2 Daily Check-In Cards

A full-screen swipeable card stack. One interaction per card. No scrolling. No forms. Progress bar visible throughout. Target: under 60 seconds.

---

**Card 1 — Energy Level**
- Input: Tap to select 1–5 (with simple icons, not just numbers)
- Tracks: Fatigue trends over time
- Flags: Anaemia, thyroid dysfunction, early depression, burnout

---

**Card 2 — Sleep**
- Input: Number tap for hours + one-tap quality (Poor / Okay / Good)
- Tracks: Sleep consistency and quality trends
- Flags: Insomnia patterns, sleep apnea indicators, mood correlation

---

**Card 3 — Physical Symptoms**
- Input: Tap on a simple front/back body outline to mark location, then select symptom type (Pain / Ache / Numbness / Tingling / Swelling / Rash / Other) and intensity (Mild / Moderate / Severe)
- Tracks: Location + type + intensity over time
- Flags: Recurring localised symptoms, spreading patterns, neurological indicators
- Note: Capturing *type* alongside *location* is critical for AI accuracy

---

**Card 4 — Respiratory Check**
- Input: Multi-select from (None of the above / Cough / Shortness of breath / Chest tightness / Wheezing / Runny nose / Sore throat)
- Tracks: Respiratory symptom frequency and clustering
- Flags: Early respiratory infection, asthma exacerbation, cardiac indicators (when combined with other cards)

---

**Card 5 — Temperature / Fever**
- Input: Toggle (Feeling feverish? Yes / No / Not sure) + optional numeric input if they have a thermometer
- Tracks: Fever occurrence and frequency
- Flags: Infection patterns, immune response trends, post-travel illness indicators

---

**Card 6 — Mood & Mental State**
- Input: Emoji-based 5-option scale (Very Low → Great)
- Tracks: Mental health baseline and deviation
- Flags: Sustained low mood (depression indicator), mood volatility, correlation with physical symptoms

---

**Card 7 — Appetite, Digestion & Bowel**
- Input: Appetite (Normal / Low / Unusually High) + Digestion (Normal / Nausea / Bloating / Discomfort) + Bowel changes toggle (Any unusual changes today? Yes / No)
- Tracks: Digestive health consistency
- Flags: Appetite loss patterns, GI distress clusters, potential liver/kidney indicators (bowel/urine color changes surfaced via follow-up if "Yes" tapped)

---

**Card 8 — Lifestyle Snapshot**
- Input: Quick toggles — Hydration (Did you drink enough water?), Exercise (Any physical activity?), Medications (Did you take your meds today? — *only shown if user listed medications in profile*)
- Tracks: Lifestyle consistency and medication adherence
- Flags: Medication skips (critical for chronic condition users), dehydration patterns

---

**Card 9 — Open Flag** *(Optional)*
- Input: Short text or voice note — "Anything unusual today?"
- Purpose: Catch what structured questions miss; keeps AI grounded in the user's own language
- AI usage: Processed as supplementary context alongside structured data

> **Note on card count:** 8 structured + 1 optional. The core daily experience is Cards 1–8. Each is a single interaction. Real-world timing target remains under 60 seconds.

---

### 4.3 AI Pattern Detection Layer

**What it is not:** A diagnostic tool. Pulse never diagnoses.

**What it does:** Reads the accumulating structured data log per user and identifies clusters of symptoms across time that statistically deviate from the user's personal baseline or align with known early-warning patterns.

**Data inputs per detection run:**
- Full entry history (structured fields)
- Onboarding health profile (baseline and risk factors)
- Rolling 7-day and 30-day trend summaries

**Detection logic (MVP approach):**
- LLM-based (Google Gemini via API) prompted with a structured user health log
- Prompt instructs the model to: identify any emerging multi-symptom patterns, cross-reference against the user's known conditions and risk factors, and output a flag only when pattern confidence meets a defined threshold
- Output is not shown raw to the user — it feeds a human-readable gentle alert

**Tone principle:** Every alert should feel like a caring friend noticing something, not a WebMD warning. The language should never induce panic. It should always close with a recommended action (e.g., "it might be worth mentioning this at your next visit").

---

### 4.4 Alert & Escalation System

Three alert tiers:

| Tier | Trigger | Action |
|---|---|---|
| **Soft Nudge** | Mild pattern emerging (e.g., 5 days of low energy + poor sleep) | In-app notification: "We've noticed X over the past few days. Keep logging — we're keeping an eye on it." |
| **Check-in Prompt** | Moderate pattern (e.g., recurring symptoms in same location across 2 weeks) | Push notification + in-app card: "Based on your recent entries, it might be worth a quick checkup. Your current discount gets you Y% off at [Partner Clinic]." |
| **Urgent Flag** | Severe pattern (e.g., chest tightness + breathlessness + fatigue cluster) | High-visibility in-app alert + option to book immediately or contact telemedicine partner. Clear language: "This combination of symptoms should be reviewed by a doctor promptly." |

> Urgent flags should also optionally notify an emergency contact if the user has opted in.

---

### 4.5 Loyalty & Discount System

The behavioral engine that converts consistent journaling into clinic visits.

**Tier structure:**

| Tier | Requirement | Benefit |
|---|---|---|
| **Starter** | 1–4 weeks of consistent logging | 10% off at partner clinics |
| **Regular** | 1–3 months consistent | 20% off + priority booking |
| **Committed** | 3–6 months consistent | 30% off + one free basic checkup per year |
| **Champion** | 6+ months consistent | 40% off + free annual checkup + premium AI insights |

**Consistency definition:** Logging at least 5 out of 7 days in a week counts as a consistent week. This prevents the system from being punitive about life getting in the way.

**Discount redemption:** QR code or unique code generated in-app, redeemable at any listed partner clinic. Codes are single-use and time-limited (30 days from generation).

---

### 4.6 Gamification Layer

Every element serves the product mission — nothing is decorative.

| Mechanic | Implementation | Why It Works |
|---|---|---|
| **Streaks** | Daily log streak counter, visible on home screen | Loss aversion — users open the app to protect their streak |
| **Health Points** | Earned per entry; directly accelerate discount tier progress | Real-world financial reward tied to consistency |
| **Milestone Badges** | 7 days, 30 days, 90 days, 6 months | Moments of recognition; shareable on WhatsApp/Instagram |
| **Health Consistency Score** | Personal score (0–100) reflecting engagement recency, completeness, and clinic visit history | Users develop identity around the score and work to maintain it |
| **Health Circles** | Optional groups (friends/family) who see each other's streaks — not journal content | Social accountability without privacy violation |
| **Weekly Summary** | Auto-generated end-of-week card: "Your week in health" | Reinforces habit, surfaces trends the user noticed themselves |

---

### 4.7 Partner Clinic Network

The supply side of the two-sided marketplace.

**For clinics:**
- Listed on the app's partner directory
- Receive referred, health-engaged patients (high-value acquisition)
- Access to anonymised aggregate health trend data for their area (premium tier)
- Pay a listing/partnership fee or a per-referral commission

**For users:**
- Browse nearby partner clinics
- See available discounts based on their tier
- Book directly through the app (or get a referral code for walk-in)

**MVP requirement:** Minimum 2–3 committed partner clinics before launch. For the hackathon, even a Letter of Intent from one clinic validates the model.

---

## 5. Revenue Model

| Stream | Source | Model |
|---|---|---|
| **User Subscriptions** | End users | Monthly/annual subscription to access AI insights and accumulate discount tiers |
| **Clinic Partnerships** | Healthcare providers | Monthly listing fee + optional per-referral commission |
| **Data Insights (Future)** | Clinics, insurers, public health bodies | Anonymised, aggregated population health trend reports |

---

## 6. Privacy & Data Principles

- Health journal data is among the most sensitive personal data that exists. This must be treated accordingly.
- All data encrypted in transit and at rest
- Users own their data — full export and deletion available at any time
- AI processing occurs on anonymised/pseudonymised records
- No data sold to third parties. Ever. (This is a trust product — violating this is existential.)
- Compliance with applicable local data protection regulations

---

## 7. Technical Architecture (High Level)

### Frontend
- Mobile-first (React Native for cross-platform iOS/Android)
- Card-swipe interaction design (no scrolling forms)
- Offline-first for daily entry (sync when connected)

### Backend
- Node.js / Python API layer
- PostgreSQL for structured health data
- Time-series optimised queries for pattern detection
- Firebase or similar for push notifications

### AI Layer
- Google Gemini API for pattern analysis
- Prompt engineering: structured health log → pattern detection → alert generation
- Analysis triggered: on each new entry (lightweight check) + full weekly analysis job
- Future: fine-tuned model on anonymised in-app data

### Integrations (MVP)
- Telemedicine API (for urgent escalation path)
- Maps API (for clinic discovery)
- Payment gateway (subscription billing)

---

## 8. MVP Scope (Hackathon)

What to actually build for the demo:

| Feature | Include in MVP |
|---|---|
| Onboarding health profile | ✅ |
| Daily check-in card stack (Cards 1–8) | ✅ |
| Streak counter | ✅ |
| AI pattern detection (LLM-based, demo data) | ✅ |
| Soft nudge + check-in prompt alerts | ✅ |
| Discount tier display | ✅ (static/simulated) |
| Partner clinic listing | ✅ (1–2 mock partners) |
| Health Circles | ❌ (post-MVP) |
| Telemedicine integration | ❌ (post-MVP) |
| Real payment/billing | ❌ (post-MVP) |

---

## 9. Hackathon Demo Flow

The demo needs one powerful storytelling moment. Here is the recommended narrative arc:

1. **Show onboarding** — user sets up their profile (30 seconds). Establishes that the app knows who this person is.
2. **Show the daily card stack** — swipe through all 8 cards live. Emphasise the speed and feel. "This is 60 seconds, every morning."
3. **Show the history view** — a simulated user with 14 days of entries. Point out that individually, nothing looks alarming.
4. **The AI moment** — trigger the pattern detection on the simulated data. Show the alert surface: "Over the past 12 days, we've noticed recurring fatigue, reduced appetite, and mild discomfort in your upper abdomen. This combination can sometimes be an early indicator of something worth checking. Your 20% discount is ready to use at City Wellness Clinic."
5. **Show the discount** — the user taps through to the clinic and redeems. The loop is complete.
6. **Close with the model** — one slide: users pay subscriptions, clinics pay for referrals, everyone wins.

---

## 10. Open Questions

- [ ] What is the minimum viable AI prompt structure for reliable pattern detection?
- [ ] How should the app handle a user who flags a severe symptom but ignores the urgent alert?
- [ ] Streak forgiveness mechanic — how many missed days before tier is affected?
- [ ] Should the app support WhatsApp-based journaling as an alternative input channel?
- [ ] Regulatory considerations — does the app need any medical device or health app certification locally?
- [ ] What does the clinic onboarding/sales process look like?
