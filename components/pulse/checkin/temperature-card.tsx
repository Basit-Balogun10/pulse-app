'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onValue: (v: any) => void;
  onNext: () => void;
  value?: any;
}

const OPTIONS = [
  { value: 'no', emoji: '😊', label: 'No fever', color: '#84CC16', bg: '#84CC1615' },
  { value: 'unsure', emoji: '🤔', label: 'Not sure', color: '#FBBF24', bg: '#FBBF2415' },
  { value: 'yes', emoji: '🤒', label: 'Feeling feverish', color: '#EF4444', bg: '#EF444415' },
];

export function TemperatureCard({ onValue, value }: Props) {
  const [fever, setFever] = useState<string | null>(value?.fever ?? null);
  const [temp, setTemp] = useState<string>(value?.temp ?? '');

  const selectFever = (v: string) => {
    setFever(v);
    onValue({ fever: v, temp: v === 'yes' ? temp || null : null });
  };

  const handleTemp = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemp(e.target.value);
    onValue({ fever, temp: e.target.value || null });
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg p-6 select-none">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Temperature</p>
      <h3 className="text-xl font-bold text-foreground mb-5">
        Are you feeling feverish or running a temperature today?
      </h3>

      <div className="space-y-2.5">
        {OPTIONS.map(({ value: v, emoji, label, color, bg }) => (
          <motion.button
            key={v}
            onClick={() => selectFever(v)}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl border-2 transition-all"
            style={{
              borderColor: fever === v ? color : 'transparent',
              backgroundColor: fever === v ? bg : undefined,
            }}
          >
            <span className="text-2xl">{emoji}</span>
            <span
              className="flex-1 text-left font-semibold"
              style={{ color: fever === v ? color : undefined }}
            >
              {label}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {fever === 'yes' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">Temperature reading (optional)</p>
              <input
                type="text"
                inputMode="decimal"
                placeholder="e.g. 38.2°C"
                value={temp}
                onChange={handleTemp}
                className="w-full px-4 py-3 rounded-2xl bg-muted border-2 border-transparent focus:border-[#EF4444] focus:outline-none text-foreground text-center text-lg font-semibold"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
