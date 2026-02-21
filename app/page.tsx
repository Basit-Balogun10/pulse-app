'use client';

import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/pulse/splash-screen';
import { Dashboard } from '@/components/pulse/dashboard';
import { OnboardingModal } from '@/components/pulse/onboarding-modal';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    const isOnboarded = localStorage.getItem('pulseUserOnboarded');

    if (hasSeenSplash) {
      setShowSplash(false);
    }

    if (!isOnboarded) {
      setShowOnboarding(true);
    } else {
      setIsReady(true);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  const handleOnboardingSave = (data: any) => {
    localStorage.setItem('pulseUserProfile', JSON.stringify(data));
    localStorage.setItem('pulseUserOnboarded', 'true');
    setShowOnboarding(false);
    setIsReady(true);
  };

  return (
    <main className="min-h-screen bg-background">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <OnboardingModal
        isOpen={showOnboarding && !showSplash}
        onClose={() => setShowOnboarding(false)}
        onSave={handleOnboardingSave}
      />
      {isReady && <Dashboard />}
    </main>
  );
}
