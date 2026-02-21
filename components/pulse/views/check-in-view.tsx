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
  { id: 'energy', label: 'Energy', component: EnergyCard },
  { id: 'sleep', label: 'Sleep', component: SleepCard },
  { id: 'symptoms', label: 'Body', component: SymptomsCard },
  { id: 'respiratory', label: 'Respiratory', component: RespiratoryCard },
  { id: 'temperature', label: 'Temperature', component: TemperatureCard },
  { id: 'mood', label: 'Mood', component: MoodCard },
  { id: 'appetite', label: 'Appetite', component: AppetiteCard },
  { id: 'lifestyle', label: 'Lifestyle', component: LifestyleCard },
  { id: 'openFlag', label: 'Notes', component: OpenFlagCard },
];

export function CheckInView() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [checkInData, setCheckInData] = useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = useState(false);

  const current = CARDS[currentIndex];
  const isCompleted = checkInData[current.id] !== undefined;
  const progressPercent = (currentIndex / CARDS.length) * 100;

  const goNext = () => {
    if (currentIndex < CARDS.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    } else {
      setIsComplete(true);
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
    enter: (dir: number) => ({
      x: dir * 320,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir * -320,
      opacity: 0,
    }),
  };

  if (isComplete) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'linear-gradient(135deg, #84CC16, #F97316)' }}
        >
          <Check className="w-12 h-12 text-white" strokeWidth={3} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-foreground mb-3"
        >
          All done!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground text-lg"
        >
          Your check-in for today has been logged.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setCurrentIndex(0);
            setCheckInData({});
            setIsComplete(false);
          }}
          className="mt-8 px-8 py-3 rounded-2xl border-2 border-border text-foreground font-semibold hover:bg-muted transition-colors"
        >
          Start over
        </motion.button>
      </div>
    );
  }

  const CardComponent = current.component;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-card border-b border-border">
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
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #84CC16, #F97316)' }}
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
              ? 'text-white shadow-md'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          style={
            isCompleted
              ? { background: 'linear-gradient(135deg, #84CC16, #F97316)' }
              : {}
          }
        >
          {currentIndex === CARDS.length - 1 ? (
            <>
              <Check className="w-5 h-5" />
              Complete
            </>
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
