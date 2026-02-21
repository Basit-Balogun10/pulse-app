'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, MessageCircle, Zap } from 'lucide-react';
import { userProfile, mockHealthData } from '@/lib/mock-data';
import { DayCarousel } from '@/components/pulse/day-carousel';

const TODAY = '2025-02-23';

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

  useEffect(() => {
    setSubheading(SUBHEADINGS[Math.floor(Math.random() * SUBHEADINGS.length)]);
  }, []);

  const isToday = selectedDate === TODAY;
  const hasTodayEntry = isToday && todayEntry != null;
  const selectedEntry = mockHealthData.find((d) => d.date === selectedDate) ?? null;

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

          {/* Day carousel — negative margin to stretch edge-to-edge */}
          <motion.div variants={item(0)} initial="hidden" animate="visible" className="-mx-4">
            <DayCarousel onDaySelect={setSelectedDate} selectedDate={selectedDate} missedDays={missedDays} />
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
                  <span className="text-4xl font-bold text-white">{userProfile.streak}</span>
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
                Start today's check-in →
              </motion.button>
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
            ) : selectedEntry ? (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Energy', value: selectedEntry.energy, max: '/10', emoji: '⚡' },
                  { label: 'Sleep', value: selectedEntry.sleep, max: '/10', emoji: '🌙' },
                  { label: 'Mood', value: selectedEntry.mood, max: '/10', emoji: '😊' },
                  { label: 'Appetite', value: selectedEntry.appetite, max: '/5', emoji: '🍽️' },
                ].map(({ label, value, max, emoji }) => (
                  <div key={label} className="bg-muted rounded-2xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">{emoji} {label}</p>
                    <div className="flex items-end gap-0.5">
                      <span className="text-xl font-bold text-foreground">{value}</span>
                      <span className="text-muted-foreground text-xs mb-0.5">{max}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No data for this day.</p>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
