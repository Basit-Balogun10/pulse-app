// Amara's complete health story - 60 days of check-in data
// Days 1-44: Healthy baseline period (user signed up ~2 months ago)
// Days 45-59: Progressive health decline showing concerning patterns
// Day 60 (today): Pending check-in
// This data tells a coherent narrative that leads to the AI recommending a checkup on Day 59

import { getTodayDate, getDateDaysAgo } from './utils';

export interface CheckInEntry {
  date: string;
  dayNumber: number;
  energy: number; // 1-5 scale
  sleep: {
    hours: number;
    quality: 'great' | 'good' | 'okay' | 'poor' | 'very poor';
  };
  symptoms: {
    location: string;
    type: string;
    intensity: 'mild' | 'moderate' | 'severe';
  }[];
  respiratory: boolean; // has respiratory issues
  temperature: {
    hasFever: boolean;
    value?: number; // Celsius
  };
  mood: 'positive' | 'neutral' | 'low' | 'anxious';
  appetite: 'great' | 'good' | 'low' | 'very low';
  lifestyle: {
    water: boolean;
    exercise: boolean;
    meditation: boolean;
    screenTime: 'normal' | 'too much';
    social: 'active' | 'moderate' | 'isolated';
    customNote?: string;
  };
  openFlag?: string;
  aiAnalysis: {
    summary: string;
    concern_level: 'none' | 'low' | 'moderate' | 'high';
    patterns_detected: string[];
    recommendation?: string;
  };
  hasCheckedIn?: boolean;
}

// Helper function to generate healthy baseline days
function generateHealthyDay(daysAgo: number, dayNumber: number): CheckInEntry {
  const energyVariations = [4, 5, 4, 5, 4];
  const sleepHours = [7, 7.5, 8, 7.5, 8];
  const qualities: Array<'great' | 'good'> = ['good', 'great', 'great', 'good', 'great'];
  const moods: Array<'positive' | 'neutral'> = ['positive', 'positive', 'neutral', 'positive', 'positive'];
  const appetites: Array<'great' | 'good'> = ['great', 'good', 'great', 'good', 'great'];
  const exercises = [true, false, true, true, false];
  const meditations = [false, true, false, true, false];
  const socials: Array<'active' | 'moderate'> = ['active', 'active', 'moderate', 'active', 'moderate'];
  
  const index = dayNumber % 5;
  
  return {
    date: getDateDaysAgo(daysAgo),
    dayNumber,
    energy: energyVariations[index],
    sleep: {
      hours: sleepHours[index],
      quality: qualities[index],
    },
    symptoms: [],
    respiratory: false,
    temperature: {
      hasFever: false,
    },
    mood: moods[index],
    appetite: appetites[index],
    lifestyle: {
      water: true,
      exercise: exercises[index],
      meditation: meditations[index],
      screenTime: 'normal',
      social: socials[index],
    },
    aiAnalysis: {
      summary: dayNumber % 3 === 0 
        ? "Excellent check-in! All indicators are in healthy ranges. You're maintaining good habits and consistency." 
        : "Great day! Your wellness metrics look solid. Keep up the good work with your daily check-ins.",
      concern_level: 'none',
      patterns_detected: ['Healthy baseline maintained'],
    },
  };
}

// Generate 44 healthy baseline days (Days 1-44: ~6 weeks of healthy baseline)
const healthyBaselineDays: CheckInEntry[] = Array.from({ length: 44 }, (_, i) => 
  generateHealthyDay(59 - i, i + 1)
);

// Days 45-47: Normal baseline (start of the critical 15-day period)
export const amaraDay45: CheckInEntry = {
  date: getDateDaysAgo(15), // 15 days ago
  dayNumber: 45,
  energy: 4,
  sleep: {
    hours: 7.5,
    quality: 'good',
  },
  symptoms: [],
  respiratory: false,
  temperature: {
    hasFever: false,
  },
  mood: 'positive',
  appetite: 'good',
  lifestyle: {
    water: true,
    exercise: true,
    meditation: false,
    screenTime: 'normal',
    social: 'active',
  },
  aiAnalysis: {
    summary: "Great start! Your check-in shows healthy baseline indicators. Energy levels are solid, sleep is adequate, and you're staying active. No concerning patterns detected.",
    concern_level: 'none',
    patterns_detected: ['Healthy baseline established'],
  },
};

