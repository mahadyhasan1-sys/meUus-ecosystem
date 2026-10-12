import React from 'react';
import { AlertCircle, FileCheck2, Info } from 'lucide-react';
import { CANONICAL_REVIEW_NOTE } from '../constants';

interface ReviewNoticeProps {
  customContext?: string;
  variant?: 'banner' | 'card' | 'inline';
  topic?: string;
}

export default function ReviewNotice({ 
  customContext, 
  variant = 'card',
  topic 
}: ReviewNoticeProps) {
  if (variant === 'inline') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs">
        <Info className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
        <span>Verification / Expert Review in Progress</span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="w-full bg-amber-50/80 border border-amber-200 rounded-xl py-3 px-4 text-xs text-amber-900">
        <div className="max-w-7xl mx-auto flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="leading-relaxed">
            <span className="font-semibold text-amber-900 mr-1.5">Review Note — Verification in Progress:</span>
            {customContext || CANONICAL_REVIEW_NOTE}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed">
      <div className="flex items-start gap-3">
        <FileCheck2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-amber-900 text-xs uppercase tracking-wider">
              Review Note — Verification in Progress
            </span>
            {topic && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono border border-amber-200">
                {topic}
              </span>
            )}
          </div>
          <p className="text-amber-800/90 text-xs sm:text-sm leading-relaxed">
            {customContext || CANONICAL_REVIEW_NOTE}
          </p>
        </div>
      </div>
    </div>
  );
}
