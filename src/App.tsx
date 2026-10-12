/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * meUus App — Root Application
 * Human Development, Intelligence & Execution Operating System
 * Founder: Md. Mahady Hasan (Rujbel) · Claim ≤ Evidence · #AnyOneCan#
 *
 * Architecture: AppShell (sidebar + topbar) → route-based content rendering.
 * All 48 components preserved. Heavy components are React.lazy code-split.
 */

import React, { useState, useEffect, Suspense } from 'react';
import AppShell, { type NavRoute } from './components/AppShell';
import Dashboard from './components/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { motion, useScroll, useSpring } from 'motion/react';
import { AgentCoreProvider } from './components/AgentCoreProvider';
import { AuthProvider } from './context/AuthContext';
import { EcosystemProvider } from './context/EcosystemContext';

/* ── Static imports (needed on first paint or very lightweight) ── */
import Hero from './components/Hero';
import VideoExperienceHub from './components/VideoExperienceHub';
import FullEcosystemHub from './components/FullEcosystemHub';
import { WorkspaceCloudSqlHub } from './components/WorkspaceCloudSqlHub';
import FourDomainNavigator from './components/FourDomainNavigator';
import UniversalStartDoor from './components/UniversalStartDoor';
import InteractiveAppShowcase from './components/InteractiveAppShowcase';
import StartingPointDashboard from './components/StartingPointDashboard';
import QuranSeerahJourneys from './components/QuranSeerahJourneys';
import PhotoAlbumGallery from './components/PhotoAlbumGallery';
import KnowledgeHub from './components/KnowledgeHub';
import PillarsGrid from './components/PillarsGrid';
import WellnessCheck from './components/WellnessCheck';
import IdeaLabGate from './components/IdeaLabGate';
import GoogleClassroomHub from './components/GoogleClassroomHub';
import ProjectTechOverview from './components/ProjectTechOverview';
import FounderStory from './components/FounderStory';
import HumanJourneyKernel from './components/HumanJourneyKernel';
import UniversalMeYooOS from './components/UniversalMeYooOS';
import Roadmap from './components/Roadmap';
import Footer from './components/Footer';
import GeminiChatDrawer from './components/GeminiChatDrawer';

/* ── Lazy-loaded heavy components ── */
const ConnectedEcosystemHub = React.lazy(() => import('./components/ConnectedEcosystemHub'));
const SoulProfileManager = React.lazy(() => import('./components/SoulProfileManager'));
const DlasEngine = React.lazy(() => import('./components/DlasEngine'));
const GeminiIntelligenceSuite = React.lazy(() => import('./components/GeminiIntelligenceSuite'));
const WorkStationSuite = React.lazy(() => import('./components/WorkStationSuite'));
const MarketplaceExchange = React.lazy(() => import('./components/MarketplaceExchange'));
const EducationSystemHub = React.lazy(() => import('./components/EducationSystemHub'));
const PreservedWorkShowcase = React.lazy(() => import('./components/PreservedWorkShowcase'));
const MeUusStudio = React.lazy(() => import('./components/MeUusStudio'));
const SelfBuildingEcosystem = React.lazy(() => import('./components/SelfBuildingEcosystem'));
const CareerSkillGraph = React.lazy(() => import('./components/CareerSkillGraph'));
const TransparencyDashboard = React.lazy(() => import('./components/TransparencyDashboard'));

