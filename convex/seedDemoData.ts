import { mutation } from "./_generated/server";
import { DEMO_USER_ID } from "./demoUser";

/**
 * Seed the database with Amara's 59-day check-in history
 * This creates a realistic demo with existing streak
 */
export const seedDemoHealthHistory = mutation({
  args: {},
  async handler(ctx) {
    const userId = DEMO_USER_ID;

    // Helper: Convert mood string to number
    const moodToNumber = (mood: string): number => {
      const map: Record<string, number> = {
        positive: 5,
        neutral: 3,
        low: 2,
        anxious: 2,
      };
      return map[mood] || 3;
    };

    // Helper: Generate healthy baseline day
    const generateHealthyDay = (daysAgo: number, dayNumber: number) => {
      const getDateDaysAgo = (days: number): string => {
        const d = new Date();
        d.setDate(d.getDate() - days);
        return d.toISOString().split("T")[0];
      };

      const energyVariations = [4, 5, 4, 5, 4];
      const sleepHours = [7, 7.5, 8, 7.5, 8];
      const qualities = ["good", "great", "great", "good", "great"];
      const moods = [5, 5, 3, 5, 5]; // positive, positive, neutral, positive, positive
      const index = dayNumber % 5;

      return {
        userId,
        date: getDateDaysAgo(daysAgo),
        energy: energyVariations[index],
        sleep: {
          hours: sleepHours[index].toString(),
          quality: qualities[index],
        },
        mood: moods[index],
        symptoms: { none: true },
        respiratory: [],
        temperature: { fever: "no" },
        appetite: { appetite: "good", digestion: "normal", bowel: "normal" },
        lifestyle: { water: true, exercise: index % 2 === 0, medications: "none" },
        aiAnalysis: {
          overview:
            dayNumber % 3 === 0
              ? "Excellent check-in! All indicators are in healthy ranges. You're maintaining good habits and consistency."
              : "Great day! Your wellness metrics look solid. Keep up the good work with your daily check-ins.",
          concernLevel: "none",
          patternsDetected: ["Healthy baseline maintained"],
        },
        createdAt: new Date(getDateDaysAgo(daysAgo)).getTime(),
      };
    };

    // Check if data already exists
    const existingCount = await ctx.db
      .query("healthEntries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (existingCount.length >= 59) {
      console.log(`Demo data already seeded: ${existingCount.length} entries`);
      return { message: "Data already exists", count: existingCount.length };
    }

    // Clear existing demo data to reseed
    for (const entry of existingCount) {
      await ctx.db.delete(entry._id);
    }

    let insertedCount = 0;

    // Days 1-44: Healthy baseline (59 days ago to 16 days ago)
    for (let i = 44; i >= 1; i--) {
      const entry = generateHealthyDay(60 - (45 - i), 45 - i);
      await ctx.db.insert("healthEntries", entry);
      insertedCount++;
    }

    // Day 45: Normal baseline (15 days ago)
    await ctx.db.insert("healthEntries", {
      userId,
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      energy: 4,
      sleep: { hours: "7.5", quality: "good" },
      mood: 5,
      symptoms: { none: true },
      respiratory: [],
      temperature: { fever: "no" },
      appetite: { appetite: "good", digestion: "normal", bowel: "normal" },
      lifestyle: { water: true, exercise: true, medications: "none" },
      aiAnalysis: {
        overview:
          "Great start! Your check-in shows healthy baseline indicators. Energy levels are solid, sleep is adequate, and you're staying active.",
        concernLevel: "none",
        patternsDetected: ["Healthy baseline established"],
      },
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    });
    insertedCount++;

    // Days 46-47: Continue baseline (14-13 days ago)
    await ctx.db.insert("healthEntries", {
      userId,
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      energy: 4,
      sleep: { hours: "8", quality: "great" },
      mood: 5,
      symptoms: { none: true },
      respiratory: [],
      temperature: { fever: "no" },
      appetite: { appetite: "great", digestion: "normal", bowel: "normal" },
      lifestyle: { water: true, exercise: false, medications: "none" },
      aiAnalysis: {
        overview:
          "Another excellent day! You're maintaining consistent energy and got great sleep last night.",
        concernLevel: "none",
        patternsDetected: ["Consistent healthy baseline", "Good sleep hygiene"],
      },
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    });
    insertedCount++;

    await ctx.db.insert("healthEntries", {
      userId,
      date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      energy: 4,
      sleep: { hours: "7", quality: "good" },
      mood: 5,
      symptoms: { none: true },
      respiratory: [],
      temperature: { fever: "no" },
      appetite: { appetite: "good", digestion: "normal", bowel: "normal" },
      lifestyle: { water: true, exercise: true, medications: "none" },
      aiAnalysis: {
        overview:
          "Three days of consistent check-ins with stable indicators. Your energy, sleep, and mood are all in healthy ranges.",
        concernLevel: "none",
        patternsDetected: ["3-day streak maintained", "No health concerns"],
      },
      createdAt: Date.now() - 13 * 24 * 60 * 60 * 1000,
    });
    insertedCount++;

    // Days 48-51: Mild decline (12-9 days ago)
    const mildDeclineDays = [
      {
        daysAgo: 12,
        energy: 3,
        sleep: { hours: "6.5", quality: "okay" },
        mood: 3,
        symptoms: { none: false, location: "head", type: "headache", intensity: "mild" },
        analysis:
          "A slight dip in energy and sleep quality today. The mild headache could be related to screen time or hydration.",
        patterns: ["Energy decline from baseline", "Mild headache noted", "Reduced hydration"],
      },
      {
        daysAgo: 11,
        energy: 3,
        sleep: { hours: "6", quality: "okay" },
        mood: 3,
        symptoms: { none: true },
        analysis:
          "Energy continues at yesterday's level (3/5) and sleep is slightly reduced. The headache has cleared, which is good.",
        patterns: ["Sustained energy dip (2 days)", "Sleep slightly below baseline"],
      },
      {
        daysAgo: 10,
        energy: 3,
        sleep: { hours: "7", quality: "good" },
        mood: 3,
        symptoms: { none: false, location: "head", type: "headache", intensity: "mild" },
        analysis:
          "Sleep improved to 7 hours, but energy remains at 3/5 for the third day. The headache has returned.",
        patterns: ["Sustained energy dip (3 days)", "Recurring mild headaches", "High screen time pattern"],
      },
      {
        daysAgo: 9,
        energy: 3,
        sleep: { hours: "6.5", quality: "okay" },
        mood: 3,
        symptoms: { none: true },
        analysis:
          "One week in! Energy has been consistently lower (3/5) for 4 days now, compared to your 4/5 baseline.",
        patterns: ["Week-long trend: sustained energy decline", "Baseline shift detected"],
      },
    ];

    for (const day of mildDeclineDays) {
      await ctx.db.insert("healthEntries", {
        userId,
        date: new Date(Date.now() - day.daysAgo * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        energy: day.energy,
        sleep: day.sleep,
        mood: day.mood,
        symptoms: day.symptoms,
        respiratory: [],
        temperature: { fever: "no" },
        appetite: { appetite: "good", digestion: "normal", bowel: "normal" },
        lifestyle: { water: false, exercise: false, medications: "none" },
        aiAnalysis: {
          overview: day.analysis,
          concernLevel: "low",
          patternsDetected: day.patterns,
        },
        createdAt: Date.now() - day.daysAgo * 24 * 60 * 60 * 1000,
      });
      insertedCount++;
    }

    // Days 52-55: Concerning pattern (8-5 days ago)
    const concerningDays = [
      {
        daysAgo: 8,
        energy: 2,
        sleep: { hours: "5.5", quality: "poor" },
        mood: 2,
        symptoms: { none: true },
        appetite: "low",
        analysis:
          "Notable shift today. Energy dropped to 2/5, sleep quality is poor (5.5hrs), mood is low, and appetite has decreased.",
        patterns: [
          "Significant energy drop to 2/5",
          "Sleep quality degradation",
          "Mood decline",
          "Appetite reduction",
        ],
        concern: "moderate",
      },
      {
        daysAgo: 7,
        energy: 2,
        sleep: { hours: "6", quality: "poor" },
        mood: 2,
        symptoms: { none: true },
        appetite: "low",
        analysis:
          "Second day with energy at 2/5. Sleep remains poor despite 6 hours. Mood and appetite continue low.",
        patterns: ["Sustained low energy (2 days at 2/5)", "Consecutive poor sleep", "Sustained low mood and appetite"],
        concern: "moderate",
      },
      {
        daysAgo: 6,
        energy: 2,
        sleep: { hours: "5", quality: "poor" },
        mood: 2,
        symptoms: { none: false, location: "lower abdomen", type: "ache", intensity: "mild" },
        appetite: "low",
        analysis:
          "A new symptom has appeared: mild lower abdomen ache. Combined with sustained low energy (now 3 days at 2/5) and worsening sleep.",
        patterns: [
          "New symptom: lower abdomen discomfort",
          "Energy at 2/5 for 3 consecutive days",
          "Sleep degradation (5hrs)",
        ],
        concern: "moderate",
      },
      {
        daysAgo: 5,
        energy: 2,
        sleep: { hours: "5.5", quality: "poor" },
        mood: 2,
        symptoms: { none: true },
        appetite: "low",
        analysis:
          "The abdomen ache from yesterday has cleared, but all other concerning indicators persist: energy still at 2/5 (4th day).",
        patterns: [
          "Energy at 2/5 for 4 consecutive days",
          "Sustained poor sleep quality (4 days)",
          "Low mood/appetite pattern (4 days)",
        ],
        concern: "moderate",
      },
    ];

    for (const day of concerningDays) {
      await ctx.db.insert("healthEntries", {
        userId,
        date: new Date(Date.now() - day.daysAgo * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        energy: day.energy,
        sleep: day.sleep,
        mood: day.mood,
        symptoms: day.symptoms,
        respiratory: [],
        temperature: { fever: "no" },
        appetite: { appetite: day.appetite, digestion: "slow", bowel: "normal" },
        lifestyle: { water: false, exercise: false, medications: "none" },
        openFlag: day.daysAgo === 6 ? "Stomach feels off" : undefined,
        aiAnalysis: {
          overview: day.analysis,
          concernLevel: day.concern,
          patternsDetected: day.patterns,
          recommendation:
            day.concern === "moderate"
              ? "Monitor closely over the next few days. Ensure you're getting adequate rest and nutrition."
              : undefined,
        },
        createdAt: Date.now() - day.daysAgo * 24 * 60 * 60 * 1000,
      });
      insertedCount++;
    }

    // Days 56-58: Pattern escalates (4-2 days ago)
    const escalatingDays = [
      {
        daysAgo: 4,
        energy: 2,
        sleep: { hours: "4.5", quality: "very poor" },
        mood: 2,
        symptoms: { none: false, location: "lower abdomen", type: "ache", intensity: "mild" },
        appetite: "low",
        openFlag: "Skipped lunch",
        analysis:
          "The lower abdomen ache has returned (2nd occurrence). Sleep has worsened significantly to just 4.5 hours with very poor quality.",
        patterns: [
          "Recurring abdomen symptom (Day 10, Day 12)",
          "Sleep severely disrupted (4.5hrs)",
          "Energy at 2/5 for 5 days",
          "Meal skipping noted",
        ],
        concern: "moderate",
      },
      {
        daysAgo: 3,
        energy: 2,
        sleep: { hours: "4.5", quality: "very poor" },
        mood: 2,
        symptoms: { none: true },
        appetite: "low",
        analysis:
          "Sleep remains severely disrupted (4.5hrs for 2nd night). Energy continues at 2/5 (6th day).",
        patterns: [
          "Consecutive severely disrupted sleep (2 nights)",
          "Energy at 2/5 for 6 consecutive days",
          "Week-long low mood/appetite pattern",
        ],
        concern: "moderate",
      },
      {
        daysAgo: 2,
        energy: 2,
        sleep: { hours: "4", quality: "very poor" },
        mood: 2,
        symptoms: { none: false, location: "lower abdomen", type: "ache", intensity: "mild" },
        appetite: "low",
        openFlag: "Very tired, struggling",
        analysis:
          "Two weeks of check-ins complete. The lower abdomen ache has returned for the 3rd time. Sleep is now critically low at just 4 hours.",
        patterns: [
          "Recurring localized symptom (lower abdomen - 3 occurrences over 5 days)",
          "Energy at 2/5 for 7 consecutive days",
          "Sleep critically disrupted (4hrs)",
          "Two-week pattern of decline from healthy baseline",
        ],
        concern: "high",
      },
    ];

    for (const day of escalatingDays) {
      await ctx.db.insert("healthEntries", {
        userId,
        date: new Date(Date.now() - day.daysAgo * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        energy: day.energy,
        sleep: day.sleep,
        mood: day.mood,
        symptoms: day.symptoms,
        respiratory: [],
        temperature: { fever: "no" },
        appetite: { appetite: day.appetite, digestion: "poor", bowel: "irregular" },
        lifestyle: { water: false, exercise: false, medications: "none" },
        openFlag: day.openFlag,
        aiAnalysis: {
          overview: day.analysis,
          concernLevel: day.concern,
          patternsDetected: day.patterns,
          recommendation:
            day.concern === "high"
              ? "Given the sustained and escalating pattern over 14 days, we recommend scheduling a checkup to investigate these symptoms."
              : "The combination of recurring physical symptoms, severe sleep disruption, and reduced nutritional intake requires attention.",
        },
        createdAt: Date.now() - day.daysAgo * 24 * 60 * 60 * 1000,
      });
      insertedCount++;
    }

    // Day 59: Yesterday - Critical escalation (1 day ago)
    await ctx.db.insert("healthEntries", {
      userId,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      energy: 2,
      sleep: { hours: "4.5", quality: "very poor" },
      mood: 2,
      symptoms: { none: false, location: "lower abdomen", type: "ache", intensity: "moderate" },
      respiratory: [],
      temperature: { fever: "yes", temp: 37.8 },
      appetite: { appetite: "very low", digestion: "poor", bowel: "irregular" },
      lifestyle: { water: false, exercise: false, medications: "none" },
      openFlag: "Feeling unwell, skipped both lunch and breakfast",
      aiAnalysis: {
        overview:
          "CRITICAL PATTERN DETECTED: Over the past 14 days, we've noticed a consistent and escalating pattern. Today shows significant deterioration: the abdomen ache has intensified to moderate (previously mild), you now have a slight fever (37.8°C) - a new symptom, appetite has dropped to very low with both meals skipped, and mood shifted to anxious. Energy remains at 2/5 (8th consecutive day), sleep continues severely disrupted (4.5hrs).",
        concernLevel: "high",
        patternsDetected: [
          "NEW SYMPTOM: Fever (37.8°C)",
          "SYMPTOM ESCALATION: Lower abdomen ache intensity increased from mild to moderate (4th recurrence)",
          "CRITICAL: Energy at 2/5 for 8 consecutive days",
          "CRITICAL: Sleep degradation from 7-8hrs baseline to 4.5hrs",
          "Appetite declined from good/great to very low, multiple meals skipped",
          "Multi-day recurring localized pain (lower abdomen: Days 10, 12, 14, 15)",
        ],
        recommendation:
          "URGENT: We strongly recommend scheduling a checkup within the next 2-3 days. The combination of escalating physical symptoms (recurring lower abdomen discomfort now with increased intensity AND new fever), sustained energy/sleep disruption, and appetite decline over 14 days warrants immediate professional evaluation.",
      },
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    });
    insertedCount++;

    console.log(`✅ Successfully seeded ${insertedCount} health check-in entries`);
    return { success: true, count: insertedCount };
  },
});

/**
 * Seed demo user profile
 */
export const seedDemoProfile = mutation({
  args: {},
  async handler(ctx) {
    const userId = DEMO_USER_ID;

    // Check if profile already exists
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      console.log("Demo profile already exists");
      return { message: "Profile already exists", profileId: existing._id };
    }

    // Create profile
    const profileId = await ctx.db.insert("profiles", {
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
      subscriptionTier: "Regular", // For streak discount calculation
    });

    console.log("✅ Demo profile created");
    return { success: true, profileId };
  },
});

/**
 * Seed clinic directory
 */
export const seedClinics = mutation({
  args: {},
  async handler(ctx) {
    const clinics = [
      {
        name: "City Wellness Clinic",
        specialty: "General Practice, Women's Health",
        distance: 2.3,
        rating: 4.8,
        discount: "20%",
        discountCode: "PULSE-CITY",
        address: "123 Allen Avenue, Ikeja, Lagos",
        phone: "+234 803 123 4567",
        hours: "Mon-Fri: 8am-6pm, Sat: 9am-2pm",
        lat: 6.6018,
        lng: 3.3515,
      },
      {
        name: "MedPlus Health Centre",
        specialty: "General Practice, Gastroenterology",
        distance: 4.1,
        rating: 4.6,
        discount: "20%",
        discountCode: "PULSE-MEDPLUS",
        address: "45 Opebi Road, Ikeja, Lagos",
        phone: "+234 802 234 5678",
        hours: "Mon-Fri: 7:30am-7pm, Sat-Sun: 8am-4pm",
        lat: 6.5964,
        lng: 3.3542,
      },
      {
        name: "HealthFirst Medical",
        specialty: "Women's Health, Gynecology",
        distance: 4.8,
        rating: 4.7,
        discount: "20%",
        discountCode: "PULSE-HEALTHFIRST",
        address: "78 Adeola Odeku Street, Victoria Island, Lagos",
        phone: "+234 801 345 6789",
        hours: "Mon-Fri: 8am-5pm, Sat: 9am-1pm",
        lat: 6.4281,
        lng: 3.4219,
      },
      {
        name: "Premier Care Hospital",
        specialty: "General Practice, Emergency Medicine",
        distance: 8.2,
        rating: 4.9,
        discount: "20%",
        discountCode: "PULSE-PREMIER",
        address: "12 Admiralty Way, Lekki Phase 1, Lagos",
        phone: "+234 805 456 7890",
        hours: "24/7",
        lat: 6.4474,
        lng: 3.4706,
      },
    ];

    let insertedCount = 0;
    for (const clinic of clinics) {
      const existing = await ctx.db
        .query("clinics")
        .filter((q) => q.eq(q.field("name"), clinic.name))
        .first();

      if (!existing) {
        await ctx.db.insert("clinics", clinic);
        insertedCount++;
      }
    }

    console.log(`✅ Seeded ${insertedCount} clinics`);
    return { success: true, count: insertedCount };
  },
});

/**
 * Clear all demo data (useful for reseeding)
 */
export const clearDemoData = mutation({
  args: {},
  async handler(ctx) {
    const userId = DEMO_USER_ID;

    // Clear health entries
    const entries = await ctx.db
      .query("healthEntries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const entry of entries) {
      await ctx.db.delete(entry._id);
    }

    console.log(`Cleared ${entries.length} health entries`);
    return { entriesCleared: entries.length };
  },
});
