import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Compass,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Heart,
  Rocket,
  Play,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  SlidersHorizontal,
  Layers,
  Database,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConnectionCanvas3D from './ConnectionCanvas3D';

export interface HeroSlide {
  id: string;
  tag: string;
  badgeType: 'emerald' | 'sky' | 'purple' | 'amber';
  headline: string;
  headlineHighlight: string;
  subtitle: string;
  motto: string;
  bgImage: string;
  locationTag: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary: { text: string; href: string };
  stats: { label: string; value: string; hint?: string }[];
}

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'ecosystem',
    tag: 'One Ecosystem · Nine Canonical Hubs',
    badgeType: 'emerald',
    headline: 'Empowering Every Dimension',
    headlineHighlight: 'of Human Dignity in Bangladesh',
    subtitle: 'From unemployment relief and ethical commerce to emotional clarity, legal aid, and moral leadership — meUus provides a unified, evidence-based starting point for every citizen.',
    motto: '“Consistent, Honest Action Over Perfection. Because your individual growth creates our collective future.”',
    bgImage: '/preserved/img_hero_ecosystem.jpg',
    locationTag: 'meUus Digital Ecosystem Sanctuary',
    ctaPrimary: { text: 'Enter Universal Start Door', href: '#start' },
    ctaSecondary: { text: 'Watch Video Demos (4 MP4s)', href: '#video-experience' },
    stats: [
      { label: 'Canonical Pillars', value: '9 Hubs', hint: 'Universal Access' },
      { label: 'Ecosystem Rollout', value: '64 Districts', hint: 'Nationwide Target' },
      { label: 'Core Axiom', value: 'Claim ≤ Evidence', hint: 'Radical Honesty' }
    ]
  },
  {
    id: 'soul-pilot',
    tag: 'meUusSoulAI · Guided Reflection Pilot',
    badgeType: 'purple',
    headline: 'Understand Yourself Deeply.',
    headlineHighlight: 'Act with Sincerity & Courage.',
    subtitle: 'A quiet, private, ethical pause in a chaotic world. Ask real questions about identity, stress, family harmony, or career crossroads and receive structured compassionate clarity.',
    motto: '“Before anything else, let me ask you one honest question: How are you — really?”',
    bgImage: '/preserved/img_human_growth_video.jpg',
    locationTag: 'Sixty Dome Heritage Sanctuary, Bagerhat',
    ctaPrimary: { text: 'Begin Soul Reflection', href: '#wellness' },
    ctaSecondary: { text: 'Open Workspace & Tasks', href: '#workspace' },
    stats: [
      { label: 'Daily Pause', value: 'Level-0 Habit', hint: 'Private & Safe' },
      { label: 'Data Policy', value: 'Zero Mining', hint: 'User-Owned' },
      { label: 'Cloud SQL', value: 'PostgreSQL', hint: 'us-west1 Region' }
    ]
  },
  {
    id: 'resilience',
    tag: 'Transformation & 90-Day Sprint',
    badgeType: 'amber',
    headline: 'Endings Cultivate',
    headlineHighlight: 'Resilient New Beginnings.',
    subtitle: 'True growth begins when you embrace uncomfortable transformation. Launch local initiatives, master technological skills, and exchange economic capacity across communities.',
    motto: '“Disciplined daily effort outperforms sporadic brilliance. Success is a journey that starts with you.”',
    bgImage: '/preserved/img_learning_academy.jpg',
    locationTag: 'meUus Academy · Continuous Skill Mastery',
    ctaPrimary: { text: 'Explore 90-Day Journey', href: '#dashboard' },
    ctaSecondary: { text: 'Two-Way Marketplace', href: '#marketplace' },
    stats: [
      { label: 'Structured Sprint', value: '90 Days', hint: 'Measurable Action' },
      { label: 'Capacity Exchange', value: 'Need ↔ Skill', hint: 'Community Barter' },
      { label: 'WorkStation Router', value: '1.4B Tokens', hint: 'Free Multi-Model' }
    ]
  },
  {
    id: 'tech-innovation',
    tag: 'meUus WorkStation & Dev Studio',
    badgeType: 'sky',
    headline: 'Open-Source Engineering',
    headlineHighlight: 'for Societal Advancement',
    subtitle: 'Unifying Google Workspace (Sheets, Meet, Forms, Tasks), Cloud SQL, Flutter architecture, and Gemini 2.5/3 Pro multimodal models for real-world impact.',
    motto: '“Technology is only as noble as the human condition it uplifts.”',
    bgImage: '/preserved/img_meuus_brand_logo.jpg',
    locationTag: 'meUus Studio WorkStation, Dhaka',
    ctaPrimary: { text: 'Open WorkStation Suite', href: '#workstation' },
    ctaSecondary: { text: 'Launch App Studio', href: '#app-preview' },
    stats: [
      { label: 'Workspace APIs', value: '4 Services', hint: 'Sheets, Meet, Forms, Tasks' },
      { label: 'Response Target', value: '<800ms', hint: 'Zero-Latency Core' },
      { label: 'Human Protocol', value: '15-Min Crisis', hint: 'Triage Ready' }
    ]
  },
  {
    id: 'laptop-journey',
    tag: 'Preserved Workstation & Founder Journey',
    badgeType: 'emerald',
    headline: 'Demonstrated Engineering',
    headlineHighlight: 'Over Unproven Claims',
    subtitle: 'Real desktop telemetry, actual multi-model agent kernels, verified DSR convergence, and authentic local work backups preserved directly from the founder machine.',
    motto: '“Claim ≤ Evidence. Every line of code, artifact, and milestone verified.”',
    bgImage: '/preserved/journey/lasthermeswork.png',
    locationTag: 'Client #001 · Founder Workstation Archival',
    ctaPrimary: { text: 'Inspect Preserved Archive', href: '#preserved-showcase' },
    ctaSecondary: { text: 'Watch Video Demos', href: '#video-experience' },
    stats: [
      { label: 'Preserved Items', value: '233 Artifacts', hint: 'SHA-256 Sealed' },
      { label: 'Video Demos', value: '4 Recordings', hint: 'Laptop Captures' },
      { label: 'Milestones', value: 'R20 → R60A', hint: 'Ecosystem Lineage' }
    ]
  }
];

