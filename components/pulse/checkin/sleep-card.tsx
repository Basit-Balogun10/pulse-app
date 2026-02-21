'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onValue: (v: any) => void;
  onNext: () => void;
  value?: any;
}

const HOURS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '9+'];
const QUALITY = [
  { value: 'poor', emoji: '😵', label: 'Poor', color: '#EF4444', bg: '#EF444415' },
  { value: 'okay', emoji: '😐', label: 'Okay', color: '#FBBF24', bg: '#FBBF2415' },
  { value: 'good', emoji: '😴', label: 'Good', color: '#84CC16', bg: '#84CC1615' },
];

export function SleepCard({ onValue, value }: Props) {
  const [hours, setHours] = useState<string | null>(value?.hours ?? null);
  const [quality, setQuality] = useState<string | null>(value?.quality ?? null);

  const update = (h: string | null, q: string | null) => {
    if (h !== null && q !== null) onValue({ hours: h, quality: q });
  };

  const selectHours = (h: string) => {
    setHours(h);
    update(h, quality);
  };

  const selectQuality = (q: string) => {
    setQuality(q);
    update(hours, q);
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg p-6 select-none">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Sleep</p>
      <h3 className="text-xl font-bold text-foreground mb-5">
        How much sleep did you get, and how was the quality?
      </h3>

      {/* Hours */}
      <p className="text-sm font-semibold text-foreground mb-2">Hours slept</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {HOURS.map((h) => (
          <motion.button
            key={h}
            onClick={() => selectHours(h)}
            whileTap={{ scale: 0.95 }}
            className={`px-3.5 py-2 rounded-xl font-semibold text-sm border-2 transition-all ${
              hours === h
                ? 'border-[#84CC16] bg-[#84CC16]/10 text-[#84CC16]'
                : 'border-border bg-muted text-foreground hover:bg-muted/70'
            }`}
          >
            {h}h
          </motion.button>
        ))}
      </div>

      {/* Quality */}
      <p className="text-sm font-semibold text-foreground mb-2">Sleep quality</p>
      <div className="flex gap-3">
        {QUALITY.map(({ value: v, emoji, label, color, bg }) => (
          <motion.button
            key={v}
            onClick={() => selectQuality(v)}
            whileTap={{ scale: 0.97 }}
            className="flex-1 flex flex-col items-center py-4 rounded-2xl border-2 transition-all"
            style={{
              borderColor: quality === v ? color : 'transparent',
              backgroundColor: quality === v ? bg : undefined,
            }}
          >
            <span className="text-2xl mb-1">{emoji}</span>
            <span
              className="text-sm font-semibold"
              style={{ color: quality === v ? color : undefined }}
            >
              {label}
            </span>
          </motion.button>
        ))}
      </div>

      {(!hours || !quality) && (
        <p className="text-center text-xs text-muted-foreground mt-4">
          Select both to continue
        </p>
      )}
    </div>
  );
}