export const amaraDay2: CheckInEntry = {
  date: getDateDaysAgo(14), // 14 days ago
  dayNumber: 46,
  energy: 4,
  sleep: {
    hours: 8,
    quality: 'great',
  },
  symptoms: [],
  respiratory: false,
  temperature: {
    hasFever: false,
  },
  mood: 'positive',
  appetite: 'great',
  lifestyle: {
    water: true,
    exercise: false,
    meditation: true,
    screenTime: 'normal',
    social: 'active',
    customNote: 'Rest day, feeling good',
  },
  aiAnalysis: {
    summary: "Another excellent day! You're maintaining consistent energy and got great sleep last night. Taking a rest day while staying mindful shows good self-care. Keep it up!",
    concern_level: 'none',
    patterns_detected: ['Consistent healthy baseline', 'Good sleep hygiene'],
  },
};

export const amaraDay3: CheckInEntry = {
  date: getDateDaysAgo(13), // 13 days ago
  dayNumber: 47,
  energy: 4,
  sleep: {
    hours: 7,
    quality: 'good',
  },
  symptoms: [],
  respiratory: false,
  temperature: {
    hasFever: false,
  },
  mood: 'positive',
  appetite: 'good',
  lifestyle: {
    water: true,
    exercise: true,
    meditation: false,
    screenTime: 'normal',
    social: 'active',
  },
  aiAnalysis: {
    summary: "Three days of consistent check-ins with stable indicators. Your energy, sleep, and mood are all in healthy ranges. No symptoms or concerns to flag.",
    concern_level: 'none',
    patterns_detected: ['3-day streak maintained', 'No health concerns'],
  },
};

// Days 4-7: Mild decline begins
export const amaraDay4: CheckInEntry = {
  date: getDateDaysAgo(12), // 12 days ago
  dayNumber: 48,
  energy: 3,
  sleep: {
    hours: 6.5,
    quality: 'okay',
  },
  symptoms: [
    {
      location: 'head',
      type: 'headache',
      intensity: 'mild',
    },
  ],
  respiratory: false,
  temperature: {
    hasFever: false,
  },
  mood: 'neutral',
  appetite: 'good',
  lifestyle: {
    water: false,
    exercise: false,
    meditation: false,
    screenTime: 'too much',
    social: 'moderate',
  },
  aiAnalysis: {
    summary: "A slight dip in energy and sleep quality today. The mild headache could be related to screen time or hydration. Nothing alarming, but worth monitoring if it continues.",
    concern_level: 'low',
    patterns_detected: ['Energy decline from baseline', 'Mild headache noted', 'Reduced hydration'],
  },
};

export const amaraDay5: CheckInEntry = {
  date: getDateDaysAgo(11), // 11 days ago
  dayNumber: 49,
  energy: 3,
  sleep: {
    hours: 6,
    quality: 'okay',
  },
  symptoms: [],
  respiratory: false,
  temperature: {
    hasFever: false,
  },
  mood: 'neutral',
  appetite: 'good',
  lifestyle: {
    water: true,
    exercise: false,
    meditation: false,
    screenTime: 'too much',
    social: 'moderate',
  },
  aiAnalysis: {
    summary: "Energy continues at yesterday's level (3/5) and sleep is slightly reduced. The headache has cleared, which is good. Consider getting more rest tonight.",
    concern_level: 'low',
    patterns_detected: ['Sustained energy dip (2 days)', 'Sleep slightly below baseline'],
  },
};

