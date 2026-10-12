import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import {
  TrendingUp, 
  Star, 
  Target, 
  Zap,
  BookOpen,
  Briefcase,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Download,
  Plus,
  X,
  Edit3,
  ExternalLink,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { offlineStorage, StoredUserProfile, StoredDlasSession } from '../lib/offlineStorage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Canonical Skill Domains recognized by meUus
const SKILL_DOMAINS = [
  { id: 'tech', label: 'Technology & Digital', icon: '💻', color: 'from-cyan-500/20 to-slate-800', accent: 'cyan' },
  { id: 'comm', label: 'Communication & Writing', icon: '✍️', color: 'from-blue-500/20 to-slate-800', accent: 'blue' },
  { id: 'biz', label: 'Business & Entrepreneurship', icon: '🏢', color: 'from-amber-500/20 to-slate-800', accent: 'amber' },
  { id: 'design', label: 'Creative Design & Media', icon: '🎨', color: 'from-purple-500/20 to-slate-800', accent: 'purple' },
  { id: 'qa', label: 'Quality & Testing', icon: '🧪', color: 'from-rose-500/20 to-slate-800', accent: 'rose' },
  { id: 'dev', label: 'Human Development & Coaching', icon: '🧠', color: 'from-emerald-500/20 to-slate-800', accent: 'emerald' },
  { id: 'fin', label: 'Finance & Accounting', icon: '📊', color: 'from-green-500/20 to-slate-800', accent: 'green' },
  { id: 'lang', label: 'Languages & Translation', icon: '🌐', color: 'from-teal-500/20 to-slate-800', accent: 'teal' },
];

const PROFICIENCY_LEVELS = [
  { value: 1, label: 'Aware', desc: 'I know this exists', color: 'bg-gray-600 text-gray-800' },
  { value: 2, label: 'Beginner', desc: 'Learning with guidance', color: 'bg-blue-700 text-blue-100' },
  { value: 3, label: 'Intermediate', desc: 'Can work independently', color: 'bg-amber-700 text-amber-100' },
  { value: 4, label: 'Advanced', desc: 'Consistently delivers quality', color: 'bg-emerald-700 text-emerald-100' },
  { value: 5, label: 'Expert', desc: 'Can teach and lead', color: 'bg-purple-700 text-purple-100' },
];

interface SkillEntry {
  id: string;
  name: string;
  domain: string;
  proficiency: number;         // 1-5
  hasEvidence: boolean;        // CLAIM <= EVIDENCE gate
  evidenceNote?: string;       // Link to portfolio item / github / project
  targetProficiency?: number;  // Where they want to be
  createdAt: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: 'PROJECT' | 'FREELANCE' | 'CERTIFICATE' | 'JOB' | 'OPEN_SOURCE' | 'WRITING';
  link?: string;
  skills: string[];  // skill IDs
  status: 'IN_PROGRESS' | 'COMPLETE' | 'VERIFIED';
  createdAt: string;
}

function getStoredSkills(): SkillEntry[] {
  try {
    const raw = localStorage.getItem('meuus_career_skills_v1');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function getStoredPortfolio(): PortfolioItem[] {
  try {
    const raw = localStorage.getItem('meuus_career_portfolio_v1');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveSkills(skills: SkillEntry[]) {
  try {
    localStorage.setItem('meuus_career_skills_v1', JSON.stringify(skills));
  } catch { /* ignore */ }
}

function savePortfolio(portfolio: PortfolioItem[]) {
  try {
    localStorage.setItem('meuus_career_portfolio_v1', JSON.stringify(portfolio));
  } catch { /* ignore */ }
}

export default function CareerSkillGraph() {
  const [profile] = useState<StoredUserProfile>(() => offlineStorage.getProfile());
  const [dlasHistory] = useState<StoredDlasSession[]>(() => offlineStorage.getDlasHistory());
  const [skills, setSkills] = useState<SkillEntry[]>(getStoredSkills);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(getStoredPortfolio);
  const [activeTab, setActiveTab] = useState<'SKILLS' | 'PORTFOLIO' | 'READINESS'>('SKILLS');

  // Skill add form
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDomain, setNewSkillDomain] = useState('tech');
  const [newSkillProf, setNewSkillProf] = useState(2);
  const [newSkillHasEvidence, setNewSkillHasEvidence] = useState(false);
  const [newSkillEvidenceNote, setNewSkillEvidenceNote] = useState('');
  const [newSkillTarget, setNewSkillTarget] = useState(3);

  // Portfolio add form
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');
  const [newPortType, setNewPortType] = useState<PortfolioItem['type']>('PROJECT');
  const [newPortLink, setNewPortLink] = useState('');
  const [newPortSkills, setNewPortSkills] = useState<string[]>([]);
  const [newPortStatus, setNewPortStatus] = useState<PortfolioItem['status']>('IN_PROGRESS');

  const latestDlas = dlasHistory[0];
  const dlasScore = latestDlas?.scores.lifeScore || 0;
  const dlasTier = latestDlas?.tier || 'N/A';

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const entry: SkillEntry = {
      id: `sk_${Date.now()}`,
      name: newSkillName.trim(),
      domain: newSkillDomain,
      proficiency: newSkillProf,
      hasEvidence: newSkillHasEvidence,
      evidenceNote: newSkillEvidenceNote.trim() || undefined,
      targetProficiency: newSkillTarget,
      createdAt: new Date().toISOString(),
    };
    const updated = [entry, ...skills];
    setSkills(updated);
    saveSkills(updated);
    setNewSkillName('');
    setNewSkillEvidenceNote('');
    setShowAddSkill(false);
  };

  const removeSkill = (id: string) => {
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    saveSkills(updated);
  };

  const addPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortTitle.trim()) return;
    const entry: PortfolioItem = {
      id: `pf_${Date.now()}`,
      title: newPortTitle.trim(),
      description: newPortDesc.trim(),
      type: newPortType,
      link: newPortLink.trim() || undefined,
      skills: newPortSkills,
      status: newPortStatus,
      createdAt: new Date().toISOString(),
    };
    const updated = [entry, ...portfolio];
    setPortfolio(updated);
    savePortfolio(updated);
    setNewPortTitle('');
    setNewPortDesc('');
    setNewPortLink('');
    setNewPortSkills([]);
    setShowAddPortfolio(false);
  };

  // Export CV text
  const exportCV = () => {
    const evidencedSkills = skills.filter(s => s.hasEvidence);
    const allSkills = skills;
    const completedItems = portfolio.filter(p => p.status === 'COMPLETE' || p.status === 'VERIFIED');

    const text = `meUus Career Evidence Report
Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
Generated by: meUus.app — Honest Human Development OS
======================================================

NAME: ${profile.name}
DLAS TIER: ${dlasTier} | SCORE: ${dlasScore}/100

SKILLS WITH VERIFIED EVIDENCE (${evidencedSkills.length})
${evidencedSkills.map((s) => {
  const prof = PROFICIENCY_LEVELS.find(l => l.value === s.proficiency)!;
  const domain = SKILL_DOMAINS.find(d => d.id === s.domain)!;
  return `• ${s.name} [${prof.label}] — ${domain.label}\n  Evidence: ${s.evidenceNote || 'Portfolio reference below'}`
}).join('\n')}

ALL SKILLS (${allSkills.length})
${allSkills.map((s) => {
  const prof = PROFICIENCY_LEVELS.find(l => l.value === s.proficiency)!;
  return `• ${s.name} — ${prof.label}${s.hasEvidence ? ' ✓ Evidenced' : ' [Self-Declared]'}`
}).join('\n')}

PORTFOLIO & PROJECTS (${completedItems.length} completed)
${completedItems.map((p) => `• ${p.title} [${p.type}]\n  ${p.description}${p.link ? '\n  Link: ' + p.link : ''}`).join('\n\n')}

======================================================
HONESTY NOTICE: This report was self-generated under the meUus
'Claim ≤ Evidence' governance principle. Proficiency levels are 
self-assessed unless marked as VERIFIED.
`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meuus-skill-evidence-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const evidencedCount = skills.filter(s => s.hasEvidence).length;
  const gapCount = skills.filter(s => (s.targetProficiency || 3) > s.proficiency).length;
  const portfolioCompleteCount = portfolio.filter(p => p.status !== 'IN_PROGRESS').length;

  const getDomainCount = (domainId: string) => skills.filter(s => s.domain === domainId).length;
  const getMaxDomain = () => SKILL_DOMAINS.reduce((a, b) => getDomainCount(a.id) >= getDomainCount(b.id) ? a : b);

  return (
    <div id="career-skill-graph" className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        icon={<TrendingUp size={18} />}
        title="Career Skill Graph"
        subtitle="Map verified skills against real evidence. Gap analysis, portfolio builder, and marketplace CV export."
        badge="Active"
        breadcrumb="Personal Growth"
      />
      <div className="py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Career Skill Graph & Evidence Portfolio
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Your Verified Skill Landscape
            </h2>
            <p className="text-gray-500 text-sm mt-1 max-w-2xl">
              Map real skills against real evidence. Gap analysis, portfolio builder, and marketplace-ready CV export. <br />
              <span className="text-emerald-600 font-semibold">Claim ≤ Evidence — Only honest skills are marked as verified.</span>
            </p>
          </div>
          <Button onClick={exportCV} className="rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold h-10 px-4 shadow-lg gap-2">
            <Download className="w-3.5 h-3.5" /> Export Skill Evidence CV
          </Button>
        </div>

        {/* DLAS + Stats Bridge */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Skills', value: skills.length, icon: Star, color: 'text-amber-400' },
            { label: 'Evidenced Skills', value: evidencedCount, icon: ShieldCheck, color: 'text-emerald-600' },
            { label: 'Skill Gaps', value: gapCount, icon: Target, color: 'text-rose-400' },
            { label: 'Portfolio Items', value: portfolio.length, icon: Briefcase, color: 'text-blue-400' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-[11px] text-gray-500 font-mono uppercase">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* DLAS Linkage Banner */}
        {latestDlas && (
          <div className="p-4 rounded-2xl bg-gray-50 border border-emerald-200 flex flex-wrap items-center gap-3 text-sm">
            <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-gray-700">
              DLAS Assessment linked: <span className="font-bold text-gray-900">{dlasTier} Tier</span>
              {' · '}
              Life Score <span className="font-bold text-emerald-600">{dlasScore}/100</span>
              {' · '}
              Longitudinal Step: <span className="font-bold text-amber-400">{latestDlas.longitudinalStep}</span>
            </span>
            <span className="ml-auto text-[11px] text-gray-400 font-mono">
              Assessed {new Date(latestDlas.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-0">
          {[
            { id: 'SKILLS', label: 'Skill Map', count: skills.length },
            { id: 'PORTFOLIO', label: 'Portfolio', count: portfolio.length },
            { id: 'READINESS', label: 'Readiness Report', count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-white border border-gray-200 bg-white text-emerald-600 -mb-px'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-500 text-[10px]">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* TAB: SKILLS */}
        {activeTab === 'SKILLS' && (
          <div className="space-y-5">
            <div className="flex justify-end">
              <Button onClick={() => setShowAddSkill(!showAddSkill)} className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 px-4 gap-1.5 shadow-xs">
                <Plus className="w-3.5 h-3.5" /> Add Skill
              </Button>
            </div>

            {/* Add Skill Form */}
            {showAddSkill && (
              <form onSubmit={addSkill} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-sm font-bold text-gray-900">Add New Skill (Claim ≤ Evidence)</span>
                  <button type="button" onClick={() => setShowAddSkill(false)} className="text-gray-500 hover:text-gray-900"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1">Skill Name</label>
                    <input required value={newSkillName} onChange={e => setNewSkillName(e.target.value)} placeholder="e.g. React.js, Quality Testing, Bangla Copywriting" className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1">Domain</label>
                    <select value={newSkillDomain} onChange={e => setNewSkillDomain(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 outline-none">
                      {SKILL_DOMAINS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1">Current Proficiency</label>
                    <select value={newSkillProf} onChange={e => setNewSkillProf(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 outline-none">
                      {PROFICIENCY_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label} — {l.desc}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1">Target Proficiency</label>
                    <select value={newSkillTarget} onChange={e => setNewSkillTarget(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 outline-none">
                      {PROFICIENCY_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newSkillHasEvidence} onChange={e => setNewSkillHasEvidence(e.target.checked)} className="rounded border-gray-300 bg-white accent-emerald-600" />
                    <span className="text-xs text-gray-700 font-semibold">I have verifiable evidence for this skill (Claim ≤ Evidence)</span>
                  </label>
                </div>
                {newSkillHasEvidence && (
                  <div>
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1">Evidence Reference (URL, project name, or description)</label>
                    <input value={newSkillEvidenceNote} onChange={e => setNewSkillEvidenceNote(e.target.value)} placeholder="e.g. github.com/myproject or 'Built live QA dashboard for SME client'" className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500" />
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setShowAddSkill(false)} className="text-xs text-gray-500">Cancel</Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs shadow-xs">Add Skill</Button>
                </div>
              </form>
            )}

            {skills.length === 0 ? (
              <div className="py-8 text-center text-gray-500 border border-dashed border-gray-200 rounded-2xl">
                <Star className="w-8 h-8 mx-auto text-gray-400 mb-3" />
                <p className="text-sm font-medium">No skills added yet.</p>
                <p className="text-xs mt-1">Click "Add Skill" above to start building your honest skill map.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => {
                  const profLevel = PROFICIENCY_LEVELS.find(l => l.value === skill.proficiency)!;
                  const domain = SKILL_DOMAINS.find(d => d.id === skill.domain)!;
                  const gap = (skill.targetProficiency || skill.proficiency) - skill.proficiency;
                  return (
                    <div key={skill.id} className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow-xs transition-all space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-bold text-gray-900">{skill.name}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{domain?.icon} {domain?.label}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {skill.hasEvidence ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-label="Evidenced" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-500" aria-label="Self-Declared" />
                          )}
                          <button onClick={() => removeSkill(skill.id)} className="text-gray-400 hover:text-rose-500 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Proficiency bar */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="text-gray-500">Current: <span className="text-gray-900 font-bold">{profLevel.label}</span></span>
                          {skill.targetProficiency && skill.targetProficiency > skill.proficiency && (
                            <span className="text-amber-600 font-semibold">Target: {PROFICIENCY_LEVELS.find(l => l.value === skill.targetProficiency)?.label}</span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {PROFICIENCY_LEVELS.map((level) => (
                            <div
                              key={level.value}
                              className={`flex-1 h-1.5 rounded-full transition-all ${
                                level.value <= skill.proficiency
                                  ? 'bg-emerald-500'
                                  : level.value <= (skill.targetProficiency || 0)
                                  ? 'bg-amber-500/40'
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Evidence note */}
                      {skill.hasEvidence && skill.evidenceNote && (
                        <div className="text-[10px] text-gray-500 border-t border-gray-200 pt-2 flex items-start gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="truncate">{skill.evidenceNote}</span>
                        </div>
                      )}
                      {!skill.hasEvidence && (
                        <div className="text-[10px] text-amber-400/80 font-mono">Self-Declared · No evidence yet</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: PORTFOLIO */}
        {activeTab === 'PORTFOLIO' && (
          <div className="space-y-5">
            <div className="flex justify-end">
              <Button onClick={() => setShowAddPortfolio(!showAddPortfolio)} className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 px-4 gap-1.5 shadow-xs">
                <Plus className="w-3.5 h-3.5" /> Add Portfolio Item
              </Button>
            </div>

            {showAddPortfolio && (
              <form onSubmit={addPortfolio} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-sm font-bold text-gray-900">Add Portfolio Item</span>
                  <button type="button" onClick={() => setShowAddPortfolio(false)} className="text-gray-500 hover:text-gray-900"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1">Title</label>
                    <input required value={newPortTitle} onChange={e => setNewPortTitle(e.target.value)} placeholder="e.g. meUus QA Testing Dashboard" className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1">Type</label>
                    <select value={newPortType} onChange={e => setNewPortType(e.target.value as any)} className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 outline-none">
                      {['PROJECT', 'FREELANCE', 'CERTIFICATE', 'JOB', 'OPEN_SOURCE', 'WRITING'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1">Description</label>
                    <textarea rows={2} value={newPortDesc} onChange={e => setNewPortDesc(e.target.value)} placeholder="What you did, what impact it had, what tools you used..." className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 resize-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1">Link (optional)</label>
                    <input value={newPortLink} onChange={e => setNewPortLink(e.target.value)} placeholder="https://github.com/..." className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1">Status</label>
                    <select value={newPortStatus} onChange={e => setNewPortStatus(e.target.value as any)} className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 outline-none">
                      {['IN_PROGRESS', 'COMPLETE', 'VERIFIED'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  {skills.length > 0 && (
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1">Skills Demonstrated (select all that apply)</label>
                      <div className="flex flex-wrap gap-2">
                        {skills.map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setNewPortSkills(prev => prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id])}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${newPortSkills.includes(s.id) ? 'bg-emerald-600 text-white' : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'}`}
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setShowAddPortfolio(false)} className="text-xs text-gray-500">Cancel</Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs shadow-xs">Add Portfolio Item</Button>
                </div>
              </form>
            )}

            {portfolio.length === 0 ? (
              <div className="py-8 text-center text-gray-500 border border-dashed border-gray-200 rounded-2xl">
                <Briefcase className="w-8 h-8 mx-auto text-gray-500 mb-3" />
                <p className="text-sm font-medium">No portfolio items yet.</p>
                <p className="text-xs mt-1">Document your projects, freelance work, certifications, and writing.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolio.map((item) => {
                  const statusColor = item.status === 'VERIFIED' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : item.status === 'COMPLETE' ? 'text-blue-400 border-blue-500/30 bg-blue-950/30' : 'text-amber-400 border-amber-200 bg-amber-950/30';
                  const linkedSkills = skills.filter(s => item.skills.includes(s.id));
                  return (
                    <div key={item.id} className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow-xs transition-all space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-bold text-gray-900">{item.title}</div>
                          <Badge variant="outline" className={`text-[10px] mt-1 font-mono ${statusColor}`}>{item.type} · {item.status}</Badge>
                        </div>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-emerald-600 transition-colors shrink-0">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      {item.description && <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>}
                      {linkedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {linkedSkills.map(s => (
                            <span key={s.id} className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] text-gray-700 font-mono border border-gray-200">{s.name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: READINESS REPORT */}
        {activeTab === 'READINESS' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Skill domains coverage */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <div className="text-xs font-mono uppercase text-gray-500 font-bold tracking-wider">Skill Domain Coverage</div>
                {SKILL_DOMAINS.map(domain => {
                  const count = getDomainCount(domain.id);
                  return (
                    <div key={domain.id} className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">{domain.icon} {domain.label}</span>
                      <span className={`text-xs font-bold font-mono ${count > 0 ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {count > 0 ? `${count} skill${count > 1 ? 's' : ''}` : 'None'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Gap Analysis */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <div className="text-xs font-mono uppercase text-gray-500 font-bold tracking-wider">Growth Gap Analysis</div>
                {skills.filter(s => (s.targetProficiency || s.proficiency) > s.proficiency).length === 0 ? (
                  <div className="text-xs text-gray-500 text-center py-4">No skills have a target set above current level.</div>
                ) : (
                  skills.filter(s => (s.targetProficiency || s.proficiency) > s.proficiency).slice(0, 6).map(skill => {
                    const gap = (skill.targetProficiency || skill.proficiency) - skill.proficiency;
                    const current = PROFICIENCY_LEVELS.find(l => l.value === skill.proficiency)!;
                    const target = PROFICIENCY_LEVELS.find(l => l.value === skill.targetProficiency)!;
                    return (
                      <div key={skill.id} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-gray-900">{skill.name}</span>
                          <span className="text-amber-700 font-mono font-semibold">+{gap} level{gap > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <span>{current.label}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span className="text-amber-700 font-semibold">{target?.label}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Marketplace Readiness */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <div className="text-xs font-mono uppercase text-gray-500 font-bold tracking-wider">Marketplace Readiness</div>
                <div className="space-y-3">
                  {[
                    { label: 'Skills Mapped', met: skills.length >= 3, value: `${skills.length} / 3 min` },
                    { label: 'Skills Evidenced', met: evidencedCount >= 2, value: `${evidencedCount} / 2 min` },
                    { label: 'Portfolio Items', met: portfolio.length >= 1, value: `${portfolio.length} / 1 min` },
                    { label: 'DLAS Completed', met: dlasHistory.length > 0, value: dlasHistory.length > 0 ? dlasTier : 'Not yet' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        {item.met ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                        <span className={item.met ? 'text-gray-700' : 'text-gray-400'}>{item.label}</span>
                      </div>
                      <span className={`font-mono font-bold ${item.met ? 'text-emerald-700' : 'text-amber-700'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <a href="#marketplace" className="inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-semibold">
                    <ArrowRight className="w-3.5 h-3.5" /> Go to Marketplace
                  </a>
                </div>
              </div>
            </div>

            {/* Honesty Notice */}
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 flex items-start gap-3 text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-gray-700 text-xs leading-relaxed">
                <span className="font-bold text-gray-900">Honesty Governance:</span> All skill proficiency ratings here are self-assessed unless marked as Evidenced (✓). 
                The meUus principle <span className="text-emerald-700 font-bold">Claim ≤ Evidence</span> means no skill is misrepresented as verified without actual proof. 
                Employers, clients, and collaborators in the Marketplace will see exactly what is declared vs evidenced.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
