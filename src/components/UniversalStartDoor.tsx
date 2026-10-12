import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Compass, 
  Briefcase, 
  Scale, 
  Heart, 
  Lightbulb, 
  Users, 
  Leaf, 
  RotateCcw, 
  CheckCircle2, 
  BookOpen, 
  Bot, 
  Loader2,
  HelpCircle,
  Cpu,
  Layers,
  Workflow,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReviewNotice from './ReviewNotice';
import { useEcosystem } from '../context/EcosystemContext';

interface CategoryPath {
  id: string;
  category: string;
  pillarId: string;
  title: string;
  suggestedAction: string;
  suggestedRoute: string;
  knowledgeModuleId?: string;
  nextQuestions: string[];
}

const CATEGORY_MAP: Record<string, CategoryPath> = {
  'work': {
    id: 'work',
    category: 'Need Work / Employment',
    pillarId: 'unemployment-buster',
    title: 'Career & Employment Pathway',
    suggestedAction: 'Map your core skills in your Master Soul and browse verified local SME opportunities or apprenticeship pathways.',
    suggestedRoute: '#marketplace',
    nextQuestions: [
      'What is your strongest practical skill?',
      'Are you looking for full-time, part-time, or freelance work?',
      'Do you need a modern CV audit or interview preparation?'
    ]
  },
  'business': {
    id: 'business',
    category: 'Start or Formalize a Business',
    pillarId: 'business-hub',
    title: 'SME Formalization & Growth Desk',
    suggestedAction: 'Access the step-by-step Trade License, e-TIN, and BIN guide, then create a distinct business profile.',
    suggestedRoute: '#workspace',
    knowledgeModuleId: 'k-05',
    nextQuestions: [
      'Is your business currently registered with your City Corporation or Pourashava?',
      'Do you need a standardized bookkeeping template?',
      'Are you seeking a partner, client, or physical resource?'
    ]
  },
  'legal': {
    id: 'legal',
    category: 'Legal Query or Dispute',
    pillarId: 'legal-hub',
    title: 'Legal Literacy & Document Triage',
    suggestedAction: 'Review the relevant statutory literacy module or request a manual triage consultation with a partner attorney.',
    suggestedRoute: '#pillars',
    nextQuestions: [
      'Is this regarding land/tenancy, family, labour, or business contracts?',
      'Do you have existing documentation or written notices?',
      'Is this an urgent deadline or a preventive review?'
    ]
  },
  'help': {
    id: 'help',
    category: 'Need Emotional or Personal Support',
    pillarId: 'mind-beautifier',
    title: 'Mind & Reflection Sanctuary',
    suggestedAction: 'Engage with a gentle 5-minute DLAS developmental reflection or request a private referral to a verified counselling clinic.',
    suggestedRoute: '#wellness',
    nextQuestions: [
      'Would you like to write a private reflection first?',
      'Are you seeking family harmony or individual mental balance?',
      'Would you like to connect with a certified mental health professional?'
    ]
  },
  'skill': {
    id: 'skill',
    category: 'Have a Skill to Provide',
    pillarId: 'unemployment-buster',
    title: 'Skill Marketplace & Capacity Listing',
    suggestedAction: 'Publish your capacity on the Two-Way Marketplace so local projects and businesses can discover and contact you.',
    suggestedRoute: '#marketplace',
    nextQuestions: [
      'What service or product can you reliably deliver?',
      'What is your district or service radius in Bangladesh?',
      'Would you like to mentor an apprentice or collaborate on a project?'
    ]
  },
  'idea': {
    id: 'idea',
    category: 'Have an Idea to Validate',
    pillarId: 'idea-lab',
    title: 'Disciplined Idea Lab Validation',
    suggestedAction: 'Document your core problem hypothesis using the Idea Canvas and pass the Claim ≤ Evidence gate check.',
    suggestedRoute: '#workstation',
    nextQuestions: [
      'Who is the specific human being experiencing this problem?',
      'What evidence exists that they actively seek a solution today?',
      'What is the smallest honest pilot test you can run in 7 days?'
    ]
  },
  'land': {
    id: 'land',
    category: 'Land or Resource to Share',
    pillarId: 'green-solutions',
    title: 'Sustainable Resource Exchange',
    suggestedAction: 'List your available land or equipment for sustainable organic farming or solar micro-generation on an equitable profit-share model.',
    suggestedRoute: '#marketplace',
    nextQuestions: [
      'Where is the land located (district/upazila)?',
      'What agricultural or green energy use is permissible?',
      'Are you interested in a profit-share partnership or cooperative model?'
    ]
  },
  'learn': {
    id: 'learn',
    category: 'Seek Knowledge & Grounding',
    pillarId: 'alive-bangladesh',
    title: 'meUus Knowledge & Learning Home',
    suggestedAction: 'Explore canonical readings (Be — The Starting Point, Qur\'an/Seerah journeys, developmental literacy).',
    suggestedRoute: '#soul-journeys',
    knowledgeModuleId: 'k-01',
    nextQuestions: [
      'Are you exploring foundational ethics, civic literacy, or practical skills?',
      'Would you like to study with structured reflection check-ins?',
      'Are you participating in a local study circle?'
    ]
  }
};

