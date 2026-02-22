'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Zap, MapPin, User } from 'lucide-react';
import { HomeView } from './views/home-view';
import { CheckInView } from './views/check-in-view';
import { AnalysisView } from './views/analysis-view';
import { ClinicsView } from './views/clinics-view';
import { ProfileView } from './views/profile-view';
import { ChatBox } from './chat-box';
import { AnalysisModal, generateInsight } from './analysis-modal';
import { getWeatherContext, weatherSummary } from '@/lib/weather';

type ViewType = 'home' | 'checkin' | 'analysis' | 'clinics' | 'profile';

export function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Check-in + analysis state
  const [todayEntry, setTodayEntry] = useState<Record<string, any> | null>(null);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleCheckInComplete = async (data: Record<string, any>) => {
    setTodayEntry(data);
    setAnalysisOpen(true);
    setAnalysisLoading(true);

    // Fetch weather in parallel with a small simulated analysis delay
    const [weather] = await Promise.all([
      getWeatherContext(),
      new Promise((r) => setTimeout(r, 2200)),
    ]);

    const insight = generateInsight(data, weatherSummary(weather));
    setAnalysisResult(insight);
    setAnalysisLoading(false);
  };

  const handleAnalysisDismiss = () => {
    setAnalysisOpen(false);
    setActiveView('home');
  };

  const navItems: { id: ViewType; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'checkin', label: 'Check-in', icon: Zap },
    { id: 'analysis', label: 'Analysis', icon: Zap }, // placeholder — replaced below
    { id: 'clinics', label: 'Clinics', icon: MapPin },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Real nav (no history)
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
        // Prevent double-entry - if today's entry is complete, show home view with message
        if (todayEntry !== null) {
          return (
            <HomeView
              onChatOpen={() => setIsChatOpen(true)}
              onStartCheckIn={() => setActiveView('checkin')}
              todayEntry={todayEntry}
            />
          );
        }
        return <CheckInView onComplete={handleCheckInComplete} />;
      case 'analysis':
        return <AnalysisView />;
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
          className={`h-full pb-20 ${activeView === 'checkin' ? 'overflow-hidden' : 'overflow-y-auto'}`}
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

      {/* Analysis modal */}
      <AnalysisModal
        isOpen={analysisOpen}
        isLoading={analysisLoading}
        result={analysisResult}
        onDismiss={handleAnalysisDismiss}
      />
    </div>
  );
}
