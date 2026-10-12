/**
 * AppreciationPage — Institutional Memory & Contributor Ledger
 * 
 * Complies with meUus Master Constitution Section 27:
 * "The Appreciation page is not merely a thank-you page.
 * It is institutional memory.
 * Preserve the approved acknowledgement structure:
 * - OpenAI / ChatGPT / Codex and the people behind them
 * - Anthropic / Claude and the people behind it
 * - DeepSeek and the people behind it
 * - Google / Gemini & Firebase and the people behind them
 * - Open-source community
 * Do not imply endorsement, sponsorship, partnership, ownership, or official affiliation.
 * AI systems are contributors/tools. They are not constitutional authorities."
 */

import React from 'react';
import { Heart, ArrowLeft, ShieldCheck, Sparkles, Cpu, Users, Award, ExternalLink } from 'lucide-react';

interface ContributorEntry {
  category: 'AI Tooling & Models' | 'Open Source Ecosystem' | 'Foundational Counsel & Pioneers';
  name: string;
  role: string;
  contribution: string;
  truthNotice: string;
}

const ACKNOWLEDGEMENTS: ContributorEntry[] = [
  {
    category: 'AI Tooling & Models',
    name: 'OpenAI (ChatGPT, GPT-4o, Codex) & The People Behind Them',
    role: 'Computational Reasoning & Architecture Ideation Tool',
    contribution: 'Assisted in refining multi-agent concepts, code exploration, and early structural draftsmanship across the R-series evolution.',
    truthNotice: 'Used as an engineering & drafting tool. Does not constitute official partnership, endorsement, or constitutional authority.',
  },
  {
    category: 'AI Tooling & Models',
    name: 'Anthropic (Claude 3.5 Sonnet / 3.7) & The People Behind It',
    role: 'Deep Contextual Analysis & Prose Crafting Tool',
    contribution: 'Assisted in reviewing extensive documentation, truth-checking consistency, and structuring long-form philosophical manuscripts.',
    truthNotice: 'Used as an intellectual sparring tool. Does not imply corporate sponsorship or official affiliation.',
  },
  {
    category: 'AI Tooling & Models',
    name: 'DeepSeek (DeepSeek R1 / V3) & The People Behind It',
    role: 'Algorithmic Efficiency & Open Mathematical Reasoning',
    contribution: 'Demonstrated sovereign computational architecture, inspiring local-first and resource-efficient kernel algorithms.',
    truthNotice: 'Independent technological reference point. No institutional partnership.',
  },
  {
    category: 'AI Tooling & Models',
    name: 'Google (Gemini Pro/Flash, Firebase, Cloud SQL) & Its Engineers',
    role: 'Cloud Infrastructure, Authentication & Multimodal Processing',
    contribution: 'Powers real-time multimodal inference, secure token authentication, and regional PostgreSQL data integrity.',
    truthNotice: 'Standard enterprise cloud infrastructure customer relationship.',
  },
  {
    category: 'Open Source Ecosystem',
    name: 'React, Vite, Tailwind CSS, Motion & TypeScript Communities',
    role: 'Modern Web Engineering Foundation',
    contribution: 'Provides the high-performance, accessible, declarative component framework upon which meUus runs at 60fps.',
    truthNotice: 'Licensed under MIT / Apache 2.0 open-source covenants.',
  },
  {
    category: 'Foundational Counsel & Pioneers',
    name: 'The Citizens, Mentors & Aspiring Workers of Bangladesh',
    role: 'The Moral Heart & Living Purpose of meUus',
    contribution: 'Every real-world struggle—from unemployment and trade license bureaucracy to domestic stress—grounded this ecosystem in reality rather than Silicon Valley hype.',
    truthNotice: 'The foundational reason meUus exists: me → U → us.',
  },
];

export default function AppreciationPage() {
  return (
    <div className="min-h-full bg-gray-50 text-gray-900 py-10 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-current" />
            Institutional Memory & Contributor Covenant
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Appreciation & Intellectual Heritage
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl">
            meUus was not built in a vacuum. It represents the synthesis of honest human struggle,
            groundbreaking AI assistance, and the global open-source commons.
          </p>
        </div>

        {/* Governance & Non-Endorsement Standard */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs text-xs text-gray-600 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1 leading-relaxed">
            <span className="font-bold text-gray-900 uppercase tracking-wider text-[11px] block">
              Truth in Acknowledgement (Section 27 Covenant):
            </span>
            <p>
              Acknowledgement of AI systems, algorithms, and technical platforms recognizes their role as
              <strong className="text-gray-800"> tools and contributors</strong>. It does not imply that these organizations endorse,
              sponsor, own, or govern meUus. AI models are instruments of human intelligence; they are not
              constitutional authorities. Human responsibility remains paramount.
            </p>
          </div>
        </div>

        {/* Contributor Matrix */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            The Living Register of Contributors & Tools
          </h2>

          <div className="grid gap-3 sm:grid-cols-1">
            {ACKNOWLEDGEMENTS.map((entry, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-gray-200 bg-white shadow-xs space-y-2.5 hover:border-emerald-300 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {entry.category}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 mt-1.5">{entry.name}</h3>
                  </div>
                  <span className="text-xs text-gray-400 font-mono italic">
                    {entry.role}
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {entry.contribution}
                </p>

                <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400 font-mono">
                  <strong className="text-gray-600">Status Notice:</strong> {entry.truthNotice}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Founder Dedication */}
        <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3 text-center">
          <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-lg">
            m
          </div>
          <blockquote className="text-sm sm:text-base italic text-gray-700 max-w-xl mx-auto leading-relaxed">
            “True gratitude is not flattery. It is remembering who helped you when you had nothing,
            honoring the tools that gave you leverage, and turning that strength toward serving others.”
          </blockquote>
          <p className="text-xs font-mono text-emerald-700 font-semibold uppercase tracking-wider">
            Md. Mahady Hasan (Rujbel / Ruju) · Founder & Client #001
          </p>
        </div>

        {/* Return Button */}
        <div className="text-center">
          <a href="#dashboard" className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-2">
            Return to Dashboard
          </a>
        </div>

      </div>
    </div>
  );
}
