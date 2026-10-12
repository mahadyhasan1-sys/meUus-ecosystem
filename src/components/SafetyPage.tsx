import React from 'react';
import { Shield, Lock, HeartHandshake, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export default function SafetyPage() {
  return (
    <div className="min-h-full bg-gray-50 text-gray-900 py-10 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        {/* Title & Badge */}
        <div className="mb-8 text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-3">
            Amanah & Safety Policy
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 text-gray-900">
            Consolidated Safety & Trust Boundary
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Protecting human dignity, participant safety, data privacy, and ethical boundaries across all meUus platforms.
          </p>
        </div>

        {/* Safety Pillars */}
        <div className="space-y-5">
          {/* 1. Amanah & Consent */}
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2.5 mb-2.5 text-emerald-700">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">1. Amanah (Trust) & Granular Consent</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
              Your trust is a sacred trust (Amanah). Information shared with meUus platforms is never sold, leased, or transmitted to unauthorized third parties without explicit, granular participant consent.
            </p>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                Browser-local state prioritization for reflection and self-assessments.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                Explicit user confirmation required before any external API mutation.
              </li>
            </ul>
          </div>

          {/* 2. Boundary Disclaimer */}
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2.5 mb-2.5 text-amber-700">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-gray-900">2. Medical & Legal Boundary Disclaimer</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
              meUus digital tools, including Mind Beautifier and Legal Hub guides, provide educational information, guidance, and community navigation. They do not constitute formal medical diagnosis, psychiatric therapy, or binding legal court representation unless rendered by a qualified licensed professional.
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
              <strong>Emergency Notice:</strong> If you or someone you know is in immediate physical danger, medical emergency, or acute distress, please contact national emergency services immediately or visit the nearest hospital.
            </div>
          </div>

          {/* 3. Non-Coercive AI Principles */}
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2.5 mb-2.5 text-blue-700">
              <Lock className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">3. Non-Coercive AI & Ethical Guardrails</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              AI components in meUus operate strictly under ethical boundaries: no moral judgment, no diagnosis, no human-worth scores, and no coercive commands. AI serves solely as an empathetic assistance tool.
            </p>
          </div>
        </div>

        {/* Footer Return */}
        <div className="mt-8 text-center">
          <a href="#dashboard" className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600" /> Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
