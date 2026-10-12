/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ConnectedEcosystemHub — #TheLast&TheFirst#meUusConnected#
 * 
 * Manifests the 62-section Master Constitutional Charter:
 * - The Central Idea: Global Human Development Ecosystem (#AnyOneCan#)
 * - The Lineage: ME → U → US → meUus
 * - The Deepest Creation Pattern: 26-stage recursive loop culminating in JUSTICE FOR ALL
 * - The 10 Connected Layers: Language, Knowledge, Evidence, Memory, Learning, Creation, Profile, Opportunity, Value, AI
 * - The Hardest-User Test: Voice-first, Bengali typography, no literacy barrier
 * - Specialized AI Boundaries: MedicalAI ≠ Doctor, LegalAI ≠ Lawyer, MuslimAI ≠ Mufti, EmotionalAI ≠ Therapist
 * - Epistemic Status Discipline: DISCOVERED ≠ DESIGNED ≠ BUILT ≠ TESTED ≠ DEPLOYED ≠ PROVEN
 */

import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scale,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Mic,
  Brain,
  Cpu,
  Heart,
  Users,
  Compass,
  FileText,
  Key,
  Copy,
  Check,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Workflow,
  Globe2,
  Lock,
  RefreshCw,
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useEcosystem } from '../context/EcosystemContext';

// The 26-Step Deepest Creation Pattern
const CREATION_CYCLE = [
  { step: 1, name: 'Need / Experience', bangla: 'প্রয়োজন ও অনুভূতি', question: 'What real human struggle prompted this?' },
  { step: 2, name: 'Word', bangla: 'শব্দ', question: 'How is this expressed in human language?' },
  { step: 3, name: 'Meaning', bangla: 'অর্থ', question: 'What does this word actually signify?' },
  { step: 4, name: 'Understanding', bangla: 'উপলব্ধি', question: 'Has genuine comprehension taken root?' },
  { step: 5, name: 'Knowledge', bangla: 'জ্ঞান', question: 'Is this knowledge verified or merely information?' },
  { step: 6, name: 'Learning', bangla: 'শিক্ষা', question: 'How is capability developing through practice?' },
  { step: 7, name: 'Reflection', bangla: 'চিন্তা ও আত্মদর্শন', question: 'What did we discover about ourselves?' },
  { step: 8, name: 'Choice', bangla: 'নির্বাচন', question: 'Which path is chosen with intention?' },
  { step: 9, name: 'Action', bangla: 'পদক্ষেপ', question: 'Consistent honest action over perfection.' },
  { step: 10, name: 'Creation', bangla: 'সৃষ্টি / নির্মাণ', question: 'What new artifact or system exists now?' },
  { step: 11, name: 'Evidence', bangla: 'প্রমাণ', question: 'Claim ≤ Evidence: What facts support this?' },
  { step: 12, name: 'Consequence', bangla: 'ফলাফল', question: 'What changes in the real world as a result?' },
  { step: 13, name: 'Responsibility', bangla: 'দায়িত্ব', question: 'Who owns the human consequences?' },
  { step: 14, name: 'Rights', bangla: 'অধিকার', question: 'Whose inherent dignity must be protected?' },
  { step: 15, name: 'Relationship', bangla: 'সম্পর্ক', question: 'How does me connect with U to become us?' },
  { step: 16, name: 'Cooperation & Exchange', bangla: 'সহযোগিতা ও বিনিময়', question: 'Is the collaboration voluntary and fair?' },
  { step: 17, name: 'Accountability', bangla: 'জবাবদিহিতা', question: 'Are promises kept and harms accounted for?' },
  { step: 18, name: 'JUSTICE', bangla: 'ন্যায়বিচার (The Last & The First)', highlight: true, question: 'Is the innocent protected? Are rights honored?' },
  { step: 19, name: 'Trust', bangla: 'বিশ্বাস', question: 'Has truthful action earned enduring trust?' },
  { step: 20, name: 'Continuation', bangla: 'ধারাবাহিকতা', question: 'How does this work continue without degradation?' },
  { step: 21, name: 'New Learning', bangla: 'নতুন শিক্ষা', question: 'What deeper wisdom emerged from the cycle?' },
  { step: 22, name: 'New Creation', bangla: 'নতুন সৃষ্টি', question: 'The recursive pattern: creation inspires creation.' }
];

