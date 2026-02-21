'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { EnergyCard } from '@/components/pulse/checkin/energy-card';
import { SleepCard } from '@/components/pulse/checkin/sleep-card';
import { SymptomsCard } from '@/components/pulse/checkin/symptoms-card';
import { RespiratoryCard } from '@/components/pulse/checkin/respiratory-card';
import { TemperatureCard } from '@/components/pulse/checkin/temperature-card';
import { MoodCard } from '@/components/pulse/checkin/mood-card';
import { AppetiteCard } from '@/components/pulse/checkin/appetite-card';
import { LifestyleCard } from '@/components/pulse/checkin/lifestyle-card';
import { OpenFlagCard } from '@/components/pulse/checkin/open-flag-card';

const CARDS = [
  { id: 'energy', component: EnergyCard },
  { id: 'sleep', component: SleepCard },
  { id: 'symptoms', component: SymptomsCard },
  { id: 'respiratory', component: RespiratoryCard },
  { id: 'temperature', component: TemperatureCard },
  { id: 'mood', component: MoodCard },
  { id: 'appetite', component: AppetiteCard },
  { id: 'lifestyle', component: LifestyleCard },
  { id: 'openFlag', component: OpenFlagCard },
];

interface CheckInViewProps {
  onComplete?: (data: Record<string, any>) => void;
}

export function CheckInView({ onComplete }: CheckInViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [checkInData, setCheckInData] = useState<Record<string, any>>({});

  const current = CARDS[currentIndex];
  const isCompleted = checkInData[current.id] !== undefined && checkInData[current.id] !== null;
  const progressPercent = (currentIndex / CARDS.length) * 100;

  const goNext = () => {
    if (currentIndex < CARDS.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete?.(checkInData);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleValue = (value: any) => {
    setCheckInData((prev) => ({ ...prev, [current.id]: value }));
  };

  const variants = {
    enter: (dir: number) => ({ x: dir * 320, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -320, opacity: 0 }),
  };

  const CardComponent = current.component;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 px-6 pt-6 pb-4 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-foreground">Daily Check-in</h2>
          <span className="text-sm text-muted-foreground font-medium">
            {currentIndex + 1} / {CARDS.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full bg-[#84CC16]"
          />
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 flex items-start justify-center relative px-4 pt-4 pb-2 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md"
          >
            <CardComponent
              onValue={handleValue}
              onNext={goNext}
              value={checkInData[current.id]}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 py-4 bg-card border-t border-border flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={goBack}
          disabled={currentIndex === 0}
          className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border-2 border-border text-foreground font-semibold hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        <motion.button
          whileTap={isCompleted ? { scale: 0.97 } : {}}
          onClick={isCompleted ? goNext : undefined}
          className={`flex-1 py-3 px-5 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
            isCompleted
              ? 'bg-[#84CC16] text-white hover:bg-[#84CC16]/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {currentIndex === CARDS.length - 1 ? (
            <><Check className="w-5 h-5" /> Complete</>
          ) : isCompleted ? (
            'Next →'
          ) : (
            'Select to continue'
          )}
        </motion.button>
      </div>
    </div>
  );
}
