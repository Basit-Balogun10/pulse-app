'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onValue: (v: any) => void;
  onNext: () => void;
  value?: any;
}

export function LifestyleCard({ onValue, value }: Props) {
  const [water, setWater] = useState<boolean | null>(value?.water ?? null);
  const [exercise, setExercise] = useState<boolean | null>(value?.exercise ?? null);
  const [meditation, setMeditation] = useState<boolean | null>(value?.meditation ?? null);
  const [screenTime, setScreenTime] = useState<boolean | null>(value?.screenTime ?? null);
  const [socialTime, setSocialTime] = useState<boolean | null>(value?.socialTime ?? null);
  const [customNote, setCustomNote] = useState<string>(value?.customNote ?? '');

  const update = (w: boolean | null, e: boolean | null, m: boolean | null, s: boolean | null, soc: boolean | null, note: string) => {
    if (w !== null && e !== null && m !== null && s !== null && soc !== null) {
      onValue({ water: w, exercise: e, meditation: m, screenTime: s, socialTime: soc, customNote: note });
    }
  };

  const selWater = (v: boolean) => { setWater(v); update(v, exercise, meditation, screenTime, socialTime, customNote); };
  const selExercise = (v: boolean) => { setExercise(v); update(water, v, meditation, screenTime, socialTime, customNote); };
  const selMeditation = (v: boolean) => { setMeditation(v); update(water, exercise, v, screenTime, socialTime, customNote); };
  const selScreenTime = (v: boolean) => { setScreenTime(v); update(water, exercise, meditation, v, socialTime, customNote); };
  const selSocialTime = (v: boolean) => { setSocialTime(v); update(water, exercise, meditation, screenTime, v, customNote); };
  const handleCustomNote = (note: string) => { setCustomNote(note); update(water, exercise, meditation, screenTime, socialTime, note); };

  const Row = ({
    emoji,
    question,
    state,
    onYes,
    onNo,
    yesLabel,
    noLabel,
  }: {
    emoji: string;
    question: string;
    state: boolean | null;
    onYes: () => void;
    onNo: () => void;
    yesLabel: string;
    noLabel: string;
  }) => (
    <div className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-3.5">
      <span className="text-2xl">{emoji}</span>
      <span className="flex-1 text-sm font-semibold text-foreground">{question}</span>
      <div className="flex gap-1.5">
        <motion.button
          onClick={onYes}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            state === true ? 'bg-[#84CC16] text-white' : 'bg-card text-foreground border border-border'
          }`}
        >
          {yesLabel}
        </motion.button>
        <motion.button
          onClick={onNo}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            state === false ? 'bg-[#EF4444] text-white' : 'bg-card text-foreground border border-border'
          }`}
        >
          {noLabel}
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg p-6 select-none">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Lifestyle</p>
      <h3 className="text-xl font-bold text-foreground mb-5">
        Quick lifestyle snapshot for today.
      </h3>

      <div className="space-y-3 max-h-[45vh] overflow-y-auto">
        <Row
          emoji="💧"
          question="Enough water today?"
          state={water}
          onYes={() => selWater(true)}
          onNo={() => selWater(false)}
          yesLabel="Hydrated"
          noLabel="Not really"
        />
        <Row
          emoji="🏃"
          question="Any physical activity?"
          state={exercise}
          onYes={() => selExercise(true)}
          onNo={() => selExercise(false)}
          yesLabel="Yes"
          noLabel="Not today"
        />
        <Row
          emoji="🧘"
          question="Meditate or relax?"
          state={meditation}
          onYes={() => selMeditation(true)}
          onNo={() => selMeditation(false)}
          yesLabel="Yes"
          noLabel="No time"
        />
        <Row
          emoji="📱"
          question="Healthy screen time?"
          state={screenTime}
          onYes={() => selScreenTime(true)}
          onNo={() => selScreenTime(false)}
          yesLabel="Balanced"
          noLabel="Too much"
        />
        <Row
          emoji="👥"
          question="Social interaction?"
          state={socialTime}
          onYes={() => selSocialTime(true)}
          onNo={() => selSocialTime(false)}
          yesLabel="Good"
          noLabel="Isolated"
        />
      </div>

      {/* Custom input */}
      <div className="mt-3 bg-muted rounded-2xl p-3 border-2 border-transparent focus-within:border-[#84CC16] transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">📝</span>
          <label className="text-xs font-semibold text-muted-foreground uppercase">Other lifestyle notes</label>
        </div>
        <input
          type="text"
          value={customNote}
          onChange={(e) => handleCustomNote(e.target.value)}
          placeholder="e.g., Ate out today, took vitamins..."
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          maxLength={100}
        />
      </div>
    </div>
  );
}
