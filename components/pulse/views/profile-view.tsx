'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit2, ChevronRight, Activity, Flame, Heart,
  Shield, Bell, LogOut, Pill, AlertCircle, Users,
  Star, X, Save, ArrowLeft,
} from 'lucide-react';
import { userProfile } from '@/lib/mock-data';
import { BillingView } from '@/components/pulse/views/billing-view';

// ─── types ────────────────────────────────────────────────────────────────────
interface ProfileData {
  name: string;
  age: string;
  sex: string;
  height: string;
  weight: string;
  medicalConditions: string;
  currentMedications: string;
  allergies: string;
  familyHistory: string;
  smokingStatus: string;
  alcoholUse: string;
  bloodType: string;
  lastCheckup: string;
}

const EMPTY: ProfileData = {
  name: '', age: '', sex: '', height: '', weight: '',
  medicalConditions: '', currentMedications: '', allergies: '',
  familyHistory: '', smokingStatus: '', alcoholUse: '',
  bloodType: '', lastCheckup: '',
};

// ─── helpers ──────────────────────────────────────────────────────────────────
function getTierInfo(streak: number) {
  const w = streak / 7;
  if (w < 4)  return { name: 'Starter',   discount: '10%', emoji: '🌱', color: '#84CC16' };
  if (w < 12) return { name: 'Regular',   discount: '20%', emoji: '⚡', color: '#14B8A6' };
  if (w < 24) return { name: 'Committed', discount: '30%', emoji: '💎', color: '#A855F7' };
  return       { name: 'Champion',  discount: '40%', emoji: '🏆', color: '#F97316' };
}

