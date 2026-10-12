/**
 * meUus Creation Studio — Unified Multi-Modal Production Environment
 * 
 * Complies with Master Constitution Sections on CREATION STUDIO & ASSET PIPELINE:
 * - Text Studio: Resumes/CVs, Service Proposals, Articles, Fact Sheets.
 * - Visual Studio: Offline HTML5 Canvas Graphic Generator (Export high-res PNG).
 * - Storyboard Studio: Multi-scene Video Script with narration & camera directives.
 * - Campaign Pipeline: Idea → Audience → Copy → Visual Card → Action Plan.
 * - 100% Offline-capable: Operates in-browser with zero external API requirements.
 */

import React, { useState, useRef, useEffect } from 'react';
import PageHeader from './PageHeader';
import {
  Sparkles,
  FileText,
  Image as ImageIcon,
  Film,
  Download,
  Copy,
  Check,
  Layers,
  Palette,
  ArrowRight,
  Share2,
  RefreshCw,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { offlineStorage } from '../lib/offlineStorage';

export default function MeUusStudio() {
  const [activeStudioTab, setActiveStudioTab] = useState<'visual' | 'text' | 'storyboard' | 'campaign'>('visual');

  // Visual Studio State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [headline, setHeadline] = useState('Consistent, Honest Action Over Perfection');
  const [authorName, setAuthorName] = useState('meUus · Client #001');
  const [categoryTag, setCategoryTag] = useState('HUMAN DIGNITY & WORK');
  const [colorTheme, setColorTheme] = useState<'emerald' | 'navy' | 'gold' | 'violet'>('emerald');
  const [copied, setCopied] = useState(false);

  // Text Studio State
  const [textMode, setTextMode] = useState<'cv' | 'proposal' | 'article'>('cv');
  const [generatedText, setGeneratedText] = useState('');

  // Storyboard State
  const [scenes, setScenes] = useState([
    { scene: 1, duration: '0-15s', shot: 'Close-up on hands writing in a journal', voiceover: 'Every lasting change begins in private honesty: me.' },
    { scene: 2, duration: '15-40s', shot: 'Screen view of knowledge paths & mentors', voiceover: 'Intelligence and assistance are tools to illuminate the path: U.' },
    { scene: 3, duration: '40-60s', shot: 'Community marketplace and collaborative workshop', voiceover: 'When capable individuals unite with integrity, progress belongs to us: meUus.' },
  ]);

  // Campaign State
  const [campaignTopic, setCampaignTopic] = useState('Ethical Freelance Web Services in Sylhet');
  const [campaignPlan, setCampaignPlan] = useState<any>(null);

  // Canvas Graphic Renderer
  useEffect(() => {
    if (activeStudioTab !== 'visual') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 480;
    canvas.width = width;
    canvas.height = height;

    // Theme Gradients
    const gradients = {
      emerald: ['#022c22', '#064e3b', '#020617'],
      navy: ['#031738', '#0b2559', '#020617'],
      gold: ['#2e2003', '#453205', '#020617'],
      violet: ['#1e0a38', '#381469', '#020617'],
    };
    const accents = {
      emerald: '#10B981',
      navy: '#38BDF8',
      gold: '#F59E0B',
      violet: '#A855F7',
    };

    const currentGrad = gradients[colorTheme];
    const currentAccent = accents[colorTheme];

    // Background Gradient
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, currentGrad[0]);
    bg.addColorStop(0.5, currentGrad[1]);
    bg.addColorStop(1, currentGrad[2]);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Decorative Geometric Grid / Tech Circles
    ctx.strokeStyle = `${currentAccent}22`;
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Glowing Ambient Halo
    const halo = ctx.createRadialGradient(width - 120, 100, 20, width - 120, 100, 220);
    halo.addColorStop(0, `${currentAccent}55`);
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(width - 120, 100, 220, 0, Math.PI * 2);
    ctx.fill();

    // Border Frame
    ctx.strokeStyle = `${currentAccent}55`;
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Category Badge
    ctx.fillStyle = `${currentAccent}33`;
    ctx.fillRect(48, 48, 220, 32);
    ctx.strokeStyle = currentAccent;
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, 220, 32);

    ctx.fillStyle = currentAccent;
    ctx.font = 'bold 12px Geist, Inter, sans-serif';
    ctx.fillText(categoryTag.toUpperCase(), 62, 69);

    // Headline (Auto-wrapping)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Georgia, serif';
    const words = headline.split(' ');
    let line = '';
    let lineY = 140;
    const maxWidth = width - 120;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 48, lineY);
        line = words[n] + ' ';
        lineY += 40;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 48, lineY);

    // Sub-brand & Author Footer
    ctx.fillStyle = '#94A3B8';
    ctx.font = '14px Geist, Inter, sans-serif';
    ctx.fillText(`Presented by: ${authorName}`, 48, height - 56);

    ctx.font = 'bold 16px Georgia, serif';
    ctx.fillStyle = currentAccent;
    ctx.fillText('meUus · me → U → us', width - 240, height - 56);
  }, [headline, authorName, categoryTag, colorTheme, activeStudioTab]);

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `meuus-card-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const generateTextSample = (type: 'cv' | 'proposal' | 'article') => {
    setTextMode(type);
    if (type === 'cv') {
      setGeneratedText(`MD. MAHADY HASAN (CLIENT #001)
Email: mahadyhasan1@gmail.com | Phone: +880 1756 104026 | Location: Bangladesh
Axiom: Claim ≤ Evidence | Principle: Consistent, Honest Action Over Perfection

PROFESSIONAL SUMMARY
Architect and lead builder of the meUus Human Development Operating System. Proven track record of architecting full-stack TypeScript systems, Google Workspace automation, Cloud SQL PostgreSQL schemas, and non-clinical developmental frameworks.

KEY CAPABILITIES & SKILLS
• System Architecture: React 19, TypeScript, Vite, Node.js, Express, Drizzle ORM
• Multi-Model Routing: Gemini 2.5/3 Pro, Google GenAI SDK, local-first offline kernels
• Data Governance: Truth-labeling, audit trails, L0 to L5 permission boundaries
• Preservation: 22 R-series release cycles, 3 DSR quality gates, 7 verified laptop audits

EVIDENCE & PROJECTS
1. meUus Operating System (meuus.org, meuussoul.com, meuus.app, rujbel.org)
2. R60A Ecosystem Algorithm Kernel & Bilingual Human Journey Engine
3. Be The Starting Point: 37-chapter developmental manuscript draft.`);
    } else if (type === 'proposal') {
      setGeneratedText(`SERVICE PROPOSAL: ETHICAL DIGITAL PRESENCE ARCHITECTURE
Target Client: Local Small Enterprise / Institutional Initiative
Provider: meUus Economic Marketplace Partner

1. OBJECTIVE & SCOPE
Deliver a high-integrity, responsive, fast-loading digital surface tailored to the client's verified capabilities. No false promises; real verifiable presentation.

2. DELIVERABLES
• 4-Domain Architecture Alignment: Understand, Learn, Reflect, Act.
• Accessible Web Presence: Compliant with WCAG 2.1 AA contrast & keyboard navigation.
• Local-First Privacy: Zero unauthorized tracker injection; clear client data ownership.
• Production Security: Standard CSP, nosniff, and clickjacking protection headers.

3. TIMELINE & MILESTONES
• Phase 1: Context Discovery & Stated Reality Audit (Days 1–3)
• Phase 2: Core Build & Milestone Verification (Days 4–10)
• Phase 3: Client Handover & Offline Training (Days 11–14)

4. GOVERNANCE
This engagement operates under Claim ≤ Evidence. Payment stages release upon verified tangible milestone review.`);
    } else {
      setGeneratedText(`THE STARTING POINT IS YOU
By Md. Mahady Hasan (Rujbel)

Before building a company, a platform, or an institution, there is one unavoidable reality: you must first understand where you honestly stand.

In a world obsessed with premature scale and fabricated credentials, meUus was born with a different axiom:
Claim ≤ Evidence.

Consistent, honest action over perfection. If you can only take one small step today, let that step be real. A verified inch forward creates more enduring human dignity than a thousand miles of ungrounded ambition.`);
    }
  };

  const handleGenerateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setCampaignPlan({
      title: campaignTopic,
      audience: 'Independent professionals, aspiring developers & local trade leaders',
      positioning: 'Verifiable, evidence-grounded services with direct founder accountability',
      headlines: [
        'Build Your Ethical Service on Real Proof, Not Exaggerations.',
        'From First Line of Code to Long-Term Client Trust.',
        'Dignity in Work: Where Honest Effort Meets Genuine Community Need.',
      ],
      publishingSchedule: [
        { day: 'Day 1', action: 'Publish Founder Manifesto & Truth Statement' },
        { day: 'Day 3', action: 'Share Evidence Portfolio & Verified Project Case Study' },
        { day: 'Day 7', action: 'Open Dialogue on Local Economic Opportunities & Q&A' },
      ],
      actionChecklist: [
        'Prepare 1 verified client case study with measurable outcomes.',
        'Review pricing with transparent breakdown (no hidden markups).',
        'Verify local offline backup for all client documentation.',
      ],
    });
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        icon={<Layers size={18} />}
        title="meUus Studio"
        subtitle="Ecosystem Visual & Architectural Studio for Modular Creation."
        badge="Creator"
        breadcrumb="Intelligence"
      />
      <section id="studio" className="py-8 px-4 sm:px-6 lg:px-8 bg-white text-gray-900">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Unified meUus Creation Studio
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Create What You Imagine · 100% In-Browser & Offline
            </h2>
            <p className="text-gray-600 text-sm max-w-2xl">
              Turn thoughts into high-resolution visuals, structured professional documents, video storyboards,
              and complete marketing campaigns with zero external dependencies.
            </p>
          </div>
        </div>

        {/* Studio Sub-Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {[
            { id: 'visual', label: 'Visual Studio (Canvas)', icon: ImageIcon },
            { id: 'text', label: 'Text & Editorial Studio', icon: FileText },
            { id: 'storyboard', label: 'Video Storyboard', icon: Film },
            { id: 'campaign', label: 'Campaign Pipeline', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStudioTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                  activeStudioTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 1. VISUAL STUDIO: Offline HTML5 Canvas */}
        {activeStudioTab === 'visual' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Controls */}
            <div className="lg:col-span-5 space-y-4 p-6 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-600" />
                Visual Customization
              </h3>

              <div>
                <label htmlFor="studio-headline-input" className="block text-xs font-semibold text-gray-700 mb-1">Headline Text</label>
                <textarea
                  id="studio-headline-input"
                  aria-label="Headline Text"
                  rows={2}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="studio-category-input" className="block text-xs font-semibold text-gray-700 mb-1">Category Tag</label>
                <input
                  id="studio-category-input"
                  aria-label="Category Tag"
                  type="text"
                  value={categoryTag}
                  onChange={(e) => setCategoryTag(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="studio-author-input" className="block text-xs font-semibold text-gray-700 mb-1">Author / Sub-label</label>
                <input
                  id="studio-author-input"
                  aria-label="Author / Sub-label"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Palette Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'emerald', label: 'Growth', bg: 'bg-emerald-600' },
                    { id: 'navy', label: 'Trust', bg: 'bg-sky-600' },
                    { id: 'gold', label: 'Dignity', bg: 'bg-amber-600' },
                    { id: 'violet', label: 'Soul', bg: 'bg-purple-600' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setColorTheme(t.id as any)}
                      className={`p-2 rounded-xl border text-center text-xs font-medium transition ${
                        colorTheme === t.id
                          ? 'border-emerald-600 text-gray-900 bg-white shadow-sm ring-1 ring-emerald-500'
                          : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${t.bg}`}></div>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download High-Resolution PNG (800x480)
                </button>
              </div>
            </div>

            {/* Right Canvas Preview */}
            <div className="lg:col-span-7 space-y-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-md overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-auto rounded-xl block" />
              </div>
              <p className="text-center text-xs text-gray-500 font-mono">
                Rendered completely inside your browser GPU canvas · Works 100% offline
              </p>
            </div>
          </div>
        )}

        {/* 2. TEXT & EDITORIAL STUDIO */}
        {activeStudioTab === 'text' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'cv', label: 'Verified CV Blueprint' },
                { id: 'proposal', label: 'Honest Service Proposal' },
                { id: 'article', label: 'Philosophical Article' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => generateTextSample(btn.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                    textMode === btn.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider font-mono">
                  Document Editor & Provenance Buffer
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-1.5 transition shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Text'}
                </button>
              </div>

              <textarea
                rows={14}
                value={generatedText || 'Select a document blueprint above or type your truthful draft here...'}
                onChange={(e) => setGeneratedText(e.target.value)}
                className="w-full font-mono text-xs leading-relaxed rounded-xl border border-gray-300 bg-white p-4 text-gray-800 focus:outline-none focus:border-emerald-600 shadow-sm"
              />
            </div>
          </div>
        )}

        {/* 3. STORYBOARD & VIDEO SCRIPT */}
        {activeStudioTab === 'storyboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Video Storyboard & Narration Track</h3>
                <p className="text-xs text-gray-500">
                  Script directives mapped to shot lengths and message pacing.
                </p>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(scenes, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'meuus-storyboard.json';
                  a.click();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Export Script JSON
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {scenes.map((s) => (
                <div key={s.scene} className="p-5 rounded-2xl border border-gray-200 bg-white space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-700 text-sm">Scene {s.scene}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 font-mono text-gray-600">
                      {s.duration}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Visual Shot:</p>
                    <p className="text-xs text-gray-800">{s.shot}</p>
                  </div>
                  <div className="space-y-1 pt-1 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Narration / Voice:</p>
                    <p className="text-xs italic text-gray-700">"{s.voiceover}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CAMPAIGN PIPELINE */}
        {activeStudioTab === 'campaign' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">Full Creative Asset Pipeline</h3>
              <p className="text-xs text-gray-500">
                Orchestrate an end-to-end launch plan: Idea → Positioning → Copy → Visual Card → Action Schedule.
              </p>

              <form onSubmit={handleGenerateCampaign} className="flex gap-3">
                <input
                  type="text"
                  value={campaignTopic}
                  onChange={(e) => setCampaignTopic(e.target.value)}
                  placeholder="Enter campaign subject (e.g. Clean Energy Pilot in Khulna)"
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition shadow-sm"
                >
                  Generate Plan
                </button>
              </form>
            </div>

            {campaignPlan && (
              <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    Orchestrated Strategy
                  </span>
                  <h4 className="text-xl font-bold text-gray-900 mt-1">{campaignPlan.title}</h4>
                  <p className="text-xs text-gray-700 mt-1">
                    <strong>Target Audience:</strong> {campaignPlan.audience}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2 shadow-sm">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-700">Copy Variations</h5>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {campaignPlan.headlines.map((h: string, i: number) => (
                        <li key={i}>• "{h}"</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2 shadow-sm">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-sky-700">Publishing Timeline</h5>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {campaignPlan.publishingSchedule.map((ps: any, i: number) => (
                        <li key={i}><strong>{ps.day}:</strong> {ps.action}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2 shadow-sm">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-amber-700">Action Checklist</h5>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {campaignPlan.actionChecklist.map((c: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
    </div>
  );
}
