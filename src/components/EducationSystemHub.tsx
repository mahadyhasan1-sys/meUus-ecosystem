import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Lightbulb, 
  TrendingUp, 
  BookOpen, 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Compass, 
  Heart, 
  ShieldCheck,
  ChevronRight,
  Briefcase,
  Layers,
  Zap,
  Target
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEcosystem } from '../context/EcosystemContext';
import PageHeader from './PageHeader';

interface CurriculumTrack {
  id: 'how-to-learn' | 'how-to-earn' | 'emotional-intelligence';
  title: string;
  subtitle: string;
  icon: any;
  badge: string;
  color: string;
  levels: {
    levelNumber: string;
    levelTitle: string;
    description: string;
    modules: {
      title: string;
      focus: string;
      competency: string;
      duration: string;
    }[];
  }[];
}

const EDUCATION_TRACKS: CurriculumTrack[] = [
  {
    id: 'how-to-learn',
    title: 'How to Learn (জ্ঞান অর্জনের পদ্ধতি)',
    subtitle: 'The Human Cognitive & Literacy Operating System',
    icon: Lightbulb,
    badge: 'COGNITIVE LITERACY',
    color: 'text-blue-400',
    levels: [
      {
        levelNumber: 'LEVEL 00',
        levelTitle: 'The Starting Point: Inner Listening & Foundations',
        description: 'Before studying complex topics, a human must establish clean attention, psychological calm, and the ability to listen deeply without defensive ego.',
        modules: [
          {
            title: 'Module 1: Listen Before Knowledge',
            focus: 'Overcoming the impulse to react; practicing empathetic listening and silent presence.',
            competency: 'Attentive Presence',
            duration: '3 Days'
          },
          {
            title: 'Module 2: The Discipline of "Claim ≤ Evidence"',
            focus: 'Distinguishing between verified facts, personal opinions, and untested assumptions.',
            competency: 'Epistemic Rigor',
            duration: '4 Days'
          },
          {
            title: 'Module 3: Focus Anchors & Digital Detox',
            focus: 'Protecting attention from algorithm addiction; establishing 90-minute deep work blocks.',
            competency: 'Deep Attention',
            duration: '3 Days'
          }
        ]
      },
      {
        levelNumber: 'LEVEL 01',
        levelTitle: 'Expanding Horizons: Synthesis & Invariant Thinking',
        description: 'Advancing from basic comprehension to first-principles problem-solving, cross-disciplinary synthesis, and ethical application of technology.',
        modules: [
          {
            title: 'Module 4: First Principles & Mental Models',
            focus: 'Deconstructing complex social and technical systems down to their fundamental truths.',
            competency: 'Systems Thinking',
            duration: '7 Days'
          },
          {
            title: 'Module 5: Cross-Domain Synthesis',
            focus: 'Connecting technology, law, economics, and human psychology into unified solutions.',
            competency: 'Integrative Intelligence',
            duration: '7 Days'
          },
          {
            title: 'Module 6: Independent Research & Verification',
            focus: 'Navigating peer-reviewed records, public archives, and primary source documents.',
            competency: 'Source Grounding',
            duration: '7 Days'
          }
        ]
      }
    ]
  },
  {
    id: 'how-to-earn',
    title: 'How to Earn (হালাল ও মর্যাদাপূর্ণ জীবিকা)',
    subtitle: 'Dignified Micro-Value, Enterprise & Economic Resilience',
    icon: Briefcase,
    badge: 'ECONOMIC SOVEREIGNTY',
    color: 'text-emerald-600',
    levels: [
      {
        levelNumber: 'LEVEL 00',
        levelTitle: 'The Starting Point: Honest Micro-Value & Apprenticeship',
        description: 'Building self-reliance from zero capital through verified skill proof, direct customer service, and absolute financial truthfulness.',
        modules: [
          {
            title: 'Module 1: Micro-Problem Identification',
            focus: 'Finding immediate friction in your local neighborhood (e.g. food quality, digital forms, repairs).',
            competency: 'Opportunity Discovery',
            duration: '3 Days'
          },
          {
            title: 'Module 2: The Honest 1-Page Offer',
            focus: 'Defining what you deliver, the exact price in BDT ৳, and the transparent guarantee.',
            competency: 'Offer Architecture',
            duration: '3 Days'
          },
          {
            title: 'Module 3: Unit Economics & Cashflow Discipline',
            focus: 'Tracking income vs expense; separating personal money from business cash reserves.',
            competency: 'Financial Hygiene',
            duration: '5 Days'
          }
        ]
      },
      {
        levelNumber: 'LEVEL 01',
        levelTitle: 'Expanding Horizons: SME Formalization & Institutional Scale',
        description: 'Transitioning from informal freelancing or solo gigs into a compliant, resilient Bangladeshi enterprise with trade licensing and team governance.',
        modules: [
          {
            title: 'Module 4: Bangladesh Trade Licensing & RJSC',
            focus: 'Navigating municipal trade permits, TIN, BIN, and basic partnership documentation.',
            competency: 'Civic Compliance',
            duration: '7 Days'
          },
          {
            title: 'Module 5: Two-Way B2B Marketplace Alliances',
            focus: 'Building cooperative supplier networks across districts without high middlemen commissions.',
            competency: 'Collaborative Trade',
            duration: '7 Days'
          },
          {
            title: 'Module 6: AI-Assisted WorkStation Automation',
            focus: 'Using modern AI models (Codex, Claude, Gemini) to automate administrative operations.',
            competency: 'Digital Scalability',
            duration: '7 Days'
          }
        ]
      }
    ]
  },
  {
    id: 'emotional-intelligence',
    title: 'Emotional Intelligence (আবেগীয় বুদ্ধিমত্তা)',
    subtitle: 'Psychological Sanity, Calming Protocols & Family Harmony',
    icon: Brain,
    badge: 'MENTAL EQUILIBRIUM',
    color: 'text-purple-400',
    levels: [
      {
        levelNumber: 'LEVEL 00',
        levelTitle: 'The Starting Point: Self-Regulation & Calming',
        description: 'Managing stress, anxiety, and impulsive anger through somatic grounding, deep breathing, and emotional literacy.',
        modules: [
          {
            title: 'Module 1: The 5-Minute Restorative Pause',
            focus: 'Interrupting panic or overwhelm with physiologically proven box-breathing and visual stillness.',
            competency: 'Acute Self-Calming',
            duration: 'Daily Practice'
          },
          {
            title: 'Module 2: Emotional Naming & De-escalation',
            focus: 'Moving from vague distress to precise awareness ("I feel unappreciated and physically exhausted").',
            competency: 'Emotional Precision',
            duration: '4 Days'
          },
          {
            title: 'Module 3: Anger & Conflict Safeguards',
            focus: 'The 20-minute pause rule: never speak or write sensitive messages in heightened anger.',
            competency: 'Conflict De-escalation',
            duration: '4 Days'
          }
        ]
      },
      {
        levelNumber: 'LEVEL 01',
        levelTitle: 'Expanding Horizons: Empathetic Leadership & Family Peace',
        description: 'Cultivating enduring marital, parental, and workplace relationships grounded in honor, patience, and non-violent communication.',
        modules: [
          {
            title: 'Module 4: Non-Violent "I" Communication',
            focus: 'Expressing legitimate needs without shaming, accusing, or provoking defensive resentment.',
            competency: 'Relational Health',
            duration: '7 Days'
          },
          {
            title: 'Module 5: Multi-Generational Family Harmony',
            focus: 'Navigating Bengali joint-family friction, honoring aging parents while protecting marital boundaries.',
            competency: 'Cultural Wisdom',
            duration: '7 Days'
          },
          {
            title: 'Module 6: Restoring Communal Trust',
            focus: 'Building reliable friendships and mutual aid rings in your residential mahalla or campus.',
            competency: 'Social Solidarity',
            duration: '7 Days'
          }
        ]
      }
    ]
  }
];

