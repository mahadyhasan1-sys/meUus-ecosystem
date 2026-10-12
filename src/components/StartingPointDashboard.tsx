import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Target, 
  RotateCcw, 
  Compass, 
  User, 
  Briefcase, 
  BookOpen,
  Send,
  Loader2,
  Bot,
  Download,
  Database,
  Cloud,
  Check
} from 'lucide-react';
import { INITIAL_JOURNEY_TASKS } from '../constants';
import { JourneyTask } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReviewNotice from './ReviewNotice';
import { useEcosystem } from '../context/EcosystemContext';

export default function StartingPointDashboard() {
  const { openAiGuide, logAction, stats, exportCompleteEcosystemBackup } = useEcosystem();

  const [tasks, setTasks] = useState<JourneyTask[]>(() => {
    try {
      const saved = localStorage.getItem('meuus_journey_tasks');
      return saved ? JSON.parse(saved) : INITIAL_JOURNEY_TASKS;
    } catch {
      return INITIAL_JOURNEY_TASKS;
    }
  });

  const [todayReflection, setTodayReflection] = useState<string>(() => {
    return localStorage.getItem('meuus_today_action') || '';
  });

  // meYoo assistant state
  const [meYooInput, setMeYooInput] = useState('');
  const [meYooResponse, setMeYooResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [savedCloudNotice, setSavedCloudNotice] = useState(false);

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        const nextStatus = !t.isCompleted;
        if (nextStatus) {
          logAction({
            hubId: 'sprint-dashboard',
            title: `Completed Day ${t.dayNumber}: ${t.title}`,
            category: 'sprint',
            status: 'completed',
            metadata: { dayNumber: t.dayNumber, phase: t.phase }
          });
        }
        return { ...t, isCompleted: nextStatus };
      }
      return t;
    });
    setTasks(updated);
    localStorage.setItem('meuus_journey_tasks', JSON.stringify(updated));
  };

  const handleSaveTodayReflection = (text: string) => {
    setTodayReflection(text);
    localStorage.setItem('meuus_today_action', text);
  };

  const handleCommitTodayAction = () => {
    if (!todayReflection.trim()) return;
    logAction({
      hubId: 'today-action',
      title: `Today's Action: ${todayReflection.slice(0, 60)}...`,
      category: 'reflection',
      status: 'pending',
      metadata: { fullReflection: todayReflection }
    });
    setSavedCloudNotice(true);
    setTimeout(() => setSavedCloudNotice(false), 2500);
  };

  const handleMeYooChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meYooInput.trim()) return;

    setIsThinking(true);
    setTimeout(() => {
      const lower = meYooInput.toLowerCase();
      let reply = "I am beside you, Bondhu (friend). Whatever you are facing today, we take it one truthful step at a time. Have you mapped this in your Master Soul or DLAS reflection?";
      
      if (lower.includes('work') || lower.includes('job')) {
        reply = "Finding meaningful work starts with mapping your real skills without understating your ability. Head over to the Unemployment Buster and post your capacities on the Two-Way Marketplace today.";
      } else if (lower.includes('business') || lower.includes('trade')) {
        reply = "For SME growth, formalization is the bedrock. Make sure to review the Trade License, e-TIN, and BIN guide in our Knowledge Hub before signing commercial commitments.";
      } else if (lower.includes('stuck') || lower.includes('tired') || lower.includes('overwhelmed')) {
        reply = "Apnar pashe achi (I am beside you). When overwhelmed, do not try to solve the whole year today. Complete just today's 1-minute reflection and take a gentle pause.";
      }

      setMeYooResponse(reply);
      setIsThinking(false);
    }, 500);
  };

  return (
    <div id="dashboard" className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        icon={<Compass size={18} />}
        title="Starting Point"
        subtitle="Level 00 Foundation — Dignity, Calm, and Inner Clarity Before Action."
        badge="Level 00"
        breadcrumb="Start"
      />
      <div className="py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-2">
              Operational Starting Point · Reflect & Act
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Human Growth & 90-Day Journey
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-1 max-w-xl">
              Consistent, honest action over perfection. Track your 7-day initial sprint and 90-day progress loop.
            </p>
          </div>

          {/* Unified Ecosystem Telemetry Badges & Backup Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-gray-200 flex items-center gap-3 text-xs font-mono">
              <span className="text-gray-500">Master Soul:</span>
              <span className="text-emerald-600 font-bold">{stats.soulReadinessScore}% Ready</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-gray-200 flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs font-mono text-gray-500">Sprint Progress</span>
                <div className="text-lg font-bold text-emerald-600">{progressPercent}%</div>
              </div>
              <div className="w-20 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            <Button
              onClick={exportCompleteEcosystemBackup}
              className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 text-xs font-mono rounded-2xl p-3.5 flex items-center gap-2 shadow-sm"
              title="Download entire ecosystem backup JSON"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Export Ecosystem JSON</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 & 2: Journey Task Loop */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <span>7-Day Foundation Action Checklist</span>
                </h3>
                <span className="text-xs font-mono text-gray-500">
                  {completedCount} of {tasks.length} Done
                </span>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      task.isCompleted
                        ? 'bg-emerald-50 border-emerald-200 text-gray-700'
                        : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900 shadow-2xs'
                    }`}
                  >
                    <button
                      type="button"
                      aria-label={task.isCompleted ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
                      className="mt-0.5 text-emerald-600"
                    >
                      {task.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] font-mono border-gray-200 text-emerald-700 py-0">
                          Day {task.dayNumber} · {task.phase}
                        </Badge>
                        <h4 className={`text-sm font-semibold ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {task.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {task.description}
                      </p>
                      {task.notes && (
                        <span className="inline-block text-[11px] font-mono text-emerald-700 mt-1">
                          ✓ {task.notes}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's One Honest Action */}
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Today's One Honest Action</span>
                </h3>
                {savedCloudNotice && (
                  <span className="text-xs font-mono text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Logged to Ecosystem Stream</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500">
                What is the single, non-negotiable step you will complete before the day ends?
              </p>
              
              <textarea
                rows={3}
                value={todayReflection}
                onChange={(e) => handleSaveTodayReflection(e.target.value)}
                placeholder="e.g. 'I will finalize my business description and submit one service offer on the marketplace'..."
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-amber-500 text-gray-900 placeholder:text-gray-400 text-sm outline-none resize-none"
              />

              <div className="flex flex-wrap justify-between items-center gap-3 pt-1 text-[11px] font-mono text-gray-500">
                <span>Stored Locally + Synced with Cloud SQL</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAiGuide(`I committed to this action today: "${todayReflection}". How can I break this down into 3 concrete micro-steps?`)}
                    disabled={!todayReflection.trim()}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-emerald-700 text-xs font-mono flex items-center gap-1.5 transition disabled:opacity-40"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Break Down with AI</span>
                  </button>
                  <Button
                    onClick={handleCommitTodayAction}
                    disabled={!todayReflection.trim()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono rounded-xl px-4 shadow-xs"
                  >
                    Commit Action
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: meYoo Interface & Ecosystem Links */}
          <div className="space-y-6">
            {/* meYoo Intelligence Interface */}
            <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <Badge variant="outline" className="border-emerald-200 text-emerald-700 text-[10px] font-mono">
                    HUMAN-FACING INTELLIGENCE
                  </Badge>
                  <h4 className="text-base font-bold text-gray-900">meYoo Companion</h4>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                meYoo is your guide across the meUus ecosystem—governed by policy, grounded in reality, and strictly supportive.
              </p>

              {meYooResponse && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs md:text-sm text-gray-900 leading-relaxed shadow-xs animate-fadeIn">
                  <span className="font-bold text-emerald-700 block mb-1">meYoo:</span>
                  {meYooResponse}
                </div>
              )}

              <form onSubmit={handleMeYooChat} className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={meYooInput}
                    onChange={(e) => setMeYooInput(e.target.value)}
                    placeholder="Ask meYoo where to start or what to do next..."
                    aria-label="Ask meYoo where to start or what to do next"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isThinking || !meYooInput.trim()}
                    aria-label="Send query to meYoo AI assistant"
                    className="absolute right-2 top-2 p-1.5 rounded-lg bg-emerald-600 text-white disabled:opacity-40"
                  >
                    {isThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500 font-mono">
                <span>Direct Gemini Intelligence Bridge</span>
                <button
                  type="button"
                  onClick={() => openAiGuide(meYooInput || "How can I make the most of my 90-Day Sprint?")}
                  className="text-emerald-700 hover:text-emerald-800 underline font-bold"
                >
                  Open Full Chat Drawer →
                </button>
              </div>
            </div>

            {/* Quick Ecosystem Action Portals */}
            <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold mb-2">
                Action Portals
              </h4>

              {[
                { label: 'Master Soul Profile', href: '#soul', desc: 'Identity, Skills, Businesses & Privacy', icon: User },
                { label: 'Google Workspace & SQL', href: '#workspace', desc: 'Sheets, Meet, Forms, Tasks sync', icon: Database },
                { label: 'DLAS Structured Reflection', href: '#dlas', desc: '5 Developmental Lenses', icon: Compass },
                { label: 'Two-Way Marketplace', href: '#marketplace', desc: 'Needs, Capacities & Services', icon: Briefcase },
                { label: 'Knowledge & Source Hub', href: '#knowledge', desc: 'Qur\'an, Seerah, SME Guides', icon: BookOpen },
              ].map((portal, pIdx) => {
                const PortalIcon = portal.icon;
                return (
                  <a
                    key={pIdx}
                    href={portal.href}
                    className="p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white text-emerald-600 border border-gray-200">
                        <PortalIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          {portal.label}
                        </h5>
                        <p className="text-[10px] text-gray-500">{portal.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