export const amaraDay6: CheckInEntry = {
  date: getDateDaysAgo(10), // 10 days ago
  dayNumber: 50,
  energy: 3,
  sleep: {
    hours: 7,
    quality: 'good',
  },
  symptoms: [
    {
      location: 'head',
      type: 'headache',
      intensity: 'mild',
    },
  ],
  respiratory: false,
  temperature: {
    hasFever: false,
  },
  mood: 'neutral',
  appetite: 'good',
  lifestyle: {
    water: false,
    exercise: false,
    meditation: false,
    screenTime: 'too much',
    social: 'moderate',
  },
  aiAnalysis: {
    summary: "Sleep improved to 7 hours, but energy remains at 3/5 for the third day. The headache has returned. This could be stress or screen-related. Try reducing screen time and staying hydrated.",
    concern_level: 'low',
    patterns_detected: ['Sustained energy dip (3 days)', 'Recurring mild headaches', 'High screen time pattern'],
  },
};

export const amaraDay7: CheckInEntry = {
  date: getDateDaysAgo(9), // 9 days ago
  dayNumber: 51,
  energy: 3,
  sleep: {
    hours: 6.5,
    quality: 'okay',
  },
  symptoms: [],
  respiratory: false,
  temperature: {
    hasFever: false,
  },
  mood: 'neutral',
  appetite: 'good',
  lifestyle: {
    water: true,
    exercise: false,
    meditation: false,
    screenTime: 'too much',
    social: 'moderate',
  },
  aiAnalysis: {
    summary: "One week in! Energy has been consistently lower (3/5) for 4 days now, compared to your 4/5 baseline in days 1-3. Sleep is adequate but could be better. The pattern is mild but worth watching.",
    concern_level: 'low',
    patterns_detected: ['Week-long trend: sustained energy decline', 'Baseline shift detected'],
  },
};

// Days 8-11: Concerning pattern starts
export const amaraDay8: CheckInEntry = {
  date: getDateDaysAgo(8), // 8 days ago
  dayNumber: 52,
  energy: 2,
  sleep: {
    hours: 5.5,
    quality: 'poor',
  },
  symptoms: [],
  respiratory: false,
  temperature: {
    hasFever: false,
  },
  mood: 'low',
  appetite: 'low',
  lifestyle: {
    water: false,
    exercise: false,
    meditation: false,
    screenTime: 'too much',
    social: 'isolated',
    customNote: 'Feeling tired all day',
  },
  aiAnalysis: {
    summary: "Notable shift today. Energy dropped to 2/5, sleep quality is poor (5.5hrs), mood is low, and appetite has decreased. You also noted feeling tired all day. This is the first time we're seeing multiple indicators decline together.",
    concern_level: 'moderate',
    patterns_detected: ['Significant energy drop to 2/5', 'Sleep quality degradation', 'Mood decline', 'Appetite reduction', 'Social isolation noted'],
    recommendation: 'Monitor closely over the next few days. Ensure you&apos;re getting adequate rest and nutrition.',
  },
};

export const amaraDay9: CheckInEntry = {
  date: getDateDaysAgo(7), // 7 days ago
  dayNumber: 53,
  energy: 2,
  sleep: {
    hours: 6,
    quality: 'poor',
  },
  symptoms: [],
  respiratory: false,
  temperature: {
    hasFever: false,
  },
  mood: 'low',
  appetite: 'low',
  lifestyle: {
    water: false,
    exercise: false,
    meditation: false,
    screenTime: 'too much',
    social: 'isolated',
  },
  aiAnalysis: {
    summary: "Second day with energy at 2/5. Sleep remains poor despite 6 hours. Mood and appetite continue low. The pattern from yesterday is persisting, which is concerning when combined.",
    concern_level: 'moderate',
    patterns_detected: ['Sustained low energy (2 days at 2/5)', 'Consecutive poor sleep', 'Sustained low mood and appetite'],
  },
};

