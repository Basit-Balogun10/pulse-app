'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { CheckInEntry } from '@/lib/amara-story-data';
import { AnalyticsView } from './views/analytics-view';

interface DetailedMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: CheckInEntry | null;
  fullHistory?: CheckInEntry[];
}

export function DetailedMetricsModal({ isOpen, onClose, entry, fullHistory = [] }: DetailedMetricsModalProps) {
  const [activeTab, setActiveTab] = useState<'metrics' | 'analytics'>('metrics');

  if (!entry) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background px-4 pt-6 pb-3 border-b border-border rounded-t-3xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Health Metrics</h2>
                  <p className="text-sm text-muted-foreground">Complete check-in data for {entry.date}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>

              {/* Pill Tabs */}
              <div className="flex gap-2 bg-muted p-1 rounded-2xl">
                <button
                  onClick={() => setActiveTab('metrics')}
                  className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'metrics'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Complete Metrics
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Analytics & Trends
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {activeTab === 'metrics' ? (
                <MetricsCards entry={entry} />
              ) : (
                <AnalyticsView />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MetricsCards({ entry }: { entry: CheckInEntry }) {
  return (
    <div className="space-y-4 pb-4">
      {/* Summary Overview Card (moved from home view) */}
      <div className="bg-gradient-to-br from-[#84CC16]/10 to-[#A855F7]/10 rounded-3xl p-5 border border-[#84CC16]/20">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Check-in Summary
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Energy', value: `${entry.energy || 0}/5`, emoji: '⚡' },
            { label: 'Sleep', value: `${entry.sleep?.hours || 0}h`, emoji: '🌙' },
            { label: 'Mood', value: entry.mood || '—', emoji: '😊' },
            { label: 'Appetite', value: entry.appetite || '—', emoji: '🍽️' },
          ].map(({ label, value, emoji }) => (
            <div key={label} className="bg-background/60 rounded-2xl p-3 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground mb-1">{emoji} {label}</p>
              <p className="text-lg font-bold text-foreground capitalize">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sleep Card */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌙</span>
            <div>
              <p className="font-bold text-foreground">Sleep</p>
              <p className="text-xs text-muted-foreground">Quality: {entry.sleep?.quality || '—'}</p>
            </div>
          </div>
          <p className="text-lg font-bold text-foreground">{entry.sleep?.hours || 0} hours</p>
        </div>
      </div>

      {/* Symptoms Card */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🩺</span>
          <p className="font-bold text-foreground">Physical Symptoms</p>
        </div>
        {entry.symptoms && entry.symptoms.length > 0 ? (
          <div className="space-y-2">
            {entry.symptoms.map((symptom, idx) => (
              <div key={idx} className="bg-muted rounded-xl p-3">
                <p className="text-sm font-semibold text-foreground capitalize">{symptom.location}</p>
                <p className="text-xs text-muted-foreground">
                  {symptom.type} · <span className={`font-semibold ${
                    symptom.intensity === 'severe' ? 'text-red-500' :
                    symptom.intensity === 'moderate' ? 'text-orange-500' : 'text-yellow-500'
                  }`}>{symptom.intensity}</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No symptoms reported</p>
        )}
      </div>

      {/* Respiratory */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🫁</span>
            <p className="font-bold text-foreground">Respiratory</p>
          </div>
          <p className="text-lg font-bold text-foreground capitalize">
            {entry.respiratory ? 'Issues present' : 'Normal'}
          </p>
        </div>
      </div>

      {/* Temperature */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌡️</span>
            <div>
              <p className="font-bold text-foreground">Body Temperature</p>
              {entry.temperature?.hasFever && (
                <p className="text-xs text-muted-foreground">Fever detected</p>
              )}
            </div>
          </div>
          <p className="text-lg font-bold text-foreground">
            {entry.temperature?.hasFever && entry.temperature?.value 
              ? `${entry.temperature.value}°C` 
              : 'Normal'}
          </p>
        </div>
      </div>

      {/* Lifestyle */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🏃</span>
          <p className="font-bold text-foreground">Lifestyle</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <LifestyleItem label="Hydration" value={entry.lifestyle?.water || false} icon="💧" />
          <LifestyleItem label="Exercise" value={entry.lifestyle?.exercise || false} icon="🏃" />
          <LifestyleItem label="Meditation" value={entry.lifestyle?.meditation || false} icon="🧘" />
          <LifestyleItem label="Screen Time" value={entry.lifestyle?.screenTime === 'normal'} icon="📱" />
          <LifestyleItem label="Social" value={entry.lifestyle?.social !== 'isolated'} icon="👥" />
        </div>
        {entry.lifestyle?.customNote && (
          <div className="mt-3 p-2 bg-muted rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Note</p>
            <p className="text-sm text-foreground">{entry.lifestyle.customNote}</p>
          </div>
        )}
      </div>

      {/* Open Flag */}
      {entry.openFlag && (
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📝</span>
            <p className="font-bold text-foreground">Additional Notes</p>
          </div>
          <p className="text-sm text-foreground">{entry.openFlag}</p>
        </div>
      )}

      {/* AI Analysis */}
      <div className="bg-gradient-to-br from-[#818CF8]/10 to-[#A855F7]/10 rounded-2xl p-4 border border-[#818CF8]/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🤖</span>
          <p className="font-bold text-foreground">AI Analysis</p>
        </div>
        <p className="text-sm text-foreground/80 mb-3">{entry.aiAnalysis?.summary || 'No analysis available'}</p>
        {entry.aiAnalysis?.patterns_detected && entry.aiAnalysis.patterns_detected.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Patterns Detected</p>
            <div className="space-y-1">
              {entry.aiAnalysis.patterns_detected.map((pattern, idx) => (
                <p key={idx} className="text-sm text-foreground/70">• {pattern}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LifestyleItem({ label, value, icon }: { label: string; value: boolean; icon: string }) {
  return (
    <div className="bg-muted rounded-xl p-2">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm">{icon}</span>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className={`text-xs font-semibold ${value ? 'text-green-600' : 'text-muted-foreground'}`}>
        {value ? '✓ Yes' : '✗ No'}
      </p>
    </div>
  );
}
