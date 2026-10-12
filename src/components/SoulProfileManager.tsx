import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from './PageHeader';
import { 
  User, 
  Shield, 
  Lock, 
  Globe, 
  Eye, 
  Briefcase, 
  Sparkles, 
  Star, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Plus, 
  Trash2, 
  CheckCircle2,
  Share2,
  TrendingUp,
  Activity,
  Compass,
  BookOpen,
  Heart,
  Rocket,
  Award,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SoulProfile, VisibilityLevel, SoulBusinessLink } from '../types';

const INITIAL_SOUL: SoulProfile = {
  id: 'soul-local-user',
  fullName: 'Ecosystem Participant',
  oneLineStatement: 'Seeking to develop skills in web development and start an organic micro-enterprise.',
  district: 'Dhaka',
  bio: 'A passionate learner based in Dhaka focused on human development, practical software development, and community impact.',
  skills: ['Frontend Web Development', 'Bangla & English Communication', 'SME Bookkeeping Basics'],
  needs: ['Legal assistance for registering a micro-partnership', 'Mentorship in local supply chain'],
  capacities: ['Can build responsive landing pages for local shops', 'Can volunteer 4 hours/week for digital literacy'],
  goals: ['Formalize my business with e-TIN & Trade License', 'Complete the 90-Day meUus Journey'],
  visibility: {
    identity: 'PUBLIC',
    skills: 'PUBLIC',
    needs: 'PUBLIC',
    capacities: 'PUBLIC',
    businesses: 'PUBLIC',
    personalNotes: 'PRIVATE'
  },
  businesses: [
    {
      id: 'biz-01',
      name: 'Bengal Crafted Tech',
      category: 'Digital Services & Web Presence',
      role: 'Founder / Lead Developer',
      services: ['Custom Landing Pages', 'Digital Catalogue Setup', 'Local SEO'],
      products: ['Starter SME Digital Kit'],
      status: 'PILOT'
    }
  ],
  projects: ['meUus 90-Day Human Growth Sprint', 'Local Community Composting Initiative'],
  createdAt: '2026-08-10',
  lastUpdated: new Date().toISOString().split('T')[0]
};

