'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Phone, Mail, Clock, DollarSign, Stethoscope, X, ArrowRight, Check } from 'lucide-react';

interface ClinicOnboardingProps {
  onComplete: (clinicData: ClinicData) => void;
  onSkip?: () => void;
}

interface ClinicData {
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  specialties: string[];
  pricing: {
    consultation: string;
    followUp: string;
  };
  hours: {
    weekdays: string;
    weekends: string;
  };
  acceptsPulse: boolean;
  discountOffered: string;
}

const SPECIALTY_OPTIONS = [
  'General Practice',
  'Pediatrics',
  'Gynecology',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'ENT',
  'Ophthalmology',
  'Dentistry',
  'Mental Health',
];

const STEPS = [
  { id: 1, title: 'Clinic Information', icon: Building2 },
  { id: 2, title: 'Contact Details', icon: Phone },
  { id: 3, title: 'Specialties & Pricing', icon: Stethoscope },
  { id: 4, title: 'Operating Hours', icon: Clock },
];

export function ClinicOnboarding({ onComplete, onSkip }: ClinicOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ClinicData>({
    name: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    specialties: [],
    pricing: {
      consultation: '',
      followUp: '',
    },
    hours: {
      weekdays: '8:00 AM - 6:00 PM',
      weekends: '9:00 AM - 2:00 PM',
    },
    acceptsPulse: true,
    discountOffered: '20',
  });

  const handleInputChange = (field: keyof ClinicData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: 'pricing' | 'hours', field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.address && formData.city && formData.state;
      case 2:
        return formData.phone && formData.email;
      case 3:
        return formData.specialties.length > 0 && formData.pricing.consultation;
      case 4:
        return formData.hours.weekdays;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Join Pulse Network</h1>
            <p className="text-sm text-muted-foreground mt-1">Connect with health-conscious patients</p>
          </div>
          {onSkip && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onSkip}
              className="text-sm text-muted-foreground hover:text-foreground font-medium"
            >
              Skip
            </motion.button>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  step.id <= currentStep ? 'bg-[#84CC16]' : 'bg-muted'
                }`}
              />
              {idx < STEPS.length - 1 && <div className="w-2" />}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <STEPS[currentStep - 1].icon className="w-5 h-5 text-[#84CC16]" />
          <p className="text-sm font-semibold text-foreground">{STEPS[currentStep - 1].title}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 max-w-lg mx-auto"
            >
              <InputField
                label="Clinic Name"
                placeholder="City Wellness Clinic"
                value={formData.name}
                onChange={(val) => handleInputChange('name', val)}
              />
              <InputField
                label="Street Address"
                placeholder="123 Healthcare Avenue"
                value={formData.address}
                onChange={(val) => handleInputChange('address', val)}
              />
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="City"
                  placeholder="Lagos"
                  value={formData.city}
                  onChange={(val) => handleInputChange('city', val)}
                />
                <InputField
                  label="State"
                  placeholder="Lagos State"
                  value={formData.state}
                  onChange={(val) => handleInputChange('state', val)}
                />
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 max-w-lg mx-auto"
            >
              <InputField
                label="Phone Number"
                placeholder="+234 800 123 4567"
                value={formData.phone}
                onChange={(val) => handleInputChange('phone', val)}
                icon={<Phone className="w-4 h-4" />}
              />
              <InputField
                label="Email Address"
                placeholder="clinic@example.com"
                type="email"
                value={formData.email}
                onChange={(val) => handleInputChange('email', val)}
                icon={<Mail className="w-4 h-4" />}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 max-w-lg mx-auto"
            >
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Medical Specialties (select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTY_OPTIONS.map((specialty) => (
                    <motion.button
                      key={specialty}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleSpecialty(specialty)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                        formData.specialties.includes(specialty)
                          ? 'border-[#84CC16] bg-[#84CC16]/10 text-[#84CC16]'
                          : 'border-border bg-muted text-foreground'
                      }`}
                    >
                      {specialty}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Consultation Fee (₦)"
                  placeholder="5,000"
                  value={formData.pricing.consultation}
                  onChange={(val) => handleNestedChange('pricing', 'consultation', val)}
                  icon={<DollarSign className="w-4 h-4" />}
                />
                <InputField
                  label="Follow-up Fee (₦)"
                  placeholder="3,000"
                  value={formData.pricing.followUp}
                  onChange={(val) => handleNestedChange('pricing', 'followUp', val)}
                  icon={<DollarSign className="w-4 h-4" />}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Discount for Pulse Patients (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={formData.discountOffered}
                  onChange={(e) => handleInputChange('discountOffered', e.target.value)}
                  className="w-full accent-[#84CC16]"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-muted-foreground">0%</p>
                  <p className="text-2xl font-bold text-[#84CC16]">{formData.discountOffered}%</p>
                  <p className="text-xs text-muted-foreground">50%</p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 max-w-lg mx-auto"
            >
              <InputField
                label="Weekday Hours"
                placeholder="8:00 AM - 6:00 PM"
                value={formData.hours.weekdays}
                onChange={(val) => handleNestedChange('hours', 'weekdays', val)}
                icon={<Clock className="w-4 h-4" />}
              />
              <InputField
                label="Weekend Hours"
                placeholder="9:00 AM - 2:00 PM"
                value={formData.hours.weekends}
                onChange={(val) => handleNestedChange('hours', 'weekends', val)}
                icon={<Clock className="w-4 h-4" />}
              />

              <div className="bg-[#84CC16]/10 border border-[#84CC16] rounded-2xl p-4 mt-6">
                <p className="text-sm font-semibold text-foreground mb-2">Partnership Benefits</p>
                <div className="space-y-2">
                  {[
                    'Access to health-conscious patient network',
                    'Featured placement in clinic directory',
                    'Analytics dashboard for patient insights',
                    'Free profile management tools',
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#84CC16] shrink-0" />
                      <p className="text-sm text-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border flex gap-3">
        {currentStep > 1 && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleBack}
            className="px-6 py-3 rounded-2xl border-2 border-border text-foreground font-semibold hover:bg-muted transition-colors"
          >
            Back
          </motion.button>
        )}
        <motion.button
          whileTap={canProceed() ? { scale: 0.97 } : {}}
          onClick={canProceed() ? handleNext : undefined}
          className={`flex-1 py-3 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
            canProceed()
              ? 'bg-[#84CC16] text-white hover:bg-[#84CC16]/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {currentStep === 4 ? 'Complete Setup' : 'Next'}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

// Helper Input Component
function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-[#84CC16] focus:outline-none text-foreground placeholder:text-muted-foreground text-sm`}
        />
      </div>
    </div>
  );
}
