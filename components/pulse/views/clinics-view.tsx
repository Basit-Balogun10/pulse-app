'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Clock, CheckCircle, Copy, X, ChevronRight } from 'lucide-react';
import { clinics } from '@/lib/mock-data';

interface ClinicDetailsProps {
  clinic: (typeof clinics)[0];
  onClose: () => void;
}

function ClinicDetails({ clinic, onClose }: ClinicDetailsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(clinic.discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="bg-card rounded-3xl p-6 space-y-5 shadow-lg border border-border"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground">{clinic.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{clinic.specialty}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </motion.button>
      </div>

      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.floor(clinic.rating) ? 'text-yellow-500' : 'text-muted-foreground'}`}
            fill={i < Math.floor(clinic.rating) ? 'currentColor' : 'none'}
          />
        ))}
        <span className="font-semibold text-foreground text-sm">{clinic.rating}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Distance
          </p>
          <p className="text-lg font-bold text-foreground">{clinic.distance} km</p>
        </div>
        <div className="bg-muted rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Availability
          </p>
          <p className="text-lg font-bold text-foreground">Today</p>
        </div>
      </div>

      <div className="bg-[#84CC16]/10 border-2 border-[#84CC16] rounded-2xl p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">Your Exclusive Discount</p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Code</p>
            <p className="text-lg font-bold text-foreground font-mono">{clinic.discountCode}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyCode}
            className="px-4 py-2 bg-[#84CC16] text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-[#84CC16]/90 transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy'}
          </motion.button>
        </div>
        <p className="text-sm text-foreground font-semibold">{clinic.discount} off your first visit</p>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 px-6 bg-[#84CC16] text-white rounded-2xl font-bold text-base hover:bg-[#84CC16]/90 transition-colors"
      >
        Book Appointment
      </motion.button>

      <div className="flex items-center gap-2 text-[#84CC16] justify-center pt-2 border-t border-border">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-semibold">Verified Partner Clinic</span>
      </div>
    </motion.div>
  );
}

export function ClinicsView() {
  const [selectedClinic, setSelectedClinic] = useState<(typeof clinics)[0] | null>(null);

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background px-4 pt-6 pb-4 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">Partner Clinics</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Redeem your discount at any partner</p>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {selectedClinic ? (
            <ClinicDetails
              key="detail"
              clinic={selectedClinic}
              onClose={() => setSelectedClinic(null)}
            />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {clinics.map((clinic, i) => (
                <motion.button
                  key={clinic.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelectedClinic(clinic)}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left bg-card rounded-3xl p-5 shadow-sm border border-border hover:border-[#84CC16]/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-foreground mb-1">{clinic.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{clinic.specialty}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className={`w-3 h-3 ${j < Math.floor(clinic.rating) ? 'text-yellow-500' : 'text-muted-foreground'}`}
                              fill={j < Math.floor(clinic.rating) ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-foreground">{clinic.rating}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {clinic.distance} km
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="px-3 py-1 bg-[#84CC16]/10 text-[#84CC16] text-xs font-bold rounded-full">
                        {clinic.discount} off
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
