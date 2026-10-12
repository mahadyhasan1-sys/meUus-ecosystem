import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { motion } from 'motion/react';
import { 
  Code2, ShieldCheck, Download, ExternalLink, Cpu, 
  Layers, Database, Smartphone, Globe, Sparkles, CheckCircle2, 
  Clock, HeartHandshake, PhoneCall
} from 'lucide-react';

export default function ProjectTechOverview() {
  const [copiedZip, setCopiedZip] = useState(false);

  const handleDownloadZip = () => {
    setCopiedZip(true);
    setTimeout(() => setCopiedZip(false), 2500);
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        icon={<Database size={18} />}
        title="Tech Overview"
        subtitle="Architecture, Technology Stack, Database Schemas, and Service Layer."
        badge="Architecture"
        breadcrumb="System"
      />
      <section id="tech-specs" className="py-8 px-6 bg-white text-gray-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-mono uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture & Developer Distribution</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-gray-900 leading-tight">
            Technical Architecture & <span className="text-emerald-600">Emergency Protocol</span>
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-sans">
            Built with strict boundary verification, default-deny security invariants, zero data-monetization guarantees, and an active 15-minute emergency triage network.
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Tech Stack Breakdown */}
          <div className="p-7 rounded-3xl bg-white border border-gray-200 space-y-5 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                <Code2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif font-bold text-lg text-gray-900">Full-Stack Tech Architecture</h3>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { label: 'Web Frontend', val: 'React 18 + Vite + Tailwind CSS' },
                  { label: 'Mobile Runtime', val: 'Flutter 3.x / Dart (iOS & Android)' },
                  { label: 'Cloud Storage & DB', val: 'Firebase Firestore + Auth' },
                  { label: 'State & Navigation', val: 'Riverpod / GoRouter / Context' },
                  { label: 'Multimodal AI Gateway', val: 'Google Gemini 3.5 / 3.1 Pro / Veo 3' },
                  { label: 'Local Encrypted Cache', val: 'Hive (Offline-first)' },
                  { label: 'Bangladeshi Integrations', val: 'bKash, Nagad, Stripe, NID OCR' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-gray-50 border border-gray-200/80">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-mono font-semibold text-emerald-700 text-[11px]">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[11px] font-mono text-gray-400 flex items-center justify-between">
              <span>Security Invariant: Default-Deny</span>
              <span className="text-emerald-600">PASSED</span>
            </div>
          </div>

          {/* Column 2: 15-Minute Emergency Human Response */}
          <div className="p-7 rounded-3xl bg-white border border-emerald-200 space-y-5 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                <Clock className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif font-bold text-lg text-gray-900">15-Min Human Response Protocol</h3>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                When a citizen is in urgent crisis (severe distress, domestic danger, sudden legal arrest, or acute job loss), technology hands over to verified human responders within 15 minutes.
              </p>

              <div className="space-y-2">
                {[
                  { step: '1. Instant Triage', desc: 'meYoo AI activates emergency safety protocol.' },
                  { step: '2. Local Advocate Ping', desc: 'Secure alert sent to nearest verified meUus guide.' },
                  { step: '3. Direct Human Contact', desc: 'Voice or in-person legal/wellbeing guidance initiated.' },
                ].map((s, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                    <div className="font-bold text-xs text-emerald-800">{s.step}</div>
                    <div className="text-[11px] text-gray-600">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs font-mono font-bold text-emerald-800 flex items-center justify-center gap-2">
              <PhoneCall className="w-4 h-4" />
              <span>24/7 Crisis Hotline Available</span>
            </div>
          </div>

          {/* Column 3: Complete Package & Founder Living Archive */}
          <div className="p-7 rounded-3xl bg-white border border-gray-200 space-y-5 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                <Download className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif font-bold text-lg text-gray-900">Distribution & Export Package</h3>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  'Full Source Code (React 18 + Flutter 3)',
                  'Custom App Icons (1024x1024 & All Sizes)',
                  'Firebase Configuration Blueprint & Rules',
                  '15 Canonical Routes & Sitemaps',
                  'DLAS Development Lens Assessment Engine',
                  '9 Pillars Verification Protocols',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Founder Tag */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white text-sm">
                  R
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Md. Mahady Hasan (Ruju)</div>
                  <div className="text-[10px] font-mono text-emerald-600">Founder & CEO · Client #001</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadZip}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{copiedZip ? 'Package Verified & Prepared!' : 'Download Complete Ecosystem Specs'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
