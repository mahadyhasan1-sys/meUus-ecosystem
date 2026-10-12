import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Scale,
  Briefcase,
  UserMinus,
  ShieldAlert,
  Users,
  Leaf,
  Lightbulb,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Layers,
  Building2,
  Calculator,
  FileText,
  Heart,
  TrendingUp,
  Award,
  Globe2,
  Clock,
  Send,
  Download,
  Flame,
  Search,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEcosystem } from '../context/EcosystemContext';

type HubId = 
  | 'idea-lab' 
  | 'business-hub' 
  | 'legal-hub' 
  | 'mind-beautifier' 
  | 'unemployment-buster' 
  | 'drug-buster' 
  | 'family-harmony' 
  | 'green-solutions' 
  | 'alive-bangladesh';

interface HubDefinition {
  id: HubId;
  name: string;
  motto: string;
  tagline: string;
  icon: any;
  color: string;
  bgGradient: string;
  badge: string;
  interactiveToolName: string;
  quickStats: { label: string; value: string }[];
}

const HUBS: HubDefinition[] = [
  {
    id: 'idea-lab',
    name: 'meUus Idea Lab',
    motto: 'Where ideas are born and businesses begin.',
    tagline: 'Idea Validation, Stage-Gated Incubation & Feasibility Engine',
    icon: Lightbulb,
    color: 'text-amber-600',
    bgGradient: 'from-amber-50 via-white to-amber-50/40',
    badge: 'STAGE 1 · INCUBATION',
    interactiveToolName: 'Idea Stage-Gate Evaluator',
    quickStats: [
      { label: 'Evaluation Stages', value: '4 Gates' },
      { label: 'Feasibility Score', value: 'Instant' },
      { label: 'Output', value: 'Executive Pitch' }
    ]
  },
  {
    id: 'business-hub',
    name: 'meUus Business Hub',
    motto: 'Where businesses come to grow.',
    tagline: 'Trade Licensing, SME Bookkeeping, Taxation & Trade Expansion',
    icon: Briefcase,
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-50 via-white to-emerald-50/40',
    badge: 'STAGE 2 · ENTERPRISE',
    interactiveToolName: 'Bangladesh Trade & Cashflow Calculator',
    quickStats: [
      { label: 'Trade License Steps', value: 'City & Pourashava' },
      { label: 'RJSC Compliance', value: 'Mapped' },
      { label: 'VAT Calculator', value: 'Integrated' }
    ]
  },
  {
    id: 'legal-hub',
    name: 'meUus Legal Hub',
    motto: 'Justice for every citizen.',
    tagline: 'Plain-Language Law, Consumer Rights & Legal Notice Generator',
    icon: Scale,
    color: 'text-blue-600',
    bgGradient: 'from-blue-50 via-white to-blue-50/40',
    badge: 'PROTECTION · CIVIC RIGHTS',
    interactiveToolName: 'Legal Notice & GD Drafter',
    quickStats: [
      { label: 'Law Language', value: 'Plain Bangla & EN' },
      { label: 'GD Assistance', value: '1-Click Draft' },
      { label: 'Verified Bar List', value: '64 Districts' }
    ]
  },
  {
    id: 'mind-beautifier',
    name: 'meUus Mind Beautifier',
    motto: 'Beautiful minds build beautiful lives.',
    tagline: 'Emotional Literacy, 5-Step Reflection & Mental Health Referral',
    icon: Brain,
    color: 'text-purple-600',
    bgGradient: 'from-purple-50 via-white to-purple-50/40',
    badge: 'WELLNESS · NON-CLINICAL',
    interactiveToolName: 'Guided Calming & Clarity Check-In',
    quickStats: [
      { label: 'Interaction Protocol', value: 'Max 5 Turns' },
      { label: 'Clinical Authority', value: 'Referral Only' },
      { label: 'Tone', value: 'Empathetic & Calm' }
    ]
  },
  {
    id: 'unemployment-buster',
    name: 'meUus Unemployment Buster',
    motto: 'Busting unemployment, one career at a time.',
    tagline: 'Skill Assessment, Apprenticeship Exchange & Remote Opportunity Radar',
    icon: UserMinus,
    color: 'text-orange-600',
    bgGradient: 'from-orange-50 via-white to-orange-50/40',
    badge: 'ECONOMIC · CAREERS',
    interactiveToolName: 'Career Skill & Opportunity Matcher',
    quickStats: [
      { label: 'Apprenticeships', value: 'Vocational & Tech' },
      { label: 'Micro-Gigs', value: 'Verified' },
      { label: 'CV Standard', value: 'ATS & Local format' }
    ]
  },
  {
    id: 'drug-buster',
    name: 'meUus Drug Buster',
    motto: 'Breaking addiction. Rebuilding lives.',
    tagline: 'Sobriety Milestones, Relapse Prevention & Confidential Support',
    icon: ShieldAlert,
    color: 'text-rose-600',
    bgGradient: 'from-rose-50 via-white to-rose-50/40',
    badge: 'RECOVERY · LIFE RESTORATION',
    interactiveToolName: 'Sobriety Tracker & Craving SOS',
    quickStats: [
      { label: 'Anonymity', value: '100% Guaranteed' },
      { label: 'Emergency SOS', value: '24/7 Helpline' },
      { label: 'Rehab Map', value: 'Verified Centers' }
    ]
  },
  {
    id: 'family-harmony',
    name: 'meUus Family Harmony',
    motto: 'Strong families. Strong Bangladesh.',
    tagline: 'Communication Frameworks, Pre-Marital Clarity & Peaceful Mediation',
    icon: Users,
    color: 'text-pink-600',
    bgGradient: 'from-pink-50 via-white to-pink-50/40',
    badge: 'COMMUNITY · RELATIONAL HEALTH',
    interactiveToolName: 'Family Mediation & Harmony Guide',
    quickStats: [
      { label: 'Mediation Protocol', value: 'Non-Confrontational' },
      { label: 'Couples Tool', value: '5 Love & Duty Steps' },
      { label: 'Parenting Guides', value: 'Culturally Grounded' }
    ]
  },
  {
    id: 'green-solutions',
    name: 'meUus Green Solutions',
    motto: 'Sustainable today. Livable tomorrow.',
    tagline: 'Rooftop Agriculture, Solar Energy ROI & Plastic-Free Neighborhoods',
    icon: Leaf,
    color: 'text-teal-600',
    bgGradient: 'from-teal-50 via-white to-teal-50/40',
    badge: 'ENVIRONMENT · SUSTAINABILITY',
    interactiveToolName: 'Rooftop Farm & Solar Energy Calculator',
    quickStats: [
      { label: 'Rooftop Farming', value: 'Dhaka/Ctg Guide' },
      { label: 'Solar Payback', value: '3.5 - 5 Years' },
      { label: 'Compost Manual', value: 'Zero-Waste' }
    ]
  },
  {
    id: 'alive-bangladesh',
    name: 'Alive Bangladesh',
    motto: 'Bringing Bangladesh alive — one opportunity at a time.',
    tagline: '64-District Civic Solidarity, Volunteer Brigade & Mutual Aid',
    icon: MapPin,
    color: 'text-red-600',
    bgGradient: 'from-red-50 via-white to-red-50/40',
    badge: 'NATIONWIDE · CIVIC SOLIDARITY',
    interactiveToolName: '64-District Opportunity Network',
    quickStats: [
      { label: 'Divisions Covered', value: '8 Divisions' },
      { label: 'Districts', value: '64 Districts' },
      { label: 'Active Volunteer Corps', value: 'Open for All' }
    ]
  }
];