export default function EducationSystemHub() {
  const { openAiGuide, logAction } = useEcosystem();
  const [activeTrackId, setActiveTrackId] = useState<'how-to-learn' | 'how-to-earn' | 'emotional-intelligence'>('how-to-learn');
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const activeTrack = EDUCATION_TRACKS.find(t => t.id === activeTrackId) || EDUCATION_TRACKS[0];
  const ActiveIcon = activeTrack.icon;

  const toggleModule = (moduleTitle: string) => {
    if (completedModules.includes(moduleTitle)) {
      setCompletedModules(completedModules.filter(m => m !== moduleTitle));
    } else {
      setCompletedModules([...completedModules, moduleTitle]);
      logAction({
        hubId: 'education-system',
        title: `Completed: ${moduleTitle}`,
        category: 'learning',
        status: 'completed',
        metadata: { track: activeTrack.title }
      });
    }
  };

  return (
    <div id="education" className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader 
        icon={<GraduationCap size={18} />} 
        title="Education Hub" 
        subtitle="How to Learn. How to Earn. How to Grow." 
        badge="Available Now" 
        breadcrumb="Knowledge" 
      />
      <section className="py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>THE MEUUS HUMAN EDUCATION & CAPABILITY SYSTEM</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight leading-tight">
              How to Learn. How to Earn. <br />
              <span className="text-blue-600">Emotional & Spiritual Sanity.</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Extracted directly from the preserved <em>Source of Truth</em>: A two-tier pedagogical architecture (Level 00 Starting Point & Level 01 Expanding Horizons) engineered to elevate human dignity, economic capability, and emotional calm.
            </p>
          </div>

          {/* 3 Main Curriculum Track Switchers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EDUCATION_TRACKS.map((track) => {
              const Icon = track.icon;
              const isActive = activeTrackId === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => setActiveTrackId(track.id)}
                  className={`p-6 rounded-3xl border text-left transition-all flex flex-col justify-between gap-4 ${
                    isActive
                      ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500/40 scale-[1.02]'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-gray-100 border border-gray-200 ${track.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="border-gray-200 text-gray-600 text-[10px] font-mono">
                      {track.badge}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-serif font-bold text-gray-900">
                      {track.title}
                    </h3>
                    <p className="text-xs text-gray-500 pt-1">
                      {track.subtitle}
                    </p>
                  </div>

                  <div className="text-xs font-mono font-bold text-blue-600 flex items-center gap-1">
                    <span>Explore 2 Levels (6 Modules)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

        {/* Active Track Comprehensive Curriculum Workspace */}
        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl bg-gray-100 border border-gray-200 ${activeTrack.color}`}>
                <ActiveIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                  {activeTrack.title}
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  Canonical Curriculum · Level 00 (Starting Point) & Level 01 (Expansion)
                </p>
              </div>
            </div>

            <Button
              onClick={() => openAiGuide(`I want to begin studying the meUus education track: "${activeTrack.title}". Can you give me a personalized study plan for Level 00?`)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-2xl flex items-center gap-1.5 self-start md:self-auto shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Study with Gemini AI Tutor</span>
            </Button>
          </div>

          {/* Level 00 and Level 01 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {activeTrack.levels.map((lvl, idx) => (
              <div 
                key={idx} 
                className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px]">
                      {lvl.levelNumber}
                    </Badge>
                    <span className="text-[11px] font-mono text-gray-500">3 Structured Modules</span>
                  </div>

                  <h4 className="text-xl font-serif font-bold text-gray-900">
                    {lvl.levelTitle}
                  </h4>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {lvl.description}
                  </p>

                  {/* Modules List */}
                  <div className="space-y-3 pt-2">
                    {lvl.modules.map((mod, modIdx) => {
                      const isDone = completedModules.includes(mod.title);
                      return (
                        <div 
                          key={modIdx}
                          onClick={() => toggleModule(mod.title)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                            isDone 
                              ? 'bg-emerald-50 border-emerald-300' 
                              : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <h5 className={`text-xs sm:text-sm font-bold ${isDone ? 'text-emerald-700 line-through' : 'text-gray-900'}`}>
                                {mod.title}
                              </h5>
                              <p className="text-[11px] text-gray-500 leading-relaxed">
                                {mod.focus}
                              </p>
                            </div>
                            <div className={`p-1.5 rounded-xl border shrink-0 transition-colors ${
                              isDone ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-gray-100 text-gray-400 border-gray-200'
                            }`}>
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px] font-mono">
                            <span className="text-blue-600 font-semibold">Competency: {mod.competency}</span>
                            <span className="text-gray-500">{mod.duration}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs font-mono text-gray-500">
                  <span>Track Progress:</span>
                  <span className="font-bold text-gray-900">
                    {lvl.modules.filter(m => completedModules.includes(m.title)).length} / {lvl.modules.length} Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DLAS-Linked Personalized 30-Day Learning Recommendation */}
        {(() => {
          let storedDlas: any = null;
          try {
            const raw = localStorage.getItem('meuus_offline_dlas_history_v1');
            storedDlas = raw ? JSON.parse(raw)[0] : null;
          } catch { /* ignore */ }

          if (!storedDlas) {
            return (
              <div className="p-6 rounded-3xl bg-gray-50 border border-dashed border-gray-300 text-center space-y-3">
                <GraduationCap className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-sm font-medium text-gray-500">Complete a DLAS Assessment to unlock your personalized 30-day learning path.</p>
                <a href="#dlas" className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold">
                  <ArrowRight className="w-3.5 h-3.5" /> Start DLAS Assessment
                </a>
              </div>
            );
          }

          const { scores, tier } = storedDlas;
          const lifeScore = scores?.lifeScore || 0;

          // Derive a prioritized 30-day track suggestion from DLAS scores
          const weakestArea = Object.entries(scores || {})
            .filter(([k]) => k !== 'lifeScore')
            .sort(([, a], [, b]) => (a as number) - (b as number))[0];
          const weakestKey = weakestArea ? weakestArea[0] : 'emotionalResilience';
          const areaLabels: Record<string, { label: string; track: string; color: string }> = {
            emotionalResilience: { label: 'Emotional Resilience', track: 'emotional-intelligence', color: 'text-rose-400' },
            executionOrientation: { label: 'Execution & Action', track: 'how-to-earn', color: 'text-emerald-600' },
            selfAwareness: { label: 'Self-Awareness', track: 'how-to-learn', color: 'text-blue-400' },
            financialPreparedness: { label: 'Financial Preparedness', track: 'how-to-earn', color: 'text-amber-400' },
          };
          const focus = areaLabels[weakestKey] || { label: 'Human Learning', track: 'how-to-learn', color: 'text-blue-400' };

          const days30 = [
            { days: '1-7', title: 'Foundation Reset', desc: 'Re-anchor the starting-point mindset and evidence-based self-view' },
            { days: '8-16', title: `Build Core: ${focus.label}`, desc: `Dedicate focused daily sessions to your DLAS-identified weakest area: ${focus.label}` },
            { days: '17-24', title: 'Apply & Evidence', desc: 'Complete at least 1 portfolio item demonstrating the skill in real context' },
            { days: '25-30', title: 'Re-assess & Graduate', desc: 'Retake DLAS to measure growth and unlock the next longitudinal cycle' },
          ];

          return (
            <div className="p-6 rounded-3xl bg-white border border-blue-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-mono uppercase text-blue-700 font-bold tracking-wider mb-1">
                    DLAS-Linked Personalized 30-Day Path
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Your Next 30 Days: <span className={focus.color}>{focus.label}</span> Track
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Based on your <span className="text-gray-900 font-semibold">{tier} Tier</span> DLAS assessment · Life Score <span className="font-bold text-emerald-600">{lifeScore}/100</span>
                  </p>
                </div>
                <button
                  onClick={() => setActiveTrackId(focus.track as any)}
                  className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Open Track →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {days30.map((phase, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                    <div className="text-[10px] font-mono text-gray-500 uppercase">Days {phase.days}</div>
                    <div className="text-sm font-bold text-gray-900">{phase.title}</div>
                    <div className="text-[11px] text-gray-600 leading-relaxed">{phase.desc}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono border-t border-gray-200 pt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>This path is entirely guidance — not a guarantee. Truthful completion requires honest evidence at Day 25-30 re-assessment.</span>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  </div>
  );
}
