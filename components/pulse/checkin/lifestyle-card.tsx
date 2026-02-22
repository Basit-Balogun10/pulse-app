'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';

interface Props {
  onValue: (v: any) => void;
  onNext: () => void;
  value?: any;
}

const EXERCISE_ACTIVITIES = [
  'Walking', 'Running', 'Cycling', 'Swimming', 'Yoga', 'Gym/Weights',
  'Sports', 'Dancing', 'Hiking', 'Stretching', 'Other'
];

export function LifestyleCard({ onValue, value }: Props) {
  const [water, setWater] = useState<number>(value?.water ?? 50); // 0-100 percentage
  const [exercise, setExercise] = useState<boolean | null>(value?.exercise ?? null);
  const [exerciseActivities, setExerciseActivities] = useState<string[]>(value?.exerciseActivities ?? []);
  const [customActivity, setCustomActivity] = useState(value?.customActivity ?? '');
  const [meditation, setMeditation] = useState<boolean | null>(value?.meditation ?? null);
  const [screenTime, setScreenTime] = useState<number>(value?.screenTime ?? 50); // 0-100 percentage
  const [socialTime, setSocialTime] = useState<boolean | null>(value?.socialTime ?? null);
  const [customNote, setCustomNote] = useState<string>(value?.customNote ?? '');

  const update = (
    w: number,
    e: boolean | null,
    acts: string[],
    custAct: string,
    m: boolean | null,
    s: number,
    soc: boolean | null,
    note: string
  ) => {
    // All required fields filled
    if (e !== null && m !== null && soc !== null) {
      onValue({
        water: w,
        exercise: e,
        exerciseActivities: e ? acts : [],
        customActivity: custAct,
        meditation: m,
        screenTime: s,
        socialTime: soc,
        customNote: note,
      });
    }
  };

  const handleWater = (v: number[]) => {
    setWater(v[0]);
    update(v[0], exercise, exerciseActivities, customActivity, meditation, screenTime, socialTime, customNote);
  };

  const handleExercise = (v: boolean) => {
    setExercise(v);
    if (!v) {
      setExerciseActivities([]);
      setCustomActivity('');
    }
    update(water, v, v ? exerciseActivities : [], '', meditation, screenTime, socialTime, customNote);
  };

  const toggleActivity = (activity: string) => {
    const newActivities = exerciseActivities.includes(activity)
      ? exerciseActivities.filter((a) => a !== activity)
      : [...exerciseActivities, activity];
    setExerciseActivities(newActivities);
    update(water, exercise, newActivities, customActivity, meditation, screenTime, socialTime, customNote);
  };

  const handleCustomActivity = (v: string) => {
    setCustomActivity(v);
    update(water, exercise, exerciseActivities, v, meditation, screenTime, socialTime, customNote);
  };

  const handleMeditation = (v: boolean) => {
    setMeditation(v);
    update(water, exercise, exerciseActivities, customActivity, v, screenTime, socialTime, customNote);
  };

  const handleScreenTime = (v: number[]) => {
    setScreenTime(v[0]);
    update(water, exercise, exerciseActivities, customActivity, meditation, v[0], socialTime, customNote);
  };

  const handleSocialTime = (v: boolean) => {
    setSocialTime(v);
    update(water, exercise, exerciseActivities, customActivity, meditation, screenTime, v, customNote);
  };

  const handleCustomNote = (note: string) => {
    setCustomNote(note);
    update(water, exercise, exerciseActivities, customActivity, meditation, screenTime, socialTime, note);
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg p-6 select-none max-h-[75vh] flex flex-col">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Lifestyle</p>
      <h3 className="text-xl font-bold text-foreground mb-5">
        Quick lifestyle snapshot for today.
      </h3>

      <div className="space-y-5 overflow-y-auto flex-1">
        {/* Water Intake - Slider */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💧</span>
            <span className="text-sm font-semibold text-foreground">Hydration today?</span>
          </div>
          <Slider
            value={[water]}
            onValueChange={handleWater}
            max={100}
            step={10}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground text-center">
            {water < 40 ? 'Not enough' : water < 70 ? 'Moderate' : 'Well hydrated'}
          </p>
        </div>

        {/* Physical Activity - Yes/No then activities */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏃</span>
            <span className="text-sm font-semibold text-foreground">Any physical activity?</span>
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={() => handleExercise(true)}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                exercise === true ? 'bg-[#84CC16] text-white' : 'bg-muted text-foreground border border-border'
              }`}
            >
              Yes
            </motion.button>
            <motion.button
              onClick={() => handleExercise(false)}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                exercise === false ? 'bg-[#EF4444] text-white' : 'bg-muted text-foreground border border-border'
              }`}
            >
              Not today
            </motion.button>
          </div>
          <AnimatePresence>
            {exercise === true && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-3 space-y-2"
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase">What activities?</p>
                <div className="flex flex-wrap gap-1.5">
                  {EXERCISE_ACTIVITIES.map((activity) => (
                    <motion.button
                      key={activity}
                      onClick={() => toggleActivity(activity)}
                      whileTap={{ scale: 0.97 }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        exerciseActivities.includes(activity)
                          ? 'bg-[#84CC16]/20 border-2 border-[#84CC16] text-[#84CC16]'
                          : 'bg-muted border border-border text-foreground'
                      }`}
                    >
                      {activity}
                    </motion.button>
                  ))}
                </div>
                {exerciseActivities.includes('Other') && (
                  <input
                    type="text"
                    value={customActivity}
                    onChange={(e) => handleCustomActivity(e.target.value)}
                    placeholder="Specify activity..."
                    className="w-full px-3 py-2 rounded-xl bg-muted border-2 border-transparent focus:border-[#84CC16] focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Meditation */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🧘</span>
            <span className="text-sm font-semibold text-foreground">Meditate or relax?</span>
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={() => handleMeditation(true)}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                meditation === true ? 'bg-[#84CC16] text-white' : 'bg-muted text-foreground border border-border'
              }`}
            >
              Yes
            </motion.button>
            <motion.button
              onClick={() => handleMeditation(false)}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                meditation === false ? 'bg-[#EF4444] text-white' : 'bg-muted text-foreground border border-border'
              }`}
            >
              No time
            </motion.button>
          </div>
        </div>

        {/* Screen Time - Slider */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📱</span>
            <span className="text-sm font-semibold text-foreground">Screen time today?</span>
          </div>
          <Slider
            value={[screenTime]}
            onValueChange={handleScreenTime}
            max={100}
            step={10}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground text-center">
            {screenTime < 40 ? 'Minimal' : screenTime < 70 ? 'Balanced' : 'Too much'}
          </p>
        </div>

        {/* Social Interaction */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">👥</span>
            <span className="text-sm font-semibold text-foreground">Social interaction?</span>
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={() => handleSocialTime(true)}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                socialTime === true ? 'bg-[#84CC16] text-white' : 'bg-muted text-foreground border border-border'
              }`}
            >
              Good
            </motion.button>
            <motion.button
              onClick={() => handleSocialTime(false)}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                socialTime === false ? 'bg-[#EF4444] text-white' : 'bg-muted text-foreground border border-border'
              }`}
            >
              Isolated
            </motion.button>
          </div>
        </div>

        {/* Custom Notes */}
        <div className="bg-muted rounded-2xl p-3 border-2 border-transparent focus-within:border-[#84CC16] transition-colors">
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
    </div>
  );
}
