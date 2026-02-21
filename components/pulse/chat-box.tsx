'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle, Maximize2, Minimize2, Paperclip, Image as ImageIcon, Mic, Sparkles } from 'lucide-react';
import { streamGeminiResponse } from '@/lib/gemini';
import { userProfile } from '@/lib/mock-data';
import { amaraFullStory, amaraChatDetections, type ChatDetection } from '@/lib/amara-story-data';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  checkInHistory?: typeof amaraFullStory;
  currentConcerns?: string[];
}

export function ChatBox({ isOpen, onClose, checkInHistory = amaraFullStory, currentConcerns = [] }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: `Hi ${userProfile.name}! I'm Pulse AI and I have full context of your health journey. I've been tracking your 14-day check-in history and noticed some patterns. Ask me anything about your wellness, symptoms, or recommendations!`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState<ChatDetection[]>([]);
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

    const userInput = inputValue.trim();
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Detect health-related information in user message
    detectHealthInfo(userInput);

    // Create streaming AI message placeholder
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      text: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    
    setMessages((prev) => [...prev, aiMessage]);

    try {
      // Build health context for AI
      const healthContext = buildHealthContext(checkInHistory, currentConcerns);
      const prompt = `${healthContext}\n\nUser question: ${userInput}\n\nProvide a helpful, empathetic response based on the health data above. Be specific and reference patterns when relevant.`;

      let fullResponse = '';
      
      await streamGeminiResponse(
        prompt,
        (chunk) => {
          fullResponse += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, text: fullResponse, isStreaming: true }
                : msg
            )
          );
        },
        () => {
          // On complete
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
          setIsLoading(false);
        },
        (error) => {
          console.error('Chat error:', error);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, text: 'I apologize, but I encountered an error. Please try again.', isStreaming: false }
                : msg
            )
          );
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  // Build comprehensive health context for AI
  const buildHealthContext = (history: typeof amaraFullStory, concerns: string[]) => {
    const recentDays = history.slice(-7); // Last 7 days
    const todayEntry = history[history.length - 1];
    
    let context = `HEALTH PROFILE:\n`;
    context += `Name: ${userProfile.name}\n`;
    context += `Age: ${userProfile.age}\n`;
    context += `Family History: ${userProfile.familyHistory?.join(', ') || 'None'}\n`;
    context += `Last Checkup: ${userProfile.lastCheckup || 'Unknown'}\n\n`;
    
    context += `RECENT CHECK-IN SUMMARY (Last 7 days):\n`;
    recentDays.forEach((day, idx) => {
      context += `Day ${idx + 1} (${day.date}):\n`;
      context += `  Energy: ${day.energy}/5\n`;
      context += `  Sleep: ${day.sleep?.hours || 'N/A'}hrs, Quality: ${day.sleep?.quality || 'N/A'}\n`;
      context += `  Mood: ${day.mood}/5\n`;
      if (day.symptoms && day.symptoms.length > 0) {
        context += `  Symptoms: ${day.symptoms.join(', ')}\n`;
      }
    });
    
    if (todayEntry.aiAnalysis) {
      context += `\nTODAY'S AI ANALYSIS:\n${todayEntry.aiAnalysis}\n`;
    }
    
    if (concerns.length > 0) {
      context += `\nCURRENT CONCERNS: ${concerns.join(', ')}\n`;
    }
    
    return context;
  };

  // Detect health information from user messages
  const detectHealthInfo = (message: string) => {
    const lowerMessage = message.toLowerCase();
    const detected: Partial<ChatDetection> = {
      date: new Date().toISOString().split('T')[0],
      source: 'chat',
    };

    // Detect symptoms
    const symptomKeywords = ['pain', 'ache', 'fever', 'headache', 'nausea', 'dizzy', 'tired', 'fatigue'];
    const foundSymptoms = symptomKeywords.filter(s => lowerMessage.includes(s));
    if (foundSymptoms.length > 0) {
      detected.type = 'symptom';
      detected.value = foundSymptoms.join(', ');
      detected.context = message;
    }

    // Detect medications
    if (lowerMessage.includes('taking') || lowerMessage.includes('medication') || lowerMessage.includes('pill')) {
      detected.type = 'medication';
      detected.context = message;
    }

    // Detect lifestyle changes
    if (lowerMessage.includes('started') || lowerMessage.includes('stopped') || lowerMessage.includes('changed')) {
      detected.type = 'lifestyle_change';
      detected.context = message;
    }

    // Store detection if found
    if (detected.type) {
      setDetectedInfo((prev) => [...prev, detected as ChatDetection]);
      console.log('Health info detected:', detected);
    }
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

            {/* Health Context Banner */}
            {detectedInfo.length > 0 && (
              <div className="px-6 py-3 bg-[#818CF8]/10 border-b border-[#818CF8]/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#818CF8]" />
                  <p className="text-xs font-medium text-[#818CF8]">
                    Detected {detectedInfo.length} health insight{detectedInfo.length > 1 ? 's' : ''} from your messages
                  </p>
                </div>
              </div>
            )}

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
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                    {message.isStreaming && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-1 h-1 bg-[#818CF8] rounded-full animate-pulse" />
                        <span className="text-xs text-muted-foreground">AI is typing...</span>
                      </div>
                    )}
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
