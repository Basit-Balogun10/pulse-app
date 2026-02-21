'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, BarChart3, Zap, MapPin, Menu } from 'lucide-react';
import { HomeView } from './views/home-view';
import { CheckInView } from './views/check-in-view';
import { HistoryView } from './views/history-view';
import { AnalysisView } from './views/analysis-view';
import { ClinicsView } from './views/clinics-view';

type ViewType = 'home' | 'checkin' | 'history' | 'analysis' | 'clinics';

export function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'checkin', label: 'Check-in', icon: Zap },
    { id: 'history', label: 'History', icon: BarChart3 },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'clinics', label: 'Clinics', icon: MapPin },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'checkin':
        return <CheckInView />;
      case 'history':
        return <HistoryView />;
      case 'analysis':
        return <AnalysisView />;
      case 'clinics':
        return <ClinicsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderView()}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveView(item.id as ViewType)}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 relative transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-b-full"
                  />
                )}
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
