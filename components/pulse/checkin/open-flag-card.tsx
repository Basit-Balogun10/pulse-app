'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

interface Props {
  onValue: (v: string) => void;
  onNext: () => void;
  value?: string;
}

const CHIPS = [
  'Feeling a bit off today',
  'More tired than usual',
  'Had a headache earlier',
  'Stressed about work',
];

export function OpenFlagCard({ onValue, onNext }: Props) {
  const [note, setNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleChip = (chip: string) => { setNote(chip); onValue(chip); };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { setNote(e.target.value); onValue(e.target.value); };
  const handleSkip = () => { onValue(''); onNext(); };
  const handleDone = () => { onValue(note); onNext(); };

  const startVoice = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) { 
        alert('Voice input not supported in this browser.'); 
        return; 
      }
      
      const recognition = new SR();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognitionRef.current = recognition;
      
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration counter
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        const newNote = note ? note + ' ' + transcript : transcript;
        setNote(newNote);
        onValue(newNote);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
      };
      
      recognition.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsRecording(false);
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
        if (e.error === 'not-allowed') {
          alert('Microphone permission denied. Please enable it in your browser settings.');
        }
      };
      
      recognition.start();
    } catch (error) {
      console.error('Microphone access error:', error);
      alert('Unable to access microphone. Please check your browser permissions.');
    }
  };

  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-lg p-6 select-none">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Notes</p>
      <h3 className="text-xl font-bold text-foreground mb-2">Anything unusual today?</h3>
      <p className="text-sm text-muted-foreground mb-4">Didn't fit the other cards? Share here — optional.</p>

      <div className="space-y-3">
      {/* Textarea */}
      <div
        className={`bg-muted rounded-2xl p-4 mb-3 border-2 transition-colors ${
          note.length > 0 ? 'border-[#84CC16]' : 'border-transparent'
        }`}
      >
        <textarea
          value={note}
          onChange={handleChange}
          placeholder="e.g. Just feeling a bit off again..."
          maxLength={200}
          rows={3}
          className="w-full bg-transparent focus:outline-none text-foreground text-sm resize-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{note.length}/200</span>
          <div className="flex items-center gap-2">
            {note.length > 0 && (
              <button onClick={() => { setNote(''); onValue(''); }} className="text-xs text-muted-foreground hover:text-foreground">
                Clear
              </button>
            )}
            <motion.button
              onClick={isRecording ? stopVoice : startVoice}
              whileTap={{ scale: 0.95 }}
              animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
              transition={isRecording ? { duration: 0.8, repeat: Infinity } : {}}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isRecording
                  ? 'bg-red-500/10 text-red-500 border border-red-500/30'
                  : 'bg-muted-foreground/10 text-muted-foreground border border-transparent hover:border-border'
              }`}
            >
              {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              {isRecording ? `Recording... ${recordingDuration}s` : 'Voice'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick-pick chips */}
      <AnimatePresence>
        {note.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {CHIPS.map((chip) => (
              <motion.button
                key={chip}
                onClick={() => handleChip(chip)}
                whileTap={{ scale: 0.97 }}
                className="shrink-0 px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground font-medium hover:bg-muted/70 transition-colors whitespace-nowrap"
              >
                {chip}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button only */}
      <motion.button
        onClick={handleSkip}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3 rounded-2xl border-2 border-border text-muted-foreground font-semibold text-sm hover:bg-muted transition-colors"
      >
        Skip
      </motion.button>
      </div>
    </div>
  );
}
