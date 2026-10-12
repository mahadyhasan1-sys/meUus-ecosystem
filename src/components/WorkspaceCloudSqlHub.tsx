import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import { 
  Database, 
  Briefcase,
  FileSpreadsheet, 
  Video, 
  FileText, 
  CheckSquare, 
  RefreshCw, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  User as UserIcon,
  Copy,
  Send,
  AlertCircle
} from 'lucide-react';
import { auth, loginWithGoogle, logoutUser, getGoogleAccessToken, User } from '../lib/firebase.ts';
import { onAuthStateChanged } from 'firebase/auth';

interface WorkspaceItem {
  id: number;
  hubId: string;
  title: string;
  content: string | null;
  category: string | null;
  externalId: string | null;
  externalUrl: string | null;
  isCompleted: boolean;
  createdAt: string;
}

interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  status: string;
  due?: string;
}

export const WorkspaceCloudSqlHub: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(getGoogleAccessToken());
  const [activeTab, setActiveTab] = useState<'overview' | 'sheets' | 'meet' | 'forms' | 'tasks' | 'cloudsql'>('overview');

  // Cloud SQL sync state
  const [cloudSqlConnected, setCloudSqlConnected] = useState<boolean>(true);
  const [syncedItems, setSyncedItems] = useState<WorkspaceItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // Google Sheets state
  const [sheetTitle, setSheetTitle] = useState('meUus 64-District Strategic Tracker');
  const [createdSheet, setCreatedSheet] = useState<{ spreadsheetId: string; spreadsheetUrl: string; title: string } | null>(null);
  const [creatingSheet, setCreatingSheet] = useState(false);
  const [sheetReadData, setSheetReadData] = useState<any>(null);
  const [readingSheet, setReadingSheet] = useState(false);

  // Google Meet state
  const [meetTopic, setMeetTopic] = useState('meUus Soul Reflection & Community Dialogue');
  const [createdMeeting, setCreatedMeeting] = useState<{ meetingUri: string; meetingCode?: string; topic?: string } | null>(null);
  const [creatingMeeting, setCreatingMeeting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Google Forms state
  const [formTitle, setFormTitle] = useState('meUus Citizen Empowerment & Growth Survey');
  const [createdForm, setCreatedForm] = useState<{ formId: string; responderUri: string; title: string } | null>(null);
  const [creatingForm, setCreatingForm] = useState(false);

  // Google Tasks state
  const [tasks, setTasks] = useState<GoogleTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('Consistent, Honest Action Over Perfection');
  const [creatingTask, setCreatingTask] = useState(false);

  // Notification message
  const [bannerMsg, setBannerMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
      const token = getGoogleAccessToken();
      setAccessToken(token);

      if (user) {
        try {
          const idToken = await user.getIdToken();
          // Sync with Cloud SQL
          await fetch('/api/user/sync', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${idToken}`,
              'Content-Type': 'application/json',
            },
          });
          loadCloudSqlItems(idToken);
          if (token) {
            loadGoogleTasks(token);
          }
        } catch (e) {
          console.error('Error syncing user with Cloud SQL:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setBannerMsg(null);
      const { user, token } = await loginWithGoogle();
      setCurrentUser(user);
      setAccessToken(token);
      setBannerMsg({ type: 'success', text: `Welcome, ${user.displayName || user.email}! Connected to Google Workspace & Cloud SQL.` });
      
      const idToken = await user.getIdToken();
      await fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
      loadCloudSqlItems(idToken);
      if (token) {
        loadGoogleTasks(token);
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setBannerMsg({ type: 'error', text: err.message || 'Google Sign-In failed. Please try again.' });
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    setCurrentUser(null);
    setAccessToken(null);
    setSyncedItems([]);
    setTasks([]);
    setBannerMsg({ type: 'info', text: 'You have signed out.' });
  };

  const loadCloudSqlItems = async (idToken: string) => {
    try {
      setLoadingItems(true);
      const res = await fetch('/api/workspace/items', {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSyncedItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load items from Cloud SQL:', err);
    } finally {
      setLoadingItems(false);
    }
  };

  const loadGoogleTasks = async (token: string) => {
    try {
      setLoadingTasks(true);
      const res = await fetch('/api/google/tasks/list?tasklist=@default', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load tasks from Google Tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Google Sheets Action
  const handleCreateSheet = async () => {
    if (!accessToken) {
      setBannerMsg({ type: 'error', text: 'Please sign in with Google to create spreadsheets in your Google Drive.' });
      return;
    }
    try {
      setCreatingSheet(true);
      const res = await fetch('/api/google/sheets/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: sheetTitle,
          initialHeaders: ['meUus Ecosystem Hub', 'Action Objective', 'Target Region', 'Status', 'Date']
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCreatedSheet(data);
        setBannerMsg({ type: 'success', text: `Google Sheet "${data.title}" successfully created in your Google Drive!` });
        
        // Save link to Cloud SQL
        if (currentUser) {
          const idToken = await currentUser.getIdToken();
          await fetch('/api/workspace/items', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              hubId: 'google-sheets',
              title: data.title,
              content: `Spreadsheet ID: ${data.spreadsheetId}`,
              category: 'sheets',
              externalId: data.spreadsheetId,
              externalUrl: data.spreadsheetUrl,
            })
          });
          loadCloudSqlItems(idToken);
        }
      } else {
        setBannerMsg({ type: 'error', text: data.error || 'Failed to create Google Sheet.' });
      }
    } catch (err: any) {
      setBannerMsg({ type: 'error', text: err.message || 'Error communicating with Google Sheets API' });
    } finally {
      setCreatingSheet(false);
    }
  };

  const handleReadSheet = async () => {
    if (!accessToken || !createdSheet?.spreadsheetId) return;
    try {
      setReadingSheet(true);
      const res = await fetch(`/api/google/sheets/read?spreadsheetId=${createdSheet.spreadsheetId}&range=A1:E10`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSheetReadData(data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setReadingSheet(false);
    }
  };

  // Google Meet Action
  const handleCreateMeet = async () => {
    if (!accessToken) {
      setBannerMsg({ type: 'error', text: 'Please sign in with Google to create Google Meet spaces.' });
      return;
    }
    try {
      setCreatingMeeting(true);
      const res = await fetch('/api/google/meet/create-space', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic: meetTopic })
      });
      const data = await res.json();
      if (res.ok) {
        setCreatedMeeting(data);
        setBannerMsg({ type: 'success', text: 'Google Meet conference space generated successfully!' });

        // Save reference to Cloud SQL
        if (currentUser) {
          const idToken = await currentUser.getIdToken();
          await fetch('/api/workspace/items', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              hubId: 'google-meet',
              title: meetTopic,
              content: `Meeting Room Link: ${data.meetingUri}`,
              category: 'meet',
              externalId: data.name,
              externalUrl: data.meetingUri,
            })
          });
          loadCloudSqlItems(idToken);
        }
      }
    } catch (err: any) {
      setBannerMsg({ type: 'error', text: err.message || 'Failed to create Google Meet space' });
    } finally {
      setCreatingMeeting(false);
    }
  };

  // Google Forms Action
  const handleCreateForm = async () => {
    if (!accessToken) {
      setBannerMsg({ type: 'error', text: 'Please sign in with Google to create Google Forms.' });
      return;
    }
    try {
      setCreatingForm(true);
      const res = await fetch('/api/google/forms/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formTitle,
          description: 'A structured community feedback & reflection survey powered by meUus & Google Forms.'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCreatedForm(data);
        setBannerMsg({ type: 'success', text: `Google Form created! Responder URI: ${data.responderUri}` });

        // Save reference to Cloud SQL
        if (currentUser) {
          const idToken = await currentUser.getIdToken();
          await fetch('/api/workspace/items', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              hubId: 'google-forms',
              title: data.title,
              content: `Form ID: ${data.formId}`,
              category: 'forms',
              externalId: data.formId,
              externalUrl: data.responderUri,
            })
          });
          loadCloudSqlItems(idToken);
        }
      } else {
        setBannerMsg({ type: 'error', text: data.error || 'Failed to create Google Form.' });
      }
    } catch (err: any) {
      setBannerMsg({ type: 'error', text: err.message || 'Error communicating with Google Forms API' });
    } finally {
      setCreatingForm(false);
    }
  };

  // Google Tasks Action
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (!accessToken) {
      setBannerMsg({ type: 'error', text: 'Please sign in with Google to sync with Google Tasks.' });
      return;
    }

    try {
      setCreatingTask(true);
      const res = await fetch('/api/google/tasks/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newTaskTitle,
          notes: newTaskNotes
        })
      });
      const data = await res.json();
      if (res.ok && data.task) {
        setTasks([data.task, ...tasks]);
        setNewTaskTitle('');
        setBannerMsg({ type: 'success', text: `Added "${data.task.title}" directly to your Google Tasks!` });

        // Save reference to Cloud SQL
        if (currentUser) {
          const idToken = await currentUser.getIdToken();
          await fetch('/api/workspace/items', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              hubId: 'google-tasks',
              title: data.task.title,
              content: newTaskNotes,
              category: 'tasks',
              externalId: data.task.id,
            })
          });
          loadCloudSqlItems(idToken);
        }
      }
    } catch (err: any) {
      setBannerMsg({ type: 'error', text: err.message || 'Failed to add task.' });
    } finally {
      setCreatingTask(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    if (!accessToken) return;
    try {
      const res = await fetch('/api/google/tasks/complete', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskId, status: 'completed' })
      });
      if (res.ok) {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader
        icon={<Briefcase size={18} />}
        title="Workspace & Cloud SQL"
        subtitle="Enterprise PostgreSQL Topology, Migrations, and Real-time Persistence."
        badge="Cloud SQL"
        breadcrumb="Ecosystem"
      />
      <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 text-gray-900 shadow-sm backdrop-blur-xl">
      {/* Header & Auth Ribbon */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-600 border border-emerald-200 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Cloud SQL (PostgreSQL us-west1)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Google Workspace Suite
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            meUus Workspace & Cloud SQL Hub
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Seamlessly synchronize your strategic roadmaps, video sessions, civic surveys, and action tasks with Google Workspace and Cloud SQL relational persistence.
          </p>
        </div>

        {/* User Auth Controls */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-gray-200/80 border border-gray-300 rounded-2xl p-2 pr-4">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} className="w-9 h-9 rounded-xl object-cover border border-gray-600" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <div className="text-xs font-bold text-gray-900 leading-tight">{currentUser.displayName || 'Authenticated Citizen'}</div>
                <div className="text-[11px] text-gray-500 leading-tight">{currentUser.email}</div>
              </div>
              <button 
                onClick={handleSignOut}
                className="ml-2 p-2 text-gray-500 hover:text-red-400 hover:bg-gray-200/50 rounded-xl transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              disabled={loadingAuth}
              className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/20 transition flex items-center gap-2 text-sm"
            >
              <LogIn className="w-4 h-4" />
              Sign in with Google Workspace
            </button>
          )}
        </div>
      </div>

      {/* Banner message */}
      {bannerMsg && (
        <div className={`mt-4 p-3.5 rounded-2xl text-sm flex items-center gap-2 border ${
          bannerMsg.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
          bannerMsg.type === 'error' ? 'bg-rose-50 border-rose-300 text-rose-800' :
          'bg-gray-100 border-gray-200 text-gray-700'
        }`}>
          {bannerMsg.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {bannerMsg.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
          <span>{bannerMsg.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 pt-6 pb-4 border-b border-gray-200 text-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          Full Overview
        </button>
        <button
          onClick={() => setActiveTab('sheets')}
          className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
            activeTab === 'sheets' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Google Sheets
        </button>
        <button
          onClick={() => setActiveTab('meet')}
          className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
            activeTab === 'meet' ? 'bg-rose-600 text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Video className="w-4 h-4" />
          Google Meet
        </button>
        <button
          onClick={() => setActiveTab('forms')}
          className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
            activeTab === 'forms' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Google Forms
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
            activeTab === 'tasks' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Google Tasks
        </button>
        <button
          onClick={() => setActiveTab('cloudsql')}
          className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
            activeTab === 'cloudsql' ? 'bg-sky-600 text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Database className="w-4 h-4" />
          Cloud SQL Records ({syncedItems.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="pt-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sheets Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-emerald-500/50 shadow-sm transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Google Sheets</h3>
              <p className="text-gray-500 text-xs mt-1 mb-4 leading-relaxed">
                Export 64-district initiatives, metrics, and business models straight into live Google Sheets.
              </p>
              <button
                onClick={() => setActiveTab('sheets')}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-xs border border-emerald-200 transition"
              >
                Open Sheets Tools →
              </button>
            </div>

            {/* Meet Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-rose-500/50 shadow-sm transition">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Google Meet</h3>
              <p className="text-gray-500 text-xs mt-1 mb-4 leading-relaxed">
                Launch instant video rooms for meUus Soul dialogue, legal advice, or youth entrepreneurship circles.
              </p>
              <button
                onClick={() => setActiveTab('meet')}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-xl text-xs border border-rose-200 transition"
              >
                Create Meet Room →
              </button>
            </div>

            {/* Forms Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-purple-500/50 shadow-sm transition">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Google Forms</h3>
              <p className="text-gray-500 text-xs mt-1 mb-4 leading-relaxed">
                Publish civic reflection questionnaires and skill assessments directly to Google Forms.
              </p>
              <button
                onClick={() => setActiveTab('forms')}
                className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-xl text-xs border border-purple-200 transition"
              >
                Create Form →
              </button>
            </div>

            {/* Tasks Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-amber-500/50 shadow-sm transition">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Google Tasks</h3>
              <p className="text-gray-500 text-xs mt-1 mb-4 leading-relaxed">
                Turn meUus action items into Google Tasks synced across all mobile and desktop devices.
              </p>
              <button
                onClick={() => setActiveTab('tasks')}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-xl text-xs border border-amber-200 transition"
              >
                Manage Tasks →
              </button>
            </div>
          </div>
        )}

        {/* SHEETS TAB */}
        {activeTab === 'sheets' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                Create New meUus Spreadsheet
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Generates a live, fully-structured Google Sheet in your personal Google Drive with custom columns for ecosystem tracking.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={sheetTitle}
                  onChange={(e) => setSheetTitle(e.target.value)}
                  placeholder="Spreadsheet Title..."
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleCreateSheet}
                  disabled={creatingSheet}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-xs"
                >
                  {creatingSheet ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {creatingSheet ? 'Creating Sheet...' : 'Create in Google Drive'}
                </button>
              </div>

              {createdSheet && (
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Spreadsheet Ready</div>
                    <div className="text-sm font-semibold text-gray-900 mt-0.5">{createdSheet.title}</div>
                    <div className="text-xs text-gray-500">ID: {createdSheet.spreadsheetId}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReadSheet}
                      disabled={readingSheet}
                      className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg border border-gray-200 transition"
                    >
                      {readingSheet ? 'Reading...' : 'Preview Data'}
                    </button>
                    <a
                      href={createdSheet.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-xs"
                    >
                      Open in Google Sheets
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {sheetReadData && (
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl text-xs font-mono overflow-x-auto">
                  <div className="text-gray-500 mb-2 font-sans font-semibold">Live Google Sheets Values:</div>
                  <pre>{JSON.stringify(sheetReadData.values || [], null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MEET TAB */}
        {activeTab === 'meet' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                <Video className="w-5 h-5 text-rose-500" />
                Generate Google Meet Conference Room
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Provision a Google Meet conference space via Google Meet REST API for instant dialogue, therapy, legal aid, or collaborative brainstorming.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={meetTopic}
                  onChange={(e) => setMeetTopic(e.target.value)}
                  placeholder="Meeting Agenda or Session Name..."
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-rose-500"
                />
                <button
                  onClick={handleCreateMeet}
                  disabled={creatingMeeting}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-xs"
                >
                  {creatingMeeting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                  {creatingMeeting ? 'Creating Space...' : 'Create Instant Meet'}
                </button>
              </div>

              {createdMeeting && (
                <div className="mt-6 p-5 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-rose-600 font-bold uppercase tracking-wider">Active Meeting Space</div>
                    <div className="text-base font-bold text-gray-900 mt-0.5">{meetTopic}</div>
                    <div className="text-xs text-gray-600 font-mono mt-1">{createdMeeting.meetingUri}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(createdMeeting.meetingUri);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl border border-gray-200 transition flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedLink ? 'Copied!' : 'Copy Link'}
                    </button>
                    <a
                      href={createdMeeting.meetingUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-xs"
                    >
                      Join Meeting Now
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FORMS TAB */}
        {activeTab === 'forms' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Google Forms Creator & Survey Publisher
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Build and deploy surveys with automatic questions mapped to meUus 9 Solution Hubs and 3-day action steps.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Form Title..."
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleCreateForm}
                  disabled={creatingForm}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-xs"
                >
                  {creatingForm ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {creatingForm ? 'Creating Form...' : 'Publish Google Form'}
                </button>
              </div>

              {createdForm && (
                <div className="mt-6 p-5 bg-purple-50 border border-purple-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-purple-700 font-bold uppercase tracking-wider">Form Published</div>
                    <div className="text-base font-bold text-gray-900 mt-0.5">{createdForm.title}</div>
                    <div className="text-xs text-gray-500 mt-1">Form ID: {createdForm.formId}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={createdForm.responderUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-xs"
                    >
                      Fill Survey / Share Link
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                <CheckSquare className="w-5 h-5 text-amber-600" />
                Google Tasks Bi-directional Synchronization
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Add actionable commitments to your Google Tasks directly from meUus, staying true to "Consistent, Honest Action Over Perfection".
              </p>

              <form onSubmit={handleCreateTask} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="New Task (e.g. Implement Idea Lab Prototype)..."
                  className="sm:col-span-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={creatingTask || !newTaskTitle.trim()}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {creatingTask ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add to Google Tasks
                </button>
              </form>

              {/* Tasks List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Your Live Google Tasks ({tasks.length})</span>
                  {accessToken && (
                    <button 
                      onClick={() => loadGoogleTasks(accessToken)} 
                      disabled={loadingTasks}
                      className="text-amber-600 hover:underline text-[11px] flex items-center gap-1 font-semibold"
                    >
                      <RefreshCw className={`w-3 h-3 ${loadingTasks ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                  )}
                </div>

                {tasks.length === 0 ? (
                  <div className="p-6 bg-white border border-gray-200 rounded-xl text-center text-gray-500 text-sm">
                    {accessToken ? 'No tasks found in your primary Google Tasks list.' : 'Sign in to fetch your Google Tasks.'}
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl flex items-center justify-between gap-3 transition"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          disabled={task.status === 'completed'}
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                            task.status === 'completed'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                              : 'border-gray-300 hover:border-amber-500 text-transparent'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <div className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {task.title}
                          </div>
                          {task.notes && (
                            <div className="text-xs text-gray-500 mt-0.5">{task.notes}</div>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        task.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* CLOUD SQL TAB */}
        {activeTab === 'cloudsql' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Database className="w-5 h-5 text-sky-600" />
                    Cloud SQL PostgreSQL Relational Storage
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">
                    Managed instance: <code className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">ai-studio-1f6d8234</code> in region <code className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">us-west1</code>
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active & Healthy
                </span>
              </div>

              {/* Synced items list */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  PostgreSQL Workspace Items Table ({syncedItems.length} records)
                </div>

                {syncedItems.length === 0 ? (
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-center text-gray-500 text-sm">
                    No items stored yet. Create a Sheet, Meet space, Form, or Task to log items in Cloud SQL!
                  </div>
                ) : (
                  syncedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-sky-700 border border-gray-200">
                            {item.hubId}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                        </div>
                        {item.content && (
                          <div className="text-xs text-gray-600 mt-1">{item.content}</div>
                        )}
                        <div className="text-[11px] text-gray-400 mt-1 font-mono">
                          Logged: {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {item.externalUrl && (
                        <a
                          href={item.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-white hover:bg-gray-100 text-sky-700 text-xs font-semibold rounded-lg border border-gray-200 transition flex items-center gap-1.5 self-start sm:self-center shadow-2xs"
                        >
                          View External Resource
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
      </div>
    </div>
  );
};
