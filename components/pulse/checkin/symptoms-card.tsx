'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  { id: 'throat_neck', label: 'Throat/Neck', emoji: '🗣️' },
  { id: 'eyes', label: 'Eyes', emoji: '👁️' },
  { id: 'ear', label: 'Ear', emoji: '👂' },
  { id: 'skin', label: 'Skin', emoji: '🩹' },
  { id: 'other', label: 'Other', emoji: '📍' },
];

const TYPES = ['Pain', 'Ache', 'Numbness', 'Tingling', 'Swelling', 'Rash', 'Burning', 'Stiffness', 'Itching', 'Pressure', 'Other'];

const INTENSITY = [
  { value: 'mild', label: 'Mild', color: '#FBBF24', bg: '#FBBF2415' },
  { value: 'moderate', label: 'Moderate', color: '#F97316', bg: '#F9731615' },
  { value: 'severe', label: 'Severe', color: '#EF4444', bg: '#EF444415' },
];

export function SymptomsCard({ onValue, value }: Props) {
  const [noSymptoms, setNoSymptoms] = useState(value?.none ?? false);
  const [location, setLocation] = useState<string | null>(value?.location ?? null);
  const [customLocation, setCustomLocation] = useState(value?.customLocation ?? '');
  const [type, setType] = useState<string | null>(value?.type ?? null);
  const [customType, setCustomType] = useState(value?.customType ?? '');
  const [intensity, setIntensity] = useState<string | null>(value?.intensity ?? null);

  const signal = (ns: boolean, loc: string | null, t: string | null, i: string | null, customLoc?: string, customT?: string) => {
    if (ns) { onValue({ none: true }); return; }
    if (loc && t && i) { 
      onValue({ 
        location: loc, 
        customLocation: customLoc || '', 
        type: t, 
        customType: customT || '', 
        intensity: i 
      }); 
      return; 
    }
    onValue(null); // incomplete — disables Next
  };

  const toggleNone = () => {
    const next = !noSymptoms;
    setNoSymptoms(next);
    if (next) {
      setLocation(null);
      setType(null);
      setIntensity(null);
    }
    signal(next, null, null, null);
  };

  const selectLocation = (loc: string) => {
    const next = location === loc ? null : loc;
    setNoSymptoms(false);
    setLocation(next);
    if (next !== 'other') setCustomLocation('');
    setType(null);
    setCustomType('');
    setIntensity(null);
    signal(false, next, null, null);
  };

  const selectType = (t: string) => {
    const next = type === t ? null : t;
    setType(next);
    if (next !== 'Other') setCustomType('');
    setIntensity(null);
    signal(false, location, next, null, customLocation, '');
  };

  const selectIntensity = (i: string) => {
    const next = intensity === i ? null : i;
    setIntensity(next);
    signal(false, location, type, next, customLocation, customType);
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg p-5 select-none">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Body</p>
      <h3 className="text-xl font-bold text-foreground mb-4">
        Any physical discomfort today?
      </h3>
      <div>

      {/* Stage 0 — None button */}
      <motion.button
        onClick={toggleNone}
        whileTap={{ scale: 0.97 }}
        className={`w-full py-3 rounded-2xl border-2 font-semibold mb-4 transition-all text-sm ${
          noSymptoms
            ? 'border-[#84CC16] bg-[#84CC16]/10 text-[#84CC16]'
            : 'border-border text-foreground hover:bg-muted'
        }`}
      >
        ✓ None today — feeling fine
      </motion.button>

      {/* Stage 1 — Location grid */}
      {!noSymptoms && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Where?</p>
          <div className="grid grid-cols-3 gap-1.5 mb-4">
            {LOCATIONS.map(({ id, label, emoji }) => (
              <motion.button
                key={id}
                onClick={() => selectLocation(id)}
                whileTap={{ scale: 0.97 }}
                className={`flex flex-col items-center py-2 px-1 rounded-xl border-2 text-xs font-medium transition-all ${
                  location === id
                    ? 'border-[#818CF8] bg-[#818CF8]/10 text-[#818CF8]'
                    : 'border-border bg-muted text-foreground hover:bg-muted/70'
                }`}
              >
                <span className="text-lg mb-0.5">{emoji}</span>
                <span className="text-center leading-tight">{label}</span>
              </motion.button>
            ))}
          </div>
          {location === 'other' && (
            <input
              type="text"
              value={customLocation}
              onChange={(e) => {
                setCustomLocation(e.target.value);
                if (type && intensity) signal(false, location, type, intensity, e.target.value, customType);
              }}
              placeholder="Please specify location..."
              className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-[#818CF8] focus:outline-none text-foreground placeholder:text-muted-foreground mb-4"
            />
          )}
        </motion.div>
      )}

      {/* Stage 2 — Symptom type */}
      <AnimatePresence>
        {!noSymptoms && location && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Type?</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {TYPES.map((t) => (
                <motion.button
                  key={t}
                  onClick={() => selectType(t)}
                  whileTap={{ scale: 0.97 }}
                  className={`px-3 py-1.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                    type === t
                      ? 'border-[#818CF8] bg-[#818CF8]/10 text-[#818CF8]'
                      : 'border-border bg-muted text-foreground hover:bg-muted/70'
                  }`}
                >
                  {t}
                </motion.button>
              ))}
            </div>
            {type === 'Other' && (
              <input
                type="text"
                value={customType}
                onChange={(e) => {
                  setCustomType(e.target.value);
                  if (intensity) signal(false, location, type, intensity, customLocation, e.target.value);
                }}
                placeholder="Please specify symptom type..."
                className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-[#818CF8] focus:outline-none text-foreground placeholder:text-muted-foreground mb-4"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 3 — Intensity */}
      <AnimatePresence>
        {!noSymptoms && location && type && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">How severe?</p>
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
    </div>
  );
}
