/**
 * meUus Human Journey Kernel — R60A (20260825)
 * Ecosystem Algorithm Kernel v1 · Bilingual EN/বাংলা
 * Local-only, evidence-aware, no external calls.
 */

import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import PageHeader from './PageHeader';
import { Compass } from 'lucide-react';
import {
  type HumanJourneyContinuation,
  type HumanJourneySession,
  type JourneyContinuationChoice,
  type JourneyLocale,
  approvalBoundary,
  continueHumanJourney,
  startHumanJourney,
} from '../lib/kernel/humanJourney';

const copy = {
  en: {
    local: 'Human Journey Kernel · R60A',
    title: 'Start with one word or one sentence.',
    intro: 'A calm, local, evidence-aware space to choose one honest next step. Nothing is sent or saved outside this session.',
    placeholder: 'For example: I need work. / I want to learn. / I feel lost.',
    start: 'Begin Journey',
    heard: 'What I heard',
    direction: 'Current direction',
    capability: 'Current capability',
    next: 'One next step',
    approval: 'Approval / authority level',
    why: 'Why this step',
    continue: 'Continue',
    again: 'Start again',
    evidence: 'What happened?',
    evidencePlaceholder: 'For example: I listed three skills.',
    record: 'Record & continue',
    choices: 'What happened with this step?',
    did: 'I did it',
    notDone: 'I have not done it yet',
    notFit: 'This step does not fit my situation',
    different: 'I need a different direction',
    reasoning: 'Why / Evidence',
    route: 'Suggested surface',
    safe: 'This is evidence-aware guidance — not an external action.',
    error: 'Please enter one word or one sentence to begin.',
    reported: 'Local review',
    evidenceNote: 'Your text is treated as a personal report, not independent proof.',
  },
  bn: {
    local: 'মানব যাত্রা কার্নেল · R60A',
    title: 'একটি শব্দ বা একটি বাক্য দিয়ে শুরু করুন।',
    intro: 'একটি শান্ত, স্থানীয় জায়গা যেখানে আপনি একটি সৎ পরবর্তী পদক্ষেপ বেছে নিতে পারেন। এই সেশনের বাইরে কিছু পাঠানো বা সংরক্ষণ করা হয় না।',
    placeholder: 'যেমন: আমার কাজ দরকার।',
    start: 'যাত্রা শুরু করুন',
    heard: 'আমি যা শুনেছি',
    direction: 'বর্তমান দিকনির্দেশনা',
    capability: 'বর্তমান সামর্থ্য',
    next: 'একটি পরবর্তী পদক্ষেপ',
    approval: 'অনুমোদন / কর্তৃত্ব',
    why: 'কেন এই পদক্ষেপ',
    continue: 'চালিয়ে যান',
    again: 'আবার শুরু করুন',
    evidence: 'কী হয়েছে?',
    evidencePlaceholder: 'যেমন: আমি তিনটি দক্ষতা তালিকাভুক্ত করেছি।',
    record: 'রেকর্ড করুন ও চালিয়ে যান',
    choices: 'এই পদক্ষেপে কী হয়েছিল?',
    did: 'আমি করেছি',
    notDone: 'আমি এখনো করিনি',
    notFit: 'এই পদক্ষেপ আমার পরিস্থিতিতে মানায় না',
    different: 'আমার ভিন্ন দিকনির্দেশনা দরকার',
    reasoning: 'কেন / প্রমাণ',
    route: 'প্রস্তাবিত পৃষ্ঠ',
    safe: 'এটি নির্দেশিকা — বাহ্যিক পদক্ষেপ নয়।',
    error: 'শুরু করতে একটি শব্দ বা বাক্য লিখুন।',
    reported: 'স্থানীয় পর্যালোচনা',
    evidenceNote: 'আপনার পাঠ্য একটি ব্যক্তিগত প্রতিবেদন হিসাবে বিবেচিত হয়, স্বাধীন প্রমাণ নয়।',
  },
} as const;

