'use client';

import { motion } from 'framer-motion';
import { Heart, Flame, Star, TrendingUp } from 'lucide-react';
import { userProfile, mockHealthData } from '@/lib/mock-data';

export function HomeView() {
  const latestEntry = mockHealthData[0];
  const avgScore = Math.round(
    (latestEntry.energy +
      latestEntry.sleep +
      latestEntry.mood +
      latestEntry.appetite) /
      4
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 py-6 max-w-2xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Hey {userProfile.name}
        </h1>
        <p className="text-muted-foreground">
          You're on a {userProfile.streak}-day streak! Keep it going.
        </p>
      </motion.div>

      {/* Streak Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-[#F97316] to-[#EC4899] rounded-3xl p-6 text-white mb-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm mb-1">Current Streak</p>
            <div className="flex items-center gap-2">
              <Flame className="w-8 h-8" fill="currentColor" />
              <span className="text-4xl font-bold">{userProfile.streak}</span>
              <span className="text-white/60 text-lg">days</span>
            </div>
          </div>
          <div className="text-6xl">🔥</div>
        </div>
      </motion.div>

      {/* Health Score Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-3xl p-6 mb-6 shadow-md border border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-muted-foreground text-sm mb-2">Health Score</p>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-foreground">
                {userProfile.healthScore}
              </span>
              <span className="text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
            <Heart className="w-10 h-10 text-primary" fill="#84CC16" />
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${userProfile.healthScore}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-primary"
          />
        </div>
      </motion.div>

      {/* Tier & Discount Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-3xl p-6 mb-6 shadow-md border border-border"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Your Tier</p>
            <p className="text-2xl font-bold text-foreground mb-1">
              {userProfile.tier}
            </p>
            <p className="text-sm text-primary font-semibold">
              {userProfile.discount} off clinic visits
            </p>
          </div>
          <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full">
            <Star className="w-8 h-8 text-yellow-500" fill="currentColor" />
          </div>
        </div>
      </motion.div>

      {/* Today's Status */}
      <motion.div
        variants={itemVariants}
        className="bg-[#84CC16]/10 rounded-3xl p-6 border border-primary/20"
      >
        <p className="text-muted-foreground text-sm mb-3">Today's Status</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Energy</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                {latestEntry.energy}
              </span>
              <span className="text-muted-foreground">/10</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Sleep</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                {latestEntry.sleep}
              </span>
              <span className="text-muted-foreground">/10</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Mood</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                {latestEntry.mood}
              </span>
              <span className="text-muted-foreground">/10</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Appetite</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                {latestEntry.appetite}
              </span>
              <span className="text-muted-foreground">/10</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
