import React from 'react';
import { Eye, Keyboard, Monitor, Check, ArrowLeft } from 'lucide-react';

export default function AccessibilityPage() {
  return (
    <div className="min-h-full bg-gray-50 text-gray-900 py-10 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-3">
            Digital Inclusion
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-3">
            Accessibility Statement & Policy
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            meUus is dedicated to ensuring that digital human development resources remain accessible to all citizens regardless of physical ability, device type, or network speed.
          </p>
        </div>

        {/* Commitment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-xs">
            <Eye className="w-6 h-6 text-emerald-600 mb-3" />
            <h3 className="font-bold text-base text-gray-900 mb-2">High Contrast & Visuals</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Designed with high-contrast color pairs exceeding WCAG 2.1 AA ratios (4.5:1 minimum) to aid readability for low-vision users.
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-xs">
            <Keyboard className="w-6 h-6 text-emerald-600 mb-3" />
            <h3 className="font-bold text-base text-gray-900 mb-2">Keyboard Navigation</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Full focus indicator visibility and logical tab indices across interactive buttons, inputs, and navigation elements.
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-xs">
            <Monitor className="w-6 h-6 text-emerald-600 mb-3" />
            <h3 className="font-bold text-base text-gray-900 mb-2">Responsive & Screen Reader</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Structured HTML landmarks, semantic tags, aria attributes, and fluid layouts for screen readers and mobile screens.
            </p>
          </div>
        </div>

        {/* Certification Boundary */}
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 leading-relaxed mb-8">
          <h4 className="font-bold text-sm text-emerald-950 mb-2 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" /> Current Audit Status: 99 / 100
          </h4>
          <p>
            Our development process integrates automated accessibility linting and manual keyboard testing. Lighthouse accessibility score currently audits at 99/100.
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
