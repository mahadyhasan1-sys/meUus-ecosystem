import React from 'react';
import { Compass, Users, Heart, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-full bg-gray-50 text-gray-900 py-10 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-3">
            About meUus Ecosystem
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-gray-900">
            me → U → us
          </h1>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl">
            meUus (aLive Bangladesh) is a human development operating system designed to empower individuals, foster understanding across communities, and build collective resilience.
          </p>
        </div>

        {/* Core Philosophy Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
              me
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">Understand (me)</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Personal self-reflection, emotional regulation, and clear goal alignment through Mind Beautifier and self-assessments.
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
              U
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">Learn (U)</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Connecting with others, practical skill development, business formalization, and legal empowerment.
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
              us
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">Act (us)</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Collective action where no citizen is left behind—building resilient communities across all 64 districts.
            </p>
          </div>
        </div>

        {/* Verification & Reality */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-2xl shadow-xs mb-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Distinguishing Current Reality from Vision</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Current Verified Foundation
              </h3>
              <ul className="text-xs text-gray-600 space-y-2 leading-relaxed">
                <li>• Public information and human development concept portals.</li>
                <li>• Self-guided browser journey (`#start-door`).</li>
                <li>• Interactive Google Classroom hub and educational resources.</li>
                <li>• Transparent Client 001 ledger framework.</li>
                <li>• Public evidence index (`#evidence`).</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-600" /> Future Ecosystem Direction
              </h3>
              <ul className="text-xs text-gray-600 space-y-2 leading-relaxed">
                <li>• Multi-tenant marketplace and transaction systems.</li>
                <li>• Cloud-authenticated user profile accounts.</li>
                <li>• District-level physical hubs expansion.</li>
                <li>• Integrated DLAS professional assessment network.</li>
                <li>• Automated AI agent operations under human supervision.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Founder Context */}
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-xs text-xs text-gray-600 leading-relaxed space-y-2 mb-8">
          <p className="font-bold text-gray-900 text-sm">Founder & Stewardship Note</p>
          <p>
            Initiated by Mahady Hasan (Swagda, Muradnagar, Cumilla), meUus represents a commitment to structural honesty, public evidence, and consistent action over rhetoric.
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
