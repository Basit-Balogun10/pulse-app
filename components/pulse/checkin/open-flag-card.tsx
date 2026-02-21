'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

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
  const [isRecording, setIsRecording] = useState(false);

  const handleChip = (chip: string) => { setNote(chip); onValue(chip); };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { setNote(e.target.value); onValue(e.target.value); };
  const handleSkip = () => { onValue(''); onNext(); };
  const handleDone = () => { onValue(note); onNext(); };

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice input not supported in this browser.'); return; }
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    setIsRecording(true);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setNote((prev) => (prev ? prev + ' ' + transcript : transcript));
      onValue(note);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognition.start();
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg p-6 select-none">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Notes</p>
      <h3 className="text-xl font-bold text-foreground mb-2">Anything unusual today?</h3>
      <p className="text-sm text-muted-foreground mb-4">Didn't fit the other cards? Share here — optional.</p>

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
          <div className="flex items-center gap-2">
            {note.length > 0 && (
              <button onClick={() => { setNote(''); onValue(''); }} className="text-xs text-muted-foreground hover:text-foreground">
                Clear
              </button>
            )}
            <motion.button
              onClick={startVoice}
              whileTap={{ scale: 0.95 }}
              animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
              transition={isRecording ? { duration: 0.8, repeat: Infinity } : {}}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isRecording
                  ? 'bg-red-500/10 text-red-500 border border-red-500/30'
                  : 'bg-muted-foreground/10 text-muted-foreground border border-transparent hover:border-border'
              }`}
            >
              {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              {isRecording ? 'Listening…' : 'Voice'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick-pick chips */}
      <AnimatePresence>
        {note.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {CHIPS.map((chip) => (
              <motion.button
                key={chip}
                onClick={() => handleChip(chip)}
                whileTap={{ scale: 0.97 }}
                className="shrink-0 px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground font-medium hover:bg-muted/70 transition-colors whitespace-nowrap"
              >
                {chip}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button only */}
      <motion.button
        onClick={handleSkip}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3 rounded-2xl border-2 border-border text-muted-foreground font-semibold text-sm hover:bg-muted transition-colors"
      >
        Skip
      </motion.button>
    </div>
  );
}
