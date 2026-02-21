# Pulse — Hackathon Demo Script

**Target duration:** 4–5 minutes  
**Presenter flow:** One person drives the app, one person narrates (or solo presenter narrates while tapping)

---

## The Narrative Arc

> "Most health apps wait for you to be sick. Pulse doesn't. It watches quietly — and it notices things before you do."

The demo tells one complete user story: **Amara**, a 28-year-old woman in Lagos. She's not sick. She doesn't think anything is wrong. But something is — and Pulse catches it before it becomes serious.

---

## Scene 1 — The Problem (Verbal, No App Yet) [~30 seconds]

**Say:**
> "In this part of the world, people don't go for checkups. Not because they don't care — but because nothing feels wrong yet. By the time something feels wrong, it's often already serious. We built Pulse to close that gap."

---

## Scene 2 — Onboarding (App, Pre-filled) [~30 seconds]

**Show:** Onboarding health profile screen — already filled in with Amara's data.

**Amara's profile:**
- Age: 28, Female
- Known conditions: None
- Family history: Hypertension (father), Diabetes (maternal grandmother)
- Medications: None
- Last checkup: 14 months ago

**Say:**
> "When Amara signs up, Pulse learns her baseline — her history, her risk factors. This is what gives the AI context. Her father has hypertension. Her grandmother had diabetes. Pulse knows that."

**Tap:** "Continue" — land on home screen.

---

## Scene 3 — Home Screen [~15 seconds]

**Show:** Home screen with:
- Streak: 🔥 14 days
- Day carousel showing last 5-6 days with date jump calendar icon
- Discount tier: Regular (20% off) — 2 weeks streak
- CTA: "Complete today's check-in"

**Say:**
> "Amara has been logging for 14 days straight. Her streak is building, her discount tier is growing — she's at 20% off her next checkup. Notice the day carousel — she can tap any day to see past entries, or use the calendar to jump to a specific date. Let's see what her check-in looks like."

**Tap:** "Complete today's check-in"

---

## Scene 4 — Daily Check-in Cards (Live Swipe) [~60 seconds]

Swipe through all 9 cards briskly. Don't linger — show the speed and feel.

| Card | Amara's Input Today |
|---|---|
| Energy Level | 2 / 5 |
| Sleep | 6 hrs / Poor |
| Physical Symptoms | Lower abdomen / Ache / Mild (scrollable severity options) |
| Respiratory | None |
| Temperature | No fever |
| Mood | Low |
| Appetite | Low |
| Lifestyle | Water: No, Exercise: No, Meditation: No, Screen Time: Too much, Social: Isolated, Custom: "Skipped lunch again" |
| Open Flag | Tap preset "Feeling a bit off today" (horizontally scrolling options) |

**Say (while swiping):**
> "Nine cards. Under 60 seconds. No forms, no typing — just taps. Each answer is a clean data point. Energy, sleep, symptoms, mood, appetite. Notice the horizontal scrolling preset buttons and custom input fields — fast but flexible. One interaction per card."

**After last card — completion screen shows:**
> "✓ Entry logged. 14-day streak maintained."

---

## Scene 5 — The History View [~30 seconds]

**Show:** Amara's 14-day log summary view — a simple timeline or grid showing entries.

**Highlight (tap on a few entries to show individual days):**
- Days 1–3: Energy 3–4, normal mood, no symptoms
- Days 4–7: Energy starts dipping (2–3), sleep worsening
- Days 8–14: Energy consistently 2, low mood, appetite dropping, lower abdomen ache appearing in days 10, 12, 14

**Say:**
> "Look at this individually and nothing screams danger. A bit tired. Didn't sleep great. Mild stomach ache. We've all had weeks like this. But watch what happens when the AI looks at all of it together."

---

## Scene 6 — The AI Analysis Card 🔑 [~60 seconds]

**Show:** After check-in completion, home screen reloads with new AI Analysis card
- Beautiful gradient card (indigo/purple) with Sparkles icon
- "AI Analysis Available — Tap to view today's insights"
- Card pulses subtly to draw attention

**Say:**
> "Notice what just appeared. The AI has analyzed Amara's check-in. Let's see what it found."

