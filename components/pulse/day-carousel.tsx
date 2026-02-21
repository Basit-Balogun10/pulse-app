'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DayCarouselProps {
  onDaySelect: (date: string) => void;
  selectedDate: string;
  missedDays?: string[];
}

export function DayCarousel({
  onDaySelect,
  selectedDate,
  missedDays = [],
}: DayCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState<Array<{ date: string; label: string }>>([]);

  useEffect(() => {
    // Generate last 14 days + today
    const daysList = [];
    const today = new Date('2025-02-23'); // Using fixed date for consistency

    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const day = date.getDate();
      const month = date.getMonth() + 1;

      daysList.push({
        date: dateStr,
        label: `${day}/${month}`,
      });
    }

    setDays(daysList);

    // Scroll to today
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const scrollWidth = scrollContainerRef.current.scrollWidth;
        scrollContainerRef.current.scrollLeft = scrollWidth;
      }
    }, 100);
  }, []);

  const isMissed = (date: string) => missedDays.includes(date);
  const isToday = (date: string) => {
    const today = new Date('2025-02-23').toISOString().split('T')[0];
    return date === today;
  };

  const getPillColors = (date: string) => {
    if (isMissed(date)) {
      return {
        top: '#d1d5db',
        bottom: '#9ca3af',
      };
    }

    const dayIndex = days.findIndex((d) => d.date === date);
    const colors = [
      { top: '#84CC16', bottom: '#F97316' }, // Lime & Orange
      { top: '#14B8A6', bottom: '#84CC16' }, // Teal & Lime
      { top: '#F97316', bottom: '#EC4899' }, // Orange & Pink
      { top: '#A855F7', bottom: '#14B8A6' }, // Purple & Teal
      { top: '#EC4899', bottom: '#F97316' }, // Pink & Orange
    ];

    return colors[dayIndex % colors.length];
  };

  return (
    <div className="w-full">
      <div className="text-sm font-semibold text-foreground px-6 mb-3">
        Your Progress
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 px-6 pb-4 overflow-x-auto scroll-smooth scrollbar-hide"
      >
        <AnimatePresence mode="wait">
          {days.map((day, index) => {
            const colors = getPillColors(day.date);
            const isSelected = day.date === selectedDate;
            const missed = isMissed(day.date);
            const today = isToday(day.date);

            return (
              <motion.button
                key={day.date}
                onClick={() => onDaySelect(day.date)}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'hover:bg-muted/50'
                }`}
              >
                {/* Pill Icon */}
                <div
                  className="w-12 h-8 rounded-full relative overflow-hidden shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${colors.top} 50%, ${colors.bottom} 50%)`,
                    opacity: missed ? 0.5 : 1,
                  }}
                />

                {/* Date Label */}
                <span className="text-xs font-bold text-foreground">
                  {day.label}
                </span>

                {/* Indicator Badges */}
                {today && (
                  <span className="text-xs bg-primary text-white px-2 py-1 rounded-full font-semibold">
                    Today
                  </span>
                )}

                {missed && (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full font-semibold">
                    Missed
                  </span>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Custom Scrollbar Hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