const approvalLabel = (approval: string, locale: JourneyLocale): string => {
  const labels = locale === 'bn'
    ? { L0: 'L0 — পর্যবেক্ষণ', L1: 'L1 — সুপারিশ', L2: 'L2 — প্রস্তুতি', L3: 'L3 — বিপরীতযোগ্য স্থানীয় পদক্ষেপ', L4: 'L4 — নিশ্চিতকরণ প্রয়োজন', L5: 'L5 — সীমাবদ্ধ / পেশাদার কর্তৃত্ব' }
    : { L0: 'L0 — Observe', L1: 'L1 — Recommendation', L2: 'L2 — Preparation', L3: 'L3 — Reversible local action', L4: 'L4 — Confirmation required', L5: 'L5 — Restricted / professional authority' };
  return labels[approval as keyof typeof labels] ?? approval;
};

const choiceLabels = (locale: JourneyLocale): Array<{ choice: JourneyContinuationChoice; label: string }> => {
  const t = copy[locale];
  return [
    { choice: 'DID_IT', label: t.did },
    { choice: 'NOT_DONE', label: t.notDone },
    { choice: 'DOES_NOT_FIT', label: t.notFit },
    { choice: 'DIFFERENT_DIRECTION', label: t.different },
  ];
};

const routeReason = (surface: string, locale: JourneyLocale, reason: string): string =>
  locale === 'bn' ? reason : `${surface} — ${reason}`;

function ResultBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-1">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-600">{title}</h3>
      <div className="text-gray-800 leading-relaxed">{children}</div>
    </section>
  );
}

