import React from 'react';
import { ArrowUpRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { CANONICAL_REVIEW_NOTE } from '../constants';

export default function Footer() {
  return (
    <footer role="contentinfo" className="bg-white text-gray-800 border-t border-gray-200 pt-16 pb-10 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Canonical Review Note */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-gray-800 mr-1.5 font-mono text-[11px] uppercase">
                Canonical Release & Verification Policy:
              </span>
              {CANONICAL_REVIEW_NOTE}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Identity */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-xs">
                m
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">meUus</span>
            </div>
            <p className="text-xs text-emerald-700 font-mono font-medium">
              Start with me · Grow with U · Build us
            </p>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              meUus is a human-centred development, connection and action ecosystem. We help individuals understand reality, reflect with clarity, connect their capacities, and build sustainable resilience together.
            </p>
            <div className="text-[11px] font-mono text-gray-400 pt-1">
              Founder: Md. Mahady Hasan (Rujbel) · Claim ≤ Evidence
            </div>
          </div>

          {/* Col 2: The 4 Canonical Domains */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 font-mono mb-3">
              Four Domains
            </h4>
            <ul className="space-y-2 text-xs text-gray-600" aria-label="Four Domains">
              <li>
                <a href="https://meuus.org" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 flex items-center gap-1 transition-colors">
                  <span>meuus.org (Understand)</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a href="https://meuussoul.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 flex items-center gap-1 transition-colors">
                  <span>meuussoul.com (Learn)</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a href="https://meuus.app" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700 flex items-center gap-1 transition-colors">
                  <span>meuus.app (Reflect & Act)</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a href="https://rujbel.org" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700 flex items-center gap-1 transition-colors">
                  <span>rujbel.org (Founder Archive)</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Core Starting Portals */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 font-mono mb-3">
              Starting Portals
            </h4>
            <ul className="space-y-2 text-xs text-gray-600" aria-label="Starting Portals">
              <li><a href="#start-door" className="hover:text-emerald-700 transition-colors">Universal Start Door</a></li>
              <li><a href="#dashboard" className="hover:text-emerald-700 transition-colors">Dashboard Overview</a></li>
              <li><a href="#soul-profile" className="hover:text-emerald-700 transition-colors">Master Soul Profile</a></li>
              <li><a href="#dlas" className="hover:text-emerald-700 transition-colors">DLAS Reflection</a></li>
              <li><a href="#knowledge" className="hover:text-emerald-700 transition-colors">Knowledge Hub</a></li>
              <li><a href="#marketplace" className="hover:text-emerald-700 transition-colors">Two-Way Marketplace</a></li>
            </ul>
          </div>

          {/* Col 4: Governance & Evidence */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 font-mono mb-3">
              Governance & Truth
            </h4>
            <ul className="space-y-2 text-xs text-gray-600" aria-label="Governance & Truth">
              <li><a href="#evidence" className="hover:text-emerald-700 transition-colors">Evidence Ledger</a></li>
              <li><a href="#safety" className="hover:text-emerald-700 transition-colors">Safety & Amanah</a></li>
              <li><a href="#accessibility" className="hover:text-emerald-700 transition-colors">Accessibility</a></li>
              <li><a href="#about" className="hover:text-emerald-700 transition-colors">About meUus</a></li>
              <li><a href="#appreciation" className="hover:text-emerald-700 transition-colors">Appreciation</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400 font-mono">
          <p>© 2026 meUus Ecosystem. All Rights Preserved under Claim ≤ Evidence.</p>
          <div className="flex gap-3">
            <span>Honest Action Over Perfection</span>
            <span>·</span>
            <span>Privacy by Default</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
