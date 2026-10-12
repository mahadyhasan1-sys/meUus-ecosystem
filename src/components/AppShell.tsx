/**
 * AppShell — meUus Professional Light-Theme Sidebar Layout
 * Design reference: Clean Qodo-style sidebar with white/gray palette + emerald accent.
 * Founder: Md. Mahady Hasan (Rujbel) · Claim ≤ Evidence
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Cpu,
  BookOpen,
  ShoppingBag,
  Briefcase,
  Heart,
  Star,
  Users,
  Globe,
  Lightbulb,
  Camera,
  GraduationCap,
  BarChart3,
  Shield,
  Info,
  Menu,
  X,
  Sparkles,
  Wifi,
  WifiOff,
  Bell,
  ChevronRight,
  ChevronDown,
  Zap,
  Brain,
  Building2,
  Layers,
  Map,
  Code2,
  FileText,
  TrendingUp,
  MessageCircle,
  Play,
  Award,
  Search,
  Plus,
  LogIn,
  LogOut,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEcosystem } from '../context/EcosystemContext';
import { offlineStorage } from '../lib/offlineStorage';

/* ── Route type ── */
export type NavRoute =
  | 'dashboard' | 'connected-ecosystem' | 'meyoo' | 'ai-suite' | 'workstation'
  | 'studio' | 'self-building' | 'dlas' | 'soul-profile' | 'career-graph'
  | 'wellness' | 'marketplace' | 'education' | 'knowledge' | 'quran-seerah'
  | 'video' | 'full-ecosystem' | 'workspace-sql' | 'human-journey' | 'four-domains'
  | 'start-door' | 'app-preview' | 'starting-point' | 'photo-album' | 'pillars'
  | 'idea-lab' | 'classroom' | 'tech-overview' | 'founder' | 'preservation'
  | 'transparency' | 'roadmap' | 'evidence' | 'safety' | 'accessibility'
  | 'about' | 'appreciation';

/* ── Nav structure ── */
interface NavItem {
  id: NavRoute;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  collapsible?: boolean;
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: '',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
      { id: 'start-door', label: 'Universal Start Door', icon: <Zap size={15} /> },
    ],
  },
  {
    title: 'Intelligence',
    collapsible: true,
    items: [
      { id: 'ai-suite', label: 'Gemini AI Suite', icon: <Cpu size={15} />, badge: 'AI' },
      { id: 'workstation', label: 'WorkStation', icon: <Code2 size={15} /> },
      { id: 'studio', label: 'meUus Studio', icon: <Layers size={15} /> },
      { id: 'self-building', label: 'Self-Building Module', icon: <Building2 size={15} /> },
      { id: 'dlas', label: 'DLAS Engine', icon: <TrendingUp size={15} /> },
      { id: 'meyoo', label: 'meYoo AI OS', icon: <Brain size={15} /> },
    ],
  },
  {
    title: 'Personal Growth',
    collapsible: true,
    items: [
      { id: 'soul-profile', label: 'Soul Profile', icon: <Star size={15} /> },
      { id: 'career-graph', label: 'Career Skill Graph', icon: <BarChart3 size={15} /> },
      { id: 'wellness', label: 'Mind Wellness', icon: <Heart size={15} /> },
    ],
  },
  {
    title: 'Knowledge',
    collapsible: true,
    items: [
      { id: 'education', label: 'Education Hub', icon: <GraduationCap size={15} /> },
      { id: 'knowledge', label: 'Knowledge Library', icon: <BookOpen size={15} /> },
      { id: 'quran-seerah', label: 'Quran & Seerah', icon: <Star size={15} /> },
      { id: 'classroom', label: 'Google Classroom', icon: <Globe size={15} /> },
    ],
  },
  {
    title: 'Ecosystem',
    collapsible: true,
    items: [
      { id: 'connected-ecosystem', label: '#TheLast&TheFirst#', icon: <Sparkles size={15} />, badge: 'Live' },
      { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag size={15} /> },
      { id: 'full-ecosystem', label: '9-Hub Ecosystem', icon: <Layers size={15} /> },
      { id: 'workspace-sql', label: 'Workspace & Cloud SQL', icon: <Briefcase size={15} /> },
      { id: 'four-domains', label: 'Four Domains', icon: <Map size={15} /> },
      { id: 'idea-lab', label: 'Idea Lab', icon: <Lightbulb size={15} /> },
    ],
  },
  {
    title: 'Media',
    collapsible: true,
    items: [
      { id: 'video', label: 'Video Experience', icon: <Play size={15} /> },
      { id: 'photo-album', label: 'Photo Gallery', icon: <Camera size={15} /> },
      { id: 'app-preview', label: 'App Showcase', icon: <Cpu size={15} /> },
    ],
  },
  {
    title: 'Foundation',
    collapsible: true,
    items: [
      { id: 'founder', label: 'Founder Story', icon: <Award size={15} /> },
      { id: 'preservation', label: 'Preserved Work', icon: <FileText size={15} /> },
      { id: 'transparency', label: 'Transparency', icon: <Shield size={15} /> },
      { id: 'roadmap', label: 'Roadmap', icon: <TrendingUp size={15} /> },
      { id: 'pillars', label: 'Nine Pillars', icon: <Building2 size={15} /> },
    ],
  },
];

