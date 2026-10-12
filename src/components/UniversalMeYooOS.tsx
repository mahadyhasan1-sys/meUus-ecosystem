/**
 * UniversalMeYooOS — The Human Development, Intelligence & Execution Operating Center
 * 
 * Implements the Master meUus Constitution:
 * - Single conversational entry point: meYoo
 * - Turns intent into: Understanding → Knowledge → Planning → Execution → Growth
 * - Governed Agent Registry & Natural Language Agent Builder (L0 to L5 approval)
 * - Automation Engine
 * - Local-first / Offline-capable with offlineStorage persistence
 */

import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import {
  Sparkles,
  Bot,
  Zap,
  BookOpen,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldAlert,
  Play,
  CheckCircle2,
  Brain,
  Cpu,
  PlusCircle,
  Clock,
  Sliders,
  Database,
  Wifi,
  WifiOff,
  Download,
  Trash2,
} from 'lucide-react';
import {
  offlineStorage,
  type StoredAgent,
  type StoredAutomation,
} from '../lib/offlineStorage';

export default function UniversalMeYooOS() {
  const [intentInput, setIntentInput] = useState('');
  const [isOnline, setIsOnline] = useState(offlineStorage.getOnlineStatus());
  const [activeTab, setActiveTab] = useState<'chat' | 'agents' | 'automations' | 'studio'>('chat');
  const [agents, setAgents] = useState<StoredAgent[]>([]);
  const [automations, setAutomations] = useState<StoredAutomation[]>([]);
  const [systemResponse, setSystemResponse] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Agent Builder Modal State
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPurpose, setNewAgentPurpose] = useState('');
  const [newAgentLevel, setNewAgentLevel] = useState<'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5'>('L2');
  const [newAgentInstructions, setNewAgentInstructions] = useState('');

  useEffect(() => {
    const unsub = offlineStorage.subscribeToConnection(setIsOnline);
    setAgents(offlineStorage.getAgents());
    setAutomations(offlineStorage.getAutomations());
    return unsub;
  }, []);

  const handleIntentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intentInput.trim()) return;

    setIsProcessing(true);
    const input = intentInput.trim();

    setTimeout(() => {
      let responseType = 'general';
      let title = 'Synthesizing Path';
      let details: string[] = [];
      let primaryAction = { text: 'Proceed', href: '#start' };

      const lower = input.toLowerCase();

      if (lower.includes('learn') || lower.includes('study') || lower.includes('skill')) {
        responseType = 'learning';
        title = 'Education & Knowledge Track Generated';
        details = [
          'Deconstructed into 3 progressive milestones (Zero → Basic → Applied).',
          'Connected to meUus Learning Academy curriculum.',
          'Assigned offline-ready reflection prompts.',
        ];
        primaryAction = { text: 'Open Learning Track', href: '#education' };
      } else if (lower.includes('agent') || lower.includes('bot') || lower.includes('scout')) {
        responseType = 'agent';
        title = 'Autonomous Agent Blueprint Drafted';
        details = [
          `Purpose: "${input}"`,
          'Assigned Safety Boundary: Level 2 (Prepare but require user confirmation).',
          'Memory Scope: Session context only (Privacy-first).',
        ];
        primaryAction = { text: 'Review & Activate Agent', href: '#agents' };
      } else if (lower.includes('earn') || lower.includes('work') || lower.includes('business') || lower.includes('freelance')) {
        responseType = 'work';
        title = 'Economic Capability & Marketplace Mapping';
        details = [
          'Audited existing skills against market demand.',
          'Drafted portfolio structure and ethical service listing.',
          'Established zero-promise realistic expectation framework.',
        ];
        primaryAction = { text: 'View Marketplace Exchange', href: '#marketplace' };
      } else if (lower.includes('automate') || lower.includes('routine') || lower.includes('remind')) {
        responseType = 'automation';
        title = 'Automation Workflow Configured';
        details = [
          'Trigger: Event / Time schedule configured.',
          'Action: Local notification + report generation.',
          'Supervised under Human Approval rules.',
        ];
        primaryAction = { text: 'View Automation Supervisor', href: '#automations' };
      } else {
        responseType = 'dlas';
        title = 'Starting Point & DLAS Alignment';
        details = [
          'Interpreted core intent: understanding human current reality.',
          'Routed through R60A Ecosystem Algorithm Kernel.',
          'One truthful next step identified.',
        ];
        primaryAction = { text: 'Begin Human Journey', href: '#human-journey' };
      }

      setSystemResponse({
        input,
        type: responseType,
        title,
        details,
        primaryAction,
        timestamp: new Date().toLocaleTimeString(),
      });
      setIsProcessing(false);
    }, 600);
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim() || !newAgentPurpose.trim()) return;

    const created = offlineStorage.saveAgent({
      name: newAgentName.trim(),
      purpose: newAgentPurpose.trim(),
      approvalLevel: newAgentLevel,
      instructions: newAgentInstructions.trim() || 'Follow truthful, bounded guidance.',
      status: 'ACTIVE',
    });

    setAgents(offlineStorage.getAgents());
    setShowAgentModal(false);
    setNewAgentName('');
    setNewAgentPurpose('');
    setNewAgentInstructions('');
  };

  const samplePrompts = [
    '“I want to learn modern QA engineering.”',
    '“Build me a research agent that summarizes AI developments every Monday.”',
    '“Help me start earning by offering web services in Sylhet.”',
    '“Every Friday evening, remind me to review my development milestones.”',
  ];

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader
        icon={<Brain size={18} />}
        title="meYoo AI OS"
        subtitle="Personalized Intelligent Living Operating System for Daily Execution."
        badge="OS v1.0"
        breadcrumb="Intelligence"
      />
      <section id="meyoo-os" className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              meUus Universal Operating System · meYoo
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Human Development & Execution Command Center
            </h2>
            <p className="text-gray-600 text-sm max-w-2xl">
              One central intelligence interface connecting identity, memory, agents, projects, learning,
              marketplace, and autonomous workflows.
            </p>
          </div>

          {/* Online / Offline Status Badge */}
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${
              isOnline
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
              {isOnline ? 'Online · Cloud Synced' : 'Offline Mode · Local Storage Active'}
            </div>
            <button
              onClick={() => {
                const blob = new Blob([offlineStorage.exportAllUserData()], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `meuus-data-export-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
              }}
              title="Export all my local data (Ownership Principle)"
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition shadow-sm"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {[
            { id: 'chat', label: 'Universal Command (meYoo)', icon: Sparkles },
            { id: 'agents', label: `Agent Registry (${agents.length})`, icon: Bot },
            { id: 'automations', label: `Automations (${automations.length})`, icon: Zap },
            { id: 'studio', label: 'Creation Studio & Pipeline', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: Universal Command */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleIntentSubmit} className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800">
                  What are you trying to accomplish today?
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={intentInput}
                    onChange={(e) => setIntentInput(e.target.value)}
                    placeholder="Enter any goal, learning wish, creation request, agent prompt, or career objective..."
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-base leading-relaxed"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="absolute right-3 bottom-3 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {isProcessing ? 'Synthesizing...' : 'Transform Intent'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Sample Prompts */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Sample Intent Archetypes:
                </p>
                <div className="flex flex-wrap gap-2">
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setIntentInput(p.replace(/^[“"]|[”"]$/g, ''))}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition text-left"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Synthesized Output */}
            {systemResponse && (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50/60 p-6 space-y-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                      Execution Blueprint · {systemResponse.timestamp}
                    </span>
                    <h4 className="text-xl font-bold text-gray-900 mt-1">{systemResponse.title}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200">
                    Governed Plan
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  {systemResponse.details.map((d: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={systemResponse.primaryAction.href}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition inline-flex items-center gap-2 shadow-sm"
                  >
                    {systemResponse.primaryAction.text}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setSystemResponse(null)}
                    className="px-4 py-2.5 border border-gray-300 text-gray-600 hover:text-gray-900 rounded-xl text-sm transition bg-white"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Agent Registry */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Active Autonomous Agents</h3>
                <p className="text-gray-600 text-sm">
                  Personal and public agents bounded by strict Human Approval levels (L0 to L5).
                </p>
              </div>
              <button
                onClick={() => setShowAgentModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition inline-flex items-center gap-2 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                Build Custom Agent
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {agents.map((agent) => (
                <div key={agent.id} className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{agent.name}</h4>
                      <p className="text-gray-500 text-xs mt-0.5">{agent.purpose}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full border border-sky-200 bg-sky-50 text-sky-700 font-semibold font-mono">
                      {agent.approvalLevel}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 text-xs text-gray-700 font-mono space-y-1 border border-gray-200">
                    <p className="text-gray-500 font-sans text-[11px] uppercase tracking-wider font-semibold">Instructions:</p>
                    <p className="line-clamp-2">{agent.instructions}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                    <span>Runs: {agent.runCount}</span>
                    <span className="text-emerald-700 font-medium">Status: {agent.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Automations */}
        {activeTab === 'automations' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Continuous Automations Engine</h3>
              <p className="text-gray-600 text-sm">
                Event-driven and schedule-based recurring execution workflows with human safety gates.
              </p>
            </div>

            <div className="space-y-3">
              {automations.map((auto) => (
                <div key={auto.id} className="rounded-xl border border-gray-200 bg-white p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-semibold text-gray-900 text-sm">{auto.title}</h4>
                      {auto.approvalRequired && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
                          Human Review Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">
                      <span className="text-gray-400">Trigger:</span> {auto.trigger} → <span className="text-gray-400">Action:</span> {auto.action}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-mono">Last: {auto.lastRun?.slice(0, 10)}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold">
                      {auto.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Creation Studio */}
        {activeTab === 'studio' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Unified meUus Creation Studio</h3>
              <p className="text-gray-600 text-sm">
                Single asset pipeline turning concepts into written articles, social graphics, and educational guides.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Text & Editorial', desc: 'Articles, CVs, and proposals grounded in verified facts.', status: 'Ready' },
                { title: 'Visual & Graphic', desc: 'Social cards, presentation diagrams, and branding.', status: 'Canvas Ready' },
                { title: 'Video & Storyboard', desc: 'Multi-scene scripts with timing and narration directives.', status: 'Script Ready' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium inline-block">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agent Builder Modal */}
        {showAgentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900">Build a Governed Agent</h3>
              <p className="text-xs text-gray-600">
                Define an agent with explicit tool limits and human supervision boundaries.
              </p>

              <form onSubmit={handleCreateAgent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Agent Name</label>
                  <input
                    type="text"
                    required
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    placeholder="e.g. Legal Clause Scout"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Purpose</label>
                  <input
                    type="text"
                    required
                    value={newAgentPurpose}
                    onChange={(e) => setNewAgentPurpose(e.target.value)}
                    placeholder="e.g. Identify ambiguous terms in tenancy agreements"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Human Approval Level</label>
                  <select
                    value={newAgentLevel}
                    onChange={(e) => setNewAgentLevel(e.target.value as any)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="L0">L0 — Observe (Read-only)</option>
                    <option value="L1">L1 — Suggest (Proposes recommendations)</option>
                    <option value="L2">L2 — Prepare (Drafts actions for review)</option>
                    <option value="L3">L3 — Execute with Approval (User must confirm each action)</option>
                    <option value="L4">L4 — Limited Autonomy (Pre-approved bounds)</option>
                    <option value="L5">L5 — Autonomous Workflow (Strictly vetted)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Specific Instructions</label>
                  <textarea
                    rows={3}
                    value={newAgentInstructions}
                    onChange={(e) => setNewAgentInstructions(e.target.value)}
                    placeholder="Provide behavioral constraints and boundary instructions..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAgentModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm"
                  >
                    Save & Activate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
    </div>
  );
}