**Tap:** AI Analysis card

**Show:** Full-screen modal with loading state: "Analyzing your recent entries..."

**Use Gemini API streaming** — the alert text streams in word by word, live, in real time. This is the moment that lands with judges.

**Streamed analysis text:**
> "Over the past 14 days, we've noticed a consistent pattern in your entries: sustained low energy, disrupted sleep, reduced appetite, recurring mild discomfort in your lower abdomen, social isolation, and low mood — appearing together across multiple days.
>
> On its own, each of these is easy to brush off. Together, and given your family history of hypertension and diabetes, this combination is worth paying attention to.
>
> This isn't a diagnosis — but it's a signal worth checking. We'd recommend a basic checkup soon."
Enhanced Clinic Search & Booking [~45 seconds]

**Navigate:** Tap "Clinics" tab from bottom navigation

**Show:** Enhanced clinics view with:
- Search bar: "Search clinics or specialties..."
- Filter icon (sliders) in top right
- "12 clinics available" count
- Sorted list of partner clinics

**Say:**
> "Pulse partners with clinics across the city. Users can search by name or specialty, filter by distance, rating, or discount percentage, and sort results. Let's find Amara a clinic nearby."

**Tap:** Filter icon → **Show:** Advanced filter sheet
- Sort by: Distance / Rating / Discount
- Max distance slider (set to 5km)
- Min rating slider (set to 4.5 stars)
- Specialty filter buttons

**Say:**
> "She wants high-rated clinics within 5km. Let's apply that."

**Tap:** "Apply" → **Show:** Filtered results (2 clinics):
- **City Wellness Clinic** — 2.3km away — ⭐ 4.8 — 20% off badge
- **MedPlus Health Centre** — 4.1km away — ⭐ 4.6 — 20% off badge

**Tap:** City Wellness Clinic → booking detail screen with:
- Clinic detaAuto-Booking Agent (NEW) [~30 seconds]

*Show this for advanced demo or if time permits*

**Scenario:** Amara dismisses the checkup nudge 3 times over the next week. On the 4th nudge:

**Show:** Auto-booking card appears on home screen
- Calendar icon with "Auto-Booked Visit" header
- Clinic: City Wellness Clinic
- Date: 3 days from now
- Time: 10:00 AM
- Status: Pending
- Info: "After 3 health nudges, we've auto-booked this appointment. Your 100% discount covers this visit."
- Buttons: Cancel / Modify / Confirm

**Say:**
> "Here's where it gets interesting. Amara keeps dismissing the nudge. She's busy, she'll do it later. But Pulse knows procrastination is the real enemy. After 3 dismissed nudges, the agent auto-books an appointment for her — 3 days out. She has full control to modify the date, time, clinic, or cancel entirely. But the friction is removed. The appointment is there. All she has to do is show up."

