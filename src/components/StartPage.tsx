import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { ArrowRight, CheckCircle2, RotateCcw, Heart, Shield, Sparkles, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StartPage() {
  const [step, setStep] = useState<'understand' | 'learn' | 'reflect' | 'act'>('understand');
  const [journalEntry, setJournalEntry] = useState(() => {
    return localStorage.getItem('meuus_start_journal') || '';
  });
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleSaveJournal = (text: string) => {
    setJournalEntry(text);
    localStorage.setItem('meuus_start_journal', text);
  };

  const handleReset = () => {
    localStorage.removeItem('meuus_start_journal');
    setJournalEntry('');
    setStep('understand');
    setSelectedTopic(null);
  };

  const topics = [
    { id: 'mental', title: 'Mind & Emotional Balance', subtitle: 'Mind Beautifier', icon: Heart },
    { id: 'legal', title: 'Legal & Rights Awareness', subtitle: 'Legal Hub', icon: Shield },
    { id: 'business', title: 'SME & Work Skills', subtitle: 'Business & Unemployment Buster', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <PageHeader
        icon={<Compass size={18} />}
        title="Start Page"
        subtitle="Clarify Intention, Discover Direction, and Begin Your Journey."
        badge="Gateway"
        breadcrumb="Start"
      />
      <div className="py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-4">
            Canonical Journey Start
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-4 text-gray-900">
            Begin Your Human Development Journey
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            A self-guided, client-side browser process. No login required, no data sent to external servers, no cloud tracking.
          </p>
        </div>

        {/* Four-Step Framework Progress */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-10 bg-white p-2 rounded-2xl border border-gray-200 shadow-xs">
          {[
            { id: 'understand', label: '1. Understand' },
            { id: 'learn', label: '2. Learn' },
            { id: 'reflect', label: '3. Reflect' },
            { id: 'act', label: '4. Act' }
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id as any)}
              className={`py-3 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                step === s.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/40'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm">
          {step === 'understand' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-emerald-600">Step 1: Understand Your Context</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Every challenge in life often touches multiple dimensions—legal, emotional, financial, or practical. Select the primary area you wish to focus on today:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topics.map((t) => {
                  const Icon = t.icon;
                  const isSelected = selectedTopic === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTopic(t.id)}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 shadow-md ring-1 ring-emerald-500/50 text-gray-900'
                          : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-emerald-600 mb-3" />
                      <h3 className="font-semibold text-sm text-gray-900">{t.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{t.subtitle}</p>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep('learn')}
                  disabled={!selectedTopic}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-2.5 text-xs font-bold"
                >
                  Continue to Learn <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {step === 'learn' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-emerald-600">Step 2: Core Grounding Knowledge</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                The meUus philosophy prioritizes <strong>Claim ≤ Evidence</strong> and honest self-assessment before action.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl text-xs space-y-3 text-gray-700">
                <p>• <strong>Mind Beautifier Principles:</strong> Mental wellbeing is grounded in self-compassion, community support, and professional care when needed.</p>
                <p>• <strong>Legal Rights Basics:</strong> Every citizen has fundamental rights guaranteed under law; early legal clarity prevents compounding financial debt.</p>
                <p>• <strong>SME Formalization:</strong> Sustainable business starts with proper documentation, trade licensing, and realistic cashflow tracking.</p>
              </div>
              <div className="flex justify-between pt-4">
                <Button onClick={() => setStep('understand')} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl text-xs">
                  Back
                </Button>
                <Button onClick={() => setStep('reflect')} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-2.5 text-xs font-bold">
                  Continue to Reflect <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {step === 'reflect' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-emerald-600">Step 3: Private Self-Reflection</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Write a private note or goal for yourself. This entry is stored purely in your browser's local storage and is never transmitted online.
              </p>
              <textarea
                value={journalEntry}
                onChange={(e) => handleSaveJournal(e.target.value)}
                placeholder="What is your immediate priority or goal for today? (e.g. Draft trade license checklist, reach out for legal advice, practice 5 mins breathing exercise)"
                rows={5}
                className="w-full bg-white border border-gray-300 rounded-2xl p-4 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xs"
              />
              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved locally to browser
                </span>
                <div className="flex gap-3">
                  <Button onClick={() => setStep('learn')} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl text-xs">
                    Back
                  </Button>
                  <Button onClick={() => setStep('act')} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-2.5 text-xs font-bold">
                    Continue to Act <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 'act' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-emerald-600">Step 4: Action Plan</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Small, consistent steps lead to lasting change. You have defined your reflection:
              </p>
              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-900 italic font-serif">
                "{journalEntry || 'No local reflection written yet.'}"
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-700 space-y-2">
                <p className="font-semibold text-emerald-600">Recommended Next Steps:</p>
                <p>1. Explore the <strong>Pillars Grid</strong> on the meUus home dashboard to find specialized guidance.</p>
                <p>2. Connect with <strong>Google Classroom</strong> for free structured SME or skill modules.</p>
                <p>3. Utilize <strong>Mind Beautifier</strong> for empathetic check-ins.</p>
              </div>
              <div className="flex justify-between items-center pt-4">
                <button onClick={handleReset} className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Local Journal
                </button>
                <a href="/" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1">
                  Return to Main Portal <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