const BOTTOM_LINKS: NavItem[] = [
  { id: 'knowledge', label: 'Knowledge Center', icon: <BookOpen size={15} /> },
  { id: 'evidence', label: 'Evidence', icon: <Shield size={15} /> },
  { id: 'accessibility', label: 'Accessibility', icon: <Users size={15} /> },
  { id: 'about', label: 'About meUus', icon: <Info size={15} /> },
];

interface AppShellProps {
  currentRoute: NavRoute;
  onNavigate: (route: NavRoute) => void;
  children: React.ReactNode;
}

function NavGroupSection({
  group,
  currentRoute,
  onNavigate,
}: {
  group: NavGroup;
  currentRoute: NavRoute;
  onNavigate: (r: NavRoute) => void;
}) {
  const [open, setOpen] = useState(true);
  const hasActive = group.items.some((i) => i.id === currentRoute);

  return (
    <div className="mb-1">
      {group.title && (
        <button
          onClick={() => group.collapsible && setOpen(!open)}
          className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider select-none ${
            group.collapsible ? 'cursor-pointer hover:text-gray-700' : 'cursor-default'
          } text-gray-400`}
        >
          <span>{group.title}</span>
          {group.collapsible && (
            <motion.span
              animate={{ rotate: open ? 0 : -90 }}
              transition={{ duration: 0.15 }}
            >
              <ChevronDown size={12} />
            </motion.span>
          )}
        </button>
      )}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {group.items.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  title={item.label}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] transition-all duration-100 text-left
                    ${isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-normal'
                    }
                  `}
                >
                  <span className={`flex-shrink-0 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AppShell({ currentRoute, onNavigate, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signInWithGoogle, logout, loading } = useAuth();
  const { openAiGuide } = useEcosystem();
  const activeTabRef = React.useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const unsub = offlineStorage.subscribeToConnection((online) => setIsOnline(online));
    return () => unsub();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    // Scroll active file tab into view in the horizontal tab strip
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
        block: 'nearest',
      });
    }
    // Pull main content area and window to top on route change
    const main = document.getElementById('main-content');
    if (main) main.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentRoute]);

  /* ── Search filter ── */
  const allItems = NAV_GROUPS.flatMap((g) => g.items);
  const searchResults = searchQuery.trim()
    ? allItems.filter((i) => i.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const currentItem = allItems.find((n) => n.id === currentRoute);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-gray-200 flex-shrink-0">
        <div
          className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-serif font-bold text-sm flex-shrink-0"
          aria-hidden="true"
        >
          m
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-gray-900 leading-tight">meUus</div>
          <div className="text-[10px] text-gray-400 font-mono leading-none">me → U → us</div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          aria-label="Close navigation"
        >
          <X size={16} />
        </button>
      </div>

      {/* Quick actions */}
      <div className="px-3 py-3 border-b border-gray-100 flex-shrink-0 space-y-1">
        <button
          onClick={() => openAiGuide()}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label="Start new AI task"
        >
          <Plus size={15} className="text-gray-400" />
          <span>New Task</span>
        </button>
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label="Search sections"
        >
          <Search size={15} className="text-gray-400" />
          <span>Search</span>
        </button>
      </div>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-white flex flex-col"
          >
            <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-200">
              <Search size={15} className="text-gray-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sections…"
                className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
                aria-label="Search meUus sections"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2 px-2">
              {searchQuery && searchResults.length === 0 && (
                <p className="text-xs text-gray-400 px-3 py-4">No results for "{searchQuery}"</p>
              )}
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setSearchOpen(false); setSearchQuery(''); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className="text-gray-400">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              {!searchQuery && allItems.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setSearchOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className="text-gray-400">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav groups — scrollable */}
      <nav
        aria-label="Main navigation"
        className="flex-1 overflow-y-auto py-2 px-2 space-y-0 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
      >
        {NAV_GROUPS.map((group) => (
          <NavGroupSection
            key={group.title || 'root'}
            group={group}
            currentRoute={currentRoute}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Divider + Bottom links */}
      <div className="flex-shrink-0 border-t border-gray-200 px-2 py-2">
        {BOTTOM_LINKS.map((item) => {
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className={isActive ? 'text-emerald-600' : 'text-gray-400'}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* User footer */}
      <div className="flex-shrink-0 border-t border-gray-200 px-3 py-3">
        {loading ? (
          <div className="h-8 bg-gray-100 rounded-lg animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-2.5">
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=059669&color=fff&size=32`}
              alt={user.displayName || 'User'}
              className="w-7 h-7 rounded-full border border-gray-200 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-gray-900 truncate leading-tight">
                {user.displayName}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded" aria-label="Help">
                <HelpCircle size={14} />
              </button>
              <button onClick={logout} className="p-1 text-gray-400 hover:text-gray-600 rounded" aria-label="Sign out">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold transition-colors"
            aria-label="Sign in with Google"
          >
            <LogIn size={14} />
            Sign In with Google
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 text-gray-900">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — desktop always visible, mobile slide-in */}
      <aside
        className={`
          fixed lg:relative z-50 lg:z-auto
          flex flex-col w-[230px] h-full flex-shrink-0
          transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="App navigation sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center h-14 px-4 lg:px-6 border-b border-gray-200 bg-white gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 rounded text-gray-500 hover:bg-gray-100"
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm min-w-0">
            <span className="text-gray-400 hidden sm:block">meUus</span>
            <ChevronRight size={13} className="text-gray-300 hidden sm:block" />
            <span className="font-medium text-gray-800 truncate">
              {currentItem?.label || 'Dashboard'}
            </span>
          </div>

          <div className="flex-1" />

          {/* Right: status + actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Online status */}
            <div className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
              isOnline
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
              <span className="font-medium">{isOnline ? 'Live' : 'Offline'}</span>
            </div>

            {/* Notification bell */}
            <button
              className="relative p-1.5 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>

            {/* AI Chat button */}
            <button
              onClick={() => openAiGuide()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm"
              aria-label="Open AI chat"
            >
              <MessageCircle size={13} />
              <span className="hidden sm:inline">AI Chat</span>
            </button>
          </div>
        </header>

        {/* ── File-View Tab Strip (VS Code style — all sections as horizontal tabs) ── */}
        <nav
          aria-label="Page tab bar"
          className="flex-shrink-0 flex items-end gap-0 overflow-x-auto bg-white border-b border-gray-200 px-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {NAV_GROUPS.flatMap((g) => g.items).map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                ref={isActive ? activeTabRef : null}
                onClick={() => onNavigate(item.id)}
                title={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium whitespace-nowrap border-b-2 transition-all duration-100 flex-shrink-0
                  ${isActive
                    ? 'border-emerald-500 text-emerald-700 bg-emerald-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                  }
                `}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[8px] font-bold px-1 py-0.5 rounded-full ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Content area */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto bg-gray-50"
          tabIndex={-1}
          aria-label="Main content area"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoute}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Status bar — like the Qodo bottom bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 h-8 border-t border-gray-200 bg-white text-[11px] text-gray-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              MEUUS_ECOSYSTEM
            </span>
            <span>{isOnline ? 'Online' : 'Local'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Claim ≤ Evidence</span>
            <span className="text-emerald-600 font-semibold">#AnyOneCan#</span>
          </div>
        </div>
      </div>
    </div>
  );
}