// The 10 Connected Layers
const CONNECTED_LAYERS = [
  {
    id: 1,
    title: 'Language Layer',
    bangla: 'ভাষা স্তর',
    summary: 'Words are human infrastructure. Not just UI, but meaning, contract, law, and agreement.',
    details: 'Supports voice-first interaction, clean English, and authentic Bengali typography. Language transforms raw intention into actionable understanding.',
    icon: FileText,
    accent: 'emerald',
    governingQuestion: 'Before producing words: Did understanding actually occur?'
  },
  {
    id: 2,
    title: 'Knowledge Layer',
    bangla: 'জ্ঞান স্তর',
    summary: 'Information is not automatically truth. Books, memories, experience structured into usable wisdom.',
    details: 'Ingests research, Quranic guidance, Seerah ethics, books, and lived experiences without confusing volume with truth.',
    icon: BookOpen,
    accent: 'amber',
    governingQuestion: 'Before accepting claims: What is the verifiable source?'
  },
  {
    id: 3,
    title: 'Evidence Layer',
    bangla: 'প্রমাণ স্তর',
    summary: 'Claim ≤ Evidence. The system must always be able to say: "Insufficient evidence."',
    details: 'Explicit 15-tag epistemic tracking (proven, source-supported, uncertain, disputed, local-only, not-yet-proven). No fabricated claims.',
    icon: ShieldCheck,
    accent: 'sky',
    governingQuestion: 'Before asserting: What concrete proof exists?'
  },
  {
    id: 4,
    title: 'Personal Memory Layer',
    bangla: 'ব্যক্তিগত স্মৃতি স্তর',
    summary: 'Governed open memory with consent, default privacy, inspection, and full deletion.',
    details: 'User owns 100% of their local data. 8 governed memory domains stored locally in browser with cryptographic export.',
    icon: Lock,
    accent: 'purple',
    governingQuestion: 'Before remembering: Did the human grant explicit consent?'
  },
  {
    id: 5,
    title: 'Learning Layer',
    bangla: 'শিক্ষা স্তর',
    summary: 'Longitudinal DLAS framework & skill graph. Capability over paper credentials.',
    details: 'Seven-step development loop (Assess → Understand → Plan → Act → Measure → Reflect → Grow) without reducing a human to a number.',
    icon: Compass,
    accent: 'teal',
    governingQuestion: 'Before grading: Does this nurture growth or label a human?'
  },
  {
    id: 6,
    title: 'Creation Layer',
    bangla: 'নির্মাণ স্তর',
    summary: '#AnyOneCanBuild#. Turning human intention into working systems, tools, apps, and code.',
    details: '15-stage build pipeline: Idea → Understand → Scope → Plan → Design → Build → Test → Verify → Deploy → Measure → Continue.',
    icon: Cpu,
    accent: 'emerald',
    governingQuestion: 'Before building: Who is affected and what could this cause?'
  },
  {
    id: 7,
    title: 'Profile / Proof Layer',
    bangla: 'প্রমাণিত প্রোফাইল স্তর',
    summary: 'Demonstrated work record. Learned → Attempted → Created → Tested → Improved → Published.',
    details: 'Replaces resume claims with verifiable evidence: git commits, DLAS reflections, deployed apps, and peer-reviewed services.',
    icon: Award,
    accent: 'amber',
    governingQuestion: 'Before boasting: Show the artifact and observed result.'
  },
  {
    id: 8,
    title: 'Opportunity Layer',
    bangla: 'সুযোগ স্তর',
    summary: 'Connecting proven capability to employment, freelancing, clients, and challenges.',
    details: 'Two-way economic marketplace where learners and creators are discovered based on factual proof rather than pedigree.',
    icon: Globe2,
    accent: 'sky',
    governingQuestion: 'Before selecting: Did everyone have legitimate access to begin?'
  },
  {
    id: 9,
    title: 'Value Distribution Layer',
    bangla: 'মূল্য বণ্টন স্তর',
    summary: 'Traceable creation and explainable distribution. Justice when money enters the system.',
    details: 'Transparent ledger: Customer payment → API costs → Platform fee → Creator share. No hidden extraction.',
    icon: Scale,
    accent: 'emerald',
    governingQuestion: 'Before distributing: Is the basis of reward legitimate and understood?'
  },
  {
    id: 10,
    title: 'AI Ecosystem Layer',
    bangla: 'কৃত্রিম বুদ্ধিমত্তা স্তর',
    summary: 'Multi-AI Orchestration & Agent Engine. AI is an amplifier, never human authority.',
    details: 'Connects Google Gemini, Claude, OpenAI, DeepSeek, and local open models. Automates execution, never responsibility.',
    icon: Brain,
    accent: 'cyan',
    governingQuestion: 'Before deploying AI: Who remains responsible for human outcomes?'
  }
];

