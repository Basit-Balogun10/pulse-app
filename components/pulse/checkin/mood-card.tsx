'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onValue: (v: number) => void;
  onNext: () => void;
  value?: number;
}

const OPTIONS = [
  { value: 1, emoji: '😞', label: 'Very Low' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
];

export function MoodCard({ onValue, value }: Props) {
  const [selected, setSelected] = useState<number | null>(value ?? null);

  const select = (v: number) => {
    setSelected(v);
    onValue(v);
  };

  const selectedOption = OPTIONS.find((o) => o.value === selected);

  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg p-6 select-none">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Mood</p>
      <h3 className="text-xl font-bold text-foreground mb-5">
        How's your mood and mental state today?
      </h3>

      {/* Horizontal 5-emoji scale */}
      <div className="flex gap-2 mb-4">
        {OPTIONS.map(({ value: v, emoji, label }) => {
          const isSelected = selected === v;
          return (
            <motion.button
              key={v}
              onClick={() => select(v)}
              whileTap={{ scale: 0.97 }}
              animate={isSelected ? { scale: 1.05 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`flex-1 flex flex-col items-center py-4 rounded-2xl border-2 transition-all ${
                isSelected
                  ? 'border-[#84CC16] bg-[#84CC16]/10'
                  : 'border-transparent bg-muted hover:bg-muted/70'
              }`}
            >
              <motion.span
                animate={isSelected ? { scale: 1.2 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-2xl mb-1"
              >
                {emoji}
              </motion.span>
              <span
                className={`text-xs font-semibold ${
                  isSelected ? 'text-[#84CC16]' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Confirmation text */}
      <AnimatePresence>
        {selectedOption && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm font-semibold"
            style={{ color: '#84CC16' }}
          >
            {selectedOption.label} — {selectedOption.value}/5
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