**Tx] Onboarding health profile screen (pre-fillable for demo)
- [x] Home screen (streak, day carousel with date jump, discount tier, CTA)
- [x] Daily check-in card stack (all 9 cards, swipeable)
- [x] Check-in completion screen (streak confirmation)
- [x] 14-day history view via day carousel (Amara's mock data)
- [x] AI analysis card on home screen (appears after check-in)
- [x] AI analysis modal (streaming text via Gemini)
- [x] Enhanced clinics view (search bar, advanced filters)
- [x] Partner clinic listing screen (filtered/sorted results)
- [x] Clinic detail / booking screen (discount code display)
- [x] Auto-booking card (appears after 3+ nudges)
- [x] Amara's onboarding profile (in mock-data.ts)
- [x] Amara's 14-day entry log (mock JSON dataset)
- [x] AI prompt + system context (using Amara's profile + log)
- [x] Multiple mock partner clinics with details (12+)
- [x] Mock nudge history for auto-booking demo
- [x] Auto-booking logic and discount tier calculation
> "Pulse works because it meets people where they are. No wearables. No clinic visits to start. Just 60 seconds a day — that most people will actually do, because they're being rewarded for it.
>
> The AI watches patterns. The agent removes procrastination. The clinics get qualified, engaged patients. And users get something no other app gives them: early detection without paranoia.
>
> Users pay a subscription. Clinics pay to receive

**Tap:** City Wellness Clinic → booking screen with:
- 20% discount applied automatically
- Unique redemption code generated: `PULSE-AMR-2024`
- "Show this code at the clinic reception"

**Say:**
> "Amara's 14 days of logging just earned her 20% off. She books the appointment right here. The clinic gets a patient. She gets peace of mind. And we've completed the loop — from daily habit to actual healthcare action."

---

## Scene 8 — The Model (Verbal Close) [~30 seconds]

*Optional: switch to a single summary slide*
x] Google Gemini API set up and key configured
- [x] System prompt written and tested
- [x] Streaming response rendering in analysis modal
- [x] Output tested against Amara's mock data to confirm it flags correctly
- [x] Pattern detection logic for auto-booking nudges
> Users pay a subscription. Clinics pay to receive engaged, referred patients. As the dataset grows, population health insights become a third revenue stream.
>
> We're not building another health app. We're building the habit layer that makes preventive healthcare actually happen."

---

## Demo Build Checklist

Everything the demo requires to exist:

### Screens to build
- [ ] Onboarding health profile screen (pre-fillable for demo)
- [ ] Home screen (streak, score, discount tier, CTA)
- [ ] Daily check-in card stack (all 8 cards, swipeable)
- [ ] Check-in completion screen (streak confirmation, points)
- [ ] 14-day history view (Amara's mock data)
- [ ] AI analysis loading state
- [ ] AI alert screen (streaming text via Vercel AI SDK)
- [ ] Partner clinic listing screen (2 mock clinics)
- [ ] Clinic detail / booking screen (discount code display)

### Data to prepare
- [ ] Amara's onboarding profile (hardcoded)
- [ ] Amara's 14-day entry log (mock JSON dataset)
- [ ] AI prompt + system context (using Amara's profile + log)
- [ ] 2 mock partner clinics with details

### AI integration
- [ ] Google Gemini API set up and key configured
- [ ] System prompt written and tested
- [ ] Streaming response rendering in alert screen
- [ ] Output tested against Amara's mock data to confirm it flags correctly

### What to fake / hardcode
- Auth flow (skip or pre-login as Amara)
- Real database (mock data in JSON files)
- Payment / subscription (show tier as already active)
- Real clinic booking (show confirmation screen as static)

---

## Amara's 14-Day Mock Dataset

```json
[
  { "day": 1, "energy": 4, "sleep_hrs": 7, "sleep_quality": "good", "symptoms": [], "respiratory": [], "fever": false, "mood": 4, "appetite": "normal", "digestion": "normal", "bowel_change": false, "water": true, "exercise": true, "note": "" },
  { "day": 2, "energy": 4, "sleep_hrs": 7, "sleep_quality": "okay", "symptoms": [], "respiratory": [], "fever": false, "mood": 3, "appetite": "normal", "digestion": "normal", "bowel_change": false, "water": true, "exercise": false, "note": "" },
  { "day": 3, "energy": 3, "sleep_hrs": 6, "sleep_quality": "okay", "symptoms": [], "respiratory": [], "fever": false, "mood": 3, "appetite": "normal", "digestion": "normal", "bowel_change": false, "water": true, "exercise": false, "note": "" },
  { "day": 4, "energy": 3, "sleep_hrs": 6, "sleep_quality": "poor", "symptoms": [], "respiratory": [], "fever": false, "mood": 3, "appetite": "low", "digestion": "normal", "bowel_change": false, "water": false, "exercise": false, "note": "" },
  { "day": 5, "energy": 3, "sleep_hrs": 5, "sleep_quality": "poor", "symptoms": [{ "location": "lower_abdomen", "type": "ache", "intensity": "mild" }], "respiratory": [], "fever": false, "mood": 2, "appetite": "low", "digestion": "bloating", "bowel_change": false, "water": false, "exercise": false, "note": "Felt a bit crampy" },
  { "day": 6, "energy": 2, "sleep_hrs": 6, "sleep_quality": "poor", "symptoms": [], "respiratory": [], "fever": false, "mood": 2, "appetite": "low", "digestion": "normal", "bowel_change": false, "water": false, "exercise": false, "note": "" },
  { "day": 7, "energy": 2, "sleep_hrs": 5, "sleep_quality": "poor", "symptoms": [], "respiratory": [], "fever": false, "mood": 2, "appetite": "low", "digestion": "bloating", "bowel_change": false, "water": true, "exercise": false, "note": "" },
  { "day": 8, "energy": 2, "sleep_hrs": 6, "sleep_quality": "poor", "symptoms": [{ "location": "lower_abdomen", "type": "ache", "intensity": "mild" }], "respiratory": [], "fever": false, "mood": 2, "appetite": "low", "digestion": "discomfort", "bowel_change": false, "water": false, "exercise": false, "note": "" },
  { "day": 9, "energy": 3, "sleep_hrs": 7, "sleep_quality": "okay", "symptoms": [], "respiratory": [], "fever": false, "mood": 3, "appetite": "normal", "digestion": "normal", "bowel_change": false, "water": true, "exercise": false, "note": "" },
  { "day": 10, "energy": 2, "sleep_hrs": 5, "sleep_quality": "poor", "symptoms": [{ "location": "lower_abdomen", "type": "ache", "intensity": "mild" }], "respiratory": [], "fever": false, "mood": 2, "appetite": "low", "digestion": "bloating", "bowel_change": false, "water": false, "exercise": false, "note": "Tired again" },
  { "day": 11, "energy": 2, "sleep_hrs": 6, "sleep_quality": "poor", "symptoms": [], "respiratory": [], "fever": false, "mood": 2, "appetite": "low", "digestion": "discomfort", "bowel_change": false, "water": false, "exercise": false, "note": "" },
  { "day": 12, "energy": 2, "sleep_hrs": 5, "sleep_quality": "poor", "symptoms": [{ "location": "lower_abdomen", "type": "ache", "intensity": "mild" }], "respiratory": [], "fever": false, "mood": 2, "appetite": "low", "digestion": "bloating", "bowel_change": false, "water": false, "exercise": false, "note": "" },
  { "day": 13, "energy": 2, "sleep_hrs": 6, "sleep_quality": "poor", "symptoms": [], "respiratory": [], "fever": false, "mood": 2, "appetite": "low", "digestion": "normal", "bowel_change": false, "water": false, "exercise": false, "note": "Just feeling off" },
  { "day": 14, "energy": 2, "sleep_hrs": 6, "sleep_quality": "poor", "symptoms": [{ "location": "lower_abdomen", "type": "ache", "intensity": "mild" }], "respiratory": [], "fever": false, "mood": 2, "appetite": "low", "digestion": "bloating", "bowel_change": false, "water": false, "exercise": false, "note": "Just feeling a bit off again" }
]
```

---

## AI Prompt (Draft)

**System prompt:**
```
You are Pulse, a preventive health companion. Your role is to analyse a user's daily health logs over time and identify emerging patterns that may warrant medical attention — without diagnosing, alarming, or replacing professional medical advice.

You speak like a caring, informed friend. Never use clinical jargon. Never say "you have X." Always say "this may be worth checking" or "it could be worth mentioning to a doctor."

When a pattern is significant enough to flag, respond in the following JSON format only:
{
  "flag": true,
  "tier": "soft-nudge" | "check-in-prompt" | "urgent",
  "pattern_summary": "brief clinical description of the pattern for internal use",
  "user_message": "the warm, plain-language message shown to the user — 3 to 5 sentences",
  "recommended_action": "specific next step for the user",
  "confidence": "low" | "moderate" | "high"
}

If no significant pattern exists, respond with:
{ "flag": false }

Never include anything outside the JSON object.
```

**User message structure:**
```
User health profile:
- Age: 28, Sex: Female
- Known conditions: None
- Family history: Hypertension (father), Diabetes (maternal grandmother)
- Current medications: None

Daily health log (last 14 days):
[INSERT AMARA'S JSON LOG HERE]

Analyse this log for any emerging symptom patterns that warrant attention. Cross-reference with the user's health profile and risk factors.
```
