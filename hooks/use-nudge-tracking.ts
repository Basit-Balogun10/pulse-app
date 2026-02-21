import { useState, useEffect } from 'react';

interface NudgeData {
  count: number;
  lastNudgeDate: string | null;
  lastCheckupDate: string | null;
  dismissed: boolean;
}

const NUDGE_STORAGE_KEY = 'pulse_nudge_data';
const AUTO_BOOKING_THRESHOLD = 3;

/**
 * Custom hook for tracking checkup nudges
 * - Increments when AI raises concern and recommends checkup
 * - Resets when user books/completes checkup
 * - Triggers auto-booking after 3+ ignored nudges
 */
export function useNudgeTracking() {
  const [nudgeData, setNudgeData] = useState<NudgeData>(() => {
    if (typeof window === 'undefined') {
      return { count: 0, lastNudgeDate: null, lastCheckupDate: null, dismissed: false };
    }
    
    const stored = localStorage.getItem(NUDGE_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { count: 0, lastNudgeDate: null, lastCheckupDate: null, dismissed: false };
      }
    }
    return { count: 0, lastNudgeDate: null, lastCheckupDate: null, dismissed: false };
  });

  // Save to localStorage whenever nudgeData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(NUDGE_STORAGE_KEY, JSON.stringify(nudgeData));
    }
  }, [nudgeData]);

  /**
   * Increment nudge count when AI recommends checkup
   */
  const incrementNudge = (date: string) => {
    setNudgeData((prev) => ({
      ...prev,
      count: prev.count + 1,
      lastNudgeDate: date,
      dismissed: false,
    }));
  };

  /**
   * Reset nudge count when user books/completes checkup
   */
  const resetNudges = (checkupDate: string) => {
    setNudgeData({
      count: 0,
      lastNudgeDate: null,
      lastCheckupDate: checkupDate,
      dismissed: false,
    });
  };

  /**
   * Dismiss current nudge (user clicked "Remind Later")
   */
  const dismissNudge = () => {
    setNudgeData((prev) => ({
      ...prev,
      dismissed: true,
    }));
  };

  /**
   * Check if auto-booking should be triggered
   */
  const shouldAutoBook = nudgeData.count >= AUTO_BOOKING_THRESHOLD;

  /**
   * Check if nudge should be shown (has nudges and not dismissed)
   */
  const shouldShowNudge = nudgeData.count > 0 && !nudgeData.dismissed;

  return {
    nudgeCount: nudgeData.count,
    lastNudgeDate: nudgeData.lastNudgeDate,
    lastCheckupDate: nudgeData.lastCheckupDate,
    shouldAutoBook,
    shouldShowNudge,
    incrementNudge,
    resetNudges,
    dismissNudge,
  };
}
