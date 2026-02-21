// Mock data for Pulse demo - Clinics, subscriptions, and other supporting data

export interface Clinic {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  specialties: string[];
  rating: number;
  reviewCount: number;
  distanceKm: number;
  checkupPricing: number; // Base price in Naira
  discountPercentage: number;
  operatingHours: {
    weekdays: string;
    saturday: string;
    sunday?: string;
  };
  contact: string;
  description?: string;
}

export const mockClinics: Clinic[] = [
  {
    id: 'clinic-1',
    name: 'City Wellness Clinic',
    address: '123 Allen Avenue, Ikeja, Lagos',
    coordinates: {
      lat: 6.6018,
      lng: 3.3515,
    },
    specialties: ['General Practice', "Women's Health", 'Pediatrics'],
    rating: 4.8,
    reviewCount: 124,
    distanceKm: 2.3,
    checkupPricing: 15000,
    discountPercentage: 20,
    operatingHours: {
      weekdays: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 2:00 PM',
    },
    contact: '+234 803 123 4567',
    description: 'Leading healthcare provider with focus on preventive medicine and women\'s health',
  },
  {
    id: 'clinic-2',
    name: 'MedPlus Health Centre',
    address: '45 Opebi Road, Ikeja, Lagos',
    coordinates: {
      lat: 6.5964,
      lng: 3.3542,
    },
    specialties: ['General Practice', 'Gastroenterology', 'Cardiology'],
    rating: 4.6,
    reviewCount: 89,
    distanceKm: 4.1,
    checkupPricing: 12000,
    discountPercentage: 20,
    operatingHours: {
      weekdays: '7:30 AM - 7:00 PM',
      saturday: '8:00 AM - 4:00 PM',
      sunday: '10:00 AM - 2:00 PM',
    },
    contact: '+234 802 234 5678',
    description: 'Comprehensive health services with specialized diagnostic equipment',
  },
  {
    id: 'clinic-3',
    name: 'HealthFirst Medical',
    address: '78 Adeola Odeku Street, Victoria Island, Lagos',
    coordinates: {
      lat: 6.4281,
      lng: 3.4219,
    },
    specialties: ["Women's Health", 'Gynecology', 'Prenatal Care'],
    rating: 4.7,
    reviewCount: 156,
    distanceKm: 4.8,
    checkupPricing: 18000,
    discountPercentage: 20,
    operatingHours: {
      weekdays: '8:00 AM - 5:00 PM',
      saturday: '9:00 AM - 1:00 PM',
    },
    contact: '+234 801 345 6789',
    description: 'Specialized women\'s healthcare with experienced gynecologists',
  },
  {
    id: 'clinic-4',
    name: 'Premier Care Hospital',
    address: '12 Admiralty Way, Lekki Phase 1, Lagos',
    coordinates: {
      lat: 6.4474,
      lng: 3.4706,
    },
    specialties: ['General Practice', 'Emergency Medicine', 'Cardiology', 'Gastroenterology'],
    rating: 4.9,
    reviewCount: 203,
    distanceKm: 8.2,
    checkupPricing: 20000,
    discountPercentage: 20,
    operatingHours: {
      weekdays: '24/7',
      saturday: '24/7',
      sunday: '24/7',
    },
    contact: '+234 805 456 7890',
    description: 'Full-service hospital with 24/7 emergency care and advanced diagnostics',
  },
  {
    id: 'clinic-5',
    name: 'Family Health Medical Center',
    address: '34 Toyin Street, Ikeja, Lagos',
    coordinates: {
      lat: 6.6006,
      lng: 3.3508,
    },
    specialties: ['General Practice', 'Pediatrics', 'Family Medicine'],
    rating: 4.5,
    reviewCount: 67,
    distanceKm: 2.8,
    checkupPricing: 10000,
    discountPercentage: 20,
    operatingHours: {
      weekdays: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 3:00 PM',
    },
    contact: '+234 806 567 8901',
    description: 'Affordable family-focused healthcare for all ages',
  },
  {
    id: 'clinic-6',
    name: 'Digestive Health Clinic',
    address: '56 Awolowo Road, Ikoyi, Lagos',
    coordinates: {
      lat: 6.4549,
      lng: 3.4316,
    },
    specialties: ['Gastroenterology', 'Hepatology', 'General Practice'],
    rating: 4.8,
    reviewCount: 92,
    distanceKm: 6.5,
    checkupPricing: 16000,
    discountPercentage: 20,
    operatingHours: {
      weekdays: '9:00 AM - 5:00 PM',
      saturday: '10:00 AM - 2:00 PM',
    },
    contact: '+234 807 678 9012',
    description: 'Specialized gastrointestinal and liver care',
  },
  {
    id: 'clinic-7',
    name: 'Victoria Medical Centre',
    address: '89 Ajose Adeogun Street, Victoria Island, Lagos',
    coordinates: {
      lat: 6.4291,
      lng: 3.4231,
    },
    specialties: ['General Practice', "Women's Health", 'Dermatology'],
    rating: 4.6,
    reviewCount: 78,
    distanceKm: 5.1,
    checkupPricing: 14000,
    discountPercentage: 20,
    operatingHours: {
      weekdays: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 2:00 PM',
    },
    contact: '+234 808 789 0123',
    description: 'Modern healthcare facility with focus on preventive care',
  },
  {
    id: 'clinic-8',
    name: 'Lifecare Clinic',
    address: '23 Fola Osibo Street, Lekki Phase 1, Lagos',
    coordinates: {
      lat: 6.4451,
      lng: 3.4682,
    },
    specialties: ['General Practice', 'Urgent Care'],
    rating: 4.4,
    reviewCount: 45,
    distanceKm: 7.9,
    checkupPricing: 11000,
    discountPercentage: 20,
    operatingHours: {
      weekdays: '7:00 AM - 9:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: '10:00 AM - 4:00 PM',
    },
    contact: '+234 809 890 1234',
    description: 'Extended hours for urgent care and routine checkups',
  },
  {
    id: 'clinic-9',
    name: 'Heart & Health Clinic',
    address: '67 Ogudu Road, Ojota, Lagos',
    coordinates: {
      lat: 6.5833,
      lng: 3.3778,
    },
    specialties: ['Cardiology', 'General Practice', 'Hypertension Management'],
    rating: 4.7,
    reviewCount: 112,
    distanceKm: 3.6,
    checkupPricing: 17000,
    discountPercentage: 20,
    operatingHours: {
      weekdays: '8:00 AM - 5:00 PM',
      saturday: '9:00 AM - 1:00 PM',
    },
    contact: '+234 810 901 2345',
    description: 'Cardiovascular specialists with preventive care programs',
  },
  {
    id: 'clinic-10',
    name: 'Women & Children Hospital',
    address: '101 Herbert Macaulay Way, Yaba, Lagos',
    coordinates: {
      lat: 6.5158,
      lng: 3.3781,
    },
    specialties: ["Women's Health", 'Pediatrics', 'Obstetrics', 'Gynecology'],
    rating: 4.9,
    reviewCount: 187,
    distanceKm: 5.8,
    checkupPricing: 19000,
    discountPercentage: 20,
    operatingHours: {
      weekdays: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 3:00 PM',
    },
    contact: '+234 811 012 3456',
    description: 'Dedicated women\'s and children\'s healthcare with maternity services',
  },
  {
    id: 'clinic-11',
    name: 'Mainland Medical Hub',
    address: '145 Agege Motor Road, Mushin, Lagos',
    coordinates: {
      lat: 6.5293,
      lng: 3.3398,
    },
    specialties: ['General Practice', 'Family Medicine'],
    rating: 4.3,
    reviewCount: 54,
    distanceKm: 6.2,
    checkupPricing: 9000,
    discountPercentage: 20,
    operatingHours: {
      weekdays: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 2:00 PM',
    },
    contact: '+234 812 123 4567',
    description: 'Affordable community healthcare with experienced general practitioners',
  },
  {
    id: 'clinic-12',
    name: 'Executive Health Clinic',
    address: '28 Kingsway Road, Ikoyi, Lagos',
    coordinates: {
      lat: 6.4568,
      lng: 3.4329,
    },
    specialties: ['General Practice', 'Executive Health Screenings', 'Preventive Medicine'],
    rating: 4.8,
    reviewCount: 96,
    distanceKm: 6.8,
    checkupPricing: 25000,
    discountPercentage: 20,
    operatingHours: {
      weekdays: '7:00 AM - 7:00 PM',
      saturday: '8:00 AM - 4:00 PM',
    },
    contact: '+234 813 234 5678',
    description: 'Premium healthcare with comprehensive executive health assessments',
  },
];

