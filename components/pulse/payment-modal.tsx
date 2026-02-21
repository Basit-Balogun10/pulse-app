'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Building2,
  Wallet,
  X,
  Check,
  AlertCircle,
  ArrowLeft,
  Lock,
  Sparkles,
} from 'lucide-react';

interface PaymentModalProps {
  clinicName: string;
  consultationType: 'consultation' | 'follow-up';
  originalPrice: number;
  discountPercent: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({
  clinicName,
  consultationType,
  originalPrice,
  discountPercent,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'wallet' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const discountAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - discountAmount;

  const handleMethodSelect = (method: typeof paymentMethod) => {
    setPaymentMethod(method);
    setStep('details');
  };

  const handlePayment = () => {
    setStep('processing');
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2500);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

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
        className="bg-background rounded-3xl overflow-hidden w-full max-w-md"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 'details' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep('method')}
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </motion.button>
            )}
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {step === 'method' && 'Payment Method'}
                {step === 'details' && 'Payment Details'}
                {step === 'processing' && 'Processing...'}
                {step === 'success' && 'Payment Successful'}
              </h2>
              {step === 'method' && (
                <p className="text-sm text-muted-foreground">Choose how to pay</p>
              )}
            </div>
          </div>
          {step !== 'processing' && step !== 'success' && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
            >
              <X className="w-5 h-5 text-foreground" />
            </motion.button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 'method' && (
              <motion.div
                key="method"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {/* Booking Summary */}
                <div className="bg-gradient-to-br from-[#84CC16]/10 to-[#84CC16]/5 border border-[#84CC16]/20 rounded-2xl p-4 mb-4">
                  <p className="text-sm font-semibold text-foreground mb-2">{clinicName}</p>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm text-muted-foreground capitalize">{consultationType}</span>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground line-through mr-2">₦{originalPrice.toLocaleString()}</span>
                      <span className="text-xl font-bold text-[#84CC16]">₦{finalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#84CC16]">
                    <Sparkles className="w-3 h-3" />
                    <span>You saved ₦{discountAmount.toLocaleString()} ({discountPercent}% Pulse discount)</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <PaymentMethodButton
                  icon={<CreditCard className="w-5 h-5" />}
                  label="Card Payment"
                  description="Mastercard, Visa, Verve"
                  onClick={() => handleMethodSelect('card')}
                />
                <PaymentMethodButton
                  icon={<Building2 className="w-5 h-5" />}
                  label="Bank Transfer"
                  description="Direct bank transfer"
                  onClick={() => handleMethodSelect('transfer')}
                />
                <PaymentMethodButton
                  icon={<Wallet className="w-5 h-5" />}
                  label="Wallet"
                  description="Pay with saved balance"
                  onClick={() => handleMethodSelect('wallet')}
                />

                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                  <Lock className="w-3 h-3" />
                  <span>Secured by Paystack. Your payment information is encrypted.</span>
                </div>
              </motion.div>
            )}

            {step === 'details' && paymentMethod === 'card' && (
              <motion.div
                key="card-details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-br from-[#84CC16] to-[#65A30D] rounded-2xl p-6 text-white mb-4">
                  <div className="flex items-center justify-between mb-6">
                    <CreditCard className="w-8 h-8" />
                    <span className="text-xs font-semibold">PULSE</span>
                  </div>
                  <p className="text-xl font-mono mb-4 tracking-wider">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </p>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs opacity-70 mb-1">VALID THRU</p>
                      <p className="text-sm font-mono">{expiryDate || 'MM/YY'}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70 mb-1">CVV</p>
                      <p className="text-sm font-mono">{cvv ? '•••' : '•••'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value.replace(/\D/g, '')))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-[#84CC16] focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setExpiryDate(value);
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-[#84CC16] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-[#84CC16] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePayment}
                  disabled={!cardNumber || !expiryDate || !cvv || cardNumber.replace(/\s/g, '').length < 16}
                  className="w-full py-4 rounded-2xl bg-[#84CC16] text-white font-bold text-base hover:bg-[#84CC16]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay ₦{finalPrice.toLocaleString()}
                </motion.button>
              </motion.div>
            )}

            {step === 'details' && paymentMethod === 'transfer' && (
              <motion.div
                key="transfer-details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="bg-muted rounded-2xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground">Transfer to:</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Bank Name</p>
                      <p className="text-sm font-mono font-bold text-foreground">Kuda Microfinance Bank</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Account Number</p>
                      <p className="text-sm font-mono font-bold text-foreground">2000123456</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Account Name</p>
                      <p className="text-sm font-mono font-bold text-foreground">PULSE HEALTH SERVICES</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="text-lg font-bold text-[#84CC16]">₦{finalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-[#F97316]/10 border border-[#F97316]/20 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Your booking will be confirmed automatically after payment is received (usually within 5 minutes).
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePayment}
                  className="w-full py-4 rounded-2xl bg-[#84CC16] text-white font-bold text-base hover:bg-[#84CC16]/90 transition-colors"
                >
                  I've Made the Transfer
                </motion.button>
              </motion.div>
            )}

            {step === 'details' && paymentMethod === 'wallet' && (
              <motion.div
                key="wallet-details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-br from-[#A855F7]/10 to-[#84CC16]/10 border border-[#A855F7]/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#A855F7]/20 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-[#A855F7]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Wallet Balance</p>
                      <p className="text-2xl font-bold text-foreground">₦24,500</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Amount to pay</span>
                      <span className="font-bold text-foreground">₦{finalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Balance after payment</span>
                      <span className="font-bold text-[#84CC16]">₦{(24500 - finalPrice).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePayment}
                  className="w-full py-4 rounded-2xl bg-[#84CC16] text-white font-bold text-base hover:bg-[#84CC16]/90 transition-colors"
                >
                  Pay from Wallet
                </motion.button>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full border-4 border-[#84CC16]/20 border-t-[#84CC16] animate-spin mb-4" />
                <p className="text-lg font-bold text-foreground mb-2">Processing Payment</p>
                <p className="text-sm text-muted-foreground">Please wait...</p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-[#84CC16] flex items-center justify-center mb-4"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg font-bold text-foreground mb-2"
                >
                  Payment Successful!
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-muted-foreground text-center"
                >
                  Your appointment has been confirmed.
                  <br />
                  Check your email for details.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PaymentMethodButton({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-[#84CC16]/40 bg-card hover:shadow-md transition-all text-left"
    >
      <div className="w-12 h-12 rounded-xl bg-[#84CC16]/10 flex items-center justify-center text-[#84CC16] shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </motion.button>
  );
}
