'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

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
      className="fixed inset-0 bg-primary flex flex-col items-center justify-center z-50 overflow-hidden"
    >
      {/* Floating background elements */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"
      />

      {/* Logo Animation with Pulse Effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 15,
          delay: 0.2,
        }}
        className="mb-6 relative z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.8,
          }}
          className="absolute inset-0 bg-white/20 rounded-full blur-xl"
        />
        <div className="bg-white rounded-full p-6 shadow-2xl relative">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Heart className="w-16 h-16 text-primary" fill="currentColor" />
          </motion.div>
        </div>
      </motion.div>

      {/* App Name with Typing Effect */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-6xl font-bold text-white mb-2 tracking-tight relative z-10"
      >
        Pulse
      </motion.h1>

      {/* Animated underline */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="h-1 bg-white rounded-full mb-6"
      />

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="text-lg text-white/90 text-center px-8 max-w-sm font-light relative z-10"
      >
        Your quiet health companion
      </motion.p>

      {/* Loading dots animation with improved styling */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="mt-16 flex gap-3 relative z-10"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -12, 0], scale: [1, 1.2, 1] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
            }}
            className="w-3 h-3 bg-white rounded-full shadow-lg"
          />
        ))}
      </motion.div>

      {/* Progress indicator */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '80%' }}
        transition={{
          duration: duration / 1000 - 0.5,
          ease: 'linear',
        }}
        className="absolute bottom-8 left-0 h-1 bg-white/50 rounded-full"
      />
    </motion.div>
  );
}