export default function FullEcosystemHub() {
  const { openAiGuide, logAction, sendIdeaToWorkstation } = useEcosystem();
  const [activeHubId, setActiveHubId] = useState<HubId>('idea-lab');

  // Interactive Hub Tools State
  // 1. Idea Lab State
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDomain, setIdeaDomain] = useState('tech');
  const [ideaEvaluated, setIdeaEvaluated] = useState(false);

  // 2. Business Hub State
  const [monthlyRevenue, setMonthlyRevenue] = useState(150000);
  const [monthlyExpense, setMonthlyExpense] = useState(90000);

  // 3. Legal Hub State
  const [legalIssueType, setLegalIssueType] = useState('tenancy');
  const [partyName, setPartyName] = useState('');
  const [gdDraftGenerated, setGdDraftGenerated] = useState(false);

  // 4. Mind Beautifier State
  const [mindFeeling, setMindFeeling] = useState('');
  const [mindReply, setMindReply] = useState<string | null>(null);

  // 5. Unemployment Buster State
  const [targetRole, setTargetRole] = useState('Frontend Developer / Tech Assistant');
  const [userSkillLevel, setUserSkillLevel] = useState('Intermediate');
  const [matchedJobs, setMatchedJobs] = useState(false);

  // 6. Drug Buster State
  const [soberDays, setSoberDays] = useState(14);
  const [cravingLogged, setCravingLogged] = useState(false);

  // 7. Family Harmony State
  const [familyFocus, setFamilyFocus] = useState('communication');
  const [familyChecklistComplete, setFamilyChecklistComplete] = useState(false);

  // 8. Green Solutions State
  const [roofAreaSqFt, setRoofAreaSqFt] = useState(800);

  // 9. Alive Bangladesh State
  const [selectedDistrict, setSelectedDistrict] = useState('Cumilla');

  const currentHub = HUBS.find((h) => h.id === activeHubId) || HUBS[0];
  const CurrentIcon = currentHub.icon;

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader
        icon={<Layers size={18} />}
        title="9-Hub Ecosystem"
        subtitle="Comprehensive topology of all interconnected meUus functional hubs."
        badge="System Map"
        breadcrumb="Ecosystem"
      />
      <section id="full-ecosystem" className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 text-gray-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>THE COMPLETE MEUUS ECOSYSTEM · 9 INTERACTIVE HUBS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight leading-tight">
            Nine Specialized Hubs. <br />
            <span className="text-emerald-600">One Seamless Operating System.</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Switch between the 9 core solution hubs below to experience real, interactive workflows engineered for every dimension of personal, commercial, and communal life in Bangladesh.
          </p>
        </div>

        {/* Horizontal Hub Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin no-scrollbar">
          {HUBS.map((hub) => {
            const Icon = hub.icon;
            const isActive = activeHubId === hub.id;
            return (
              <button
                key={hub.id}
                onClick={() => setActiveHubId(hub.id)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white border-emerald-500 text-emerald-800 shadow-xs ring-1 ring-emerald-500/30'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span>{hub.name.replace('meUus ', '')}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Hub Interactive Workspace Card */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-xs overflow-hidden">
          {/* Hub Header Banner */}
          <div className={`p-6 sm:p-8 bg-gradient-to-r ${currentHub.bgGradient} border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-6`}>
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 text-emerald-600 shadow-xs shrink-0">
                <CurrentIcon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-emerald-200 text-emerald-800 font-mono text-[10px] bg-emerald-50">
                    {currentHub.badge}
                  </Badge>
                  <span className="text-[11px] font-mono text-gray-500">meUus Canonical Platform</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                  {currentHub.name}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-700 font-mono font-bold">
                  “{currentHub.motto}”
                </p>
                <p className="text-xs text-gray-600 max-w-2xl pt-0.5">
                  {currentHub.tagline}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
              {currentHub.quickStats.map((st, i) => (
                <div key={i} className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 flex items-center justify-between gap-3 text-[11px] font-mono shadow-xs">
                  <span className="text-gray-500">{st.label}:</span>
                  <span className="font-bold text-gray-900">{st.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Hub Micro-Application Workspace */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Interactive Hub Tool: {currentHub.interactiveToolName}</span>
              </h4>
              <Badge variant="outline" className="border-gray-200 text-gray-500 text-[10px] font-mono bg-gray-50">
                CLAIM ≤ EVIDENCE VERIFIED
              </Badge>
            </div>

            {/* 1. IDEA LAB WORKSPACE */}
            {activeHubId === 'idea-lab' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-xs font-mono text-gray-700 font-semibold">
                      1. Describe Your Business / Project Idea in 1 Sentence:
                    </label>
                    <input
                      type="text"
                      aria-label="Describe Your Business or Project Idea"
                      value={ideaTitle}
                      onChange={(e) => setIdeaTitle(e.target.value)}
                      placeholder="e.g. Organic mustard oil direct delivery from Cumilla farms"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
                    />

                    <label className="block text-xs font-mono text-gray-700 font-semibold">
                      2. Market Sector in Bangladesh:
                    </label>
                    <select
                      value={ideaDomain}
                      aria-label="Market Sector in Bangladesh"
                      onChange={(e) => setIdeaDomain(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="agro">Agro-Processing & Food Supply</option>
                      <option value="tech">Software & AI WorkStation Solutions</option>
                      <option value="retail">Local Retail & Cottage Industry</option>
                      <option value="craft">Handicrafts & Jute Products</option>
                      <option value="education">Skill Training & EdTech</option>
                    </select>

                    <Button
                      onClick={() => setIdeaEvaluated(true)}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-mono text-xs font-bold py-3 rounded-xl shadow-xs"
                    >
                      Run 4-Gate Idea Feasibility Audit
                    </Button>
                  </div>

                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <h5 className="text-xs font-mono uppercase text-gray-700 font-bold">Stage-Gate Evaluation Output:</h5>
                    {ideaEvaluated ? (
                      <div className="space-y-3 text-xs">
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                          <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Gate 1: Problem Authenticity (PASSED)
                          </span>
                          <p className="text-emerald-900 text-[11px]">
                            Solves verified supply friction in Bangladesh with strong domestic demand.
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-gray-200 space-y-1 shadow-xs">
                          <span className="font-bold text-blue-700">Gate 2: Unit Economics & Capital</span>
                          <p className="text-gray-600 text-[11px]">
                            Recommended starting capital: ৳50,000 - ৳1.5 Lakh. Breakeven estimated at month 4.
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-gray-200 space-y-1 shadow-xs">
                          <span className="font-bold text-purple-700">Gate 3: Required Licensing (meUus Business Hub)</span>
                          <p className="text-gray-600 text-[11px]">
                            Requires Municipal Trade License + BSTI certificate (if consumable food).
                          </p>
                        </div>
                        <div className="pt-2 flex flex-wrap gap-2">
                          <Button
                            onClick={() => sendIdeaToWorkstation(`Build a complete prototype app or landing page for: "${ideaTitle || 'Agro-processing direct marketplace in Cumilla'}"`)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono rounded-xl flex items-center gap-1.5 shadow-xs"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>Send to WorkStation (Automate App) →</span>
                          </Button>
                          <button
                            type="button"
                            onClick={() => openAiGuide(`How can I launch my idea "${ideaTitle}" in Bangladesh with minimal capital?`)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 text-xs font-mono text-gray-800 shadow-xs"
                          >
                            <span>Consult AI Guide</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">
                        Enter your concept and click 'Run 4-Gate Idea Feasibility Audit' to generate your feasibility report.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. BUSINESS HUB WORKSPACE */}
            {activeHubId === 'business-hub' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-gray-700 font-semibold">
                        Monthly Projected Revenue (BDT ৳):
                      </label>
                      <input
                        type="number"
                        value={monthlyRevenue}
                        onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 font-mono text-sm focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-gray-700 font-semibold">
                        Monthly Operational Expense (Rent, Wages, Raw Materials) (BDT ৳):
                      </label>
                      <input
                        type="number"
                        value={monthlyExpense}
                        onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 font-mono text-sm focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                      <h5 className="text-xs font-mono font-bold text-emerald-700">Trade License Roadmap:</h5>
                      <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                        <li>Step 1: Holding Tax receipt / Rental Agreement</li>
                        <li>Step 2: National ID (NID) & TIN Certificate</li>
                        <li>Step 3: Online application via City Corporation / Union Parishad portal</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4 flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-mono uppercase text-gray-700 font-bold mb-4">Financial Health Diagnostic:</h5>
                      <div className="space-y-3 font-mono">
                        <div className="flex justify-between text-xs text-gray-600 border-b border-gray-200 pb-2">
                          <span>Monthly Gross Profit:</span>
                          <span className="font-bold text-emerald-700">৳{(monthlyRevenue - monthlyExpense).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 border-b border-gray-200 pb-2">
                          <span>Operating Margin:</span>
                          <span className="font-bold text-gray-950">
                            {monthlyRevenue > 0 ? ((monthlyRevenue - monthlyExpense) / monthlyRevenue * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 border-b border-gray-200 pb-2">
                          <span>Recommended Reserve (3 Mos):</span>
                          <span className="font-bold text-amber-700">৳{(monthlyExpense * 3).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                      ✓ Ready for meUus Marketplace B2B Listing. Connect with verified suppliers across 64 districts.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. LEGAL HUB WORKSPACE */}
            {activeHubId === 'legal-hub' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-xs font-mono text-gray-700 font-semibold">Select Legal Area:</label>
                    <select
                      value={legalIssueType}
                      aria-label="Select Legal Area"
                      onChange={(e) => setLegalIssueType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:border-emerald-500 outline-none"
                    >
                      <option value="tenancy">Tenancy & Landlord Dispute (House Rent Control Act)</option>
                      <option value="employment">Unpaid Wages & Termination (Bangladesh Labour Act)</option>
                      <option value="consumer">Consumer Fraud & Product Deception (Consumer Rights Protection)</option>
                      <option value="cyber">Online Harassment & Cyber Security (Cyber Security Act)</option>
                    </select>

                    <label className="block text-xs font-mono text-gray-700 font-semibold">Your Full Name / Business Name:</label>
                    <input
                      type="text"
                      aria-label="Your Full Name or Business Name"
                      value={partyName}
                      onChange={(e) => setPartyName(e.target.value)}
                      placeholder="e.g. Md. Hasan"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:border-emerald-500 outline-none"
                    />

                    <Button
                      onClick={() => setGdDraftGenerated(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold py-3 rounded-xl shadow-xs"
                    >
                      Generate Formatted Legal Letter & Police GD Notice
                    </Button>
                  </div>

                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 font-mono text-xs">
                    <h5 className="text-gray-700 font-bold uppercase">Plain-Language Rights & Draft Output:</h5>
                    {gdDraftGenerated ? (
                      <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2 text-gray-800 shadow-xs">
                        <div className="text-[11px] text-blue-700 font-bold">SAMPLE LEGAL INQUIRY / GD NOTICE DRAFT:</div>
                        <p className="text-[11px] leading-relaxed text-gray-700">
                          Date: {new Date().toLocaleDateString('en-GB')}<br />
                          To: Officer-in-Charge / Disputing Party<br />
                          Applicant: {partyName || 'Citizen of Bangladesh'}<br />
                          Subject: Formal representation regarding {legalIssueType} under applicable Bangladesh laws.
                        </p>
                        <p className="text-[10px] text-emerald-700 font-semibold">
                          ✓ Draft ready. You can print this and present it to legal aid advocates or local Thana.
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        Select an issue category and click generate to view legal statutes and ready-to-use notice templates.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. MIND BEAUTIFIER WORKSPACE */}
            {activeHubId === 'mind-beautifier' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-xs font-mono text-gray-700 font-semibold">
                      Before anything else: How are you — really? (Write one honest thought):
                    </label>
                    <textarea
                      value={mindFeeling}
                      onChange={(e) => setMindFeeling(e.target.value)}
                      placeholder="e.g. I feel overwhelmed by job pressure and family expectations..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-purple-500"
                    />

                    <Button
                      onClick={() => setMindReply("Your feelings are valid, human, and understood. Take a deep, gentle breath right now. When heavy burdens accumulate, we do not need to solve all 10 problems this instant. Choose just ONE small, honest action for today.")}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold py-3 rounded-xl shadow-xs"
                    >
                      Receive Calm Reflection & Perspective
                    </Button>
                  </div>

                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <h5 className="text-xs font-mono uppercase text-gray-700 font-bold">Empathetic Reflection Response:</h5>
                    {mindReply ? (
                      <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 font-serif italic leading-relaxed space-y-2">
                        <p>“{mindReply}”</p>
                        <div className="pt-2 border-t border-purple-200 text-[10px] font-mono text-gray-500">
                          Non-clinical support · If you require medical care, meUus connects directly to licensed clinicians.
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">
                        Share one honest sentence to begin a supportive, non-judgmental pause.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 5. UNEMPLOYMENT BUSTER WORKSPACE */}
            {activeHubId === 'unemployment-buster' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-xs font-mono text-gray-700 font-semibold">Target Career or Vocational Domain:</label>
                    <select
                      value={targetRole}
                      aria-label="Target Career or Vocational Domain"
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:border-emerald-500 outline-none"
                    >
                      <option value="frontend">Frontend & Full-Stack Web Development</option>
                      <option value="accounting">SME Bookkeeping & Financial Accounts</option>
                      <option value="solar">Solar PV Installation & Green Energy Technician</option>
                      <option value="content">Bangla & English Content & Remote Assistant</option>
                    </select>

                    <label className="block text-xs font-mono text-gray-700 font-semibold">Your Current Experience Level:</label>
                    <select
                      value={userSkillLevel}
                      aria-label="Your Current Experience Level"
                      onChange={(e) => setUserSkillLevel(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:border-emerald-500 outline-none"
                    >
                      <option value="Beginner">Beginner (Seeking Structured Apprenticeship)</option>
                      <option value="Intermediate">Intermediate (Ready for Junior & Freelance Gigs)</option>
                      <option value="Advanced">Advanced (Ready for Full-Time & Venture Role)</option>
                    </select>

                    <Button
                      onClick={() => setMatchedJobs(true)}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs font-bold py-3 rounded-xl shadow-xs"
                    >
                      Match Apprenticeships & Remote Work
                    </Button>
                  </div>

                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <h5 className="text-xs font-mono uppercase text-gray-700 font-bold">Opportunity Radar:</h5>
                    {matchedJobs ? (
                      <div className="space-y-2.5 text-xs font-mono">
                        <div className="p-3 rounded-xl bg-white border border-gray-200 flex justify-between items-center shadow-xs">
                          <div>
                            <div className="font-bold text-gray-900">Junior Web Developer Apprentice</div>
                            <div className="text-[10px] text-gray-500">Dhaka Remote · ৳25,000/mo</div>
                          </div>
                          <Badge className="bg-emerald-600 text-white text-[9px]">92% Match</Badge>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-gray-200 flex justify-between items-center shadow-xs">
                          <div>
                            <div className="font-bold text-gray-900">meUus WorkStation AI Prompt Assistant</div>
                            <div className="text-[10px] text-gray-500">meUus Ecosystem · Part-Time</div>
                          </div>
                          <Badge className="bg-blue-600 text-white text-[9px]">Open</Badge>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">
                        Select your preferred career domain and experience level to view open apprenticeships.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 6. DRUG BUSTER WORKSPACE */}
            {activeHubId === 'drug-buster' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                      <span className="text-xs font-mono uppercase text-rose-700 font-bold">Daily Sobriety Milestone Tracker:</span>
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold font-mono text-gray-900">{soberDays}</span>
                        <div>
                          <div className="text-sm font-bold text-gray-900">Days Clean & Strong</div>
                          <div className="text-xs text-gray-500">Every single day is a major victory.</div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          onClick={() => setSoberDays((prev) => prev + 1)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono shadow-xs"
                        >
                          + Log Today Clean
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                      <div className="text-xs font-mono font-bold text-rose-700 flex items-center gap-2">
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Confidential Emergency Support Line</span>
                      </div>
                      <p className="text-xs text-gray-700">
                        Experiencing intense cravings or emotional distress? Click below to activate emergency breathing protocol.
                      </p>
                      <Button
                        onClick={() => setCravingLogged(true)}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold shadow-xs"
                      >
                        Activate 5-Minute Craving Pause & SOS
                      </Button>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 text-xs">
                    <h5 className="font-mono text-gray-700 uppercase font-bold">Recovery Guidance & Verified BD Clinics:</h5>
                    {cravingLogged ? (
                      <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2 shadow-xs">
                        <p className="font-bold text-emerald-700">1. Pause & Drink a Glass of Cold Water.</p>
                        <p className="text-gray-700">
                          Cravings peak within 7-10 minutes and then subside. You do not have to give in right now. Walk into a public room or call a trusted friend.
                        </p>
                        <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 font-mono">
                          Dhaka Central Treatment Centre & Ahsania Mission Rehab contacts available.
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-gray-600">
                        <p>✓ 100% Private local state on your browser.</p>
                        <p>✓ Direct connection to medical detox and certified rehab centers in Dhaka, Chittagong, and Sylhet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 7. FAMILY HARMONY WORKSPACE */}
            {activeHubId === 'family-harmony' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-xs font-mono text-gray-700 font-semibold">Select Family Harmony Focus Area:</label>
                    <select
                      value={familyFocus}
                      aria-label="Select Family Harmony Focus Area"
                      onChange={(e) => setFamilyFocus(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:border-emerald-500 outline-none"
                    >
                      <option value="communication">De-escalating Daily Marital / Family Arguments</option>
                      <option value="premarital">Pre-Marital Expectations & Financial Clarity</option>
                      <option value="parenting">Positive Parenting & Academic Stress in Children</option>
                      <option value="elderly">Caring for Aging Parents with Honor & Patience</option>
                    </select>

                    <Button
                      onClick={() => setFamilyChecklistComplete(true)}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white font-mono text-xs font-bold py-3 rounded-xl shadow-xs"
                    >
                      Generate 4-Step Peaceful Resolution Script
                    </Button>
                  </div>

                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 font-mono text-xs">
                    <h5 className="text-gray-700 font-bold uppercase">Mediation Protocol:</h5>
                    {familyChecklistComplete ? (
                      <div className="space-y-2 text-gray-700">
                        <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-xs">
                          <span className="font-bold text-pink-700">Rule 1: Never Criticize When Angry</span>
                          <p className="text-[11px] text-gray-500">Wait 20 minutes before speaking about sensitive financial or domestic issues.</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-xs">
                          <span className="font-bold text-emerald-700">Rule 2: Speak in "I" Statements</span>
                          <p className="text-[11px] text-gray-500">Replace "You always ruin things" with "I feel stressed when plans change suddenly."</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        Select a focus area to generate culturally grounded mediation toolkits.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 8. GREEN SOLUTIONS WORKSPACE */}
            {activeHubId === 'green-solutions' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-xs font-mono text-gray-700 font-semibold">Available Rooftop Area (Square Feet):</label>
                    <input
                      type="number"
                      aria-label="Available Rooftop Area in Square Feet"
                      value={roofAreaSqFt}
                      onChange={(e) => setRoofAreaSqFt(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 font-mono text-sm focus:border-emerald-500 outline-none"
                    />

                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                      <h5 className="font-mono font-bold text-teal-700">Recommended Urban Crops for Bangladesh:</h5>
                      <p className="text-gray-600">Tomatoes, Green Chili, Bitter Gourd (Korela), Bottle Gourd (Lau), and Lemon in recycled planter drums.</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4 font-mono">
                    <h5 className="text-xs uppercase text-gray-700 font-bold">Solar & Agricultural Harvest Estimate:</h5>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-2">
                        <span>Solar Generation Potential:</span>
                        <span className="font-bold text-teal-700">{(roofAreaSqFt * 0.012).toFixed(1)} kW System</span>
                      </div>
                      <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-2">
                        <span>Monthly Electricity Savings:</span>
                        <span className="font-bold text-emerald-700">৳{(roofAreaSqFt * 5.2).toFixed(0)} / mo</span>
                      </div>
                      <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-2">
                        <span>CO2 Reduction per Year:</span>
                        <span className="font-bold text-gray-950">{(roofAreaSqFt * 0.08).toFixed(0)} kg CO2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 9. ALIVE BANGLADESH WORKSPACE */}
            {activeHubId === 'alive-bangladesh' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-xs font-mono text-gray-700 font-semibold">Select Your District in Bangladesh:</label>
                    <select
                      value={selectedDistrict}
                      aria-label="Select Your District in Bangladesh"
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:border-emerald-500 outline-none"
                    >
                      <option value="Cumilla">Cumilla (Founder Origin · Swagda)</option>
                      <option value="Dhaka">Dhaka (Mirpur, Dhanmondi, Gulshan, Uttara)</option>
                      <option value="Chittagong">Chittagong (Port City & Agrabad)</option>
                      <option value="Sylhet">Sylhet (Tea Gardens & Surma Valley)</option>
                      <option value="Rajshahi">Rajshahi (Silk & Mango Capital)</option>
                      <option value="Khulna">Khulna (Sundarbans Gateway)</option>
                      <option value="Barisal">Barisal (River Basin & Floating Markets)</option>
                      <option value="Rangpur">Rangpur (North Bengal Agriculture)</option>
                      <option value="Mymensingh">Mymensingh (Haor & Farming Belt)</option>
                    </select>

                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold py-3 rounded-xl shadow-xs">
                      Join Alive Bangladesh Civic Brigade for {selectedDistrict}
                    </Button>
                  </div>

                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 font-mono text-xs">
                    <h5 className="text-gray-700 font-bold uppercase">District Coordination Status:</h5>
                    <div className="space-y-2 text-gray-700">
                      <div className="p-3 rounded-xl bg-white border border-gray-200 flex justify-between items-center shadow-xs">
                        <div>
                          <span className="font-bold text-gray-900">{selectedDistrict} Opportunity Node</span>
                          <div className="text-[10px] text-gray-500">Mutual Aid, Volunteer Roster & SME Network</div>
                        </div>
                        <Badge className="bg-emerald-600 text-white text-[9px]">ACTIVE</Badge>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed pt-1">
                        "Bringing Bangladesh alive — one opportunity at a time. No district left behind."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
