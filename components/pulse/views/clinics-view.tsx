'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Star,
  Phone,
  Clock,
  CheckCircle,
  Copy,
  X,
} from 'lucide-react';
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
      className="bg-white rounded-3xl p-6 space-y-6 shadow-lg border border-border"
    >
      {/* Header with Close */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground">{clinic.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {clinic.specialty}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </motion.button>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(clinic.rating)
                  ? 'text-yellow-500'
                  : 'text-muted'
              }`}
              fill={i < Math.floor(clinic.rating) ? 'currentColor' : 'none'}
            />
          ))}
        </div>
        <span className="font-semibold text-foreground">{clinic.rating}</span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Distance
          </p>
          <p className="text-lg font-bold text-foreground">{clinic.distance} km</p>
        </div>
        <div className="bg-muted rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Availability
          </p>
          <p className="text-lg font-bold text-foreground">Today</p>
        </div>
      </div>

      {/* Discount Code */}
      <div className="bg-[#84CC16]/10 border-2 border-primary rounded-2xl p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">
          Your Exclusive Discount
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Code</p>
            <p className="text-lg font-bold text-foreground font-mono">
              {clinic.discountCode}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyCode}
            className="px-4 py-2 bg-primary text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy'}
          </motion.button>
        </div>
        <p className="text-sm text-foreground font-semibold">
          {clinic.discount} off your first visit
        </p>
      </div>

      {/* Book Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-4 px-6 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 transition-colors"
      >
        Book Appointment
      </motion.button>

      {/* Confirmation */}
      <div className="flex items-center gap-2 text-green-600 justify-center pt-4 border-t border-border">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-semibold">Verified Partner Clinic</span>
      </div>
    </motion.div>
  );
}

export function ClinicsView() {
  const [selectedClinic, setSelectedClinic] = useState<(typeof clinics)[0] | null>(
    null
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 py-6 max-w-2xl mx-auto"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6">
        Partner Clinics
      </motion.h2>

      <AnimatePresence mode="wait">
        {selectedClinic ? (
          <ClinicDetails
            clinic={selectedClinic}
            onClose={() => setSelectedClinic(null)}
          />
        ) : (
          <motion.div
            variants={containerVariants}
            className="space-y-4"
          >
            {clinics.map((clinic) => (
              <motion.button
                key={clinic.id}
                variants={itemVariants}
                onClick={() => setSelectedClinic(clinic)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left bg-white rounded-3xl p-6 shadow-md border border-border hover:shadow-lg hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {clinic.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {clinic.specialty}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(clinic.rating)
                                ? 'text-yellow-500'
                                : 'text-muted'
                            }`}
                            fill={
                              i < Math.floor(clinic.rating)
                                ? 'currentColor'
                                : 'none'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-foreground">
                        {clinic.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {clinic.distance} km away
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
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
    </motion.div>
  );
}

function ChevronRight({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}
