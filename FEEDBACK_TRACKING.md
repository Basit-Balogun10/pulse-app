# 21-Item Feedback Tracking

## Status Legend
- [ ] Not Started
- [⚙️] In Progress  
- [✅] Completed

---

## Item 1: Custom input for medical history during onboarding
- [✅] Known diagnosis and medical history during onboarding should allow for custom input
- **Files to check:** `components/pulse/onboarding-modal.tsx`

## Item 2: Custom date-time component
- [ ] Replace default browser date-time component in Last medical checkup and everywhere else
- **Files to check:** All onboarding and check-in forms

## Item 3: Clinics filter modal improvements
- [✅] Rounded top borders - DONE
- [✅] Inner paddings fixed - DONE
- [✅] Specialty list horizontal scroll - DONE
- [ ] Multi-select for specialties
- **Files to check:** `components/pulse/views/clinics-view.tsx`

## Item 4: Today pill border/spacing fix
- [✅] Fixed border overflow - DONE
- **Files to check:** `components/pulse/day-carousel.tsx`

## Item 5: Chat interface improvements
- [✅] Multiline input - DONE
- [✅] Voice recording duration - DONE
- [ ] Center file/image/voice buttons and make scrollable
- [ ] Image/file preview before send
- [ ] Attachment horizontal scroll with X buttons
- [ ] Click to preview attachments
- **Files to check:** `components/pulse/chat-box.tsx`

## Item 6: Date pills in chat messages
- [ ] Show date at top of first message of each day
- **Files to check:** `components/pulse/chat-box.tsx`

## Item 7: Chat search and jump to date
- [ ] Search feature in chat
- [ ] Jump to date feature
- **Files to check:** `components/pulse/chat-box.tsx`

## Item 8: Date calculation bug
- [✅] Today showing correct date (22/2) - DONE
- **Files to check:** `lib/utils.ts`, `components/pulse/day-carousel.tsx`

## Item 8b: Mock data not showing
- [✅] Fixed mock data appearing in carousel - DONE
- **Files to check:** `components/pulse/views/home-view.tsx`

## Item 9: Check-in button icon
- [✅] Start today's check-in icon matches Next button - DONE
- **Files to check:** `components/pulse/check-in-card.tsx`

## Item 10: Payment method button
- [ ] Add new payment method button working
- [ ] Verify all subscription management features
- **Files to check:** `components/pulse/views/billing-view.tsx`

## Item 11: Billing history as modal
- [ ] Change billing history from dialog to modal
- **Files to check:** `components/pulse/views/billing-view.tsx`

## Item 12: Payment flows
- [ ] Change Plan flow
- [ ] Cancel Subscription flow
- **Files to check:** `components/pulse/views/billing-view.tsx`

## Item 13: 100% discount explanation
- [ ] Show how users can get 100% discount based on streaks
- [ ] Add info modal with detailed explanation
- **Files to check:** `components/pulse/views/billing-view.tsx`

## Item 14: Animated subheadings
- [✅] Rotating subheadings with animations - DONE
- **Files to check:** `components/pulse/views/home-view.tsx`

## Item 15: Clinics search bar and sorting
- [✅] Taller search bar - DONE
- [ ] Change "Sort by distance" UX to show nearest first
- [ ] Allow users to set/change base location
- **Files to check:** `components/pulse/views/clinics-view.tsx`

## Item 16: Browser permissions
- [ ] Implement actual browser permissions for location, voice, etc.
- [ ] Get actual values not dummies
- [ ] Fix chat interface voice to request permission
- **Files to check:** `components/pulse/chat-box.tsx`, check-in cards

## Item 17: Profile Account section
- [ ] Medication & Allergies
- [ ] Health Circles
- [ ] Other Account features
- **Files to check:** `components/pulse/views/profile-view.tsx`

## Item 18: Symptoms card (Card 3) fixes
- [✅] Fix "How severe" overflow/scroll issue - DONE (ScrollArea)
- [✅] Add custom input when "Other" selected in Where
- [✅] Add "Other" option with custom input in Type
- [ ] Verify all custom inputs work across all cards
- **Files to check:** `components/pulse/checkin/symptoms-card.tsx`

## Item 19: Respiratory custom input
- [✅] Allow "Other" option with custom input
- **Files to check:** `components/pulse/checkin/respiratory-card.tsx`

## Item 20: Lifestyle card redesign
- [✅] Less cluttered - labels on full line
- [✅] Use sliders where possible (water, screen time)
- [✅] Physical activity: ask for specific activities when Yes
- [✅] Add common activity presets + custom input
- **Files to check:** `components/pulse/checkin/lifestyle-card.tsx`

## Item 21: Card 9 voice input improvements
- [ ] Apply chat interface voice feedback to open flag card
- **Files to check:** `components/pulse/checkin/open-flag-card.tsx`
