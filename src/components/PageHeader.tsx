/**
 * PageHeader — meUus shared section header
 * Pulled to top of every page for consistent "file view" feel.
 * Usage: <PageHeader icon={<Cpu />} title="Gemini AI Suite" subtitle="..." />
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  action?: { label: string; onClick: () => void; icon?: React.ReactNode };
  breadcrumb?: string; // group name e.g. "Intelligence"
}

export default function PageHeader({
  icon,
  title,
  subtitle,
  badge,
  badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100',
  action,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-5">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-3 font-mono">
            <span>meUus</span>
            <ChevronRight size={11} />
            <span>{breadcrumb}</span>
            <ChevronRight size={11} />
            <span className="text-gray-600 font-semibold">{title}</span>
          </div>
        )}

        {/* Main row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* Icon box */}
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              {icon}
            </div>

            {/* Title + subtitle */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">{title}</h1>
                {badge && (
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-0.5 leading-snug">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Optional action button */}
          {action && (
            <button
              onClick={action.onClick}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              {action.icon}
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
