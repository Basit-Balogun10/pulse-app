'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle, Maximize2, Minimize2, Paperclip, Image as ImageIcon, Mic } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatBox({ isOpen, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: 'Hi! I\'m Pulse AI. I\'ve analyzed your health data and noticed some interesting patterns. Ask me anything about your wellness!',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: generateAIResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('energy') || lowerInput.includes('tired')) {
      return 'I notice your energy levels have been fluctuating. Try getting more consistent sleep—your sleep quality has a direct impact on daily energy. Also, staying hydrated and moving throughout the day can help stabilize your energy.';
    }

    if (lowerInput.includes('sleep')) {
      return 'Your sleep patterns show you\'re averaging 7-8 hours, which is great! The key is maintaining consistency. Try keeping the same bedtime and wake time daily. Your mood and energy both improve when sleep is regular.';
    }

    if (lowerInput.includes('mood') || lowerInput.includes('feeling')) {
      return 'Your mood has been generally positive, with a few dips that correlate with lower sleep quality. When you\'re getting good rest and staying active, your mood metrics improve significantly. Keep monitoring this.';
    }

    if (lowerInput.includes('appointment') || lowerInput.includes('clinic')) {
      return 'Based on your recent data, I recommend scheduling a wellness check-up. I\'ve noticed some mild respiratory variations that would be good to discuss with a professional. Would you like me to show you nearby clinics?';
    }

    if (lowerInput.includes('symptom')) {
      return 'Your symptom tracking shows mostly clear days with occasional mild fatigue. This is a positive trend! Keep tracking consistently so we can identify any patterns early.';
    }

    return 'That\'s a great question! Based on your health data, I\'d recommend focusing on consistent sleep schedules and staying hydrated. These two factors have the biggest impact on your overall wellness score. Is there anything specific you\'d like to explore?';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: `📎 Attached: ${file.name}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          text: 'I\'ve received your file. In a full implementation, I\'d analyze medical documents, lab results, or prescription images to provide personalized health insights.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 1000);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: `🖼️ Image attached: ${file.name}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          text: 'Image received! I can help analyze medical photos, skin conditions, prescription bottles, or health-related images to provide insights.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 1000);
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice input completion
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: '🎤 Voice message: "How can I improve my sleep quality?"',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          text: generateAIResponse('sleep'),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1000);
    } else {
      setIsRecording(true);
    }
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
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Chat Modal */}
          <motion.div
            initial={{ y: 600, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              height: isFullscreen ? '100vh' : '70vh',
              borderRadius: isFullscreen ? '0px' : '24px 24px 0 0'
            }}
            exit={{ y: 600, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed ${isFullscreen ? 'inset-0' : 'bottom-0 left-0 right-0'} bg-card shadow-2xl z-50 flex flex-col border-t border-border`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#84CC16]/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#84CC16]" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Pulse AI</h3>
                  <p className="text-xs text-muted-foreground">Your health companion</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-5 h-5 text-foreground" />
                  ) : (
                    <Maximize2 className="w-5 h-5 text-foreground" />
                  )}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-foreground" />
                </motion.button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-[#84CC16] text-white rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.type === 'user'
                          ? 'text-white/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted text-foreground px-4 py-3 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 pt-4 border-t border-border">
              {/* Media Buttons Row */}
              <div className="flex items-center gap-2 mb-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted hover:bg-muted/70 transition-colors text-foreground text-sm font-medium"
                >
                  <Paperclip className="w-4 h-4" />
                  <span>File</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted hover:bg-muted/70 transition-colors text-foreground text-sm font-medium"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Image</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleVoiceInput}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors text-sm font-medium ${
                    isRecording 
                      ? 'bg-red-500 text-white' 
                      : 'bg-muted hover:bg-muted/70 text-foreground'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{isRecording ? 'Recording...' : 'Voice'}</span>
                </motion.button>
              </div>

              {/* Text Input + Send */}
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-muted border-2 border-transparent focus:border-[#84CC16] focus:outline-none text-foreground"
                />
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-[#84CC16] text-white p-3 rounded-2xl hover:bg-[#84CC16]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </form>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
