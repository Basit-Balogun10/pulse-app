// Auto-booking agent logic
// This module handles automatic clinic booking when user has been nudged multiple times

export interface AutoBooking {
  id: string;
  clinicId: string;
  clinicName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  canModify: boolean;
  nudgeCount: number; // How many times user was nudged before auto-booking
}

export interface NudgeRecord {
  date: string;
  reason: string;
  dismissed: boolean;
}

const NUDGE_THRESHOLD = 3; // Auto-book after 3 dismissed nudges
const DAYS_BETWEEN_NUDGES = 2;

/**
 * Check if user should be nudged based on health patterns
 */
export function shouldNudgeForCheckup(
  healthData: Record<string, any>[],
  lastNudgeDate?: string
): { shouldNudge: boolean; reason: string } {
  // Don't nudge if we recently did
  if (lastNudgeDate) {
    const daysSinceLastNudge = Math.floor(
      (Date.now() - new Date(lastNudgeDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLastNudge < DAYS_BETWEEN_NUDGES) {
      return { shouldNudge: false, reason: '' };
    }
  }

  // Check recent entries for concerning patterns
  const recentEntries = healthData.slice(-7); // Last 7 days
  
  // Pattern 1: Consistently low energy
  const lowEnergyDays = recentEntries.filter(e => e.energy && e.energy <= 2).length;
  if (lowEnergyDays >= 4) {
    return {
      shouldNudge: true,
      reason: 'Your energy levels have been consistently low this week. A checkup might help identify the cause.',
    };
  }

  // Pattern 2: Recurring symptoms in same location
  const symptomLocations = recentEntries
    .filter(e => e.symptoms && !e.symptoms.none)
    .map(e => e.symptoms?.location);
  const locationCounts: Record<string, number> = {};
  symptomLocations.forEach(loc => {
    if (loc) locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });
  const maxLocationCount = Math.max(...Object.values(locationCounts), 0);
  if (maxLocationCount >= 3) {
    return {
      shouldNudge: true,
      reason: "You've reported recurring symptoms in the same area. It would be wise to get this checked.",
    };
  }

  // Pattern 3: Fever days
  const feverDays = recentEntries.filter(
    e => e.temperature?.fever === 'yes' || (e.temperature?.temp && parseFloat(e.temperature.temp) > 99.5)
  ).length;
  if (feverDays >= 2) {
    return {
      shouldNudge: true,
      reason: "You've had fever symptoms recently. A medical consultation is recommended.",
    };
  }

  // Pattern 4: Poor sleep for extended period
  const poorSleepDays = recentEntries.filter(
    e => e.sleep?.quality === 'poor' || (e.sleep?.hours && parseInt(e.sleep.hours) < 5)
  ).length;
  if (poorSleepDays >= 5) {
    return {
      shouldNudge: true,
      reason: 'Persistent poor sleep quality detected. This might indicate an underlying issue worth discussing with a doctor.',
    };
  }

  return { shouldNudge: false, reason: '' };
}

/**
 * Auto-book a clinic appointment after threshold nudges
 */
export function createAutoBooking(
  nudgeHistory: NudgeRecord[],
  userTierDiscount: number,
  nearestClinic: { id: string; name: string }
): AutoBooking | null {
  // Only auto-book if user has 100% discount
  if (userTierDiscount < 100) {
    return null;
  }

  const dismissedNudges = nudgeHistory.filter(n => n.dismissed);
  
  // Check if we've reached the threshold
  if (dismissedNudges.length < NUDGE_THRESHOLD) {
    return null;
  }

  // Get the most recent dismissed nudge reason
  const lastReason = dismissedNudges[dismissedNudges.length - 1].reason;

  // Calculate booking date (3 days from now)
  const bookingDate = new Date();
  bookingDate.setDate(bookingDate.getDate() + 3);

  // Create auto-booking
  const booking: AutoBooking = {
    id: `auto-${Date.now()}`,
    clinicId: nearestClinic.id,
    clinicName: nearestClinic.name,
    date: bookingDate.toISOString().split('T')[0],
    time: '10:00',
    status: 'pending',
    createdAt: new Date().toISOString(),
    canModify: true,
    nudgeCount: dismissedNudges.length,
  };

  return booking;
}

/**
 * Get user's current discount tier
 */
export function getUserDiscountTier(streakDays: number): number {
  const weeks = streakDays / 7;
  
  if (weeks < 4) return 10;
  if (weeks < 12) return 20;
  if (weeks < 24) return 30;
  if (weeks >= 24) return 40;
  
  // Champion tier (6+ months) with special loyalty bonus
  if (weeks >= 52) return 100; // 1 year+ = 100%
  
  return 10;
}
