import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Compass, BookOpen, User, Briefcase, Heart, 
  MessageSquare, ShieldCheck, CheckCircle2, ChevronRight, 
  Search, Send, ArrowRight, Star, Globe, Smartphone, Lightbulb, MapPin, Cpu
} from 'lucide-react';

export default function InteractiveAppShowcase() {
  const [activeScreen, setActiveScreen] = useState<string>('start');
  const [selectedMood, setSelectedMood] = useState<string>('smile');
  const [reflectionText, setReflectionText] = useState<string>('');
  const [taskDone, setTaskDone] = useState<{ [key: string]: boolean }>({ task1: true, task2: false, task3: false });
  const [meYooChat, setMeYooChat] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    { sender: 'ai', text: 'Assalamu Alaikum Ruju! I am meYoo, your personal companion for growth and reflection. How can I support you today?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const screens = [
    { id: 'start', name: 'Start Door', icon: Sparkles },
    { id: 'reflection', name: 'Level-0 Reflection', icon: Heart },
    { id: 'journey', name: '90-Day Journey', icon: Compass },
    { id: 'meyoo', name: 'meYoo AI Companion', icon: MessageSquare },
    { id: 'knowledge', name: 'Knowledge Library', icon: BookOpen },
    { id: 'marketplace', name: 'Marketplace', icon: Briefcase },
    { id: 'opportunities', name: 'Opportunities', icon: Lightbulb },
    { id: 'profile', name: 'Master Soul Profile', icon: User },
  ];

  const handleSendMeYoo = (text?: string) => {
    const msg = text || inputMsg;
    if (!msg.trim()) return;
    setMeYooChat(prev => [...prev, { sender: 'user', text: msg }]);
    setInputMsg('');
    setTimeout(() => {
      let reply = "I hear you clearly. Let's ground this with a clear first step from the meUus framework.";
      if (msg.includes('overwhelmed') || msg.includes('stuck')) {
        reply = "Take a slow breath. You don't have to solve everything today. Let's do a 2-minute Level-0 Reflection and isolate the single constraint you can control.";
      } else if (msg.includes('learn') || msg.includes('quran')) {
        reply = "MashaAllah. We have Day 23 of the Quran Learning Journey open on 'Gratitude & Patience'. Would you like to read the 3-minute summary?";
      } else if (msg.includes('job') || msg.includes('business')) {
        reply = "Checking Unemployment Buster & Marketplace: 14 new verified opportunities in Dhaka matching your skills. Opening the listings now.";
      }
      setMeYooChat(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader
        icon={<Cpu size={18} />}
        title="App Showcase"
        subtitle="Interactive Demonstrations and Previews of meUus Digital Ecosystem Applications."
        badge="Showcase"
        breadcrumb="Media"
      />
      <section id="app-preview" className="py-8 px-6 bg-gray-50 text-gray-900 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cross-Platform UI/UX Preview</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-gray-900 leading-tight">
            The meUus <span className="text-emerald-600">Mobile & Web Application</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed font-sans">
            Explore every core screen of the ecosystem in real-time. Built for Flutter & Modern Web with seamless Firebase sync, AI support, and default-deny data privacy.
          </p>
        </div>

        {/* Screen Switcher Nav */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto p-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
          {screens.map(s => {
            const Icon = s.icon;
            const isCurrent = activeScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveScreen(s.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Phone Stage */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 pt-4">
          {/* Phone Frame */}
          <div className="relative w-full max-w-[380px] h-[720px] bg-white rounded-[48px] border-[6px] border-gray-300 shadow-2xl p-4 flex flex-col overflow-hidden ring-1 ring-gray-200">
            {/* Phone Top Notch & Status Bar */}
            <div className="flex items-center justify-between px-4 pt-1 pb-3 text-[11px] font-mono text-gray-500 border-b border-gray-100">
              <span>9:41</span>
              <div className="w-20 h-4 bg-gray-200 rounded-full mx-auto" />
              <span>5G · 100%</span>
            </div>

            {/* Screen Content Body */}
            <div className="flex-1 overflow-y-auto pt-4 pb-2 px-1 text-gray-900 space-y-4">
              <AnimatePresence mode="wait">
                {/* 1. START DOOR */}
                {activeScreen === 'start' && (
                  <motion.div
                    key="start"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-serif text-xl font-bold mx-auto shadow-sm">
                        m
                      </div>
                      <h3 className="font-serif font-bold text-lg text-gray-900">One Word / One Sentence Start</h3>
                      <p className="text-[11px] text-gray-500">How do you want to begin today?</p>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Type one word or one sentence..."
                        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      />
                      <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm">
                        Begin My Journey
                      </button>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">Quick Starters:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['I need help', 'Feeling stuck', 'Want to learn', 'Seek ethical advice', 'Need job'].map((tag, i) => (
                          <button
                            key={i}
                            className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-[10px] text-gray-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. LEVEL-0 REFLECTION */}
                {activeScreen === 'reflection' && (
                  <motion.div
                    key="reflection"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">Level-0 Reflection</span>
                      <h3 className="font-serif font-bold text-base text-gray-900">How are you feeling right now?</h3>
                    </div>

                    {/* Mood Selector */}
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-200">
                      {[
                        { id: 'laugh', emoji: '😄', label: 'Great' },
                        { id: 'smile', emoji: '😊', label: 'Good' },
                        { id: 'meh', emoji: '😐', label: 'Okay' },
                        { id: 'frown', emoji: '😔', label: 'Stressed' },
                        { id: 'sad', emoji: '😢', label: 'Sad' },
                      ].map(m => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMood(m.id)}
                          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                            selectedMood === m.id ? 'bg-emerald-100 scale-110 shadow-sm' : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <span className="text-xl">{m.emoji}</span>
                          <span className="text-[9px] font-mono text-gray-600">{m.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-mono text-gray-500">What's on your mind?</label>
                      <textarea
                        value={reflectionText}
                        onChange={e => setReflectionText(e.target.value)}
                        placeholder="Write anything honestly... No judgment, stored privately on your device."
                        rows={4}
                        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 resize-none"
                      />
                      <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm">
                        Save Reflection
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 3. 90-DAY JOURNEY */}
                {activeScreen === 'journey' && (
                  <motion.div
                    key="journey"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-700 font-bold">90-Day Journey</span>
                        <h3 className="font-serif font-bold text-lg text-gray-900">Day 23 of 90</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-700">72%</span>
                        <div className="text-[9px] font-mono text-gray-400">Streak: 7 Days</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                      <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold">Today's Focus</span>
                      <h4 className="text-xs font-bold text-gray-900">Gratitude & Patience (Sabr)</h4>
                      <p className="text-[11px] text-gray-700 leading-relaxed">
                        Stay consistent. Real transformation comes from quiet, honest repetition.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">Today's Micro-Tasks</span>
                      {[
                        { id: 'task1', text: 'Morning Soul Reflection (5 min)' },
                        { id: 'task2', text: 'Read 1 Ayah with commentary' },
                        { id: 'task3', text: 'Offer support to 1 family member' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setTaskDone(prev => ({ ...prev, [t.id]: !prev[t.id] }))}
                          className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                            taskDone[t.id]
                              ? 'bg-gray-100 border-gray-200 text-gray-400 line-through'
                              : 'bg-gray-50 border-gray-200 text-gray-800 hover:border-gray-300'
                          }`}
                        >
                          <span>{t.text}</span>
                          <CheckCircle2 className={`w-4 h-4 ${taskDone[t.id] ? 'text-emerald-600' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 4. meYoo AI COMPANION */}
                {activeScreen === 'meyoo' && (
                  <motion.div
                    key="meyoo"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col h-[580px] justify-between"
                  >
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xs">
                        🤖
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">meYoo AI Companion</h4>
                        <span className="text-[9px] font-mono text-emerald-700">● Online · Ethical Boundary Shield</span>
                      </div>
                    </div>

                    {/* Chat Bubble Scroll */}
                    <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
                      {meYooChat.map((m, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-2xl text-[11px] leading-relaxed max-w-[85%] ${
                            m.sender === 'ai'
                              ? 'bg-gray-100 border border-gray-200 text-gray-800 self-start'
                              : 'bg-emerald-600 text-white ml-auto shadow-sm'
                          }`}
                        >
                          {m.text}
                        </div>
                      ))}
                    </div>

                    {/* Preset Chips */}
                    <div className="flex gap-1 overflow-x-auto pb-2 text-[10px]">
                      {['I need guidance', 'I feel overwhelmed', 'Learn Quran', 'Find a Job'].map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMeYoo(chip)}
                          className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700 whitespace-nowrap hover:border-emerald-500 hover:text-emerald-700 transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        value={inputMsg}
                        onChange={e => setInputMsg(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendMeYoo()}
                        placeholder="Talk to meYoo..."
                        className="flex-1 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={() => handleSendMeYoo()}
                        className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 5. KNOWLEDGE LIBRARY */}
                {activeScreen === 'knowledge' && (
                  <motion.div
                    key="knowledge"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">Knowledge Hub</span>
                      <h3 className="font-serif font-bold text-base text-gray-900">Source-Verified Library</h3>
                    </div>

                    <div className="space-y-2">
                      {[
                        { title: 'Emotional Intelligence', lessons: '12 Contents', cat: 'Personal' },
                        { title: '114-Day Quran Journey', lessons: '114 Lessons', cat: 'Islamic' },
                        { title: '80-Day Seerah Journey', lessons: '80 Lessons', cat: 'Islamic' },
                        { title: 'Time Management for SMEs', lessons: '8 Guides', cat: 'Skills' },
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs hover:border-emerald-500 transition-all">
                          <div>
                            <div className="font-bold text-gray-900">{item.title}</div>
                            <div className="text-[10px] font-mono text-gray-500">{item.lessons} · {item.cat}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 6. MARKETPLACE */}
                {activeScreen === 'marketplace' && (
                  <motion.div
                    key="marketplace"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">Marketplace & Exchange</span>
                      <h3 className="font-serif font-bold text-base text-gray-900">Verified Peer Services</h3>
                    </div>

                    <div className="space-y-2">
                      {[
                        { name: 'Website Development', price: '৳15,000', provider: 'SME Dev Team' },
                        { name: 'Legal Consultation & Tax', price: '৳2,500', provider: 'Adv. R. Karim' },
                        { name: 'Graphics & UI Branding', price: '৳3,000', provider: 'Pixel Bangla' },
                        { name: 'Organic Rooftop Farming Setup', price: '৳5,000', provider: 'Green Solutions' },
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-gray-900">{item.name}</div>
                            <div className="text-[10px] text-gray-500">{item.provider}</div>
                          </div>
                          <span className="font-mono font-bold text-emerald-700">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 7. OPPORTUNITIES */}
                {activeScreen === 'opportunities' && (
                  <motion.div
                    key="opportunities"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">Economic Capacity</span>
                      <h3 className="font-serif font-bold text-base text-gray-900">Live Opportunities</h3>
                    </div>

                    <div className="space-y-2">
                      {[
                        { role: 'Project Coordinator', loc: 'Dhaka · Full-time', type: 'Job' },
                        { role: 'Content Writer (Bangla)', loc: 'Remote · Part-time', type: 'Project' },
                        { role: 'Solar Farm Land Lease', loc: 'Sylhet · 5 Acres', type: 'Land' },
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-gray-900">{item.role}</div>
                            <div className="text-[10px] text-gray-500">{item.loc}</div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {item.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 8. MASTER SOUL PROFILE */}
                {activeScreen === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <div className="text-center space-y-2 pb-2 border-b border-gray-200">
                      <div className="w-14 h-14 rounded-full bg-emerald-600 mx-auto flex items-center justify-center font-bold text-white text-lg border-2 border-emerald-400 shadow-sm">
                        R
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Md. Mahady Hasan (Ruju)</h4>
                        <p className="text-[10px] font-mono text-emerald-700">Client #001 · Dhaka, Bangladesh</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {[
                        { label: 'My 90-Day Journey', val: 'Day 23 (72%)' },
                        { label: 'My Reflections', val: '12 Recorded' },
                        { label: 'My Bookmarks', val: '7 Saved' },
                        { label: 'My Contributions', val: '৳15,000 Circulated' },
                        { label: 'Privacy & Security', val: 'Default-Deny ON' },
                      ].map((p, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-gray-50 flex justify-between items-center text-[11px] border border-gray-200">
                          <span className="text-gray-700">{p.label}</span>
                          <span className="font-mono text-emerald-700 font-bold">{p.val}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Nav Bar of Phone */}
            <div className="pt-2 border-t border-gray-200 grid grid-cols-4 gap-1 text-center text-[10px] font-mono text-gray-500">
              <button onClick={() => setActiveScreen('start')} className={activeScreen === 'start' ? 'text-emerald-600 font-bold' : ''}>Home</button>
              <button onClick={() => setActiveScreen('journey')} className={activeScreen === 'journey' ? 'text-emerald-600 font-bold' : ''}>Journey</button>
              <button onClick={() => setActiveScreen('meyoo')} className={activeScreen === 'meyoo' ? 'text-emerald-600 font-bold' : ''}>meYoo</button>
              <button onClick={() => setActiveScreen('profile')} className={activeScreen === 'profile' ? 'text-emerald-600 font-bold' : ''}>Profile</button>
            </div>
          </div>

          {/* Right Explanatory Feature Cards */}
          <div className="max-w-md space-y-5">
            <div className="p-6 rounded-3xl bg-white border border-gray-200 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-mono font-bold uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Unified Ecosystem Architecture</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900">One Journey. One Purpose. One Us.</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                meUus connects self-understanding, structured learning, private daily reflections, two-way economic exchange, and verified communal action into a single unified mobile & web workflow.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-1 shadow-sm">
                <span className="text-emerald-700 font-mono font-bold text-sm">15-Min</span>
                <div className="font-bold text-gray-900">Emergency Response</div>
                <p className="text-[11px] text-gray-500">Crisis & legal triage 24/7</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-1 shadow-sm">
                <span className="text-teal-700 font-mono font-bold text-sm">100%</span>
                <div className="font-bold text-gray-900">Privacy by Design</div>
                <p className="text-[11px] text-gray-500">Zero data resale guarantee</p>
              </div>
            </div>

            {/* Quick Link to Universal Start */}
            <a
              href="#start"
              className="block w-full text-center py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl transition-all shadow-sm"
            >
              Enter Live Web Application Now
            </a>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
