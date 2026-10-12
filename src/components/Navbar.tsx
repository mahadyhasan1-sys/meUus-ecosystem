import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sparkles, User as UserIcon, LogIn, LogOut, Cloud, ShieldCheck, Smartphone, BookOpen, ImageIcon, Cpu, PhoneCall, ShieldAlert, Database, RefreshCw, Download, CheckCircle2, HardDrive } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EmergencyTriageModal from './EmergencyTriageModal';
import { offlineStorage } from '../lib/offlineStorage';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isMemoryPopoverOpen, setIsMemoryPopoverOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const { user, profile, signInWithGoogle, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const unsub = offlineStorage.subscribeToConnection((online) => {
      setIsOnline(online);
    });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsub();
    };
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await offlineStorage.attemptCloudSync();
      if (res.success) {
        setSyncFeedback('Echo synced successfully');
      } else {
        setSyncFeedback('Local memory queued');
      }
    } catch {
      setSyncFeedback('Local memory preserved');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncFeedback(null), 3000);
    }
  };

  const handleDownloadBackup = () => {
    const data = offlineStorage.exportAllUserData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meuus-sovereign-memory-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const navLinks = [
    { name: '#TheLast&TheFirst#', href: '#connected-ecosystem' },
    { name: 'meYoo OS', href: '#meyoo' },
    { name: 'Full Ecosystem', href: '#full-ecosystem' },
    { name: 'Workspace & SQL', href: '#workspace' },
    { name: 'Video Showcase', href: '#video-experience' },
    { name: 'The 9 Hubs', href: '#pillars' },
    { name: 'Start Door', href: '#start' },
    { name: 'WorkStation', href: '#workstation' },
    { name: 'Studio', href: '#studio' },
    { name: 'Self-Building', href: '#self-building' },
    { name: 'Skill Graph', href: '#career-skill-graph' },
    { name: 'App Studio', href: '#app-preview' },
    { name: 'Mind Wellness', href: '#wellness' },
    { name: 'Quran & Seerah', href: '#soul-journeys' },
    { name: 'Soul Profile', href: '#soul' },
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Marketplace', href: '#marketplace' },
    { name: 'Founder', href: '#founder' },
  ];

  return (
    <>
      <nav role="navigation" aria-label="Main navigation" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm text-gray-900' : 'py-4 bg-white/85 backdrop-blur-sm border-b border-gray-100 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-serif font-bold text-xl group-hover:rotate-6 transition-transform shadow-md shadow-emerald-600/20">
              m
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-serif font-bold tracking-tight text-gray-900">meUus</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Starting Point
                </span>
              </div>
              <p className="text-[10px] font-mono text-gray-500 -mt-0.5">me → U → us</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-3">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`text-[11px] font-semibold uppercase tracking-wider font-mono transition-colors ${
                  link.name === 'Gemini AI'
                    ? 'text-emerald-600 font-bold hover:text-emerald-700'
                    : link.name === 'App Preview'
                    ? 'text-teal-600 hover:text-teal-700'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                {link.name}
              </a>
            ))}

            {/* Emergency Hotline Ping Trigger */}
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="px-2.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 hover:text-rose-800 text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 shadow-sm"
              title="15-Minute Crisis & Emergency Protocol"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>15-Min Crisis</span>
            </button>

            {/* Interactive Offline / Sovereign Memory Control */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsMemoryPopoverOpen(!isMemoryPopoverOpen)}
                aria-expanded={isMemoryPopoverOpen}
                aria-haspopup="dialog"
                aria-label="Offline storage and connection status"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold transition-all ${
                  isOnline 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100' 
                    : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                }`}
                title={isOnline ? 'Online: Local-First with Cloud Sync' : 'Offline: Sovereign Local Memory Active'}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`}></span>
                <span>{isOnline ? 'Online & Synced' : 'Offline Memory'}</span>
              </button>

              {isMemoryPopoverOpen && (
                <div 
                  role="dialog" 
                  aria-label="Sovereign Memory and Sync Dashboard"
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-gray-200 shadow-xl p-4 text-xs space-y-3 z-50 text-gray-900"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <HardDrive className={`w-4 h-4 ${isOnline ? 'text-emerald-600' : 'text-amber-600'}`} />
                      <span className="font-bold text-gray-900">Sovereign Memory</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isOnline ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  {/* Local Storage Telemetry */}
                  <div className="space-y-1.5 text-[11px] text-gray-700 bg-gray-50 rounded-xl p-2.5 border border-gray-200 font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Local Profile:</span>
                      <span className="text-emerald-600 truncate max-w-[120px] font-medium">{offlineStorage.getProfile()?.name || 'Local Citizen'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Active Agents:</span>
                      <span className="text-gray-900 font-bold">{offlineStorage.getAgents()?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">DLAS Assessments:</span>
                      <span className="text-gray-900 font-bold">{offlineStorage.getDlasHistory()?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">PWA Cache:</span>
                      <span className="text-emerald-600 font-medium">v2 Ready</span>
                    </div>
                  </div>

                  {syncFeedback && (
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] text-center font-mono">
                      {syncFeedback}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleManualSync}
                      disabled={syncing}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center justify-center gap-1 transition-all text-xs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                      <span>{syncing ? 'Syncing...' : 'Sync Echo'}</span>
                    </button>
                    <button
                      onClick={handleDownloadBackup}
                      className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg font-semibold flex items-center justify-center transition-all border border-gray-200"
                      title="Download Sovereign JSON Memory Backup"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Firebase Authentication Button / Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-emerald-500 transition-all text-xs text-gray-800"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-emerald-500" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <span className="max-w-[90px] truncate font-medium">{user.displayName || user.email?.split('@')[0]}</span>
                  <Cloud className="w-3 h-3 text-emerald-600" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-gray-200 shadow-xl p-4 text-xs space-y-3 z-50 text-gray-900">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-gray-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-bold text-gray-900 truncate">{user.displayName || 'Citizen'}</div>
                        <div className="text-[10px] text-gray-500 truncate">{user.email}</div>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-gray-600">
                      <div className="flex justify-between">
                        <span>Firestore Sync:</span>
                        <span className="text-emerald-600 font-mono font-bold">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Security Mode:</span>
                        <span className="text-gray-700 font-mono">Default-Deny</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full py-2 bg-gray-100 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all border border-gray-200"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-emerald-500 text-xs font-semibold text-gray-700 hover:text-gray-900 transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sign In</span>
              </button>
            )}

            <a
              href="#start"
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Door</span>
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              aria-label="Open emergency crisis triage modal"
              className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </button>
            <button 
              className="p-2 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden bg-white border-b border-gray-200 px-6 py-6 space-y-4 shadow-xl"
            >
              <div className="grid grid-cols-2 gap-3 text-xs">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                {user ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="text-xs text-emerald-700 font-mono">Signed in as {user.displayName}</div>
                    <button onClick={() => logout()} className="text-xs text-rose-600 font-bold">Sign Out</button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      signInWithGoogle();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-gray-100 border border-gray-200 text-gray-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-emerald-600" /> Sign In with Google
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 15-Minute Human Emergency Triage Modal */}
      <EmergencyTriageModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </>
  );
}