export const amaraDay10: CheckInEntry = {
  date: getDateDaysAgo(6), // 6 days ago
  dayNumber: 54,
  energy: 2,
  sleep: {
    hours: 5,
    quality: 'poor',
  },
  symptoms: [
    {
      location: 'lower abdomen',
      type: 'ache',
      intensity: 'mild',
    },
  ],
  respiratory: false,
  temperature: {
    hasFever: false,
  },
  mood: 'low',
  appetite: 'low',
  lifestyle: {
    water: false,
    exercise: false,
    meditation: false,
    screenTime: 'too much',
    social: 'isolated',
    customNote: 'Stomach feels off',
  },
  aiAnalysis: {
    summary: "A new symptom has appeared: mild lower abdomen ache. Combined with sustained low energy (now 3 days at 2/5), worsening sleep (down to 5hrs), and continued low mood/appetite, this pattern warrants attention.",
    concern_level: 'moderate',
    patterns_detected: ['New symptom: lower abdomen discomfort', 'Energy at 2/5 for 3 consecutive days', 'Sleep degradation (5hrs)', 'Sustained low mood/appetite (3 days)'],
    recommendation: 'The appearance of physical symptoms alongside fatigue and poor sleep is noteworthy. Continue monitoring.',
  },
};

export const amaraDay11: CheckInEntry = {
  date: getDateDaysAgo(5), // 5 days ago
  dayNumber: 55,
  energy: 2,
  sleep: {
    hours: 5.5,
    quality: 'poor',
  },
  symptoms: [],
  respiratory: false,
  temperature: {
    hasFever: false,
  },
  mood: 'low',
  appetite: 'low',
  lifestyle: {
    water: false,
    exercise: false,
    meditation: false,
    screenTime: 'too much',
    social: 'isolated',
  },
  aiAnalysis: {
    summary: "The abdomen ache from yesterday has cleared, but all other concerning indicators persist: energy still at 2/5 (4th day), poor sleep (5.5hrs), low mood and appetite. The pattern is becoming more established.",
    concern_level: 'moderate',
    patterns_detected: ['Energy at 2/5 for 4 consecutive days', 'Sustained poor sleep quality (4 days)', 'Low mood/appetite pattern (4 days)', 'Previous abdomen symptom cleared'],
  },
};

// Days 12-14: Pattern escalates
export const amaraDay12: CheckInEntry = {
  date: getDateDaysAgo(4), // 4 days ago
  dayNumber: 56,
  energy: 2,
  sleep: {
    hours: 4.5,
    quality: 'very poor',
  },
  symptoms: [
    {
      location: 'lower abdomen',
      type: 'ache',
      intensity: 'mild',
    },
  ],
  respiratory: false,
  temperature: {
    hasFever: false,
  },
  mood: 'low',
  appetite: 'low',
  lifestyle: {
    water: false,
    exercise: false,
    meditation: false,
    screenTime: 'too much',
    social: 'isolated',
    customNote: 'Skipped lunch',
  },
  aiAnalysis: {
    summary: "The lower abdomen ache has returned (2nd occurrence). Sleep has worsened significantly to just 4.5 hours with very poor quality. You also skipped lunch. Energy remains at 2/5 (5th day). This escalating pattern is concerning.",
    concern_level: 'moderate',
    patterns_detected: ['Recurring abdomen symptom (Day 10, Day 12)', 'Sleep severely disrupted (4.5hrs)', 'Energy at 2/5 for 5 days', 'Meal skipping noted', 'Multi-system pattern emerging'],
    recommendation: 'The combination of recurring physical symptoms, severe sleep disruption, and reduced nutritional intake requires attention.',
  },
};

export const amaraDay13: CheckInEntry = {
  date: getDateDaysAgo(3), // 3 days ago
  dayNumber: 57,
  energy: 2,
  sleep: {
    hours: 4.5,
    quality: 'very poor',
  },
  symptoms: [],
  respiratory: false,
  temperature: {
    hasFever: false,
  },
  mood: 'low',
  appetite: 'low',
  lifestyle: {
    water: false,
    exercise: false,
    meditation: false,
    screenTime: 'too much',
    social: 'isolated',
  },
  aiAnalysis: {
    summary: "Sleep remains severely disrupted (4.5hrs for 2nd night). Energy continues at 2/5 (6th day). Even though the abdomen ache isn't present today, the overall pattern of fatigue, poor sleep, low mood, and reduced appetite has been consistent for nearly a week.",
    concern_level: 'moderate',
    patterns_detected: ['Consecutive severely disrupted sleep (2 nights)', 'Energy at 2/5 for 6 consecutive days', 'Week-long low mood/appetite pattern', 'Persistent social isolation'],
  },
};

