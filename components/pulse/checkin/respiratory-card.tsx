'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface Props {
  onValue: (v: string[]) => void;
  onNext: () => void;
  value?: string[];
}

const OPTIONS = [
  { id: 'none', emoji: '✅', label: 'None of the above' },
  { id: 'cough', emoji: '🤧', label: 'Cough' },
  { id: 'shortness', emoji: '😮‍💨', label: 'Shortness of breath' },
  { id: 'chest_tight', emoji: '🫁', label: 'Chest tightness' },
  { id: 'wheezing', emoji: '🌬️', label: 'Wheezing' },
  { id: 'runny_nose', emoji: '🤧', label: 'Runny nose' },
  { id: 'sore_throat', emoji: '😣', label: 'Sore throat' },
  { id: 'other', emoji: '📝', label: 'Other' },
];

export function RespiratoryCard({ onValue, value }: Props) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(value ?? [])
  );
  const [customOther, setCustomOther] = useState('');

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (id === 'none') {
      setSelected(new Set(['none']));
      onValue(['none']);
      return;
    }
    next.delete('none');
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    onValue(Array.from(next));
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg p-6 select-none">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Respiratory</p>
      <h3 className="text-xl font-bold text-foreground mb-5">
        Any respiratory symptoms today?
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Select all that apply</p>

      <div className="space-y-2">
        {OPTIONS.map(({ id, emoji, label }) => {
          const isSelected = selected.has(id);
          return (
            <motion.button
              key={id}
              onClick={() => toggle(id)}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${
                isSelected
                  ? 'border-[#84CC16] bg-[#84CC16]/10'
                  : 'border-transparent bg-muted hover:bg-muted/70'
              }`}
            >
              <span className="text-xl w-7 text-center">{emoji}</span>
              <span
                className={`flex-1 text-left font-semibold text-sm ${
                  isSelected ? 'text-[#84CC16]' : 'text-foreground'
                }`}
              >
                {label}
              </span>
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#84CC16' }}
                  >
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
        {selected.has('other') && (
          <motion.input
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            type="text"
            value={customOther}
            onChange={(e) => setCustomOther(e.target.value)}
            placeholder="Please specify..."
            className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-[#84CC16] focus:outline-none text-foreground placeholder:text-muted-foreground"
          />
        )}
      </div>
    </div>
  );
}
