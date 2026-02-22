'use client';

import { useEffect } from 'react';
import { useDemoRunner } from '@/hooks/use-demo-runner';

/**
 * Invisible Demo Runner Component
 * 
 * Initializes the automated demo runner in the background
 * Triggers: URL ?demo=auto or Ctrl+Shift+D
 * 
 * This component is completely invisible and only handles demo automation
 */
export function DemoRunnerProvider() {
  const { isRunning } = useDemoRunner();

  useEffect(() => {
    if (isRunning) {
      console.log('🎬 Demo is now running...');
      console.log('📹 You can start recording your screen');
      console.log('📋 All actions will be logged to console');
    }
  }, [isRunning]);

  // Component renders nothing - completely invisible
  return null;
}
