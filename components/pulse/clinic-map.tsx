'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, X, ExternalLink, Phone, Clock } from 'lucide-react';

interface ClinicMapProps {
  name: string;
  address: string;
  phone: string;
  hours: string;
  coordinates?: { lat: number; lng: number };
  onClose?: () => void;
}

export function ClinicMap({
  name,
  address,
  phone,
  hours,
  coordinates,
  onClose,
}: ClinicMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  // Default coordinates (Lagos, Nigeria) if none provided
  const coords = coordinates || { lat: 6.5244, lng: 3.3792 };

  // Generate Google Maps embed URL
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
    address
  )}&center=${coords.lat},${coords.lng}&zoom=15`;

  // Generate Google Maps directions URL
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-3xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#84CC16]/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#84CC16]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{name}</h2>
              <p className="text-sm text-muted-foreground">View location on map</p>
            </div>
          </div>
          {onClose && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
            >
              <X className="w-5 h-5 text-foreground" />
            </motion.button>
          )}
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-muted">
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full border-4 border-[#84CC16]/20 border-t-[#84CC16] animate-spin" />
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}
          <iframe
            src={mapEmbedUrl}
            className="w-full h-full min-h-[400px]"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setMapLoaded(true)}
          />
        </div>

        {/* Info Footer */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#84CC16] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-0.5">Address</p>
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-[#84CC16] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-0.5">Phone</p>
              <a
                href={`tel:${phone}`}
                className="text-sm text-[#84CC16] hover:underline"
              >
                {phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#84CC16] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-0.5">Hours</p>
              <p className="text-sm text-muted-foreground">{hours}</p>
            </div>
          </div>

          {/* Directions Button */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl bg-[#84CC16] text-white font-semibold flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Clinic Card Map Preview Component
export function ClinicCardMap({
  address,
  coordinates,
}: {
  address: string;
  coordinates?: { lat: number; lng: number };
}) {
  const coords = coordinates || { lat: 6.5244, lng: 3.3792 };

  // Static map image URL (Google Maps Static API)
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coords.lat},${coords.lng}&zoom=14&size=400x200&markers=color:0x84CC16%7C${coords.lat},${coords.lng}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&style=feature:poi|visibility:off&style=feature:transit|visibility:off`;

  return (
    <div className="relative h-32 rounded-xl overflow-hidden bg-muted">
      <img
        src={staticMapUrl}
        alt={`Map showing ${address}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
        <div className="flex items-center gap-2 text-white">
          <MapPin className="w-4 h-4" />
          <span className="text-xs font-medium line-clamp-1">{address}</span>
        </div>
      </div>
    </div>
  );
}
