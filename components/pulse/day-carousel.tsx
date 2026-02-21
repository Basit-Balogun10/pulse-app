'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DayCarouselProps {
  onDaySelect: (date: string) => void;
  selectedDate: string;
  missedDays?: string[];
}

const TODAY_STR = '2025-02-23';

export function DayCarousel({
  onDaySelect,
  selectedDate,
  missedDays = [],
}: DayCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState<Array<{ date: string; label: string }>>([]);

  useEffect(() => {
    const daysList = [];
    const today = new Date(TODAY_STR);

    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const day = date.getDate();
      const month = date.getMonth() + 1;

      daysList.push({ date: dateStr, label: `${day}/${month}` });
    }

    setDays(daysList);

    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
      }
    }, 100);
  }, []);

  const isMissed = (date: string) => missedDays.includes(date);
  const isToday = (date: string) => date === TODAY_STR;

  const getPillColors = (date: string) => {
    if (isToday(date)) {
      return { top: '#84CC16', bottom: '#F97316' }; // Lime & Orange — distinct today color
    }
    if (isMissed(date)) {
      return { top: '#d1d5db', bottom: '#9ca3af' }; // Gray for missed
    }
    const dayIndex = days.findIndex((d) => d.date === date);
    const pairs = [
      { top: '#14B8A6', bottom: '#84CC16' },
      { top: '#F97316', bottom: '#EC4899' },
      { top: '#A855F7', bottom: '#14B8A6' },
      { top: '#EC4899', bottom: '#F97316' },
      { top: '#84CC16', bottom: '#14B8A6' },
    ];
    return pairs[dayIndex % pairs.length];
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex gap-2 px-4 pb-2 overflow-x-auto scroll-smooth scrollbar-hide"
    >
      {days.map((day) => {
        const colors = getPillColors(day.date);
        const isSelected = day.date === selectedDate;
        const missed = isMissed(day.date);
        const today = isToday(day.date);

        return (
          <motion.button
            key={day.date}
            onClick={() => onDaySelect(day.date)}
            whileTap={{ scale: 0.9 }}
            className={`shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
              isSelected
                ? 'bg-primary/10 ring-2 ring-primary/50'
                : 'hover:bg-muted/50'
            }`}
          >
            {/* Pill Icon — smaller */}
            <div
              className="w-8 h-5 rounded-full shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${colors.top} 50%, ${colors.bottom} 50%)`,
                opacity: missed ? 0.45 : 1,
              }}
            />

            {/* Label — "Today" for today, date for others */}
            <span
              className={`text-xs font-semibold ${
                today ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {today ? 'Today' : day.label}
            </span>
          </motion.button>
        );
      })}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
