'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onValue: (v: string) => void;
  onNext: () => void;
  value?: string;
}

const CHIPS = [
  'Feeling a bit off today',
  'More tired than usual',
  'Had a headache earlier',
  'Stressed about work',
];

export function OpenFlagCard({ onValue, onNext }: Props) {
  const [note, setNote] = useState('');

  const handleChip = (chip: string) => {
    setNote(chip);
    onValue(chip);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    onValue(e.target.value);
  };

  const handleSkip = () => {
    onValue('');
    onNext();
  };

  const handleDone = () => {
    onValue(note);
    onNext();
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg p-6 select-none">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Notes</p>
      <h3 className="text-xl font-bold text-foreground mb-2">
        Anything unusual today?
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Didn't fit the other cards? Share here — optional.
      </p>

      {/* Textarea */}
      <div
        className={`bg-muted rounded-2xl p-4 mb-3 border-2 transition-colors ${
          note.length > 0 ? 'border-[#84CC16]' : 'border-transparent'
        }`}
      >
        <textarea
          value={note}
          onChange={handleChange}
          placeholder="e.g. Just feeling a bit off again..."
          maxLength={200}
          rows={3}
          className="w-full bg-transparent focus:outline-none text-foreground text-sm resize-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{note.length}/200</span>
          {note.length > 0 && (
            <button
              onClick={() => { setNote(''); onValue(''); }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Quick-pick chips */}
      <AnimatePresence>
        {note.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {CHIPS.map((chip) => (
              <motion.button
                key={chip}
                onClick={() => handleChip(chip)}
                whileTap={{ scale: 0.97 }}
                className="px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground font-medium hover:bg-muted/70 transition-colors"
              >
                {chip}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Split CTA */}
      <div className="flex gap-3">
        <motion.button
          onClick={handleSkip}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-3 rounded-2xl border-2 border-border text-muted-foreground font-semibold text-sm hover:bg-muted transition-colors"
        >
          Skip
        </motion.button>
        <motion.button
          onClick={handleDone}
          whileTap={{ scale: 0.97 }}
          className="text-white py-3 rounded-2xl font-semibold text-sm transition-all"
          style={{
            flex: 2,
            background: note.length > 0
              ? 'linear-gradient(135deg, #84CC16, #F97316)'
              : '#475569',
          }}
        >
          {note.length > 0 ? 'Done ✓' : 'Log entry →'}
        </motion.button>
      </div>
    </div>
  );
}
