import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Maximize2,
  Sparkles,
  ShieldCheck,
  Heart,
  BookOpen,
  Compass,
  CheckCircle2,
  ExternalLink,
  Volume2,
  Film,
  Layers,
  ChevronRight,
  User,
  Clock,
  ArrowRight,
  Laptop,
  Video,
  HardDrive
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface VideoChapter {
  time: string;
  seconds: number;
  title: string;
  description: string;
  tag: string;
}

interface LaptopDemoVideo {
  id: string;
  title: string;
  file: string;
  size: string;
  duration: string;
  description: string;
  category: string;
  features: string[];
  thumbnail: string;
}

const LAPTOP_DEMOS: LaptopDemoVideo[] = [
  {
    id: 'demo-01',
    title: 'WorkStation & Multi-Agent Architecture',
    file: '/videos/meuus-demo-01.mp4',
    size: '3.18 MB',
    duration: '01:42',
    description: 'Direct screen recording of the meUus WorkStation: Model router execution, prompt drafting, and multi-model failover.',
    category: 'Architecture',
    features: ['Multi-Model Failover', 'Fast Inference', 'Offline Logging'],
    thumbnail: '/preserved/img_hero_ecosystem.jpg'
  },
  {
    id: 'demo-02',
    title: 'Operating System Interface & Execution',
    file: '/videos/meuus-demo-02.mp4',
    size: '3.83 MB',
    duration: '02:05',
    description: 'Dynamic navigation through the 4 canonical domains, 2-way marketplace, and persistent local storage.',
    category: 'OS Workflow',
    features: ['Four Domains', 'Marketplace Exchange', 'Reactive Navigation'],
    thumbnail: '/preserved/desktop-home.jpg'
  },
  {
    id: 'demo-03',
    title: 'DLAS Guided Reflection & Mind Beautifier',
    file: '/videos/meuus-demo-03.mp4',
    size: '4.65 MB',
    duration: '02:30',
    description: 'Longitudinal self-reflection cycle: Stage guidance, non-clinical emotional grounding, and Bangla wisdom synthesis.',
    category: 'DLAS Engine',
    features: ['8-Stage Cycle', 'Claim ≤ Evidence', 'Bangla Typography'],
    thumbnail: '/preserved/img_human_growth_video.jpg'
  },
  {
    id: 'demo-04',
    title: 'Full Toolchain & Automation Engine',
    file: '/videos/meuus-demo-04.mp4',
    size: '5.27 MB',
    duration: '02:48',
    description: 'Automated workspace coordination: Google Sheets, Tasks, and PostgreSQL Cloud SQL synchronization demonstration.',
    category: 'Automation',
    features: ['Cloud SQL Integration', 'Google Workspace APIs', 'L0-L5 Guardrails'],
    thumbnail: '/preserved/img_learning_academy.jpg'
  }
];

const CHAPTERS: VideoChapter[] = [
  { time: '00:00', seconds: 0, title: 'Opening & Vision', description: 'meUusSoulAI: A Guided Reflection Pilot for Human Development', tag: 'Introduction' },
  { time: '00:12', seconds: 12, title: 'What It Is', description: 'A small, honest, private experiment — max 5 messages for calm clarity', tag: 'Core Concept' },
  { time: '00:24', seconds: 24, title: 'Consent & Safety Boundary', description: 'Explicit age and boundary confirmation before reflection begins', tag: 'Ethics & Protocol' },
  { time: '00:44', seconds: 44, title: 'One Real Question', description: '"How are you — really?" User writes one honest sentence', tag: 'Reflection Mode' },
  { time: '01:04', seconds: 64, title: 'Under The Hood N8N Workflow', description: 'Message in, reflection out. Structured data mapping & privacy guardrails', tag: 'Architecture' },
  { time: '01:19', seconds: 79, title: 'Known Limitations Stated Clearly', description: 'Not medical diagnosis, not therapy — pure ethical companion support', tag: 'Transparency' },
  { time: '01:35', seconds: 95, title: 'The Covenant: me → U → us', description: 'From Bangladesh to the World — connecting every dimension of life', tag: 'The Mission' }
];

