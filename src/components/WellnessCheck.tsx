import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Sparkles, 
  Send, 
  Loader2, 
  Heart, 
  Compass, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  PhoneCall, 
  AlertTriangle, 
  History, 
  Trash2, 
  RefreshCw, 
  Quote, 
  Lightbulb, 
  Flame, 
  Smile, 
  Frown, 
  CloudRain, 
  SunMedium, 
  ArrowRight,
  BookHeart,
  ChevronDown,
  ChevronUp,
  Waves,
  Volume2
} from 'lucide-react';
import EmergencyTriageModal from './EmergencyTriageModal';
import SoulReflectionPacer from './SoulReflectionPacer';
import { useEcosystem } from '../context/EcosystemContext';

interface BanglaWisdom {
  bangla: string;
  translation: string;
  meaning: string;
}

interface WellnessInsights {
  emotionalTone: string;
  coreValidation: string;
  growthInsights: string[];
  mindfulPerspective: string;
  microAction: string;
  affirmation: string;
  banglaWisdom: BanglaWisdom;
  triageRecommended: boolean;
  timestamp?: string;
  model?: string;
  isFallback?: boolean;
}

interface SavedJournalEntry {
  id: string;
  date: string;
  mood: string;
  text: string;
  insights: WellnessInsights;
}