export const amaraDay14: CheckInEntry = {
  date: getDateDaysAgo(2), // 2 days ago
  dayNumber: 58,
  energy: 2,
  sleep: {
    hours: 4,
    quality: 'very poor',
  },
  symptoms: [
    {
      location: 'lower abdomen',
      type: 'ache',
      intensity: 'mild',
    },
  ],
  respiratory: false,
  temperature: {
    hasFever: false,
  },
  mood: 'low',
  appetite: 'low',
  lifestyle: {
    water: false,
    exercise: false,
    meditation: false,
    screenTime: 'too much',
    social: 'isolated',
    customNote: 'Very tired, struggling',
  },
  aiAnalysis: {
    summary: "Two weeks of check-ins complete. The lower abdomen ache has returned for the 3rd time (Days 10, 12, 14). Sleep is now critically low at just 4 hours. Energy has been at 2/5 for an entire week. Your note says you're struggling. This sustained multi-symptom pattern warrants professional evaluation.",
    concern_level: 'high',
    patterns_detected: ['Recurring localized symptom (lower abdomen - 3 occurrences over 5 days)', 'Energy at 2/5 for 7 consecutive days', 'Sleep critically disrupted (4hrs)', 'Two-week pattern of decline from healthy baseline', 'User self-reporting difficulty coping'],
    recommendation: 'Given the sustained and escalating pattern over 14 days, we recommend scheduling a checkup to investigate these symptoms.',
  },
};

// Day 15: Today - Critical escalation
export const amaraDay15: CheckInEntry = {
  date: getDateDaysAgo(1), // Yesterday
  dayNumber: 59,
  energy: 2,
  sleep: {
    hours: 4.5,
    quality: 'very poor',
  },
  symptoms: [
    {
      location: 'lower abdomen',
      type: 'ache',
      intensity: 'moderate', // Intensity increased!
    },
  ],
  respiratory: false,
  temperature: {
    hasFever: true,
    value: 37.8, // New symptom!
  },
  mood: 'anxious',
  appetite: 'very low',
  lifestyle: {
    water: false,
    exercise: false,
    meditation: false,
    screenTime: 'too much',
    social: 'isolated',
    customNote: 'Skipped both lunch and breakfast',
  },
  openFlag: 'Feeling unwell',
  aiAnalysis: {
    summary: "CRITICAL PATTERN DETECTED: Over the past 14 days, we've noticed a consistent and escalating pattern. Today shows significant deterioration: the abdomen ache has intensified to moderate (previously mild), you now have a slight fever (37.8°C) - a new symptom, appetite has dropped to very low with both meals skipped, and mood shifted to anxious. Energy remains at 2/5 (8th consecutive day), sleep continues severely disrupted (4.5hrs).",
    concern_level: 'high',
    patterns_detected: [
      'NEW SYMPTOM: Fever (37.8°C)',
      'SYMPTOM ESCALATION: Lower abdomen ache intensity increased from mild to moderate (4th recurrence)',
      'CRITICAL: Energy at 2/5 for 8 consecutive days (vs. 4/5 baseline Days 1-3)',
      'CRITICAL: Sleep degradation from 7-8hrs (Days 1-3) to 4.5hrs (severe disruption)',
      'Appetite declined from good/great to very low, multiple meals skipped',
      'Mood shift: positive baseline → sustained low → now anxious',
      'Multi-day recurring localized pain (lower abdomen: Days 10, 12, 14, 15)',
      'Complete social isolation for 8 days',
    ],
    recommendation: 'URGENT: We strongly recommend scheduling a checkup within the next 2-3 days. The combination of escalating physical symptoms (recurring lower abdomen discomfort now with increased intensity AND new fever), sustained energy/sleep disruption, and appetite decline over 14 days - particularly given your family history of hypertension and diabetes, plus the fact that your last checkup was 14 months ago - warrants immediate professional evaluation. Possible areas for investigation: reproductive health, gastrointestinal issues, or early infection.',
  },
};

