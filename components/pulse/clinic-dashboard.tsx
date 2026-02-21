'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, Star, DollarSign, Calendar, 
  TrendingUp, Clock, MapPin, Edit2, Bell, X,
  Phone, Mail, Check, AlertCircle
} from 'lucide-react';
import { mockClinics } from '@/lib/mock-data-extended';

interface ClinicDashboardProps {
  clinicData?: typeof mockClinics[0];
  onClose?: () => void;
}

export function ClinicDashboard({ clinicData, onClose }: ClinicDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'appointments' | 'profile'>('overview');
  
  // Use first clinic from mock data if none provided
  const clinic = clinicData || mockClinics[0];
  
  // Mock stats
  const stats = {
    totalVisits: 247,
    thisMonth: 38,
    avgRating: clinic.rating,
    totalRevenue: '₦1,847,500',
    pulseBookings: 156,
    discountedVisits: 92,
    pendingAppts: 12,
    todayAppts: 5,
  };

  const recentAppointments = [
    { id: 1, patientName: 'Amara O.', time: '10:00 AM', type: 'Consultation', status: 'confirmed', discount: '60%' },
    { id: 2, patientName: 'David M.', time: '11:30 AM', type: 'Follow-up', status: 'confirmed', discount: '20%' },
    { id: 3, patientName: 'Sarah A.', time: '2:00 PM', type: 'Consultation', status: 'pending', discount: '40%' },
    { id: 4, patientName: 'John K.', time: '3:30 PM', type: 'Consultation', status: 'pending', discount: '10%' },
    { id: 5, patientName: 'Grace N.', time: '4:00 PM', type: 'Follow-up', status: 'confirmed', discount: '80%' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#84CC16]/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#84CC16]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{clinic.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-sm font-semibold text-foreground">{clinic.rating}</span>
                <span className="text-xs text-muted-foreground">· Pulse Partner</span>
              </div>
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

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'appointments', label: 'Appointments' },
            { id: 'profile', label: 'Profile' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedTab === tab.id
                  ? 'bg-[#84CC16] text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {selectedTab === 'overview' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label="Total Visits"
                value={stats.totalVisits.toString()}
                subtext={`${stats.thisMonth} this month`}
                color="#84CC16"
              />
              <StatCard
                icon={<DollarSign className="w-5 h-5" />}
                label="Revenue"
                value={stats.totalRevenue}
                subtext="All time"
                color="#14B8A6"
              />
              <StatCard
                icon={<Star className="w-5 h-5" />}
                label="Avg Rating"
                value={stats.avgRating.toString()}
                subtext="From 127 reviews"
                color="#F59E0B"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Pulse Bookings"
                value={stats.pulseBookings.toString()}
                subtext={`${stats.discountedVisits} discounted`}
                color="#A855F7"
              />
            </div>

            {/* Today's Summary */}
            <div className="bg-gradient-to-br from-[#84CC16]/10 to-[#84CC16]/5 border border-[#84CC16]/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-foreground">Today's Schedule</p>
                <Calendar className="w-4 h-4 text-[#84CC16]" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{stats.todayAppts}</p>
              <p className="text-sm text-muted-foreground">appointments scheduled</p>
              <div className="mt-3 pt-3 border-t border-[#84CC16]/20">
                <p className="text-xs text-muted-foreground">
                  {stats.pendingAppts} pending confirmations
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Recent Appointments
              </p>
              <div className="space-y-2">
                {recentAppointments.slice(0, 3).map((appt) => (
                  <AppointmentCard key={appt.id} appointment={appt} />
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'appointments' && (
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                All Appointments ({recentAppointments.length})
              </p>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{stats.pendingAppts} pending</span>
              </div>
            </div>
            {recentAppointments.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} detailed />
            ))}
          </div>
        )}

        {selectedTab === 'profile' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            {/* Clinic Info */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-foreground">Clinic Information</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-foreground text-sm font-medium"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </motion.button>
              </div>
              <div className="space-y-3">
                <InfoRow icon={<MapPin />} label="Address" value={clinic.address} />
                <InfoRow icon={<Phone />} label="Phone" value={clinic.phone} />
                <InfoRow icon={<Mail />} label="Email" value={clinic.email} />
                <InfoRow icon={<Clock />} label="Hours" value={clinic.hours} />
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-sm font-semibold text-foreground mb-3">Medical Specialties</p>
              <div className="flex flex-wrap gap-2">
                {clinic.specialties.map((specialty) => (
                  <div
                    key={specialty}
                    className="px-3 py-1.5 rounded-xl bg-[#84CC16]/10 text-[#84CC16] text-sm font-medium border border-[#84CC16]/20"
                  >
                    {specialty}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-sm font-semibold text-foreground mb-3">Pricing</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Standard Consultation</span>
                  <span className="text-sm font-bold text-foreground">{clinic.pricing}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pulse Partner Discount</span>
                  <span className="text-sm font-bold text-[#84CC16]">Up to {clinic.discount}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
    </div>
  );
}

// Appointment Card Component
function AppointmentCard({
  appointment,
  detailed = false,
}: {
  appointment: {
    id: number;
    patientName: string;
    time: string;
    type: string;
    status: 'confirmed' | 'pending';
    discount: string;
  };
  detailed?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-bold text-foreground">{appointment.patientName}</p>
            {appointment.status === 'confirmed' ? (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#84CC16]/10">
                <Check className="w-3 h-3 text-[#84CC16]" />
                <span className="text-xs font-semibold text-[#84CC16]">Confirmed</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F97316]/10">
                <AlertCircle className="w-3 h-3 text-[#F97316]" />
                <span className="text-xs font-semibold text-[#F97316]">Pending</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {appointment.time}
            </span>
            <span>·</span>
            <span>{appointment.type}</span>
            <span>·</span>
            <span className="text-[#84CC16] font-semibold">{appointment.discount} Pulse discount</span>
          </div>
        </div>
        {detailed && appointment.status === 'pending' && (
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 rounded-xl bg-[#84CC16] text-white text-xs font-semibold"
            >
              Accept
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 rounded-xl border border-border text-muted-foreground text-xs font-semibold"
            >
              Decline
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

// Info Row Component
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm text-foreground font-medium">{value}</p>
      </div>
    </div>
  );
}