// Specialized AI Boundaries
const AI_BOUNDARIES = [
  {
    pair: 'MedicalAI ≠ Doctor',
    bangla: 'চিকিৎসা এআই ≠ লাইসেন্সধারী ডাক্তার',
    role: 'Health education, symptom preparation & wellness tracking.',
    boundary: 'Never diagnoses illness or prescribes medication. Immediate triage to emergency care.',
    handoff: '15-Minute Crisis Protocol & Hospital Routing'
  },
  {
    pair: 'LegalAI ≠ Lawyer',
    bangla: 'আইন এআই ≠ সার্টিফাইড আইনজীবী',
    role: 'Legal rights literacy, document drafting & case chronology.',
    boundary: 'Never acts as legal counsel in court. All filings require certified attorney review.',
    handoff: 'Legal Aid Handoff & Bar Association Directory'
  },
  {
    pair: 'MuslimAI ≠ Mufti',
    bangla: 'মুসলিম এআই ≠ মুফতি বা শরিয়াহ বিচারক',
    role: 'Surfacing classical Quran, Hadith, and historical Seerah citations.',
    boundary: 'Never issues binding fatwas or excommunications. Contextual scholarly attribution.',
    handoff: 'Qualified Islamic Scholar & Council Consultation'
  },
  {
    pair: 'EmotionalAI ≠ Therapist',
    bangla: 'মানসিক এআই ≠ সাইকিয়াট্রিস্ট / থেরাপিস্ট',
    role: 'Reflective journaling, grounding pacer & emotional de-escalation.',
    boundary: 'Never diagnoses psychiatric conditions. Detects distress and triggers crisis hotline.',
    handoff: 'National Crisis Lifeline (988 / 999 BD) Direct Ping'
  }
];

