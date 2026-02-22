/**
 * Automated Demo Runner for Pulse App
 * 
 * Strictly follows demo-script.md to automate the 14-scene demo
 * Runs invisibly while user records screen
 * 
 * Usage: Add ?demo=auto to URL or press Ctrl+Shift+D
 */

export interface DemoScene {
  id: number;
  name: string;
  duration: number; // milliseconds
  actions: DemoAction[];
}

export interface DemoAction {
  type: 'navigate' | 'click' | 'fill' | 'wait' | 'scroll' | 'log';
  selector?: string;
  value?: string | number;
  duration?: number;
  message?: string;
}

export class DemoRunner {
  private currentScene: number = 0;
  private isRunning: boolean = false;
  private logs: string[] = [];
  
  constructor(private onLog?: (message: string) => void) {
    this.log('🎬 Demo Runner initialized');
  }

  private log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    this.logs.push(logMessage);
    console.log(logMessage);
    if (this.onLog) {
      this.onLog(logMessage);
    }
  }

  /**
   * Scene 1: User Onboarding [~20 seconds]
   * Show pre-filled Amara's profile and proceed to home
   */
  private async scene1_Onboarding(): Promise<void> {
    this.log('═══════════════════════════════════════');
    this.log('📋 SCENE 1: User Onboarding [~20s]');
    this.log('═══════════════════════════════════════');
    this.log('Story: Amara, 28F, family history of hypertension & diabetes');
    
    // Check if we're on onboarding screen
    this.log('Checking for onboarding screen...');
    await this.wait(2000);
    
    // Look for onboarding elements
    const continueButton = Array.from(document.querySelectorAll('button[type="submit"], button')).find(
      btn => btn.textContent?.includes('Continue') || btn.textContent?.includes('Get Started')
    );
    
    if (continueButton) {
      this.log('✓ Onboarding screen detected');
      this.log('Profile should show:');
      this.log('  - Age: 28, Female');
      this.log('  - Known conditions: None');
      this.log('  - Family history: Hypertension (father), Diabetes (maternal grandmother)');
      this.log('  - Medications: None');
      this.log('  - Last checkup: 14 months ago');
      
      await this.wait(3000); // Show onboarding for 3 seconds
      
      this.log('Clicking Continue button...');
      (continueButton as HTMLElement).click();
      await this.wait(2000);
      this.log('✓ Navigated to home screen');
    } else {
      this.log('⚠ Already past onboarding, proceeding to home screen');
    }
    
    this.log('Scene 1 complete ✅');
  }

  /**
   * Scene 2: Home Screen with Historical Data [~45 seconds]
   * Navigate through 14-day streak and show check-in history
   */
  private async scene2_HomeScreen(): Promise<void> {
    this.log('═══════════════════════════════════════');
    this.log('📊 SCENE 2: Home Screen with History [~45s]');
    this.log('═══════════════════════════════════════');
    this.log('Story: 15-day streak, Regular tier (20% discount)');
    
    // Verify we're on home screen
    await this.wait(1000);
    this.log('Displaying home screen elements:');
    this.log('  - Streak: 🔥 15 days');
    this.log('  - Discount tier: Regular (20% off)');
    this.log('  - Day carousel with last 6 days visible');
    
    await this.wait(3000);
    
    // Navigate through carousel to show historical data
    this.log('Navigating through day carousel...');
    this.log('Historical pattern (14 days):');
    this.log('  Days 1-3: Energy 4/5, Sleep 7-8hrs, Mood positive');
    this.log('  Days 4-7: Energy 3/5, Sleep 6-7hrs, Mild headaches');
    this.log('  Days 8-11: Energy 2/5, Sleep 5-6hrs, Abdomen discomfort Day 10');
    this.log('  Days 12-14: Energy 2/5, Sleep 4-5hrs, Recurring abdomen ache');
    
    // Try to find and click carousel navigation
    const nextButtons = document.querySelectorAll('[aria-label*="next"], button:has-text("→"), .carousel-next');
    if (nextButtons.length > 0) {
      this.log('Found carousel controls, navigating through days...');
      for (let i = 0; i < 6; i++) {
        await this.wait(1500);
        this.log(`  Showing day ${15 - i}...`);
        const nextBtn = nextButtons[0] as HTMLElement;
        if (nextBtn) nextBtn.click();
      }
    } else {
      this.log('⚠ Carousel navigation not found, continuing...');
      await this.wait(5000); // Just show home screen
    }
    
    // Click on a past day to show individual check-in and AI analysis
    this.log('Attempting to show historical check-in entry...');
    const dayPills = document.querySelectorAll('[data-date]');
    if (dayPills.length > 0) {
      await this.wait(2000);
      this.log('Clicking on a past day (Day 10 - first abdomen pain appearance)...');
      
      // Find Day 10 pill (or any earlier day)
      const targetDay = Array.from(dayPills).find(pill => {
        const dateText = pill.textContent || '';
        return dateText.includes('10/') || dateText.includes('Feb 10');
      });
      
      if (targetDay) {
        (targetDay as HTMLElement).click();
        await this.wait(2000);
        this.log('  ✓ Selected Day 10');
        
        // Now the AI Analysis overview card should appear for that day
        this.log('Looking for AI Analysis overview card for Day 10...');
        const aiAnalysisCard = document.querySelector('.bg-gradient-to-br.from-\\[\\#818CF8\\]\\/10');
        
        if (aiAnalysisCard) {
          this.log('  ✓ AI Analysis overview card visible for past day');
          this.log('  Content shows Day 10 analysis summary');
          await this.wait(3000);
          
          this.log('Clicking AI Analysis card to view detailed analysis...');
          (aiAnalysisCard as HTMLElement).click();
          await this.wait(2000);
          this.log('  ✓ Detailed Analysis modal opened for Day 10');
          
          // Show the analysis modal
          await this.wait(3000);
          this.log('  Showing Day 10 AI analysis:');
          this.log('    - First lower abdomen discomfort (mild)');
          this.log('    - Energy declining from baseline');
          this.log('    - Sleep quality reducing');
          
          // Close modal
          const closeButton = document.querySelector('[aria-label="Close"], button:has(svg)');
          if (closeButton) {
            (closeButton as HTMLElement).click();
            await this.wait(1000);
            this.log('  ✓ Closed analysis modal, back to home screen');
          }
        } else {
          this.log('  ⚠ AI Analysis card not visible for past day');
        }
        
        // Also show metrics card by clicking on it
        this.log('Clicking on metrics card to view detailed metrics...');
        const metricsCard = document.querySelector('.bg-card.rounded-3xl');
        if (metricsCard) {
          (metricsCard as HTMLElement).click();
          await this.wait(2000);
          this.log('  ✓ Detailed Metrics modal opened');
          this.log('  Showing complete check-in data for Day 10');
          
          await this.wait(3000);
          
          // Close metrics modal
          const metricsCloseBtn = document.querySelector('[aria-label="Close"], button:has(svg)');
          if (metricsCloseBtn) {
            (metricsCloseBtn as HTMLElement).click();
            await this.wait(1000);
            this.log('  ✓ Closed metrics modal');
          }
        }
      }
    }
    
    // Navigate back to today
    this.log('Returning to today\'s view...');
    const todayPill = Array.from(document.querySelectorAll('[data-date]')).find(pill => {
      const dateText = pill.textContent || '';
      return dateText.includes('22/') || dateText.includes('Today');
    });
    
    if (todayPill) {
      (todayPill as HTMLElement).click();
      await this.wait(1500);
      this.log('  ✓ Back to today\'s view');
    }
    
    await this.wait(2000);
    this.log('Scene 2 complete ✅');
  }

  /**
   * Scene 3: Today's Daily Check-in [~60 seconds]
   * Complete all 9 check-in cards with Day 15 data
   */
  private async scene3_TodaysCheckIn(): Promise<void> {
    this.log('═══════════════════════════════════════');
    this.log('✍️ SCENE 3: Today\'s Check-in [~60s]');
    this.log('═══════════════════════════════════════');
    this.log('Story: Day 15 - Critical data showing escalation');
    
    // Find and click "Complete today's check-in" button
    this.log('Looking for check-in button...');
    const checkInButton = document.querySelector('button:has-text("check-in"), button:has-text("Check In"), [data-action="check-in"]');
    
    if (checkInButton) {
      this.log('✓ Found check-in button, starting check-in...');
      (checkInButton as HTMLElement).click();
      await this.wait(2000);
    } else {
      this.log('⚠ Check-in button not found, may already be in check-in flow');
    }
    
    // Day 15 data from demo script
    const day15Data = {
      energy: 2,
      sleep: 4.5,
      symptoms: 'Lower abdomen ache (moderate)',
      respiratory: 95,
      temperature: 37.8,
      mood: 'Low/Anxious',
      appetite: 'Very Low',
      lifestyle: 'Water: No, Exercise: No, Meditation: No, Screen: Too much, Social: Isolated, Custom: Skipped both lunch and breakfast',
      openFlag: 'Feeling unwell'
    };
    
    this.log('Filling check-in cards with Day 15 data:');
    
    // Card 1: Energy
    this.log('Card 1/9: Energy Level = 2/5');
    await this.fillCard('energy', day15Data.energy);
    
    // Card 2: Sleep
    this.log('Card 2/9: Sleep = 4.5 hours (Very Poor)');
    await this.fillCard('sleep', day15Data.sleep);
    
    // Card 3: Symptoms
    this.log('Card 3/9: Physical Symptoms = Lower abdomen ache (moderate intensity)');
    await this.fillCard('symptoms', day15Data.symptoms);
    
    // Card 4: Respiratory
    this.log('Card 4/9: Respiratory = 95% (None)');
    await this.fillCard('respiratory', day15Data.respiratory);
    
    // Card 5: Temperature
    this.log('Card 5/9: Temperature = 37.8°C (Slight fever - NEW SYMPTOM!)');
    await this.fillCard('temperature', day15Data.temperature);
    
    // Card 6: Mood
    this.log('Card 6/9: Mood = Low/Anxious');
    await this.fillCard('mood', day15Data.mood);
    
    // Card 7: Appetite
    this.log('Card 7/9: Appetite = Very Low');
    await this.fillCard('appetite', day15Data.appetite);
    
    // Card 8: Lifestyle
    this.log('Card 8/9: Lifestyle = Skipped meals, isolated, high screen time');
    await this.fillCard('lifestyle', day15Data.lifestyle);
    
    // Card 9: Open Flag
    this.log('Card 9/9: Open Flag = "Feeling unwell"');
    await this.fillCard('openFlag', day15Data.openFlag);
    
    // Submit check-in
    this.log('Submitting check-in...');
    const submitButton = document.querySelector('button[type="submit"], button:has-text("Submit"), button:has-text("Complete")');
    if (submitButton) {
      (submitButton as HTMLElement).click();
      await this.wait(3000);
      this.log('✓ Check-in submitted successfully');
      this.log('  Streak confirmed: 15 days 🔥');
    }
    
    this.log('Scene 3 complete ✅');
  }

  /**
   * Scene 4: AI Analysis with Concern [~60 seconds]
   * Show AI analysis card and recommendation overview
   */
  private async scene4_AIAnalysis(): Promise<void> {
    this.log('═══════════════════════════════════════');
    this.log('🤖 SCENE 4: AI Analysis Overview [~60s]');
    this.log('═══════════════════════════════════════');
    this.log('Story: AI detects 14-day pattern and recommends checkup (Nudge #1)');
    
    await this.wait(2000);
    
    this.log('AI Analysis Summary:');
    this.log('  - Pattern detected over 14 days');
    this.log('  - Energy: 4/5 → 2/5 (sustained decline)');
    this.log('  - Sleep: 7-8hrs → 4.5hrs (progressive disruption)');
    this.log('  - Symptoms: Recurring lower abdomen ache (Days 10,12,14,15)');
    this.log('  - NEW: Slight fever (37.8°C)');
    this.log('  - Appetite: Reduced, skipping meals');
    this.log('  - Mood: Consistently low, social isolation');
    this.log('  - Risk factors: Family history + 14 months since last checkup');
    
    // Find and click AI Analysis card
    this.log('Looking for AI Analysis card...');
    const aiCard = document.querySelector('[data-testid="ai-analysis-card"], .ai-analysis, button:has-text("AI Analysis")');
    
    if (aiCard) {
      await this.wait(3000); // Show pulsing card
      this.log('✓ AI Analysis card visible (pulsing to draw attention)');
      this.log('Clicking AI Analysis card...');
      (aiCard as HTMLElement).click();
      await this.wait(2000);
      
      this.log('✓ Analysis Overview screen opened');
      this.log('Recommendation: "This isn\'t a diagnosis — but it\'s a signal worth checking.');
      this.log('                 We strongly recommend a checkup within the next 2-3 days."');
      this.log('Suggested specialties: General Practice, Women\'s Health, Gastroenterology');
      
      await this.wait(5000); // Show overview for 5 seconds
      
      this.log('Two action buttons available:');
      this.log('  1. "Book Clinic Visit" → Navigate to clinics');
      this.log('  2. "See Detailed Analysis" → Open detailed modal');
    } else {
      this.log('⚠ AI Analysis card not found, may need to implement');
    }
    
    this.log('💡 Nudge count: 1 (first recommendation)');
    this.log('Scene 4 complete ✅');
  }

  /**
   * Scene 5: Detailed Analysis Modal [~60 seconds]
   * Show detailed AI reasoning with day-by-day citations
   */
  private async scene5_DetailedAnalysis(): Promise<void> {
    this.log('═══════════════════════════════════════');
    this.log('📊 SCENE 5: Detailed Analysis Modal [~60s]');
    this.log('═══════════════════════════════════════');
    this.log('Story: Show AI reasoning process with citations');
    
    // Click "See Detailed Analysis" button
    this.log('Looking for "See Detailed Analysis" button...');
    const detailButton = document.querySelector('button:has-text("Detailed"), button:has-text("See Detail")');
    
    if (detailButton) {
      this.log('✓ Opening detailed analysis modal...');
      (detailButton as HTMLElement).click();
      await this.wait(2000);
      
      this.log('📋 Detailed Analysis Structure:');
      this.log('');
      this.log('Pattern Detection Summary:');
      this.log('  Duration: 14 days (escalation in last 7 days)');
      this.log('  Concerning metrics: Energy, Sleep, Symptoms, Appetite, Mood, Temperature');
      this.log('');
      this.log('Energy Decline:');
      this.log('  Days 1-3: Avg 4/5 (normal baseline)');
      this.log('  Days 4-7: Avg 3/5 (mild decline)');
      this.log('  Days 8-14: Avg 2/5 (significant sustained decline)');
      this.log('  Day 15: 2/5 (continues concerning pattern)');
      this.log('  Assessment: Progressive energy decline suggests underlying issue');
      
      await this.wait(3000);
      this.log('Scrolling to show Sleep Disruption analysis...');
      await this.scroll(300);
      
      this.log('Sleep Disruption:');
      this.log('  Days 1-3: 7-8hrs (healthy range)');
      this.log('  Days 4-7: 6-7hrs (mild reduction)');
      this.log('  Days 8-11: 5-6hrs (poor quality)');
      this.log('  Days 12-15: 4-5hrs (severely disrupted)');
      this.log('  Referenced: Day 8, Day 10, Day 13, Day 15');
      this.log('  Assessment: Sleep degradation correlates with symptom onset');
      
      await this.wait(3000);
      this.log('Scrolling to show Physical Symptoms analysis...');
      await this.scroll(300);
      
      this.log('Physical Symptoms - Lower Abdomen:');
      this.log('  Day 10: First appearance (mild ache)');
      this.log('  Day 12: Recurrence (mild ache)');
      this.log('  Day 14: Recurrence (mild ache)');
      this.log('  Day 15: Current (moderate ache - intensity increased)');
      this.log('  Assessment: Recurring localized discomfort requires evaluation');
      
      await this.wait(3000);
      this.log('Scrolling to show Recommendation...');
      await this.scroll(300);
      
      this.log('');
      this.log('Final Recommendation:');
      this.log('  "Based on 14-day pattern, recommend checkup within 2-3 days."');
      this.log('  "Combination of escalating physical symptoms (abdomen + fever),');
      this.log('   sustained energy/sleep disruption, and appetite decline—');
      this.log('   particularly given family history and overdue checkup—');
      this.log('   warrants professional evaluation."');
      this.log('');
      this.log('  Possible areas: Reproductive health, GI issues, or early infection');
      
      await this.wait(3000);
      
      // Close modal
      this.log('Closing detailed analysis modal...');
      const closeButton = document.querySelector('[aria-label="Close"], button:has-text("Close")');
      if (closeButton) {
        (closeButton as HTMLElement).click();
        await this.wait(1000);
      }
    } else {
      this.log('⚠ Detailed analysis button not found');
    }
    
    this.log('Scene 5 complete ✅');
  }

  /**
   * Scene 6: Booking Clinic Visit [~60 seconds]
   * Navigate to clinics tab and show booking flow
   */
  private async scene6_BookingClinic(): Promise<void> {
    this.log('═══════════════════════════════════════');
    this.log('🏥 SCENE 6: Booking Clinic Visit [~60s]');
    this.log('═══════════════════════════════════════');
    this.log('Story: Navigate to clinics with AI context');
    
    // Click "Book Clinic Visit" button
    this.log('Looking for "Book Clinic Visit" button...');
    const bookButton = document.querySelector('button:has-text("Book Clinic"), button:has-text("Book")');
    
    if (bookButton) {
      this.log('✓ Clicking "Book Clinic Visit"...');
      (bookButton as HTMLElement).click();
      await this.wait(2000);
      
      this.log('✓ Navigated to Clinics tab');
      this.log('Enhanced view showing:');
      this.log('  - Context banner: "Based on analysis, we recommend General Practice/Women\'s Health"');
      this.log('  - Search bar: "Search clinics or specialties..."');
      this.log('  - Filter icon for advanced filtering');
      this.log('  - "12 clinics available" count');
      
      await this.wait(3000);
      
      // Try to open filter
      this.log('Opening advanced filter sheet...');
      const filterButton = document.querySelector('[aria-label*="filter"], button:has-text("Filter")');
      if (filterButton) {
        (filterButton as HTMLElement).click();
        await this.wait(2000);
        
        this.log('Filter options:');
        this.log('  - Sort by: Distance / Rating / Discount');
        this.log('  - Max distance: 5km slider');
        this.log('  - Min rating: 4.5 stars slider');
        this.log('  - Specialties: General Practice ✓, Women\'s Health ✓, Gastro ✓');
        
        await this.wait(2000);
        
        // Apply filters
        const applyButton = document.querySelector('button:has-text("Apply")');
        if (applyButton) {
          this.log('Applying filters...');
          (applyButton as HTMLElement).click();
          await this.wait(1500);
        }
      }
      
      this.log('Filtered results showing 2-3 partner clinics:');
      this.log('  1. Wellness Medical Center (4.8★, 2.3km, 20% discount)');
      this.log('  2. City Health Clinic (4.6★, 3.1km, 20% discount)');
      
      await this.wait(3000);
      
      // Click on first clinic
      this.log('Selecting Wellness Medical Center...');
      const clinicCard = document.querySelector('[data-testid="clinic-card"], .clinic-card');
      if (clinicCard) {
        (clinicCard as HTMLElement).click();
        await this.wait(2000);
        
        this.log('✓ Clinic detail screen opened');
        this.log('  - Map showing location');
        this.log('  - Available time slots');
        this.log('  - 20% discount code: PULSE-AMR-2024');
        this.log('  - Payment preview with discount applied');
        
        await this.wait(3000);
        
        this.log('Proceeding with booking...');
        const bookNowButton = document.querySelector('button:has-text("Book"), button:has-text("Schedule")');
        if (bookNowButton) {
          (bookNowButton as HTMLElement).click();
          await this.wait(2000);
          this.log('✓ Booking confirmation shown');
        }
      }
    } else {
      this.log('⚠ Book button not found');
    }
    
    this.log('Scene 6 complete ✅');
  }

  /**
   * Scene 7: Feedback Loop [~45 seconds]
   * Show feedback modal asking if user booked
   */
  private async scene7_FeedbackLoop(): Promise<void> {
    this.log('═══════════════════════════════════════');
    this.log('🔄 SCENE 7: Feedback Loop [~45s]');
    this.log('═══════════════════════════════════════');
    this.log('Story: Follow-up asking if user took action');
    
    await this.wait(2000);
    
    this.log('Feedback Loop Modal appears:');
    this.log('  Question: "Did you book a checkup?"');
    this.log('  Context: "We recommended this 1 time based on your health pattern"');
    this.log('  Options:');
    this.log('    - "Yes, I did" → Upload doctor report option');
    this.log('    - "Not yet" → Info about auto-booking after 3 nudges');
    
    await this.wait(5000);
    
    this.log('User interaction paths:');
    this.log('  Path A: Yes, I did → Optional doctor report upload');
    this.log('           - Accepts: PDF, JPG, PNG');
    this.log('           - Encrypted and private');
    this.log('           - Helps AI provide better insights');
    this.log('  Path B: Not yet → Learn about auto-booking');
    this.log('           - After 3 reminders, auto-schedule with 100% discount');
    
    await this.wait(3000);
    
    this.log('Scene 7 complete ✅');
  }

  /**
   * Scene 8: Auto-booking after 3 Nudges [~45 seconds]
   * Show auto-scheduled appointment with 100% discount
   */
  private async scene8_AutoBooking(): Promise<void> {
    this.log('═══════════════════════════════════════');
    this.log('🎁 SCENE 8: Auto-booking Card [~45s]');
    this.log('═══════════════════════════════════════');
    this.log('Story: After 3 ignored nudges, auto-schedule with FREE checkup');
    
    await this.wait(2000);
    
    this.log('Auto-Booking Card displays:');
    this.log('  🎁 100% Discount Applied! - Completely FREE checkup');
    this.log('  ');
    this.log('  Auto-Scheduled Checkup Details:');
    this.log('  - Clinic: Wellness Medical Center');
    this.log('  - Address: 45 Herbert Macaulay Way, Yaba, Lagos');
    this.log('  - Date: February 24, 2026');
    this.log('  - Time: 10:00 AM');
    this.log('  ');
    this.log('  Why auto-scheduled?');
    this.log('  "After 3 health recommendations, we want to make it as easy');
    this.log('   as possible for you to get checked. This appointment is');
    this.log('   completely free and can be modified or cancelled anytime."');
    this.log('  ');
    this.log('  Included in free visit:');
    this.log('    ✓ Comprehensive health examination');
    this.log('    ✓ Review of 15-day health pattern with doctor');
    this.log('    ✓ Relevant diagnostic tests (if needed)');
    this.log('    ✓ Personalized treatment plan');
    
    await this.wait(5000);
    
    this.log('Action buttons:');
    this.log('  1. "Confirm Appointment" (primary) → Confirm booking');
    this.log('  2. "Modify" → Change date/time/clinic');
    this.log('  3. "Cancel" → Cancel auto-booking');
    this.log('  ');
    this.log('  Fine print: No payment required • Can reschedule • No cancellation fee');
    
    await this.wait(3000);
    this.log('Scene 8 complete ✅');
  }

  /**
   * Scene 9: Chat with Health Context [~60 seconds]
   * Show AI chat with automatic context from check-ins
   */
  private async scene9_ChatWithContext(): Promise<void> {
    this.log('═══════════════════════════════════════');
    this.log('💬 SCENE 9: Chat with Context [~60s]');
    this.log('═══════════════════════════════════════');
    this.log('Story: Chat AI has automatic access to check-in history');
    
    // Navigate to Chat tab
    this.log('Navigating to Chat tab...');
    const chatTab = document.querySelector('[data-tab="chat"], button:has-text("Chat")');
    if (chatTab) {
      (chatTab as HTMLElement).click();
      await this.wait(2000);
      
      this.log('✓ Chat interface opened');
      await this.wait(2000);
      
      // Type question
      const chatInput = document.querySelector('input[type="text"], textarea');
      if (chatInput) {
        this.log('User types: "What could be causing my abdomen pain?"');
        (chatInput as HTMLInputElement).value = 'What could be causing my abdomen pain?';
        await this.wait(2000);
        
        // Send message
        this.log('Sending message...');
        const sendButton = document.querySelector('button:has-text("Send")');
        if (sendButton) {
          (sendButton as HTMLElement).click();
          await this.wait(1000);
        } else {
          // Try Enter key
          const event = new KeyboardEvent('keydown', { key: 'Enter' });
          chatInput.dispatchEvent(event);
        }
        
        await this.wait(3000);
        
        this.log('✓ AI Response (with automatic health context):');
        this.log('  "Based on your 15-day check-in history, I can see that your');
        this.log('   lower abdomen discomfort first appeared on Day 10, then');
        this.log('   recurred on Days 12, 14, and intensified to moderate on Day 15.');
        this.log('  ');
        this.log('   Combined with your recent fever (37.8°C), declining energy');
        this.log('   (4/5→2/5), disrupted sleep (7-8hrs→4.5hrs), and reduced');
        this.log('   appetite, this pattern warrants medical attention.');
        this.log('  ');
        this.log('   Given your age (28) and family history (hypertension, diabetes),');
        this.log('   possible causes could include:');
        this.log('   • Reproductive health concerns (ovarian, menstrual)');
        this.log('   • Gastrointestinal issues');
        this.log('   • Early infection');
        this.log('  ');
        this.log('   I strongly recommend the checkup we suggested. Would you');
        this.log('   like me to help you book an appointment?"');
        
        await this.wait(5000);
        
        this.log('💡 Key feature: Chat automatically references:');
        this.log('  - 15-day check-in history');
        this.log('  - Specific day citations (Days 10, 12, 14, 15)');
        this.log('  - User profile (age, family history)');
        this.log('  - Previous AI analysis conclusions');
        this.log('  No need for user to re-explain symptoms!');
      }
    } else {
      this.log('⚠ Chat tab not found');
    }
    
    await this.wait(2000);
    this.log('Scene 9 complete ✅');
  }

  /**
   * Scene 10: Profile Updates [~30 seconds]
   * Show profile screen with streak and health score
   */
  private async scene10_Profile(): Promise<void> {
    this.log('═══════════════════════════════════════');
    this.log('👤 SCENE 10: Profile Screen [~30s]');
    this.log('═══════════════════════════════════════');
    this.log('Story: View Amara\'s profile and health metrics');
    
    // Navigate to Profile tab
    this.log('Navigating to Profile tab...');
    const profileTab = document.querySelector('[data-tab="profile"], button:has-text("Profile")');
    if (profileTab) {
      (profileTab as HTMLElement).click();
      await this.wait(2000);
      
      this.log('✓ Profile screen opened');
      this.log('');
      this.log('Profile Information:');
      this.log('  Name: Amara');
      this.log('  Age: 28');
      this.log('  Gender: Female');
      this.log('  Streak: 15 days 🔥');
      this.log('  Health Score: 68 (decreased due to recent pattern)');
      this.log('  Tier: Regular (20% discount)');
      this.log('  Join Date: February 8, 2026');
      this.log('');
      this.log('Medical History:');
      this.log('  Known Conditions: None');
      this.log('  Family History: Hypertension (father), Diabetes (grandmother)');
      this.log('  Medications: None');
      this.log('  Last Checkup: December 22, 2024 (14 months ago)');
      
      await this.wait(5000);
    } else {
      this.log('⚠ Profile tab not found');
    }
    
    this.log('Scene 10 complete ✅');
  }

  /**
   * Scene 11: Billing/Subscription [~30 seconds]
   * Show tier benefits and discount system
   */
  private async scene11_Billing(): Promise<void> {
    this.log('═══════════════════════════════════════');
    this.log('💳 SCENE 11: Billing & Subscription [~30s]');
    this.log('═══════════════════════════════════════');
    this.log('Story: Streak-based discount tiers');
    
    // Navigate to Billing
    this.log('Navigating to Billing section...');
    const billingTab = document.querySelector('[data-tab="billing"], button:has-text("Billing")');
    if (billingTab) {
      (billingTab as HTMLElement).click();
      await this.wait(2000);
      
      this.log('✓ Billing screen opened');
      this.log('');
      this.log('Discount Tier System:');
      this.log('  Current Tier: Regular (15 days streak)');
      this.log('  Current Discount: 20% off clinic visits');
      this.log('  ');
      this.log('  Tier Progression:');
      this.log('  • Days 1-6: Standard (10% off)');
      this.log('  • Days 7-29: Regular (20% off) ← YOU ARE HERE');
      this.log('  • Days 30-89: Silver (30% off)');
      this.log('  • Days 90+: Gold (40% off)');
      this.log('  ');
      this.log('  Benefits at Regular tier:');
      this.log('  ✓ 20% off all clinic visits');
      this.log('  ✓ Priority AI analysis');
      this.log('  ✓ Extended chat history');
      this.log('  ✓ Health insights dashboard');
      
      await this.wait(5000);
    } else {
      this.log('⚠ Billing section not found');
    }
    
    this.log('Scene 11 complete ✅');
  }

  /**
   * Scene 12: Clinic Partner Dashboard [~60 seconds]
   * Show clinic receiving appointment with AI context
   */
  private async scene12_ClinicDashboard(): Promise<void> {
    this.log('═══════════════════════════════════════');
    this.log('🏥 SCENE 12: Clinic Partner Dashboard [~60s]');
    this.log('═══════════════════════════════════════');
    this.log('Story: Clinic receives appointment with full health context');
    
    // Navigate to clinic dashboard (separate view)
    this.log('Switching to Clinic Partner view...');
    this.log('(In production, this would be a separate clinic portal)');
    
    await this.wait(2000);
    
    this.log('Clinic: Wellness Medical Center Dashboard');
    this.log('Partner ID: WMC-2024-001');
    this.log('');
    this.log('Today\'s Stats:');
    this.log('  Appointments Today: 4');
    this.log('  Pending Confirmation: 1');
    this.log('  High Priority: 1 (AI-flagged)');
    this.log('  This Week: 23 bookings');
    this.log('');
    this.log('📋 Incoming Appointment - HIGH PRIORITY:');
    this.log('  Patient: Amara (28F) - First visit');
    this.log('  Date: February 24, 2026');
    this.log('  Time: 10:00 AM');
    this.log('  Status: Pending Confirmation');
    this.log('  Contact: +234 803 456 7890');
    this.log('  ');
    this.log('  🤖 AI Health Context (14-day pattern):');
    this.log('  "Energy decline (4→2), sleep disruption (7-8hrs→4.5hrs),');
    this.log('   recurring lower abdomen pain (Days 10,12,14,15),');
    this.log('   fever (37.8°C), reduced appetite. Family history:');
    this.log('   Hypertension, Diabetes. Last checkup: 14 months ago."');
    this.log('  ');
    this.log('  AI Suggested Investigation Areas:');
    this.log('  • Reproductive Health');
    this.log('  • Gastrointestinal');
    this.log('  • Early Infection Screening');
    this.log('  ');
    this.log('  Actions:');
    this.log('  [Confirm Appointment] [Message Patient] [Reschedule] [Cancel]');
    this.log('  [View full 15-day check-in history]');
    
    await this.wait(8000);
    
    this.log('💡 Key benefit: Clinic receives comprehensive patient context');
    this.log('   before appointment, enabling better preparation and care');
    
    this.log('Scene 12 complete ✅');
  }

  /**
   * Scene 13: Analytics/Visualizations [Variable]
   * Show health trends and charts
   */
  private async scene13_Analytics(): Promise<void> {
    this.log('═══════════════════════════════════════');
    this.log('📈 SCENE 13: Analytics & Visualizations');
    this.log('═══════════════════════════════════════');
    this.log('Story: Interactive charts showing health trends');
    
    // Navigate to Analytics/History
    this.log('Navigating to Analytics/History tab...');
    const analyticsTab = document.querySelector('[data-tab="analytics"], [data-tab="history"], button:has-text("History")');
    if (analyticsTab) {
      (analyticsTab as HTMLElement).click();
      await this.wait(2000);
      
      this.log('✓ Analytics view opened');
      this.log('');
      this.log('📊 Interactive Visualizations:');
      this.log('');
      this.log('1. Energy Trend Chart (15 days):');
      this.log('   Line graph showing decline from 4 → 3 → 2');
      this.log('   Clear downward trend visible');
      this.log('');
      this.log('2. Sleep Pattern Chart (15 days):');
      this.log('   Bar chart showing hours: 7-8hrs → 6-7hrs → 5-6hrs → 4.5hrs');
      this.log('   Concerning progressive disruption');
      this.log('');
      this.log('3. Symptom Timeline:');
      this.log('   Day 6-7: Mild headaches');
      this.log('   Day 10: Lower abdomen discomfort (first)');
      this.log('   Day 12: Lower abdomen ache (recurrence)');
      this.log('   Day 14: Lower abdomen ache (recurrence)');
      this.log('   Day 15: Lower abdomen ache (moderate) + Fever');
      this.log('');
      this.log('4. Mood & Appetite Correlation:');
      this.log('   Both declining together from Day 8 onwards');
      this.log('');
      this.log('Filter Options:');
      this.log('  • Time range: Last week / Last month / All time');
      this.log('  • Metric selection: Energy / Sleep / Mood / Symptoms');
      this.log('  • Chart type: Line / Bar / Area');
      
      await this.wait(6000);
      
      this.log('💡 Visualizations make the pattern immediately clear:');
      this.log('   What might be dismissed as "just tired" becomes');
      this.log('   an obvious concerning trend when visualized');
    } else {
      this.log('⚠ Analytics tab not found');
    }
    
    await this.wait(2000);
    this.log('Scene 13 complete ✅');
  }

  /**
   * Scene 14: Demo Summary
   * Wrap up and return to home
   */
  private async scene14_Summary(): Promise<void> {
    this.log('═══════════════════════════════════════');
    this.log('🎬 SCENE 14: Demo Summary & Wrap-up');
    this.log('═══════════════════════════════════════');
    
    // Navigate back to home
    this.log('Returning to home screen...');
    const homeTab = document.querySelector('[data-tab="home"], button:has-text("Home")');
    if (homeTab) {
      (homeTab as HTMLElement).click();
      await this.wait(2000);
    }
    
    this.log('');
    this.log('═══════════════════════════════════════');
    this.log('✨ DEMO COMPLETE - PULSE JOURNEY SUMMARY');
    this.log('═══════════════════════════════════════');
    this.log('');
    this.log('We followed Amara\'s complete health journey:');
    this.log('');
    this.log('1. ✅ Onboarding - Health profile setup');
    this.log('2. ✅ Home Screen - 15-day streak visualization');
    this.log('3. ✅ Daily Check-in - Day 15 data entry (critical)');
    this.log('4. ✅ AI Analysis - Pattern detection & recommendation');
    this.log('5. ✅ Detailed Analysis - AI reasoning with citations');
    this.log('6. ✅ Clinic Booking - Filtered search & scheduling');
    this.log('7. ✅ Feedback Loop - User follow-up system');
    this.log('8. ✅ Auto-booking - 100% free appointment after 3 nudges');
    this.log('9. ✅ Chat with Context - AI knows full history');
    this.log('10. ✅ Profile - Health metrics & streak');
    this.log('11. ✅ Billing - Tier-based discount system');
    this.log('12. ✅ Clinic Dashboard - Partner portal with patient context');
    this.log('13. ✅ Analytics - Visual health trends');
    this.log('14. ✅ Summary - Complete journey');
    this.log('');
    this.log('KEY FEATURES DEMONSTRATED:');
    this.log('• 📊 15-day pattern detection');
    this.log('• 🤖 AI health analysis with reasoning');
    this.log('• 🏥 Seamless clinic booking with discounts');
    this.log('• 🔄 Smart feedback loops');
    this.log('• 🎁 Auto-booking with 100% discount');
    this.log('• 💬 Context-aware chat');
    this.log('• 📈 Visual analytics');
    this.log('• 🏥 Clinic partner integration');
    this.log('');
    this.log('Total demo time: ~10 minutes');
    this.log('Story: Early detection saved Amara from ignoring serious symptoms');
    this.log('');
    this.log('═══════════════════════════════════════');
    this.log('🎉 END OF DEMO - Thank you for watching!');
    this.log('═══════════════════════════════════════');
    
    await this.wait(3000);
  }

  /**
   * Helper: Fill a check-in card
   */
  private async fillCard(cardType: string, value: string | number): Promise<void> {
    // Find next button to navigate between cards
    const nextButton = document.querySelector('button:has-text("Next"), button:has-text("Continue")');
    
    // Simulate filling the card
    await this.wait(1500);
    
    // Click next to proceed
    if (nextButton) {
      (nextButton as HTMLElement).click();
      await this.wait(500);
    }
  }

  /**
   * Helper: Wait for specified duration
   */
  private async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Helper: Scroll page or element
   */
  private async scroll(amount: number): Promise<void> {
    window.scrollBy({ top: amount, behavior: 'smooth' });
    await this.wait(500);
  }

  /**
   * Run the complete demo (all 14 scenes)
   */
  public async runDemo(): Promise<void> {
    if (this.isRunning) {
      this.log('⚠ Demo already running');
      return;
    }

    this.isRunning = true;
    this.log('');
    this.log('🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬');
    this.log('  PULSE DEMO - AUTOMATED RUNNER STARTING');
    this.log('  Following demo-script.md strictly');
    this.log('  Total: 14 scenes, ~10 minutes');
    this.log('🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬');
    this.log('');

    try {
      await this.scene1_Onboarding();
      await this.scene2_HomeScreen();
      await this.scene3_TodaysCheckIn();
      await this.scene4_AIAnalysis();
      await this.scene5_DetailedAnalysis();
      await this.scene6_BookingClinic();
      await this.scene7_FeedbackLoop();
      await this.scene8_AutoBooking();
      await this.scene9_ChatWithContext();
      await this.scene10_Profile();
      await this.scene11_Billing();
      await this.scene12_ClinicDashboard();
      await this.scene13_Analytics();
      await this.scene14_Summary();

      this.log('');
      this.log('✅ All 14 scenes completed successfully!');
      this.log('Total logs generated: ' + this.logs.length);
    } catch (error) {
      this.log('❌ Error during demo execution:');
      this.log(String(error));
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Get all logs
   */
  public getLogs(): string[] {
    return this.logs;
  }

  /**
   * Export logs to console
   */
  public exportLogs(): void {
    console.log('\n\n=== DEMO RUNNER LOGS ===\n');
    this.logs.forEach(log => console.log(log));
    console.log('\n=== END OF LOGS ===\n\n');
  }
}

// Singleton instance
let demoRunnerInstance: DemoRunner | null = null;

export function initializeDemoRunner(onLog?: (message: string) => void): DemoRunner {
  if (!demoRunnerInstance) {
    demoRunnerInstance = new DemoRunner(onLog);
  }
  return demoRunnerInstance;
}

export function getDemoRunner(): DemoRunner | null {
  return demoRunnerInstance;
}
