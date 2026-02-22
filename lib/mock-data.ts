export interface HealthEntry {
  date: string;
  energy: number;
  sleep: number;
  symptoms: string[];
  respiratory: number;
  temperature: number;
  mood: number;
  appetite: number;
  lifestyle: string;
}

// Amara's 14-day health journey from demo-script.md
// Pattern: Progressive decline leading to checkup recommendation
export const mockHealthData: HealthEntry[] = [
  // Day 15 (Today) - Critical: Fever appears, symptoms intensify
  {
    date: '2026-02-22',
    energy: 2,
    sleep: 4.5,
    symptoms: ['lower abdomen ache', 'moderate intensity'],
    respiratory: 95,
    temperature: 37.8, // Fever
    mood: 3, // Low/Anxious
    appetite: 2, // Very low
    lifestyle: 'isolated', // Skipped meals, no exercise
  },
  // Day 14 - Continuing decline
  {
    date: '2026-02-21',
    energy: 2,
    sleep: 5,
    symptoms: ['lower abdomen ache', 'mild'],
    respiratory: 95,
    temperature: 37.0,
    mood: 4,
    appetite: 3,
    lifestyle: 'rest',
  },
  // Day 13 - Poor sleep continues
  {
    date: '2026-02-20',
    energy: 2,
    sleep: 4.5,
    symptoms: [],
    respiratory: 95,
    temperature: 37.0,
    mood: 4,
    appetite: 4,
    lifestyle: 'rest',
  },
  // Day 12 - Abdomen pain recurs
  {
    date: '2026-02-19',
    energy: 2,
    sleep: 5,
    symptoms: ['lower abdomen ache', 'mild'],
    respiratory: 95,
    temperature: 37.0,
    mood: 4,
    appetite: 4,
    lifestyle: 'rest',
  },
  // Day 11 - Low energy persists
  {
    date: '2026-02-18',
    energy: 2,
    sleep: 5.5,
    symptoms: [],
    respiratory: 95,
    temperature: 37.0,
    mood: 5,
    appetite: 5,
    lifestyle: 'moderate',
  },
  // Day 10 - First abdomen pain appears
  {
    date: '2026-02-17',
    energy: 2,
    sleep: 6,
    symptoms: ['lower abdomen discomfort', 'mild'],
    respiratory: 95,
    temperature: 37.0,
    mood: 5,
    appetite: 5,
    lifestyle: 'moderate',
  },
  // Day 9 - Energy drops further
  {
    date: '2026-02-16',
    energy: 2,
    sleep: 6,
    symptoms: [],
    respiratory: 95,
    temperature: 37.0,
    mood: 5,
    appetite: 6,
    lifestyle: 'moderate',
  },
  // Day 8 - Sleep quality declining
  {
    date: '2026-02-15',
    energy: 2,
    sleep: 5,
    symptoms: [],
    respiratory: 95,
    temperature: 37.0,
    mood: 5,
    appetite: 6,
    lifestyle: 'moderate',
  },
  // Day 7 - Energy dipping
  {
    date: '2026-02-14',
    energy: 3,
    sleep: 6.5,
    symptoms: ['mild headache'],
    respiratory: 95,
    temperature: 37.0,
    mood: 6,
    appetite: 6,
    lifestyle: 'moderate',
  },
  // Day 6 - Slight headache
  {
    date: '2026-02-13',
    energy: 3,
    sleep: 7,
    symptoms: ['mild headache'],
    respiratory: 95,
    temperature: 37.0,
    mood: 6,
    appetite: 7,
    lifestyle: 'moderate',
  },
  // Day 5 - Energy starting to dip
  {
    date: '2026-02-12',
    energy: 3,
    sleep: 7,
    symptoms: [],
    respiratory: 95,
    temperature: 37.0,
    mood: 7,
    appetite: 7,
    lifestyle: 'moderate',
  },
  // Day 4 - First signs of change
  {
    date: '2026-02-11',
    energy: 3,
    sleep: 6.5,
    symptoms: [],
    respiratory: 95,
    temperature: 37.0,
    mood: 7,
    appetite: 7,
    lifestyle: 'moderate',
  },
  // Day 3 - Good baseline
  {
    date: '2026-02-10',
    energy: 4,
    sleep: 8,
    symptoms: [],
    respiratory: 95,
    temperature: 37.0,
    mood: 8,
    appetite: 8,
    lifestyle: 'active',
  },
  // Day 2 - Good baseline
  {
    date: '2026-02-09',
    energy: 4,
    sleep: 7.5,
    symptoms: [],
    respiratory: 95,
    temperature: 37.0,
    mood: 8,
    appetite: 8,
    lifestyle: 'active',
  },
  // Day 1 - Good baseline
  {
    date: '2026-02-08',
    energy: 4,
    sleep: 7,
    symptoms: [],
    respiratory: 95,
    temperature: 37.0,
    mood: 8,
    appetite: 8,
    lifestyle: 'active',
  },
];

export const userProfile = {
  name: 'Amara',
  age: 28,
  gender: 'Female',
  streak: 15,
  healthScore: 68, // Lower due to recent decline
  tier: 'Regular', // 2 weeks = 20% discount
  discount: '20%',
  joinDate: '2026-02-08', // Started 15 days ago
  knownConditions: 'None',
  familyHistory: 'Hypertension (father), Diabetes (maternal grandmother)',
  medications: 'None',
  lastCheckup: '2024-12-22', // 14 months ago
};

export const clinics = [
  {
    id: 1,
    name: 'Wellness Medical Center',
    specialty: 'Respiratory Health',
    rating: 4.8,
    distance: 2.3,
    discountCode: 'PULSE-AMR-2024',
    discount: '15%',
    address: '45 Herbert Macaulay Way, Yaba, Lagos',
    phone: '+234 803 456 7890',
    hours: 'Mon-Fri: 8am-6pm, Sat: 9am-2pm',
  },
  {
    id: 2,
    name: 'City Health Clinic',
    specialty: 'General Health',
    rating: 4.6,
    distance: 3.1,
    discountCode: 'PULSE-AMR-2024',
    discount: '15%',
    address: '12 Allen Avenue, Ikeja, Lagos',
    phone: '+234 809 123 4567',
    hours: 'Mon-Sat: 7am-8pm, Sun: 10am-4pm',
  },
];

export const checkInCategories = [
  { id: 'energy', label: 'Energy', icon: 'zap', scale: 'low-high' },
  { id: 'sleep', label: 'Sleep', icon: 'moon', scale: 'poor-great' },
  { id: 'symptoms', label: 'Symptoms', icon: 'activity', scale: 'none-severe' },
  { id: 'respiratory', label: 'Respiratory', icon: 'wind', scale: 'percent' },
  { id: 'temperature', label: 'Temperature', icon: 'thermometer', scale: 'celsius' },
  { id: 'mood', label: 'Mood', icon: 'smile', scale: 'sad-happy' },
  { id: 'appetite', label: 'Appetite', icon: 'utensils', scale: 'none-great' },
  { id: 'lifestyle', label: 'Lifestyle', icon: 'activity', scale: 'rest-active' },
];
