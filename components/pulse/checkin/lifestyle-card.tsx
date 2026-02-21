'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onValue: (v: any) => void;
  onNext: () => void;
  value?: any;
}

export function LifestyleCard({ onValue, value }: Props) {
  const [water, setWater] = useState<boolean | null>(value?.water ?? null);
  const [exercise, setExercise] = useState<boolean | null>(value?.exercise ?? null);

  const update = (w: boolean | null, e: boolean | null) => {
    if (w !== null && e !== null) onValue({ water: w, exercise: e });
  };

  const selWater = (v: boolean) => { setWater(v); update(v, exercise); };
  const selExercise = (v: boolean) => { setExercise(v); update(water, v); };

  const Row = ({
    emoji,
    question,
    state,
    onYes,
    onNo,
    yesLabel,
    noLabel,
  }: {
    emoji: string;
    question: string;
    state: boolean | null;
    onYes: () => void;
    onNo: () => void;
    yesLabel: string;
    noLabel: string;
  }) => (
    <div className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-3.5">
      <span className="text-2xl">{emoji}</span>
      <span className="flex-1 text-sm font-semibold text-foreground">{question}</span>
      <div className="flex gap-1.5">
        <motion.button
          onClick={onYes}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            state === true ? 'bg-[#84CC16] text-white' : 'bg-card text-foreground border border-border'
          }`}
        >
          {yesLabel}
        </motion.button>
        <motion.button
          onClick={onNo}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            state === false ? 'bg-[#EF4444] text-white' : 'bg-card text-foreground border border-border'
          }`}
        >
          {noLabel}
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg p-6 select-none">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Lifestyle</p>
      <h3 className="text-xl font-bold text-foreground mb-5">
        Quick lifestyle snapshot for today.
      </h3>

      <div className="space-y-3">
        <Row
          emoji="💧"
          question="Enough water today?"
          state={water}
          onYes={() => selWater(true)}
          onNo={() => selWater(false)}
          yesLabel="Hydrated"
          noLabel="Not really"
        />
        <Row
          emoji="🏃"
          question="Any physical activity?"
          state={exercise}
          onYes={() => selExercise(true)}
          onNo={() => selExercise(false)}
          yesLabel="Yes"
          noLabel="Not today"
        />
      </div>

      {/* Medications static tile */}
      <div className="mt-3 flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#818CF8]/10">
        <span className="text-xl">💊</span>
        <p className="text-sm text-[#818CF8] font-medium">No medications listed in your profile.</p>
      </div>
    </div>
  );
}
