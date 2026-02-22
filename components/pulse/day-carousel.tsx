'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { amaraFullStory } from '@/lib/amara-story-data';

interface DayCarouselProps {
  onDaySelect: (date: string) => void;
  selectedDate: string;
  missedDays?: string[];
}

// Today is February 22, 2026
const TODAY_STR = '2026-02-22';

export function DayCarousel({ onDaySelect, selectedDate, missedDays = [] }: DayCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState<Array<{ date: string; label: string }>>([]);

  useEffect(() => {
    // Show last 6 days from Amara's story
    const daysList = [];
    const totalDays = amaraFullStory.length;
    const startIdx = Math.max(0, totalDays - 6); // Last 6 days
    
    for (let i = startIdx; i < totalDays; i++) {
      const entry = amaraFullStory[i];
      const date = new Date(entry.date);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      daysList.push({ date: entry.date, label: `${day}/${month}` });
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

  const handleDateJump = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    onDaySelect(dateStr);
  };

  return (
    <div className="flex items-center gap-2 px-4 pb-1">
      {/* Date Jump Button */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="shrink-0 h-10 w-10 p-0 rounded-xl border-2 border-border hover:bg-muted/50"
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4">
            <input
              type="date"
              max={TODAY_STR}
              onChange={(e) => handleDateJump(new Date(e.target.value))}
              className="px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Scrollable days */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 pb-1 overflow-x-auto scroll-smooth scrollbar-hide flex-1"
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
              className={`shrink-0 flex flex-col items-center gap-1.5 py-2.5 px-3.5 rounded-xl transition-all ${
                isSelected ? 'bg-primary/10 ring-2 ring-primary/40' : 'hover:bg-muted/50'
              } ${today ? 'ring-2 ring-[#84CC16]/30' : ''}`}
            >
              {/* Diagonal capsule pill */}
              <div className="w-9 h-9 flex items-center justify-center relative overflow-visible">
                <div
                  style={{
                    width: '36px',
                    height: '14px',
                    borderRadius: '9999px',
                    background: `linear-gradient(90deg, ${colors.top} 50%, ${colors.bottom} 50%)`,
                    transform: 'rotate(45deg)',
                    opacity: missed ? 0.3 : 1,
                    boxShadow: today ? `0 0 10px ${colors.top}70` : undefined,
                    filter: missed ? 'grayscale(0.6)' : undefined,
                  }}
                />
              </div>

              {/* Label */}
              <span
                className={`text-xs font-semibold leading-none ${
                  today ? 'text-[#84CC16]' : missed ? 'text-muted-foreground/50' : 'text-muted-foreground'
                }`}
              >
                {today ? 'Today' : day.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
