/**
 * DLAS — Development Lens and Assessment System
 * 
 * Complies with meUus Master Constitution Sections 9.1, 10, and 24:
 * - 4 Structured Assessment Levels:
 *   - Level ZERO: 21 questions (Quick orientation)
 *   - Level BASIC: 50 questions (Broader personal development)
 *   - Level ADVANCED: 75 questions (Deeper capability analysis)
 *   - Level PRO: 100 questions (Full longitudinal structured assessment)
 * - 8-Stage Longitudinal Cycle (FUNCTIONAL):
 *   ASSESS → UNDERSTAND → PLAN → ACT → MEASURE → REFLECT → REASSESS → GROW
 *   The active stage now frames the inquiry and is recorded with each reflection.
 * - 5 Core Developmental Lenses:
 *   Individual, Relationship, Family, Livelihood, Purpose
 * - Offline-First Local Persistence via offlineStorage
 * - Evidence-Derived Indicators: computed ONLY from the user's real local
 *   reflections (Claim ≤ Evidence). No hardcoded or fabricated scores.
 * - Strict Non-Diagnostic & Truth-Bound Ethics
 */

import React, { useState, useMemo } from 'react';
import PageHeader from './PageHeader';
import { 
  Heart, 
  Users, 
  Home, 
  Briefcase, 
  Compass, 
  Save, 
  CheckCircle2, 
  ShieldCheck,
  History,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';
import { DLASReflection } from '../types';
import { offlineStorage, type StoredDlasSession } from '../lib/offlineStorage';
import AIProfileCreator from './AIProfileCreator';

type DLASStep = 'ASSESS' | 'UNDERSTAND' | 'PLAN' | 'ACT' | 'MEASURE' | 'REFLECT' | 'REASSESS' | 'GROW';

interface DLASLens {
  id: 'individual' | 'relationship' | 'family' | 'livelihood' | 'purpose';
  title: string;
  subtitle: string;
  icon: any;
  prompt: string;
  guidingQuestions: string[];
}

const DLAS_LENSES: DLASLens[] = [
  {
    id: 'individual',
    title: '1. Individual Mind & Clarity',
    subtitle: 'Self-awareness, emotional grounding, honest self-talk',
    icon: Heart,
    prompt: 'What emotion or weight is occupying most of your mental space right now, and what is one honest truth about it?',
    guidingQuestions: [
      'Are you feeling rested or mentally fatigued?',
      'What is one burden you have carried in silence this week?',
      'What is one healthy habit you can protect today?'
    ]
  },
  {
    id: 'relationship',
    title: '2. Relationships & Mutual Trust',
    subtitle: 'Communication, interpersonal boundaries, empathy',
    icon: Users,
    prompt: 'How are you communicating with the people closest to you, and is there an unspoken misunderstanding that needs gentle clarity?',
    guidingQuestions: [
      'Who in your life gives you sincere, constructive counsel?',
      'Is there someone you need to listen to before responding?',
      'How are you showing appreciation to those who support you?'
    ]
  },
  {
    id: 'family',
    title: '3. Family Harmony & Generational Care',
    subtitle: 'Domestic balance, parenting, elderly support',
    icon: Home,
    prompt: 'What is the current emotional climate in your household, and what small contribution can you make to bring peace or ease?',
    guidingQuestions: [
      'Are domestic expectations clear and shared fairly?',
      'Are the elderly or children in your family feeling heard?',
      'How do you manage disagreements without escalating conflict?'
    ]
  },
  {
    id: 'livelihood',
    title: '4. Livelihood, Skills & Economic Grounding',
    subtitle: 'Work, SME formalization, sustainable income',
    icon: Briefcase,
    prompt: 'What is the real state of your work or business, and what is the single most urgent practical step you need to take this week?',
    guidingQuestions: [
      'Is your income meeting basic needs with stability?',
      'What skill gap is holding back your professional progress?',
      'Do you need to formalize documentation (TIN, Trade License, Contracts)?'
    ]
  },
  {
    id: 'purpose',
    title: '5. Purpose, Ethics & Social Contribution',
    subtitle: 'Values, Amanah (trust), community connection',
    icon: Compass,
    prompt: 'How are your daily actions aligning with your core ethical values, and what value can you offer to your broader community?',
    guidingQuestions: [
      'Are your commercial or personal dealings transparent?',
      'What is one way you can help another person without expecting return?',
      'How do you preserve truthfulness when facing pressure?'
    ]
  }
];

const ASSESSMENT_TIERS = [
  { id: 'ZERO', label: 'Level ZERO', count: 21, desc: 'Quick Orientation & Immediate Grounding', time: '5 mins' },
  { id: 'BASIC', label: 'Level BASIC', count: 50, desc: 'Broader Personal-Development Profile', time: '12 mins' },
  { id: 'ADVANCED', label: 'Level ADVANCED', count: 75, desc: 'Deep Human Capability & Resilience Analysis', time: '20 mins' },
  { id: 'PRO', label: 'Level PRO', count: 100, desc: 'Full Longitudinal Structured Assessment', time: '30 mins' },
] as const;

const LONGITUDINAL_STAGES: { step: DLASStep; label: string; desc: string }[] = [
  { step: 'ASSESS', label: '1. Assess', desc: 'Identify baseline' },
  { step: 'UNDERSTAND', label: '2. Understand', desc: 'Context clarity' },
  { step: 'PLAN', label: '3. Plan', desc: 'One next step' },
  { step: 'ACT', label: '4. Act', desc: 'Honest execution' },
  { step: 'MEASURE', label: '5. Measure', desc: 'Evidence capture' },
  { step: 'REFLECT', label: '6. Reflect', desc: 'Examine limits' },
  { step: 'REASSESS', label: '7. Reassess', desc: 'Growth check' },
  { step: 'GROW', label: '8. Grow', desc: 'Sustained habit' },
];

// Stage-specific framing so the longitudinal cycle actually drives the inquiry.
const STAGE_GUIDANCE: Record<DLASStep, { hint: string; actionLabel: string; cta: string }> = {
  ASSESS: { hint: 'Name your honest baseline. What is actually true right now, without judgment or exaggeration?', actionLabel: 'Baseline observation', cta: 'Record Assessment' },
  UNDERSTAND: { hint: 'Add context. Why is this true? What circumstances, patterns, or pressures surround it?', actionLabel: 'Context to capture', cta: 'Record Understanding' },
  PLAN: { hint: 'Choose ONE small, truthful next step. Not ten — one you can genuinely do.', actionLabel: 'One next step', cta: 'Record Plan' },
  ACT: { hint: 'What did you actually do? Record the honest execution, even if it was partial.', actionLabel: 'Action taken', cta: 'Record Action' },
  MEASURE: { hint: 'What observable evidence shows whether the action moved anything at all?', actionLabel: 'Evidence observed', cta: 'Record Measurement' },
  REFLECT: { hint: 'Examine the limits. What worked, what did not, and what did it cost or teach you?', actionLabel: 'What it taught you', cta: 'Record Reflection' },
  REASSESS: { hint: 'Compared to your earlier baseline, what genuinely changed? Be truthful about growth or stagnation.', actionLabel: 'Change since baseline', cta: 'Record Reassessment' },
  GROW: { hint: 'What will you protect or repeat so this becomes a sustained habit rather than a one-off?', actionLabel: 'Habit to sustain', cta: 'Record Growth' },
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export default function DlasEngine() {
  const [selectedLensId, setSelectedLensId] = useState<'individual' | 'relationship' | 'family' | 'livelihood' | 'purpose'>('individual');
  const [reflectionText, setReflectionText] = useState('');
  const [actionStepText, setActionStepText] = useState('');
  const [activeTier, setActiveTier] = useState<'ZERO' | 'BASIC' | 'ADVANCED' | 'PRO'>('ZERO');
  const [currentStage, setCurrentStage] = useState<DLASStep>('ASSESS');
  const [savedReflections, setSavedReflections] = useState<DLASReflection[]>(() => {
    try {
      const saved = localStorage.getItem('meuus_dlas_reflections');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const currentLens = DLAS_LENSES.find(l => l.id === selectedLensId) || DLAS_LENSES[0];
  const Icon = currentLens.icon;
  const stage = STAGE_GUIDANCE[currentStage];

  // Evidence-derived indicators — computed ONLY from real local reflections.
  // These are transparent engagement proxies, NOT clinical or diagnostic scores.
  const derived = useMemo(() => {
    const total = savedReflections.length;
    const lensesTouched = new Set(savedReflections.map(r => r.lensCategory)).size;
    const withAction = savedReflections.filter(r => r.actionStep && r.actionStep.trim()).length;
    const individual = savedReflections.filter(r => r.lensCategory === 'individual').length;
    const livelihood = savedReflections.filter(r => r.lensCategory === 'livelihood').length;
    const now = Date.now();
    const recent = savedReflections.filter(r => {
      const t = new Date(r.createdAt).getTime();
      return !isNaN(t) && now - t <= 30 * 24 * 60 * 60 * 1000;
    }).length;

    return {
      total,
      lensesTouched,
      withAction,
      recent,
      lifeCoverage: clamp((lensesTouched / 5) * 100),
      consistency: clamp((Math.min(recent, 8) / 8) * 100),
      executionOrientation: total ? clamp((withAction / total) * 100) : 0,
      selfReflectionDepth: clamp((Math.min(individual, 5) / 5) * 100),
      livelihoodFocus: clamp((Math.min(livelihood, 5) / 5) * 100),
      engagement: clamp((Math.min(total, 10) / 10) * 100),
    };
  }, [savedReflections]);

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    const newEntry: DLASReflection = {
      id: `dlas-${Date.now()}`,
      lensCategory: selectedLensId,
      lensTitle: currentLens.title,
      prompt: currentLens.prompt,
      reflectionText: reflectionText.trim(),
      actionStep: actionStepText.trim() || 'Review and take one small truthful step forward.',
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
      longitudinalStep: currentStage,
    };

    const updated = [newEntry, ...savedReflections];
    setSavedReflections(updated);
    localStorage.setItem('meuus_dlas_reflections', JSON.stringify(updated));

    // Persist in the unified offlineStorage engine using evidence-derived scores
    // (engagement proxies computed from real reflections — never constants).
    const session: StoredDlasSession = {
      id: `dlas_session_${Date.now()}`,
      tier: activeTier,
      completedAt: new Date().toISOString(),
      scores: {
        lifeScore: derived.lifeCoverage,
        emotionalResilience: derived.consistency,
        executionOrientation: derived.executionOrientation,
        selfAwareness: derived.selfReflectionDepth,
        financialPreparedness: derived.livelihoodFocus,
      },
      answers: {},
      longitudinalStep: currentStage,
    };
    offlineStorage.saveDlasSession(session);

    setReflectionText('');
    setActionStepText('');
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 3000);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your local DLAS reflection history?")) {
      setSavedReflections([]);
      localStorage.removeItem('meuus_dlas_reflections');
    }
  };

  const indicatorCards = [
    { label: 'Life Coverage', value: derived.lifeCoverage, basis: `${derived.lensesTouched} of 5 lenses reflected`, icon: Compass },
    { label: 'Practice Consistency', value: derived.consistency, basis: `${derived.recent} reflection(s) in last 30 days`, icon: Activity },
    { label: 'Execution Orientation', value: derived.executionOrientation, basis: `${derived.withAction} of ${derived.total} have a concrete action`, icon: TrendingUp },
    { label: 'Engagement', value: derived.engagement, basis: `${derived.total} total reflection(s) recorded`, icon: BarChart3 },
  ];

  return (
    <div id="dlas" className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader
        icon={<TrendingUp size={18} />}
        title="DLAS Engine"
        subtitle="Daily Learning & Action Synthesis — Understand → Learn → Reflect → Act."
        badge="Core Loop"
        breadcrumb="Intelligence"
      />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3 bg-white p-8 rounded-2xl border border-gray-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
            Canonical DLAS Engine · Longitudinal Growth
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Development Lens and Assessment System
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            DLAS is an evolving, evidence-aware human capability model that accompanies your growth through repeated reflection and honest action.
          </p>
        </div>

        {/* Longitudinal 8-Stage Cycle Bar */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <Activity className="w-3.5 h-3.5" />
              Longitudinal Development Cycle:
            </span>
            <span className="text-[11px] text-gray-400 font-mono">Stage {currentStage}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2" role="tablist" aria-label="Longitudinal development stages">
            {LONGITUDINAL_STAGES.map((s) => (
              <button
                key={s.step}
                type="button"
                role="tab"
                aria-selected={currentStage === s.step}
                onClick={() => setCurrentStage(s.step)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  currentStage === s.step
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs font-semibold'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="text-[11px] font-bold truncate">{s.label}</div>
                <div className="text-[9px] text-gray-400 truncate">{s.desc}</div>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-gray-500 leading-relaxed border-l-2 border-emerald-500 pl-3">
            {stage.hint}
          </p>
        </div>

        {/* 4 Assessment Levels Selector */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Select Assessment Tier:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ASSESSMENT_TIERS.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setActiveTier(tier.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activeTier === tier.id
                    ? 'bg-emerald-50 border-emerald-300 text-gray-900 shadow-xs'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">{tier.label}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 font-mono text-emerald-700 border border-emerald-200">
                    {tier.count} Questions
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{tier.desc}</p>
                <span className="text-[10px] text-gray-400 mt-2 block font-mono">Est: {tier.time}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 pt-1">
            Tier question banks are founder-authored content. The structured lens inquiry below uses the
            canonical prompts and guiding questions that are authored today; full per-tier banks are pending
            founder content and are never fabricated.
          </p>
        </div>

        {/* Mandatory Safety & Non-Diagnostic Boundary */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <span className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
              Canonical Governance & Safety Boundary:
            </span>
            <p className="text-amber-800 leading-relaxed">
              DLAS is <strong>strictly non-diagnostic and non-clinical</strong>. It is designed to support self-guided developmental understanding and honest reflection. It does not provide medical evaluation, psychiatric assessment, or automated final scoring authority. A human being is always more than a score, category, or first answer.
            </p>
          </div>
        </div>

        {/* 5 Lenses Selector */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Five Developmental Lenses:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {DLAS_LENSES.map((lens) => {
              const LensIcon = lens.icon;
              const isSelected = selectedLensId === lens.id;
              return (
                <button
                  key={lens.id}
                  onClick={() => setSelectedLensId(lens.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <LensIcon className={`w-5 h-5 mb-2 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                  <div>
                    <h4 className="text-xs font-bold leading-tight line-clamp-1">{lens.title.split('. ')[1]}</h4>
                    <p className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                      {lens.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Lens Workspace Card */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{currentLens.title}</h3>
              <p className="text-xs text-gray-500">{currentLens.subtitle}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 font-medium italic">
            "{currentLens.prompt}"
          </div>

          {/* Guiding Questions */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Guiding Inquiry:
            </span>
            <ul className="space-y-1 text-xs text-gray-600">
              {currentLens.guidingQuestions.map((q, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reflection Input Form */}
          <form role="form" onSubmit={handleSaveReflection} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Your Truthful Reflection <span className="text-gray-400 font-normal">({currentStage} stage)</span>:
              </label>
              <textarea
                rows={4}
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                aria-label="Your Truthful Reflection"
                placeholder="Write honestly. What is true for you in this dimension right now? (Saved locally on your device)"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {stage.actionLabel}:
              </label>
              <input
                type="text"
                value={actionStepText}
                onChange={(e) => setActionStepText(e.target.value)}
                aria-label={stage.actionLabel}
                placeholder="e.g. Schedule a 15-minute conversation; go for a quiet walk; audit monthly expenses."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 shadow-xs"
              >
                <Save className="w-4 h-4" />
                {stage.cta}
              </button>

              {showSavedNotification && (
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Saved to your private local memory
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Evidence-Derived Developmental Indicators */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4" aria-live="polite">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-gray-900">Evidence-Derived Developmental Indicators</h3>
          </div>

          {derived.total === 0 ? (
            <p className="text-xs text-gray-500 leading-relaxed">
              No indicators yet. These numbers are computed only from your real recorded reflections — they are
              never pre-filled or invented. Record your first reflection above to begin building honest evidence.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {indicatorCards.map(({ label, value, basis, icon: CardIcon }) => (
                  <div key={label} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-1.5 text-emerald-700 mb-2">
                      <CardIcon className="w-4 h-4" />
                      <span className="text-[11px] font-semibold text-gray-700">{label}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{value}<span className="text-sm text-gray-400">/100</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${value}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 leading-snug">{basis}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                These are transparent engagement proxies derived from your local reflection activity (breadth,
                consistency, action-orientation). They are <strong className="text-gray-600">not clinical or diagnostic scores</strong> and
                carry no automated authority over your self-understanding.
              </p>
            </>
          )}
        </div>

        {/* Local Reflection History */}
        {savedReflections.length > 0 && (
          <div className="space-y-3" aria-live="polite">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                Your Recorded Reflections ({savedReflections.length})
              </h4>
              <button
                onClick={handleClearHistory}
                className="text-xs text-gray-400 hover:text-rose-600 transition-colors"
              >
                Clear local history
              </button>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {savedReflections.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-700">{item.lensTitle}</span>
                    <span className="text-gray-400 font-mono flex items-center gap-2">
                      {item.longitudinalStep && (
                        <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[9px] text-gray-600">{item.longitudinalStep}</span>
                      )}
                      {item.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700">{item.reflectionText}</p>
                  {item.actionStep && (
                    <p className="text-[11px] text-gray-500">
                      <strong className="text-emerald-700">Action:</strong> {item.actionStep}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gate 4 — AI Profile Creator (bounded, human-in-the-loop) */}
        <AIProfileCreator />

      </div>
      </div>
    </div>
  );
}
