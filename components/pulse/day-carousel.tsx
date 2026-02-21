'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DayCarouselProps {
  onDaySelect: (date: string) => void;
  selectedDate: string;
  missedDays?: string[];
}

const TODAY_STR = '2025-02-23';

export function DayCarousel({ onDaySelect, selectedDate, missedDays = [] }: DayCarouselProps) {
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
    if (isToday(date)) return { top: '#84CC16', bottom: '#F97316' };
    if (isMissed(date)) return { top: '#6b7280', bottom: '#9ca3af' };
    const idx = days.findIndex((d) => d.date === date);
    const pairs = [
      { top: '#14B8A6', bottom: '#84CC16' },
      { top: '#F97316', bottom: '#EC4899' },
      { top: '#A855F7', bottom: '#14B8A6' },
      { top: '#EC4899', bottom: '#F97316' },
      { top: '#84CC16', bottom: '#14B8A6' },
    ];
    return pairs[idx % pairs.length];
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex gap-1.5 px-4 pb-1 overflow-x-auto scroll-smooth scrollbar-hide"
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
            className={`shrink-0 flex flex-col items-center gap-1 py-2 px-2 rounded-xl transition-all ${
              isSelected ? 'bg-primary/10 ring-2 ring-primary/40' : 'hover:bg-muted/50'
            }`}
          >
            {/* Diagonal capsule pill */}
            <div className="w-7 h-7 flex items-center justify-center">
              <div
                style={{
                  width: '30px',
                  height: '11px',
                  borderRadius: '9999px',
                  background: `linear-gradient(90deg, ${colors.top} 50%, ${colors.bottom} 50%)`,
                  transform: 'rotate(45deg)',
                  opacity: missed ? 0.4 : 1,
                  boxShadow: today ? `0 0 8px ${colors.top}60` : undefined,
                }}
              />
            </div>

            {/* Label */}
            <span
              className={`text-xs font-semibold leading-none ${
                today ? 'text-[#84CC16]' : 'text-muted-foreground'
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
