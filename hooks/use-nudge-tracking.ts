import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const AUTO_BOOKING_THRESHOLD = 3;

/**
 * Convex-backed hook for tracking checkup nudges.
 * Falls back to localStorage while Convex is loading.
 */
export function useNudgeTracking() {
  const nudgeRecord = useQuery(api.nudges.get);
  const incrementMutation = useMutation(api.nudges.increment);
  const resetMutation = useMutation(api.nudges.reset);
  const dismissMutation = useMutation(api.nudges.dismiss);

  const count = nudgeRecord?.count ?? 0;
  const dismissed = nudgeRecord?.dismissed ?? false;

  const shouldAutoBook = count >= AUTO_BOOKING_THRESHOLD;
  const shouldShowNudge = count > 0 && !dismissed;

  const incrementNudge = (date: string) => {
    incrementMutation({ date }).catch(console.error);
  };

  const resetNudges = (checkupDate: string) => {
    resetMutation({ checkupDate }).catch(console.error);
  };

  const dismissNudge = () => {
    dismissMutation({}).catch(console.error);
  };

  return {
    nudgeCount: count,
    lastNudgeDate: nudgeRecord?.lastNudgeDate ?? null,
    lastCheckupDate: nudgeRecord?.lastCheckupDate ?? null,
    shouldAutoBook,
    shouldShowNudge,
    incrementNudge,
    resetNudges,
    dismissNudge,
  };
}
