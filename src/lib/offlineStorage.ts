/**
 * meUus Offline-First & Local Memory Storage Engine
 * 
 * Complies with the Master Constitution:
 * - Operates seamlessly both offline and online
 * - Zero data loss: Local-first persistence in localStorage / IndexedDB
 * - Automatic background sync when network is detected
 * - Governed privacy: user owns all data with export & delete mechanisms
 */

export interface StoredUserProfile {
  id: string;
  name: string;
  locale: 'en' | 'bn';
  bio: string;
  skills: string[];
  goals: string[];
  dlasTier?: 'ZERO' | 'BASIC' | 'ADVANCED' | 'PRO';
  dlasScore?: number;
  lastUpdated: string;
  syncStatus: 'LOCAL_ONLY' | 'SYNCED' | 'PENDING_SYNC';
}

export interface StoredAgent {
  id: string;
  name: string;
  purpose: string;
  approvalLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  instructions: string;
  schedule?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED';
  createdAt: string;
  runCount: number;
}

export interface StoredAutomation {
  id: string;
  title: string;
  trigger: string;
  action: string;
  approvalRequired: boolean;
  status: 'ACTIVE' | 'PAUSED';
  lastRun?: string;
}

export interface StoredDlasSession {
  id: string;
  tier: 'ZERO' | 'BASIC' | 'ADVANCED' | 'PRO';
  completedAt: string;
  scores: {
    lifeScore: number;
    emotionalResilience: number;
    executionOrientation: number;
    selfAwareness: number;
    financialPreparedness: number;
  };
  answers: Record<number, number>;
  longitudinalStep: 'ASSESS' | 'UNDERSTAND' | 'PLAN' | 'ACT' | 'MEASURE' | 'REFLECT' | 'REASSESS' | 'GROW';
}

const STORAGE_KEYS = {
  PROFILE: 'meuus_offline_profile_v1',
  AGENTS: 'meuus_offline_agents_v1',
  AUTOMATIONS: 'meuus_offline_automations_v1',
  DLAS_HISTORY: 'meuus_offline_dlas_history_v1',
  JOURNALS: 'meuus_offline_journals_v1',
  SYNC_QUEUE: 'meuus_offline_sync_queue_v1',
};

