# Pulse — Hackathon Demo Script

**Recording notes:** Silent demo video with on-screen actions only. No voiceover needed.

---

## Demo Story Flow

This demo shows the complete preventive health journey for **Amara**, a 28-year-old woman in Lagos who has been using Pulse for the past 14 days. The story demonstrates how Pulse catches health issues early through pattern detection across daily check-ins, and guides users through the entire journey from detection to booking a checkup.

---

## Scene 1 — User Onboarding [~20 seconds]

**Show:** Onboarding health profile screen — already filled in with Amara's data.

**Amara's profile:**
- Age: 28, Female
- Known conditions: None
- Family history: Hypertension (father), Diabetes (maternal grandmother)
- Medications: None
- Last checkup: 14 months ago

**Action:** Tap "Continue" to proceed to home screen.

**Note:** This shows how Pulse collects baseline health context during onboarding. The AI will use this profile data (family history, medications, conditions, last checkup date) in all future analyses.

---

## Scene 2 — Home Screen with Historical Data [~45 seconds]

**Show:** Home screen displaying:
- Streak: 🔥 14 days
- Day carousel showing last 6 days with calendar icon for date jumping
- Discount tier: Regular (20% off) — 2 weeks streak
- Past check-in data available

**Action:** Navigate the streak capsules to show previous 14 days of check-in entries.

**Historical pattern to demonstrate (last 14 days):**
- **Days 1-3:** Energy 4/5, Sleep good (7-8hrs), Mood positive, No symptoms
- **Days 4-7:** Energy starts dipping to 3/5, Sleep slightly reduced (6-7hrs), Mood neutral, Occasional mild headaches
- **Days 8-11:** Energy drops to 2/5, Sleep poor (5-6hrs), Mood low, Lower abdomen discomfort (mild) appears on day 10
- **Days 12-14:** Energy consistently 2/5, Sleep very poor (4-5hrs), Mood low, Lower abdomen ache recurring on days 12 and 14, Appetite reduced, Social isolation noted

**Action:** Tap on different days in the carousel (or use calendar to jump to specific dates) to show individual check-in entries and their corresponding AI analysis results from those days.

**Show for each past day:**
- The specific check-in data entered that day
- The AI analysis result/response for that day (showing how AI tracked gradual changes)

**Note:** The AI analysis for earlier days (Days 1-7) should show generally positive assessments. Days 8-11 should show mild concern notes. Days 12-14 should show increasing concern about the pattern forming. This demonstrates how Pulse watches patterns develop over time rather than reacting to single-day data.

---

## Scene 3 — Today's Daily Check-in [~60 seconds]

**Action:** From home screen, tap "Complete today's check-in" button.

**Complete all 9 cards with Amara's Day 15 data:**

| Card | Amara's Input Today (Day 15) |
|---|---|
| Energy Level | 2 / 5 |
| Sleep | 4.5 hrs / Very Poor |
| Physical Symptoms | Lower abdomen / Ache / Moderate (use scrollable severity options) |
| Respiratory | None |
| Temperature | Slight fever (37.8°C) |
| Mood | Low / Anxious |
| Appetite | Very Low |
| Lifestyle | Water: No, Exercise: No, Meditation: No, Screen Time: Too much, Social: Isolated, Custom: "Skipped both lunch and breakfast" |
| Open Flag | Use horizontally scrolling presets, select "Feeling unwell" |

**Action:** Swipe through all cards showing the inputs. After last card, completion screen appears with streak confirmation.

**Note:** This is Day 15, and the data shows concerning escalation from previous days — fever now present, sleep worsening to 4.5hrs, symptoms intensifying to moderate, appetite very low, skipping multiple meals. This should trigger the AI to raise a concern and recommend checkup.

---

## Scene 4 — AI Analysis with Concern & Recommendation [~60 seconds]

**Show:** After check-in completion, home screen reloads with AI Analysis card appearing
- Gradient card (indigo/purple) with Sparkles icon
- "AI Analysis Available — Tap to view today's insights"
- Card pulses to draw attention

**Action:** Tap the AI Analysis card

**Show:** Analysis result screen (overview/summary view) with:

**AI Analysis Overview (pre-generated when check-in completed):**
> "Over the past 14 days, we've noticed a consistent and escalating pattern: sustained low energy (dropping from 4/5 to 2/5), progressively disrupted sleep (from 7-8hrs to 4.5hrs), reduced appetite, recurring moderate discomfort in your lower abdomen (appearing on days 10, 12, 14, and now 15 with increased intensity), social isolation, low mood, and now a slight fever.
>
> On its own, each of these is easy to brush off. Together, and given your family history of hypertension and diabetes, plus the fact that your last checkup was 14 months ago, this combination warrants medical attention.
>
> This isn't a diagnosis — but it's a signal worth checking. We strongly recommend a checkup soon."

**Show two buttons on this screen:**
1. **"Book Clinic Visit"** — routes to clinics tab with relevant context
2. **"See Detailed Analysis"** — opens detailed analysis modal

**Note:** This is the first nudge. Nudge count = 1. The app should track this nudge in the background.

---

## Scene 5 — Detailed Analysis Modal [~60 seconds]

**Action:** Tap "See Detailed Analysis" button

**Show:** Full detailed analysis modal with well-structured JSON-like data presentation:

**Detailed AI Analysis Structure:**

**Pattern Detection Summary:**
- Duration: 14 days (with escalation noted over last 7 days)
- Concerning metrics: Energy, Sleep, Physical Symptoms, Appetite, Mood, Temperature

**Day-by-Day Analysis with Citations:**

**Energy Decline:**
- Days 1-3: Average 4/5 (normal baseline)
- Days 4-7: Average 3/5 (mild decline noted)
- Days 8-14: Average 2/5 (significant sustained decline)
- Day 15: 2/5 (continues concerning pattern)
- **Assessment:** Progressive energy decline over 2 weeks suggests underlying issue

**Sleep Disruption:**
- Days 1-3: 7-8 hours (healthy range)
- Days 4-7: 6-7 hours (mild reduction)
- Days 8-11: 5-6 hours (poor quality noted)
- Days 12-15: 4-5 hours (severely disrupted)
- **Referenced entries:** Day 8, Day 10, Day 13, Day 15
- **Assessment:** Sleep quality degradation correlates with symptom onset

**Physical Symptoms — Lower Abdomen:**
- First appearance: Day 10 (mild ache)
- Recurrence: Day 12 (mild ache)
- Recurrence: Day 14 (mild ache)
- Current: Day 15 (moderate ache — intensity increased)
- **Assessment:** Recurring localized discomfort in same area over 6 days requires evaluation

**Appetite & Nutrition:**
- Days 1-7: Normal appetite
- Days 8-11: Reduced appetite
- Days 12-14: Low appetite, occasional meal skipping
- Day 15: Very low appetite, skipped breakfast and lunch
- **Assessment:** Nutritional intake declining alongside other symptoms

**Temperature:**
- Days 1-14: No fever
- Day 15: Slight fever (37.8°C)
- **Assessment:** New symptom emergence alongside existing pattern is significant

**Mood & Mental Health:**
- Days 1-3: Positive mood
- Days 4-7: Neutral mood
- Days 8-15: Consistently low mood, social isolation noted
- **Assessment:** Sustained low mood for 8 days alongside physical symptoms

**Risk Factors from Health Profile:**
- Family history: Hypertension (father), Diabetes (maternal grandmother)
- Last checkup: 14 months ago (overdue for routine screening)
- Age: 28 (reproductive health considerations for abdominal symptoms)

**Recommendation:**
> "Based on the 14-day pattern analysis, we recommend scheduling a checkup within the next 2-3 days. The combination of escalating physical symptoms (lower abdomen discomfort with fever), sustained energy/sleep disruption, and appetite decline — particularly given your family history and overdue checkup status — warrants professional evaluation. Possible areas for investigation: reproductive health, gastrointestinal issues, or early infection."

**Suggested Clinic Specialties:** General practice, Women's health, Gastroenterology

**Action:** Close detailed analysis modal to return to previous screen (the overview/summary screen with the two buttons).

**Note:** This detailed analysis demonstrates how the AI thinks through the data, references specific days, shows its reasoning process, and explains WHY the user should see a doctor. Everything makes sense and connects to the 14-day pattern we showed earlier.

---

## Scene 6 — Booking Clinic Visit (1st Path) [~60 seconds]

**Action:** From the analysis overview screen, tap "Book Clinic Visit" button