// Day 60: Today (check-in not yet completed)
export const amaraDay16: CheckInEntry = {
  date: getTodayDate(), // Today
  dayNumber: 60,
  hasCheckedIn: false, // Today's check-in is pending
  energy: 0,
  sleep: {
    hours: 0,
    quality: 'okay', // Placeholder value
  },
  symptoms: [],
  respiratory: false,
  temperature: {
    hasFever: false,
    value: 0,
  },
  mood: 'neutral',
  appetite: 'good', // Placeholder value
  lifestyle: {
    water: false,
    exercise: false,
    meditation: false,
    screenTime: 'normal', // Placeholder value
    social: 'moderate', // Placeholder value
  },
  aiAnalysis: {
    summary: 'No check-in data yet for today.',
    concern_level: 'none',
    patterns_detected: [],
  },
};

// Export all days as an array for easy access (60 days total)
export const amaraFullStory: CheckInEntry[] = [
  ...healthyBaselineDays, // Days 1-44
  amaraDay45,  // Day 45
  amaraDay2,   // Day 46
  amaraDay3,   // Day 47
  amaraDay4,   // Day 48
  amaraDay5,   // Day 49
  amaraDay6,   // Day 50
  amaraDay7,   // Day 51
  amaraDay8,   // Day 52
  amaraDay9,   // Day 53
  amaraDay10,  // Day 54
  amaraDay11,  // Day 55
  amaraDay12,  // Day 56
  amaraDay13,  // Day 57
  amaraDay14,  // Day 58
  amaraDay15,  // Day 59 (yesterday - AI nudge day)
  amaraDay16,  // Day 60 (today - pending check-in)
];

// Amara's health profile
export const amaraProfile = {
  name: 'Amara',
  age: 28,
  gender: 'Female',
  knownConditions: [] as string[],
  familyHistory: [
    { condition: 'Hypertension', relative: 'Father' },
    { condition: 'Diabetes', relative: 'Maternal Grandmother' },
  ],
  currentMedications: [] as string[],
  lastCheckup: '2024-12-21', // 14 months ago
  allergies: [] as string[],
  smokingStatus: 'Non-smoker',
  alcoholUse: 'Occasional',
  bloodType: 'A+',
  height: 165, // cm
  weight: 58, // kg
};

