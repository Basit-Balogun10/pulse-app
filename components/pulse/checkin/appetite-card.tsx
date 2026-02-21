'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onValue: (v: any) => void;
  onNext: () => void;
  value?: any;
}

const APPETITE_OPTS = [
  { value: 'normal', emoji: '🍽️', label: 'Normal' },
  { value: 'low', emoji: '😔', label: 'Low' },
  { value: 'high', emoji: '🤤', label: 'Unusually High' },
];

const DIGESTION_OPTS = [
  { value: 'normal', emoji: '✅', label: 'Normal' },
  { value: 'nausea', emoji: '🤢', label: 'Nausea' },
  { value: 'bloating', emoji: '😣', label: 'Bloating' },
  { value: 'discomfort', emoji: '😟', label: 'Discomfort' },
];

export function AppetiteCard({ onValue, value }: Props) {
  const [appetite, setAppetite] = useState<string | null>(value?.appetite ?? null);
  const [digestion, setDigestion] = useState<string | null>(value?.digestion ?? null);
  const [bowel, setBowel] = useState<boolean | null>(value?.bowel ?? null);

  const update = (a: string | null, d: string | null, b: boolean | null) => {
    if (a !== null && d !== null && b !== null) onValue({ appetite: a, digestion: d, bowel: b });
  };

  const selAppetite = (v: string) => { setAppetite(v); update(v, digestion, bowel); };
  const selDigestion = (v: string) => { setDigestion(v); update(appetite, v, bowel); };
  const selBowel = (v: boolean) => { setBowel(v); update(appetite, digestion, v); };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg p-6 select-none">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Appetite</p>
      <h3 className="text-xl font-bold text-foreground mb-4">
        How's your appetite and digestion today?
      </h3>

      {/* Section 1 — Appetite */}
      <p className="text-sm font-semibold text-foreground mb-2">Appetite</p>
      <div className="flex gap-2 mb-4">
        {APPETITE_OPTS.map(({ value: v, emoji, label }) => (
          <motion.button
            key={v}
            onClick={() => selAppetite(v)}
            whileTap={{ scale: 0.97 }}
            className={`flex-1 flex flex-col items-center py-3 rounded-2xl border-2 transition-all ${
              appetite === v
                ? 'border-[#84CC16] bg-[#84CC16]/10'
                : 'border-transparent bg-muted hover:bg-muted/70'
            }`}
          >
            <span className="text-xl mb-1">{emoji}</span>
            <span className={`text-xs font-semibold ${appetite === v ? 'text-[#84CC16]' : 'text-foreground'}`}>
              {label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Section 2 — Digestion */}
      <p className="text-sm font-semibold text-foreground mb-2">Digestion</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {DIGESTION_OPTS.map(({ value: v, emoji, label }) => (
          <motion.button
            key={v}
            onClick={() => selDigestion(v)}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
              digestion === v
                ? 'border-[#818CF8] bg-[#818CF8]/10 text-[#818CF8]'
                : 'border-border bg-muted text-foreground hover:bg-muted/70'
            }`}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Section 3 — Bowel changes */}
      <p className="text-sm font-semibold text-foreground mb-2">Any bowel changes?</p>
      <div className="flex gap-2">
        <motion.button
          onClick={() => selBowel(false)}
          whileTap={{ scale: 0.97 }}
          className={`flex-1 py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${
            bowel === false
              ? 'border-[#84CC16] bg-[#84CC16]/10 text-[#84CC16]'
              : 'border-transparent bg-muted text-foreground hover:bg-muted/70'
          }`}
        >
          ✅ No
        </motion.button>
        <motion.button
          onClick={() => selBowel(true)}
          whileTap={{ scale: 0.97 }}
          className={`flex-1 py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${
            bowel === true
              ? 'border-[#FBBF24] bg-[#FBBF24]/10 text-[#FBBF24]'
              : 'border-transparent bg-muted text-foreground hover:bg-muted/70'
          }`}
        >
          ⚠️ Yes
        </motion.button>
      </div>
    </div>
  );
}