/* ── Standalone page routes (lazy) ── */
const EvidencePage = React.lazy(() => import('./components/EvidencePage'));
const SafetyPage = React.lazy(() => import('./components/SafetyPage'));
const AccessibilityPage = React.lazy(() => import('./components/AccessibilityPage'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
const AppreciationPage = React.lazy(() => import('./components/AppreciationPage'));

/* ── Loader ── */
function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-24 min-h-[40vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 animate-spin border-2 border-emerald-500 border-t-transparent" />
        <span className="text-slate-500 text-sm font-mono">Loading section…</span>
      </div>
    </div>
  );
}

/* ── Section wrapper with scroll reveal ── */
function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* ── Route → Content mapping ── */
function RouteContent({
  route,
  onNavigate,
}: {
  route: NavRoute;
  onNavigate: (r: NavRoute) => void;
}) {
  const wrap = (content: React.ReactNode, name: string, id?: string) => (
    <ErrorBoundary sectionName={name}>
      <Suspense fallback={<SectionLoader />}>
        <Section id={id}>{content}</Section>
      </Suspense>
    </ErrorBoundary>
  );

  switch (route) {
    /* ── Core OS ── */
    case 'dashboard':
      return (
        <ErrorBoundary sectionName="Dashboard">
          <Dashboard onNavigate={(r) => onNavigate(r as NavRoute)} />
        </ErrorBoundary>
      );

    case 'connected-ecosystem':
      return wrap(<ConnectedEcosystemHub />, 'Connected Ecosystem', 'connected-ecosystem');

    case 'meyoo':
      return wrap(<UniversalMeYooOS />, 'meYoo OS', 'meyoo');

    case 'start-door':
      return wrap(<UniversalStartDoor />, 'Universal Start Door', 'start');

    /* ── Intelligence ── */
    case 'ai-suite':
      return wrap(<GeminiIntelligenceSuite />, 'Gemini AI Suite', 'ai-suite');

    case 'workstation':
      return wrap(<WorkStationSuite />, 'WorkStation', 'workstation');

    case 'studio':
      return wrap(<MeUusStudio />, 'meUus Studio', 'studio');

    case 'self-building':
      return wrap(<SelfBuildingEcosystem />, 'Self-Building Module', 'self-building');

    case 'dlas':
      return wrap(<DlasEngine />, 'DLAS Engine', 'dlas');

    /* ── Growth ── */
    case 'soul-profile':
      return wrap(<SoulProfileManager />, 'Soul Profile Manager', 'soul');

    case 'career-graph':
      return wrap(<CareerSkillGraph />, 'Career Skill Graph', 'career-skill-graph');

    case 'wellness':
      return wrap(<WellnessCheck />, 'Mind Wellness', 'wellness');

    /* ── Knowledge ── */
    case 'education':
      return wrap(<EducationSystemHub />, 'Education Hub', 'education');

    case 'knowledge':
      return wrap(<KnowledgeHub />, 'Knowledge Hub', 'knowledge');

    case 'quran-seerah':
      return wrap(<QuranSeerahJourneys />, 'Quran & Seerah', 'soul-journeys');

    case 'classroom':
      return wrap(<GoogleClassroomHub />, 'Google Classroom', 'classroom');

    /* ── Ecosystem ── */
    case 'marketplace':
      return wrap(<MarketplaceExchange />, 'Marketplace', 'marketplace');

    case 'full-ecosystem':
      return wrap(<FullEcosystemHub />, 'Full Ecosystem Hub', 'full-ecosystem');

    case 'workspace-sql':
      return wrap(<WorkspaceCloudSqlHub />, 'Workspace & Cloud SQL', 'workspace');

    case 'four-domains':
      return wrap(<FourDomainNavigator />, 'Four Domain Navigator', 'four-domains');

    case 'human-journey':
      return wrap(<HumanJourneyKernel />, 'Human Journey Kernel', 'human-journey');

    case 'idea-lab':
      return wrap(<IdeaLabGate />, 'Idea Lab', 'idea-lab');

    case 'starting-point':
      return wrap(<StartingPointDashboard />, 'Starting Point Dashboard', 'dashboard');

    /* ── Media ── */
    case 'video':
      return wrap(<VideoExperienceHub />, 'Video Experience', 'video-experience');

    case 'photo-album':
      return wrap(<PhotoAlbumGallery />, 'Photo Gallery', 'photo-album');

    case 'app-preview':
      return wrap(<InteractiveAppShowcase />, 'App Showcase', 'app-preview');

    /* ── Foundation ── */
    case 'founder':
      return wrap(<FounderStory />, 'Founder Story', 'founder');

    case 'preservation':
      return wrap(<PreservedWorkShowcase />, 'Preserved Work', 'preservation');

    case 'transparency':
      return wrap(<TransparencyDashboard />, 'Transparency Dashboard', 'transparency');

    case 'roadmap':
      return wrap(<Roadmap />, 'Roadmap', 'roadmap');

    case 'pillars':
      return wrap(<PillarsGrid />, 'Nine Pillars', 'pillars');

    case 'tech-overview':
      return wrap(<ProjectTechOverview />, 'Tech Overview', 'tech-overview');

    /* ── Trust / Standalone pages ── */
    case 'evidence':
      return wrap(<EvidencePage />, 'Evidence Page', 'evidence');

    case 'safety':
      return wrap(<SafetyPage />, 'Safety Page', 'safety');

    case 'accessibility':
      return wrap(<AccessibilityPage />, 'Accessibility Page', 'accessibility');

    case 'about':
      return wrap(<AboutPage />, 'About Page', 'about');

    case 'appreciation':
      return wrap(<AppreciationPage />, 'Appreciation Page', 'appreciation');

    default:
      return (
        <ErrorBoundary sectionName="Dashboard">
          <Dashboard onNavigate={(r) => onNavigate(r as NavRoute)} />
        </ErrorBoundary>
      );
  }
}

/* ── Hash/path → NavRoute mapping ── */
function hashToRoute(hash: string, path: string): NavRoute {
  const active = (hash.replace('#', '') || path.replace('/', '')).toLowerCase();
  const MAP: Record<string, NavRoute> = {
    evidence: 'evidence',
    safety: 'safety',
    accessibility: 'accessibility',
    about: 'about',
    appreciation: 'appreciation',
    'connected-ecosystem': 'connected-ecosystem',
    meyoo: 'meyoo',
    start: 'start-door',
    'start-door': 'start-door',
    'ai-suite': 'ai-suite',
    workstation: 'workstation',
    studio: 'studio',
    'self-building': 'self-building',
    dlas: 'dlas',
    soul: 'soul-profile',
    'soul-profile': 'soul-profile',
    'career-skill-graph': 'career-graph',
    'career-graph': 'career-graph',
    wellness: 'wellness',
    education: 'education',
    knowledge: 'knowledge',
    'soul-journeys': 'quran-seerah',
    'quran-seerah': 'quran-seerah',
    classroom: 'classroom',
    marketplace: 'marketplace',
    'full-ecosystem': 'full-ecosystem',
    workspace: 'workspace-sql',
    'workspace-sql': 'workspace-sql',
    'four-domains': 'four-domains',
    'human-journey': 'human-journey',
    'idea-lab': 'idea-lab',
    'starting-point': 'starting-point',
    dashboard: 'starting-point',
    'video-experience': 'video',
    video: 'video',
    'photo-album': 'photo-album',
    'app-preview': 'app-preview',
    founder: 'founder',
    preservation: 'preservation',
    transparency: 'transparency',
    roadmap: 'roadmap',
    pillars: 'pillars',
    'tech-overview': 'tech-overview',
    'self-building-ecosystem': 'self-building',
    'meyoo-os': 'meyoo',
  };
  return MAP[active] || 'dashboard';
}

/* ── Root App ── */
export default function App() {
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('dashboard');

  /* Route detection from URL hash/path */
  useEffect(() => {
    const handleRouteChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.replace('/', '').toLowerCase();
      setCurrentRoute(hashToRoute(hash, path));
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      const main = document.getElementById('main-content');
      if (main) main.scrollTop = 0;
    };
    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  /* Navigate programmatically */
  const handleNavigate = (route: NavRoute) => {
    setCurrentRoute(route);
    window.history.pushState(null, '', `#${route}`);
    // Scroll content area back to top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const main = document.getElementById('main-content');
    if (main) main.scrollTop = 0;
  };

  /* Scroll progress bar (tracks window scroll) */
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <AuthProvider>
      <AgentCoreProvider>
        <EcosystemProvider>
          <AppShell currentRoute={currentRoute} onNavigate={handleNavigate}>
            {/* Scroll Progress Bar */}
            <motion.div
              className="fixed top-16 left-0 right-0 h-[2px] bg-emerald-500 origin-left z-50 pointer-events-none"
              style={{ scaleX }}
            />

            <RouteContent route={currentRoute} onNavigate={handleNavigate} />

            {/* Footer shown on dashboard and full-page routes */}
            {(currentRoute === 'dashboard' ||
              currentRoute === 'evidence' ||
              currentRoute === 'safety' ||
              currentRoute === 'accessibility' ||
              currentRoute === 'about' ||
              currentRoute === 'appreciation' ||
              currentRoute === 'founder' ||
              currentRoute === 'roadmap') && <Footer />}

            {/* Floating AI Chat — accessible from all routes */}
            <GeminiChatDrawer />
          </AppShell>
        </EcosystemProvider>
      </AgentCoreProvider>
    </AuthProvider>
  );
}
