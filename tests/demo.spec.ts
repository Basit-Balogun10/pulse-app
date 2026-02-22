import { test, expect } from '@playwright/test';

/**
 * Pulse Demo Automation Script
 * Following demo-script.md - 14 scenes showcasing Amara's health journey
 * Device: iPhone 12 Pro (390x844)
 * Total duration: ~10 minutes
 */

test.describe('Pulse Demo - Amara\'s Health Journey', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto('/');
  });

  test('Scene 1: User Onboarding [~20s]', async ({ page }) => {
    // Wait for onboarding screen to load
    await expect(page.getByText('Welcome to Pulse')).toBeVisible({ timeout: 10000 });
    
    // Verify Amara's profile is pre-filled
    await expect(page.getByText('Age: 28')).toBeVisible();
    await expect(page.getByText('Female')).toBeVisible();
    
    // Take screenshot of onboarding
    await page.screenshot({ path: 'test-results/screenshots/01-onboarding.png', fullPage: true });
    
    // Wait to show onboarding screen
    await page.waitForTimeout(3000);
    
    // Tap Continue to proceed
    await page.getByRole('button', { name: /continue/i }).click();
    
    // Wait for home screen to load
    await expect(page.getByText('Home')).toBeVisible({ timeout: 5000 });
    
    // Screenshot after navigation
    await page.screenshot({ path: 'test-results/screenshots/01-onboarding-complete.png', fullPage: true });
  });

  test('Scene 2: Home Screen with Historical Data [~45s]', async ({ page }) => {
    // Assume already on home screen (or navigate if needed)
    await page.goto('/');
    
    // Verify streak is shown
    await expect(page.getByText(/15 day/i)).toBeVisible();
    
    // Verify tier/discount
    await expect(page.getByText(/Regular/i)).toBeVisible();
    await expect(page.getByText(/20%/i)).toBeVisible();
    
    // Screenshot home screen
    await page.screenshot({ path: 'test-results/screenshots/02-home-initial.png', fullPage: true });
    
    // Navigate through day carousel (show last 6 days)
    // Look for carousel navigation buttons or swipe
    const carousel = page.locator('[data-testid="day-carousel"]').first();
    if (await carousel.isVisible()) {
      // Try to navigate through days
      for (let i = 0; i < 6; i++) {
        await page.waitForTimeout(1500);
        // Try clicking next button or swiping
        const nextButton = page.locator('button[aria-label*="next"]').or(page.locator('button').filter({ hasText: '→' }));
        if (await nextButton.count() > 0) {
          await nextButton.first().click();
        }
      }
    }
    
    // Screenshot carousel navigation
    await page.screenshot({ path: 'test-results/screenshots/02-home-carousel.png', fullPage: true });
    
    // Show historical check-in data by clicking on a past day
    const dayCard = page.locator('[data-day]').or(page.getByText(/Day \d+/i)).first();
    if (await dayCard.count() > 0) {
      await dayCard.first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/screenshots/02-historical-checkin.png', fullPage: true });
    }
    
    // Wait to demonstrate historical view
    await page.waitForTimeout(5000);
  });

  test('Scene 3: Today\'s Daily Check-in [~60s]', async ({ page }) => {
    await page.goto('/');
    
    // Tap "Complete today's check-in" button
    await page.getByRole('button', { name: /check.in|complete.*check/i }).click();
    
    // Wait for check-in view to load
    await expect(page.getByText(/Energy|Sleep|Symptoms/i)).toBeVisible({ timeout: 5000 });
    
    // Screenshot check-in start
    await page.screenshot({ path: 'test-results/screenshots/03-checkin-start.png', fullPage: true });
    
    // Card 1: Energy Level - Set to 2/5
    const energySlider = page.locator('input[type="range"]').or(page.locator('[aria-label*="energy"]')).first();
    if (await energySlider.count() > 0) {
      await energySlider.fill('2');
    }
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/screenshots/03-checkin-energy.png', fullPage: true });
    
    // Navigate to next card
    await page.getByRole('button', { name: /next|continue/i }).click();
    
    // Card 2: Sleep - 4.5 hours
    const sleepInput = page.locator('input[type="number"]').or(page.locator('[aria-label*="sleep"]')).first();
    if (await sleepInput.count() > 0) {
      await sleepInput.fill('4.5');
    }
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/screenshots/03-checkin-sleep.png', fullPage: true });
    await page.getByRole('button', { name: /next|continue/i }).click();
    
    // Card 3: Symptoms - Lower abdomen ache, moderate
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/screenshots/03-checkin-symptoms.png', fullPage: true });
    // Select symptom from list or input
    const symptomInput = page.getByPlaceholder(/symptom/i).or(page.getByText(/lower abdomen/i));
    if (await symptomInput.count() > 0) {
      if (await symptomInput.first().isEditable()) {
        await symptomInput.first().fill('Lower abdomen ache');
      } else {
        await symptomInput.first().click();
      }
    }
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: /next|continue/i }).click();
    
    // Card 4: Respiratory - None/95%
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/screenshots/03-checkin-respiratory.png', fullPage: true });
    await page.getByRole('button', { name: /next|continue/i }).click();
    
    // Card 5: Temperature - 37.8°C (fever)
    const tempInput = page.locator('input[aria-label*="temperature"]').or(page.locator('input[type="number"]')).first();
    if (await tempInput.count() > 0) {
      await tempInput.fill('37.8');
    }
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/screenshots/03-checkin-temperature.png', fullPage: true });
    await page.getByRole('button', { name: /next|continue/i }).click();
    
    // Card 6: Mood - Low/Anxious
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/screenshots/03-checkin-mood.png', fullPage: true });
    await page.getByRole('button', { name: /next|continue/i }).click();
    
    // Card 7: Appetite - Very Low
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/screenshots/03-checkin-appetite.png', fullPage: true });
    await page.getByRole('button', { name: /next|continue/i }).click();
    
    // Card 8: Lifestyle
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/screenshots/03-checkin-lifestyle.png', fullPage: true });
    await page.getByRole('button', { name: /next|continue/i }).click();
    
    // Card 9: Open Flag - "Feeling unwell"
    await page.waitForTimeout(500);
    const flagOption = page.getByText(/feeling unwell/i).or(page.locator('[data-flag]'));
    if (await flagOption.count() > 0) {
      await flagOption.first().click();
    }
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/screenshots/03-checkin-flag.png', fullPage: true });
    
    // Submit check-in
    await page.getByRole('button', { name: /submit|complete|finish/i }).click();
    
    // Wait for completion screen
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/screenshots/03-checkin-complete.png', fullPage: true });
  });

  test('Scene 4: AI Analysis with Concern & Recommendation [~60s]', async ({ page }) => {
    await page.goto('/');
    
    // Look for AI Analysis card
    const aiCard = page.locator('[data-testid="ai-analysis-card"]').or(page.getByText(/AI Analysis/i));
    await expect(aiCard.first()).toBeVisible({ timeout: 10000 });
    
    // Screenshot AI analysis card on home
    await page.screenshot({ path: 'test-results/screenshots/04-ai-card-home.png', fullPage: true });
    
    // Wait to show the pulsing card
    await page.waitForTimeout(3000);
    
    // Tap AI Analysis card
    await aiCard.first().click();
    
    // Wait for analysis overview screen
    await page.waitForTimeout(2000);
    
    // Verify overview content
    await expect(page.getByText(/pattern|concern|checkup/i)).toBeVisible({ timeout: 5000 });
    
    // Screenshot analysis overview
    await page.screenshot({ path: 'test-results/screenshots/04-ai-analysis-overview.png', fullPage: true });
    
    // Verify two buttons exist
    await expect(page.getByRole('button', { name: /book.*clinic/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /detailed.*analysis|see.*detail/i })).toBeVisible();
    
    // Wait to show the analysis
    await page.waitForTimeout(5000);
  });

  test('Scene 5: Detailed Analysis Modal [~60s]', async ({ page }) => {
    // Navigate to AI analysis overview first
    await page.goto('/');
    const aiCard = page.locator('[data-testid="ai-analysis-card"]').or(page.getByText(/AI Analysis/i));
    await aiCard.first().click();
    
    await page.waitForTimeout(2000);
    
    // Tap "See Detailed Analysis" button
    await page.getByRole('button', { name: /detailed.*analysis|see.*detail/i }).click();
    
    // Wait for modal to open
    await page.waitForTimeout(1000);
    
    // Screenshot detailed analysis modal
    await page.screenshot({ path: 'test-results/screenshots/05-detailed-analysis-modal.png', fullPage: true });
    
    // Scroll through the detailed analysis to show different sections
    const modal = page.locator('[role="dialog"]').or(page.locator('.modal')).first();
    
    // Show energy decline section
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/screenshots/05-analysis-energy.png', fullPage: true });
    
    // Scroll to sleep disruption
    if (await modal.count() > 0) {
      await modal.evaluate(el => el.scrollBy(0, 300));
    }
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/screenshots/05-analysis-sleep.png', fullPage: true });
    
    // Scroll to symptoms section
    if (await modal.count() > 0) {
      await modal.evaluate(el => el.scrollBy(0, 300));
    }
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/screenshots/05-analysis-symptoms.png', fullPage: true });
    
    // Scroll to recommendation
    if (await modal.count() > 0) {
      await modal.evaluate(el => el.scrollBy(0, 300));
    }
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/screenshots/05-analysis-recommendation.png', fullPage: true });
    
    // Close modal
    const closeButton = page.getByRole('button', { name: /close|dismiss/i }).or(page.locator('[aria-label="Close"]'));
    if (await closeButton.count() > 0) {
      await closeButton.first().click();
    }
  });

  test('Scene 6: Booking Clinic Visit [~60s]', async ({ page }) => {
    // Start from AI analysis overview
    await page.goto('/');
    const aiCard = page.locator('[data-testid="ai-analysis-card"]').or(page.getByText(/AI Analysis/i));
    await aiCard.first().click();
    await page.waitForTimeout(2000);
    
    // Tap "Book Clinic Visit" button
    await page.getByRole('button', { name: /book.*clinic/i }).click();
    
    // Should navigate to Clinics tab
    await expect(page.getByText(/clinic|find.*partner/i)).toBeVisible({ timeout: 5000 });
    
    // Screenshot clinics view
    await page.screenshot({ path: 'test-results/screenshots/06-clinics-view.png', fullPage: true });
    
    // Verify context banner
    await expect(page.getByText(/based on.*analysis|general practice|women.*health/i)).toBeVisible();
    
    // Wait to show clinics list
    await page.waitForTimeout(3000);
    
    // Tap filter icon
    const filterButton = page.locator('button[aria-label*="filter"]').or(page.getByRole('button', { name: /filter/i }));
    if (await filterButton.count() > 0) {
      await filterButton.first().click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/screenshots/06-clinics-filter.png', fullPage: true });
      
      // Apply filters
      await page.getByRole('button', { name: /apply/i }).click();
      await page.waitForTimeout(2000);
    }
    
    // Select a clinic from the list
    const clinicCard = page.locator('[data-testid="clinic-card"]').or(page.getByText(/Wellness Medical Center|City Health/i));
    if (await clinicCard.count() > 0) {
      await clinicCard.first().click();
      await page.waitForTimeout(2000);
      
      // Screenshot clinic detail
      await page.screenshot({ path: 'test-results/screenshots/06-clinic-detail.png', fullPage: true });
      
      // Book appointment
      const bookButton = page.getByRole('button', { name: /book|schedule/i });
      if (await bookButton.count() > 0) {
        await bookButton.first().click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-results/screenshots/06-booking-flow.png', fullPage: true });
      }
    }
  });

  test('Scene 7: Feedback Loop [~45s]', async ({ page }) => {
    await page.goto('/');
    
    // After some time has passed since the nudge, feedback modal should appear
    // Simulate checking for feedback modal
    const feedbackModal = page.locator('[data-testid="feedback-modal"]').or(page.getByText(/did you.*checkup|book.*appointment/i));
    
    if (await feedbackModal.count() > 0) {
      await feedbackModal.first().waitFor({ state: 'visible', timeout: 5000 });
      await page.screenshot({ path: 'test-results/screenshots/07-feedback-modal.png', fullPage: true });
      
      // Show feedback options
      await page.waitForTimeout(3000);
      
      // Interact with feedback (e.g., "Yes, I booked" or "Not yet")
      const yesButton = page.getByRole('button', { name: /yes|booked/i });
      if (await yesButton.count() > 0) {
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-results/screenshots/07-feedback-options.png', fullPage: true });
      }
    } else {
      // If modal not automatically shown, might need to trigger it manually in demo mode
      console.log('Feedback modal not found - may need demo mode trigger');
    }
  });

  test('Scene 8: Auto-booking after 3 Nudges [~45s]', async ({ page }) => {
    await page.goto('/');
    
    // After 3 ignored nudges, auto-booking card should appear
    const autoBookCard = page.locator('[data-testid="auto-booking-card"]').or(page.getByText(/100%.*discount|automatic.*booking/i));
    
    if (await autoBookCard.count() > 0) {
      await autoBookCard.first().waitFor({ state: 'visible', timeout: 5000 });
      await page.screenshot({ path: 'test-results/screenshots/08-auto-booking-card.png', fullPage: true });
      
      // Show options: Modify, Confirm, Cancel
      await expect(page.getByRole('button', { name: /modify/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /confirm/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
      
      await page.waitForTimeout(5000);
    } else {
      console.log('Auto-booking card not found - may need nudge tracking implementation');
    }
  });

  test('Scene 9: Chat with Health Context [~60s]', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Chat tab
    const chatTab = page.getByRole('button', { name: /chat|message/i }).or(page.locator('[data-tab="chat"]'));
    await chatTab.click();
    
    // Wait for chat view
    await expect(page.getByText(/chat|message|ask/i)).toBeVisible({ timeout: 5000 });
    
    // Screenshot chat interface
    await page.screenshot({ path: 'test-results/screenshots/09-chat-view.png', fullPage: true });
    
    // Type a health-related question
    const chatInput = page.locator('input[type="text"]').or(page.getByPlaceholder(/message|type|ask/i));
    if (await chatInput.count() > 0) {
      await chatInput.first().fill('What could be causing my abdomen pain?');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/screenshots/09-chat-input.png', fullPage: true });
      
      // Send message
      await page.keyboard.press('Enter');
      // Or click send button
      const sendButton = page.getByRole('button', { name: /send/i });
      if (await sendButton.count() > 0) {
        await sendButton.first().click();
      }
      
      // Wait for AI response with context
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'test-results/screenshots/09-chat-response.png', fullPage: true });
      
      // Verify response includes health context
      await expect(page.getByText(/pattern|14 days|check.*in|analysis/i)).toBeVisible({ timeout: 10000 });
      
      await page.waitForTimeout(5000);
    }
  });

  test('Scene 10: Profile Updates [~30s]', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Profile tab
    const profileTab = page.getByRole('button', { name: /profile|account|settings/i }).or(page.locator('[data-tab="profile"]'));
    await profileTab.click();
    
    // Wait for profile view
    await expect(page.getByText(/Amara|profile|settings/i)).toBeVisible({ timeout: 5000 });
    
    // Screenshot profile view
    await page.screenshot({ path: 'test-results/screenshots/10-profile-view.png', fullPage: true });
    
    // Show profile details
    await expect(page.getByText('28')).toBeVisible(); // Age
    await expect(page.getByText(/15 day/i)).toBeVisible(); // Streak
    
    // Scroll through profile sections
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/screenshots/10-profile-details.png', fullPage: true });
  });

  test('Scene 11: Billing/Subscription [~30s]', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Billing tab or section
    const billingTab = page.getByRole('button', { name: /billing|subscription|payment/i }).or(page.locator('[data-tab="billing"]'));
    if (await billingTab.count() > 0) {
      await billingTab.click();
      
      // Wait for billing view
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/screenshots/11-billing-view.png', fullPage: true });
      
      // Show tier and discount info
      await expect(page.getByText(/Regular|20%|tier/i)).toBeVisible({ timeout: 5000 });
      
      await page.waitForTimeout(3000);
    } else {
      // Navigate via profile
      const profileTab = page.getByRole('button', { name: /profile/i });
      await profileTab.click();
      await page.waitForTimeout(1000);
      
      const billingLink = page.getByText(/billing|subscription/i);
      if (await billingLink.count() > 0) {
        await billingLink.first().click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'test-results/screenshots/11-billing-view.png', fullPage: true });
      }
    }
  });

  test('Scene 12: Clinic Partner Dashboard [~60s]', async ({ page }) => {
    // This requires a separate clinic partner view
    // May need to navigate to a different route or toggle clinic view
    
    // Navigate to clinic dashboard
    await page.goto('/clinic-dashboard'); // Or wherever it's mounted
    
    // Wait for clinic dashboard
    await page.waitForTimeout(2000);
    
    const clinicDashboard = page.getByText(/clinic.*dashboard|partner.*portal|appointment.*received/i);
    if (await clinicDashboard.count() > 0) {
      await page.screenshot({ path: 'test-results/screenshots/12-clinic-dashboard.png', fullPage: true });
      
      // Show incoming appointments
      await expect(page.getByText(/Amara|appointment|booking/i)).toBeVisible({ timeout: 5000 });
      
      // Show patient details
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'test-results/screenshots/12-clinic-appointments.png', fullPage: true });
      
      // Show health context shared with clinic
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'test-results/screenshots/12-clinic-patient-context.png', fullPage: true });
    } else {
      console.log('Clinic dashboard not found - needs implementation');
    }
  });

  test('Scene 13: Analytics/Visualizations [Variable]', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Analytics/History tab
    const analyticsTab = page.getByRole('button', { name: /analytics|history|insights|chart/i }).or(page.locator('[data-tab="analytics"]'));
    if (await analyticsTab.count() > 0) {
      await analyticsTab.click();
      
      // Wait for analytics view
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/screenshots/13-analytics-view.png', fullPage: true });
      
      // Show charts for different metrics
      await expect(page.getByText(/energy|sleep|trend|pattern/i)).toBeVisible({ timeout: 5000 });
      
      // Wait to show visualizations
      await page.waitForTimeout(5000);
      await page.screenshot({ path: 'test-results/screenshots/13-analytics-charts.png', fullPage: true });
      
      // Interact with filters if available
      const filterButton = page.locator('button').filter({ hasText: /week|month|filter/i });
      if (await filterButton.count() > 0) {
        await filterButton.first().click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-results/screenshots/13-analytics-filtered.png', fullPage: true });
      }
    } else {
      // Try to find via History view
      const historyTab = page.getByRole('button', { name: /history/i });
      if (await historyTab.count() > 0) {
        await historyTab.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-results/screenshots/13-history-view.png', fullPage: true });
      }
    }
  });

  test('Scene 14: Demo Summary', async ({ page }) => {
    await page.goto('/');
    
    // Final screenshot of home screen showing completed journey
    await page.screenshot({ path: 'test-results/screenshots/14-demo-complete.png', fullPage: true });
    
    // Verify key elements are present
    await expect(page.getByText(/Amara/i)).toBeVisible();
    await expect(page.getByText(/15 day/i)).toBeVisible();
    
    // Summary complete
    await page.waitForTimeout(2000);
  });
});