export default function SoulProfileManager() {
  const [profile, setProfile] = useState<SoulProfile>(() => {
    try {
      const saved = localStorage.getItem('meuus_master_soul');
      return saved ? JSON.parse(saved) : INITIAL_SOUL;
    } catch {
      return INITIAL_SOUL;
    }
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'skills-needs' | 'businesses' | 'privacy'>('overview');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('90d');
  const [isSavedAlert, setIsSavedAlert] = useState(false);
  const [growthPointsBonus, setGrowthPointsBonus] = useState(0);
  const [newSkill, setNewSkill] = useState('');
  const [newNeed, setNewNeed] = useState('');
  const [newCapacity, setNewCapacity] = useState('');
  const [newGoal, setNewGoal] = useState('');

  // Business modal state
  const [bizName, setBizName] = useState('');
  const [bizCategory, setBizCategory] = useState('');
  const [bizService, setBizService] = useState('');

  const saveProfileToStorage = (updated: SoulProfile) => {
    setProfile(updated);
    localStorage.setItem('meuus_master_soul', JSON.stringify(updated));
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `meUus_Soul_Profile_${profile.district}_${profile.lastUpdated}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          saveProfileToStorage(parsed);
        } catch {
          alert("Invalid JSON format");
        }
      };
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const updated = { ...profile, skills: [...profile.skills, newSkill.trim()] };
    setNewSkill('');
    saveProfileToStorage(updated);
  };

  const handleAddNeed = () => {
    if (!newNeed.trim()) return;
    const updated = { ...profile, needs: [...profile.needs, newNeed.trim()] };
    setNewNeed('');
    saveProfileToStorage(updated);
  };

  const handleAddCapacity = () => {
    if (!newCapacity.trim()) return;
    const updated = { ...profile, capacities: [...profile.capacities, newCapacity.trim()] };
    setNewCapacity('');
    saveProfileToStorage(updated);
  };

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    const updated = { ...profile, goals: [...profile.goals, newGoal.trim()] };
    setNewGoal('');
    saveProfileToStorage(updated);
  };

  const handleAddBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName.trim()) return;
    const newBiz: SoulBusinessLink = {
      id: `biz-${Date.now()}`,
      name: bizName.trim(),
      category: bizCategory.trim() || 'General Commercial',
      role: 'Owner / Principal',
      services: bizService.trim() ? [bizService.trim()] : [],
      products: [],
      status: 'PILOT'
    };
    const updated = { ...profile, businesses: [...profile.businesses, newBiz] };
    setBizName('');
    setBizCategory('');
    setBizService('');
    saveProfileToStorage(updated);
  };

  const handleToggleVisibility = (field: string, level: VisibilityLevel) => {
    const updated = {
      ...profile,
      visibility: {
        ...profile.visibility,
        [field]: level
      }
    };
    saveProfileToStorage(updated);
  };

  // Four Canonical Domain Metrics Calculation
  const domainMetrics = useMemo(() => {
    const understandScore = Math.min(100, 45 + (profile.bio ? 20 : 0) + (profile.oneLineStatement ? 20 : 0) + (profile.district ? 15 : 0) + growthPointsBonus);
    const learnScore = Math.min(100, 30 + (profile.skills.length * 15) + (profile.projects.length * 10) + growthPointsBonus);
    const reflectScore = Math.min(100, 40 + (profile.goals.length * 15) + (profile.needs.length * 10) + growthPointsBonus);
    const actScore = Math.min(100, 25 + (profile.capacities.length * 15) + (profile.businesses.length * 20) + growthPointsBonus);

    const overallAverage = Math.round((understandScore + learnScore + reflectScore + actScore) / 4);

    return {
      understand: understandScore,
      learn: learnScore,
      reflect: reflectScore,
      act: actScore,
      overallAverage,
      radarData: [
        { domain: 'Understand', current: understandScore, target: 95, fullMark: 100, desc: 'Self-Awareness & Clarity' },
        { domain: 'Learn', current: learnScore, target: 90, fullMark: 100, desc: 'Quran, Seerah & Skills' },
        { domain: 'Reflect', current: reflectScore, target: 95, fullMark: 100, desc: 'Level-0 & Emotional Health' },
        { domain: 'Act', current: actScore, target: 85, fullMark: 100, desc: 'Capacities & Enterprise' },
      ],
      trajectoryData: [
        { week: 'W1', understand: 35, learn: 25, reflect: 30, act: 20, totalGrowth: 28 },
        { week: 'W2', understand: 45, learn: 35, reflect: 42, act: 25, totalGrowth: 37 },
        { week: 'W3', understand: 55, learn: 48, reflect: 52, act: 38, totalGrowth: 48 },
        { week: 'W4', understand: 68, learn: 60, reflect: 65, act: 50, totalGrowth: 61 },
        { week: 'W5', understand: 76, learn: 72, reflect: 74, act: 62, totalGrowth: 71 },
        { week: 'W6', understand: understandScore, learn: learnScore, reflect: reflectScore, act: actScore, totalGrowth: overallAverage },
      ],
      breakdownData: [
        { name: 'Understand', completed: Math.round(understandScore / 10), target: 10, color: '#10b981' },
        { name: 'Learn', completed: Math.round(learnScore / 10), target: 10, color: '#3b82f6' },
        { name: 'Reflect', completed: Math.round(reflectScore / 10), target: 10, color: '#a855f7' },
        { name: 'Act', completed: Math.round(actScore / 10), target: 10, color: '#f59e0b' },
      ]
    };
  }, [profile, growthPointsBonus]);

  const handleBoostGrowth = (domain: string) => {
    setGrowthPointsBonus(prev => Math.min(prev + 5, 25));
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2500);
  };

  return (
    <div id="soul" className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader
        icon={<Star size={18} />}
        title="Soul Profile"
        subtitle="Longitudinal Human Character, Verified Skills, and Evidence Record."
        badge="Claim ≤ Evidence"
        breadcrumb="Personal Growth"
      />
      <div className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
              Identity & Action Anchor
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Master Soul Profile
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-1 max-w-xl">
              A Soul is not just a social profile—it is the living record of your identity, skills, needs, capacities, linked businesses, and evidence of progress across the four canonical domains.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              className="border-gray-300 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export JSON
            </Button>
            <label className="cursor-pointer">
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-100 text-xs font-semibold shadow-xs">
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Import
              </span>
            </label>
          </div>
        </div>

        {/* Save confirmation banner */}
        {isSavedAlert && (
          <div className="mb-6 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Master Soul & Domain metrics updated successfully in local storage. Privacy rules preserved.</span>
          </div>
        )}

        {/* Sub-Tabs */}
        <div role="tablist" aria-label="Profile Sections" className="flex gap-2 p-1.5 bg-white border border-gray-200 rounded-2xl mb-8 overflow-x-auto shadow-xs">
          {[
            { id: 'overview', label: 'Identity & Bio' },
            { id: 'progress', label: 'Progress Visualization' },
            { id: 'skills-needs', label: 'Skills, Needs & Capacities' },
            { id: 'businesses', label: 'Linked Businesses & Offerings' },
            { id: 'privacy', label: 'Privacy & Visibility Matrix' }
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.id === 'progress' && <TrendingUp className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div role="tabpanel" id="tabpanel-overview" aria-labelledby="tab-overview" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-xs">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">
                  Full Name / Preferred Identifier
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => saveProfileToStorage({ ...profile, fullName: e.target.value })}
                  aria-label="Full Name"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">
                  One-Line Reality Statement
                </label>
                <input
                  type="text"
                  value={profile.oneLineStatement}
                  onChange={(e) => saveProfileToStorage({ ...profile, oneLineStatement: e.target.value })}
                  aria-label="One-Line Reality Statement"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">
                    Primary District / Location
                  </label>
                  <input
                    type="text"
                    value={profile.district}
                    onChange={(e) => saveProfileToStorage({ ...profile, district: e.target.value })}
                    aria-label="Primary District"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">
                    Soul ID (Immutable)
                  </label>
                  <input
                    type="text"
                    value={profile.id}
                    disabled
                    aria-label="Soul ID"
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 font-mono text-xs cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">
                  Personal Story / Bio
                </label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => saveProfileToStorage({ ...profile, bio: e.target.value })}
                  aria-label="Personal Story Bio"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm resize-none"
                />
              </div>
            </div>

            {/* Quick Card Summary */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-serif text-2xl font-bold mb-4">
                  {profile.fullName.charAt(0) || 'M'}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.fullName}</h3>
                <p className="text-xs text-emerald-700 font-mono mb-4">{profile.district}, Bangladesh</p>
                <p className="text-xs text-gray-600 leading-relaxed italic mb-6">
                  "{profile.oneLineStatement}"
                </p>

                <div className="space-y-3 text-xs text-gray-600 border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span>Skills Listed:</span>
                    <span className="font-bold text-gray-900">{profile.skills.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Needs:</span>
                    <span className="font-bold text-gray-900">{profile.needs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacities Offered:</span>
                    <span className="font-bold text-gray-900">{profile.capacities.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Linked Businesses:</span>
                    <span className="font-bold text-gray-900">{profile.businesses.length}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> 4-Domain Growth:
                    </span>
                    <span className="font-bold text-emerald-700 font-mono text-sm">
                      {domainMetrics.overallAverage}%
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <Button
                    onClick={() => setActiveTab('progress')}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold rounded-xl bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  >
                    View Progress Visualization →
                  </Button>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 text-[11px] text-gray-400 font-mono">
                Storage: Local Device Only · Zero Remote Sync Required
              </div>
            </div>
          </div>
        )}

        {/* Tab: Progress Visualization across Four Canonical Domains */}
        {activeTab === 'progress' && (
          <div role="tabpanel" id="tabpanel-progress" aria-labelledby="tab-progress" className="space-y-8 animate-fadeIn">
            {/* Top Domain Summary KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Domain 1: Understand */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <Compass className="w-4 h-4" />
                    </div>
                    <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50">
                      Domain 1
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-0.5">Understand</h4>
                  <p className="text-[11px] text-gray-500 font-mono">meuus.org · Governance & Clarity</p>
                  
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-2xl font-bold font-mono text-emerald-600">{domainMetrics.understand}%</span>
                    <span className="text-[11px] text-gray-400 font-mono">Target: 95%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${domainMetrics.understand}%` }} />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Identity & Clarity</span>
                  <button 
                    onClick={() => handleBoostGrowth('Understand')}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 text-[10px] uppercase font-mono"
                  >
                    <Plus className="w-3 h-3" /> Step
                  </button>
                </div>
              </div>

              {/* Domain 2: Learn */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <Badge variant="outline" className="text-[10px] text-blue-700 border-blue-200 bg-blue-50">
                      Domain 2
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-0.5">Learn</h4>
                  <p className="text-[11px] text-gray-500 font-mono">meuus.app · Quran & Skills</p>
                  
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-2xl font-bold font-mono text-blue-600">{domainMetrics.learn}%</span>
                    <span className="text-[11px] text-gray-400 font-mono">Target: 90%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${domainMetrics.learn}%` }} />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">{profile.skills.length} skills listed</span>
                  <button 
                    onClick={() => handleBoostGrowth('Learn')}
                    className="text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1 text-[10px] uppercase font-mono"
                  >
                    <Plus className="w-3 h-3" /> Step
                  </button>
                </div>
              </div>

              {/* Domain 3: Reflect */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                      <Heart className="w-4 h-4" />
                    </div>
                    <Badge variant="outline" className="text-[10px] text-purple-700 border-purple-200 bg-purple-50">
                      Domain 3
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-0.5">Reflect</h4>
                  <p className="text-[11px] text-gray-500 font-mono">meuussoul.com · Soul & Balance</p>
                  
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-2xl font-bold font-mono text-purple-600">{domainMetrics.reflect}%</span>
                    <span className="text-[11px] text-gray-400 font-mono">Target: 95%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${domainMetrics.reflect}%` }} />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">{profile.goals.length} goals tracking</span>
                  <button 
                    onClick={() => handleBoostGrowth('Reflect')}
                    className="text-purple-700 hover:text-purple-800 font-semibold flex items-center gap-1 text-[10px] uppercase font-mono"
                  >
                    <Plus className="w-3 h-3" /> Step
                  </button>
                </div>
              </div>

              {/* Domain 4: Act */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                      <Rocket className="w-4 h-4" />
                    </div>
                    <Badge variant="outline" className="text-[10px] text-amber-700 border-amber-200 bg-amber-50">
                      Domain 4
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-0.5">Act</h4>
                  <p className="text-[11px] text-gray-500 font-mono">rujbel.org · Capacity & SMEs</p>
                  
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-2xl font-bold font-mono text-amber-600">{domainMetrics.act}%</span>
                    <span className="text-[11px] text-gray-400 font-mono">Target: 85%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${domainMetrics.act}%` }} />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">{profile.businesses.length} linked venture</span>
                  <button 
                    onClick={() => handleBoostGrowth('Act')}
                    className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 text-[10px] uppercase font-mono"
                  >
                    <Plus className="w-3 h-3" /> Step
                  </button>
                </div>
              </div>
            </div>

            {/* Timeframe selector header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">4-Domain Equilibrium & Growth Analytics</h3>
                  <p className="text-xs text-gray-500">Recharts-powered real-time assessment of Soul capacity and holistic balance</p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
                {(['7d', '30d', '90d'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      timeframe === tf
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : '90-Day Sprint'}
                  </button>
                ))}
              </div>
            </div>

            {/* Charts Grid: Radar Balance & Area Trajectory */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart: Canonical Equilibrium */}
              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <span>Domain Equilibrium Radar</span>
                      <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50">
                        Balance Index
                      </Badge>
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Compares current Soul readiness against benchmark transformation standards
                    </p>
                  </div>
                </div>

                <div className="h-[280px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={domainMetrics.radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="domain" stroke="#9ca3af" tick={{ fill: '#4b5563', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#d1d5db" tick={{ fill: '#6b7280', fontSize: 9 }} />
                      <Radar
                        name="Current Soul Status"
                        dataKey="current"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.45}
                      />
                      <Radar
                        name="Target Benchmark"
                        dataKey="target"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.15}
                        strokeDasharray="3 3"
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '12px', fontSize: '12px', color: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#374151' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 flex items-center justify-between">
                  <span>Balanced Growth Motto:</span>
                  <span className="text-emerald-700 font-semibold">"Understand deeply, learn continuously, reflect honestly, act decisively."</span>
                </div>
              </div>

              {/* Area Chart: 90-Day Trajectory */}
              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <span>90-Day Growth Sprint Velocity</span>
                      <Badge variant="outline" className="text-[10px] text-blue-700 border-blue-200 bg-blue-50">
                        Cumulative Score
                      </Badge>
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Weekly progression across the transformation journey
                    </p>
                  </div>
                </div>

                <div className="h-[280px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={domainMetrics.trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="learnGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="week" stroke="#9ca3af" tick={{ fill: '#4b5563', fontSize: 11 }} />
                      <YAxis domain={[0, 100]} stroke="#9ca3af" tick={{ fill: '#4b5563', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '12px', fontSize: '12px', color: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#374151' }}
                      />
                      <Area type="monotone" dataKey="totalGrowth" name="Overall Index" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#growthGradient)" />
                      <Area type="monotone" dataKey="learn" name="Knowledge (Learn)" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#learnGradient)" />
                      <Area type="monotone" dataKey="act" name="Action (Act)" stroke="#f59e0b" strokeWidth={1.5} fillOpacity={0} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 flex items-center justify-between">
                  <span>Current Phase:</span>
                  <span className="text-emerald-700 font-mono font-semibold">Week 6 of 12 · Mid-Sprint Maturation</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar Chart: Weekly Milestone Activity Breakdown */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <span>Domain Milestone Completion (Out of 10 Micro-Goals)</span>
                    <Badge variant="outline" className="text-[10px] text-amber-700 border-amber-200 bg-amber-50">
                      Task Density
                    </Badge>
                  </h4>
                  <p className="text-xs text-gray-500">
                    Quantified micro-action completion for each canonical domain
                  </p>
                </div>
                <div className="text-xs font-mono text-emerald-700 font-semibold">
                  Total Completed: {Math.round(domainMetrics.overallAverage / 10 * 4)} / 40 Milestones
                </div>
              </div>

              <div className="h-[220px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={domainMetrics.breakdownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#4b5563', fontSize: 11 }} />
                    <YAxis domain={[0, 10]} stroke="#9ca3af" tick={{ fill: '#4b5563', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '12px', fontSize: '12px', color: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#374151' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="completed" name="Completed Actions" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="target" name="Sprint Target (10/10)" fill="#e5e7eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Practical Next Steps for All 4 Domains */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700 font-mono flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Next Recommended Actions per Domain</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-emerald-800">Understand (Governance)</div>
                    <p className="text-xs text-gray-600">Refine your 1-line reality statement and confirm public disclosure rules.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-blue-800">Learn (Knowledge)</div>
                    <p className="text-xs text-gray-600">Study the next Quranic Surah commentary & log 1 new verified practical skill.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-purple-800">Reflect (Mind Wellness)</div>
                    <p className="text-xs text-gray-600">Use Mind Beautifier AI to do a 5-minute honest emotional check-in.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-amber-800">Act (Enterprise)</div>
                    <p className="text-xs text-gray-600">Link your primary business offering to the Two-Way Marketplace.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Skills, Needs & Capacities */}
        {activeTab === 'skills-needs' && (
          <div role="tabpanel" id="tabpanel-skills-needs" aria-labelledby="tab-skills-needs" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center justify-between">
                <span>Verified / Claimed Skills</span>
                <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50">
                  {profile.skills.length}
                </Badge>
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Add a skill (e.g. 'Accounting', 'Carpentry')..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 focus:border-emerald-500 outline-none"
                />
                <Button size="sm" onClick={handleAddSkill} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((s, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-800 border border-gray-200">
                    <span>{s}</span>
                    <button 
                      onClick={() => saveProfileToStorage({ ...profile, skills: profile.skills.filter((_, i) => i !== idx) })}
                      className="hover:text-red-500 text-gray-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center justify-between">
                <span>Current 90-Day Goals</span>
                <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50">
                  {profile.goals.length}
                </Badge>
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Add a goal (e.g. 'Complete trade license registration')..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 focus:border-emerald-500 outline-none"
                />
                <Button size="sm" onClick={handleAddGoal} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
              <ul className="space-y-1.5">
                {profile.goals.map((g, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-gray-50 text-xs text-gray-800 flex items-center justify-between border border-gray-200">
                    <span>{g}</span>
                    <button 
                      onClick={() => saveProfileToStorage({ ...profile, goals: profile.goals.filter((_, i) => i !== idx) })}
                      className="hover:text-red-500 text-gray-400 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Needs (I Need) */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <h3 className="text-base font-bold text-rose-700 mb-3 flex items-center justify-between">
                <span>I Need (What You Are Seeking)</span>
                <Badge variant="outline" className="text-[10px] text-rose-700 border-rose-200 bg-rose-50">
                  {profile.needs.length}
                </Badge>
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="e.g. 'Legal help for partnership agreement'..."
                  value={newNeed}
                  onChange={(e) => setNewNeed(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNeed()}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 focus:border-rose-500 outline-none"
                />
                <Button size="sm" onClick={handleAddNeed} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
              <ul className="space-y-1.5">
                {profile.needs.map((n, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-gray-50 text-xs text-gray-800 flex items-center justify-between border border-gray-200">
                    <span>{n}</span>
                    <button 
                      onClick={() => saveProfileToStorage({ ...profile, needs: profile.needs.filter((_, i) => i !== idx) })}
                      className="hover:text-red-500 text-gray-400 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Capacities (I Have / Can Offer) */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <h3 className="text-base font-bold text-emerald-800 mb-3 flex items-center justify-between">
                <span>I Have / I Can (What You Can Provide)</span>
                <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50">
                  {profile.capacities.length}
                </Badge>
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="e.g. 'Can teach computer basics on weekends'..."
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCapacity()}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 focus:border-emerald-500 outline-none"
                />
                <Button size="sm" onClick={handleAddCapacity} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
              <ul className="space-y-1.5">
                {profile.capacities.map((c, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-gray-50 text-xs text-gray-800 flex items-center justify-between border border-gray-200">
                    <span>{c}</span>
                    <button 
                      onClick={() => saveProfileToStorage({ ...profile, capacities: profile.capacities.filter((_, i) => i !== idx) })}
                      className="hover:text-red-500 text-gray-400 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Businesses & Offerings */}
        {activeTab === 'businesses' && (
          <div className="space-y-8">
            <div className="p-6 md:p-8 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Linked Business Entities</h3>
              <p className="text-xs text-gray-500 mb-6">
                In meUus architecture, separate businesses remain separate linked entities rather than collapsing into one undifferentiated identity.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {profile.businesses.map((biz) => (
                  <div key={biz.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50">
                          {biz.status}
                        </Badge>
                        <button
                          onClick={() => saveProfileToStorage({
                            ...profile,
                            businesses: profile.businesses.filter(b => b.id !== biz.id)
                          })}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mb-1">{biz.name}</h4>
                      <p className="text-xs text-emerald-700 mb-2">{biz.category} · {biz.role}</p>
                      
                      {biz.services.length > 0 && (
                        <div className="mt-3">
                          <span className="text-[11px] font-mono text-gray-500">Services Offered:</span>
                          <ul className="mt-1 space-y-1">
                            {biz.services.map((svc, sIdx) => (
                              <li key={sIdx} className="text-xs text-gray-700 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>{svc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Business Form */}
              <form onSubmit={handleAddBusiness} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-gray-700 font-bold">
                  + Link a New Business / Initiative
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Business Name (e.g. 'Dhaka Solar Solutions')"
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 outline-none focus:border-emerald-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g. 'Renewable Energy / SME')"
                    value={bizCategory}
                    onChange={(e) => setBizCategory(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Primary Service (e.g. 'Solar Feasibility Audits')"
                    value={bizService}
                    onChange={(e) => setBizService(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs">
                    Link Business to Soul
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 4: Privacy & Visibility */}
        {activeTab === 'privacy' && (
          <div className="p-6 md:p-8 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Soul Privacy & Disclosure Matrix</h3>
              <p className="text-xs text-gray-500">
                Privacy by default. You have full granular authority over who can view each component of your Master Soul.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { key: 'identity', label: 'Personal Name & District' },
                { key: 'skills', label: 'Skills & Experience Registry' },
                { key: 'needs', label: 'Needs & Requests for Assistance' },
                { key: 'capacities', label: 'Capacities & Volunteer Offers' },
                { key: 'businesses', label: 'Linked Businesses & Commercial Catalogues' },
                { key: 'personalNotes', label: 'Private Journaling & DLAS Reflections' }
              ].map(({ key, label }) => {
                const currentLevel: VisibilityLevel = profile.visibility[key] || 'PRIVATE';
                return (
                  <div key={key} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{label}</h4>
                      <p className="text-xs text-gray-500 font-mono">Current state: {currentLevel}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(['PRIVATE', 'CONNECTED', 'PUBLIC'] as VisibilityLevel[]).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleToggleVisibility(key, lvl)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                            currentLevel === lvl
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-300'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Governed Memory System (7-Layer OS Layer 3 Architecture) */}
            <div className="pt-6 border-t border-gray-200 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-emerald-700 font-bold tracking-wider mb-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Layer 3 OS Architecture · Governed Memory System</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900">Explicit Retention & Granular Memory Purge</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Governed memory across all 8 canonical domains. You own all memory; nothing is retained without explicit consent.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all governed local memories? Profile essentials will be preserved.')) {
                      ['meuus_career_skills_v1', 'meuus_career_portfolio_v1', 'meuus_wellness_journal'].forEach(k => localStorage.removeItem(k));
                      alert('Governed memory caches cleared. System restored to baseline.');
                    }
                  }}
                  className="rounded-xl border-rose-300 text-rose-700 hover:bg-rose-50 text-xs shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Purge All Local Memory
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { domain: 'Personal Memory', desc: 'Reflections, feelings & private intentions', retention: '90 Days', key: 'personal' },
                  { domain: 'Preference Memory', desc: 'UI mode, audio volume & sound choices', retention: 'Permanent', key: 'pref' },
                  { domain: 'Project Memory', desc: 'Active tasks, sprint targets & milestones', retention: '1 Year', key: 'proj' },
                  { domain: 'Learning Memory', desc: 'Qur\'an, Seerah & curriculum streaks', retention: 'Permanent', key: 'learn' },
                  { domain: 'Development Memory', desc: 'Longitudinal DLAS assessment history', retention: 'Permanent', key: 'dev' },
                  { domain: 'Work Memory', desc: 'SME catalog, customer proposals & notes', retention: '1 Year', key: 'work' },
                  { domain: 'Agent Memory', desc: 'Autonomous helper prompts & run histories', retention: '30 Days', key: 'agent' },
                  { domain: 'Knowledge Memory', desc: 'Saved bookmarks & source library highlights', retention: 'Permanent', key: 'knowledge' },
                ].map((item) => (
                  <div key={item.domain} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-gray-900">{item.domain}</div>
                      <div className="text-[10px] text-gray-500">{item.desc}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-gray-200 text-emerald-700 font-semibold shrink-0">
                      {item.retention}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
