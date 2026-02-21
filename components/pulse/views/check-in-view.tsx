'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Moon,
  Activity,
  Wind,
  Thermometer,
  Smile,
  Utensils,
  ChevronRight,
  ArrowLeft,
  Check,
  Droplets,
  Dumbbell,
  Brain,
} from 'lucide-react';
import { CheckInCard } from '@/components/pulse/check-in-card';

interface CheckInData {
  energy: number;
  sleep: number;
  symptoms: string[];
  respiratory: number;
  temperature: number;
  mood: number;
  appetite: number;
  hydration: number;
  exercise: number;
  stress: number;
}

const checkInItems = [
  {
    id: 'energy',
    label: 'How\'s your energy?',
    icon: Zap,
    type: 'scale',
    min: 0,
    max: 10,
  },
  {
    id: 'sleep',
    label: 'How well did you sleep?',
    icon: Moon,
    type: 'scale-5',
    min: 1,
    max: 5,
  },
  {
    id: 'mood',
    label: 'How\'s your mood?',
    icon: Smile,
    type: 'scale',
    min: 0,
    max: 10,
  },
  {
    id: 'stress',
    label: 'What\'s your stress level?',
    icon: Brain,
    type: 'scale-5',
    min: 1,
    max: 5,
  },
  {
    id: 'appetite',
    label: 'How\'s your appetite?',
    icon: Utensils,
    type: 'scale-5',
    min: 1,
    max: 5,
  },
  {
    id: 'symptoms',
    label: 'Any physical symptoms?',
    icon: Activity,
    type: 'tags',
  },
  {
    id: 'respiratory',
    label: 'Respiratory comfort?',
    icon: Wind,
    type: 'scale-5',
    min: 1,
    max: 5,
  },
  {
    id: 'hydration',
    label: 'How hydrated are you?',
    icon: Droplets,
    type: 'scale-5',
    min: 1,
    max: 5,
  },
  {
    id: 'exercise',
    label: 'How active today?',
    icon: Dumbbell,
    type: 'scale-5',
    min: 1,
    max: 5,
  },
  {
    id: 'temperature',
    label: 'Your temperature?',
    icon: Thermometer,
    type: 'number',
  },
];

export function CheckInView() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [checkInData, setCheckInData] = useState<Partial<CheckInData>>({});

  const current = checkInItems[currentIndex];
  const isCompleted = completed.has(current.id);

  const handleNext = () => {
    if (currentIndex < checkInItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleComplete = () => {
    setCompleted(new Set(completed).add(current.id));
  };

  const handleValue = (value: any) => {
    setCheckInData({ ...checkInData, [current.id]: value });
    setCompleted(new Set(completed).add(current.id));
  };

  const progressPercent = (completed.size / checkInItems.length) * 100;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Header with Progress */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Daily Check-in</h2>
          <span className="text-sm text-muted-foreground">
            {completed.size} of {checkInItems.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-primary rounded-full"
          />
        </div>
      </div>

      {/* Swipeable Cards */}
      <div className="flex-1 flex items-center justify-center relative px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <CheckInCard
              item={current}
              onValue={handleValue}
              onNext={handleNext}
              onBack={handleBack}
              isCompleted={isCompleted}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 py-6 bg-white border-t border-border flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="flex-1 py-3 px-4 rounded-2xl border-2 border-border text-foreground font-semibold hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={!isCompleted}
          className="flex-1 py-3 px-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {currentIndex === checkInItems.length - 1 ? (
            <>
              <Check className="w-5 h-5" />
              Complete
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
