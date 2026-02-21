'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CheckInCardProps {
  item: {
    id: string;
    label: string;
    icon: LucideIcon;
    type: 'scale' | 'number' | 'tags' | 'select';
    min?: number;
    max?: number;
  };
  onValue: (value: any) => void;
  onNext: () => void;
  onSkip: () => void;
  isCompleted: boolean;
}

const emojiScales = {
  energy: ['😴', '😑', '😐', '🙂', '😊', '😄', '😃', '😆', '🤩', '🔥'],
  sleep: ['😴', '😴', '😐', '🙂', '😊', '😄', '😊', '😃', '🤩', '🔥'],
  mood: ['😢', '😞', '😕', '😐', '🙂', '😊', '😄', '😆', '🤩', '🔥'],
  appetite: ['🚫', '😒', '😐', '😑', '🙂', '😋', '😋', '😋', '😋', '😋'],
  respiratory: ['😷', '😐', '😐', '🙂', '😊', '😊', '😊', '😊', '😊', '👍'],
};

export function CheckInCard({
  item,
  onValue,
  onNext,
  onSkip,
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

  const symptoms = ['Fatigue', 'Cough', 'Fever', 'Throat', 'Headache', 'None'];
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

      {/* Scale Input (Emoji-based) */}
      {item.type === 'scale' && (
        <div className="space-y-4">
          {/* Emoji Scale Display */}
          <div className="flex justify-between gap-1 mb-6">
            {Array.from(
              { length: item.max || 10 },
              (_, i) => i
            ).map((i) => {
              const key = item.id as keyof typeof emojiScales;
              const emoji = emojiScales[key]?.[i] || '◯';
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

          {/* Numeric Display */}
          {value !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-4xl font-bold text-primary mb-2">{value}</p>
              <p className="text-sm text-muted-foreground">
                {item.max === 100 ? `${value}%` : `out of ${item.max || 10}`}
              </p>
            </motion.div>
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

      {/* Symptoms Tags */}
      {item.type === 'tags' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {symptoms.map((symptom) => {
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
