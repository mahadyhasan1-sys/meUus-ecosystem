import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { PILLARS } from '../constants';
import { Pillar } from '../types';
import { 
  Brain, 
  Scale, 
  Briefcase, 
  UserMinus, 
  ShieldAlert, 
  Users, 
  Leaf, 
  Lightbulb, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Info,
  X,
  ShieldCheck,
  Building2,
  TrendingUp,
  HeartHandshake,
  Flame,
  Globe2,
  Lock,
  Layers,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReviewNotice from './ReviewNotice';

const ICON_MAP: Record<string, any> = {
  Brain,
  Scale,
  Briefcase,
  UserMinus,
  ShieldAlert,
  Users,
  Leaf,
  Lightbulb,
  MapPin
};

// Exact Mottos & Brand Identities for the Nine Pillars
const PILLAR_BRAND_EXTRAS: Record<string, { officialMotto: string; badgeText: string; accentColor: string; bgAccent: string }> = {
  'mind-beautifier': {
    officialMotto: 'Beautiful minds build beautiful lives.',
    badgeText: 'Mental Wellness & Reflection',
    accentColor: 'text-purple-400 border-purple-200',
    bgAccent: 'from-purple-950/40 via-slate-900 to-slate-950'
  },
  'legal-hub': {
    officialMotto: 'Justice for every citizen.',
    badgeText: 'Rights & Dispute Protection',
    accentColor: 'text-blue-400 border-blue-500/30',
    bgAccent: 'from-blue-950/40 via-slate-900 to-slate-950'
  },
  'business-hub': {
    officialMotto: 'Where businesses come to grow.',
    badgeText: 'Commerce, SME & Scaling',
    accentColor: 'text-amber-400 border-amber-200',
    bgAccent: 'from-amber-950/40 via-slate-900 to-slate-950'
  },
  'unemployment-buster': {
    officialMotto: 'Busting unemployment, one career at a time.',
    badgeText: 'Jobs & Apprenticeship Matching',
    accentColor: 'text-orange-400 border-orange-500/30',
    bgAccent: 'from-orange-950/40 via-slate-900 to-slate-950'
  },
  'drug-buster': {
    officialMotto: 'Breaking addiction. Rebuilding lives.',
    badgeText: 'Recovery & Life Restoration',
    accentColor: 'text-red-400 border-red-500/30',
    bgAccent: 'from-red-950/40 via-slate-900 to-slate-950'
  },
  'family-harmony': {
    officialMotto: 'Strong families. Strong Bangladesh.',
    badgeText: 'Mediation & Relational Health',
    accentColor: 'text-pink-400 border-pink-500/30',
    bgAccent: 'from-pink-950/40 via-slate-900 to-slate-950'
  },
  'green-solutions': {
    officialMotto: 'Sustainable today. Livable tomorrow.',
    badgeText: 'Climate, Solar & Agriculture',
    accentColor: 'text-emerald-600 border-emerald-200',
    bgAccent: 'from-emerald-950/40 via-slate-900 to-slate-950'
  },
  'idea-lab': {
    officialMotto: 'Where ideas are born and businesses begin.',
    badgeText: 'Incubation & Stage-Gating',
    accentColor: 'text-yellow-400 border-yellow-500/30',
    bgAccent: 'from-yellow-950/40 via-slate-900 to-slate-950'
  },
  'alive-bangladesh': {
    officialMotto: 'Bringing Bangladesh alive — one opportunity at a time.',
    badgeText: 'Civic Pride & Solidarity Network',
    accentColor: 'text-teal-400 border-teal-500/30',
    bgAccent: 'from-teal-950/40 via-slate-900 to-slate-950'
  }
};

export default function PillarsGrid() {
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        icon={<ShieldCheck size={18} />}
        title="Nine Pillars"
        subtitle="The Constitutional Core Principles Governing the Entire Ecosystem."
        badge="Constitution"
        breadcrumb="Transparency"
      />
      <section id="pillars" className="py-8 px-6 bg-white text-gray-900 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header - Microsoft Enterprise Section Pattern */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-mono uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>The Nine Pillars · One Cohesive Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight">
            Nine Solutions. <span className="text-emerald-600">One Living Human Ecosystem.</span>
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            In Bangladesh, challenges cannot be solved in isolation. meUus unites legal, commercial, emotional, familial, recovery, and environmental support into one coherent ecosystem.
          </p>
        </div>

        {/* The 9 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => {
            const Icon = ICON_MAP[pillar.iconName] || Brain;
            const extra = PILLAR_BRAND_EXTRAS[pillar.id] || {
              officialMotto: 'Connecting Everything.',
              badgeText: 'Canonical Hub',
              accentColor: 'text-emerald-600 border-emerald-200',
              bgAccent: 'from-slate-900 via-slate-900 to-slate-950'
            };

            return (
              <div 
                key={pillar.id}
                onClick={() => setSelectedPillar(pillar)}
                className={`group relative p-7 rounded-3xl bg-gradient-to-b ${extra.bgAccent} border border-gray-200 hover:border-emerald-500/60 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-sm hover:-translate-y-1 hover:shadow-md`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3.5 rounded-2xl bg-white text-emerald-600 border border-gray-200 group-hover:scale-110 transition-transform shadow-inner">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className={`text-[10px] font-mono ${extra.accentColor}`}>
                      {extra.badgeText}
                    </Badge>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                    meUus {pillar.title}
                  </h3>

                  {/* Official Motto */}
                  <p className="text-xs text-emerald-600/90 font-mono font-bold mb-3">
                    “{extra.officialMotto}”
                  </p>

                  <p className="text-sm text-gray-700 leading-relaxed mb-5">
                    {pillar.description}
                  </p>

                  {pillar.leadQuote && (
                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 text-xs text-gray-500 italic mb-5">
                      {pillar.leadQuote}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200/80 flex items-center justify-between text-xs text-emerald-600 font-mono font-bold">
                  <span>Inspect Hub Matrix ({pillar.capabilities.length} Capabilities)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational Storytelling Strip: "Endings Sow New Beginnings" (Microsoft Showcase Banner) */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-200 shadow-md relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transformation & Sincere Renewal</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
              “Endings Sow New Beginnings.”
            </h3>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              Every struggle in career, health, or personal hardship is fertile ground for honest renewal. When you are ready to take one honest step, the meUus community and intelligent toolkit are right beside you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <a
              href="#start"
              className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all text-center"
            >
              Start Reflection Today
            </a>
            <a
              href="#founder"
              className="px-7 py-3.5 bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-2xl font-mono text-xs font-bold transition-all text-center"
            >
              Read Founder Story
            </a>
          </div>
        </div>

        {/* Detailed Modal */}
        {selectedPillar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-3xl max-h-[85vh] bg-white border border-gray-200 rounded-3xl p-6 md:p-10 overflow-y-auto shadow-2xl space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 text-[10px] font-mono mb-2">
                    PILLAR SPECIFICATION · CLAIM ≤ EVIDENCE
                  </Badge>
                  <h3 className="text-3xl font-serif font-bold text-gray-900">
                    meUus {selectedPillar.title}
                  </h3>
                  <p className="text-sm text-emerald-700 mt-1 font-mono font-medium">
                    “{PILLAR_BRAND_EXTRAS[selectedPillar.id]?.officialMotto || selectedPillar.tagline}”
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPillar(null)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ReviewNotice 
                variant="card"
                topic={selectedPillar.title}
                customContext={`Review status: ${selectedPillar.reviewStatus}. Content is provided for learning, literacy, and structured referral.`}
              />

              {/* Core Features */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold">
                  Core Offerings & Scope:
                </h4>
                <ul className="space-y-2">
                  {selectedPillar.features.map((f, idx) => (
                    <li key={idx} className="text-xs md:text-sm text-gray-800 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Capability Matrix Status Table */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold">
                    Truth Status & Operating Mode:
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-600 font-semibold">Strictly Enforced Boundary</span>
                </div>
                <div className="space-y-2">
                  {selectedPillar.capabilities.map((cap, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-gray-900">{cap.name}</span>
                        <div className="text-[11px] text-gray-500 font-mono">{cap.evidenceNote}</div>
                      </div>
                      <Badge variant="outline" className={`font-mono text-[10px] ${
                        cap.status === 'LIVE' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' :
                        cap.status === 'PILOT' ? 'border-amber-300 bg-amber-50 text-amber-800' :
                        'border-rose-300 bg-rose-50 text-rose-800'
                      }`}>
                        {cap.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <Button 
                  onClick={() => setSelectedPillar(null)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs"
                >
                  Close Specification
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
    </div>
  );
}
