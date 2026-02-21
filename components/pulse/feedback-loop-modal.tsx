'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, Clock, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeedbackLoopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onYesBooked: () => void;
  onYesWent: (reportFile?: File) => void;
  onNoDidntGo: () => void;
  onRemindLater: () => void;
}

export function FeedbackLoopModal({
  isOpen,
  onClose,
  onYesBooked,
  onYesWent,
  onNoDidntGo,
  onRemindLater,
}: FeedbackLoopModalProps) {
  const [step, setStep] = useState<'initial' | 'booked' | 'went'>('initial');
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (validTypes.includes(file.type)) {
        setReportFile(file);
      } else {
        alert('Please upload a PDF or image file (JPG, PNG)');
      }
    }
  };

  const handleSubmitReport = async () => {
    setUploading(true);
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setUploading(false);
    onYesWent(reportFile || undefined);
    handleClose();
  };

  const handleClose = () => {
    setStep('initial');
    setReportFile(null);
    setUploading(false);
    onClose();
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-background rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-[#818CF8]/10 to-[#A855F7]/10 px-6 py-5 border-b border-border">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <h2 className="text-xl font-bold text-foreground pr-8">
                {step === 'initial' && 'Checkup Follow-up'}
                {step === 'booked' && 'Great! Appointment Details'}
                {step === 'went' && 'Upload Doctor Report'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {step === 'initial' && 'We recommended a checkup. Did you take action?'}
                {step === 'booked' && 'Have you attended your appointment yet?'}
                {step === 'went' && 'Help us improve by sharing your report (optional)'}
              </p>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              {step === 'initial' && (
                <div className="space-y-3">
                  <Button
                    onClick={() => setStep('booked')}
                    className="w-full bg-[#84CC16] hover:bg-[#84CC16]/90 text-white font-semibold py-6 rounded-2xl flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Yes, I booked an appointment
                  </Button>

                  <Button
                    onClick={() => {
                      onNoDidntGo();
                      handleClose();
                    }}
                    variant="outline"
                    className="w-full py-6 rounded-2xl flex items-center justify-center gap-2 border-2"
                  >
                    <XCircle className="w-5 h-5" />
                    No, I haven't yet
                  </Button>

                  <Button
                    onClick={() => {
                      onRemindLater();
                      handleClose();
                    }}
                    variant="ghost"
                    className="w-full py-6 rounded-2xl flex items-center justify-center gap-2"
                  >
                    <Clock className="w-5 h-5" />
                    Remind me later
                  </Button>
                </div>
              )}

              {step === 'booked' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-4">
                    Have you already attended your appointment and received a doctor's report?
                  </p>

                  <Button
                    onClick={() => setStep('went')}
                    className="w-full bg-[#84CC16] hover:bg-[#84CC16]/90 text-white font-semibold py-6 rounded-2xl flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Yes, I went and have a report
                  </Button>

                  <Button
                    onClick={() => {
                      onYesBooked();
                      handleClose();
                    }}
                    variant="outline"
                    className="w-full py-6 rounded-2xl flex items-center justify-center gap-2 border-2"
                  >
                    <Clock className="w-5 h-5" />
                    Not yet, appointment is upcoming
                  </Button>
                </div>
              )}

              {step === 'went' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Uploading your report helps us validate our AI recommendations and improve accuracy. This is completely optional.
                  </p>

                  {/* File Upload Area */}
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="report-upload"
                    />
                    <label
                      htmlFor="report-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-[#818CF8] transition-colors bg-muted/30"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium text-foreground">
                        {reportFile ? reportFile.name : 'Tap to upload report'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, JPG, or PNG
                      </p>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={handleSubmitReport}
                      disabled={uploading}
                      className="w-full bg-[#84CC16] hover:bg-[#84CC16]/90 text-white font-semibold py-6 rounded-2xl"
                    >
                      {uploading ? 'Uploading...' : reportFile ? 'Submit Report' : 'Skip & Continue'}
                    </Button>

                    {reportFile && (
                      <Button
                        onClick={() => {
                          onYesWent(undefined);
                          handleClose();
                        }}
                        variant="ghost"
                        className="w-full py-4 rounded-2xl"
                      >
                        Skip upload
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