// Subscription tiers
export interface SubscriptionTier {
  name: string;
  price: number; // Monthly price in Naira
  discountPercentage: number;
  streakRequired: number;
  features: string[];
}

export const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Basic',
    price: 1500,
    discountPercentage: 10,
    streakRequired: 7,
    features: [
      'Daily check-ins',
      'Basic AI analysis',
      '10% clinic discount',
      'Health history tracking',
    ],
  },
  {
    name: 'Regular',
    price: 2500,
    discountPercentage: 20,
    streakRequired: 14,
    features: [
      'All Basic features',
      'Detailed AI analysis',
      '20% clinic discount',
      'Chat with AI assistant',
      'Priority clinic booking',
    ],
  },
  {
    name: 'Silver',
    price: 2500,
    discountPercentage: 40,
    streakRequired: 30,
    features: [
      'All Regular features',
      '40% clinic discount',
      'Advanced pattern detection',
      'Monthly health reports',
    ],
  },
  {
    name: 'Gold',
    price: 2500,
    discountPercentage: 60,
    streakRequired: 60,
    features: [
      'All Silver features',
      '60% clinic discount',
      'Dedicated health advisor',
      'Free bi-annual checkups',
    ],
  },
  {
    name: 'Platinum',
    price: 2500,
    discountPercentage: 80,
    streakRequired: 90,
    features: [
      'All Gold features',
      '80% clinic discount',
      'Auto-booking eligibility',
      'Free quarterly checkups',
      'Priority support',
    ],
  },
];

