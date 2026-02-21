'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Edit2, Save, X } from 'lucide-react';

interface ProfileData {
  name: string;
  age: string;
  medicalConditions: string;
  currentMedications: string;
  allergies: string;
  familyHistory: string;
}

export function ProfileView() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    age: '',
    medicalConditions: '',
    currentMedications: '',
    allergies: '',
    familyHistory: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('pulseUserProfile');
    if (saved) {
      const data = JSON.parse(saved);
      setProfileData(data);
      setFormData(data);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem('pulseUserProfile', JSON.stringify(formData));
    setProfileData(formData);
    setIsEditing(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 py-6 max-w-2xl mx-auto"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {profileData?.name || 'User Profile'}
            </h1>
            <p className="text-sm text-muted-foreground">Age: {profileData?.age}</p>
          </div>
        </div>

        {!isEditing && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="p-3 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
          >
            <Edit2 className="w-5 h-5 text-primary" />
          </motion.button>
        )}
      </motion.div>

      {/* Profile Info Cards */}
      {!isEditing && profileData && (
        <div className="space-y-4 mb-8">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 border border-border"
          >
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">
              Medical Conditions
            </p>
            <p className="text-foreground">
              {profileData.medicalConditions || 'None reported'}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 border border-border"
          >
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">
              Current Medications
            </p>
            <p className="text-foreground">
              {profileData.currentMedications || 'None reported'}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 border border-border"
          >
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">
              Allergies
            </p>
            <p className="text-foreground">
              {profileData.allergies || 'None reported'}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 border border-border"
          >
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">
              Family Health History
            </p>
            <p className="text-foreground">
              {profileData.familyHistory || 'None reported'}
            </p>
          </motion.div>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mb-8"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-foreground"
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
              className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-foreground"
            />
          </div>

          {/* Medical Conditions */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Medical Conditions
            </label>
            <textarea
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleChange}
              rows={3}
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
              rows={3}
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
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none text-foreground resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsEditing(false);
                setFormData(profileData!);
              }}
              className="flex-1 py-3 px-4 rounded-2xl border-2 border-border text-foreground font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex-1 py-3 px-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
