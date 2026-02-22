// @ts-nocheck
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Calendar,
  Activity,
  Zap,
  Moon,
  Smile,
  Heart,
  ChevronDown,
  Check,
} from 'lucide-react';
import { amaraFullStory } from '@/lib/amara-story-data';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export function AnalyticsView() {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d' | '60d'>('14d');
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'energy' | 'mood' | 'sleep' | 'appetite'>('all');
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '14d', label: 'Last 14 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '60d', label: 'Last 60 days' },
  ] as const;

  const selectedOption = timeRangeOptions.find(opt => opt.value === timeRange);

  // Prepare chart data from Amara's full story
  const chartData = amaraFullStory.map((entry) => {
    // Convert mood and appetite to numeric values
    const moodMap: Record<string, number> = { 'positive': 10, 'neutral': 7, 'low': 4, 'anxious': 3 };
    const appetiteMap: Record<string, number> = { 'great': 10, 'good': 7, 'low': 4, 'very low': 2 };
    
    return {
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      energy: entry.energy * 2, // Scale to 10
      mood: moodMap[entry.mood] || 5,
      sleep: entry.sleep.hours >= 10 ? 10 : Math.round(entry.sleep.hours),
      appetite: appetiteMap[entry.appetite] || 5,
    };
  });

  // Calculate averages
  const averages = {
    energy: Math.round((amaraFullStory.reduce((sum, e) => sum + (e.energy * 2), 0) / amaraFullStory.length) * 10) / 10,
    mood: Math.round((amaraFullStory.reduce((sum, e) => {
      const moodMap: Record<string, number> = { 'positive': 10, 'neutral': 7, 'low': 4, 'anxious': 3 };
      return sum + (moodMap[e.mood] || 5);
    }, 0) / amaraFullStory.length) * 10) / 10,
    sleep: Math.round((amaraFullStory.reduce((sum, e) => sum + e.sleep.hours, 0) / amaraFullStory.length) * 10) / 10,
    appetite: Math.round((amaraFullStory.reduce((sum, e) => {
      const appetiteMap: Record<string, number> = { 'great': 10, 'good': 7, 'low': 4, 'very low': 2 };
      return sum + (appetiteMap[e.appetite] || 5);
    }, 0) / amaraFullStory.length) * 10) / 10,
  };

  // Calculate trends (comparing first half vs second half)
  const midpoint = Math.floor(amaraFullStory.length / 2);
  const firstHalf = amaraFullStory.slice(0, midpoint);
  const secondHalf = amaraFullStory.slice(midpoint);

  const calculateAverage = (arr: typeof amaraFullStory, key: 'energy' | 'mood' | 'sleep' | 'appetite') => {
    if (key === 'energy') {
      return arr.reduce((sum, e) => sum + (e.energy * 2), 0) / arr.length;
    }
    if (key === 'mood') {
      const moodMap: Record<string, number> = { 'positive': 10, 'neutral': 7, 'low': 4, 'anxious': 3 };
      return arr.reduce((sum, e) => sum + (moodMap[e.mood] || 5), 0) / arr.length;
    }
    if (key === 'sleep') {
      return arr.reduce((sum, e) => sum + e.sleep.hours, 0) / arr.length;
    }
    if (key === 'appetite') {
      const appetiteMap: Record<string, number> = { 'great': 10, 'good': 7, 'low': 4, 'very low': 2 };
      return arr.reduce((sum, e) => sum + (appetiteMap[e.appetite] || 5), 0) / arr.length;
    }
    return 0;
  };

  const trends = {
    energy: Math.round(((calculateAverage(secondHalf, 'energy') - calculateAverage(firstHalf, 'energy')) / (calculateAverage(firstHalf, 'energy') || 1)) * 100),
    mood: Math.round(((calculateAverage(secondHalf, 'mood') - calculateAverage(firstHalf, 'mood')) / (calculateAverage(firstHalf, 'mood') || 1)) * 100),
    sleep: Math.round(((calculateAverage(secondHalf, 'sleep') - calculateAverage(firstHalf, 'sleep')) / (calculateAverage(firstHalf, 'sleep') || 1)) * 100),
    appetite: Math.round(((calculateAverage(secondHalf, 'appetite') - calculateAverage(firstHalf, 'appetite')) / (calculateAverage(firstHalf, 'appetite') || 1)) * 100),
  };

  // Heatmap calendar data (last 14 days)
  const heatmapData = amaraFullStory.map((entry) => ({
    date: entry.date,
    intensity: entry.hasCheckedIn ? Math.round((entry.energy + entry.mood + entry.sleep) / 3) : 0,
  }));

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background px-4 pt-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Track your health trends</p>
          </div>
          <Popover open={isTimeRangeOpen} onOpenChange={setIsTimeRangeOpen}>
            <PopoverTrigger asChild>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/70 transition-colors"
              >
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{selectedOption?.label}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div className="space-y-1">
                {timeRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTimeRange(option.value);
                      setIsTimeRangeOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timeRange === option.value
                        ? 'bg-[#84CC16] text-white'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{option.label}</span>
                    {timeRange === option.value && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="px-4 py-4 max-w-4xl mx-auto w-full space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Avg Energy"
            value={averages.energy}
            max={10}
            trend={trends.energy}
            color="#84CC16"
          />
          <StatCard
            icon={<Smile className="w-5 h-5" />}
            label="Avg Mood"
            value={averages.mood}
            max={10}
            trend={trends.mood}
            color="#F59E0B"
          />
          <StatCard
            icon={<Moon className="w-5 h-5" />}
            label="Avg Sleep"
            value={averages.sleep}
            max={10}
            trend={trends.sleep}
            color="#A855F7"
          />
          <StatCard
            icon={<Heart className="w-5 h-5" />}
            label="Avg Appetite"
            value={averages.appetite}
            max={10}
            trend={trends.appetite}
            color="#14B8A6"
          />
        </div>

        {/* Check-in Streak Heatmap */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-sm font-semibold text-foreground mb-4">Check-in Streak</p>
          <div className="grid grid-cols-7 gap-2">
            {heatmapData.map((day, i) => {
              const intensity = day.intensity;
              const opacity = intensity > 0 ? 0.2 + (intensity / 10) * 0.8 : 0.1;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full aspect-square rounded-lg"
                    style={{
                      backgroundColor: intensity > 0 ? `rgba(132, 204, 22, ${opacity})` : 'rgba(156, 163, 175, 0.1)',
                    }}
                  />
                  {i % 7 === 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex items-center gap-1">
              {[0.2, 0.4, 0.6, 0.8, 1].map((opacity, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: `rgba(132, 204, 22, ${opacity})` }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>

        {/* Metric Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Metrics' },
            { id: 'energy', label: 'Energy' },
            { id: 'mood', label: 'Mood' },
            { id: 'sleep', label: 'Sleep' },
            { id: 'appetite', label: 'Appetite' },
          ].map((option) => (
            <motion.button
              key={option.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedMetric(option.id as typeof selectedMetric)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                selectedMetric === option.id
                  ? 'bg-[#84CC16] text-white'
                  : 'bg-muted text-foreground hover:bg-muted/70'
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </div>

        {/* Line Chart - Trends Over Time */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-foreground">Health Trends</p>
            <TrendingUp className="w-4 h-4 text-[#84CC16]" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                domain={[0, 10]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  padding: '8px 12px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              {(selectedMetric === 'all' || selectedMetric === 'energy') && (
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#84CC16"
                  strokeWidth={2}
                  dot={{ fill: '#84CC16', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Energy"
                />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'mood') && (
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Mood"
                />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'sleep') && (
                <Line
                  type="monotone"
                  dataKey="sleep"
                  stroke="#A855F7"
                  strokeWidth={2}
                  dot={{ fill: '#A855F7', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Sleep"
                />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'appetite') && (
                <Line
                  type="monotone"
                  dataKey="appetite"
                  stroke="#14B8A6"
                  strokeWidth={2}
                  dot={{ fill: '#14B8A6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Appetite"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Comparison */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-sm font-semibold text-foreground mb-4">Weekly Comparison</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                domain={[0, 10]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  padding: '8px 12px',
                }}
              />
              <Legend iconType="circle" />
              <Bar dataKey="energy" fill="#84CC16" radius={[8, 8, 0, 0]} name="Energy" />
              <Bar dataKey="mood" fill="#F59E0B" radius={[8, 8, 0, 0]} name="Mood" />
              <Bar dataKey="sleep" fill="#A855F7" radius={[8, 8, 0, 0]} name="Sleep" />
              <Bar dataKey="appetite" fill="#14B8A6" radius={[8, 8, 0, 0]} name="Appetite" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-br from-[#A855F7]/10 to-[#84CC16]/10 border border-[#A855F7]/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#A855F7]/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#A855F7]" />
            </div>
            <p className="text-sm font-semibold text-foreground">AI Insights</p>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-[#84CC16] mt-0.5">•</span>
              <span>Your energy levels have improved by {Math.abs(trends.energy)}% over the past week</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F59E0B] mt-0.5">•</span>
              <span>Mood shows a {trends.mood > 0 ? 'positive' : 'concerning'} trend of {Math.abs(trends.mood)}%</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#A855F7] mt-0.5">•</span>
              <span>Sleep quality averaging {averages.sleep}/10 - {averages.sleep >= 7 ? 'Keep it up!' : 'Consider improving sleep habits'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  max,
  trend,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  max: number;
  trend: number;
  color: string;
}) {
  const percentage = (value / max) * 100;
  const trendPositive = trend >= 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <span className="text-sm text-muted-foreground">/ {max}</span>
      </div>
      {trend !== 0 && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${trendPositive ? 'text-[#84CC16]' : 'text-[#F97316]'}`}>
          <TrendingUp className={`w-3 h-3 ${!trendPositive && 'rotate-180'}`} />
          <span>{Math.abs(trend)}% {trendPositive ? 'increase' : 'decrease'}</span>
        </div>
      )}
      {/* Progress bar */}
      <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
