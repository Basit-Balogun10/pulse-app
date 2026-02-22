'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, MessageCircle, Zap, Sparkles, ChevronRight, Gift } from 'lucide-react';
import { userProfile, mockHealthData } from '@/lib/mock-data';
import { amaraFullStory } from '@/lib/amara-story-data';
import { DayCarousel } from '@/components/pulse/day-carousel';
import { AnalysisModal, generateInsight } from '@/components/pulse/analysis-modal';
import { DetailedAnalysisModal } from '@/components/pulse/detailed-analysis-modal';
import { DetailedMetricsModal } from '@/components/pulse/detailed-metrics-modal';
import { weatherSummary, getWeatherContext } from '@/lib/weather';
import { useNudgeTracking } from '@/hooks/use-nudge-tracking';
import { Badge } from '@/components/ui/badge';
import { amaraDay15DetailedAnalysis } from '@/lib/amara-story-data';
import { getTodayDate } from '@/lib/utils';

// Today is calculated dynamically
const TODAY = getTodayDate();

// Calculate streak bonus discount (1% per 3 days of streak, max 10%)
const calculateStreakBonus = (streak: number): number => {
  const bonus = Math.floor(streak / 3);
  return Math.min(bonus, 10);
};

// Get base tier discount
const getTierDiscount = (tier: string): number => {
  switch(tier.toLowerCase()) {
    case 'starter': return 10;
    case 'regular': return 20;
    case 'committed': return 30;
    case 'champion': return 40;
    default: return 10;
  }
};

const SUBHEADINGS = [
  'Consistency is your superpower.',
  'One check-in a day keeps the doctor informed.',
  'Small habits, big health outcomes.',
  'Keep the streak alive — you\'re doing great!',
  'Your quiet health companion, always here.',
];

interface HomeViewProps {
  onChatOpen?: () => void;
  onStartCheckIn?: () => void;
  todayEntry?: Record<string, any> | null;
}

