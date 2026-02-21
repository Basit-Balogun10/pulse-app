'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function OnboardingModal({
  isOpen,
  onClose,
  onSave,
}: OnboardingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    medicalConditions: '',
    currentMedications: '',
    allergies: '',
    familyHistory: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 600 }}
            animate={{ y: 0 }}
            exit={{ y: 600 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Welcome to Pulse
              </h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="w-6 h-6 text-foreground" />
              </motion.button>
            </div>

            {/* Subtitle */}
            <p className="text-muted-foreground mb-8">
              Tell us a bit about yourself so we can personalize your experience.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Amara"
                  className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-foreground"
                  required
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 28"
                  className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-foreground"
                  required
                />
              </div>

              {/* Medical Conditions */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Any Medical Conditions?
                </label>
                <textarea
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  placeholder="e.g., Asthma, Diabetes"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-foreground resize-none"
                />
              </div>

              {/* Current Medications */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Current Medications
                </label>
                <textarea
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleChange}
                  placeholder="List any medications you're taking"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-foreground resize-none"
                />
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Allergies
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="e.g., Peanuts, Penicillin"
                  className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-foreground"
                />
              </div>

              {/* Family History */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Family Health History
                </label>
                <textarea
                  name="familyHistory"
                  value={formData.familyHistory}
                  onChange={handleChange}
                  placeholder="e.g., Heart disease, Cancer"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-foreground resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors mt-8"
              >
                Get Started
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