export default function WellnessCheck() {
  const { openAiGuide, logAction } = useEcosystem();

  const [input, setInput] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('Overwhelmed / Exhausted');
  const [selectedTag, setSelectedTag] = useState<string>('Life & Emotional Balance');
  const [insights, setInsights] = useState<WellnessInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [isActionCompleted, setIsActionCompleted] = useState(false);
  const [copiedAffirmation, setCopiedAffirmation] = useState(false);
  const [savedEntries, setSavedEntries] = useState<SavedJournalEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [showSoulPacer, setShowSoulPacer] = useState(false);

  const moodOptions = [
    { label: 'Overwhelmed / Exhausted', emoji: '🌧️', color: 'from-blue-500/20 to-slate-800 text-blue-300 border-blue-500/30' },
    { label: 'Anxious / Racing Thoughts', emoji: '🌪️', color: 'from-amber-500/20 to-slate-800 text-amber-300 border-amber-500/30' },
    { label: 'Contemplative / Quiet', emoji: '🍃', color: 'from-emerald-500/20 to-slate-800 text-emerald-300 border-emerald-500/30' },
    { label: 'Seeking Purpose / Stuck', emoji: '🧭', color: 'from-purple-500/20 to-slate-800 text-purple-300 border-purple-500/30' },
    { label: 'Hopeful & Resilient', emoji: '🌅', color: 'from-teal-500/20 to-slate-800 text-teal-300 border-teal-500/30' },
    { label: 'Grateful & Grounded', emoji: '🌸', color: 'from-rose-500/20 to-slate-800 text-rose-300 border-rose-500/30' },
  ];

  const focusTags = [
    'Life & Emotional Balance',
    'Career & Purpose Pressure',
    'Family & Relationships',
    '90-Day Transformation Streak',
    'Spiritual Grounding & Peace',
    'Self-Worth & Inner Critic'
  ];

  const promptStarters = [
    'I feel exhausted by high expectations and feel like I am falling behind everyone else...',
    'I experienced a small victory today, but I am still feeling an underlying anxiety about the future...',
    'I have been struggling with consistency in my daily habits and feel guilty about pausing...',
    'I am carrying heavy unresolved thoughts after a difficult conversation...'
  ];

  const loadingMessages = [
    'Holding compassionate space for your reflection...',
    'Consulting Gemini 3.7 Flash Emotional Intelligence Engine...',
    'Synthesizing tailored psychological and emotional growth insights...',
    'Formulating a gentle 5-minute restorative micro-step...',
    'Grounding insights in authentic Bangladeshi cultural wisdom...'
  ];

  // Load saved entries from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('meuus_wellness_journal');
      if (stored) {
        setSavedEntries(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read wellness journal history', e);
    }
  }, []);

  // Cycle loading messages when generating insights
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyzeReflection = async (customText?: string) => {
    const textToAnalyze = customText || input;
    if (!textToAnalyze.trim()) {
      setErrorNotice('Please share a few words or sentences about what is on your mind.');
      return;
    }

    setErrorNotice(null);
    setIsLoading(true);
    setIsActionCompleted(false);

    try {
      const res = await fetch('/api/wellness-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reflectionText: textToAnalyze,
          selectedMood,
          focusTag: selectedTag
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: WellnessInsights = await res.json();
      setInsights(data);

      // Save into local history
      const newEntry: SavedJournalEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        mood: selectedMood,
        text: textToAnalyze,
        insights: data
      };

      const updated = [newEntry, ...savedEntries.slice(0, 9)];
      setSavedEntries(updated);
      try {
        localStorage.setItem('meuus_wellness_journal', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save to localStorage', e);
      }
    } catch (err: any) {
      console.error('Failed to get wellness insights:', err);
      // Construct rich local fallback insight
      const fallback: WellnessInsights = {
        emotionalTone: `Processing ${selectedMood} with Honest Presence`,
        coreValidation: `Apnar pashe achi (I am standing with you). Every emotion and weight you are experiencing right now is completely valid. It takes courage to put feelings into words.`,
        growthInsights: [
          'Emotions are signals, not permanent destinations; acknowledging them without judgment is the first step of emotional mastery.',
          'Progress in personal growth is rarely linear — allowing yourself honest breathing room builds true long-term resilience.',
          'Small, sincere actions done consistently carry far more restorative power than seeking immediate perfection.'
        ],
        mindfulPerspective: 'Pause for a moment and observe this feeling like passing clouds above a steady mountain.',
        microAction: 'Pour a fresh glass of water, step away from digital screens for 3 minutes, and take five slow, deliberate breaths.',
        affirmation: 'I give myself permission to be human, to rest when tired, and to take one honest step at a time.',
        banglaWisdom: {
          bangla: 'ধৈর্যই সমস্ত সাফল্যের চাবিকাঠি ও আত্মার প্রশান্তি।',
          translation: 'Patience is the key to all success and inner tranquility of the soul.',
          meaning: 'When the path feels heavy, honor patience and gentle persistence over haste.'
        },
        triageRecommended: false,
        isFallback: true
      };
      setInsights(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const copyAffirmation = () => {
    if (insights?.affirmation) {
      navigator.clipboard.writeText(insights.affirmation);
      setCopiedAffirmation(true);
      setTimeout(() => setCopiedAffirmation(false), 2000);
    }
  };

  const deleteHistoryEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = savedEntries.filter(entry => entry.id !== id);
    setSavedEntries(filtered);
    try {
      localStorage.setItem('meuus_wellness_journal', JSON.stringify(filtered));
    } catch (e) {
      console.warn('Failed to update journal storage', e);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader
        icon={<Heart size={18} />}
        title="Mind Wellness"
        subtitle="Non-diagnostic emotional grounding, crisis safety, and daily reflective peace."
        badge="Sanctuary"
        breadcrumb="Personal Growth"
      />
      <section id="wellness" className="py-8 px-6 bg-gray-50 text-gray-900 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mind Beautifier AI · Gemini 3.7 Flash Emotional Suite</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight">
            How is Your Soul Feeling Today?
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Share what you are carrying without fear or shame. Powered by Google Gemini, meUus analyzes your honest words to deliver tailored psychological validations, constructive reframing, and gentle 5-minute growth steps.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 pt-1 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Confidential Reflection
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-gray-700">
              <Heart className="w-3.5 h-3.5 text-rose-500" /> Culturally Grounded Empathy
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-teal-700">
              <Compass className="w-3.5 h-3.5" /> Action Over Perfection
            </span>
          </div>
        </div>

        {/* Breathing & Ambient Soundscape Pacer Toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowSoulPacer(!showSoulPacer)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-200 hover:border-emerald-500/50 text-gray-700 hover:text-emerald-700 text-xs font-semibold transition-all shadow-sm"
          >
            <Waves className="w-3.5 h-3.5 text-emerald-600" />
            {showSoulPacer ? 'Close Breathing & Soundscape Pacer' : 'Open 4-7-8 Breathing & Ambient Soundscape'}
            <Volume2 className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        {/* Inline Soul Reflection Pacer */}
        {showSoulPacer && (
          <SoulReflectionPacer onClose={() => setShowSoulPacer(false)} />
        )}

        {/* Main Check-In Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-8">
          
          {/* Step 1: Mood State Quick Picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-gray-700 font-bold tracking-wider flex items-center gap-1.5">
                <span>1. Select Current Emotional State:</span>
              </label>
              <span className="text-[11px] text-gray-400 font-mono">Step 1 of 3</span>
            </div>

            <div role="radiogroup" aria-label="Select your current mood" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {moodOptions.map((mood) => {
                const isSelected = selectedMood === mood.label;
                return (
                  <button
                    key={mood.label}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedMood(mood.label)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 shadow-sm scale-[1.02]'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className={`text-xs font-medium leading-tight ${isSelected ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Focus Area Tag */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-gray-700 font-bold tracking-wider">
                2. Select Area of Life:
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {focusTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Reflection Input & Prompt Starters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-gray-700 font-bold tracking-wider flex items-center gap-1.5">
                <span>3. Pour Your Thoughts Honestly:</span>
                <span className="text-gray-500 font-normal">(English, বাংলা, or Banglish)</span>
              </label>
              <span className="text-[11px] font-mono text-gray-400">
                {input.length} characters
              </span>
            </div>

            {/* Prompt Starter Chips */}
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase font-mono text-gray-500">Quick-start with a prompt:</div>
              <div className="flex flex-wrap gap-2">
                {promptStarters.map((starter, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setInput(starter)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:text-emerald-700 hover:border-emerald-300 text-left transition-colors truncate max-w-full"
                  >
                    "{starter.slice(0, 60)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Your Reflection"
                placeholder="Write whatever is in your heart. E.g., 'Today I felt a sudden wave of fatigue. I kept comparing my progress to others and felt like giving up...'"
                rows={4}
                className="w-full p-4 rounded-2xl bg-white border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all resize-y leading-relaxed shadow-sm"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3">
                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Covenant: Claim ≤ Evidence. No judgment, only empathetic reflection.</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {input.trim() && (
                    <button
                      type="button"
                      onClick={() => setInput('')}
                      className="px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs text-gray-600 hover:text-gray-900 transition-colors border border-gray-200"
                    >
                      Clear
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => handleAnalyzeReflection()}
                    disabled={isLoading || !input.trim()}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Analyzing with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-100" />
                        <span>Generate Growth Insights</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {errorNotice && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorNotice}</span>
                </div>
              )}
            </div>
          </div>

          {/* Loading State Animation */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 rounded-2xl bg-gray-50 border border-emerald-300 text-center space-y-4 shadow-sm"
              >
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600">
                    <Brain className="w-8 h-8 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-900">
                    {loadingMessages[loadingMessageIndex]}
                  </div>
                  <p className="text-xs text-gray-500 font-mono">
                    Model: gemini-3.7-flash · Structured Reasoning Engine
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Output: Tailored Empathetic Insights */}
          <AnimatePresence>
            {insights && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-6 pt-4 border-t border-gray-200"
              >
                {/* Tone Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-purple-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-emerald-700 tracking-wider">
                        Detected Emotional Nuance
                      </div>
                      <h4 className="text-lg font-serif font-bold text-gray-900">
                        {insights.emotionalTone}
                      </h4>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-[11px] font-mono text-gray-700 shadow-sm">
                    <span>Model: {insights.model || 'gemini-3.7-flash'}</span>
                  </div>
                </div>

                {/* Core Validation Quote Card */}
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 relative overflow-hidden shadow-sm">
                  <Quote className="absolute top-4 right-4 w-12 h-12 text-gray-200 pointer-events-none" />
                  <div className="text-xs font-mono uppercase text-gray-500 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Compassionate Validation (Apnar Pashe Achi)</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed italic">
                    "{insights.coreValidation}"
                  </p>
                </div>

                {/* 2-Column Grid: Growth Insights & Mindful Reframing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tailored Growth Reflections */}
                  <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-sm">
                    <div className="text-xs font-mono uppercase text-emerald-700 font-bold flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4" />
                      <span>Tailored Growth Reflections</span>
                    </div>
                    <ul className="space-y-2.5 text-xs text-gray-700 leading-relaxed">
                      {insights.growthInsights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mindful Perspective Reframing */}
                  <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-sm">
                    <div className="text-xs font-mono uppercase text-purple-700 font-bold flex items-center gap-1.5">
                      <Compass className="w-4 h-4" />
                      <span>Constructive Reframing Anchor</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {insights.mindfulPerspective}
                    </p>

                    <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px] font-mono text-gray-500">
                      <span>Motto:</span>
                      <span className="text-emerald-700 font-bold">Action Over Perfection</span>
                    </div>
                  </div>
                </div>

                {/* 5-Minute Micro-Action Card */}
                <div className={`p-5 rounded-2xl border transition-all duration-300 shadow-sm ${
                  isActionCompleted 
                    ? 'bg-emerald-50 border-emerald-300' 
                    : 'bg-amber-50/60 border-amber-200'
                }`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        <span>Today's 5-Minute Restorative Micro-Step</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-900 font-medium">
                        {insights.microAction}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsActionCompleted(!isActionCompleted)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                        isActionCompleted
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isActionCompleted ? 'text-white' : 'text-gray-400'}`} />
                      <span>{isActionCompleted ? 'Step Completed!' : 'Mark as Done'}</span>
                    </button>
                  </div>
                </div>

                {/* Affirmation & Bengali Wisdom Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Grounding Affirmation */}
                  <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono uppercase text-teal-700 font-bold flex items-center gap-1.5">
                        <Quote className="w-3.5 h-3.5" />
                        <span>Personal Affirmation Mantra</span>
                      </div>
                      <button
                        onClick={copyAffirmation}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 text-[11px] font-mono flex items-center gap-1 transition-colors border border-gray-200"
                        title="Copy Affirmation"
                      >
                        {copiedAffirmation ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-medium">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-teal-800 font-serif italic">
                      "{insights.affirmation}"
                    </p>
                  </div>

                  {/* Bengali Cultural Wisdom */}
                  <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-2 shadow-sm">
                    <div className="text-xs font-mono uppercase text-pink-700 font-bold flex items-center gap-1.5">
                      <BookHeart className="w-3.5 h-3.5" />
                      <span>বাংলা প্রবাদ ও গভীর দর্শন (Cultural Wisdom)</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {insights.banglaWisdom.bangla}
                    </div>
                    <div className="text-xs text-gray-600 italic">
                      "{insights.banglaWisdom.translation}"
                    </div>
                    <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                      Meaning: {insights.banglaWisdom.meaning}
                    </div>
                  </div>
                </div>

                {/* Ecosystem Cross-Hub Action Links */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="text-xs font-mono text-gray-600">
                    <span className="text-emerald-700 font-bold">Ecosystem Action: </span>
                    <span>Ready to bridge this reflection into your broader journey?</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        logAction({
                          hubId: 'wellness-check',
                          title: `Reflection: ${insights.emotionalTone}`,
                          category: 'reflection',
                          status: 'completed',
                          metadata: { mood: selectedMood, microAction: insights.microAction }
                        });
                        alert('Reflection successfully logged to your Master Soul Profile & Cloud SQL stream.');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-xs font-mono text-purple-700 transition shadow-sm"
                    >
                      <span>Log to Master Soul</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openAiGuide(`I just completed a reflection on feeling ${selectedMood}. My insight was: "${insights.coreValidation}". How can I cultivate inner peace today?`)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold transition flex items-center gap-1 shadow-sm"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Discuss with AI Guide</span>
                    </button>

                    <a
                      href="#dashboard"
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-xs font-mono text-teal-700 transition shadow-sm"
                    >
                      <span>Take Action in Dashboard →</span>
                    </a>
                  </div>
                </div>

                {/* Acute Crisis Safeguard Banner */}
                {insights.triageRecommended && (
                  <div aria-live="assertive" className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-rose-600 text-white">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-rose-900">
                          Immediate Human Support is Available
                        </h5>
                        <p className="text-xs text-rose-700">
                          We noticed you might be carrying acute emotional weight or crisis. You do not have to endure this alone.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => setIsEmergencyModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Open 15-Minute Human Triage</span>
                      </button>
                      <a
                        href="tel:999"
                        className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 text-rose-700 border border-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Dial 999 (National Emergency)</span>
                      </a>
                      <a
                        href="tel:01779554391"
                        className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 text-emerald-700 border border-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Kaan Pete Roi (Mental Health Hotline)</span>
                      </a>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* History Drawer Toggle */}
          {savedEntries.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs text-gray-700 flex items-center justify-between transition-colors font-mono"
              >
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-600" />
                  <span>Past Reflection Sessions ({savedEntries.length})</span>
                </div>
                {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pt-3"
                  >
                    {savedEntries.map((entry) => (
                      <div
                        key={entry.id}
                        onClick={() => {
                          setInput(entry.text);
                          setInsights(entry.insights);
                          setSelectedMood(entry.mood);
                        }}
                        className="p-3.5 rounded-xl bg-white border border-gray-200 hover:border-emerald-500 cursor-pointer transition-all flex items-start justify-between gap-3 group shadow-sm"
                      >
                        <div className="space-y-1 overflow-hidden">
                          <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500">
                            <span className="text-emerald-700 font-bold">{entry.mood}</span>
                            <span>•</span>
                            <span>{entry.date}</span>
                          </div>
                          <p className="text-xs text-gray-800 line-clamp-1 italic">
                            "{entry.text}"
                          </p>
                          <div className="text-[10px] text-gray-500 font-mono">
                            Tone: {entry.insights.emotionalTone}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => deleteHistoryEntry(entry.id, e)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Triage Modal */}
      <EmergencyTriageModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </section>
    </div>
  );
}
