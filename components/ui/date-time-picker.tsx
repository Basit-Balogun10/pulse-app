'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showTime?: boolean;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Select date',
  label,
  showTime = false,
  className = '',
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [time, setTime] = useState(value ? value.split('T')[1]?.substring(0, 5) || '12:00' : '12:00');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: Array<{ date: number; isCurrentMonth: boolean; fullDate: Date }> = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, daysInPrevMonth - i),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i),
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (!showTime) {
      const formatted = date.toISOString().split('T')[0];
      onChange(formatted);
      setIsOpen(false);
    }
  };

  const handleTimeConfirm = () => {
    if (selectedDate) {
      const formatted = `${selectedDate.toISOString().split('T')[0]}T${time}`;
      onChange(formatted);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange('');
    setIsOpen(false);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const formatDisplayValue = () => {
    if (!selectedDate) return '';
    const dateStr = selectedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return showTime ? `${dateStr} ${time}` : dateStr;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSameDay = (date1: Date, date2: Date | null) => {
    if (!date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-[#84CC16] focus:outline-none text-foreground text-left flex items-center justify-between text-sm ${className}`}
      >
        <span className={selectedDate ? 'text-foreground' : 'text-muted-foreground'}>
          {formatDisplayValue() || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selectedDate && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-muted-foreground/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          )}
          <Calendar className="w-4 h-4 text-muted-foreground" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 bg-background border-2 border-border rounded-2xl shadow-lg p-4 w-full min-w-[320px]"
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={prevMonth}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </motion.button>
              <span className="text-sm font-bold text-foreground">
                {currentMonth.toLocaleDateString('en-GB', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={nextMonth}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </motion.button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-muted-foreground py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((day, index) => {
                const isSelected = isSameDay(day.fullDate, selectedDate);
                const isTodayDate = isToday(day.fullDate);

                return (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDateSelect(day.fullDate)}
                    className={`
                      p-2 text-sm rounded-lg transition-all
                      ${
                        day.isCurrentMonth
                          ? 'text-foreground hover:bg-muted'
                          : 'text-muted-foreground/40'
                      }
                      ${isSelected ? 'bg-[#84CC16] text-white hover:bg-[#84CC16]/90' : ''}
                      ${isTodayDate && !isSelected ? 'ring-2 ring-[#84CC16]/40 ring-inset' : ''}
                    `}
                  >
                    {day.date}
                  </motion.button>
                );
              })}
            </div>

            {/* Time Picker (if enabled) */}
            {showTime && selectedDate && (
              <div className="mt-4 pt-4 border-t border-border">
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Time
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border-2 border-border bg-muted text-foreground focus:border-[#84CC16] outline-none text-sm"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTimeConfirm}
                    className="px-4 py-2 rounded-lg bg-[#84CC16] text-white font-semibold text-sm hover:bg-[#84CC16]/90 transition-colors"
                  >
                    Done
                  </motion.button>
                </div>
              </div>
            )}

            {/* Confirm button (for date-only) */}
            {!showTime && selectedDate && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsOpen(false)}
                className="w-full mt-4 py-2 rounded-lg bg-[#84CC16] text-white font-semibold text-sm hover:bg-[#84CC16]/90 transition-colors"
              >
                Confirm
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
