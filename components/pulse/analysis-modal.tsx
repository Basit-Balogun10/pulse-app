'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity } from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  isLoading: boolean;
  result: string | null;
  onDismiss: () => void;
}

export function AnalysisModal({ isOpen, isLoading, result, onDismiss }: AnalysisModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl border-t border-border p-6 max-h-[75vh] overflow-y-auto"
          >
            {isLoading ? (
              <div className="flex flex-col items-center py-8 gap-5">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-14 h-14 rounded-full border-4 border-[#84CC16] border-t-transparent"
                />
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground mb-1">Analysing your check-in…</p>
                  <p className="text-sm text-muted-foreground">Reviewing your entries and patterns</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#84CC16]/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-[#84CC16]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Today's Insight</h3>
                      <p className="text-xs text-muted-foreground">Pulse AI · Just now</p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onDismiss}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </motion.button>
                </div>

                <div className="bg-muted rounded-2xl p-4 mb-5">
                  <p className="text-foreground text-sm leading-relaxed">{result}</p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onDismiss}
                  className="w-full py-3.5 rounded-2xl bg-[#84CC16] text-white font-semibold text-base hover:bg-[#84CC16]/90 transition-colors"
                >
                  Got it — back to home
                </motion.button>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function generateInsight(data: Record<string, any>, weather?: string | null): string {
  const parts: string[] = [];

  const energy = data.energy as number | undefined;
  const sleep = data.sleep as { hours: string; quality: string } | undefined;
  const mood = data.mood as number | undefined;
  const temp = data.temperature as { fever: string; temp?: string } | undefined;
  const respiratory = data.respiratory as string[] | undefined;
  const symptoms = data.symptoms as { none?: boolean; location?: string; type?: string; intensity?: string } | undefined;
  const lifestyle = data.lifestyle as { water: boolean; exercise: boolean } | undefined;

  // Energy
  if (energy !== undefined) {
    if (energy <= 2) parts.push("Your energy is quite low today — that's worth noting if it continues into the week.");
    else if (energy >= 4) parts.push("Energy is solid today. That tracks with good recovery patterns.");
  }

  // Sleep
  if (sleep?.quality === 'poor') parts.push("Last night's sleep was rough. One bad night is fine — but if it repeats, we'll flag it.");
  else if (sleep?.quality === 'good') parts.push(`You got ${sleep.hours}h of good sleep — that's a strong foundation for the day.`);

  // Mood
  if (mood !== undefined && mood <= 2) parts.push("Mood is low today. Keep logging; one low day is normal, but patterns matter.");

  // Symptoms
  if (symptoms && !symptoms.none && symptoms.location) {
    parts.push(`You noted ${symptoms.type?.toLowerCase() ?? 'discomfort'} in your ${symptoms.location.replace('_', ' ')} — logged as ${symptoms.intensity}. Worth tracking over the next few days.`);
  }

  // Respiratory
  if (respiratory && !respiratory.includes('none') && respiratory.length > 0) {
    parts.push(`Some respiratory symptoms flagged (${respiratory.join(', ')}). Keep an eye on these — especially if they persist.`);
  }

  // Fever
  if (temp?.fever === 'yes') parts.push("You're feeling feverish — rest and fluids are your best tools right now.");
  else if (temp?.fever === 'unsure') parts.push("Feeling a bit warm but unsure — worth monitoring through the day.");

  // Lifestyle
  if (lifestyle && !lifestyle.water && !lifestyle.exercise) {
    parts.push("Neither hydration nor exercise today — no shame, just try to get some water in.");
  } else if (lifestyle?.exercise) {
    parts.push("Physical activity logged — great for both physical and mental baseline.");
  }

  // Weather context
  if (weather) {
    parts.push(`Outside: ${weather}. Weather can affect energy and mood — good to keep that in mind.`);
  }

  // Positive fallback
  if (parts.length === 0) {
    parts.push("Everything looks well-balanced today — energy, sleep, mood, and lifestyle all tracking positively.");
    parts.push("Consistency is what makes Pulse useful. Keep logging daily and we'll start surfacing deeper patterns for you.");
  } else {
    parts.push("Keep logging — your daily entries are what make the AI picture accurate over time.");
  }

  return parts.join(' ');
}
