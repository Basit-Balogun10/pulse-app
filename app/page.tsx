'use client';

import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/pulse/splash-screen';
import { Dashboard } from '@/components/pulse/dashboard';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  return (
    <main className="min-h-screen bg-background">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && <Dashboard />}
    </main>
  );
}