// Auto-booking eligibility
export interface AutoBookingEligibility {
  isEligible: boolean;
  nudgeCount: number;
  nudgeThreshold: number;
  streakDays: number;
  streakRequired: number;
  discountAvailable: number; // Percentage
}

export const amaraAutoBookingStatus: AutoBookingEligibility = {
  isEligible: true,
  nudgeCount: 3,
  nudgeThreshold: 3,
  streakDays: 15,
  streakRequired: 14,
  discountAvailable: 100, // 100% after 3+ nudges
};

// Discount tier calculation
export function calculateDiscountTier(streakDays: number): SubscriptionTier {
  if (streakDays >= 90) return subscriptionTiers[4]; // Platinum
  if (streakDays >= 60) return subscriptionTiers[3]; // Gold
  if (streakDays >= 30) return subscriptionTiers[2]; // Silver
  if (streakDays >= 14) return subscriptionTiers[1]; // Regular
  if (streakDays >= 7) return subscriptionTiers[0]; // Basic
  return {
    name: 'No tier',
    price: 2500,
    discountPercentage: 0,
    streakRequired: 0,
    features: ['Build a 7-day streak to unlock discounts'],
  };
}

// Current subscription data for Amara
export const amaraSubscription = {
  plan: 'Premium Monthly',
  price: 2500,
  status: 'Active',
  nextBillingDate: '2026-03-21',
  currentTier: calculateDiscountTier(15), // Regular tier (20% off)
  nextTier: calculateDiscountTier(30), // Silver tier (40% off)
  streakDays: 15,
};

// Appointment booking data
export interface Appointment {
  id: string;
  clinicId: string;
  clinicName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  redemptionCode: string;
  discountApplied: number; // Percentage
  originalPrice: number;
  finalPrice: number;
  reasonForVisit: string;
  autoBooked?: boolean;
}

export const amaraAppointments: Appointment[] = [
  {
    id: 'appt-1',
    clinicId: 'clinic-1',
    clinicName: 'City Wellness Clinic',
    date: '2026-02-24',
    time: '10:00 AM',
    status: 'pending',
    redemptionCode: 'PULSE-AMR-2024',
    discountApplied: 100, // Auto-booking gives 100% discount
    originalPrice: 15000,
    finalPrice: 0,
    reasonForVisit: 'General checkup (flagged by AI health analysis)',
    autoBooked: true,
  },
];

// Payment methods (mock)
export const paymentMethods = [
  { id: 'card', label: 'Debit/Credit Card', icon: 'credit-card' },
  { id: 'transfer', label: 'Bank Transfer', icon: 'building' },
  { id: 'pay-at-clinic', label: 'Pay at Clinic', icon: 'map-pin' },
];
