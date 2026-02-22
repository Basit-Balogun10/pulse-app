'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, MessageCircle, Zap, Sparkles } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DayCarousel } from '@/components/pulse/day-carousel';
import { AnalysisModal } from '@/components/pulse/analysis-modal';
import { DetailedAnalysisModal } from '@/components/pulse/detailed-analysis-modal';
import { useNudgeTracking } from '@/hooks/use-nudge-tracking';
import { Badge } from '@/components/ui/badge';

const TODAY = new Date().toISOString().split('T')[0]; // real YYYY-MM-DD

const SUBHEADINGS = [
  'Consistency is your superpower.',
  'One check-in a day keeps the doctor informed.',
  'Small habits, big health outcomes.',
  "Keep the streak alive — you're doing great!",
  'Your quiet health companion, always here.',
];

interface HomeViewProps {
  onChatOpen?: () => void;
  onStartCheckIn?: () => void;
  todayEntry?: Record<string, any> | null;
}

export function HomeView({ onChatOpen, onStartCheckIn, todayEntry }: HomeViewProps) {
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [subheading, setSubheading] = useState(SUBHEADINGS[0]);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showDetailedModal, setShowDetailedModal] = useState(false);

  const { nudgeCount, shouldAutoBook, shouldShowNudge } = useNudgeTracking();

  // Convex queries — reactive, auto-update when DB changes
  const history = useQuery(api.healthEntries.getHistory, { limit: 14 }) ?? [];
  const convexStreak = useQuery(api.users.getStreak) ?? 0;
  const profile = useQuery(api.users.getProfile);

  useEffect(() => {
    setSubheading(SUBHEADINGS[Math.floor(Math.random() * SUBHEADINGS.length)]);
  }, []);

  const isToday = selectedDate === TODAY;
  const hasTodayEntry = isToday && todayEntry != null;

  // AI analysis overview from today's entry (reactive — updates when Gemini writes back)
  const analysisOverview = todayEntry?.aiAnalysis?.overview ?? null;

  // Dates with completed check-ins for carousel
  const checkedInDates = (history as any[]).map((e) => e.date as string);

  // Entry for a selected past day (from history)
  const selectedEntry = !isToday
    ? ((history as any[]).find((e) => e.date === selectedDate) ?? null)
    : null;

  // Display name — prefer Convex profile, fall back to generic
  const displayName = profile?.name || 'there';

  const item = (i: number) => ({
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } },
  });

  // Unified entry to display in metrics card
  const displayEntry = hasTodayEntry ? todayEntry : selectedEntry;

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background px-4 pt-6 pb-3 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            Hey {displayName} 👋
          </h1>
          <motion.p
            key={subheading}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm text-muted-foreground mt-0.5"
          >
            {subheading}
          </motion.p>
        </div>
        {onChatOpen && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onChatOpen}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-muted border border-border hover:bg-muted/70 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-foreground" />
          </motion.button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">

          {/* Day carousel */}
          <motion.div variants={item(0)} initial="hidden" animate="visible" className="-mx-4">
            <DayCarousel
              onDaySelect={setSelectedDate}
              selectedDate={selectedDate}
              checkedInDates={checkedInDates}
            />
          </motion.div>

          {/* Streak card */}
          <motion.div
            variants={item(1)} initial="hidden" animate="visible"
            className="rounded-3xl p-5 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #84CC16 0%, #F97316 100%)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Current Streak</p>
                <div className="flex items-center gap-2">
                  <Flame className="w-7 h-7 text-white" fill="white" />
                  <span className="text-4xl font-bold text-white">{convexStreak}</span>
                  <span className="text-white/70 text-base">days</span>
                </div>
              </div>
              <div className="text-5xl">🔥</div>
            </div>
          </motion.div>

          {/* Today CTA — only shown when no entry yet */}
          {isToday && !hasTodayEntry && (
            <motion.div
              variants={item(2)} initial="hidden" animate="visible"
              className="bg-card rounded-3xl p-5 border-2 border-dashed border-[#84CC16]/40"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#84CC16]/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#84CC16]" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">No check-in yet today</p>
                  <p className="text-xs text-muted-foreground">Takes less than 60 seconds</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onStartCheckIn}
                className="w-full py-3.5 rounded-2xl bg-[#84CC16] text-white font-bold text-sm hover:bg-[#84CC16]/90 transition-colors"
              >
                Start today&apos;s check-in →
              </motion.button>
            </motion.div>
          )}

          {/* AI Analysis Card — only when today's check-in is complete */}
          {isToday && hasTodayEntry && (
            <motion.div
              variants={item(2)} initial="hidden" animate="visible"
              onClick={() => setShowAnalysisModal(true)}
              whileTap={{ scale: 0.98 }}
              className="bg-linear-to-br from-[#818CF8]/10 to-[#A855F7]/10 rounded-3xl p-5 border border-[#818CF8]/20 cursor-pointer hover:border-[#818CF8]/40 transition-colors relative"
            >
              {shouldShowNudge && (
                <Badge className="absolute top-4 right-4 bg-[#F97316] text-white border-0 px-2 py-0.5 text-xs font-bold">
                  {nudgeCount} {nudgeCount === 1 ? 'Nudge' : 'Nudges'}
                </Badge>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#818CF8]/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#818CF8]" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">AI Analysis Available</p>
                  <p className="text-xs text-muted-foreground">
                    {shouldAutoBook
                      ? 'Auto-booking recommended'
                      : shouldShowNudge
                        ? 'Checkup recommended'
                        : analysisOverview
                          ? 'Tap to view insights'
                          : 'Analysing your check-in…'
                    }
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {shouldAutoBook
                  ? `You&apos;ve ignored ${nudgeCount} checkup recommendations. We recommend immediate booking with 100% discount.`
                  : analysisOverview
                    ? analysisOverview.slice(0, 120) + (analysisOverview.length > 120 ? '…' : '')
                    : 'Your daily check-in has been analyzed. View personalized health insights and recommendations based on your entries.'
                }
              </p>
            </motion.div>
          )}

          {/* Metrics card */}
          <motion.div
            key={selectedDate}
            variants={item(3)} initial="hidden" animate="visible"
            className="bg-card rounded-3xl p-5 border border-border"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {hasTodayEntry ? "Today's Check-in" : isToday ? "Today's Data" : selectedDate}
            </p>

            {displayEntry ? (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Energy', value: `${displayEntry.energy ?? '—'}/5`, emoji: '⚡' },
                  { label: 'Sleep', value: displayEntry.sleep?.quality ?? '—', emoji: '🌙' },
                  { label: 'Mood', value: `${displayEntry.mood ?? '—'}/5`, emoji: '😊' },
                  { label: 'Appetite', value: displayEntry.appetite?.appetite ?? '—', emoji: '🍽️' },
                ].map(({ label, value, emoji }) => (
                  <div key={label} className="bg-muted rounded-2xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">{emoji} {label}</p>
                    <p className="text-lg font-bold text-foreground capitalize">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No data for this day.</p>
            )}
          </motion.div>

        </div>
      </div>

      {/* AI Analysis Modal */}
      <AnalysisModal
        isOpen={showAnalysisModal}
        overview={analysisOverview}
        onDismiss={() => setShowAnalysisModal(false)}
        onBookClinic={() => setShowAnalysisModal(false)}
        onSeeDetailed={() => {
          setShowAnalysisModal(false);
          setShowDetailedModal(true);
        }}
      />

      {/* Detailed Analysis Modal */}
      <DetailedAnalysisModal
        isOpen={showDetailedModal}
        onClose={() => setShowDetailedModal(false)}
      />
    </div>
  );
}
