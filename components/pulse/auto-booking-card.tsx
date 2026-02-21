'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, X, Edit2, CheckCircle, AlertCircle } from 'lucide-react';
import { AutoBooking } from '@/lib/auto-booking';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface AutoBookingCardProps {
  booking: AutoBooking;
  onCancel: () => void;
  onModify: () => void;
  onConfirm: () => void;
}

export function AutoBookingCard({ booking, onCancel, onModify, onConfirm }: AutoBookingCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="bg-gradient-to-br from-[#818CF8]/10 to-[#A855F7]/10 rounded-3xl p-5 border-2 border-[#818CF8]/30 shadow-lg"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#818CF8]/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#818CF8]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Auto-Booked Visit</h3>
              <p className="text-xs text-muted-foreground">Agent scheduled for you</p>
            </div>
          </div>
          {booking.status === 'pending' && (
            <div className="px-3 py-1 bg-[#F97316]/10 text-[#F97316] text-xs font-bold rounded-full">
              Pending
            </div>
          )}
        </div>

        {/* Booking Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{booking.clinicName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">
              {new Date(booking.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{booking.time}</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-background/50 rounded-2xl p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#818CF8] mt-0.5 shrink-0" />
            <p className="text-xs text-foreground leading-relaxed">
              After {booking.nudgeCount} health nudges, we've auto-booked this appointment. 
              Your 100% discount covers this visit completely. You can modify or cancel anytime.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="rounded-xl text-red-500 border-red-500 hover:bg-red-500/10"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onModify}
            className="rounded-xl"
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Modify
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            className="rounded-xl bg-[#84CC16] hover:bg-[#84CC16]/90 text-white"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirm
          </Button>
        </div>

        <button
          onClick={() => setShowDetails(true)}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-3 transition-colors"
        >
          Why was this booked? →
        </button>
      </motion.div>

      {/* Details Sheet */}
      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent side="bottom" className="h-[70vh]">
          <SheetHeader>
            <SheetTitle>Auto-Booking Explanation</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-4">
            <div className="bg-muted rounded-2xl p-4">
              <h4 className="font-semibold text-foreground mb-2">How it works</h4>
              <p className="text-sm text-foreground leading-relaxed">
                Our AI monitors your daily check-ins for concerning patterns. When it detects 
                something that warrants medical attention, we nudge you to book a clinic visit.
              </p>
            </div>

            <div className="bg-muted rounded-2xl p-4">
              <h4 className="font-semibold text-foreground mb-2">Your recent nudges</h4>
              <p className="text-sm text-foreground leading-relaxed">
                You dismissed {booking.nudgeCount} health nudges over the past week. To help you 
                overcome procrastination, we've automatically scheduled this appointment.
              </p>
            </div>

            <div className="bg-[#84CC16]/10 rounded-2xl p-4 border border-[#84CC16]/30">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#84CC16]" />
                100% Covered
              </h4>
              <p className="text-sm text-foreground leading-relaxed">
                Your {booking.nudgeCount >= 52 ? 'yearly' : 'loyalty'} streak qualifies you for a fully 
                covered clinic visit. There's no cost to you.
              </p>
            </div>

            <div className="bg-muted rounded-2xl p-4">
              <h4 className="font-semibold text-foreground mb-2">You're in control</h4>
              <p className="text-sm text-foreground leading-relaxed">
                You can change the date, time, or clinic at any point. You can also cancel 
                without penalty. This is just a gentle push to help you take action.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
