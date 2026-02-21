'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 3000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: duration / 1000 - 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Subtle glow behind logo */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-48 h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle, #84CC1640 0%, transparent 70%)',
          filter: 'blur(24px)',
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.1 }}
        className="relative mb-8 z-10"
      >
        {/* Pill icon — diagonal two-tone like the day carousel */}
        <div
          className="w-24 h-14 rounded-full shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #84CC16 50%, #F97316 50%)',
          }}
        />
        {/* Pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid #84CC16' }}
        />
      </motion.div>

      {/* App name */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-5xl font-bold mb-1 z-10"
        style={{ color: '#ffffff', letterSpacing: '-0.02em' }}
      >
        Pulse
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-base z-10 font-light"
        style={{ color: '#9ca3af' }}
      >
        Your quiet health companion
      </motion.p>

      {/* Loading dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-14 flex gap-2.5 z-10"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#84CC16' }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
