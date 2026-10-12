import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  Compass,
  BookOpen,
  Heart,
  Rocket,
  ShieldAlert,
  SlidersHorizontal,
  ExternalLink,
  Layers,
  Database
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEcosystem } from '../context/EcosystemContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

const QUICK_PROMPTS = [
  'What are the 9 Canonical Hubs of meUus?',
  'How does the Master Soul Profile protect privacy?',
  'How do Google Sheets & Cloud SQL work in this app?',
  'What is the 15-Minute Human Emergency Protocol?',
  'Explain the axiom: "Claim ≤ Evidence"',
  'How can I start a 90-Day Transformation sprint?'
];

export default function GeminiChatDrawer() {
  const { isAiDrawerOpen, aiPromptContext, openAiGuide, closeAiGuide, stats } = useEcosystem();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: 'Salam & Welcome! I am your meUus AI Intelligence Guide. Ask me anything about our 9 Canonical Hubs, 4 Domains, Google Workspace tools, Cloud SQL integrations, or your personal growth journey.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.7-flash'
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.7-flash' | 'pro' | 'lite'>('gemini-3.7-flash');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // If context prompt arrives from an external hub button (e.g. from Soul Profile or DLAS), auto-send
  useEffect(() => {
    if (isAiDrawerOpen && aiPromptContext) {
      handleSendMessage(aiPromptContext);
    }
  }, [isAiDrawerOpen, aiPromptContext]);

  useEffect(() => {
    if (isAiDrawerOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isAiDrawerOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content
          })),
          model: selectedModel,
          systemInstruction: `You are meUus Assistant — an empowering, truthful, and culturally grounded companion for human development in Bangladesh.
Foundational Covenant: "Claim ≤ Evidence" — never hallucinate or overstate capabilities.
Motto: "Consistent, Honest Action Over Perfection".
Domain Hierarchy:
1. Understand (meuus.org) - Public Governance & The 9 Pillars
2. Learn (meuussoul.com) - Qur'an, Seerah & Practical Skills
3. Reflect (meUusSoulAI) - Mind Beautifier & Emotional Growth
4. Act (meuus.app) - Two-Way Marketplace & Workspace/Cloud SQL Integrations.
User Ecosystem Context:
- Master Soul Readiness: ${stats.soulReadinessScore}%
- 90-Day Sprint Progress: Day ${stats.completedSprintDays}
- Reflections Logged: ${stats.totalReflectionsLogged}
Provide concise, organized, and helpful answers formatted with bullet points where appropriate.`
        })
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.text || 'I am standing with you. Let us take one honest step forward.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model || selectedModel
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMessage: ChatMessage = {
        id: `model-err-${Date.now()}`,
        role: 'model',
        content: 'I apologize for the momentary connection pause. meUus is designed around 9 Canonical Hubs with Cloud SQL and Google Workspace synchronization. How can I assist your journey right now?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'offline-compassion'
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        content: 'Conversation refreshed. How can I walk beside your journey today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Button (FAB) with Pulse Indicator */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          id="meuus-gemini-fab"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => openAiGuide()}
          className="relative group p-4 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-2xl shadow-emerald-950/80 border border-emerald-400/40 flex items-center justify-center transition-transform"
          title="Ask meUus Gemini AI"
        >
          <Sparkles className="w-6 h-6 animate-spin-slow" />
          
          {/* Active Ping Indicator */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5 -mt-0.5 -mr-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-slate-950"></span>
          </span>

          {/* Hover Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-mono font-bold text-emerald-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Ask meUus AI
          </span>
        </motion.button>
      </div>

      {/* Slide-in Chat Drawer */}
      <AnimatePresence>
        {isAiDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAiGuide}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            />

            {/* Main Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              role="complementary"
              aria-label="AI Chat Assistant"
              className="absolute inset-y-0 right-0 max-w-full w-full sm:max-w-lg md:max-w-xl bg-white border-l border-gray-200 shadow-2xl flex flex-col justify-between overflow-hidden text-gray-900"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200 bg-white/95 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-serif font-bold text-lg shadow-sm">
                    m
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-serif font-bold text-gray-900">meUus Intelligence</h3>
                      <Badge variant="outline" className="text-[9px] font-mono text-emerald-700 border-emerald-300 bg-emerald-50 py-0">
                        Gemini 3.7
                      </Badge>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono">Conversational Ecosystem Assistant</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetChat}
                    className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors shadow-sm"
                    title="Clear Conversation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={closeAiGuide}
                    className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors shadow-sm"
                    title="Close Drawer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Model & Config Sub-Bar */}
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-[11px] font-mono text-gray-600">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3 h-3 text-emerald-600" />
                  <span>Model:</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as any)}
                    className="bg-white border border-gray-300 text-emerald-700 font-medium rounded-lg px-2 py-0.5 text-xs outline-none shadow-sm"
                  >
                    <option value="gemini-3.7-flash">Gemini 3.7 Flash (Balanced)</option>
                    <option value="pro">Gemini 3.1 Pro (Deep Thinking)</option>
                    <option value="lite">Gemini 3.1 Flash Lite (Fast)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-700 font-bold font-mono">
                    Soul: {stats.soulReadinessScore}%
                  </span>
                  <span className="text-[10px] text-gray-400">Claim ≤ Evidence</span>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div aria-live="polite" className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gray-50/50">
                {messages.map((message) => {
                  const isUser = message.role === 'user';
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        isUser 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'bg-white text-emerald-700 border border-gray-200 shadow-sm'
                      }`}>
                        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>

                      {/* Message Bubble */}
                      <div className={`max-w-[82%] space-y-1.5 ${isUser ? 'items-end text-right' : 'items-start text-left'}`}>
                        <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                        }`}>
                          {message.content}
                        </div>

                        {/* Message Metadata & Copy Button */}
                        <div className={`flex items-center gap-2 px-1 text-[10px] font-mono text-gray-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <span>{message.timestamp}</span>
                          {!isUser && (
                            <>
                              <span>•</span>
                              <button
                                onClick={() => handleCopy(message.content, message.id)}
                                className="hover:text-emerald-600 transition-colors flex items-center gap-1"
                                title="Copy answer"
                              >
                                {copiedId === message.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-600">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Loading Indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 items-center"
                  >
                    <div className="w-7 h-7 rounded-xl bg-white text-emerald-600 border border-gray-200 shadow-sm flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 animate-pulse" />
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-gray-200 text-xs text-gray-600 flex items-center gap-2 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                      <span>Consulting meUus Intelligence Suite...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Pills */}
              <div className="px-4 py-2 bg-white border-t border-gray-200">
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Suggested Questions:
                </p>
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      disabled={isLoading}
                      className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-[11px] text-gray-700 hover:text-emerald-700 whitespace-nowrap transition-colors shrink-0 shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    aria-label="Chat input message"
                    placeholder="Ask anything about meUus, 9 Hubs, or growth..."
                    disabled={isLoading}
                    className="flex-1 bg-gray-50 border border-gray-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors shadow-sm"
                  />
                  <Button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