export default function VideoExperienceHub() {
  const [selectedVideo, setSelectedVideo] = useState<'laptop-demos' | 'soul-pilot' | 'ecosystem-vision'>('laptop-demos');
  const [activeDemoIndex, setActiveDemoIndex] = useState<number>(0);
  const [activeChapter, setActiveChapter] = useState<number>(0);

  const activeDemo = LAPTOP_DEMOS[activeDemoIndex];

  const youtubeUrl = selectedVideo === 'soul-pilot' 
    ? `https://www.youtube.com/embed/0Hydbz9nykQ?autoplay=1&mute=1&enablejsapi=1&rel=0&start=${CHAPTERS[activeChapter].seconds}`
    : `https://www.youtube.com/embed/0Hydbz9nykQ?autoplay=1&mute=1&enablejsapi=1&rel=0`;

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        icon={<Play size={18} />}
        title="Video Experience"
        subtitle="Multimodal Video Pedagogical Library, Curated Archives, and Preserved Streams."
        badge="Media"
        breadcrumb="Media"
      />
      <section id="video-experience" className="py-8 px-6 bg-white text-gray-900 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-mono uppercase tracking-wider">
              <Film className="w-3.5 h-3.5" />
              <span>Official Video Experience & Verified Demonstrations</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-gray-900 leading-tight">
              Watch <span className="text-emerald-600">meUus in Action</span>
            </h2>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              Experience authentic screen recordings captured directly from the founder workstation, plus the official walkthrough of the meUusSoulAI Guided Reflection Pilot.
            </p>
          </div>

          {/* Video Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
            <button
              onClick={() => setSelectedVideo('laptop-demos')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                selectedVideo === 'laptop-demos'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Laptop Demos (4 MP4s)</span>
              <Badge className="bg-emerald-400/20 text-emerald-700 text-[9px] border-0 px-1 py-0 ml-1">Offline</Badge>
            </button>

            <button
              onClick={() => setSelectedVideo('soul-pilot')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                selectedVideo === 'soul-pilot'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>meUusSoulAI Pilot</span>
            </button>

            <button
              onClick={() => setSelectedVideo('ecosystem-vision')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                selectedVideo === 'ecosystem-vision'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>The 9 Hubs Vision</span>
            </button>
          </div>
        </div>

        {/* Video Player & Interactive Playlist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Video Viewport */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-video rounded-3xl bg-white border border-gray-200 overflow-hidden shadow-md">
              {selectedVideo === 'laptop-demos' ? (
                <video
                  key={activeDemo.file}
                  controls
                  autoPlay
                  muted
                  playsInline
                  loop
                  poster={activeDemo.thumbnail}
                  className="w-full h-full object-contain bg-gray-950"
                >
                  <source src={activeDemo.file} type="video/mp4" />
                  Your browser does not support HTML5 video playback.
                </video>
              ) : (
                <iframe
                  src={youtubeUrl}
                  title="meUus Official Presentation & Guided Reflection Pilot"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              )}
            </div>

            {/* Video Meta Info Bar */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
                  {selectedVideo === 'laptop-demos' ? <HardDrive className="w-4 h-4" /> : 'm'}
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    {selectedVideo === 'laptop-demos'
                      ? activeDemo.title
                      : '"meUusSoulAI" The Starting Point _ A Guided Reflection Pilot'}
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    {selectedVideo === 'laptop-demos'
                      ? `${activeDemo.category} · Size: ${activeDemo.size} · Preserved from Founder Laptop (October 2026)`
                      : 'Presented by Md. Mahady Hasan · Devpost AI Hackathon Demo'}
                  </div>
                </div>
              </div>

              {selectedVideo === 'laptop-demos' ? (
                <div className="flex items-center gap-2">
                  {activeDemo.features.map((f, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] border border-emerald-200">
                      {f}
                    </span>
                  ))}
                </div>
              ) : (
                <a
                  href="https://www.youtube.com/watch?v=0Hydbz9nykQ"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-200 text-gray-800 hover:text-gray-900 transition-colors flex items-center gap-1.5 text-[11px] self-start sm:self-auto"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                </a>
              )}
            </div>
          </div>

          {/* Interactive Chapter / Demo List Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-600 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {selectedVideo === 'laptop-demos' ? 'Select Laptop Video Demo:' : 'Jump to Video Chapter:'}
                </span>
              </h4>
              <span className="text-[10px] font-mono text-gray-400">
                {selectedVideo === 'laptop-demos' ? '4 Screen Captures' : '7 Milestones'}
              </span>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {selectedVideo === 'laptop-demos' ? (
                LAPTOP_DEMOS.map((demo, idx) => {
                  const isActive = activeDemoIndex === idx;
                  return (
                    <button
                      key={demo.id}
                      onClick={() => setActiveDemoIndex(idx)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 group ${
                        isActive
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-md ring-1 ring-emerald-500/50'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className={`px-2 py-1 rounded-lg font-mono text-[10px] font-bold shrink-0 mt-0.5 ${
                        isActive ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-emerald-700'
                      }`}>
                        {demo.duration}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-serif font-bold text-xs text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                            {demo.title}
                          </h5>
                          <span className="text-[9px] font-mono text-emerald-600/80 uppercase">{demo.size}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                          {demo.description}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                CHAPTERS.map((ch, idx) => {
                  const isActive = activeChapter === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveChapter(idx)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 group ${
                        isActive
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-md ring-1 ring-emerald-500/50'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className={`px-2 py-1 rounded-lg font-mono text-[10px] font-bold shrink-0 mt-0.5 ${
                        isActive ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-emerald-700'
                      }`}>
                        {ch.time}
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <h5 className="font-serif font-bold text-xs text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                            {ch.title}
                          </h5>
                          <span className="text-[9px] font-mono text-gray-400 uppercase">{ch.tag}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                          {ch.description}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* The 3 Core Video Narratives (Quoted Highlights) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="p-5 rounded-3xl bg-gray-50 border border-gray-200 space-y-2">
            <span className="text-[10px] font-mono uppercase text-emerald-600 font-bold">The Problem In Bangladesh</span>
            <p className="text-xs text-gray-700 italic font-serif leading-relaxed">
              “In Bangladesh, people don’t face one problem. They face everything at once: no job, no legal help, no mental support, and no direction. The system treats them like separate problems. meUus walks beside the whole person.”
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-gray-50 border border-gray-200 space-y-2">
            <span className="text-[10px] font-mono uppercase text-teal-400 font-bold">The Guiding Philosophy</span>
            <p className="text-xs text-gray-700 italic font-serif leading-relaxed">
              “True beauty is born from sincere love. Success is a journey that starts with you. Growth happens through challenges, and requires uncomfortable change.”
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-gray-50 border border-gray-200 space-y-2">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">The Covenant</span>
            <p className="text-xs text-gray-700 italic font-serif leading-relaxed">
              “We started with 'Me'. Now it's 'U'. Together, we become 'Us'. Bringing Bangladesh alive — one opportunity at a time.”
            </p>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