const SUGGESTED_ONE_WORDS = [
  'I need work',
  'I have a skill',
  'I want to start a business',
  'I need legal support',
  'I feel stuck',
  'I have an idea',
  'I have land to share',
  'I want to learn'
];

export default function UniversalStartDoor() {
  const { openAiGuide, logAction, sendIdeaToWorkstation } = useEcosystem();

  const [inputText, setInputText] = useState('');
  const [matchedPath, setMatchedPath] = useState<CategoryPath | null>(null);
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('meuus_start_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const analyzeIntent = (text: string) => {
    const lower = text.toLowerCase().trim();
    if (!lower) {
      setMatchedPath(null);
      return;
    }

    if (lower.includes('work') || lower.includes('job') || lower.includes('unemployed') || lower.includes('cv') || lower.includes('career')) {
      setMatchedPath(CATEGORY_MAP['work']);
    } else if (lower.includes('business') || lower.includes('sme') || lower.includes('shop') || lower.includes('tin') || lower.includes('trade license') || lower.includes('sell')) {
      setMatchedPath(CATEGORY_MAP['business']);
    } else if (lower.includes('legal') || lower.includes('court') || lower.includes('lawyer') || lower.includes('dispute') || lower.includes('tenant') || lower.includes('contract')) {
      setMatchedPath(CATEGORY_MAP['legal']);
    } else if (lower.includes('help') || lower.includes('stuck') || lower.includes('sad') || lower.includes('anxious') || lower.includes('stress') || lower.includes('mind') || lower.includes('counsel')) {
      setMatchedPath(CATEGORY_MAP['help']);
    } else if (lower.includes('skill') || lower.includes('can do') || lower.includes('service') || lower.includes('offer') || lower.includes('developer') || lower.includes('designer')) {
      setMatchedPath(CATEGORY_MAP['skill']);
    } else if (lower.includes('idea') || lower.includes('project') || lower.includes('startup') || lower.includes('innovate')) {
      setMatchedPath(CATEGORY_MAP['idea']);
    } else if (lower.includes('land') || lower.includes('solar') || lower.includes('green') || lower.includes('farm') || lower.includes('resource')) {
      setMatchedPath(CATEGORY_MAP['land']);
    } else if (lower.includes('learn') || lower.includes('read') || lower.includes('quran') || lower.includes('seerah') || lower.includes('study')) {
      setMatchedPath(CATEGORY_MAP['learn']);
    } else {
      setMatchedPath({
        id: 'general-start',
        category: 'Universal Human Starting Point',
        pillarId: 'mind-beautifier',
        title: 'Step 1: Ground Yourself & Reflect',
        suggestedAction: 'Take a deep breath. Begin by capturing your reality in your Master Soul profile or writing one honest journal entry.',
        suggestedRoute: '#soul',
        nextQuestions: [
          'What is one honest fact about where you stand today?',
          'What is one small burden you want to resolve this week?',
          'Would you like to browse the Nine Pillars for specific support?'
        ]
      });
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setInputText(prompt);
    analyzeIntent(prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    analyzeIntent(inputText);
    
    // Save to local history
    const updated = [inputText, ...history.filter(h => h !== inputText)].slice(0, 5);
    setHistory(updated);
    localStorage.setItem('meuus_start_history', JSON.stringify(updated));

    // Log to Ecosystem
    logAction({
      hubId: 'start-door',
      title: `Intention: "${inputText}"`,
      category: 'sprint',
      status: 'completed',
      metadata: { input: inputText }
    });
  };

  const handleClear = () => {
    setInputText('');
    setMatchedPath(null);
  };

  return (
    <div id="start" className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        icon={<Zap size={18} />}
        title="Universal Start Door"
        subtitle="Single Point of Entry for Every Human Being, Regardless of Background."
        badge="Core Portal"
        breadcrumb="Start"
      />
      <div className="py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-4">
            Universal Start Door · Deterministic & Fast
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight mb-4">
            Start with one word or one sentence.
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            You do not need to understand all of meUus before taking your first step. Express where you are right now, and the system will route you to a truthful next action.
          </p>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="mb-6 relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                analyzeIntent(e.target.value);
              }}
              placeholder="e.g. 'I need work', 'I want to register an SME', 'I feel overwhelmed'..."
              className="w-full pl-6 pr-32 py-5 rounded-3xl bg-white border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-gray-900 placeholder:text-gray-400 text-base md:text-lg transition-all outline-none shadow-sm"
            />
            <div className="absolute right-3 flex items-center gap-2">
              {inputText && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-200/50"
                  title="Clear input"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <Button 
                type="submit"
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-5 py-6 font-semibold"
              >
                Start <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </form>

        {/* Suggested Quick Starts */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-gray-400 font-mono mr-1">Try one:</span>
          {SUGGESTED_ONE_WORDS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPrompt(prompt)}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-gray-200 text-xs text-gray-700 hover:text-emerald-800 transition-all cursor-pointer shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Matched Outcome & Next Step */}
        {matchedPath && (
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-emerald-200 shadow-md transition-all animate-fadeIn space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800 text-[10px] font-mono uppercase mb-1">
                    {matchedPath.category}
                  </Badge>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900">
                    {matchedPath.title}
                  </h3>
                </div>
              </div>

              <a
                href={matchedPath.suggestedRoute}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md"
              >
                <span>Take This Step</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-bold">
                  Suggested Action:
                </h4>
                <p className="text-sm md:text-base text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  {matchedPath.suggestedAction}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2 font-bold">
                  Clarifying Questions to Reflect On:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {matchedPath.nextQuestions.map((q, qIdx) => (
                    <div 
                      key={qIdx}
                      className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 flex items-start gap-2 shadow-xs"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cross-Hub Linkage Dispatchers */}
              <div className="pt-3 border-t border-gray-300/60">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 block mb-2 font-bold">
                  Ecosystem Cross-Connections:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => openAiGuide(`I entered "${inputText || matchedPath.category}" in the Start Door. How should I navigate this step in meUus?`)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 hover:border-emerald-500/60 text-xs text-gray-800 hover:text-emerald-700 font-mono flex items-center gap-1.5 transition"
                  >
                    <Bot className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ask Gemini Guide</span>
                  </button>

                  <a
                    href="#dashboard"
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 hover:border-teal-500/60 text-xs text-gray-800 hover:text-teal-300 font-mono flex items-center gap-1.5 transition"
                  >
                    <Workflow className="w-3.5 h-3.5 text-teal-400" />
                    <span>Start 7-Day Sprint</span>
                  </a>

                  <a
                    href="#soul"
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 hover:border-purple-500/60 text-xs text-gray-800 hover:text-purple-300 font-mono flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Log to Master Soul</span>
                  </a>

                  {inputText && (
                    <button
                      type="button"
                      onClick={() => sendIdeaToWorkstation(`Automate or build a prototype for: "${inputText}"`)}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 hover:border-amber-500/60 text-xs text-gray-800 hover:text-amber-300 font-mono flex items-center gap-1.5 transition"
                    >
                      <Cpu className="w-3.5 h-3.5 text-amber-400" />
                      <span>Send to WorkStation Pipeline</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-300/60 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 font-mono">
              <span>Non-AI Fallback: Deterministic Rule Matrix Verified</span>
              <span>Claim ≤ Evidence Discipline Active</span>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
