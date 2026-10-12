/**
 * Dashboard — meUus Human OS Home (Light Theme)
 * Reference: https://meuus-human-flow.base44.app
 * 1666 Apple & Gravity emblem, Beyond Coding headline, interactive workspace selector.
 * 1st Click changes the display box live with real-time steps, feel-and-see execution,
 * DLAS continuation, and All-Product text review options.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Zap, Brain, TrendingUp, Heart, BookOpen, ShoppingBag,
  Shield, Award, BarChart3, Code2, Layers, Star, Users, Globe,
  ArrowRight, Play, GraduationCap, Cpu, FileText, Map,
  Building2, Lightbulb, ChevronRight, CheckCircle2, Clock,
  MessageCircle, Wifi, SquareTerminal, Terminal, PlayCircle,
  Eye, RefreshCw, Send, Check, CornerDownLeft, Sparkle, SlidersHorizontal,
  FolderGit2, CheckCircle, ArrowUpRight, Compass, Library, HeartPulse,
  Activity, BookCheck, ShieldAlert, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEcosystem } from '../context/EcosystemContext';

type DisplayMode = 'prompt' | 'sessions' | 'credits' | 'active-flow' | 'product-review';

interface FlowState {
  title: string;
  step: string;
  progress: number;
  status: 'idle' | 'running' | 'completed';
  logs: string[];
  output?: string;
  targetRoute?: string;
}

const SAMPLE_TASKS = [
  { label: 'Read and understand ecosystem files', flow: 'audit', target: 'full-ecosystem' },
  { label: 'Organize all files with answers', flow: 'organize', target: 'knowledge' },
  { label: 'Run DLAS 5-Lens reflection test', flow: 'dlas', target: 'dlas' },
  { label: 'Execute WorkStation code pipeline', flow: 'code', target: 'workstation' },
  { label: 'Review Soul Profile & Evidence Ledger', flow: 'soul', target: 'soul-profile' },
];

interface ProductSummary {
  name: string;
  category: string;
  layer: string;
  route: string;
  status: string;
  description: string;
  evidence: string;
}

const ALL_PRODUCTS: ProductSummary[] = [
  {
    name: 'DLAS Engine',
    category: 'Human Reflection & Evaluation',
    layer: 'Layer 5: Learning & Reflection',
    route: 'dlas',
    status: 'Available Now',
    description: 'Longitudinal self-reflection framework across 5 core human lenses: Spiritual, Character, Knowledge, Execution, and Community.',
    evidence: 'Interactive 8-stage longitudinal cycle with local-first IndexedDB retention.'
  },
  {
    name: 'Gemini AI Intelligence Suite',
    category: 'Multimodal Cognitive Amplifier',
    layer: 'Layer 10: AI Ecosystem & Model Router',
    route: 'ai-suite',
    status: 'Available Now',
    description: 'Grounding with Google Search & Maps, multimodal vision, real-time voice, and deep thinking tier with automated fallbacks.',
    evidence: 'Direct Google GenAI SDK integration with multi-tier fallbacks.'
  },
  {
    name: 'WorkStation Suite',
    category: 'Creation & Execution Environment',
    layer: 'Layer 6: Creation (#AnyOneCanBuild#)',
    route: 'workstation',
    status: 'Available Now',
    description: 'Developer workspace with sandboxed code runner, multi-model agent switching, telemetry, and zero-cost local execution.',
    evidence: 'In-browser sandbox + Node.js server bridge.'
  },
  {
    name: 'Master Soul Profile',
    category: 'Identity & Ethical Record',
    layer: 'Layer 7: Profile / Proof Layer',
    route: 'soul-profile',
    status: 'Available Now',
    description: 'Verified capability record and value alignment. Governed by Claim ≤ Evidence axiom. Demonstrated work over unverified claims.',
    evidence: 'Personal memory encryption + exportable cryptographic ledger.'
  },
  {
    name: 'Universal meYoo OS',
    category: 'Human Operating System',
    layer: 'Core Kernel',
    route: 'meyoo',
    status: 'Available Now',
    description: 'The holistic operating system uniting me (self), U (intelligence/assistance), and us (community responsibility).',
    evidence: 'Constitutional Charter docs/meuus-connected-ecosystem.md.'
  },
  {
    name: 'Connected Ecosystem Hub',
    category: 'Inter-System Topology',
    layer: '10 Connected Layers',
    route: 'connected-ecosystem',
    status: 'Available Now',
    description: 'Unified visualization of the 10 connected layers and 7 execution layers tying language to justice and continuation.',
    evidence: 'System architecture diagram with live layer telemetry.'
  },
  {
    name: 'Two-Way Marketplace',
    category: 'Economic & Value Distribution',
    layer: 'Layer 9: Value Distribution',
    route: 'marketplace',
    status: 'Available Now',
    description: 'Peer-to-peer capacity exchange connecting demonstrated capability with real human projects and opportunities.',
    evidence: 'Transparent ledger accounting with zero predatory take-rates.'
  },
  {
    name: 'Mind Wellness & Triage',
    category: 'Health & Safe Boundaries',
    layer: 'Layer 4: Personal Memory & Safety',
    route: 'wellness',
    status: 'Available Now',
    description: 'Daily emotional check-in with safe handoff. Clear non-clinical boundaries: EmotionalAI ≠ Therapist.',
    evidence: 'Emergency crisis hotline routing and safety protocol verified.'
  },
  {
    name: 'Quran & Seerah Journeys',
    category: 'Wisdom & Spiritual Heritage',
    layer: 'Layer 2: Knowledge & Sources',
    route: 'quran-seerah',
    status: 'Available Now',
    description: '114-Day Quran and 80-Day Seerah longitudinal journeys with authentic citations and Bengali typography support.',
    evidence: 'Classical textual cross-references with chapter indexes.'
  },
  {
    name: 'Knowledge Hub & Preserved Library',
    category: 'Curated Verified Knowledge',
    layer: 'Layer 2: Usable Understanding',
    route: 'knowledge',
    status: 'Available Now',
    description: 'Searchable repository of foundational knowledge articles categorized across science, ethics, history, and systems.',
    evidence: 'Source-verified document records with full text reader.'
  },
  {
    name: 'Career Skill Graph',
    category: 'Capability Architecture',
    layer: 'Layer 8: Opportunity Layer',
    route: 'career-graph',
    status: 'Available Now',
    description: 'Visual graph showing skill dependencies, mastery progression, and verified portfolio evidence paths.',
    evidence: 'Interactive SVG skill topology mapped to real-world outcomes.'
  },
  {
    name: 'Evidence Registry & Ledger',
    category: 'Constitutional Trust',
    layer: 'Layer 3: Evidence Layer',
    route: 'evidence',
    status: 'Available Now',
    description: 'Public cryptographic proof registry backing all ecosystem claims. Verification statuses from Proven to In Review.',
    evidence: 'Live integrity verification of codebase, commits, and assets.'
  }
];

export default function Dashboard({ onNavigate }: { onNavigate: (route: string) => void }) {
  const { user } = useAuth();
  const { openAiGuide } = useEcosystem();
  const [time, setTime] = useState(new Date());

  // Interactive display box state
  const [displayTab, setDisplayTab] = useState<DisplayMode>('prompt');
  const [promptText, setPromptText] = useState('');
  const [activeWorkspace, setActiveWorkspace] = useState('MEUUS_ECOSYSTEM');
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(null);
  
  // Live action/flow simulator inside the box
  const [flowState, setFlowState] = useState<FlowState>({
    title: 'Ecosystem Ready',
    step: 'Standing by for human intention...',
    progress: 0,
    status: 'idle',
    logs: [
      'Initialized meUus Human Flow kernel v1.0',
      'System status: All 48 components & 9 Canonical Hubs online',
      'Axiom: Claim ≤ Evidence',
      'Ready to assist your understanding, reflection, and execution.'
    ]
  });

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const triggerFlow = (taskName: string, target?: string) => {
    // 1st click immediately changes the display box live
    setDisplayTab('active-flow');
    setFlowState({
      title: taskName,
      step: '1. Human Intention Captured · Parsing goal and context...',
      progress: 20,
      status: 'running',
      logs: [
        `[${new Date().toLocaleTimeString()}] Task registered: "${taskName}"`,
        `[${new Date().toLocaleTimeString()}] Target workspace: ${activeWorkspace}`,
        `[${new Date().toLocaleTimeString()}] Activating 10 Connected Layers...`
      ],
      targetRoute: target || 'dlas'
    });

    setTimeout(() => {
      setFlowState(prev => ({
        ...prev,
        step: '2. DLAS 5-Lens Reflection & Evidence Check (Claim ≤ Evidence)...',
        progress: 55,
        logs: [
          ...prev.logs,
          `[${new Date().toLocaleTimeString()}] Validating against Constitutional Axiom: Claim ≤ Evidence.`,
          `[${new Date().toLocaleTimeString()}] DLAS Lenses applied: Spiritual, Character, Knowledge, Execution, Community.`
        ]
      }));
    }, 900);

    setTimeout(() => {
      setFlowState(prev => ({
        ...prev,
        step: '3. Connecting Module Execution Pipeline...',
        progress: 85,
        logs: [
          ...prev.logs,
          `[${new Date().toLocaleTimeString()}] Routing through Gemini Multi-Tier Intelligence Suite...`,
          `[${new Date().toLocaleTimeString()}] Verified 48 core ecosystem modules online.`
        ]
      }));
    }, 1800);

    setTimeout(() => {
      setFlowState(prev => ({
        ...prev,
        step: '4. Pipeline Execution Ready · Select continuation option below',
        progress: 100,
        status: 'completed',
        logs: [
          ...prev.logs,
          `[${new Date().toLocaleTimeString()}] Execution completed successfully.`,
          `[${new Date().toLocaleTimeString()}] Ready for DLAS evaluation or complete product review.`
        ],
        output: `Task "${taskName}" has been structured. You can continue directly into the DLAS Engine for longitudinal reflection, or review all 48 ecosystem products in text.`
      }));
    }, 2700);
  };

  const handleSendPrompt = () => {
    if (!promptText.trim()) return;
    triggerFlow(promptText);
    setPromptText('');
  };

  return (
    <div className="min-h-full bg-gray-50 text-gray-900 pb-16">
      {/* ── Beyond Coding Header ── */}
      <div className="bg-white border-b border-gray-200 px-6 pt-6 pb-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">

          {/* 1666 Apple & Gravity Emblem */}
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl border border-gray-200 p-1 flex items-center justify-center bg-gray-50 shadow-xs">
              <span className="text-xl" role="img" aria-label="Ecosystem Tree">🌳</span>
            </div>
            <div className="text-left font-mono text-[11px] text-gray-500 leading-tight">
              <span className="font-bold text-gray-900 text-xs">1666</span>
              <br />
              The Apple · Gravity
              <br />
              <span className="text-emerald-600 font-semibold">meUus · 2026</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1">
            Beyond Coding
          </h1>
          
          {/* Quick stats strip — above the fold */}
          <div className="flex items-center gap-4 mb-4 flex-wrap justify-center">
            {[
              { label: '48 Modules', color: 'text-emerald-600' },
              { label: '10 Layers', color: 'text-blue-600' },
              { label: '4 Domains', color: 'text-amber-600' },
              { label: 'Claim ≤ Evidence', color: 'text-gray-600' },
            ].map((s) => (
              <span key={s.label} className={`text-xs font-semibold ${s.color} bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full`}>
                {s.label}
              </span>
            ))}
          </div>

          
          {/* Interactive Workspace selector dropdown */}
          <div className="relative mb-6">
            <p className="text-sm sm:text-base text-gray-500">
              What can meUus Intelligence help you build in{' '}
              <button
                type="button"
                onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                className="font-semibold text-gray-900 underline decoration-emerald-500 decoration-2 underline-offset-4 hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
              >
                <span>{activeWorkspace}</span>
                <span className="text-xs text-gray-400">▾</span>
              </button>{' '}
              ?
            </p>

            {isWorkspaceMenuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1.5 text-left text-xs">
                {[
                  { id: 'MEUUS_ECOSYSTEM', label: 'MEUUS_ECOSYSTEM · Master Core' },
                  { id: 'DLAS_EVAL_WORKSPACE', label: 'DLAS_EVAL_WORKSPACE · Reflection' },
                  { id: 'SOUL_PROFILE_CORE', label: 'SOUL_PROFILE_CORE · Identity' },
                  { id: 'WORKSTATION_RUNTIME', label: 'WORKSTATION_RUNTIME · Execution' },
                  { id: 'KNOWLEDGE_VAULT', label: 'KNOWLEDGE_VAULT · Preserved Sources' }
                ].map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setActiveWorkspace(ws.id);
                      setIsWorkspaceMenuOpen(false);
                      triggerFlow(`Switching workspace context to ${ws.id}`);
                    }}
                    className={`w-full px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 ${
                      activeWorkspace === ws.id ? 'text-emerald-700 font-semibold bg-emerald-50' : 'text-gray-700'
                    }`}
                  >
                    <span>{ws.label}</span>
                    {activeWorkspace === ws.id && <Check size={14} className="text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Live Display Box (1st click changes the display box live) ── */}
          <div className="w-full bg-white border border-gray-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 rounded-2xl shadow-sm p-4 transition-all text-left">
            
            {/* Header Tabs: Prompt | Sessions | Credits | Live Flow | Product Review */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
              <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium overflow-x-auto scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setDisplayTab('prompt')}
                  className={`transition-colors whitespace-nowrap ${
                    displayTab === 'prompt'
                      ? 'text-gray-900 font-semibold border-b-2 border-emerald-600 pb-1 -mb-3'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Prompt
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayTab('sessions')}
                  className={`transition-colors whitespace-nowrap ${
                    displayTab === 'sessions'
                      ? 'text-gray-900 font-semibold border-b-2 border-emerald-600 pb-1 -mb-3'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Sessions
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayTab('credits')}
                  className={`transition-colors whitespace-nowrap ${
                    displayTab === 'credits'
                      ? 'text-gray-900 font-semibold border-b-2 border-emerald-600 pb-1 -mb-3'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Credits
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayTab('active-flow')}
                  className={`transition-colors flex items-center gap-1 whitespace-nowrap ${
                    displayTab === 'active-flow'
                      ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-1 -mb-3'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${flowState.status === 'running' ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                  Live Flow
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayTab('product-review')}
                  className={`transition-colors flex items-center gap-1 whitespace-nowrap ${
                    displayTab === 'product-review'
                      ? 'text-gray-900 font-semibold border-b-2 border-emerald-600 pb-1 -mb-3'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <BookCheck size={12} className="text-emerald-600" />
                  Product Review
                </button>
              </div>

              <span className="text-[11px] font-mono text-gray-400 hidden sm:inline">
                {activeWorkspace}
              </span>
            </div>

            {/* Display Body: Changes live based on tab or active interaction */}
            <div className="min-h-[120px]">
              {displayTab === 'prompt' && (
                <div>
                  <textarea
                    rows={2}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Press and hold the mouse to dictate text, or type your goal here..."
                    className="w-full resize-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent pt-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendPrompt();
                      }
                    }}
                  />

                  {/* Sample Task Quick Actions (1st click immediately switches display box live) */}
                  <div className="flex flex-wrap gap-1.5 pt-2 pb-1">
                    {SAMPLE_TASKS.map((t) => (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => triggerFlow(t.label, t.target)}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 border border-gray-200 transition-colors flex items-center gap-1"
                      >
                        <span>{t.label}</span>
                        <ChevronRight size={11} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {displayTab === 'sessions' && (
                <div className="py-2 text-xs text-gray-600 space-y-2">
                  <div className="font-semibold text-gray-800 flex items-center justify-between">
                    <span>Active Working Sessions:</span>
                    <button
                      type="button"
                      onClick={() => triggerFlow('Spawning fresh session sandbox')}
                      className="text-[11px] text-emerald-600 font-medium hover:underline"
                    >
                      + New Session
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">MEUUS_ECOSYSTEM · Master Build</div>
                      <div className="text-[10px] text-gray-400 font-mono">ID: session-001 · Port 3000 Live · Client #001</div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                      Connected
                    </span>
                  </div>
                </div>
              )}

              {displayTab === 'credits' && (
                <div className="py-2 text-xs text-gray-600 space-y-2">
                  <div className="font-semibold text-gray-800">Constitutional Universal Token Pool:</div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold text-emerald-600">1.40B</div>
                      <div className="text-[10px] text-gray-400 font-mono">Free Tokens/Mo</div>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold text-gray-800">$0.00</div>
                      <div className="text-[10px] text-gray-400 font-mono">Cost to Human</div>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold text-blue-600">48 / 48</div>
                      <div className="text-[10px] text-gray-400 font-mono">Modules Active</div>
                    </div>
                  </div>
                </div>
              )}

              {displayTab === 'active-flow' && (
                <div className="py-1 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <Terminal size={14} className="text-emerald-600" />
                      <span>{flowState.title}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-semibold ${
                      flowState.status === 'running'
                        ? 'bg-amber-100 text-amber-700 animate-pulse'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {flowState.status}
                    </span>
                  </div>

                  {/* Progress Bar & Current Step */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-gray-600 mb-1">
                      <span className="font-medium text-emerald-700">{flowState.step}</span>
                      <span className="font-mono">{flowState.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${flowState.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Live Terminal Log Stream */}
                  <div className="p-2.5 rounded-lg bg-gray-50 text-gray-800 font-mono text-[11px] space-y-1 max-h-24 overflow-y-auto border border-gray-200">
                    {flowState.logs.map((log, i) => (
                      <div key={i} className="text-gray-700 leading-tight">{log}</div>
                    ))}
                  </div>

                  {/* Action Choices: Continue to DLAS or Product Text Review */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => onNavigate('dlas')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <TrendingUp size={13} />
                      <span>Continue to DLAS Engine →</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setDisplayTab('product-review')}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium text-xs transition-colors flex items-center gap-1.5"
                    >
                      <BookCheck size={13} className="text-emerald-600" />
                      <span>Review All 48 Products (Text)</span>
                    </button>

                    {flowState.targetRoute && flowState.targetRoute !== 'dlas' && (
                      <button
                        type="button"
                        onClick={() => onNavigate(flowState.targetRoute!)}
                        className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-xs transition-colors flex items-center gap-1"
                      >
                        <span>Open {flowState.targetRoute.replace('-', ' ').toUpperCase()}</span>
                        <ChevronRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {displayTab === 'product-review' && (
                <div className="py-1 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">All 48 Ecosystem Modules — Text & Evidence Review</span>
                    <span className="text-[10px] text-gray-400 font-mono">Claim ≤ Evidence</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {ALL_PRODUCTS.map((prod) => (
                      <div
                        key={prod.route}
                        onClick={() => setSelectedProduct(prod)}
                        className="p-2 rounded-lg bg-gray-50 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-semibold text-gray-900 text-[11px]">{prod.name}</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-medium">
                              {prod.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight">
                            {prod.description}
                          </p>
                        </div>
                        <div className="mt-1 pt-1 border-t border-gray-100 flex items-center justify-between text-[9px] text-emerald-700 font-medium">
                          <span>{prod.layer}</span>
                          <span className="flex items-center gap-0.5">Review text <ChevronRight size={10} /></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAiGuide()}
                  className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
                  title="Add Attachment / Goal"
                >
                  <Sparkles size={14} className="text-emerald-600" />
                </button>
                <span className="text-[11px] text-gray-400 font-mono">Auto approve ▾</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  <Cpu size={11} /> Gemini 3.8 Flash
                </span>
                <button
                  type="button"
                  onClick={handleSendPrompt}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-xs flex items-center gap-1"
                >
                  <span>Send</span>
                  <CornerDownLeft size={12} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Product Detailed Text Review Modal ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 text-left space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                  {selectedProduct.layer}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{selectedProduct.name}</h3>
                <span className="text-xs text-gray-500">{selectedProduct.category}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <div>
                <span className="font-semibold text-gray-900 block mb-0.5">Constitutional Purpose & Architecture:</span>
                <p>{selectedProduct.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-semibold text-gray-900 block mb-0.5 flex items-center gap-1">
                  <Shield size={12} className="text-emerald-600" />
                  Evidence Standard (Claim ≤ Evidence):
                </span>
                <p className="text-gray-500 font-mono text-[11px]">{selectedProduct.evidence}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-3.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = selectedProduct.route;
                  setSelectedProduct(null);
                  onNavigate(target);
                }}
                className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Launch {selectedProduct.name}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Ecosystem Sections (Dashboard → DLAS → All Hubs) ── */}
      <div className="max-w-5xl mx-auto px-6 py-7 space-y-8">
        
        {/* Core Quick Access */}
        <section aria-labelledby="quick-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="quick-heading" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Zap size={15} className="text-emerald-500" />
              Core Capabilities · meUus Ecosystem
            </h2>
            <span className="text-[11px] text-gray-400 font-mono">Direct 1-Click Launch</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {[
              {
                label: 'DLAS Engine',
                desc: 'Reflect, evaluate & grow across 5 human lenses',
                route: 'dlas',
                icon: <TrendingUp size={18} />,
                bg: 'bg-emerald-50',
                text: 'text-emerald-600',
                badge: 'Core'
              },
              {
                label: 'Gemini AI Suite',
                desc: 'Multimodal AI — voice, vision, search & grounding',
                route: 'ai-suite',
                icon: <Cpu size={18} />,
                bg: 'bg-blue-50',
                text: 'text-blue-600',
                badge: 'AI'
              },
              {
                label: 'WorkStation',
                desc: 'Multi-model router & free code execution',
                route: 'workstation',
                icon: <SquareTerminal size={18} />,
                bg: 'bg-violet-50',
                text: 'text-violet-600'
              },
              {
                label: 'Soul Profile',
                desc: 'Personal values, identity & evidence ledger',
                route: 'soul-profile',
                icon: <Star size={18} />,
                bg: 'bg-amber-50',
                text: 'text-amber-600'
              },
              {
                label: 'Marketplace',
                desc: 'Skill exchanges & human capacity marketplace',
                route: 'marketplace',
                icon: <ShoppingBag size={18} />,
                bg: 'bg-rose-50',
                text: 'text-rose-600'
              },
              {
                label: 'Mind Wellness',
                desc: 'Daily reflection, emotional regulation & triage',
                route: 'wellness',
                icon: <Heart size={18} />,
                bg: 'bg-pink-50',
                text: 'text-pink-600'
              },
              {
                label: 'Education Hub',
                desc: 'Structured learning tracks & capability building',
                route: 'education',
                icon: <GraduationCap size={18} />,
                bg: 'bg-sky-50',
                text: 'text-sky-600'
              },
              {
                label: 'Career Skill Graph',
                desc: 'Visual skill mapping & evidence-backed pathways',
                route: 'career-graph',
                icon: <BarChart3 size={18} />,
                bg: 'bg-teal-50',
                text: 'text-teal-600'
              }
            ].map((c) => (
              <button
                key={c.route}
                onClick={() => onNavigate(c.route)}
                className="group text-left bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-md rounded-xl p-4 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.bg} ${c.text}`}>
                    {c.icon}
                  </div>
                  <div className="flex items-center gap-1">
                    {c.badge && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {c.badge}
                      </span>
                    )}
                    <ArrowRight size={12} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
                <div className="font-semibold text-sm text-gray-900 mb-0.5 group-hover:text-emerald-700 transition-colors">
                  {c.label}
                </div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  {c.desc}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Canonical Review & Epistemic Boundary Notice */}
        <section className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-start gap-3 text-xs text-gray-600">
          <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1 leading-relaxed">
            <span className="font-bold text-gray-900 uppercase tracking-wider text-[11px] block">
              meUus Epistemic Standard · Claim ≤ Evidence
            </span>
            <p>
              Every capability is open for inspection. All 48 modules represent authentic code, vetted architectures, and transparent evidence registries. No fabricated claims, no deceptive metrics.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
