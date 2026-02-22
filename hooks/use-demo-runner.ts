'use client';

import { useEffect, useState } from 'react';
import { DemoRunner, initializeDemoRunner, getDemoRunner } from '@/lib/demo-runner';

/**
 * Hook to control the automated demo runner
 * 
 * Triggers:
 * - URL parameter: ?demo=auto
 * - Keyboard shortcut: Ctrl+Shift+D (Windows/Linux) or Cmd+Shift+D (Mac)
 * 
 * The runner is completely invisible and logs to console
 */
export function useDemoRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [runner, setRunner] = useState<DemoRunner | null>(null);

  // Initialize runner
  useEffect(() => {
    const demoRunner = initializeDemoRunner((log) => {
      setLogs(prev => [...prev, log]);
    });
    setRunner(demoRunner);

    // Check URL parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'auto') {
      console.log('🎬 Auto-starting demo from URL parameter');
      startDemo();
    }

    // Keyboard shortcut listener
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Shift+D (Windows/Linux) or Cmd+Shift+D (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        console.log('🎬 Demo triggered by keyboard shortcut');
        startDemo();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const startDemo = async () => {
    const currentRunner = getDemoRunner();
    if (!currentRunner) {
      console.error('Demo runner not initialized');
      return;
    }

    if (isRunning) {
      console.warn('Demo already running');
      return;
    }

    setIsRunning(true);
    setLogs([]);
    
    try {
      await currentRunner.runDemo();
      console.log('✅ Demo completed successfully');
      console.log('📋 View logs in console or download below');
    } catch (error) {
      console.error('❌ Demo failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const downloadLogs = () => {
    const currentRunner = getDemoRunner();
    if (!currentRunner) return;

    const logsText = currentRunner.getLogs().join('\n');
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulse-demo-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    isRunning,
    logs,
    startDemo,
    downloadLogs,
    runner,
  };
}
