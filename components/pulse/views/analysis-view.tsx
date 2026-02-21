'use client';

import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Star } from 'lucide-react';

export function AnalysisView() {
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
      <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6">
        AI Analysis
      </motion.h2>

      {/* Pattern Alert */}
      <motion.div
        variants={itemVariants}
        className="bg-[#F97316]/10 border-2 border-[#F97316] rounded-3xl p-6 mb-6"
      >
        <div className="flex gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-[#F97316] flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-foreground mb-1">Pattern Detected</p>
            <p className="text-sm text-foreground/80">
              We've noticed your respiratory comfort dips on days with high activity. 
              Consider pacing your workouts.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-4 border-t border-[#F97316]/20">
          <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
          <p className="text-xs font-semibold text-foreground">Gold Member</p>
          <p className="text-xs text-foreground/60">Full analysis available</p>
        </div>
      </motion.div>

      {/* Insights Cards */}
      <motion.div variants={containerVariants} className="space-y-4">
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-6 shadow-md border border-border"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground mb-2">Energy Trend</p>
              <p className="text-sm text-muted-foreground">
                Your energy levels are generally stable. Keep maintaining this 
                consistent sleep schedule.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-6 shadow-md border border-border"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#14B8A6]/10 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-[#14B8A6]" />
            </div>
            <div>
              <p className="font-bold text-foreground mb-2">Respiratory Monitor</p>
              <p className="text-sm text-muted-foreground">
                Your respiratory comfort has improved 8% this week. 
                Continue with your current routine.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-6 shadow-md border border-border"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#A855F7]/10 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#A855F7]" />
            </div>
            <div>
              <p className="font-bold text-foreground mb-2">Mood Observation</p>
              <p className="text-sm text-muted-foreground">
                Your mood correlates well with sleep quality. 
                Prioritize 7-8 hours nightly.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-8 p-6 bg-[#84CC16]/10 border-2 border-primary rounded-3xl"
      >
        <p className="font-bold text-foreground mb-2">Next Clinic Check-up Recommended</p>
        <p className="text-sm text-foreground/80">
          Based on your patterns, a respiratory evaluation would be beneficial. 
          Visit our clinic partners for a discounted session.
        </p>
      </motion.div>
    </motion.div>
  );
}
