'use client';

import { motion } from 'framer-motion';
import { X, Zap, Moon, Activity, Wind, Thermometer, Smile, UtensilsCrossed, TrendingUp, Sparkles } from 'lucide-react';
import { CheckInEntry } from '@/lib/amara-story-data';

interface DayEntryViewProps {
  isOpen: boolean;
  onClose: () => void;
  entry: CheckInEntry | null;
}

export function DayEntryView({ isOpen, onClose, entry }: DayEntryViewProps) {
  if (!isOpen || !entry) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const getEnergyLabel = (value: number) => {
    const labels = ['', 'Very Low', 'Low', 'Moderate', 'Good', 'Excellent'];
    return labels[value] || '';
  };

  const getSleepQualityColor = (quality: string) => {
    const colors: Record<string, string> = {
      'great': '#84CC16',
      'good': '#84CC16',
      'okay': '#F97316',
      'poor': '#EF4444',
      'very poor': '#DC2626',
    };
    return colors[quality] || '#94A3B8';
  };

  const getMoodEmoji = (mood: string) => {
    const emojis: Record<string, string> = {
      'positive': '😊',
      'neutral': '😐',
      'low': '😔',
      'anxious': '😰',
    };
    return emojis[mood] || '😐';
  };

  const getConcernLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'none': '#84CC16',
      'low': '#F59E0B',
      'moderate': '#F97316',
      'high': '#EF4444',
    };
    return colors[level] || '#94A3B8';
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 280 }}
        className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[85vh] flex flex-col border-t border-border"
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-3 mb-2" />

        {/* Header */}
        <div className="px-6 pt-2 pb-4 flex items-center justify-between border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Day {entry.dayNumber} Check-in</h2>
            <p className="text-sm text-muted-foreground">{formatDate(entry.date)}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="w-5 h-5 text-foreground" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Energy */}
          <div className="bg-muted/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-[#84CC16]" />
              <h3 className="font-semibold text-foreground">Energy Level</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-[#84CC16] h-2 rounded-full transition-all"
                  style={{ width: `${(entry.energy / 5) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground">{entry.energy}/5</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{getEnergyLabel(entry.energy)}</p>
          </div>

          {/* Sleep */}
          <div className="bg-muted/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-5 h-5 text-[#818CF8]" />
              <h3 className="font-semibold text-foreground">Sleep</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{entry.sleep.hours} hrs</p>
                <p className="text-xs text-muted-foreground capitalize">{entry.sleep.quality}</p>
              </div>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getSleepQualityColor(entry.sleep.quality) }}
              />
            </div>
          </div>

          {/* Symptoms */}
          {entry.symptoms.length > 0 ? (
            <div className="bg-muted/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-[#F97316]" />
                <h3 className="font-semibold text-foreground">Physical Symptoms</h3>
              </div>
              <div className="space-y-2">
                {entry.symptoms.map((symptom, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">{symptom.location}</p>
                      <p className="text-xs text-muted-foreground capitalize">{symptom.type}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      symptom.intensity === 'severe' ? 'bg-red-500/20 text-red-500' :
                      symptom.intensity === 'moderate' ? 'bg-orange-500/20 text-orange-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {symptom.intensity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-[#84CC16]" />
                <h3 className="font-semibold text-foreground">Physical Symptoms</h3>
              </div>
              <p className="text-sm text-muted-foreground">No symptoms reported</p>
            </div>
          )}

          {/* Temperature */}
          <div className="bg-muted/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-5 h-5 text-[#F97316]" />
              <h3 className="font-semibold text-foreground">Temperature</h3>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground">
                {entry.temperature.hasFever ? (
                  <span className="text-red-500 font-semibold">Fever: {entry.temperature.value}°C</span>
                ) : (
                  <span className="text-[#84CC16]">No fever</span>
                )}
              </p>
            </div>
          </div>

          {/* Mood */}
          <div className="bg-muted/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Smile className="w-5 h-5 text-[#818CF8]" />
              <h3 className="font-semibold text-foreground">Mood</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
              <p className="text-sm font-medium text-foreground capitalize">{entry.mood}</p>
            </div>
          </div>

          {/* Appetite */}
          <div className="bg-muted/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <UtensilsCrossed className="w-5 h-5 text-[#F97316]" />
              <h3 className="font-semibold text-foreground">Appetite</h3>
            </div>
            <p className="text-sm font-medium text-foreground capitalize">{entry.appetite}</p>
          </div>

          {/* Lifestyle */}
          <div className="bg-muted/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[#84CC16]" />
              <h3 className="font-semibold text-foreground">Lifestyle</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${entry.lifestyle.water ? 'bg-[#84CC16]' : 'bg-muted-foreground'}`} />
                <span className="text-sm text-foreground">Water</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${entry.lifestyle.exercise ? 'bg-[#84CC16]' : 'bg-muted-foreground'}`} />
                <span className="text-sm text-foreground">Exercise</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${entry.lifestyle.meditation ? 'bg-[#84CC16]' : 'bg-muted-foreground'}`} />
                <span className="text-sm text-foreground">Meditation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${entry.lifestyle.screenTime === 'normal' ? 'bg-[#84CC16]' : 'bg-orange-500'}`} />
                <span className="text-sm text-foreground">Screen time: {entry.lifestyle.screenTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${
                entry.lifestyle.social === 'active' ? 'bg-[#84CC16]' :
                entry.lifestyle.social === 'moderate' ? 'bg-yellow-500' :
                'bg-orange-500'
              }`} />
              <span className="text-sm text-foreground capitalize">Social: {entry.lifestyle.social}</span>
            </div>
            {entry.lifestyle.customNote && (
              <div className="mt-2 p-2 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Note:</p>
                <p className="text-sm text-foreground">"{entry.lifestyle.customNote}"</p>
              </div>
            )}
          </div>

          {/* Open Flag */}
          {entry.openFlag && (
            <div className="bg-muted/50 rounded-2xl p-4">
              <h3 className="font-semibold text-foreground mb-2">Check-in Note</h3>
              <p className="text-sm text-muted-foreground italic">"{entry.openFlag}"</p>
            </div>
          )}

          {/* AI Analysis */}
          <div className="bg-gradient-to-br from-[#818CF8]/10 to-[#84CC16]/10 rounded-2xl p-4 border border-[#818CF8]/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#818CF8]" />
              <h3 className="font-semibold text-foreground">AI Analysis</h3>
              <div
                className="ml-auto px-2 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${getConcernLevelColor(entry.aiAnalysis.concern_level)}20`,
                  color: getConcernLevelColor(entry.aiAnalysis.concern_level),
                }}
              >
                {entry.aiAnalysis.concern_level} concern
              </div>
            </div>
            <p className="text-sm text-foreground mb-3">{entry.aiAnalysis.summary}</p>
            
            {entry.aiAnalysis.patterns_detected.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Patterns Detected:</p>
                {entry.aiAnalysis.patterns_detected.map((pattern, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#818CF8] mt-1.5" />
                    <p className="text-xs text-foreground">{pattern}</p>
                  </div>
                ))}
              </div>
            )}

            {entry.aiAnalysis.recommendation && (
              <div className="mt-3 p-3 bg-[#818CF8]/10 rounded-lg border border-[#818CF8]/20">
                <p className="text-xs font-semibold text-[#818CF8] uppercase mb-1">Recommendation</p>
                <p className="text-sm text-foreground">{entry.aiAnalysis.recommendation}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
