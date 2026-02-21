'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Star, Zap, Shield, Gift, CreditCard, Calendar, X, ExternalLink } from 'lucide-react';
import { userProfile } from '@/lib/mock-data';

interface BillingViewProps {
  onBack: () => void;
}

const TIERS = [
  { name: 'Starter', weeks: '1–4 weeks', discount: '10%', color: '#84CC16', emoji: '🌱', perks: ['10% off clinic visits', 'Daily check-in tracking', 'Basic AI insights'] },
  { name: 'Regular', weeks: '1–3 months', discount: '20%', color: '#14B8A6', emoji: '⚡', perks: ['20% off clinic visits', 'Priority booking', 'Weekly health summary', 'Full AI pattern detection'] },
  { name: 'Committed', weeks: '3–6 months', discount: '30%', color: '#A855F7', emoji: '💎', perks: ['30% off clinic visits', 'One free basic checkup/year', 'Advanced AI insights', 'Emergency contact alerts'] },
  { name: 'Champion', weeks: '6+ months', discount: '40%', color: '#F97316', emoji: '🏆', perks: ['40% off clinic visits', 'Free annual checkup', 'Premium AI insights', 'VIP clinic access'] },
];

function getTierIndex(streak: number): number {
  const weeks = streak / 7;
  if (weeks < 4) return 0;
  if (weeks < 12) return 1;
  if (weeks < 24) return 2;
  return 3;
}

