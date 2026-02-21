'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onValue: (v: number) => void;
  onNext: () => void;
  value?: number;
}

const OPTIONS = [
  { value: 1, emoji: '😴', label: 'Drained' },
  { value: 2, emoji: '😔', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '🤩', label: 'Great' },
];

export function EnergyCard({ onValue, value }: Props) {
  const [selected, setSelected] = useState<number | null>(value ?? null);

  const select = (v: number) => {
    setSelected(v);
    onValue(v);
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg p-6 select-none">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Energy</p>
      <h3 className="text-xl font-bold text-foreground mb-5">
        How would you rate your energy level today?
      </h3>

      <div className="space-y-2.5">
        {OPTIONS.map(({ value: v, emoji, label }) => {
          const isSelected = selected === v;
          const barWidth = (v / 5) * 100;

          return (
            <motion.button
              key={v}
              onClick={() => select(v)}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${
                isSelected
                  ? 'border-[#84CC16] bg-[#84CC16]/10'
                  : 'border-transparent bg-muted hover:bg-muted/70'
              }`}
            >
              <span className="text-2xl w-8 text-center">{emoji}</span>
              <span
                className={`flex-1 text-left font-semibold text-sm ${
                  isSelected ? 'text-[#84CC16]' : 'text-foreground'
                }`}
              >
                {label}
              </span>
              {/* Inline progress bar */}
              <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: isSelected ? '#84CC16' : '#9ca3af',
                  }}
                />
              </div>
              <span
                className={`text-sm font-bold w-4 text-right ${
                  isSelected ? 'text-[#84CC16]' : 'text-muted-foreground'
                }`}
              >
                {v}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