export default function ConnectedEcosystemHub() {
  const { openAiGuide, sendIdeaToWorkstation } = useEcosystem();
  const [activeCycleStep, setActiveCycleStep] = useState<number>(18); // Default to JUSTICE
  const [activeLayerId, setActiveLayerId] = useState<number>(1);
  const [userInputIdea, setUserInputIdea] = useState('');
  const [simulatedPipeline, setSimulatedPipeline] = useState<string[] | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'pattern' | 'layers' | 'boundaries' | 'anyonecan'>('pattern');

  const CONTINUITY_KEY = `#TheLast&TheFirst#meUusConnected#
#AnyOneCan#
ME → U → US → meUus
WORD → UNDERSTANDING → LEARNING → REFLECTION → CHOICE → ACTION → CREATION → EVIDENCE → RESPONSIBILITY → RIGHTS → CONSEQUENCE → JUSTICE → CONTINUATION
AI → AGENTS → TOOLS → AUTOMATION → CREATION
IDEA → BUILD → TEST → PROVE → OPPORTUNITY → VALUE → CONTRIBUTION
JUSTICE FOR ALL
Claim ≤ Evidence`;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(CONTINUITY_KEY);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleSimulateIdea = (presetPrompt?: string) => {
    const text = presetPrompt || userInputIdea;
    if (!text.trim()) return;
    setUserInputIdea(text);
    setSimulatedPipeline([
      `1. IDEA: "${text}" captured via Hardest-User entry door.`,
      `2. UNDERSTAND: Resolving language and core human need.`,
      `3. LEARN: Identifying required skills & missing knowledge domains.`,
      `4. PLAN: Architecting minimal verifiable prototype (MVP).`,
      `5. AI ASSIST: Orchestrating Gemini & Claude reasoning models.`,
      `6. AGENTS: Launching autonomous Builder & QA agents under L2 human oversight.`,
      `7. BUILD: Generating clean, executable, zero-dependency source code.`,
      `8. TEST & VERIFY: Running automated test suite with evidence capture.`,
      `9. PUBLISH: Generating proof-backed capability record for personal profile.`,
      `10. JUSTICE: Ensuring attribution, safety boundaries, and community value.`
    ]);
  };

  const currentStep = CREATION_CYCLE.find(c => c.step === activeCycleStep) || CREATION_CYCLE[17];
  const currentLayer = CONNECTED_LAYERS.find(l => l.id === activeLayerId) || CONNECTED_LAYERS[0];

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader
        icon={<Sparkles size={18} />}
        title="#TheLast&TheFirst#"
        subtitle="Constitutional Core, 10 Connected Ecosystem Layers, and 7-Layer Execution Engine."
        badge="Charter"
        breadcrumb="Ecosystem"
      />
      <section id="connected-ecosystem" className="py-8 bg-gray-50 text-gray-900 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Canonical Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>#TheLast&TheFirst#meUusConnected#</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight">
            meUus Complete Connected Ecosystem
          </h1>
          
          <p className="text-lg md:text-xl text-emerald-600 font-mono font-medium">
            Human Development • Creation • AI • Agents • Automation • Knowledge • Opportunity • Justice
          </p>

          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A Global Human Development Ecosystem through which any person can understand, learn, create, build, contribute, connect, and continue, regardless of where they begin.
          </p>

          {/* Epistemic Status Discipline Badge */}
          <div className="pt-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 p-2.5 rounded-2xl bg-white border border-gray-200 shadow-sm text-xs font-mono text-gray-700">
              <span className="text-gray-500 font-bold">STATUS DISCIPLINE:</span>
              <span className="text-amber-600 font-bold">DISCOVERED</span>
              <span className="text-gray-400">≠</span>
              <span className="text-sky-600 font-bold">DESIGNED</span>
              <span className="text-gray-400">≠</span>
              <span className="text-emerald-600 font-bold">BUILT</span>
              <span className="text-gray-400">≠</span>
              <span className="text-teal-600 font-bold">TESTED</span>
              <span className="text-gray-400">≠</span>
              <span className="text-indigo-600 font-bold">DEPLOYED</span>
              <span className="text-gray-400">≠</span>
              <span className="text-emerald-700 font-bold">PROVEN</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-12 mb-8" role="tablist">
          <button
            onClick={() => setActiveTab('pattern')}
            role="tab"
            aria-selected={activeTab === 'pattern'}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pattern'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>26-Step Creation Cycle</span>
          </button>

          <button
            onClick={() => setActiveTab('layers')}
            role="tab"
            aria-selected={activeTab === 'layers'}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'layers'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>The 10 Connected Layers</span>
          </button>

          <button
            onClick={() => setActiveTab('anyonecan')}
            role="tab"
            aria-selected={activeTab === 'anyonecan'}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'anyonecan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>#AnyOneCan# Creation Loop</span>
          </button>

          <button
            onClick={() => setActiveTab('boundaries')}
            role="tab"
            aria-selected={activeTab === 'boundaries'}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'boundaries'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Specialized AI Boundaries</span>
          </button>
        </div>

        {/* Tab 1: 26-Step Deepest Creation Pattern */}
        {activeTab === 'pattern' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-emerald-600" />
                    <span>The Deepest Creation Pattern: From Need to Justice</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-mono mt-1">
                    Creation produces consequences → Consequences create responsibility → Responsibility reaches JUSTICE.
                  </p>
                </div>
                <div className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 w-fit">
                  Cycle Position: {activeCycleStep} / 22
                </div>
              </div>

              {/* Horizontal Stepper */}
              <div className="py-6 overflow-x-auto scrollbar-thin">
                <div className="flex gap-2 min-w-max pb-2">
                  {CREATION_CYCLE.map((item) => (
                    <button
                      key={item.step}
                      onClick={() => setActiveCycleStep(item.step)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono transition-all text-left flex flex-col gap-1 border ${
                        activeCycleStep === item.step
                          ? item.highlight
                            ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                            : 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : item.highlight
                          ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-[10px] opacity-75">Step {item.step}</span>
                      <span className="font-bold whitespace-nowrap">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Step Spotlight Card */}
              <div className={`p-6 rounded-2xl border transition-all ${
                currentStep.highlight 
                  ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50/30 border-amber-300 shadow-sm'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
                      Stage {currentStep.step} of 22
                    </span>
                    <h4 className="text-2xl font-serif font-bold text-gray-900 mt-1 flex items-center gap-2">
                      <span>{currentStep.name}</span>
                      <span className="text-sm font-sans text-gray-500 font-normal">({currentStep.bangla})</span>
                    </h4>
                  </div>
                  {currentStep.highlight && (
                    <div className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold w-fit">
                      THE LAST DISCOVERY → THE FIRST QUESTION
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs font-mono text-gray-500 uppercase tracking-wider">Governing Inquest:</div>
                  <div className="text-base sm:text-lg text-emerald-800 font-serif italic mt-1">
                    "{currentStep.question}"
                  </div>
                </div>

                {currentStep.highlight && (
                  <div className="mt-4 p-4 rounded-xl bg-white border border-amber-200 text-xs sm:text-sm text-gray-800 space-y-2 shadow-sm">
                    <p className="font-bold text-amber-800">
                      Working Definition of Justice for All:
                    </p>
                    <p className="leading-relaxed">
                      "Justice is not giving everyone the same outcome. Justice is giving every person their rightful protection, responsibility, opportunity, and consequence, while refusing to sacrifice the innocent for the powerful."
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: The 10 Connected Layers */}
        {activeTab === 'layers' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
            {/* Left Layer List */}
            <div className="lg:col-span-5 space-y-2">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-wider px-2 pb-2">
                Unified 10-Layer Architecture
              </div>
              {CONNECTED_LAYERS.map((layer) => {
                const Icon = layer.icon;
                const isSelected = activeLayerId === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-gray-900 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:text-emerald-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-mono text-gray-500">Layer {layer.id}</div>
                        <div className="font-bold text-sm text-gray-900">{layer.title}</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-emerald-600 translate-x-1' : 'text-gray-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Layer Detail Card */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 sticky top-24 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      {React.createElement(currentLayer.icon, { className: 'w-5 h-5' })}
                    </div>
                    <div>
                      <span className="text-xs font-mono text-emerald-700 uppercase font-bold">Layer {currentLayer.id} of 10</span>
                      <h3 className="text-2xl font-serif font-bold text-gray-900">{currentLayer.title}</h3>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{currentLayer.bangla}</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-mono text-gray-500 uppercase">Core Architecture</h5>
                    <p className="text-base text-gray-800 mt-1 leading-relaxed">{currentLayer.summary}</p>
                  </div>

                  <div>
                    <h5 className="text-xs font-mono text-gray-500 uppercase">Operating Principle</h5>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{currentLayer.details}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <span className="text-xs font-mono text-emerald-700 uppercase font-bold">Constitutional Inquest</span>
                    <p className="text-sm font-serif italic text-emerald-900 mt-1">"{currentLayer.governingQuestion}"</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-gray-500">
                    <span>Cross-cutting Governors:</span>
                    <span className="text-emerald-700 font-bold">Trust • Privacy • Safety • Continuity • Justice</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: #AnyOneCan# Creation Loop & Hardest-User Test */}
        {activeTab === 'anyonecan' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold uppercase mb-2">
                  <span>The Hardest-User Test</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900">
                  "No literacy level should be an unnecessary barrier to beginning."
                </h3>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                  Can someone who cannot read or write express a need, understand the response, learn, create, contribute, and continue? meUus supports voice-first audio, simple visual explanations, and local offline action.
                </p>
              </div>

              {/* Starter Door Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { text: 'I have an idea.', bangla: 'আমার একটি ধারণা আছে।' },
                  { text: 'I have a problem.', bangla: 'আমার একটি সমস্যা আছে।' },
                  { text: 'I want to learn this.', bangla: 'আমি এটা শিখতে চাই।' },
                  { text: "I don't understand.", bangla: 'আমি বুঝতে পারছি না।' }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSimulateIdea(item.text)}
                    className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all group"
                  >
                    <div className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      "{item.text}"
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{item.bangla}</div>
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={userInputIdea}
                    onChange={(e) => setUserInputIdea(e.target.value)}
                    placeholder="Type an intention or idea in English or বাংলা..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 font-mono shadow-sm"
                  />
                </div>
                <button
                  onClick={() => handleSimulateIdea()}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Reveal 15-Stage Pipeline</span>
                </button>
              </div>

              {/* Simulated Pipeline Results */}
              {simulatedPipeline && (
                <div className="p-6 rounded-2xl bg-gray-50 border border-emerald-300 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-emerald-800 font-bold">
                      15-Stage Build Pipeline Activated
                    </span>
                    <button
                      onClick={() => sendIdeaToWorkstation(userInputIdea)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Send to WorkStation</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-1.5 font-mono text-xs text-gray-700">
                    {simulatedPipeline.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Specialized AI Boundaries */}
        {activeTab === 'boundaries' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono font-bold uppercase mb-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>Constitutional Guardrail</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900">
                  Specialized AI Assistance Is Not Human Authority
                </h3>
                <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                  A specialized AI can support a domain without pretending to replace the qualified authority of that domain. meUus strictly enforces education, preparation, and safe handoff protocols.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AI_BOUNDARIES.map((item, index) => (
                  <div key={index} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-rose-700 font-mono">{item.pair}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">RESTRICTED L5</span>
                    </div>
                    <div className="text-xs text-gray-500 font-serif italic">{item.bangla}</div>
                    <div className="text-xs text-gray-700 leading-relaxed"><strong className="text-gray-900">Permitted Role:</strong> {item.role}</div>
                    <div className="text-xs text-gray-700 leading-relaxed"><strong className="text-rose-700">Strict Boundary:</strong> {item.boundary}</div>
                    <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-gray-500">Handoff Action:</span>
                      <span className="text-emerald-700 font-bold">{item.handoff}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* The Continuity Key Console */}
        <div className="mt-16 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Key className="w-6 h-6 text-amber-500" />
              <div>
                <h4 className="text-lg font-bold text-gray-900">The Constitutional Continuity Key</h4>
                <p className="text-xs text-gray-500 font-mono">If the entire ecosystem is ever lost, this minimal recovery key restores the canonical lineage.</p>
              </div>
            </div>
            <button
              onClick={handleCopyKey}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-mono font-bold transition-all flex items-center gap-2 w-fit border border-gray-300"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copied to Clipboard' : 'Copy Key'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-xs">
            {CONTINUITY_KEY}
          </pre>
        </div>

      </div>
    </section>
    </div>
  );
}
