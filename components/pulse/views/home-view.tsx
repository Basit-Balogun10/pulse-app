'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, MessageCircle } from 'lucide-react';
import { userProfile, mockHealthData } from '@/lib/mock-data';
import { DayCarousel } from '@/components/pulse/day-carousel';

const TODAY = '2025-02-23';

export function HomeView({ onChatOpen }: { onChatOpen?: () => void }) {
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [missedDays] = useState<string[]>([]);

  const selectedEntry = mockHealthData.find((d) => d.date === selectedDate) || mockHealthData[0];
  const isToday = selectedDate === TODAY;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 py-6 max-w-2xl mx-auto"
    >
      {/* Header with Chat Button */}
      <motion.div variants={itemVariants} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Hey {userProfile.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            You're on a {userProfile.streak}-day streak! Keep it going.
          </p>
        </div>
        {onChatOpen && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onChatOpen}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-muted/70 transition-colors border border-border"
          >
            <MessageCircle className="w-6 h-6 text-foreground" />
          </motion.button>
        )}
      </motion.div>

      {/* Day Carousel */}
      <motion.div variants={itemVariants} className="mb-6">
        <DayCarousel
          onDaySelect={setSelectedDate}
          selectedDate={selectedDate}
          missedDays={missedDays}
        />
      </motion.div>

      {/* Streak Card */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl p-6 mb-6 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #84CC16 0%, #F97316 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">Current Streak</p>
            <div className="flex items-center gap-2">
              <Flame className="w-8 h-8 text-white" fill="white" />
              <span className="text-4xl font-bold text-white">{userProfile.streak}</span>
              <span className="text-white/70 text-lg">days</span>
            </div>
          </div>
          <div className="text-6xl">🔥</div>
        </div>
      </motion.div>

      {/* Tier & Discount Card */}
      <motion.div
        variants={itemVariants}
        className="bg-card rounded-3xl p-6 mb-6 shadow-md border border-border"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Your Tier</p>
            <p className="text-2xl font-bold text-foreground mb-1">
              {userProfile.tier}
            </p>
            <p className="text-sm font-semibold" style={{ color: '#84CC16' }}>
              {userProfile.discount} off clinic visits
            </p>
          </div>
          <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <Star className="w-8 h-8 text-yellow-500" fill="currentColor" />
          </div>
        </div>
      </motion.div>

      {/* Selected Date Status */}
      <motion.div
        key={selectedDate}
        variants={itemVariants}
        className="bg-card rounded-3xl p-6 border border-border"
      >
        <p className="text-muted-foreground text-sm mb-3 font-medium">
          {isToday ? "Today's Status" : `Status — ${selectedDate}`}
        </p>
        {selectedEntry ? (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Energy', value: selectedEntry.energy, max: 10, emoji: '⚡' },
              { label: 'Sleep', value: selectedEntry.sleep, max: 10, emoji: '🌙' },
              { label: 'Mood', value: selectedEntry.mood, max: 10, emoji: '😊' },
              { label: 'Appetite', value: selectedEntry.appetite, max: 5, emoji: '🍽️' },
            ].map(({ label, value, max, emoji }) => (
              <div key={label} className="bg-muted rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-1">{emoji} {label}</p>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold text-foreground">{value}</span>
                  <span className="text-muted-foreground text-sm mb-0.5">/{max}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-4">
            No data for this day.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
