import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileCheck, 
  AlertTriangle, 
  HelpCircle, 
  History, 
  RefreshCw, 
  ArrowLeft,
  CheckCircle2,
  FileText,
  Lock
} from 'lucide-react';
import ReviewNotice from './ReviewNotice';

interface EvidenceItem {
  id: string;
  claim: string;
  category: string;
  status: 'SUPPORTED' | 'PARTIAL' | 'UNKNOWN' | 'HISTORICAL' | 'SUPERSEDED';
  evidenceSummary: string;
  lastVerified: string;
}

const CLAIMS_REGISTRY: EvidenceItem[] = [
  {
    id: 'EVID-001',
    claim: 'Founder Background & Navy Family Roots in Cumilla',
    category: 'Foundation & Identity',
    status: 'SUPPORTED',
    evidenceSummary: 'Documented public founder narrative (Md. Mahady Hasan born in Swagda, Muradnagar, Cumilla; father served in Bangladesh Navy).',
    lastVerified: '2026-08-18'
  },
  {
    id: 'EVID-002',
    claim: 'Four-Domain Ecosystem Architecture & Distinct Roles',
    category: 'Ecosystem Architecture',
    status: 'SUPPORTED',
    evidenceSummary: 'Active architecture across meuus.org (Understand), meuussoul.com (Learn), meuus.app (Reflect + Act), and rujbel.org (Founder Archive).',
    lastVerified: '2026-08-18'
  },
  {
    id: 'EVID-003',
    claim: 'Nine Human Development Pillars & Capability Status Matrix',
    category: 'Ecosystem Architecture',
    status: 'SUPPORTED',
    evidenceSummary: 'Published capability matrices specifying Knowledge, Manual Pilots, Verified Professional routing, and AI Assist boundaries.',
    lastVerified: '2026-08-18'
  },
  {
    id: 'EVID-004',
    claim: 'DLAS (Development Lens and Assessment System)',
    category: 'DLAS & Reflection',
    status: 'SUPPORTED',
    evidenceSummary: 'Canonical non-diagnostic developmental framework for structured reflection across 5 life dimensions.',
    lastVerified: '2026-08-18'
  },
  {
    id: 'EVID-005',
    claim: 'Personal Master Soul & Privacy Matrix',
    category: 'Identity Layer',
    status: 'SUPPORTED',
    evidenceSummary: 'Working client-side Master Soul with field-level visibility controls (Private, Selective, Connected, Public) and JSON portability.',
    lastVerified: '2026-08-18'
  },
  {
    id: 'EVID-006',
    claim: 'Two-Way Need ↔ Capacity Marketplace',
    category: 'Economic & Opportunity',
    status: 'PARTIAL',
    evidenceSummary: 'Client-side exchange and verified SME service listings active; automated multi-party escrow clearing in staged review.',
    lastVerified: '2026-08-18'
  },
  {
    id: 'EVID-007',
    claim: 'Automated Psychiatric Diagnosis & Clinical Treatment',
    category: 'Safety & Health',
    status: 'SUPERSEDED',
    evidenceSummary: 'Strictly prohibited by meUus governance. Mind Beautifier operates purely through non-clinical reflection and referral to certified doctors.',
    lastVerified: '2026-08-18'
  },
  {
    id: 'EVID-008',
    claim: '64 District Physical Expansion',
    category: 'Geographic Scale',
    status: 'HISTORICAL',
    evidenceSummary: 'Vision 2030 roadmap target; physical center pilots currently in phased rollout starting in Dhaka.',
    lastVerified: '2026-08-18'
  }
];

export default function EvidencePage() {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredItems = filter === 'ALL'
    ? CLAIMS_REGISTRY
    : CLAIMS_REGISTRY.filter(item => item.status === filter);

  const getStatusBadge = (status: EvidenceItem['status']) => {
    switch (status) {
      case 'SUPPORTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <ShieldCheck className="w-3.5 h-3.5" /> SUPPORTED
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3.5 h-3.5" /> PARTIAL
          </span>
        );
      case 'UNKNOWN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-700 border border-gray-500/40">
            <HelpCircle className="w-3.5 h-3.5" /> UNKNOWN
          </span>
        );
      case 'HISTORICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
            <History className="w-3.5 h-3.5" /> ROADMAP / HISTORICAL
          </span>
        );
      case 'SUPERSEDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <RefreshCw className="w-3.5 h-3.5" /> SUPERSEDED / PROHIBITED
          </span>
        );
    }
  };

  return (
    <div className="min-h-full bg-gray-50 text-gray-900 py-10 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Governance & Truth Ledger
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Evidence & Claims Registry
              </h1>
              <p className="text-gray-500 text-sm mt-1 max-w-2xl leading-relaxed">
                Operating under our governing constitutional principle: <strong className="text-gray-700">Claim ≤ Evidence</strong>. Every capability, status claim, and historical milestone is indexed and audited openly.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600 space-y-1">
              <div>Total Indexed Claims: <span className="font-bold text-gray-900">{CLAIMS_REGISTRY.length}</span></div>
              <div>Supported in Code/State: <span className="font-bold text-emerald-600 font-semibold">5</span></div>
            </div>
          </div>
        </div>

        {/* Canonical Review Notice */}
        <div className="mb-6">
          <ReviewNotice 
            variant="banner"
            customContext="This Evidence Ledger is audited progressively. Where independent external review by certified accountants, lawyers, or scholars is ongoing, claims are transparently classified."
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
          {['ALL', 'SUPPORTED', 'PARTIAL', 'HISTORICAL', 'SUPERSEDED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Table / Cards */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-gray-400 font-semibold">{item.id}</span>
                  <span className="text-xs text-gray-400 font-mono">· {item.category}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-snug">{item.claim}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {item.evidenceSummary}
                </p>
              </div>

              <div className="flex md:flex-col items-end justify-between md:justify-center gap-2 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
                <div>{getStatusBadge(item.status)}</div>
                <span className="text-[11px] font-mono text-gray-400">
                  Verified: {item.lastVerified}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
