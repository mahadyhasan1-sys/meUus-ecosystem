/**
 * AI Profile Creator — Gate 4 (bounded, human-in-the-loop)
 *
 * Constitution alignment (AGENTS.md):
 * - Claim ≤ Evidence: the draft is derived ONLY from the user's own local DLAS
 *   reflections. The model is explicitly forbidden from inventing facts, skills,
 *   numbers, or credentials. Thin evidence yields a thin, honest draft.
 * - L0–L5 bounded authority: reading local state is permitted (Analyst/READ_STATE),
 *   but the external model call (INVOKE_EXTERNAL_API) is a high-consequence action
 *   that stays REQUIRES_FOUNDER_AUTHORIZATION while the execution lock is active.
 *   The user must explicitly authorize it in-session.
 * - AI proposes, human disposes: output is an editable DRAFT that is only written
 *   to the local profile after the user reviews and approves it.
 * - Non-diagnostic: no medical/psychological labeling.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Save,
  RotateCcw,
  FileText,
} from 'lucide-react';
import { useAgentCore, type PermissionStatus } from './AgentCoreProvider';
import { offlineStorage } from '../lib/offlineStorage';
import type { DLASReflection } from '../types';

const RESOURCE = 'ai-profile-creator';
const DLAS_LOCAL_KEY = 'meuus_dlas_reflections';

interface ProfileDraft {
  bio: string;
  skills: string[];
  goals: string[];
  evidenceNotes: string;
}

const SYSTEM_INSTRUCTION = [
  'You are the meUus Soul Profile drafting assistant.',
  'Core axiom: Claim <= Evidence.',
  'Hard rules:',
  '- Derive EVERYTHING only from the user reflections provided. Never invent facts, skills, achievements, numbers, credentials, employers, or claims that are not present in the evidence.',
  '- If the evidence is thin, keep the draft minimal and say so plainly in evidenceNotes. Do not pad or flatter.',
  '- Be dignified, honest, and non-diagnostic. No medical or psychological labels.',
  '- skills[] and goals[] must contain only items directly evidenced by the reflections; empty arrays are acceptable and preferred over guesses.',
  'Output STRICT JSON only (no prose, no code fences) in exactly this shape:',
  '{"bio": string, "skills": string[], "goals": string[], "evidenceNotes": string}',
].join('\n');

function readLocalReflections(): DLASReflection[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DLAS_LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as DLASReflection[]) : [];
  } catch {
    return [];
  }
}

function extractJson(text: string): Partial<ProfileDraft> | null {
  if (!text) return null;
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as Partial<ProfileDraft>;
  } catch {
    return null;
  }
}

function normalizeDraft(raw: Partial<ProfileDraft> | null, fallbackText: string): ProfileDraft {
  if (!raw) {
    return {
      bio: fallbackText.trim(),
      skills: [],
      goals: [],
      evidenceNotes: 'Model returned free text rather than strict JSON. Review and edit manually before saving.',
    };
  }
  return {
    bio: typeof raw.bio === 'string' ? raw.bio : '',
    skills: Array.isArray(raw.skills) ? raw.skills.filter((s) => typeof s === 'string') : [],
    goals: Array.isArray(raw.goals) ? raw.goals.filter((s) => typeof s === 'string') : [],
    evidenceNotes:
      typeof raw.evidenceNotes === 'string'
        ? raw.evidenceNotes
        : 'No evidence notes returned by the model.',
  };
}

export default function AIProfileCreator() {
  const { checkPermission, requestAuthorization, isExecutionLocked } = useAgentCore();

  const [reflections, setReflections] = useState<DLASReflection[]>(() => readLocalReflections());
  const [permStatus, setPermStatus] = useState<PermissionStatus>('DENIED');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProfileDraft | null>(null);
  const [servedBy, setServedBy] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Editable review fields
  const [bio, setBio] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [goalsText, setGoalsText] = useState('');

  // Re-check permission only in effects/handlers (never during render) so the
  // provider's audit logger is not invoked in the render phase.
  useEffect(() => {
    setPermStatus(checkPermission('Analyst', 'INVOKE_EXTERNAL_API', RESOURCE));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExecutionLocked]);

  const evidenceCount = reflections.length;
  const sessionCount = useMemo(() => offlineStorage.getDlasHistory().length, [reflections]);

  const evidenceBundle = useMemo(() => {
    return reflections
      .slice(0, 25)
      .map((r, i) => {
        const parts = [`${i + 1}. [${r.lensTitle || r.lensCategory}]`];
        if (r.reflectionText) parts.push(`Reflection: ${r.reflectionText}`);
        if (r.actionStep) parts.push(`Stated next action: ${r.actionStep}`);
        return parts.join(' ');
      })
      .join('\n');
  }, [reflections]);

  const canGenerate = permStatus === 'GRANTED' && evidenceCount > 0 && !busy;

  function handleAuthorize() {
    const ok = requestAuthorization('Analyst', 'INVOKE_EXTERNAL_API', RESOURCE);
    if (ok) setPermStatus('GRANTED');
  }

  async function handleGenerate() {
    if (!canGenerate) return;
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Here are my own DLAS reflections (my private local evidence). Draft my Soul Profile strictly from these.\n\n${evidenceBundle}`,
            },
          ],
          systemInstruction: SYSTEM_INSTRUCTION,
          role: 'meuus-profile-drafter',
        }),
      });
      if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
      const data = await res.json();
      const text: string = data?.text || '';
      setServedBy(data?.actualModel || data?.model || 'unknown model');
      const next = normalizeDraft(extractJson(text), text);
      setDraft(next);
      setBio(next.bio);
      setSkillsText(next.skills.join(', '));
      setGoalsText(next.goals.join(', '));
    } catch (err: any) {
      setError(err?.message || 'Could not reach the model router. You may be offline.');
    } finally {
      setBusy(false);
    }
  }

  function handleRefreshEvidence() {
    setReflections(readLocalReflections());
  }

  function handleSave() {
    const skills = skillsText.split(',').map((s) => s.trim()).filter(Boolean);
    const goals = goalsText.split(',').map((s) => s.trim()).filter(Boolean);
    offlineStorage.saveProfile({ bio: bio.trim(), skills, goals });
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  }

  function handleReset() {
    if (!draft) return;
    setBio(draft.bio);
    setSkillsText(draft.skills.join(', '));
    setGoalsText(draft.goals.join(', '));
    setSaved(false);
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-gray-200 pb-4">
        <div className="p-2.5 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-200">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">AI Profile Creator</h3>
          <p className="text-xs text-gray-500">
            Drafts your Soul Profile from <strong className="text-gray-800">your own local reflections only</strong>.
            AI-assisted · human-reviewed · <span className="font-mono text-emerald-600">Claim ≤ Evidence</span>.
          </p>
        </div>
      </div>

      {/* Local evidence summary (READ_STATE — always permitted) */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>
            Local evidence available:{' '}
            <strong className="text-gray-900">{evidenceCount}</strong> reflection{evidenceCount === 1 ? '' : 's'} ·{' '}
            <strong className="text-gray-900">{sessionCount}</strong> DLAS session{sessionCount === 1 ? '' : 's'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleRefreshEvidence}
          className="text-[11px] text-gray-500 hover:text-emerald-600 transition flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Refresh
        </button>
      </div>

      {evidenceCount === 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-700/50 text-xs text-amber-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            No local reflections yet. Complete a DLAS reflection above first — the creator will not invent a
            profile from nothing (that would violate <span className="font-mono">Claim ≤ Evidence</span>).
          </span>
        </div>
      )}

      {/* Permission gate (INVOKE_EXTERNAL_API — high-consequence) */}
      {permStatus !== 'GRANTED' ? (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/60 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono font-bold uppercase text-[10px] tracking-wider text-rose-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Default-Deny Gate · {permStatus}
            </span>
            {isExecutionLocked && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/60 border border-rose-700 text-rose-300">
                EXECUTION LOCKED
              </span>
            )}
          </div>
          <p className="text-[11px] text-rose-200 leading-relaxed">
            Generating a draft calls an external model (<code className="text-rose-300">INVOKE_EXTERNAL_API</code>),
            a high-consequence action that requires your explicit in-session authorization. Reading and analyzing
            your local reflections stays permitted. No data leaves your device until you authorize.
          </p>
          <button
            type="button"
            onClick={handleAuthorize}
            disabled={evidenceCount === 0}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Authorize AI assist for this session (L3 founder confirmation)
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition flex items-center gap-2"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {busy ? 'Drafting from your evidence…' : 'Generate draft from my reflections'}
          </button>
          <span className="text-[11px] text-emerald-600 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> AI assist authorized this session
          </span>
          {servedBy && <span className="text-[11px] text-gray-400 font-mono">served by {servedBy}</span>}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Human review + approval */}
      {draft && (
        <div className="space-y-4 pt-2 border-t border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Review the draft — edit anything that is not true for you
          </div>

          {draft.evidenceNotes && (
            <p className="text-[11px] text-gray-500 italic border-l-2 border-sky-600/50 pl-3">
              {draft.evidenceNotes}
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bio</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              aria-label="Drafted bio"
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Skills (comma-separated)</label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                aria-label="Drafted skills"
                placeholder="Only skills you actually evidenced"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Goals (comma-separated)</label>
              <input
                type="text"
                value={goalsText}
                onChange={(e) => setGoalsText(e.target.value)}
                aria-label="Drafted goals"
                placeholder="Only goals you actually stated"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Approve &amp; save to my local profile
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:text-gray-900 text-sm transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset edits
            </button>
            {saved && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Saved to your private local memory
              </span>
            )}
          </div>

          <p className="text-[10px] text-gray-400 leading-relaxed">
            Saving writes only to your local, offline-first profile store (exportable and deletable from the
            navbar). Cloud persistence requires Firebase authentication. This draft is not a verified claim
            until you approve it.
          </p>
        </div>
      )}
    </div>
  );
}
