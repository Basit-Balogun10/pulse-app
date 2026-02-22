'use client';

import { motion } from 'framer-motion';
import { X, TrendingDown, Moon, Activity, UtensilsCrossed, Thermometer, Heart, AlertTriangle, Sparkles, Calendar } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface DetailedAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONCERN_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  low: { bg: 'bg-[#84CC16]/10', text: 'text-[#84CC16]', border: 'border-[#84CC16]/30' },
  medium: { bg: 'bg-[#FBBF24]/10', text: 'text-[#FBBF24]', border: 'border-[#FBBF24]/30' },
  high: { bg: 'bg-[#F97316]/10', text: 'text-[#F97316]', border: 'border-[#F97316]/30' },
  critical: { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', border: 'border-[#EF4444]/30' },
};

export function DetailedAnalysisModal({ isOpen, onClose }: DetailedAnalysisModalProps) {
  const TODAY = new Date().toISOString().split('T')[0];
  const todayEntry = useQuery(api.healthEntries.getToday, { date: TODAY });
  const history = useQuery(api.healthEntries.getHistory, { limit: 7 }) ?? [];
  const profile = useQuery(api.users.getProfile);

  if (!isOpen) return null;

  const ai = (todayEntry as any)?.aiAnalysis ?? null;
  const entry = todayEntry as any;
  const concernLevel = ai?.concernLevel?.toLowerCase() ?? 'low';
  const concernStyle = CONCERN_COLORS[concernLevel] ?? CONCERN_COLORS.low;

  // Build last-7-days energy trend
  const energyTrend = (history as any[])
    .slice()
    .reverse()
    .map((e) => ({ date: e.date, energy: e.energy ?? 0, mood: e.mood ?? 0 }));

  // Flatten symptoms text
  const symptoms = entry?.symptoms;
  const hasSymptoms =
    symptoms && (symptoms.location || symptoms.type || symptoms.intensity);

  const respiratory: string[] = entry?.respiratory ?? [];
  const temperature = entry?.temperature;
  const hasFever = temperature?.fever === true || temperature?.fever === 'yes';
  const tempValue = temperature?.temp ?? null;

  const conditions: string[] = profile?.medicalConditions ?? [];
  const familyHistory: string[] = profile?.familyHistory ?? [];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 280 }}
        className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[90vh] flex flex-col border-t border-border"
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-3 mb-2" />

        {/* Header */}
        <div className="px-6 pt-2 pb-4 flex items-center justify-between border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Detailed Health Analysis</h2>
            <p className="text-sm text-muted-foreground">
              {TODAY} · {history.length}-day pattern
            </p>
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
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">

          {/* No analysis yet state */}
          {!ai && (
            <div className="bg-muted/50 rounded-2xl p-6 text-center">
              <Sparkles className="w-8 h-8 text-[#818CF8] mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground mb-1">AI Analysis In Progress</p>
              <p className="text-xs text-muted-foreground">
                Your analysis is being generated. Check back in a moment.
              </p>
            </div>
          )}

          {/* AI Overview + Concern Level */}
          {ai?.overview && (
            <div className={`rounded-2xl p-4 border ${concernStyle.bg} ${concernStyle.border}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#818CF8]" />
                  AI Overview
                </h3>
                {ai.concernLevel && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${concernStyle.bg} ${concernStyle.text}`}>
                    {ai.concernLevel} concern
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground leading-relaxed">{ai.overview}</p>
            </div>
          )}

          {/* Detected Patterns */}
          {ai?.patternsDetected && ai.patternsDetected.length > 0 && (
            <div className="bg-muted/50 rounded-2xl p-4">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#818CF8]" />
                Detected Patterns
              </h3>
              <div className="space-y-2">
                {(ai.patternsDetected as string[]).map((pattern: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#818CF8] mt-1.5 shrink-0" />
                    <p className="text-sm text-foreground">{pattern}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's Metrics */}
          {entry && (
            <div className="bg-muted/50 rounded-2xl p-4">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#F97316]" />
                Today&apos;s Metrics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Energy', value: entry.energy != null ? `${entry.energy}/5` : '—', emoji: '⚡' },
                  { label: 'Mood', value: entry.mood != null ? `${entry.mood}/5` : '—', emoji: '😊' },
                  { label: 'Sleep', value: entry.sleep?.quality ?? '—', emoji: '🌙' },
                  { label: 'Appetite', value: entry.appetite?.appetite ?? '—', emoji: '🍽️' },
                ].map(({ label, value, emoji }) => (
                  <div key={label} className="bg-background rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">{emoji} {label}</p>
                    <p className="text-base font-bold text-foreground capitalize">{value}</p>
                  </div>
                ))}
              </div>
              {entry.lifestyle && (
                <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-2 text-xs text-center text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground">{entry.lifestyle.water ?? '—'}</p>
                    <p>Water</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground capitalize">{entry.lifestyle.exercise ?? '—'}</p>
                    <p>Exercise</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground capitalize">{entry.lifestyle.medications ?? '—'}</p>
                    <p>Medications</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Symptoms */}
          {(hasSymptoms || respiratory.length > 0 || hasFever) && (
            <div className="bg-muted/50 rounded-2xl p-4">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-[#EF4444]" />
                Reported Symptoms
              </h3>
              <div className="space-y-2 text-sm">
                {hasSymptoms && (
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                    <p className="text-foreground">
                      {symptoms.type && <span className="capitalize">{symptoms.type}</span>}
                      {symptoms.location && <span className="text-muted-foreground"> · {symptoms.location}</span>}
                      {symptoms.intensity && <span className="text-muted-foreground"> · {symptoms.intensity} intensity</span>}
                    </p>
                  </div>
                )}
                {respiratory.map((r: string) => (
                  <div key={r} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#818CF8] mt-1.5 shrink-0" />
                    <p className="text-foreground capitalize">{r}</p>
                  </div>
                ))}
                {hasFever && (
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <p className="text-foreground">
                      Fever reported{tempValue ? ` · ${tempValue}°C` : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sleep & Mood breakdown */}
          {entry?.sleep && (
            <div className="bg-muted/50 rounded-2xl p-4">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Moon className="w-5 h-5 text-[#818CF8]" />
                Sleep Detail
              </h3>
              <div className="flex gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Hours</p>
                  <p className="font-bold text-foreground">{entry.sleep.hours ?? '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Quality</p>
                  <p className="font-bold text-foreground capitalize">{entry.sleep.quality ?? '—'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Appetite & Digestion */}
          {entry?.appetite && (
            <div className="bg-muted/50 rounded-2xl p-4">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-[#F97316]" />
                Appetite & Digestion
              </h3>
              <div className="flex gap-4 text-sm">
                {entry.appetite.appetite && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Appetite</p>
                    <p className="font-bold text-foreground capitalize">{entry.appetite.appetite}</p>
                  </div>
                )}
                {entry.appetite.digestion && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Digestion</p>
                    <p className="font-bold text-foreground capitalize">{entry.appetite.digestion}</p>
                  </div>
                )}
                {entry.appetite.bowel && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Bowel</p>
                    <p className="font-bold text-foreground capitalize">{entry.appetite.bowel}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Energy trend (last 7 days) */}
          {energyTrend.length > 1 && (
            <div className="bg-muted/50 rounded-2xl p-4">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-[#84CC16]" />
                7-Day Energy Trend
              </h3>
              <div className="flex items-end gap-2 h-16">
                {energyTrend.map((d, i) => {
                  const heightPct = ((d.energy / 5) * 100).toFixed(0);
                  const isLast = i === energyTrend.length - 1;
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end justify-center" style={{ height: '48px' }}>
                        <div
                          style={{
                            height: `${heightPct}%`,
                            background: isLast ? '#84CC16' : '#84CC1660',
                            minHeight: '4px',
                          }}
                          className="w-full rounded-t-lg transition-all"
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{d.energy}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-right">Latest →</p>
            </div>
          )}

          {/* Risk factors from profile */}
          {(conditions.length > 0 || familyHistory.length > 0) && (
            <div className="bg-yellow-500/10 rounded-2xl p-4 border border-yellow-500/20">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Health Profile Context
              </h3>
              <div className="space-y-2 text-sm">
                {conditions.filter((c) => c !== 'None').map((c) => (
                  <div key={c} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                    <p className="text-foreground">{c} <span className="text-muted-foreground">— existing condition</span></p>
                  </div>
                ))}
                {familyHistory.filter((f) => f !== 'None').map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/60 mt-1.5 shrink-0" />
                    <p className="text-foreground">{f} <span className="text-muted-foreground">— family history</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mood detail */}
          {entry && (
            <div className="bg-muted/50 rounded-2xl p-4">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#818CF8]" />
                Mood & Mental Wellbeing
              </h3>
              <div className="flex items-center gap-3">
                <div className="text-3xl">
                  {entry.mood >= 4 ? '😊' : entry.mood >= 3 ? '😐' : entry.mood >= 2 ? '😔' : '😞'}
                </div>
                <div>
                  <p className="font-bold text-foreground">{entry.mood ?? '—'}/5</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.mood >= 4 ? 'Good mood today' : entry.mood >= 3 ? 'Neutral' : entry.mood >= 2 ? 'Below average' : 'Low mood'}
                  </p>
                </div>
              </div>
              {entry.openFlag && (
                <div className="mt-3 p-3 bg-background rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Open note</p>
                  <p className="text-sm text-foreground italic">&quot;{entry.openFlag}&quot;</p>
                </div>
              )}
            </div>
          )}

          {/* Final recommendation */}
          {ai?.recommendation && (
            <div className={`rounded-2xl p-4 border-2 ${concernStyle.border} ${concernStyle.bg}`}>
              <h3 className={`font-bold uppercase text-sm mb-3 ${concernStyle.text}`}>
                Recommendation
              </h3>
              <p className="text-sm text-foreground leading-relaxed">{ai.recommendation}</p>
              {ai.concernLevel && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Urgency:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${concernStyle.bg} ${concernStyle.text}`}>
                    {ai.concernLevel}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="h-4" />
        </div>
      </motion.div>
    </>
  );
}
