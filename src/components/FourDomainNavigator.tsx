import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { ECOSYSTEM_DOMAINS } from '../constants';
import { DomainRole } from '../types';
import { ArrowUpRight, CheckCircle2, Compass, BookOpen, Sparkles, Archive, ArrowRight, ShieldCheck, ExternalLink, Layers, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FourDomainNavigatorProps {
  currentDomainRole?: DomainRole;
  onSelectRole?: (role: DomainRole) => void;
}

export default function FourDomainNavigator({ 
  currentDomainRole = 'understand',
  onSelectRole 
}: FourDomainNavigatorProps) {
  const [activeRole, setActiveRole] = useState<DomainRole>(currentDomainRole);

  const getRoleIcon = (role: DomainRole) => {
    switch (role) {
      case 'understand': return Compass;
      case 'learn': return BookOpen;
      case 'reflect-act': return Sparkles;
      case 'archive': return Archive;
    }
  };

  const getRoleColor = (role: DomainRole) => {
    switch (role) {
      case 'understand': return 'border-emerald-500 bg-emerald-950/40 text-emerald-700';
      case 'learn': return 'border-blue-500 bg-blue-950/40 text-blue-300';
      case 'reflect-act': return 'border-amber-500 bg-amber-950/40 text-amber-300';
      case 'archive': return 'border-purple-500 bg-purple-950/40 text-purple-300';
    }
  };

  const domainDeepDives: Record<DomainRole, {
    purpose: string;
    flow: string;
    sections: { label: string; href: string; desc: string }[];
  }> = {
    understand: {
      purpose: 'Civic gateway, Nine Pillars, public transparency, and institutional covenant under Claim ≤ Evidence.',
      flow: 'Feeds verified ethical grounding and constitutional boundary definitions into meuussoul.com (learning) and meuus.app (action).',
      sections: [
        { label: 'The Nine Pillars', href: '#pillars', desc: 'Core 9 capability hubs' },
        { label: 'Radical Transparency', href: '#transparency', desc: 'Financial ledger & build stats' },
        { label: 'Evidence Registry', href: '#evidence', desc: 'Preserved proofs and verification index' },
        { label: 'Safety & Trust', href: '#safety', desc: 'Constitutional human protections' },
      ],
    },
    learn: {
      purpose: 'Knowledge foundation, 114-Day Quran, 80-Day Seerah, and cognitive literacy (How to Learn, Earn & Emotional Sanity).',
      flow: 'Supplies foundational truth, structured mental models, and ethical clarity to illuminate reflective journaling and task execution.',
      sections: [
        { label: 'Quran & Seerah Journeys', href: '#soul-journeys', desc: '114-Day & 80-Day structured tracks' },
        { label: 'Human Education Hub', href: '#education', desc: 'Pedagogical curriculum (Level 00 & 01)' },
        { label: 'Knowledge Hub', href: '#knowledge', desc: 'Source-grounded reference library' },
        { label: 'Mind Beautifier', href: '#wellness', desc: 'Culturally grounded emotional reflection' },
      ],
    },
    'reflect-act': {
      purpose: 'The core operating system: DLAS assessment, AI agent engine, offline studio, self-building dynamic tools, and two-way economic marketplace.',
      flow: 'Transforms knowledge and civic purpose into daily micro-actions, verified skills, and dignified livelihood across all 64 districts.',
      sections: [
        { label: 'Universal meYoo OS', href: '#meyoo', desc: 'Governed AI command center' },
        { label: 'DLAS Assessment', href: '#dlas', desc: '4-Tier longitudinal growth engine' },
        { label: 'Career Skill Graph', href: '#career-skill-graph', desc: 'Evidence portfolio & gap analysis' },
        { label: 'Creation Studio', href: '#studio', desc: 'Offline visual, text & video canvas' },
        { label: 'Self-Building Hub', href: '#self-building', desc: 'Autonomous tool compiler' },
        { label: 'Two-Way Marketplace', href: '#marketplace', desc: 'Capacity ↔ Need exchange' },
      ],
    },
    archive: {
      purpose: 'Client #001 living narrative, chronological evolution, architecture decision records, and laptop preservation archive.',
      flow: 'Preserves primary evidence and historical integrity so current applications stay clean and unburdened by legacy clutter.',
      sections: [
        { label: 'Founder Narrative', href: '#founder', desc: 'Living story of Md. Mahady Hasan' },
        { label: 'Preserved Work Showcase', href: '#preservation', desc: '22 R-series iterations & 37 book chapters' },
        { label: 'Architecture Specs', href: '#tech', desc: '7-Layer OS & technical overview' },
        { label: 'Institutional Appreciation', href: '#appreciation', desc: 'Citations of AI models & open source' },
      ],
    },
  };

  const activeDomain = ECOSYSTEM_DOMAINS.find(d => d.role === activeRole) || ECOSYSTEM_DOMAINS[0];
  const activeDeepDive = domainDeepDives[activeRole];

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        icon={<Compass size={18} />}
        title="Four Domains"
        subtitle="meuus.org (Understand) · meuussoul.com (Learn) · meuus.app (Act) · rujbel.org (Archive)"
        badge="Canonical"
        breadcrumb="Ecosystem"
      />
      <section className="py-8 px-6 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-2">
              Canonical Architecture
            </div>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              The Four Canonical Ecosystem Domains
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-1 max-w-2xl">
              Each domain carries a distinct, non-overlapping responsibility in the human development loop: Understand → Learn → Reflect & Act → Founder Archive.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All 4 Domains Unified & Active · Click Card to Inspect</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {ECOSYSTEM_DOMAINS.map((domain) => {
            const Icon = getRoleIcon(domain.role);
            const isSelected = activeRole === domain.role;
            const roleColorClass = getRoleColor(domain.role);

            return (
              <div 
                key={domain.id}
                onClick={() => {
                  setActiveRole(domain.role);
                  if (onSelectRole) onSelectRole(domain.role);
                }}
                className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? `shadow-md ring-2 ring-emerald-500/50 scale-[1.02] ${roleColorClass}` 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-2xl ${isSelected ? 'bg-white/10' : 'bg-gray-200'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono tracking-wider border-gray-300 bg-gray-200/80 text-emerald-600">
                      {domain.status}
                    </Badge>
                  </div>

                  <div className="mb-1 flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
                    <span>{domain.role.toUpperCase()}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-between">
                    <span>{domain.name}</span>
                    <a 
                      href={domain.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label={`Open ${domain.name} external portal`}
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </h3>

                  <p className="text-xs font-medium text-emerald-600/90 mb-3">
                    {domain.tagline}
                  </p>

                  <p className="text-xs text-gray-500 leading-relaxed mb-5">
                    {domain.description}
                  </p>
                </div>

                <div className="border-t border-gray-200/80 pt-4 mt-auto">
                  <div className="text-[11px] font-semibold text-gray-700 mb-2">Primary Functions:</div>
                  <ul className="space-y-1.5">
                    {domain.primaryFunctions.map((fn, idx) => (
                      <li key={idx} className="text-[11px] text-gray-500 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{fn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Domain Surface Inspector & Rapid Navigation Console */}
        <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200 shadow-md space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-emerald-600 font-bold tracking-wider mb-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Surface Inspection: {activeDomain.name} ({activeDomain.role.toUpperCase()})</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{activeDomain.tagline}</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-3xl">{activeDeepDive.purpose}</p>
            </div>
            <a
              href={activeDomain.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 transition-colors shadow-xs"
            >
              <span>Visit {activeDomain.name}</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/90" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Inter-domain data covenant */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
              <div className="text-xs font-mono uppercase text-gray-500 font-bold tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Data Flow Covenant</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                {activeDeepDive.flow}
              </p>
            </div>

            {/* In-app section links */}
            <div className="md:col-span-2 p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
              <div className="text-xs font-mono uppercase text-gray-500 font-bold tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Jump Directly to In-App Surfaces</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeDeepDive.sections.map((sec) => (
                  <a
                    key={sec.label}
                    href={sec.href}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-emerald-500/50 hover:bg-gray-100/80 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{sec.label}</div>
                      <div className="text-[10px] text-gray-500">{sec.desc}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}