export default function HumanJourneyKernel() {
  const [locale, setLocale] = useState<JourneyLocale>('en');
  const [statement, setStatement] = useState('');
  const [session, setSession] = useState<HumanJourneySession | null>(null);
  const [stage, setStage] = useState<'RESULT' | 'CHOICES' | 'EVIDENCE' | 'CONTINUED'>('RESULT');
  const [evidence, setEvidence] = useState('');
  const [continuation, setContinuation] = useState<HumanJourneyContinuation | null>(null);
  const [error, setError] = useState('');

  const text = copy[locale];
  const boundary = useMemo(() => session ? approvalBoundary(session.initial.action.state, locale) : null, [session, locale]);
  const selectedRoute = session?.initial.route ?? null;

  async function begin(e: FormEvent) {
    e.preventDefault();
    if (!statement.trim()) { setError(text.error); return; }
    try {
      const s = await startHumanJourney(statement.trim(), locale);
      setSession(s);
      setStage('RESULT');
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : text.error);
    }
  }

  function complete(selected: JourneyContinuationChoice, resultText = '') {
    if (!session) return;
    const updated = continueHumanJourney(session, selected, resultText);
    setContinuation(updated);
    setStage('CONTINUED');
  }

  function restart() {
    setStatement('');
    setSession(null);
    setStage('RESULT');
    setEvidence('');
    setContinuation(null);
    setError('');
  }

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader
        icon={<Compass size={18} />}
        title="Human Journey Kernel"
        subtitle="Core Algorithmic State Machine: Understand → Learn → Reflect → Act."
        badge="Kernel v1.0"
        breadcrumb="Kernel"
      />
      <section className="py-8 px-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold uppercase tracking-wider">
            R60A · Ecosystem Algorithm Kernel v1
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Human Journey Kernel</h2>
          <p className="text-gray-500 text-sm">
            Evidence-aware · Local-only · Bilingual · No data leaves your session
          </p>
          {/* Language toggle */}
          <div className="inline-flex rounded-full border border-gray-300 p-1">
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${locale === 'en' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >EN</button>
            <button
              type="button"
              onClick={() => setLocale('bn')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${locale === 'bn' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >বাংলা</button>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-xs text-emerald-500/70 mb-6">{text.safe}</p>

          {!session ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">{text.title}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{text.intro}</p>
              </div>
              <form onSubmit={begin} className="space-y-4">
                <textarea
                  value={statement}
                  onChange={e => setStatement(e.target.value)}
                  placeholder={text.placeholder}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                />
                {error && <p className="text-rose-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-xs"
                >{text.start}</button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultBlock title={text.heard}><p>{session.initial.whatHeard}</p></ResultBlock>
                <ResultBlock title={text.direction}>
                  <p className="font-medium text-gray-900">{session.initial.direction}</p>
                  {session.initial.pillar && <p className="mt-1 text-xs text-gray-500">{session.initial.pillar.name}</p>}
                </ResultBlock>
                <ResultBlock title={text.next}>
                  <p className="font-medium text-emerald-700">{session.initial.oneNextStep}</p>
                </ResultBlock>
                <ResultBlock title={text.approval}>
                  <p>{approvalLabel(session.initial.approval, locale)}</p>
                </ResultBlock>
                <ResultBlock title={text.capability}><p>{session.initial.capability}</p></ResultBlock>
                <ResultBlock title={text.why}><p>{session.initial.why}</p></ResultBlock>
              </div>

              {selectedRoute && (
                <ResultBlock title={text.route}>
                  <a
                    href={`https://${selectedRoute.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 underline underline-offset-4 font-medium hover:text-emerald-700"
                  >{selectedRoute.domain}</a>
                  <p className="mt-1 text-xs text-gray-500">{routeReason(selectedRoute.surface, locale, selectedRoute.reason)}</p>
                </ResultBlock>
              )}

              {boundary && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm leading-relaxed">
                  {boundary}
                </div>
              )}

              {stage === 'RESULT' && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {!boundary && (
                    <button
                      type="button"
                      onClick={() => setStage('CHOICES')}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition shadow-xs"
                    >{text.continue}</button>
                  )}
                  <button
                    type="button"
                    onClick={restart}
                    className="px-6 py-2.5 border border-gray-300 hover:border-gray-400 bg-white text-gray-700 font-semibold rounded-xl transition"
                  >{text.again}</button>
                </div>
              )}

              {stage === 'CHOICES' && (
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5 space-y-3">
                  <h4 className="font-semibold text-gray-900">{text.choices}</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {choiceLabels(locale).map(item => (
                      <button
                        key={item.choice}
                        type="button"
                        onClick={() => item.choice === 'DID_IT' ? setStage('EVIDENCE') : complete(item.choice)}
                        className="min-h-12 rounded-xl border border-gray-200 bg-white hover:border-emerald-500 hover:text-emerald-700 px-4 py-3 text-left font-medium text-gray-800 shadow-2xs transition"
                      >{item.label}</button>
                    ))}
                  </div>
                </div>
              )}

              {stage === 'EVIDENCE' && (
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5 space-y-3">
                  <label className="font-semibold text-gray-900 block">{text.evidence}</label>
                  <p className="text-xs text-gray-500">{text.evidenceNote}</p>
                  <textarea
                    value={evidence}
                    onChange={e => setEvidence(e.target.value)}
                    placeholder={text.evidencePlaceholder}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => complete('DID_IT', evidence)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition shadow-xs"
                  >{text.record}</button>
                </div>
              )}

              {stage === 'CONTINUED' && continuation && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 space-y-3">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">{text.reported}</p>
                  <p className="text-gray-800 leading-relaxed">{continuation.status}</p>
                  <p className="font-medium text-gray-900">{continuation.nextStep}</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={restart}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition shadow-xs"
                    >{text.again}</button>
                    {!continuation.restartRecommended && (
                      <button
                        type="button"
                        onClick={() => setStage('CHOICES')}
                        className="px-6 py-2.5 border border-emerald-300 hover:bg-emerald-100 bg-white text-emerald-700 font-semibold rounded-xl transition"
                      >{text.continue}</button>
                    )}
                  </div>
                </div>
              )}

              {/* Audit trail */}
              <details className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-500">
                <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">{text.reasoning}</summary>
                <div className="mt-3 space-y-1.5">
                  <p>Intent: {session.initial.statement}</p>
                  <p>Capability: {session.initial.action.capabilityId} · {session.initial.capabilityStatus}</p>
                  <p>Approval: {session.initial.approval}</p>
                  <p>Evidence status: {continuation?.verification.status ?? 'REPORTED_CLAIM'}</p>
                  <p>Audit events: {[...new Set(continuation?.auditEventNames ?? session.kernel.exportAudit(session.runId).map(ev => ev.kind))].join(', ')}</p>
                </div>
              </details>
            </div>
          )}
        </div>

        {/* R-series lineage badge */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Lineage: R20 → R21 → R33 → R42 → R44 → R46 → R47 → R48 → R49 → R50 → R51 → R52 → R53 → R54 → R55 → R56 → R57 → R58 → R59A → R59B → <span className="text-emerald-600 font-semibold">R60A (current)</span>
        </div>
      </div>
    </section>
    </div>
  );
}