// ─── small shared components ──────────────────────────────────────────────────
const Chip = ({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) => (
  <motion.button
    onClick={onToggle}
    whileTap={{ scale: 0.97 }}
    className={`px-3 py-1.5 rounded-xl border-2 text-sm font-semibold transition-all ${
      selected
        ? 'border-[#84CC16] bg-[#84CC16]/10 text-[#84CC16]'
        : 'border-border bg-muted text-foreground'
    }`}
  >
    {label}
  </motion.button>
);

const Field = ({
  label, name, value, onChange, type = 'text', placeholder,
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string;
}) => (
  <div>
    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-[#84CC16] focus:outline-none text-foreground placeholder:text-muted-foreground text-sm"
    />
  </div>
);

const SEX_OPTS   = ['Male', 'Female', 'Other', 'Prefer not to say'];
const BLOOD_OPTS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', "Don't know"];
const COND_OPTS  = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Obesity', 'Arthritis', 'Thyroid disorder', 'None'];
const FAM_OPTS   = ['Diabetes', 'Hypertension', 'Heart Disease', 'Cancer', 'Stroke', 'None'];
const SMOKE_OPTS = ['Non-smoker', 'Ex-smoker', 'Occasional', 'Current smoker'];
const ALCO_OPTS  = ['None', 'Occasional', 'Regular (weekly)', 'Daily'];

// ─── edit sheet ───────────────────────────────────────────────────────────────
function EditSheet({
  form,
  onChange,
  onChipToggle,
  onSingleSelect,
  onClose,
  onSave,
}: {
  form: ProfileData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChipToggle: (field: 'medicalConditions' | 'familyHistory', val: string) => void;
  onSingleSelect: (field: keyof ProfileData, val: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const chips = (field: 'medicalConditions' | 'familyHistory', opts: string[]) => (
    <div className="flex flex-wrap gap-2">
      {opts.map((o) => (
        <Chip
          key={o}
          label={o}
          selected={form[field].split(', ').includes(o)}
          onToggle={() => onChipToggle(field, o)}
        />
      ))}
    </div>
  );

  const select = (field: keyof ProfileData, opts: string[]) => (
    <div className="flex flex-wrap gap-2">
      {opts.map((o) => (
        <Chip
          key={o}
          label={o}
          selected={form[field] === o}
          onToggle={() => onSingleSelect(field, o)}
        />
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 280 }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b border-border bg-background">
        <motion.button whileTap={{ scale: 0.95 }} onClick={onClose} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <X className="w-5 h-5 text-foreground" />
        </motion.button>
        <h2 className="text-lg font-bold text-foreground">Edit Profile</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#84CC16] text-white font-bold text-sm"
        >
          <Save className="w-4 h-4" />
          Save
        </motion.button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">

        {/* Basic */}
        <section>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Basic Info</p>
          <div className="space-y-3">
            <Field label="Full Name" name="name" value={form.name} onChange={onChange} placeholder="Amara" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Age" name="age" value={form.age} type="number" onChange={onChange} placeholder="28" />
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Sex</label>
                {select('sex', SEX_OPTS)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Height (cm)" name="height" value={form.height} type="number" onChange={onChange} placeholder="168" />
              <Field label="Weight (kg)" name="weight" value={form.weight} type="number" onChange={onChange} placeholder="65" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Blood Type</label>
              {select('bloodType', BLOOD_OPTS)}
            </div>
          </div>
        </section>

        {/* Medical */}
        <section>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Medical History</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Known Conditions</label>
              {chips('medicalConditions', COND_OPTS)}
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Family History</label>
              {chips('familyHistory', FAM_OPTS)}
            </div>
            <Field label="Current Medications" name="currentMedications" value={form.currentMedications} onChange={onChange} placeholder="e.g. Metformin 500mg" />
            <Field label="Allergies" name="allergies" value={form.allergies} onChange={onChange} placeholder="e.g. Penicillin, Peanuts" />
          </div>
        </section>

        {/* Lifestyle */}
        <section>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Lifestyle</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Smoking</label>
              {select('smokingStatus', SMOKE_OPTS)}
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Alcohol</label>
              {select('alcoholUse', ALCO_OPTS)}
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Last Checkup</label>
              <input
                type="date"
                value={form.lastCheckup}
                onChange={(e) => onSingleSelect('lastCheckup', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-[#84CC16] focus:outline-none text-foreground text-sm"
              />
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

// ─── main view ────────────────────────────────────────────────────────────────
export function ProfileView() {
  const [profile, setProfile] = useState<ProfileData>(EMPTY);
  const [editForm, setEditForm] = useState<ProfileData>(EMPTY);
  const [isEditing, setIsEditing] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [showMedications, setShowMedications] = useState(false);
  const [showHealthCircles, setShowHealthCircles] = useState(false);
  const tier = getTierInfo(userProfile.streak);

  useEffect(() => {
    const saved = localStorage.getItem('pulseUserProfile');
    if (saved) {
      const data = JSON.parse(saved);
      setProfile(data);
      setEditForm(data);
    }
  }, []);

  // ── edit handlers ─────────────────────────────────────────────────────────
  const openEdit = () => { setEditForm({ ...profile }); setIsEditing(true); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSingleSelect = (field: keyof ProfileData, val: string) => {
    setEditForm((p) => ({ ...p, [field]: val }));
  };

  const handleChipToggle = (field: 'medicalConditions' | 'familyHistory', val: string) => {
    setEditForm((prev) => {
      const current = prev[field] ? prev[field].split(', ').filter(Boolean) : [];
      if (val === 'None') return { ...prev, [field]: 'None' };
      const without = current.filter((v) => v !== 'None');
      const next = without.includes(val) ? without.filter((v) => v !== val) : [...without, val];
      return { ...prev, [field]: next.join(', ') };
    });
  };

  const handleSave = () => {
    localStorage.setItem('pulseUserProfile', JSON.stringify(editForm));
    setProfile({ ...editForm });
    setIsEditing(false);
  };

  // ── derived display ───────────────────────────────────────────────────────
  const displayName = profile.name || userProfile.name;
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  if (showBilling) return <BillingView onBack={() => setShowBilling(false)} />;

  const InfoRow = ({ label, value }: { label: string; value?: string }) =>
    value ? (
      <div className="py-3 border-b border-border last:border-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    ) : null;

  const SettingsRow = ({
    icon: Icon, label, sublabel, onPress, danger,
  }: { icon: any; label: string; sublabel?: string; onPress?: () => void; danger?: boolean }) => (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      className="w-full flex items-center gap-3 py-3.5 px-4 rounded-2xl hover:bg-muted/60 transition-colors text-left"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-muted'}`}>
        <Icon className={`w-4 h-4 ${danger ? 'text-red-500' : 'text-muted-foreground'}`} />
      </div>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${danger ? 'text-red-500' : 'text-foreground'}`}>{label}</p>
        {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
      </div>
      {!danger && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
    </motion.button>
  );

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-background px-4 pt-6 pb-4 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Profile</h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={openEdit}
            className="flex items-center gap-1.5 text-[#84CC16] font-semibold text-sm px-3 py-1.5 rounded-xl hover:bg-[#84CC16]/10 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">

            {/* Hero */}
            <div className="flex items-center gap-4 pt-1 pb-2">
              {/* Solid green avatar — no gradient */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-sm shrink-0"
                style={{ backgroundColor: '#84CC16' }}
              >
                {initials}
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{displayName}</p>
                <p className="text-sm text-muted-foreground">
                  {[profile.age && `${profile.age} yrs`, profile.sex].filter(Boolean).join(' · ') || 'Complete your profile'}
                </p>
                {profile.height && profile.weight && (
                  <p className="text-xs text-muted-foreground">{profile.height} cm · {profile.weight} kg</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Flame,    label: 'Streak',    value: `${userProfile.streak}d`, color: '#F97316' },
                { icon: Activity, label: 'Check-ins', value: '14',                    color: '#14B8A6' },
                { icon: Heart,    label: 'Score',     value: `${userProfile.healthScore}`, color: '#84CC16' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-card rounded-2xl p-3 border border-border text-center">
                  <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
                  <p className="text-lg font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            {/* Tier card → billing */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBilling(true)}
              className="w-full rounded-2xl p-4 border border-border bg-card flex items-center gap-3 hover:border-[#84CC16]/40 transition-all text-left"
            >
              <span className="text-3xl">{tier.emoji}</span>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-semibold">Current Tier</p>
                <p className="text-lg font-bold text-foreground">{tier.name}</p>
                <p className="text-sm font-semibold" style={{ color: tier.color }}>{tier.discount} off clinic visits</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </motion.button>

            {/* Health profile display */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <p className="text-sm font-bold text-foreground">Health Profile</p>
                <motion.button whileTap={{ scale: 0.95 }} onClick={openEdit} className="text-xs text-[#84CC16] font-semibold">Edit</motion.button>
              </div>
              <div className="px-4">
                {profile.name ? (
                  <>
                    <InfoRow label="Medical Conditions" value={profile.medicalConditions || 'None reported'} />
                    <InfoRow label="Current Medications" value={profile.currentMedications || 'None'} />
                    <InfoRow label="Allergies" value={profile.allergies || 'None'} />
                    <InfoRow label="Family History" value={profile.familyHistory || 'None reported'} />
                    <InfoRow label="Blood Type" value={profile.bloodType} />
                    <InfoRow label="Smoking Status" value={profile.smokingStatus} />
                    <InfoRow label="Alcohol Use" value={profile.alcoholUse} />
                    <InfoRow label="Last Checkup" value={profile.lastCheckup} />
                  </>
                ) : (
                  <div className="py-5 text-center">
                    <p className="text-sm text-muted-foreground mb-3">Your health profile is empty.</p>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={openEdit}
                      className="px-5 py-2.5 rounded-xl bg-[#84CC16] text-white text-sm font-semibold"
                    >
                      Fill it in
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Account settings */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-bold text-foreground">Account</p>
              </div>
              <div className="px-2 py-1">
                <SettingsRow icon={Pill}         label="Medications & Allergies" sublabel="Manage your health list" onPress={() => setShowMedications(true)} />
                <SettingsRow icon={Users}        label="Health Circles"          sublabel="Share streaks with friends" onPress={() => setShowHealthCircles(true)} />
                <SettingsRow icon={Bell}         label="Notifications"           sublabel="Reminders & alerts" />
                <SettingsRow icon={Shield}       label="Privacy & Data"          sublabel="Control your health data" />
                <SettingsRow icon={AlertCircle}  label="Emergency Contact"       sublabel="Set your emergency contact" />
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="px-2 py-1">
                <SettingsRow icon={LogOut} label="Sign Out" danger />
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground pb-6">
              Pulse v0.1 · Your data is encrypted and private
            </p>
          </div>
        </div>
      </div>

      {/* Edit sheet — full-screen slide-up */}
      <AnimatePresence>
        {isEditing && (
          <EditSheet
            form={editForm}
            onChange={handleChange}
            onChipToggle={handleChipToggle}
            onSingleSelect={handleSingleSelect}
            onClose={() => setIsEditing(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* Medications & Allergies Modal */}
      <AnimatePresence>
        {showMedications && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowMedications(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-3xl overflow-hidden w-full max-w-md max-h-[80vh] flex flex-col"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#84CC16]/10 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-[#84CC16]" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Medications & Allergies</h3>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMedications(false)}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="bg-muted rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground font-semibold mb-2">Current Medications</p>
                  <p className="text-sm text-foreground">{profile.currentMedications || 'None listed'}</p>
                </div>
                <div className="bg-muted rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground font-semibold mb-2">Allergies</p>
                  <p className="text-sm text-foreground">{profile.allergies || 'None listed'}</p>
                </div>
                <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-2xl p-4">
                  <p className="text-xs text-[#EF4444] font-semibold mb-2">⚠️ Important</p>
                  <p className="text-sm text-foreground">Always inform healthcare providers about your medications and allergies before treatment.</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setShowMedications(false);
                    setIsEditing(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-[#84CC16] text-white font-bold text-sm hover:bg-[#84CC16]/90 transition-colors"
                >
                  Edit in Profile
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Health Circles Modal */}
      <AnimatePresence>
        {showHealthCircles && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowHealthCircles(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-3xl overflow-hidden w-full max-w-md max-h-[80vh] flex flex-col"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#84CC16]/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#84CC16]" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Health Circles</h3>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowHealthCircles(false)}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create or join health circles to share your wellness journey, motivate each other, and build healthy habits together!
                </p>
                
                {/* Mock circles */}
                <div className="space-y-3">
                  {[
                    { name: 'Family Support', members: 4, streak: '28 days', color: '#84CC16' },
                    { name: 'Gym Buddies', members: 8, streak: '14 days', color: '#14B8A6' },
                  ].map((circle, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${circle.color}20` }}>
                          <Users className="w-5 h-5" style={{ color: circle.color }} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-foreground">{circle.name}</p>
                          <p className="text-xs text-muted-foreground">{circle.members} members</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold" style={{ color: circle.color }}>{circle.streak}</p>
                          <p className="text-xs text-muted-foreground">Avg streak</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-2xl bg-[#84CC16] text-white font-bold text-sm hover:bg-[#84CC16]/90 transition-colors"
                >
                  + Create New Circle
                </motion.button>

                <div className="bg-muted rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground text-center">
                    Share your streaks, check-in patterns, and milestones to inspire each other. Privacy settings available.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
