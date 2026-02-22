'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Clock, CheckCircle, Copy, X, ChevronRight, Search, Filter, SlidersHorizontal, Sparkles, Map } from 'lucide-react';
import { clinics } from '@/lib/mock-data';
import { amaraFullStory } from '@/lib/amara-story-data';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ClinicMap } from '../clinic-map';
import { PaymentModal } from '../payment-modal';

interface ClinicDetailsProps {
  clinic: (typeof clinics)[0];
  onClose: () => void;
  onViewMap: () => void;
  onBook: () => void;
}

function ClinicDetails({ clinic, onClose, onViewMap, onBook }: ClinicDetailsProps) {
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
        onClick={onBook}
        className="w-full py-4 px-6 bg-[#84CC16] text-white rounded-2xl font-bold text-base hover:bg-[#84CC16]/90 transition-colors"
      >
        Book Appointment
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onViewMap}
        className="w-full py-3 px-6 bg-muted text-foreground rounded-2xl font-semibold text-sm hover:bg-muted/70 transition-colors flex items-center justify-center gap-2"
      >
        <Map className="w-4 h-4" />
        View on Map
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
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState(10);
  const [minRating, setMinRating] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'discount'>('distance');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mapClinic, setMapClinic] = useState<(typeof clinics)[0] | null>(null);
  const [paymentClinic, setPaymentClinic] = useState<(typeof clinics)[0] | null>(null);

  // Get today's AI analysis for context banner
  const todayEntry = amaraFullStory[amaraFullStory.length - 1];
  const aiRecommendation = todayEntry?.aiAnalysis?.recommendation || '';
  
  // Extract specialty from AI recommendation if present
  const hasRecommendation = aiRecommendation && (
    aiRecommendation.toLowerCase().includes('gynecolog') ||
    aiRecommendation.toLowerCase().includes('endocrinolog') ||
    aiRecommendation.toLowerCase().includes('cardiolog') ||
    aiRecommendation.toLowerCase().includes('dermatolog')
  );

  // Get unique specialties
  const specialties = ['all', ...Array.from(new Set(clinics.map(c => c.specialty)))];

  // Filter clinics
  const filteredClinics = clinics
    .filter(clinic => {
      const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           clinic.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistance = clinic.distance <= maxDistance;
      const matchesRating = clinic.rating >= minRating;
      const matchesSpecialty = selectedSpecialty === 'all' || clinic.specialty === selectedSpecialty;
      return matchesSearch && matchesDistance && matchesRating && matchesSpecialty;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Sort by discount percentage
      const aDiscount = parseInt(a.discount);
      const bDiscount = parseInt(b.discount);
      return bDiscount - aDiscount;
    });

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background px-4 pt-6 pb-3 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Partner Clinics</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filteredClinics.length} clinic{filteredClinics.length !== 1 ? 's' : ''} available
            </p>
          </div>
          
          {/* Filter Sheet */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
              <SheetHeader className="px-2">
                <SheetTitle>Filter & Sort</SheetTitle>
              </SheetHeader>
              <div className="py-6 px-2 space-y-6">
                {/* Sort By */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">Sort By</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'distance', label: 'Distance' },
                      { value: 'rating', label: 'Rating' },
                      { value: 'discount', label: 'Discount' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as typeof sortBy)}
                        className={`py-2 px-3 rounded-xl text-sm font-semibold transition-colors ${
                          sortBy === option.value
                            ? 'bg-[#84CC16] text-white'
                            : 'bg-muted text-foreground hover:bg-muted/70'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Distance */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">
                    Max Distance: {maxDistance} km
                  </label>
                  <Slider
                    value={[maxDistance]}
                    onValueChange={(value) => setMaxDistance(value[0])}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Min Rating */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">
                    Minimum Rating: {minRating === 0 ? 'Any' : minRating}⭐
                  </label>
                  <Slider
                    value={[minRating]}
                    onValueChange={(value) => setMinRating(value[0])}
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Specialty Filter */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">Specialty</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                    {specialties.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => setSelectedSpecialty(specialty)}
                        className={`py-2 px-4 rounded-xl text-sm font-semibold transition-colors capitalize whitespace-nowrap ${
                          selectedSpecialty === specialty
                            ? 'bg-[#84CC16] text-white'
                            : 'bg-muted text-foreground hover:bg-muted/70'
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset & Apply */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMaxDistance(10);
                      setMinRating(0);
                      setSelectedSpecialty('all');
                      setSortBy('distance');
                    }}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={() => setFiltersOpen(false)}
                    className="flex-1 bg-[#84CC16] hover:bg-[#84CC16]/90"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search clinics or specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 rounded-2xl border-2 focus-visible:ring-[#84CC16] text-base"
          />
        </div>

        {/* AI Context Banner */}
        {hasRecommendation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#A855F7]/10 to-[#84CC16]/10 border border-[#A855F7]/20 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#A855F7]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#A855F7]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">
                  AI Recommendation
                </p>
                <p className="text-sm text-muted-foreground">
                  {aiRecommendation.split('.')[0]}.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {selectedClinic ? (
            <ClinicDetails
              key="detail"
              clinic={selectedClinic}
              onClose={() => setSelectedClinic(null)}
              onViewMap={() => {
                setMapClinic(selectedClinic);
              }}
              onBook={() => {
                setPaymentClinic(selectedClinic);
              }}
            />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filteredClinics.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm mb-2">No clinics match your filters</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setMaxDistance(10);
                      setMinRating(0);
                      setSelectedSpecialty('all');
                    }}
                    className="text-[#84CC16] text-sm font-semibold hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                filteredClinics.map((clinic, i) => (
                  <motion.button
                    key={clinic.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
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
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Modal */}
      <AnimatePresence>
        {mapClinic && (
          <ClinicMap
            name={mapClinic.name}
            address={mapClinic.address}
            phone={mapClinic.phone}
            hours={mapClinic.hours}
            onClose={() => setMapClinic(null)}
          />
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentClinic && (
          <PaymentModal
            clinicName={paymentClinic.name}
            consultationType="consultation"
            originalPrice={15000}
            discountPercent={parseInt(paymentClinic.discount)}
            onClose={() => setPaymentClinic(null)}
            onSuccess={() => {
              // Handle successful booking
              console.log('Booking successful!');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