export default function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [showWallpaperSelector, setShowWallpaperSelector] = useState<boolean>(false);
  const [show3DVisual, setShow3DVisual] = useState<boolean>(true);

  // Check if user uploaded custom wallpapers and merge
  useEffect(() => {
    try {
      const stored = localStorage.getItem('meuus_user_photos');
      if (stored) {
        const userPhotos = JSON.parse(stored);
        if (Array.isArray(userPhotos) && userPhotos.length > 0) {
          const customSlides: HeroSlide[] = userPhotos.map((photo, i) => ({
            id: `user-custom-${photo.id || i}`,
            tag: 'Personal Wallpaper · User Archive',
            badgeType: 'purple' as const,
            headline: photo.title || 'Personal Living Archive',
            headlineHighlight: 'Your Journey, Preserved.',
            subtitle: 'This high-definition background was uploaded directly by you, showcasing your personalized reflection and workspace environment.',
            motto: '“Consistent, Honest Action Over Perfection.”',
            bgImage: photo.url,
            locationTag: photo.location || 'Local Upload Archive',
            ctaPrimary: { text: 'Enter Universal Start Door', href: '#start' },
            ctaSecondary: { text: 'Open Photo Album', href: '#photo-album' },
            stats: [
              { label: 'Asset Type', value: 'Custom Photo' },
              { label: 'Resolution', value: photo.resolution || 'High-Definition' },
              { label: 'Storage', value: 'Active Session' }
            ]
          }));
          setSlides([...DEFAULT_HERO_SLIDES, ...customSlides]);
        }
      }
    } catch (e) {
      console.warn('Could not read user photos for hero background', e);
    }
  }, []);

  const activeSlide = slides[currentSlideIndex] || slides[0];

  // Auto-play interval
  useEffect(() => {
    if (!isAutoPlaying || showWallpaperSelector) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length, showWallpaperSelector]);

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[96vh] flex flex-col justify-between pt-24 sm:pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-white text-gray-900 overflow-hidden border-b border-gray-200"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* 
        =======================================================================
        FULL-WIDTH BACKGROUND CONTAINER WITH BASE44 REFINED LIGHT GRADIENT OVERLAYS
        =======================================================================
      */}
      <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id + activeSlide.bgImage}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 0.25, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform-gpu will-change-transform"
            style={{ backgroundImage: `url(${activeSlide.bgImage})` }}
          />
        </AnimatePresence>

        {/* 1. Horizontal Directional Light Scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/70" />

        {/* 2. Vertical Edge Feathering */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />

        {/* 3. Deep Radial Focus & Subtle Film Tone */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[0.5px]" />
      </div>

      {/* Main Content Grid: Left Narrative + Right Telemetry Box */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-6 sm:py-10">
        
        {/* Left Column: Base44 Crisp Typography & Primary Actions (8 cols) */}
        <motion.div
          key={activeSlide.id + '-text'}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="lg:col-span-8 space-y-6 text-left"
        >
          {/* Tag Pill + Location Tag */}
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wide backdrop-blur-md shadow-sm ${
              activeSlide.badgeType === 'emerald' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
              activeSlide.badgeType === 'sky' ? 'bg-sky-50 border-sky-200 text-sky-800' :
              activeSlide.badgeType === 'purple' ? 'bg-purple-50 border-purple-200 text-purple-800' :
              'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{activeSlide.tag}</span>
            </div>

            {activeSlide.locationTag && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-[11px] font-mono text-gray-700 backdrop-blur-md">
                <Compass className="w-3 h-3 text-emerald-600" />
                <span>{activeSlide.locationTag}</span>
              </span>
            )}
          </div>

          {/* Display Headline with High-Contrast Text Balancing */}
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-gray-900 leading-[1.08]">
              {activeSlide.headline} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 underline decoration-emerald-500/40 decoration-4 underline-offset-8">
                {activeSlide.headlineHighlight}
              </span>
            </h1>
          </div>

          {/* Body Narrative */}
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl leading-relaxed font-sans font-normal">
            {activeSlide.subtitle}
          </p>

          {/* Quoted Core Motto */}
          <div className="p-4 rounded-2xl bg-white/95 border border-gray-200 max-w-xl text-xs sm:text-sm italic font-serif text-gray-700 backdrop-blur-md shadow-sm">
            {activeSlide.motto}
          </div>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <a
              href={activeSlide.ctaPrimary.href}
              className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold font-mono text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{activeSlide.ctaPrimary.text}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={activeSlide.ctaSecondary.href}
              className="px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 hover:text-gray-900 border border-gray-300 rounded-2xl font-semibold font-mono text-xs sm:text-sm transition-all flex items-center gap-2 backdrop-blur-md shadow-sm"
            >
              <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>{activeSlide.ctaSecondary.text}</span>
            </a>

            {/* Quick Wallpaper Switcher Toggle Button */}
            <button
              onClick={() => setShowWallpaperSelector(!showWallpaperSelector)}
              className="px-4 py-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 text-xs font-mono transition flex items-center gap-2 shadow-sm"
              title="Change Background Wallpaper"
            >
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Change Background</span>
            </button>
          </div>

          {/* 4-Domain Unified Portals Switcher */}
          <div className="pt-2">
            <div className="text-[11px] font-mono uppercase text-gray-500 font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>4-Domain Operating System Portals</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: 'meuus.org', label: 'Understand', desc: '9 Pillars Matrix', href: '#pillars', color: 'border-emerald-300 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50' },
                { name: 'meuussoul.com', label: 'Learn', desc: 'Quran & Seerah', href: '#soul-journeys', color: 'border-teal-300 text-teal-700 bg-teal-50/50 hover:bg-teal-50' },
                { name: 'meuus.app', label: 'Reflect & Act', desc: 'OS & Marketplace', href: '#full-ecosystem', color: 'border-amber-300 text-amber-700 bg-amber-50/50 hover:bg-amber-50' },
                { name: 'rujbel.org', label: 'Archive', desc: 'Living Narrative', href: '#founder', color: 'border-purple-300 text-purple-700 bg-purple-50/50 hover:bg-purple-50' }
              ].map((domain, i) => (
                <a
                  key={i}
                  href={domain.href}
                  className={`p-2.5 rounded-2xl border ${domain.color} transition-all backdrop-blur-md hover:scale-[1.03] group shadow-sm`}
                >
                  <div className="text-xs font-mono font-bold text-gray-900 group-hover:text-emerald-700 truncate">
                    {domain.name}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {domain.label} · {domain.desc}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Base44 Live Telemetry & Slide Navigator (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-serif text-xl font-bold">
                  m
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-gray-900 leading-tight">meUus Flagship</h3>
                  <p className="text-[10px] text-emerald-600 font-mono">me → U → us</p>
                </div>
              </div>

              {/* Toggle between 3D Canvas and Telemetry */}
              <div className="flex items-center p-1 rounded-xl bg-gray-100 border border-gray-200 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setShow3DVisual(true)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    show3DVisual ? 'bg-emerald-600 text-white font-extrabold shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  3D Orbit
                </button>
                <button
                  type="button"
                  onClick={() => setShow3DVisual(false)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    !show3DVisual ? 'bg-emerald-600 text-white font-extrabold shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Telemetry
                </button>
              </div>
            </div>

            {/* 3D Living Canvas or Metric Cards */}
            {show3DVisual ? (
              <div className="relative rounded-2xl bg-gradient-to-b from-gray-50 to-slate-100 border border-gray-200 overflow-hidden shadow-xs">
                <div className="h-[220px] w-full">
                  <ConnectionCanvas3D />
                </div>
                <div className="p-2.5 bg-white border-t border-gray-200 text-center">
                  <p className="text-[10px] text-gray-600 font-mono">
                    Living Network: <span className="text-emerald-600 font-semibold">me</span> → <span className="text-sky-600 font-semibold">U</span> → <span className="text-amber-600 font-semibold">us</span> (Interactive)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeSlide.stats.map((stat, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-gray-500 font-mono block">{stat.label}</span>
                      {stat.hint && <span className="text-[9px] text-gray-400 font-mono">{stat.hint}</span>}
                    </div>
                    <span className="text-xs font-bold text-gray-900 font-mono bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-sm">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Slide Navigation Dots & Step Controls */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlideIndex === idx ? 'w-7 bg-emerald-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    title={slide.tag}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm"
                  title="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallpaper Switcher Drawer (if activated) */}
      <AnimatePresence>
        {showWallpaperSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto w-full mb-6 p-4 rounded-3xl bg-white border border-gray-200 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-gray-900 font-mono uppercase tracking-wider">Select Background Visual</span>
              </div>
              <button 
                onClick={() => setShowWallpaperSelector(false)}
                className="text-xs text-gray-500 hover:text-gray-900 font-mono"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentSlideIndex(idx);
                    setShowWallpaperSelector(false);
                  }}
                  className={`relative aspect-video rounded-xl overflow-hidden border transition group ${
                    currentSlideIndex === idx ? 'border-emerald-500 ring-2 ring-emerald-500/50' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={s.bgImage} alt={s.headline} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute inset-0 bg-gray-900/40 flex items-end p-2 text-left">
                    <span className="text-[10px] text-white font-mono truncate">{s.locationTag || s.tag}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        =======================================================================
        BASE44 4 QUICK DOMAIN ACCESS CARDS AT THE BASE
        =======================================================================
      */}
      <div className="max-w-7xl mx-auto w-full pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Domain 1 */}
          <a
            href="#pillars"
            className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50/40 border border-gray-200 hover:border-emerald-500/60 transition-all flex items-center gap-3.5 group shadow-sm"
          >
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  1. Understand
                </h4>
                <Badge variant="outline" className="text-[9px] text-emerald-700 border-emerald-300 py-0 bg-emerald-50">meuus.org</Badge>
              </div>
              <p className="text-[11px] text-gray-500 line-clamp-1">Public Governance & The 9 Pillars</p>
            </div>
          </a>

          {/* Domain 2 */}
          <a
            href="#soul-journeys"
            className="p-3.5 rounded-2xl bg-white hover:bg-blue-50/40 border border-gray-200 hover:border-blue-500/60 transition-all flex items-center gap-3.5 group shadow-sm"
          >
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  2. Learn
                </h4>
                <Badge variant="outline" className="text-[9px] text-blue-700 border-blue-300 py-0 bg-blue-50">meuussoul.com</Badge>
              </div>
              <p className="text-[11px] text-gray-500 line-clamp-1">Qur'an, Seerah & Practical Skills</p>
            </div>
          </a>

          {/* Domain 3 */}
          <a
            href="#wellness"
            className="p-3.5 rounded-2xl bg-white hover:bg-purple-50/40 border border-gray-200 hover:border-purple-500/60 transition-all flex items-center gap-3.5 group shadow-sm"
          >
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                  3. Reflect
                </h4>
                <Badge variant="outline" className="text-[9px] text-purple-700 border-purple-300 py-0 bg-purple-50">meUusSoulAI</Badge>
              </div>
              <p className="text-[11px] text-gray-500 line-clamp-1">Mind Beautifier & Emotional Growth</p>
            </div>
          </a>

          {/* Domain 4 */}
          <a
            href="#workspace"
            className="p-3.5 rounded-2xl bg-white hover:bg-sky-50/40 border border-gray-200 hover:border-sky-500/60 transition-all flex items-center gap-3.5 group shadow-sm"
          >
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 group-hover:scale-105 transition-transform">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-gray-900 group-hover:text-sky-700 transition-colors">
                  4. Act & Sync
                </h4>
                <Badge variant="outline" className="text-[9px] text-sky-700 border-sky-300 py-0 bg-sky-50">Workspace & SQL</Badge>
              </div>
              <p className="text-[11px] text-gray-500 line-clamp-1">Sheets, Meet, Forms, Tasks & Cloud SQL</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
