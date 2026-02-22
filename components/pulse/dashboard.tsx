'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Zap, MapPin, User } from 'lucide-react';
import { useMutation, useAction, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { HomeView } from './views/home-view';
import { CheckInView } from './views/check-in-view';
import { ClinicsView } from './views/clinics-view';
import { ProfileView } from './views/profile-view';
import { ChatBox } from './chat-box';
import { AnalysisModal, generateInsight } from './analysis-modal';
import { getWeatherContext, weatherSummary } from '@/lib/weather';

type ViewType = 'home' | 'checkin' | 'clinics' | 'profile';

const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

export function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Analysis modal state
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [analysisOverview, setAnalysisOverview] = useState<string | null>(null);

  // Convex: read today's entry (reactive — updates when DB changes)
  const todayEntry = useQuery(api.healthEntries.getToday, { date: TODAY }) ?? null;

  // Convex: mutations & actions
  const saveEntry = useMutation(api.healthEntries.save);
  const runAiAnalysis = useAction(api.ai.generateDailyAnalysis);

  const handleCheckInComplete = async (data: Record<string, any>) => {
    // Open analysis modal immediately (it will show a loading state)
    setAnalysisOpen(true);

    // Fetch weather + save entry to Convex in parallel
    const [weather, entryId] = await Promise.all([
      getWeatherContext(),
      saveEntry({
        date: TODAY,
        energy: data.energy,
        sleep: data.sleep,
        symptoms: data.symptoms,
        respiratory: data.respiratory,
        temperature: data.temperature,
        mood: data.mood,
        appetite: data.appetite,
        lifestyle: data.lifestyle,
        openFlag: data.openFlag,
        weatherContext: weatherSummary(await getWeatherContext()) ?? undefined,
      }),
    ]);

    // Generate client-side insight immediately (fast feedback)
    const overview = generateInsight(data, weatherSummary(weather));
    setAnalysisOverview(overview);

    // Kick off server-side Gemini analysis in the background (will update DB)
    if (entryId) {
      runAiAnalysis({
        entryId: entryId as any,
        weatherContext: weatherSummary(weather) ?? undefined,
      }).catch(console.error);
    }
  };

  const handleAnalysisDismiss = () => {
    setAnalysisOpen(false);
    setActiveView('home');
  };

  const nav = [
    { id: 'home' as ViewType, label: 'Home', icon: Home },
    { id: 'checkin' as ViewType, label: 'Check-in', icon: Zap },
    { id: 'clinics' as ViewType, label: 'Clinics', icon: MapPin },
    { id: 'profile' as ViewType, label: 'Profile', icon: User },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomeView
            onChatOpen={() => setIsChatOpen(true)}
            onStartCheckIn={() => setActiveView('checkin')}
            todayEntry={todayEntry}
          />
        );
      case 'checkin':
        // Prevent double-entry — show home if already checked in today
        if (todayEntry !== null) {
          return (
            <HomeView
              onChatOpen={() => setIsChatOpen(true)}
              onStartCheckIn={() => {}}
              todayEntry={todayEntry}
            />
          );
        }
        return <CheckInView onComplete={handleCheckInComplete} />;
      case 'clinics':
        return <ClinicsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return (
          <HomeView
            onChatOpen={() => setIsChatOpen(true)}
            onStartCheckIn={() => setActiveView('checkin')}
            todayEntry={todayEntry}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="h-full overflow-y-auto pb-20"
        >
          {renderView()}
        </motion.div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-30">
        <div className="flex justify-around max-w-lg mx-auto">
          {nav.map(({ id, label, icon: Icon }) => {
            const isActive = activeView === id;
            return (
              <motion.button
                key={id}
                onClick={() => setActiveView(id)}
                whileTap={{ scale: 0.93 }}
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 relative transition-colors ${
                  isActive ? 'text-[#84CC16]' : 'text-muted-foreground'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute top-0 left-0 right-0 h-0.5 bg-[#84CC16] rounded-b-full"
                  />
                )}
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Chat box */}
      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Analysis modal — shown after check-in complete.
          overview prefers the live Gemini result (written by background action);
          falls back to client-side quick insight while Gemini is still running. */}
      <AnalysisModal
        isOpen={analysisOpen}
        overview={(todayEntry as any)?.aiAnalysis?.overview ?? analysisOverview}
        onDismiss={handleAnalysisDismiss}
        onBookClinic={() => {
          setAnalysisOpen(false);
          setActiveView('clinics');
        }}
      />
    </div>
  );
}
