'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onValue: (v: any) => void;
  onNext: () => void;
  value?: any;
}

const LOCATIONS = [
  { id: 'head', label: 'Head', emoji: '🧠' },
  { id: 'chest', label: 'Chest', emoji: '🫀' },
  { id: 'upper_abdomen', label: 'Upper Abdomen', emoji: '🫃' },
  { id: 'lower_abdomen', label: 'Lower Abdomen', emoji: '🫁' },
  { id: 'back', label: 'Back', emoji: '🦴' },
  { id: 'arms_hands', label: 'Arms/Hands', emoji: '💪' },
  { id: 'legs_feet', label: 'Legs/Feet', emoji: '🦵' },
  { id: 'other', label: 'Other', emoji: '📍' },
];

const TYPES = ['Pain', 'Ache', 'Numbness', 'Tingling', 'Swelling', 'Rash'];

const INTENSITY = [
  { value: 'mild', label: 'Mild', color: '#FBBF24', bg: '#FBBF2415' },
  { value: 'moderate', label: 'Moderate', color: '#F97316', bg: '#F9731615' },
  { value: 'severe', label: 'Severe', color: '#EF4444', bg: '#EF444415' },
];

export function SymptomsCard({ onValue, value }: Props) {
  const [noSymptoms, setNoSymptoms] = useState(value?.none ?? false);
  const [location, setLocation] = useState<string | null>(value?.location ?? null);
  const [type, setType] = useState<string | null>(value?.type ?? null);
  const [intensity, setIntensity] = useState<string | null>(value?.intensity ?? null);

  const setNone = () => {
    setNoSymptoms(true);
    setLocation(null);
    setType(null);
    setIntensity(null);
    onValue({ none: true });
  };

  const selectLocation = (loc: string) => {
    setNoSymptoms(false);
    setLocation(loc);
    setType(null);
    setIntensity(null);
  };

  const selectType = (t: string) => {
    setType(t);
    setIntensity(null);
  };

  const selectIntensity = (i: string) => {
    setIntensity(i);
    onValue({ location, type, intensity: i });
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg p-6 select-none">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Body</p>
      <h3 className="text-xl font-bold text-foreground mb-5">
        Any physical discomfort today?
      </h3>

      {/* Stage 0 — None button */}
      <motion.button
        onClick={setNone}
        whileTap={{ scale: 0.97 }}
        className={`w-full py-3.5 rounded-2xl border-2 font-semibold mb-4 transition-all ${
          noSymptoms
            ? 'border-[#84CC16] bg-[#84CC16]/10 text-[#84CC16]'
            : 'border-border text-foreground hover:bg-muted'
        }`}
      >
        ✓ None today — feeling fine
      </motion.button>

      {/* Stage 1 — Location grid */}
      {!noSymptoms && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-semibold text-foreground mb-2">Where?</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {LOCATIONS.map(({ id, label, emoji }) => (
              <motion.button
                key={id}
                onClick={() => selectLocation(id)}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                  location === id
                    ? 'border-[#818CF8] bg-[#818CF8]/10 text-[#818CF8]'
                    : 'border-border bg-muted text-foreground hover:bg-muted/70'
                }`}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stage 2 — Symptom type */}
      <AnimatePresence>
        {!noSymptoms && location && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="text-sm font-semibold text-foreground mb-2">Type?</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {TYPES.map((t) => (
                <motion.button
                  key={t}
                  onClick={() => selectType(t)}
                  whileTap={{ scale: 0.97 }}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    type === t
                      ? 'border-[#818CF8] bg-[#818CF8]/10 text-[#818CF8]'
                      : 'border-border bg-muted text-foreground hover:bg-muted/70'
                  }`}
                >
                  {t}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 3 — Intensity */}
      <AnimatePresence>
        {!noSymptoms && location && type && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="text-sm font-semibold text-foreground mb-2">How severe?</p>
            <div className="flex gap-2">
              {INTENSITY.map(({ value: v, label, color, bg }) => (
                <motion.button
                  key={v}
                  onClick={() => selectIntensity(v)}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-2xl border-2 font-semibold text-sm transition-all"
                  style={{
                    borderColor: intensity === v ? color : 'transparent',
                    backgroundColor: intensity === v ? bg : undefined,
                    color: intensity === v ? color : undefined,
                  }}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