**Show:** App navigates to Clinics tab, carrying relevant context from analysis (suggested specialties: general practice, women's health, gastroenterology)

**Show:** Enhanced clinics view with:
- Search bar: "Search clinics or specialties..."
- Filter icon (sliders) in top right
- "12 clinics available" count
- Context banner at top: "Based on your recent analysis, we recommend clinics with General Practice or Women's Health services"
- Sorted list of partner clinics

**Action:** Tap filter icon

**Show:** Advanced filter sheet with:
- Sort by: Distance / Rating / Discount
- Max distance slider (set to 5km)
- Min rating slider (set to 4.5 stars)
- Specialty filter chips: General Practice ✓, Women's Health ✓, Gastroenterology ✓
- Apply button

**Action:** Set filters (5km distance, 4.5+ rating, relevant specialties) and tap "Apply"

**Show:** Filtered results (2-3 clinics):
- **City Wellness Clinic** — 2.3km away — ⭐ 4.8 — Women's Health, General Practice — 20% off badge
- **MedPlus Health Centre** — 4.1km away — ⭐ 4.6 — General Practice, Gastroenterology — 20% off badge
- **HealthFirst Medical** — 4.8km away — ⭐ 4.7 — Women's Health — 20% off badge

**Action:** Demonstrate search feature by typing "Women's Health" in search bar — results filter to show only relevant clinics

**Action:** Tap City Wellness Clinic card

**Show:** Clinic detail screen with:
- Clinic name, address, and embedded map (or geocoded address display with coordinates)
- Specialties: Women's Health, General Practice
- Rating: 4.8 stars (124 reviews)
- Distance: 2.3km away
- Pricing: ₦15,000 for general checkup
- Discount applied: 20% off (Amara's current tier)
- Final price: ₦12,000
- Unique redemption code: `PULSE-AMR-2024`
- "Show this code at clinic reception" note
- Available time slots for booking
- "Book Appointment" button

**Action:** Select a time slot (e.g., Tomorrow, 10:00 AM) and tap "Book Appointment"

**Show:** Payment processing screen (mock UI — no real integration)
- Payment summary: ₦12,000
- Payment method selection: Card / Bank Transfer / Pay at Clinic
- Mock payment success screen: "Appointment Booked Successfully"
- Confirmation details displayed

**Note:** This completes the first path — user saw analysis, viewed detailed breakdown, decided to book immediately. The app should track that this nudge was acted upon (user went for checkup). The system should mark nudge as "resolved" and not count towards auto-booking threshold.

---

## Scene 7 — Feedback Loop Demo (Alternative Path) [~45 seconds]

**Setup:** This demonstrates what happens if the user had ignored the nudge instead of booking immediately.

**Show:** Next day (Day 16) - User returns to app and tries to complete daily check-in

**Show:** Before check-in starts, a feedback modal appears:
- "We noticed we recommended a checkup yesterday. Have you been able to book or go for your checkup yet?"
- Two options: "Yes, I've booked/gone" or "Not yet"

**Path A — If user selects "Yes, I've booked/gone":**

**Show:** Follow-up questions:
- "That's great! Which clinic did you visit?"
- "Would you mind sharing your doctor's report with us? (This helps us improve our AI accuracy)" — with polite/subtle tone
- File upload option or "Skip for now" button

**Action:** User can upload doctor's report (mock file upload) or skip

**Show:** Thank you message: "Thanks for the feedback! We'll use this to improve our health insights for you."

**Note:** The app tracks this as validation data:
- If uploaded: Store as "doctor_report" linked to the analysis that triggered the nudge
- Track outcome: Was the AI's hunch correct (true positive) or false alarm (false positive)?
- This data becomes context for future daily check-in analyses
- Nudge count resets to 0

**Path B — If user selects "Not yet":**

**Show:** Gentle reminder message: "No problem! Remember to prioritize your health. The recommendation is still available in your analysis history."

**Note:** Nudge count increases: Nudge count = 2 (previous nudge + this ignored nudge)

**Show:** After 3 ignored nudges across multiple days, auto-booking feature activates (demonstrated in next scene)

---

## Scene 8 — Auto-Booking Agent (After 3+ Ignored Nudges) [~45 seconds]

**Setup:** Amara has now ignored the checkup nudge 3 times over the past week. She keeps saying "Not yet" to the feedback loop.

**Show:** Home screen with Auto-Booking card appearing:

**Auto-Booking Card:**
- Calendar icon with "Auto-Booked Visit" header
- Clinic: City Wellness Clinic
- Date: 3 days from now
- Time: 10:00 AM
- Status: Pending Confirmation
- Info banner: "After 3 health nudges, we've auto-booked this appointment for you. Your 100% discount covers this visit completely — no payment needed."
- Three action buttons: "Cancel" / "Modify" / "Confirm"
- Small "Why did this happen?" info icon

**Action:** Tap "Why did this happen?" info icon

**Show:** Explanation sheet:
> "We noticed you've received 3 checkup recommendations over the past week but haven't booked yet. We know life gets busy, so we've taken the friction out — this appointment is already booked for you.
>
> Your 100% discount (earned from consistent check-ins and meeting nudge thresholds) means this checkup is completely free. You have full control to modify the date, time, or clinic, or cancel entirely. But the appointment is there — all you need to do is show up."

**Action:** Tap "Modify" button

**Show:** Modification options:
- Change clinic (dropdown list)
- Change date (calendar picker)
- Change time (time slot selector)
- "Save Changes" button

**Action:** Tap "Confirm" button instead

**Show:** Confirmation success message: "Appointment confirmed! Reminder will be sent 24 hours before your visit."

**Show:** Clinic receives notification on their end (demonstrated in clinic partner section later)

**Note:** This is where the auto-booking agent removes procrastination. The 100% discount threshold is met (3+ nudges + sufficient streak/tier), so the visit is fully covered. Users retain full control but the default action is forward progress towards health.

---

## Scene 9 — Chat Interface with Health Context [~60 seconds]

**Action:** Navigate to Home tab and tap the chat icon/button

**Show:** Chat interface with AI assistant

**Scenario:** User wants to report an immediate concern before completing daily check-in

**User message 1:** "I just sneezed and there was blood in the tissue"

**Show:** AI chat response (streaming in real-time):
> "That must be concerning. Let me help. First, how much blood did you notice — a few streaks, or more significant bleeding? And have you experienced any other symptoms today like congestion, dry air exposure, or nosebleeds before?"

**User message 2:** "Just a few streaks, but it's the first time this has happened. I've had some congestion for the past 2 days"

**Show:** AI response with full context awareness:
> "Thanks for clarifying. Based on your recent check-in history, I can see you've had:
> - Slight fever on Day 15 (yesterday)
> - Low energy for the past 14 days
> - No previous respiratory symptoms until now
>
> A small amount of blood with nasal congestion is often caused by dry air, nose irritation, or minor vessel rupture — especially if you've been blowing your nose frequently. However, given your fever yesterday and the new congestion, this could also be related to an upper respiratory infection.
>
> Monitor it closely. If the bleeding increases, persists, or you develop additional symptoms (severe headache, facial pain, difficulty breathing), seek immediate medical attention. Otherwise, try using a humidifier, stay hydrated, and consider this during your checkup appointment scheduled for 3 days from now."

**Note:** The AI has access to:
- Complete health profile (age, family history, medications, conditions)
- All previous daily check-in entries (14+ days of data)
- Previous AI analysis results
- Doctor reports from past clinic visits (if uploaded)
- Chat detection context (explained below)
- Location weather/environment data
- Past clinic visit records

**Show:** Behind the scenes — Chat Detection Context Tracking

**What the AI detected from user's messages:**
- Relevant symptom: "Sneezed with blood"
- Timestamp: [Current date/time]
- Context: First occurrence, accompanied by 2-day congestion
- Action taken: Added to "chat_detection_context" data field

**Data structure tracked:**
```json
{
  "chat_detections": [
    {
      "timestamp": "2026-02-21T14:32:00",
      "detected_symptom": "Sneezed with blood",
      "user_context": "First occurrence, 2-day congestion",
      "ai_assessment": "Likely minor — dry air or upper respiratory infection",
      "follow_up_needed": true
    }
  ]
}
```

**Note:** This chat detection context is NOT the entire user message history — just the relevant health information extracted by the AI. This becomes part of the user's health context for future daily check-in analyses. For example, tomorrow's AI analysis might say: "Yesterday you mentioned sneezing with blood in chat. How is that symptom today?"

---

## Scene 10 — Profile Screen & Health Profile Updates [~30 seconds]

**Action:** Navigate to Profile tab from bottom navigation

**Show:** Profile screen displaying:

**Health Profile Section:**
- Age: 28
- Gender: Female
- Known conditions: None
- Family history: Hypertension (father), Diabetes (maternal grandmother)
- Current medications: None
- Last checkup: 14 months ago
- "Edit Profile" button

**Action:** Tap "Edit Profile" button

**Show:** Editable health profile form with all fields:
- Age (number input)
- Gender (dropdown)
- Known conditions (multi-select chips)
- Family history (text input with add/remove)
- Current medications (text input with add/remove)
- Last checkup date (date picker)
- "Save Changes" button

**Action:** Make a sample edit (e.g., update last checkup date to today after clinic visit) and tap "Save Changes"

**Show:** Success message: "Profile updated successfully"

**Note:** Users can update their health profile anytime. These updates immediately feed into the AI's context for future analyses.

---

## Scene 11 — Billing & Subscription Screens [~30 seconds]

**Action:** From Profile screen, tap "Billing & Subscription" option

**Show:** Billing view displaying:

**Current Subscription:**
- Plan: Premium Monthly
- Price: ₦2,500/month
- Status: Active
- Next billing date: March 21, 2026
- "Manage Subscription" button

**Discount Tier Status:**
- Current tier: Regular (20% off)
- Check-in streak: 15 days
- Next tier: Silver (40% off) — requires 30-day streak
- Tier progression bar

**Auto-Booking Eligibility:**
- Status: Eligible ✓
- Criteria met: 3+ nudges + 15-day streak
- 100% discount available: Yes
- "Learn more" link

**Action:** Tap "Manage Subscription" button

**Show:** Subscription management options:
- Change plan (Basic / Premium / Family)
- Update payment method (mock card entry form)
- View billing history
- Cancel subscription

**Note:** This demonstrates the revenue model — users pay subscription fees. The discount tiers incentivize consistent logging. Clinics pay commissions for patient referrals (but users don't see this).

---

## Scene 12 — Clinic Partner Dashboard [~60 seconds]

**Setup:** Now switch perspective to show the clinic side of the story (City Wellness Clinic that Amara booked with)

**Show:** Clinic dashboard interface

**New Appointment Notification:**
- Banner: "New booking from Pulse user"
- Patient name: Amara (partial name for privacy)
- Appointment date: [Selected date]
- Appointment time: 10:00 AM
- Reason for visit: General checkup (flagged by AI health analysis)
- Redemption code: `PULSE-AMR-2024`
- Discount applied: 20% off
- Amount due: ₦12,000
- "Accept" / "Reschedule" buttons

**Action:** Tap "Accept" button

**Show:** Appointment added to clinic's schedule

**Clinic Profile Management Section:**

**Show:** Clinic can manage their details:
- **Clinic name:** City Wellness Clinic
- **Specialties/Areas they treat:** (multi-select chips)
  - General Practice ✓
  - Women's Health ✓
  - Pediatrics ✓
  - Cardiology
  - Gastroenterology
  - Dermatology
  - etc.
- **Checkup pricing:** ₦15,000 (base price input)
- **Location:** 
  - Address: 123 Allen Avenue, Ikeja, Lagos (text input)
  - Geocoded coordinates: 6.6018° N, 3.3515° E (auto-generated from address)
  - Embedded map showing clinic location pin
- **Operating hours:** Mon-Fri 8AM-6PM, Sat 9AM-2PM
- **Contact:** +234 xxx xxx xxxx
- "Save Changes" button

**Action:** Demonstrate editing specialties (add/remove chips), update pricing, verify location on map

**Note:** The specialties selected determine which user searches/filters will show this clinic. The geocoded coordinates enable distance-based sorting/filtering on the user side ("nearest clinics"). The embedded map (if possible) or address display with coordinates makes location clear.

---

## Scene 13 — Analytics & Visualizations View

**User Story**: I want to visualize my health data over time with interactive graphs and charts. I need to see trends in my mood, sleep quality, energy levels, symptoms frequency, and other metrics. I also want filtering capabilities to view specific date ranges, metric types, or thresholds. This empowers me to understand my health patterns visually and make data-driven decisions about my wellbeing.

**Screenplay**:

1. Navigate to the Analytics/Visualizations view (new tab or section in Profile/Home).
2. The screen displays:
   - **Interactive Line Charts**:
     - Sleep hours over time (with quality indicators)
     - Energy levels trend (1-5 scale)
     - Mood progression (Terrible → Excellent)
   - **Bar Charts**:
     - Symptoms frequency (which symptoms appeared on which days)
     - Temperature readings (normal vs elevated)
   - **Heatmap Calendar**:
     - Visual representation of check-in streak
     - Color-coded by overall health score or concern level
   - **Filtering Panel**:
     - Date range picker (Last 7 days, Last 30 days, Custom range)
     - Metric selector (checkboxes for Energy, Sleep, Mood, Symptoms, etc.)
     - Threshold filters (e.g., show only days with energy < 3)
3. Tap/hover on data points to see detailed information from that specific day.
4. Export or share visualization as image/PDF (future feature hint).

**Visual/Behavior Notes**:

- Clean, modern data visualization with smooth animations
- Color-coded graphs matching Pulse brand colors (#84CC16 green for good, #F97316 orange for moderate, #EF4444 red for concerning)
- Responsive touch interactions for mobile (pinch-to-zoom, swipe between charts)
- Loading states while data is being processed
- Empty state if insufficient data (e.g., "Need at least 7 days of check-ins to show trends")

**Implementation Notes**:

- Use a charting library like Recharts, Chart.js, or Victory Native
- Data sources: amaraFullStory from amara-story-data.ts
- Calculate aggregates and trends from check-in history
- Responsive design for both mobile and tablet views

---

## Scene 14 — Final Summary

You've now demonstrated:

✅ **User journey from onboarding to clinic booking:**
- Onboarding with health profile collection
- 14 days of historical check-in data showing pattern development
- AI analysis at each step (past days + today)
- Detailed AI analysis with proper citations and reasoning
- Nudge to book checkup with 2 paths: immediate booking or feedback loop
- Auto-booking agent after 3 ignored nudges
- Complete clinic search, filtering, sorting, and booking flow
- Payment processing (mock UI)

✅ **Additional features:**
- Chat interface with full health context and chat detection tracking
- Profile screen with editable health profile
- Billing & subscription management screens
- Discount tier progression tied to streaks
- Analytics & visualizations view with interactive graphs, charts, and filtering

✅ **Clinic partner side:**
- Clinic dashboard receiving bookings
- Profile management (specialties, pricing, location with map/geocoding)
- Appointment acceptance workflow

✅ **Revenue model demonstrated:**
- Users: Subscription fees (₦2,500/month shown)
- Clinics: Patient referral commissions (implicit in booking flow)

**The story makes complete sense:** Amara's 14-day pattern of declining energy, poor sleep, recurring abdomen pain, reduced appetite, and eventual fever tells a coherent health narrative. The AI's concern and recommendation is justified by the data. The detailed analysis properly references specific days and explains the reasoning. The booking flow completes the preventive care loop. The auto-booking agent removes procrastination. The feedback loop tracks outcomes to improve AI accuracy.

---

## Implementation Checklist

### User Flow Components

- [x] Onboarding health profile screen (pre-fillable for demo)
- [x] Home screen (streak, day carousel with date jump, discount tier, CTA)
- [x] Daily check-in card stack (all 9 cards, swipeable)
- [x] Check-in completion screen (streak confirmation)
- [x] Home screen navigation: carousel allows selecting any day, home content updates to show that day's data
- [x] AI analysis card on home screen (appears after check-in)
- [ ] AI analysis overview/summary screen with two buttons (Book Clinic + See Detailed Analysis)
- [x] Detailed AI analysis modal with structured JSON-like presentation, day citations, and reasoning
- [ ] Analytics/Visualizations view with interactive graphs and charts (mood, sleep, energy trends with filtering)
- [x] Nudge tracking system (count nudges, store in localStorage, display badge on analysis card)
- [x] Feedback loop modal (appears on next check-in after nudge, tracks outcomes, uploads reports)
- [ ] Doctor report upload flow (file upload + skip option)
- [ ] Validation tracking (true positive / false positive outcomes)
- [x] Auto-booking card (appears after 3+ nudges with 100% discount)
- [x] Auto-booking modification flow (change clinic, date, time)
- [x] Chat interface with AI assistant (full health context, streaming responses from Gemini API)
- [x] Chat detection context tracking (extract health info from messages, display detection count)
- [x] Profile screen displaying health profile fields
- [x] Editable health profile form (all fields updatable with localStorage persistence)
- [x] Billing & subscription view (tiers, discounts, subscription plans, active discount code)
- [ ] Subscription management options (change plan, payment method, history)

### Clinic Partner Components

- [x] Clinic partner onboarding (similar to user onboarding - collect clinic details)
- [x] Clinic dashboard with appointment notifications
- [x] Clinic profile management (specialties, pricing, location, hours)
- [ ] Embedded map or geocoded address display for clinic location
- [ ] Appointment acceptance/rescheduling workflow

### Clinics Tab Enhancements

- [x] Enhanced clinics view with search bar
- [x] Advanced filter sheet (distance slider, rating slider, specialty chips)
- [x] Sorting functionality (by distance, rating, discount)
- [ ] Context banner showing relevant specialties from AI analysis
- [ ] Clinic detail screen with map, specialties, pricing, discount, booking button
- [ ] Time slot selection for booking
- [ ] Payment processing screen (mock UI)
- [ ] Booking confirmation screen with redemption code

### Mock Data Requirements

- [x] Amara's onboarding profile (age, gender, family history, conditions, medications, last checkup)
- [x] Amara's 14-day check-in entries with coherent health pattern:
  - Days 1-3: Normal baseline (energy 4/5, good sleep, positive mood, no symptoms)
  - Days 4-7: Mild decline (energy 3/5, slight sleep reduction, neutral mood, occasional headaches)
  - Days 8-11: Concerning pattern starts (energy 2/5, poor sleep, low mood, abdomen discomfort Day 10)
  - Days 12-14: Pattern escalates (energy 2/5, very poor sleep, low mood, recurring abdomen ache, reduced appetite)
  - Day 15 (Today): Critical escalation (energy 2/5, 4.5hrs sleep, moderate abdomen ache, fever, very low appetite)
- [x] AI analysis results for each of the 14 past days (showing pattern tracking over time)
- [x] AI analysis for Day 15 (overview summary + detailed structured analysis with citations)
- [x] Mock nudge history data (3+ nudges tracked for auto-booking demo)
- [x] 12+ mock partner clinics with complete details:
  - Name, address, geocoded coordinates
  - Specialties/areas they treat
  - Ratings and review counts
  - Distance from user location
  - Checkup pricing
  - Discount percentages
  - Operating hours
  - Contact information
- [ ] Mock chat conversation data (user reports blood in sneeze, AI responds with context)
- [ ] Chat detection context example (extracted symptom tracked with timestamp)
- [ ] Doctor report upload mock data (for feedback loop demo)
- [ ] Subscription and billing data (plan, price, next billing date)
- [ ] Discount tier progression data (current tier, next tier requirements)

### AI Integration Points (Mock for Now)

- [ ] AI analysis generation (overview summary + detailed structured JSON response)
- [ ] Chat detection algorithm (extract relevant health info from user messages)
- [ ] Context compilation for AI (health profile + check-ins + doctor reports + chat detections + weather + location)
- [x] Pre-generated AI analysis (overview and detailed) stored in mock data and displayed without streaming

### Location & Map Features

- [ ] Geocoding for clinic addresses (convert address to coordinates)
- [ ] Embedded map display for clinic locations (or coordinate display if map not possible)
- [ ] Distance calculation from user location to clinics
- [ ] Distance-based filtering and sorting

### Tracking & Analytics

- [ ] Nudge count tracking (increment on each ignored nudge, reset on action)
- [ ] Feedback loop tracking (user went for checkup: yes/no)
- [ ] Doctor report validation tracking (AI hunch: correct/false positive)
- [ ] Chat detection context storage (timestamp, symptom, assessment, follow-up needed)
- [ ] Streak tracking (days consecutive, discount tier calculation)
- [ ] Auto-booking eligibility calculation (3+ nudges + streak threshold + 100% discount)

### Revenue Model Display

- [ ] User subscription pricing shown in billing view
- [ ] Discount tier benefits displayed
- [ ] Clinic commission flow (implicit in booking, not shown to users)

---
