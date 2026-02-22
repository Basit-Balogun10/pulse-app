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
  const [openSections, setOpenSections] = useState<string[]>(['summary']);

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
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {/* Pattern Detection Summary */}
          <Collapsible open={openSections.includes('summary')} onOpenChange={() => toggleSection('summary')}>
            <CollapsibleTrigger className="w-full bg-card rounded-2xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#84CC16]" />
                Pattern Detection Summary
              </h3>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openSections.includes('summary') ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-card border-x border-b border-border rounded-b-2xl px-4 pb-4">
              <div className="space-y-2 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration:</span>
                  <span className="text-sm font-semibold text-foreground">{analysis.patternDetectionSummary.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Escalation:</span>
                  <span className="text-sm font-semibold text-[#F97316]">{analysis.patternDetectionSummary.escalationNoted}</span>
                </div>
                <div className="mt-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Concerning Metrics</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.patternDetectionSummary.concerningMetrics.map((metric) => (
                      <span key={metric} className="px-2.5 py-1 bg-[#F97316]/10 text-[#F97316] text-xs font-medium rounded-full border border-[#F97316]/20">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Energy Decline */}
          <Collapsible open={openSections.includes('energy')} onOpenChange={() => toggleSection('energy')}>
            <CollapsibleTrigger className="w-full bg-card rounded-2xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-[#84CC16]" />
                Energy Decline
              </h3>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openSections.includes('energy') ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-card border-x border-b border-border rounded-b-2xl px-4 pb-4">
              <div className="space-y-2 text-sm mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Days 1-3:</span>
                  <span className="font-semibold text-foreground">{analysis.energyDecline.days1to3.average}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Days 4-7:</span>
                  <span className="font-semibold text-[#F97316]">{analysis.energyDecline.days4to7.average}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Days 8-14:</span>
                  <span className="font-semibold text-[#F97316]">{analysis.energyDecline.days8to14.average}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Today:</span>
                  <span className="font-semibold text-[#F97316]">{analysis.energyDecline.day15.value}/5</span>
                </div>
                <div className="mt-3 p-3 bg-muted rounded-xl">
                  <p className="text-xs text-foreground">{analysis.energyDecline.assessment}</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Sleep Disruption */}
          <Collapsible open={openSections.includes('sleep')} onOpenChange={() => toggleSection('sleep')}>
            <CollapsibleTrigger className="w-full bg-card rounded-2xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Moon className="w-5 h-5 text-[#84CC16]" />
                Sleep Pattern
              </h3>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openSections.includes('sleep') ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-card border-x border-b border-border rounded-b-2xl px-4 pb-4">
              <div className="space-y-2 text-sm mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Days 1-3:</span>
                  <span className="font-semibold text-foreground">{analysis.sleepDisruption.days1to3.range}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Days 4-7:</span>
                  <span className="font-semibold text-[#F97316]">{analysis.sleepDisruption.days4to7.range}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Days 8-11:</span>
                  <span className="font-semibold text-[#F97316]">{analysis.sleepDisruption.days8to11.range}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Days 12-15:</span>
                  <span className="font-semibold text-[#F97316]">{analysis.sleepDisruption.days12to15.range}</span>
                </div>
                <div className="mt-3 p-3 bg-muted rounded-xl">
                  <p className="text-xs text-foreground">{analysis.sleepDisruption.assessment}</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Physical Symptoms */}
          <Collapsible open={openSections.includes('symptoms')} onOpenChange={() => toggleSection('symptoms')}>
            <CollapsibleTrigger className="w-full bg-card rounded-2xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#84CC16]" />
                Physical Symptoms
              </h3>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openSections.includes('symptoms') ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-card border-x border-b border-border rounded-b-2xl px-4 pb-4">
              <div className="space-y-2 text-sm mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">First noted:</span>
                  <span className="font-semibold text-foreground">Day {analysis.physicalSymptoms.lowerAbdomen.firstAppearance.day}</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">Pattern</p>
                  <p className="text-xs text-foreground bg-muted p-2.5 rounded-lg">{analysis.physicalSymptoms.lowerAbdomen.pattern}</p>
                </div>
                <div className="mt-3 p-3 bg-muted rounded-xl">
                  <p className="text-xs text-foreground">{analysis.physicalSymptoms.lowerAbdomen.assessment}</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Appetite & Temperature */}
          <Collapsible open={openSections.includes('appetite')} onOpenChange={() => toggleSection('appetite')}>
            <CollapsibleTrigger className="w-full bg-card rounded-2xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-[#84CC16]" />
                Appetite & Temperature
              </h3>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openSections.includes('appetite') ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-card border-x border-b border-border rounded-b-2xl px-4 pb-4">
              <div className="space-y-3 text-sm mt-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Appetite Decline</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">Early days:</span>
                      <span className="font-medium text-foreground text-xs">{analysis.appetiteAndNutrition.days1to7.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">Recent:</span>
                      <span className="font-medium text-[#F97316] text-xs">{analysis.appetiteAndNutrition.day15.status}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Temperature</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">Days 1-14:</span>
                      <span className="font-medium text-foreground text-xs">{analysis.temperature.days1to14.value}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">Today:</span>
                      <span className="font-medium text-[#F97316] text-xs">{analysis.temperature.day15.value} (Fever)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Mood & Risk Factors */}
          <Collapsible open={openSections.includes('mood')} onOpenChange={() => toggleSection('mood')}>
            <CollapsibleTrigger className="w-full bg-card rounded-2xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#84CC16]" />
                Mood & Background
              </h3>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openSections.includes('mood') ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-card border-x border-b border-border rounded-b-2xl px-4 pb-4">
              <div className="space-y-3 text-sm mt-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">Mood Trend</p>
                  <p className="text-xs text-foreground bg-muted p-2.5 rounded-lg">{analysis.moodAndMentalHealth.assessment}</p>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Risk Factors</p>
                  <div className="space-y-1.5">
                    {analysis.riskFactorsFromProfile.map((risk, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#F97316] mt-1.5" />
                        <p className="text-xs text-foreground flex-1">{risk.factor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Recommendation */}
          <div className="bg-[#F97316]/10 rounded-2xl p-4 border-2 border-[#F97316]/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-[#F97316]" />
              <h3 className="font-bold text-foreground">Recommendation</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#F97316] text-white text-xs font-bold rounded-full">{analysis.recommendation.urgency}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{analysis.recommendation.reasoning}</p>
              <div className="mt-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Suggested Specialties</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.recommendation.suggestedSpecialties.map((specialty) => (
                    <span key={specialty} className="px-2.5 py-1 bg-[#84CC16]/10 text-[#84CC16] text-xs font-medium rounded-full border border-[#84CC16]/20">
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