export function BillingView({ onBack }: BillingViewProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [showManageModal, setShowManageModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showBillingHistory, setShowBillingHistory] = useState(false);
  const currentTierIndex = getTierIndex(userProfile.streak);
  const currentTier = TIERS[currentTierIndex];

  // Mock billing history
  const billingHistory = [
    { date: '2025-02-01', amount: 14400, plan: 'Annual', status: 'Paid', method: 'Visa •••• 4242' },
    { date: '2024-02-01', amount: 14400, plan: 'Annual', status: 'Paid', method: 'Visa •••• 4242' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background px-4 pt-6 pb-4 border-b border-border flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.95 }} onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <div>
          <h2 className="text-xl font-bold text-foreground">Tier & Benefits</h2>
          <p className="text-xs text-muted-foreground">Your loyalty unlocks real rewards</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-2xl mx-auto w-full">
        {/* Current status */}
        <div className="rounded-3xl p-5 border-2 border-[#84CC16]" style={{ background: '#84CC1608' }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{currentTier.emoji}</span>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Current Tier</p>
              <p className="text-2xl font-bold text-foreground">{currentTier.name}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-muted-foreground">Discount</p>
              <p className="text-2xl font-bold text-[#84CC16]">{currentTier.discount}</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {currentTier.perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-[#84CC16] shrink-0" />
                {perk}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Streak: <span className="text-foreground font-semibold">{userProfile.streak} days</span> · Consistency: <span className="text-foreground font-semibold">5/7 days/week</span></p>
          </div>
        </div>

        {/* All tiers */}
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">All Tiers</p>
        {TIERS.map((tier, i) => {
          const isCurrent = i === currentTierIndex;
          const isAchieved = i < currentTierIndex;
          return (
            <div
              key={tier.name}
              className={`rounded-2xl p-4 border transition-all ${
                isCurrent ? 'border-[#84CC16] bg-[#84CC16]/5' : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tier.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-foreground">{tier.name}</p>
                    {isCurrent && <span className="text-xs bg-[#84CC16] text-white px-2 py-0.5 rounded-full font-bold">Current</span>}
                    {isAchieved && <Check className="w-4 h-4 text-[#84CC16]" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{tier.weeks} consistent</p>
                </div>
                <p className="text-lg font-bold" style={{ color: tier.color }}>{tier.discount} off</p>
              </div>
            </div>
          );
        })}

        {/* Subscription */}
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pt-2">Subscription</p>
        <div className="flex gap-3">
          {(['monthly', 'annual'] as const).map((plan) => (
            <motion.button
              key={plan}
              onClick={() => setSelectedPlan(plan)}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 py-4 rounded-2xl border-2 transition-all ${
                selectedPlan === plan ? 'border-[#84CC16] bg-[#84CC16]/10' : 'border-border bg-card'
              }`}
            >
              <p className={`text-sm font-bold capitalize ${selectedPlan === plan ? 'text-[#84CC16]' : 'text-foreground'}`}>{plan}</p>
              <p className="text-lg font-bold text-foreground mt-1">
                {plan === 'monthly' ? '₦1,500' : '₦14,400'}
              </p>
              {plan === 'annual' && (
                <p className="text-xs text-[#84CC16] font-semibold mt-0.5">Save 20%</p>
              )}
            </motion.button>
          ))}
        </div>

        {/* What you get */}
        <div className="bg-muted rounded-2xl p-4 space-y-3">
          {[
            { icon: Zap, label: 'Daily AI health analysis after check-in' },
            { icon: Shield, label: 'Secure, encrypted health data' },
            { icon: Star, label: `${currentTier.discount} off partner clinic visits` },
            { icon: Gift, label: 'Milestone rewards at 7, 30, 90 days' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-[#84CC16] shrink-0" />
              <p className="text-sm text-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Discount code */}
        <div className="bg-[#84CC16]/10 border border-[#84CC16] rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1 font-semibold">Active Discount Code</p>
          <p className="text-lg font-mono font-bold text-foreground">PULSE-AMR-2024</p>
          <p className="text-xs text-muted-foreground mt-1">Valid for 30 days · Use at any partner clinic</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowManageModal(true)}
          className="w-full py-4 rounded-2xl bg-[#84CC16] text-white font-bold text-base hover:bg-[#84CC16]/90 transition-colors"
        >
          Manage Subscription
        </motion.button>

        <p className="text-center text-xs text-muted-foreground pb-4">
          Cancel anytime. No commitments.
        </p>
      </div>

      {/* Manage Subscription Modal */}
      <AnimatePresence>
        {showManageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowManageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-3xl overflow-hidden w-full max-w-md"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Manage Subscription</h3>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowManageModal(false)}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>
              <div className="p-6 space-y-3">
                <ManageButton
                  icon={<CreditCard className="w-5 h-5" />}
                  label="Change Payment Method"
                  description="Update your card details"
                  onClick={() => {
                    setShowManageModal(false);
                    setShowPaymentMethodModal(true);
                  }}
                />
                <ManageButton
                  icon={<Calendar className="w-5 h-5" />}
                  label="Billing History"
                  description="View past payments"
                  onClick={() => {
                    setShowManageModal(false);
                    setShowBillingHistory(true);
                  }}
                />
                <ManageButton
                  icon={<Star className="w-5 h-5" />}
                  label="Change Plan"
                  description={`Currently on ${selectedPlan} plan`}
                  onClick={() => {
                    setShowManageModal(false);
                    // Scroll to plan selection
                  }}
                />
                <ManageButton
                  icon={<ExternalLink className="w-5 h-5" />}
                  label="Cancel Subscription"
                  description="We'll be sad to see you go"
                  onClick={() => {
                    alert('Cancellation flow would be here');
                  }}
                  danger
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Method Modal */}
      <AnimatePresence>
        {showPaymentMethodModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentMethodModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-3xl overflow-hidden w-full max-w-md"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Payment Methods</h3>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPaymentMethodModal(false)}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>
              <div className="p-6 space-y-3">
                <div className="bg-card border-2 border-[#84CC16] rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#84CC16]/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-[#84CC16]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">Visa ending in 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/26</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#84CC16]/10 text-[#84CC16] text-xs font-semibold">
                      Default
                    </div>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-border text-muted-foreground font-semibold text-sm hover:border-[#84CC16] hover:text-[#84CC16] transition-colors"
                >
                  + Add New Payment Method
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Billing History Modal */}
      <AnimatePresence>
        {showBillingHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowBillingHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-3xl overflow-hidden w-full max-w-md max-h-[80vh]"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Billing History</h3>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBillingHistory(false)}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>
              <div className="p-6 space-y-3 overflow-y-auto">
                {billingHistory.map((item, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold text-foreground">{item.plan} Subscription</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-[#84CC16]/10 text-[#84CC16] text-xs font-semibold">
                        {item.status}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">{item.method}</span>
                      <span className="text-sm font-bold text-foreground">₦{item.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                <p className="text-center text-xs text-muted-foreground pt-2">
                  All payments secured by Paystack
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ManageButton({
  icon,
  label,
  description,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-[#84CC16]/40 bg-card hover:shadow-md transition-all text-left"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#84CC16]/10 text-[#84CC16]'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-bold ${danger ? 'text-[#EF4444]' : 'text-foreground'}`}>{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </motion.button>
  );
}
