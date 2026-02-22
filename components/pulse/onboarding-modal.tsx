'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { DateTimePicker } from '@/components/ui/date-time-picker';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const STEPS = [
  { title: 'Hey! Quick intro 👋', subtitle: 'Tell us the basics so we can personalise your experience.' },
  { title: 'Your body basics', subtitle: 'Helps us give you accurate health context.' },
  { title: 'Medical history', subtitle: 'We use this to personalise your check-in cards.' },
  { title: 'Lifestyle snapshot', subtitle: 'Quick baseline — no judgment here.' },
];

const CONDITIONS = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Obesity', 'Arthritis', 'Thyroid disorder', 'Other', 'None'];
const FAMILY_HISTORY = ['Diabetes', 'Hypertension', 'Heart Disease', 'Cancer', 'Stroke', 'Other', 'None'];
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', "Don't know"];

const Chip = ({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) => (
  <motion.button
    onClick={onToggle}
    whileTap={{ scale: 0.97 }}
    className={`px-3.5 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
      selected ? 'border-[#84CC16] bg-[#84CC16]/10 text-[#84CC16]' : 'border-border bg-muted text-foreground'
    }`}
  >
    {label}
  </motion.button>
);

const SelectGroup = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Chip key={o} label={o} selected={value === o} onToggle={() => onChange(o)} />
      ))}
    </div>
  </div>
);

const Field = ({ label, type = 'text', name, value, onChange, placeholder }: {
  label: string; type?: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-[#84CC16] focus:outline-none text-foreground placeholder:text-muted-foreground"
    />
  </div>
);

export function OnboardingModal({ isOpen, onSave }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', age: '', sex: '', height: '', weight: '',
    medicalConditions: [] as string[],
    customMedicalCondition: '',
    currentMedications: '', allergies: '',
    familyHistory: [] as string[],
    customFamilyHistory: '',
    smokingStatus: '', alcoholUse: '',
    bloodType: '', lastCheckup: '',
  });

  const set = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const toggleArray = (key: 'medicalConditions' | 'familyHistory', val: string) => {
    if (val === 'None') { set(key, ['None']); return; }
    const arr = form[key].filter((v) => v !== 'None');
    set(key, arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => set(e.target.name, e.target.value);

  const canProceed = () => {
    if (step === 0) return form.name.trim().length > 0 && form.age.trim().length > 0;
    if (step === 1) return form.sex !== '' && form.height !== '' && form.weight !== '';
    return true;
  };

  const handleSubmit = () => {
    onSave({
      ...form,
      medicalConditions: form.medicalConditions.join(', '),
      familyHistory: form.familyHistory.join(', '),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[92vh] flex flex-col border-t border-border"
          >
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-3 mb-2" />

            {/* Step indicator */}
            <div className="flex gap-1.5 justify-center py-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: i === step ? '20px' : '6px', backgroundColor: i <= step ? '#84CC16' : '#d1d5db' }}
                />
              ))}
            </div>

            <div className="px-6 pt-2 pb-4 flex items-center gap-3">
              {step > 0 && (
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </motion.button>
              )}
              <div>
                <h2 className="text-xl font-bold text-foreground">{STEPS[step].title}</h2>
                <p className="text-sm text-muted-foreground">{STEPS[step].subtitle}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {step === 0 && (
                    <>
                      <Field label="Your Name *" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Amara" />
                      <Field label="Age *" type="number" name="age" value={form.age} onChange={handleChange} placeholder="e.g. 28" />
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <SelectGroup label="Sex *" options={['Male', 'Female', 'Other', 'Prefer not to say']} value={form.sex} onChange={(v) => set('sex', v)} />
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Height (cm) *" type="number" name="height" value={form.height} onChange={handleChange} placeholder="168" />
                        <Field label="Weight (kg) *" type="number" name="weight" value={form.weight} onChange={handleChange} placeholder="65" />
                      </div>
                      <SelectGroup label="Blood Type" options={BLOOD_TYPES} value={form.bloodType} onChange={(v) => set('bloodType', v)} />
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Known Diagnoses</label>
                        <div className="flex flex-wrap gap-2">
                          {CONDITIONS.map((c) => (
                            <Chip key={c} label={c} selected={form.medicalConditions.includes(c)} onToggle={() => toggleArray('medicalConditions', c)} />
                          ))}
                        </div>
                        {form.medicalConditions.includes('Other') && (
                          <input
                            type="text"
                            value={form.customMedicalCondition}
                            onChange={(e) => set('customMedicalCondition', e.target.value)}
                            placeholder="Please specify..."
                            className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-[#84CC16] focus:outline-none text-foreground placeholder:text-muted-foreground mt-2"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Family History</label>
                        <div className="flex flex-wrap gap-2">
                          {FAMILY_HISTORY.map((c) => (
                            <Chip key={c} label={c} selected={form.familyHistory.includes(c)} onToggle={() => toggleArray('familyHistory', c)} />
                          ))}
                        </div>
                        {form.familyHistory.includes('Other') && (
                          <input
                            type="text"
                            value={form.customFamilyHistory}
                            onChange={(e) => set('customFamilyHistory', e.target.value)}
                            placeholder="Please specify..."
                            className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-[#84CC16] focus:outline-none text-foreground placeholder:text-muted-foreground mt-2"
                          />
                        )}
                      </div>
                      <Field label="Current Medications" name="currentMedications" value={form.currentMedications} onChange={handleChange} placeholder="e.g. Metformin 500mg" />
                      <Field label="Allergies" name="allergies" value={form.allergies} onChange={handleChange} placeholder="e.g. Penicillin, Peanuts" />
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <SelectGroup label="Smoking Status" options={['Non-smoker', 'Ex-smoker', 'Occasional', 'Current smoker']} value={form.smokingStatus} onChange={(v) => set('smokingStatus', v)} />
                      <SelectGroup label="Alcohol Use" options={['None', 'Occasional', 'Regular (weekly)', 'Daily']} value={form.alcoholUse} onChange={(v) => set('alcoholUse', v)} />
                      <DateTimePicker
                        label="Last Medical Checkup"
                        value={form.lastCheckup}
                        onChange={(v) => set('lastCheckup', v)}
                        placeholder="Select date of last checkup"
                      />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="px-6 py-4 border-t border-border">
              {step < STEPS.length - 1 ? (
                <motion.button
                  whileTap={canProceed() ? { scale: 0.97 } : {}}
                  onClick={canProceed() ? () => setStep((s) => s + 1) : undefined}
                  className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                    canProceed() ? 'bg-[#84CC16] text-white' : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </motion.button>
              ) : (
                <div className="space-y-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    className="w-full py-4 rounded-2xl bg-[#84CC16] text-white font-bold text-base"
                  >
                    Let's go →
                  </motion.button>
                  <button onClick={handleSubmit} className="w-full py-2 text-sm text-muted-foreground">
                    Skip for now
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
