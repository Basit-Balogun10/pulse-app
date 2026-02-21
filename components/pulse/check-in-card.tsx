'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, ArrowLeft } from 'lucide-react';

interface CheckInCardProps {
  item: {
    id: string;
    label: string;
    icon: LucideIcon;
    type: 'scale' | 'scale-5' | 'number' | 'tags' | 'select';
    min?: number;
    max?: number;
  };
  onValue: (value: any) => void;
  onNext: () => void;
  onBack: () => void;
  isCompleted: boolean;
}

// Emoji scales with smart emoji/1-5 logic
const emojiScales = {
  energy: {
    type: 'emoji', // Full emoji scale
    emojis: ['😴', '😑', '😐', '🙂', '😊', '😄', '😃', '😆', '🤩', '🔥'],
  },
  sleep: {
    type: 'scale-5', // 1-5 scale with emoji indicators
    labels: ['Poor', 'Fair', 'Okay', 'Good', 'Great'],
    emojis: ['😴', '😕', '😐', '🙂', '😄'],
  },
  mood: {
    type: 'emoji', // Full emoji scale
    emojis: ['😢', '😞', '😕', '😐', '🙂', '😊', '😄', '😆', '🤩', '🔥'],
  },
  appetite: {
    type: 'scale-5', // 1-5 scale
    labels: ['None', 'Low', 'Normal', 'High', 'Very High'],
    emojis: ['🚫', '😒', '🍽️', '😋', '😋😋'],
  },
  respiratory: {
    type: 'scale-5', // 1-5 scale
    labels: ['Very Poor', 'Poor', 'Okay', 'Good', 'Excellent'],
    emojis: ['😷', '😕', '😐', '🙂', '👍'],
  },
  hydration: {
    type: 'scale-5', // New check-in
    labels: ['Not at all', 'Minimal', 'Adequate', 'Good', 'Excellent'],
    emojis: ['💧', '💧', '💧💧', '💧💧💧', '💧🌟'],
  },
  exercise: {
    type: 'scale-5', // New check-in
    labels: ['None', 'Light', 'Moderate', 'Intense', 'Very Intense'],
    emojis: ['⛔', '🚶', '🏃', '💪', '🔥'],
  },
  stress: {
    type: 'scale-5', // New check-in
    labels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'],
    emojis: ['😌', '🙂', '😐', '😟', '😰'],
  },
};

export function CheckInCard({
  item,
  onValue,
  onNext,
  onBack,
  isCompleted,
}: CheckInCardProps) {
  const Icon = item.icon;
  const [value, setValue] = useState<any>(null);

  const handleScaleSelect = (val: number) => {
    setValue(val);
    onValue(val);
  };

  const handleTemperature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setValue(val);
    onValue(val);
  };

  const handleSymptomToggle = (symptom: string) => {
    const newSymptoms = Array.isArray(value) ? [...value] : [];
    if (newSymptoms.includes(symptom)) {
      newSymptoms.splice(newSymptoms.indexOf(symptom), 1);
    } else {
      newSymptoms.push(symptom);
    }
    setValue(newSymptoms);
    onValue(newSymptoms);
  };

  const handleLifestyle = (val: string) => {
    setValue(val);
    onValue(val);
  };

  const physicalSymptoms = [
    'Headache',
    'Sore Throat',
    'Cough',
    'Fatigue',
    'Chest Pain',
    'None',
  ];
  const lifestyleOptions = [
    { label: 'Rest', value: 'rest' },
    { label: 'Light', value: 'light' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Active', value: 'active' },
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg border border-border">
      {/* Icon and Label */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"
        >
          <Icon className="w-8 h-8 text-primary" />
        </motion.div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {item.label}
        </h3>
      </div>

      {/* Scale Input (Smart Emoji or 1-5) */}
      {(item.type === 'scale' || item.type === 'scale-5') && (
        <div className="space-y-4">
          {/* Full Emoji Scale */}
          {item.type === 'scale' && (
            <>
              <div className="flex justify-between gap-1 mb-6">
                {Array.from(
                  { length: item.max || 10 },
                  (_, i) => i
                ).map((i) => {
                  const key = item.id as keyof typeof emojiScales;
                  const scaleData = emojiScales[key];
                  const emoji =
                    scaleData && 'emojis' in scaleData
                      ? scaleData.emojis[i]
                      : '◯';
                  const isSelected = value === i;

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleScaleSelect(i)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 aspect-square flex items-center justify-center rounded-2xl text-2xl transition-all ${
                        isSelected
                          ? 'bg-primary text-white scale-110 shadow-lg'
                          : 'bg-muted hover:bg-muted/70'
                      }`}
                    >
                      {emoji}
                    </motion.button>
                  );
                })}
              </div>
              {value !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className="text-4xl font-bold text-primary mb-2">
                    {value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    out of {item.max || 10}
                  </p>
                </motion.div>
              )}
            </>
          )}

          {/* 1-5 Scale with Labels */}
          {item.type === 'scale-5' && (
            <>
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => {
                  const key = item.id as keyof typeof emojiScales;
                  const scaleData = emojiScales[key];
                  const label =
                    scaleData && 'labels' in scaleData
                      ? scaleData.labels[i - 1]
                      : `Level ${i}`;
                  const emoji =
                    scaleData && 'emojis' in scaleData
                      ? scaleData.emojis[i - 1]
                      : '◯';
                  const isSelected = value === i;

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleScaleSelect(i)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-muted text-foreground hover:bg-muted/70'
                      }`}
                    >
                      <span>
                        {emoji} {label}
                      </span>
                      {isSelected && (
                        <span className="text-xl ml-2">✓</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Temperature Input */}
      {item.type === 'number' && (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="96"
              max="104"
              placeholder="98.6"
              onChange={handleTemperature}
              className="w-full px-6 py-4 rounded-2xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-center text-3xl font-bold text-foreground"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground text-xl font-semibold">
              °F
            </span>
          </div>
          {value && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-sm text-muted-foreground">
                {value > 99.5 && 'Slightly elevated'}
                {value <= 99.5 && value >= 98 && 'Normal'}
                {value < 98 && 'Slightly low'}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Physical Symptoms Tags */}
      {item.type === 'tags' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {physicalSymptoms.map((symptom) => {
              const isSelected = Array.isArray(value) && value.includes(symptom);

              return (
                <motion.button
                  key={symptom}
                  onClick={() => handleSymptomToggle(symptom)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-3 px-4 rounded-2xl font-semibold transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-muted text-foreground hover:bg-muted/70'
                  }`}
                >
                  {symptom}
                </motion.button>
              );
            })}
          </div>
          {Array.isArray(value) && value.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              None selected
            </p>
          )}
        </div>
      )}

      {/* Lifestyle Select */}
      {item.type === 'select' && (
        <div className="space-y-3">
          {lifestyleOptions.map((option) => {
            const isSelected = value === option.value;

            return (
              <motion.button
                key={option.value}
                onClick={() => handleLifestyle(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all text-lg ${
                  isSelected
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-muted text-foreground hover:bg-muted/70'
                }`}
              >
                {option.label}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
