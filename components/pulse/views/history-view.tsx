'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Heart, Moon, Smile, Utensils } from 'lucide-react';
import { mockHealthData } from '@/lib/mock-data';

export function HistoryView() {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        weekday: 'short',
      });
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 py-6 max-w-2xl mx-auto"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6">
        Health History
      </motion.h2>

      <motion.div variants={containerVariants} className="space-y-3">
        {mockHealthData.map((entry) => {
          const isExpanded = expandedDate === entry.date;
          const avgScore = Math.round(
            (entry.energy + entry.sleep + entry.mood + entry.appetite) / 4
          );

          return (
            <motion.div
              key={entry.date}
              variants={itemVariants}
              className="overflow-hidden"
            >
              <motion.button
                onClick={() =>
                  setExpandedDate(isExpanded ? null : entry.date)
                }
                whileHover={{ scale: 1.02 }}
                className="w-full bg-card rounded-2xl p-4 shadow-md border border-border text-left hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-foreground mb-1">
                      {formatDate(entry.date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Health Score: {avgScore}/10
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full"
                  >
                    <ChevronDown className="w-5 h-5 text-primary" />
                  </motion.div>
                </div>
              </motion.button>

              {/* Expandable Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-card rounded-2xl p-4 shadow-md border border-border"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Heart className="w-3 h-3" /> Energy
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {entry.energy}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Moon className="w-3 h-3" /> Sleep
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {entry.sleep}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Smile className="w-3 h-3" /> Mood
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {entry.mood}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Utensils className="w-3 h-3" /> Appetite
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {entry.appetite}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Respiratory
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {entry.respiratory}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Temperature
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {entry.temperature}°F
                        </p>
                      </div>
                      {entry.symptoms.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">
                            Symptoms
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {entry.symptoms.map((symptom) => (
                              <span
                                key={symptom}
                                className="px-3 py-1 bg-destructive/10 text-destructive text-xs font-semibold rounded-full"
                              >
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Activity Level
                        </p>
                        <p className="text-lg font-semibold text-foreground capitalize">
                          {entry.lifestyle}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