// Detailed AI Analysis for Day 15 (to show in detailed modal)
export const amaraDay15DetailedAnalysis = {
  patternDetectionSummary: {
    duration: '14 days',
    escalationNoted: 'Last 7 days',
    concerningMetrics: ['Energy', 'Sleep', 'Physical Symptoms', 'Appetite', 'Mood', 'Temperature'],
  },
  energyDecline: {
    days1to3: { average: 4, status: 'normal baseline' },
    days4to7: { average: 3, status: 'mild decline noted' },
    days8to14: { average: 2, status: 'significant sustained decline' },
    day15: { value: 2, status: 'continues concerning pattern' },
    assessment: 'Progressive energy decline over 2 weeks suggests underlying issue requiring evaluation.',
  },
  sleepDisruption: {
    days1to3: { range: '7-8 hours', quality: 'good to great', status: 'healthy range' },
    days4to7: { range: '6-7 hours', quality: 'okay', status: 'mild reduction' },
    days8to11: { range: '5-6 hours', quality: 'poor', status: 'poor quality noted' },
    days12to15: { range: '4-4.5 hours', quality: 'very poor', status: 'severely disrupted' },
    referencedEntries: ['Day 8', 'Day 10', 'Day 13', 'Day 15'],
    assessment: 'Sleep quality degradation correlates with symptom onset and intensification. Chronic poor sleep (8 days) can exacerbate other health issues.',
  },
  physicalSymptoms: {
    lowerAbdomen: {
      firstAppearance: { day: 10, intensity: 'mild', description: 'ache' },
      recurrences: [
        { day: 12, intensity: 'mild', note: 'returned after 1-day gap' },
        { day: 14, intensity: 'mild', note: '3rd occurrence' },
        { day: 15, intensity: 'moderate', note: 'ESCALATION - intensity increased' },
      ],
      pattern: 'Recurring localized discomfort in same area over 6 days',
      assessment: 'Recurring localized discomfort in the same area, now with increased intensity, requires medical evaluation. Pattern suggests persistent underlying issue.',
    },
  },
  appetiteAndNutrition: {
    days1to7: { status: 'good to great', meals: 'regular' },
    days8to11: { status: 'reduced appetite', meals: 'regular with some skipping' },
    days12to14: { status: 'low appetite', meals: 'occasional meal skipping noted (Day 12: lunch)' },
    day15: { status: 'very low appetite', meals: 'skipped both breakfast and lunch' },
    assessment: 'Nutritional intake significantly declining alongside other symptoms. Multiple meal skipping can worsen fatigue and mood.',
  },
  temperature: {
    days1to14: { status: 'No fever', value: 'normal range' },
    day15: { status: 'Slight fever', value: '37.8°C' },
    assessment: 'New symptom emergence (fever) alongside existing pattern is significant. Fever combined with localized pain and systemic symptoms (fatigue, appetite loss) may indicate infection or inflammatory process.',
  },
  moodAndMentalHealth: {
    days1to3: { status: 'Positive mood', social: 'active' },
    days4to7: { status: 'Neutral mood', social: 'moderate' },
    days8to14: { status: 'Consistently low mood', social: 'isolated' },
    day15: { status: 'Anxious', social: 'isolated' },
    assessment: 'Sustained low mood for 8 days transitioning to anxiety, alongside physical symptoms and social isolation. Mental health impacts physical health and vice versa.',
  },
  riskFactorsFromProfile: [
    {
      factor: 'Family history: Hypertension (father), Diabetes (maternal grandmother)',
      relevance: 'Increases baseline health monitoring importance',
    },
    {
      factor: 'Last checkup: 14 months ago',
      relevance: 'Overdue for routine screening, particularly given family history',
    },
    {
      factor: 'Age: 28',
      relevance: 'Reproductive health considerations for abdominal symptoms in women of childbearing age',
    },
  ],
  recommendation: {
    urgency: 'High - Schedule within 2-3 days',
    reasoning: "Based on the 14-day pattern analysis, we strongly recommend scheduling a checkup within the next 2-3 days. The combination of escalating physical symptoms (lower abdomen discomfort with increased intensity AND new fever), sustained energy/sleep disruption over 8 days, and appetite decline with meal skipping - particularly given your family history and overdue checkup status - warrants professional evaluation.",
    possibleAreas: [
      'Reproductive health (given age and localized lower abdomen symptoms)',
      'Gastrointestinal issues (given location of pain and appetite changes)',
      'Early infection or inflammatory process (given fever onset)',
      'Nutritional deficiencies (given sustained poor sleep, low energy, meal skipping)',
    ],
    suggestedSpecialties: ['General Practice', "Women's Health", 'Gastroenterology'],
  },
};

// Nudge tracking data
export interface NudgeRecord {
  id: string;
  date: string;
  analysisId: string; // Link to which analysis triggered the nudge
  userResponse: 'ignored' | 'booked' | 'went';
  doctorReportUploaded?: boolean;
  outcome?: 'true-positive' | 'false-positive' | 'pending';
}

export const amaraNudges: NudgeRecord[] = [
  {
    id: 'nudge-1',
    date: getDateDaysAgo(1), // Yesterday (Day 15)
    analysisId: 'day-15-analysis',
    userResponse: 'ignored', // This would be updated based on user action
  },
];

// Chat detection context example
export interface ChatDetection {
  timestamp: string;
  detectedSymptom: string;
  userContext: string;
  aiAssessment: string;
  followUpNeeded: boolean;
}

export const amaraChatDetections: ChatDetection[] = [
  {
    timestamp: '2026-02-21T14:32:00',
    detectedSymptom: 'Sneezed with blood',
    userContext: 'First occurrence, 2-day congestion',
    aiAssessment: 'Likely minor — dry air or upper respiratory infection',
    followUpNeeded: true,
  },
];
