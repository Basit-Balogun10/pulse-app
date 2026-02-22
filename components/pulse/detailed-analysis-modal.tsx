'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, TrendingDown, Moon, Activity, UtensilsCrossed, Thermometer, Heart, Calendar, AlertTriangle, ChevronDown } from 'lucide-react';
import { amaraDay15DetailedAnalysis, amaraProfile } from '@/lib/amara-story-data';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DetailedAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DetailedAnalysisModal({ isOpen, onClose }: DetailedAnalysisModalProps) {
  const [openSections, setOpenSections] = useState<string[]>(['summary', 'energy', 'sleep']);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  if (!isOpen) return null;

  const analysis = amaraDay15DetailedAnalysis;

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
            <p className="text-sm text-muted-foreground">14-day pattern assessment</p>
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
          {/* Pattern Detection Summary */}
          <div className="bg-gradient-to-br from-[#818CF8]/10 to-[#A855F7]/10 rounded-2xl p-4 border border-[#818CF8]/20">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#818CF8]" />
              Pattern Detection Summary
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="text-sm font-semibold text-foreground">{analysis.patternDetectionSummary.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Escalation noted:</span>
                <span className="text-sm font-semibold text-orange-500">{analysis.patternDetectionSummary.escalationNoted}</span>
              </div>
              <div className="mt-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Concerning Metrics:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {analysis.patternDetectionSummary.concerningMetrics.map((metric) => (
                    <span key={metric} className="px-2 py-1 bg-orange-500/10 text-orange-500 text-xs font-semibold rounded-full">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Energy Decline */}
          <Collapsible open={openSections.includes('energy')} onOpenChange={() => toggleSection('energy')}>
            <CollapsibleTrigger className="w-full bg-muted/50 rounded-2xl p-4 flex items-center justify-between hover:bg-muted/70 transition-colors">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-[#F97316]" />
                Energy Decline
              </h3>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openSections.includes('energy') ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-muted/50 rounded-b-2xl px-4 pb-4">
              <div className="space-y-2 text-sm mt-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days 1-3:</span>
                <span className="font-semibold text-foreground">Average {analysis.energyDecline.days1to3.average}/5 ({analysis.energyDecline.days1to3.status})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days 4-7:</span>
                <span className="font-semibold text-orange-500">Average {analysis.energyDecline.days4to7.average}/5 ({analysis.energyDecline.days4to7.status})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days 8-14:</span>
                <span className="font-semibold text-red-500">Average {analysis.energyDecline.days8to14.average}/5 ({analysis.energyDecline.days8to14.status})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Day 15 (Today):</span>
                <span className="font-semibold text-red-500">{analysis.energyDecline.day15.value}/5 ({analysis.energyDecline.day15.status})</span>
              </div>
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-xs text-foreground"><strong>Assessment:</strong> {analysis.energyDecline.assessment}</p>
              </div>
            </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Sleep Disruption */}
          <Collapsible open={openSections.includes('sleep')} onOpenChange={() => toggleSection('sleep')}>
            <CollapsibleTrigger className="w-full bg-muted/50 rounded-2xl p-4 flex items-center justify-between hover:bg-muted/70 transition-colors">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Moon className="w-5 h-5 text-[#818CF8]" />
                Sleep Disruption
              </h3>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openSections.includes('sleep') ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-muted/50 rounded-b-2xl px-4 pb-4">
              <div className="space-y-2 text-sm mt-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days 1-3:</span>
                <span className="font-semibold text-foreground">{analysis.sleepDisruption.days1to3.range} ({analysis.sleepDisruption.days1to3.quality})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days 4-7:</span>
                <span className="font-semibold text-orange-500">{analysis.sleepDisruption.days4to7.range} ({analysis.sleepDisruption.days4to7.quality})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days 8-11:</span>
                <span className="font-semibold text-red-500">{analysis.sleepDisruption.days8to11.range} ({analysis.sleepDisruption.days8to11.quality})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days 12-15:</span>
                <span className="font-semibold text-red-600">{analysis.sleepDisruption.days12to15.range} ({analysis.sleepDisruption.days12to15.quality})</span>
              </div>
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1"><strong>Referenced entries:</strong></p>
                <div className="flex flex-wrap gap-1">
                  {analysis.sleepDisruption.referencedEntries.map((day) => (
                    <span key={day} className="px-2 py-0.5 bg-[#818CF8]/10 text-[#818CF8] text-xs rounded-full">{day}</span>
                  ))}
                </div>
              </div>
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-xs text-foreground"><strong>Assessment:</strong> {analysis.sleepDisruption.assessment}</p>
              </div>
            </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Physical Symptoms - Lower Abdomen */}
          <div className="bg-muted/50 rounded-2xl p-4">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#F97316]" />
              Physical Symptoms — Lower Abdomen
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">First appearance:</span>
                <span className="font-semibold text-foreground">Day {analysis.physicalSymptoms.lowerAbdomen.firstAppearance.day} ({analysis.physicalSymptoms.lowerAbdomen.firstAppearance.intensity} {analysis.physicalSymptoms.lowerAbdomen.firstAppearance.description})</span>
              </div>
              <div className="mt-2">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Recurrences:</p>
                {analysis.physicalSymptoms.lowerAbdomen.recurrences.map((rec) => (
                  <div key={rec.day} className="flex items-start gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                    <span className="text-xs text-foreground">Day {rec.day}: {rec.intensity} — {rec.note}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <p className="text-xs font-semibold text-orange-500 mb-1">Pattern:</p>
                <p className="text-xs text-foreground">{analysis.physicalSymptoms.lowerAbdomen.pattern}</p>
              </div>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="text-xs text-foreground"><strong>Assessment:</strong> {analysis.physicalSymptoms.lowerAbdomen.assessment}</p>
              </div>
            </div>
          </div>

          {/* Appetite & Nutrition */}
          <div className="bg-muted/50 rounded-2xl p-4">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-[#F97316]" />
              Appetite & Nutrition
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days 1-7:</span>
                <span className="font-semibold text-foreground">{analysis.appetiteAndNutrition.days1to7.status}, {analysis.appetiteAndNutrition.days1to7.meals}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days 8-11:</span>
                <span className="font-semibold text-orange-500">{analysis.appetiteAndNutrition.days8to11.status}, {analysis.appetiteAndNutrition.days8to11.meals}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days 12-14:</span>
                <span className="font-semibold text-red-500">{analysis.appetiteAndNutrition.days12to14.status}, {analysis.appetiteAndNutrition.days12to14.meals}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Day 15:</span>
                <span className="font-semibold text-red-600">{analysis.appetiteAndNutrition.day15.status}, {analysis.appetiteAndNutrition.day15.meals}</span>
              </div>
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-xs text-foreground"><strong>Assessment:</strong> {analysis.appetiteAndNutrition.assessment}</p>
              </div>
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-muted/50 rounded-2xl p-4">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-[#EF4444]" />
              Temperature
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days 1-14:</span>
                <span className="font-semibold text-foreground">{analysis.temperature.days1to14.status} ({analysis.temperature.days1to14.value})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Day 15:</span>
                <span className="font-semibold text-red-500">{analysis.temperature.day15.status} ({analysis.temperature.day15.value})</span>
              </div>
              <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-xs text-red-500"><strong>NEW SYMPTOM:</strong> Fever emerged on Day 15</p>
              </div>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="text-xs text-foreground"><strong>Assessment:</strong> {analysis.temperature.assessment}</p>
              </div>
            </div>
          </div>

          {/* Mood & Mental Health */}
          <div className="bg-muted/50 rounded-2xl p-4">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#818CF8]" />
              Mood & Mental Health
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days 1-3:</span>
                <span className="font-semibold text-foreground">{analysis.moodAndMentalHealth.days1to3.status}, {analysis.moodAndMentalHealth.days1to3.social}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days 4-7:</span>
                <span className="font-semibold text-orange-500">{analysis.moodAndMentalHealth.days4to7.status}, {analysis.moodAndMentalHealth.days4to7.social}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days 8-14:</span>
                <span className="font-semibold text-red-500">{analysis.moodAndMentalHealth.days8to14.status}, {analysis.moodAndMentalHealth.days8to14.social}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Day 15:</span>
                <span className="font-semibold text-red-600">{analysis.moodAndMentalHealth.day15.status}, {analysis.moodAndMentalHealth.day15.social}</span>
              </div>
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-xs text-foreground"><strong>Assessment:</strong> {analysis.moodAndMentalHealth.assessment}</p>
              </div>
            </div>
          </div>

          {/* Risk Factors from Health Profile */}
          <div className="bg-yellow-500/10 rounded-2xl p-4 border border-yellow-500/20">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Risk Factors from Health Profile
            </h3>
            <div className="space-y-2">
              {analysis.riskFactorsFromProfile.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{risk.factor}</p>
                    <p className="text-xs text-muted-foreground">{risk.relevance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-red-500/10 rounded-2xl p-4 border-2 border-red-500/30">
            <h3 className="font-bold text-red-500 mb-3 uppercase text-sm">Final Recommendation</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Urgency:</span>
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">{analysis.recommendation.urgency}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{analysis.recommendation.reasoning}</p>
              <div className="mt-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Possible Areas for Investigation:</p>
                <div className="space-y-1">
                  {analysis.recommendation.possibleAreas.map((area, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                      <p className="text-xs text-foreground">{area}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Suggested Clinic Specialties:</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.recommendation.suggestedSpecialties.map((specialty) => (
                    <span key={specialty} className="px-3 py-1 bg-[#818CF8]/10 text-[#818CF8] text-xs font-semibold rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