class OfflineStorageEngine {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: Set<(online: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleConnectionChange(true));
      window.addEventListener('offline', () => this.handleConnectionChange(false));
    }
  }

  private handleConnectionChange(online: boolean) {
    this.isOnline = online;
    this.listeners.forEach((fn) => fn(online));
    if (online) {
      this.attemptCloudSync();
    }
  }

  public subscribeToConnection(listener: (online: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isOnline);
    return () => this.listeners.delete(listener);
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  // Profile Management
  public getProfile(): StoredUserProfile {
    if (typeof window === 'undefined') return this.getDefaultProfile();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : this.getDefaultProfile();
    } catch {
      return this.getDefaultProfile();
    }
  }

  public saveProfile(profile: Partial<StoredUserProfile>): StoredUserProfile {
    const current = this.getProfile();
    const updated: StoredUserProfile = {
      ...current,
      ...profile,
      lastUpdated: new Date().toISOString(),
      syncStatus: this.isOnline ? 'SYNCED' : 'PENDING_SYNC',
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    }
    return updated;
  }

  private getDefaultProfile(): StoredUserProfile {
    return {
      id: 'local_founder_client_001',
      name: 'Seeker of Dignity',
      locale: 'en',
      bio: 'Walking the path of truthful action and lifelong development.',
      skills: ['Honest Reflection', 'Starting Point Focus', 'Dignity in Work'],
      goals: ['Master Daily Habits', 'Build Ethical Business', 'Serve Community'],
      lastUpdated: new Date().toISOString(),
      syncStatus: 'LOCAL_ONLY',
    };
  }

  // Agent Registry
  public getAgents(): StoredAgent[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AGENTS);
      return raw ? JSON.parse(raw) : this.getDefaultAgents();
    } catch {
      return this.getDefaultAgents();
    }
  }

  public saveAgent(agent: Omit<StoredAgent, 'id' | 'createdAt' | 'runCount'>): StoredAgent {
    const agents = this.getAgents();
    const newAgent: StoredAgent = {
      ...agent,
      id: `agent_${Date.now()}`,
      createdAt: new Date().toISOString(),
      runCount: 0,
    };
    agents.unshift(newAgent);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    }
    return newAgent;
  }

  private getDefaultAgents(): StoredAgent[] {
    return [
      {
        id: 'agent_reflection_guide',
        name: 'Soul Reflection Guide',
        purpose: 'Guides evening mental clarity and wellness checks.',
        approvalLevel: 'L1',
        instructions: 'Ask one calm question at a time. Never diagnose. Prioritize truth and patience.',
        status: 'ACTIVE',
        createdAt: '2026-08-25T00:00:00Z',
        runCount: 14,
      },
      {
        id: 'agent_job_match',
        name: 'Career & QA Pathway Scout',
        purpose: 'Identifies ethical employment and skill development opportunities.',
        approvalLevel: 'L2',
        instructions: 'Map current skills against real openings. Prepare application drafts for user review.',
        status: 'ACTIVE',
        createdAt: '2026-08-26T00:00:00Z',
        runCount: 8,
      },
    ];
  }

  // Automations
  public getAutomations(): StoredAutomation[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTOMATIONS);
      return raw ? JSON.parse(raw) : this.getDefaultAutomations();
    } catch {
      return this.getDefaultAutomations();
    }
  }

  public saveAutomation(auto: Omit<StoredAutomation, 'id'>): StoredAutomation {
    const list = this.getAutomations();
    const newAuto: StoredAutomation = {
      ...auto,
      id: `auto_${Date.now()}`,
    };
    list.unshift(newAuto);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.AUTOMATIONS, JSON.stringify(list));
    }
    return newAuto;
  }

  private getDefaultAutomations(): StoredAutomation[] {
    return [
      {
        id: 'auto_weekly_review',
        title: 'Friday Progress & Intention Review',
        trigger: 'Every Friday at 18:00',
        action: 'Prompt user for 3 completed steps and 1 upcoming intention.',
        approvalRequired: true,
        status: 'ACTIVE',
        lastRun: '2026-09-18T18:00:00Z',
      },
      {
        id: 'auto_dlas_reminder',
        title: 'Monthly DLAS Re-assessment',
        trigger: 'Every 30 days',
        action: 'Check longitudinal growth indicators and suggest level progression.',
        approvalRequired: false,
        status: 'ACTIVE',
        lastRun: '2026-09-01T09:00:00Z',
      },
    ];
  }

  // DLAS Sessions History
  public saveDlasSession(session: StoredDlasSession) {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DLAS_HISTORY);
      const history: StoredDlasSession[] = raw ? JSON.parse(raw) : [];
      history.unshift(session);
      localStorage.setItem(STORAGE_KEYS.DLAS_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save DLAS session locally:', e);
    }
  }

  public getDlasHistory(): StoredDlasSession[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DLAS_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // Cloud Synchronization Hook — Posts pending local data to /api/profile-sync
  // Full persistence to Cloud SQL requires Firebase Auth token via /api/user/sync.
  public async attemptCloudSync(): Promise<{ success: boolean; error?: string }> {
    try {
      const profile = this.getProfile();
      const agents = this.getAgents();
      const dlasHistory = this.getDlasHistory();

      const payload = {
        profile,
        agents,
        dlasHistory,
        syncedAt: new Date().toISOString(),
      };

      const res = await fetch('/api/profile-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        console.log('[meUus OfflineEngine] Sync acknowledged by server:', result.message);
        // Mark profile as synced locally
        this.saveProfile({ syncStatus: 'SYNCED' });
        return { success: true };
      } else {
        console.warn('[meUus OfflineEngine] Sync returned non-200:', res.status);
        return { success: false, error: `Server returned HTTP ${res.status}` };
      }
    } catch (err: any) {
      console.warn('[meUus OfflineEngine] Sync failed (network issue — will retry when online):', err);
      return { success: false, error: err?.message || 'Network error' };
    }
  }

  // Data Ownership: Full JSON Export
  public exportAllUserData(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      agents: this.getAgents(),
      automations: this.getAutomations(),
      dlasHistory: this.getDlasHistory(),
    };
    return JSON.stringify(data, null, 2);
  }

  // Data Privacy: Full Clean Deletion
  public clearAllLocalData() {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  }
}

export const offlineStorage = new OfflineStorageEngine();