export function HomeView({ onChatOpen, onStartCheckIn, todayEntry }: HomeViewProps) {
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [missedDays] = useState<string[]>([]);
  const [subheading, setSubheading] = useState(SUBHEADINGS[0]);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showDetailedModal, setShowDetailedModal] = useState(false);
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);
  const [streakExpanded, setStreakExpanded] = useState(false);
  
  const { nudgeCount, shouldAutoBook, shouldShowNudge } = useNudgeTracking();

  useEffect(() => {
    setSubheading(SUBHEADINGS[Math.floor(Math.random() * SUBHEADINGS.length)]);
    
    // Rotate subheadings every 4 seconds
    const interval = setInterval(() => {
      setSubheading(prev => {
        const currentIndex = SUBHEADINGS.indexOf(prev);
        const nextIndex = (currentIndex + 1) % SUBHEADINGS.length;
        return SUBHEADINGS[nextIndex];
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDaySelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleOpenAnalysis = () => {
    setShowAnalysisModal(true);
  };

  const isToday = selectedDate === TODAY;
  const hasTodayEntry = isToday && todayEntry != null;
  // Get pre-generated AI analysis overview from today's entry
  const analysisOverview = todayEntry?.aiAnalysis?.overview || todayEntry?.aiAnalysis || null;
  const selectedEntry = amaraFullStory.find((d) => d.date === selectedDate) ?? null;

  // Calculate total discount
  const baseDiscount = getTierDiscount(userProfile.tier);
  const streakBonus = calculateStreakBonus(userProfile.streak);
  const totalDiscount = baseDiscount + streakBonus;
  const nextMilestone = Math.ceil(userProfile.streak / 3) * 3;
  const daysToNextBonus = nextMilestone - userProfile.streak;

  const item = (i: number) => ({
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } },
  });

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background px-4 pt-6 pb-3 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            Hey {userProfile.name} 👋
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

          {/* Day carousel - negative margin to stretch edge-to-edge */}
          <motion.div variants={item(0)} initial="hidden" animate="visible" className="-mx-4">
            <DayCarousel onDaySelect={handleDaySelect} selectedDate={selectedDate} missedDays={missedDays} />
          </motion.div>

          {/* Streak card with collapsible discount details */}
          <motion.div
            variants={item(1)} initial="hidden" animate="visible"
            onClick={() => setStreakExpanded(!streakExpanded)}
            className="rounded-3xl p-5 shadow-lg border border-white/10 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, rgba(132, 204, 22, 0.85) 0%, rgba(249, 115, 22, 0.85) 100%)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-1">Current Streak</p>
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-7 h-7 text-white" fill="white" />
                  <span className="text-4xl font-bold text-white">{userProfile.streak}</span>
                  <span className="text-white/80 text-base">days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-white/90" />
                  <span className="text-white font-bold text-lg">{totalDiscount}% OFF</span>
                  <span className="text-white/70 text-sm">clinic visits</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-5xl">🔥</div>
                <motion.div
                  animate={{ rotate: streakExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="w-5 h-5 text-white/60 rotate-90" />
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={false}
              animate={{ height: streakExpanded ? 'auto' : 0, opacity: streakExpanded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mt-4">
                <p className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-3">Discount Breakdown</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">Base ({userProfile.tier})</span>
                    <span className="text-white font-bold text-sm">{baseDiscount}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">Streak Bonus</span>
                    <span className="text-white font-bold text-sm">+{streakBonus}%</span>
                  </div>
                </div>

                {streakBonus < 10 && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-white/70" />
                    <p className="text-white/70 text-xs">
                      {daysToNextBonus === 1 
                        ? '1 more day for +1% bonus!' 
                        : `${daysToNextBonus} days to +1% bonus`}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Today CTA - only shown when no entry yet */}
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
                className="w-full py-3.5 rounded-2xl bg-[#84CC16] text-white font-bold text-sm hover:bg-[#84CC16]/90 transition-colors flex items-center justify-center gap-2"
              >
                Start today&apos;s check-in <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Metrics card */}
          <motion.div
            key={selectedDate}
            variants={item(3)} initial="hidden" animate="visible"
            onClick={() => {
              if (hasTodayEntry || (selectedEntry && !isToday)) {
                setShowDetailedMetrics(true);
              }
            }}
            whileTap={(hasTodayEntry || (selectedEntry && !isToday)) ? { scale: 0.98 } : {}}
            className={`bg-card rounded-3xl p-5 border border-border ${
              (hasTodayEntry || (selectedEntry && !isToday)) 
                ? 'cursor-pointer hover:border-[#84CC16]/40 transition-colors' 
                : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {hasTodayEntry ? "Today's Check-in" : isToday ? "Today's Data" : selectedDate}
              </p>
              {(hasTodayEntry || (selectedEntry && !isToday)) && (
                <div className="flex items-center gap-1 text-xs font-semibold text-[#84CC16]">
                  See More
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {hasTodayEntry ? (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Energy', value: `${todayEntry!.energy}/5`, emoji: '⚡' },
                  { label: 'Sleep', value: todayEntry!.sleep?.quality ?? '—', emoji: '🌙' },
                  { label: 'Mood', value: `${todayEntry!.mood}/5`, emoji: '😊' },
                  { label: 'Appetite', value: todayEntry!.appetite?.appetite ?? '—', emoji: '🍽️' },
                ].map(({ label, value, emoji }) => (
                  <div key={label} className="bg-muted rounded-2xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">{emoji} {label}</p>
                    <p className="text-lg font-bold text-foreground capitalize">{value}</p>
                  </div>
                ))}
              </div>
            ) : selectedEntry && !isToday ? (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Energy', value: `${selectedEntry.energy}/5`, emoji: '⚡' },
                  { label: 'Sleep', value: `${selectedEntry.sleep.hours}h`, emoji: '🌙' },
                  { label: 'Mood', value: selectedEntry.mood, emoji: '😊' },
                  { label: 'Appetite', value: selectedEntry.appetite, emoji: '🍽️' },
                ].map(({ label, value, emoji }) => (
                  <div key={label} className="bg-muted rounded-2xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">{emoji} {label}</p>
                    <p className="text-lg font-bold text-foreground capitalize">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                {isToday ? "Complete today's check-in to see metrics" : "No data for this day."}
              </p>
            )}
          </motion.div>

          {/* AI Analysis Card - shown when check-in is complete (today or past day) */}
          {((isToday && hasTodayEntry) || (!isToday && selectedEntry)) && (
            <motion.div
              variants={item(4)} initial="hidden" animate="visible"
              onClick={() => setShowDetailedModal(true)}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-[#84CC16]/10 to-[#F59E0B]/10 rounded-3xl p-5 border border-[#84CC16]/20 cursor-pointer hover:border-[#84CC16]/40 transition-colors relative"
            >
              {isToday && shouldShowNudge && (
                <Badge className="absolute top-4 right-4 bg-[#F97316] text-white border-0 px-2 py-0.5 text-xs font-bold">
                  {nudgeCount} {nudgeCount === 1 ? 'Nudge' : 'Nudges'}
                </Badge>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#84CC16]/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#84CC16]" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">AI Analysis {isToday ? 'Available' : `from ${selectedDate}`}</p>
                  <p className="text-xs text-muted-foreground">
                    {isToday && shouldAutoBook 
                      ? 'Auto-booking recommended' 
                      : isToday && shouldShowNudge 
                        ? 'Checkup recommended' 
                        : 'Tap to view insights'
                    }
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {isToday && shouldAutoBook 
                  ? `You&apos;ve ignored ${nudgeCount} checkup recommendations. We recommend immediate booking with 100% discount.`
                  : (selectedEntry?.aiAnalysis?.summary || 'Your daily check-in has been analyzed. View personalized health insights and recommendations based on your entries.')
                }
              </p>
            </motion.div>
          )}

        </div>
      </div>

      {/* AI Analysis Modal */}
      <AnalysisModal
        isOpen={showAnalysisModal}
        overview={analysisOverview}
        onDismiss={() => setShowAnalysisModal(false)}
        onBookClinic={() => {
          setShowAnalysisModal(false);
          // TODO: Navigate to clinics tab with context
        }}
        onSeeDetailed={() => {
          setShowAnalysisModal(false);
          setShowDetailedModal(true);
        }}
      />
      
      {/* Detailed Analysis Modal */}
      <DetailedAnalysisModal
        isOpen={showDetailedModal}
        onClose={() => setShowDetailedModal(false)}
        analysis={amaraDay15DetailedAnalysis}
      />

      {/* Detailed Metrics Modal */}
      <DetailedMetricsModal
        isOpen={showDetailedMetrics}
        onClose={() => setShowDetailedMetrics(false)}
        entry={selectedEntry}
        fullHistory={amaraFullStory}
      />
    </div>
  );
}
